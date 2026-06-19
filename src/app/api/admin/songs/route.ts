import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const body = await req.json();
    const { title, artist, category, url, filename } = body;

    if (!title || !artist || !category || !url || !filename) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    const song = await prisma.song.create({
      data: { title, artist, category, url, filename },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/songs error:', error);
    return NextResponse.json({ error: 'Gagal menambah lagu' }, { status: 500 });
  }
}
