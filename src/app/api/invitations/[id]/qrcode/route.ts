import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    if (invitation.userId !== userId) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'https://nikahyuk.id';
    const url = `${baseUrl}/u/${invitation.slug}`;

    const buffer = await QRCode.toBuffer(url, { width: 400, margin: 2 });

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="qrcode-undangan.png"',
      },
    });
  } catch (error) {
    console.error('GET /api/invitations/[id]/qrcode error:', error);
    return NextResponse.json({ error: 'Gagal membuat QR code' }, { status: 500 });
  }
}
