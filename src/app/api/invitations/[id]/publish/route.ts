import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    if (invitation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    // Check if expired
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Undangan sudah kadaluarsa' }, { status: 400 });
    }

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { isPublished: !invitation.isPublished },
    });

    return NextResponse.json({ isPublished: updated.isPublished });
  } catch (error) {
    console.error('POST /api/invitations/[id]/publish error:', error);
    return NextResponse.json({ error: 'Gagal mengubah status publikasi' }, { status: 500 });
  }
}
