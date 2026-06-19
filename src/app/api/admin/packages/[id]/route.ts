import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, price, durationDays, features, isActive, templateIds } = body;

  if (!name?.trim() || price === undefined || !durationDays) {
    return NextResponse.json({ error: 'name, price, dan durationDays wajib diisi' }, { status: 400 });
  }

  const pkg = await prisma.package.update({
    where: { id: params.id },
    data: {
      name: name.trim(),
      price: Number(price),
      durationDays: Number(durationDays),
      features,
      isActive: Boolean(isActive),
      templates: {
        set: Array.isArray(templateIds)
          ? templateIds.map((id: string) => ({ id }))
          : [],
      },
    },
    include: { templates: { select: { id: true, name: true } } },
  });

  return NextResponse.json(pkg);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const count = await prisma.order.count({ where: { packageId: params.id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Tidak dapat dihapus — ${count} pesanan menggunakan paket ini` },
      { status: 409 }
    );
  }

  await prisma.package.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
