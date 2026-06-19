import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DOMAIN_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

async function checkExclusiveAccess(invitationId: string, userId: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { order: true },
  });
  if (!invitation || invitation.userId !== userId) return { ok: false, reason: 'forbidden' as const };

  if (!invitation.order?.packageId) return { ok: false, reason: 'upgrade' as const };

  const pkg = await prisma.package.findUnique({ where: { id: invitation.order.packageId } });
  const features = pkg?.features as Record<string, unknown> | null;
  if (!features || features.customDomain !== true) return { ok: false, reason: 'upgrade' as const };

  return { ok: true, invitation };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      select: { customDomain: true, userId: true },
    });
    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    return NextResponse.json({ customDomain: invitation.customDomain ?? null });
  } catch (error) {
    console.error('GET custom-domain error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const access = await checkExclusiveAccess(params.id, session.user.id);
    if (!access.ok) {
      if (access.reason === 'upgrade') {
        return NextResponse.json(
          { error: 'Fitur custom domain hanya tersedia di paket Exclusive', upgrade: true },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { domain } = await req.json() as { domain: string | null };

    if (domain === null || domain === '') {
      await prisma.invitation.update({
        where: { id: params.id },
        data: { customDomain: null },
      });
      return NextResponse.json({ customDomain: null });
    }

    const cleaned = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');

    if (!DOMAIN_REGEX.test(cleaned)) {
      return NextResponse.json({ error: 'Format domain tidak valid. Contoh: undangan.namakamu.com' }, { status: 400 });
    }

    const existing = await prisma.invitation.findUnique({
      where: { customDomain: cleaned },
      select: { id: true },
    });
    if (existing && existing.id !== params.id) {
      return NextResponse.json({ error: 'Domain ini sudah digunakan oleh undangan lain' }, { status: 409 });
    }

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { customDomain: cleaned },
      select: { customDomain: true },
    });

    return NextResponse.json({ customDomain: updated.customDomain });
  } catch (error) {
    console.error('PUT custom-domain error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan domain' }, { status: 500 });
  }
}
