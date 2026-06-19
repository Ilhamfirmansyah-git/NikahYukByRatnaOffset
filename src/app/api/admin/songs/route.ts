import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const songs = await prisma.song.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(songs);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const category = formData.get('category') as string;
    const file = formData.get('file') as File | null;

    if (!title || !artist || !category || !file) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/m4a', 'audio/x-m4a'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|ogg|wav|aac|m4a)$/i)) {
      return NextResponse.json({ error: 'Format file tidak didukung. Gunakan MP3, OGG, WAV, atau M4A.' }, { status: 400 });
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Ukuran file maksimal 20MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() ?? 'mp3';
    const filename = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from('music')
      .upload(filename, buffer, { contentType: file.type || 'audio/mpeg', upsert: false });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: 'Gagal mengunggah file: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from('music').getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    const song = await prisma.song.create({
      data: { title, artist, category, url: publicUrl, filename },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/songs error:', error);
    return NextResponse.json({ error: 'Gagal menambah lagu' }, { status: 500 });
  }
}
