import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { defaultInvitationData } from '@/types/invitation';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const config = await prisma.previewConfig.findUnique({ where: { id: 'singleton' } });
  const data = config ? config.data : defaultInvitationData();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const data = await req.json();

  const config = await prisma.previewConfig.upsert({
    where: { id: 'singleton' },
    update: { data },
    create: { id: 'singleton', data },
  });

  return NextResponse.json(config.data);
}
