import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function generateGuestSlug(name: string): string {
  const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const rand = Math.random().toString(36).substring(2, 6);
  return `${base}-${rand}`;
}

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
      include: { order: true },
    });
    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }
    if (invitation.order?.packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: invitation.order.packageId } });
      const features = pkg?.features as Record<string, unknown> | null;
      if (features && features.guestManagement === false) {
        return NextResponse.json({ error: 'Fitur manajemen tamu tidak tersedia di paket Anda', upgrade: true }, { status: 403 });
      }
    }

    const { guests } = await req.json() as { guests: Array<{ name: string; group?: string }> };
    if (!Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ error: 'Data tamu tidak valid' }, { status: 400 });
    }

    const valid = guests.filter(g => typeof g.name === 'string' && g.name.trim().length > 0);
    if (valid.length === 0) {
      return NextResponse.json({ error: 'Tidak ada nama tamu yang valid' }, { status: 400 });
    }

    await prisma.guest.createMany({
      data: valid.map(g => ({
        invitationId: params.id,
        name: g.name.trim(),
        group: g.group?.trim() || null,
        slug: generateGuestSlug(g.name.trim()),
      })),
    });

    return NextResponse.json({ imported: valid.length });
  } catch (error) {
    console.error('POST /api/invitations/[id]/guests/import error:', error);
    return NextResponse.json({ error: 'Gagal mengimpor tamu' }, { status: 500 });
  }
}
