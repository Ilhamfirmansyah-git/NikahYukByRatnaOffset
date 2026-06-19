import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;
    if (!user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });

    const { days } = await req.json();
    if (!days || typeof days !== 'number' || days <= 0 || days > 3650) {
      return NextResponse.json({ error: 'Jumlah hari tidak valid' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({ where: { id: params.id } });
    if (!invitation) return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });

    const base = invitation.expiresAt && invitation.expiresAt > new Date()
      ? invitation.expiresAt
      : new Date();

    const newExpiresAt = new Date(base);
    newExpiresAt.setDate(newExpiresAt.getDate() + days);

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { expiresAt: newExpiresAt },
    });

    return NextResponse.json({ expiresAt: updated.expiresAt?.toISOString() });
  } catch (error) {
    console.error('POST /api/invitations/[id]/extend error:', error);
    return NextResponse.json({ error: 'Gagal memperpanjang undangan' }, { status: 500 });
  }
}
