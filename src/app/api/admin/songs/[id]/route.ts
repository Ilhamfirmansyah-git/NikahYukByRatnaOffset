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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const song = await prisma.song.findUnique({ where: { id: params.id } });
    if (!song) return NextResponse.json({ error: 'Lagu tidak ditemukan' }, { status: 404 });

    // Delete from Supabase Storage
    await supabaseAdmin.storage.from('music').remove([song.filename]);

    await prisma.song.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/songs/[id] error:', error);
    return NextResponse.json({ error: 'Gagal menghapus lagu' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { isActive } = await req.json();
    const song = await prisma.song.update({
      where: { id: params.id },
      data: { isActive },
    });
    return NextResponse.json(song);
  } catch (error) {
    console.error('PATCH /api/admin/songs/[id] error:', error);
    return NextResponse.json({ error: 'Gagal mengubah status lagu' }, { status: 500 });
  }
}
