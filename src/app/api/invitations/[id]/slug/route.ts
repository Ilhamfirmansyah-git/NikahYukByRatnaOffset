import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function toSlugBase(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });
    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { namaPria, namaWanita } = await req.json() as { namaPria: string; namaWanita: string };

    const base = toSlugBase(`${namaPria}-${namaWanita}`);
    if (!base || base.length < 3) {
      return NextResponse.json({ error: 'Nama pengantin belum lengkap' }, { status: 400 });
    }

    let slug = base;
    let attempt = 0;
    while (attempt <= 10) {
      const existing = await prisma.invitation.findUnique({ where: { slug }, select: { id: true } });
      if (!existing || existing.id === params.id) break;
      const rand = Math.random().toString(36).substring(2, 5);
      slug = `${base}-${rand}`;
      attempt++;
    }
    if (attempt > 10) {
      return NextResponse.json({ error: 'Gagal membuat slug unik, coba lagi' }, { status: 500 });
    }

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { slug },
      select: { slug: true },
    });

    return NextResponse.json({ slug: updated.slug });
  } catch (error) {
    console.error('PUT slug error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui link' }, { status: 500 });
  }
}
