import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get('code')?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: 'Kode kupon wajib diisi' }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: 'Kode kupon tidak valid' }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Kode kupon sudah kadaluarsa' }, { status: 400 });
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Kuota kupon sudah habis' }, { status: 400 });
  }

  return NextResponse.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
}
