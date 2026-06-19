import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const { days } = await req.json();
    if (!days || typeof days !== 'number' || days <= 0 || days > 365) {
      return NextResponse.json({ error: 'Jumlah hari tidak valid (1-365)' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findFirst({
      where: { id: params.id, userId },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    // Extend from current expiresAt or from today if already expired/null
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
