import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

  const packages = await prisma.package.findMany({
    orderBy: { price: 'asc' },
    include: { templates: { select: { id: true, name: true } } },
  });

  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, price, durationDays, features, isActive, templateIds } = body;

  if (!name?.trim() || price === undefined || !durationDays) {
    return NextResponse.json({ error: 'name, price, dan durationDays wajib diisi' }, { status: 400 });
  }

  const pkg = await prisma.package.create({
    data: {
      name: name.trim(),
      price: Number(price),
      durationDays: Number(durationDays),
      features: features ?? {
        maxPhotos: 5,
        musik: true,
        livestream: false,
        guestManagement: false,
        customDomain: false,
      },
      isActive: isActive !== false,
      templates: Array.isArray(templateIds) && templateIds.length > 0
        ? { connect: templateIds.map((id: string) => ({ id })) }
        : undefined,
    },
    include: { templates: { select: { id: true, name: true } } },
  });

  return NextResponse.json(pkg, { status: 201 });
}
