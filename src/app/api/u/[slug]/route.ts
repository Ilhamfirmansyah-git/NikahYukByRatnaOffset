import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: params.slug },
      include: {
        template: {
          select: { componentKey: true, name: true },
        },
        rsvps: { orderBy: { createdAt: 'desc' } },
        guestbook: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    if (!invitation.isPublished) {
      return NextResponse.json({ error: 'Undangan belum dipublikasikan' }, { status: 404 });
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Undangan telah kadaluarsa' }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('GET /api/u/[slug] error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
