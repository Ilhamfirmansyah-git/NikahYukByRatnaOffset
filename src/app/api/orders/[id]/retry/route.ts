import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });

    const order = await prisma.order.findFirst({
      where: { id: params.id, userId },
      include: { user: true },
    });

    if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Pesanan ini sudah tidak bisa dibayar ulang' }, { status: 400 });
    }

    const [pkg, template] = await Promise.all([
      prisma.package.findUnique({ where: { id: order.packageId } }),
      prisma.template.findUnique({ where: { id: order.templateId } }),
    ]);

    // Use a new unique order ID for Midtrans (append timestamp)
    const newMidtransOrderId = `${order.id}-r${Date.now()}`;

    await prisma.order.update({
      where: { id: order.id },
      data: { midtransOrderId: newMidtransOrderId },
    });

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY ?? 'dummy-server-key',
      clientKey: process.env.MIDTRANS_CLIENT_KEY ?? 'dummy-client-key',
    });

    const parameter = {
      transaction_details: {
        order_id: newMidtransOrderId,
        gross_amount: order.amount,
      },
      customer_details: {
        email: order.user.email,
        first_name: order.user.name ?? order.user.email,
      },
      item_details: [
        {
          id: order.packageId,
          price: order.amount,
          quantity: 1,
          name: `Paket ${pkg?.name ?? ''} - ${template?.name ?? ''}`,
        },
      ],
    };

    let snapToken = 'dummy-token';
    try {
      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
    } catch (e) {
      console.warn('Midtrans retry error:', e);
    }

    return NextResponse.json({
      snapToken,
      clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
    });
  } catch (error) {
    console.error('POST /api/orders/[id]/retry error:', error);
    return NextResponse.json({ error: 'Gagal memproses pembayaran ulang' }, { status: 500 });
  }
}
