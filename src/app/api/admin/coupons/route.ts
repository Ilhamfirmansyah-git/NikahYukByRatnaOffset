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

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { code, discountType, discountValue, maxUses, expiresAt } = body;

  if (!code || !discountType || discountValue === undefined) {
    return NextResponse.json({ error: 'code, discountType, dan discountValue wajib diisi' }, { status: 400 });
  }

  if (!['PERCENT', 'FIXED'].includes(discountType)) {
    return NextResponse.json({ error: 'discountType harus PERCENT atau FIXED' }, { status: 400 });
  }

  if (discountType === 'PERCENT' && (discountValue <= 0 || discountValue > 100)) {
    return NextResponse.json({ error: 'Diskon persen harus antara 1-100' }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: 'Kode kupon sudah digunakan' }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id wajib diisi' }, { status: 400 });

  await prisma.coupon.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
