import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { InvitationData } from '@/types/invitation';

export const dynamic = 'force-dynamic';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] !== null &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const invitationRaw = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: { template: true, order: true },
    });

    let packageFeatures: Record<string, unknown> | null = null;
    if (invitationRaw?.order?.packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: invitationRaw.order.packageId } });
      packageFeatures = pkg?.features as Record<string, unknown> | null;
    }

    const invitation = invitationRaw ? { ...invitationRaw, packageFeatures } : null;

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    if (invitation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('GET /api/invitations/[id] error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data undangan' }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await req.json() as Partial<InvitationData>;

    const currentData = invitation.data as Record<string, unknown>;
    const updatedData = deepMerge(currentData, body as Record<string, unknown>);

    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: { data: updatedData as object },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/invitations/[id] error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui undangan' }, { status: 500 });
  }
}
