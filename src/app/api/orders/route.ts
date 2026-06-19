import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const body = await req.json();
    const { templateId, packageId, couponCode } = body;

    if (!templateId || !packageId) {
      return NextResponse.json({ error: 'templateId dan packageId wajib diisi' }, { status: 400 });
    }

    const [template, pkg] = await Promise.all([
      prisma.template.findUnique({ where: { id: templateId } }),
      prisma.package.findUnique({
        where: { id: packageId },
        include: { templates: { select: { id: true } } },
      }),
    ]);

    if (!template) return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 404 });
    if (!pkg) return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 });

    // If package restricts templates, validate the chosen template is included
    if (pkg.templates.length > 0 && !pkg.templates.some(t => t.id === templateId)) {
      return NextResponse.json({ error: 'Template tidak tersedia untuk paket ini' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });

    // Validate and apply coupon
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
      if (coupon && coupon.isActive && !(coupon.expiresAt && coupon.expiresAt < new Date()) && !(coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)) {
        if (coupon.discountType === 'PERCENT') {
          discountAmount = Math.round(pkg.price * coupon.discountValue / 100);
        } else {
          discountAmount = Math.min(coupon.discountValue, pkg.price);
        }
        appliedCouponCode = coupon.code;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }

    const finalAmount = Math.max(0, pkg.price - discountAmount);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        templateId: template.id,
        amount: finalAmount,
        discountAmount,
        couponCode: appliedCouponCode,
        status: 'PENDING',
        midtransOrderId: null,
      },
    });

    // Update order with midtrans order id
    await prisma.order.update({
      where: { id: order.id },
      data: { midtransOrderId: order.id },
    });

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY ?? 'dummy-server-key',
      clientKey: process.env.MIDTRANS_CLIENT_KEY ?? 'dummy-client-key',
    });

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: finalAmount,
      },
      customer_details: {
        email: user.email,
        first_name: user.name ?? user.email,
      },
      item_details: [
        {
          id: pkg.id,
          price: finalAmount,
          quantity: 1,
          name: `Paket ${pkg.name} - ${template.name}`,
        },
      ],
    };

    let snapToken = 'dummy-token';
    let redirectUrl = '';

    try {
      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
      redirectUrl = transaction.redirect_url;
    } catch (midtransError) {
      console.warn('Midtrans not configured, using dummy token:', midtransError);
    }

    return NextResponse.json({
      orderId: order.id,
      snapToken,
      redirectUrl,
      clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
    });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
