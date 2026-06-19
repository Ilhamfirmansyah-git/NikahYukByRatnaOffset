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

async function checkAccess(invitationId: string, userId: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { order: true },
  });
  if (!invitation || invitation.userId !== userId) return { ok: false, reason: 'forbidden' as const };

  if (invitation.order?.packageId) {
    const pkg = await prisma.package.findUnique({ where: { id: invitation.order.packageId } });
    const features = pkg?.features as Record<string, unknown> | null;
    if (features && features.guestManagement === false) return { ok: false, reason: 'upgrade' as const };
  }

  return { ok: true };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const access = await checkAccess(params.id, session.user.id);
    if (!access.ok) {
      if (access.reason === 'upgrade') return NextResponse.json({ error: 'Fitur manajemen tamu tidak tersedia di paket Anda', upgrade: true }, { status: 403 });
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const guests = await prisma.guest.findMany({ where: { invitationId: params.id } });
    return NextResponse.json(guests);
  } catch (error) {
    console.error('GET /api/invitations/[id]/guests error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data tamu' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const access = await checkAccess(params.id, session.user.id);
    if (!access.ok) {
      if (access.reason === 'upgrade') return NextResponse.json({ error: 'Fitur manajemen tamu tidak tersedia di paket Anda', upgrade: true }, { status: 403 });
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { name, group } = await req.json();
    if (!name) return NextResponse.json({ error: 'Nama tamu wajib diisi' }, { status: 400 });

    const guest = await prisma.guest.create({
      data: {
        invitationId: params.id,
        name,
        group: group ?? null,
        slug: generateGuestSlug(name),
      },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error('POST /api/invitations/[id]/guests error:', error);
    return NextResponse.json({ error: 'Gagal menambah tamu' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const access = await checkAccess(params.id, session.user.id);
    if (!access.ok) {
      if (access.reason === 'upgrade') return NextResponse.json({ error: 'Fitur manajemen tamu tidak tersedia di paket Anda', upgrade: true }, { status: 403 });
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { guestId } = await req.json();
    await prisma.guest.delete({ where: { id: guestId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/invitations/[id]/guests error:', error);
    return NextResponse.json({ error: 'Gagal menghapus tamu' }, { status: 500 });
  }
}
