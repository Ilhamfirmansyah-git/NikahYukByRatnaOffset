import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';
import { emptyInvitationData } from '@/types/invitation';
import { sendOrderConfirmation } from '@/lib/email';

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'inv-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const hash = createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex');
  return hash === signatureKey;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? '';
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    if (!serverKey) {
      if (isProduction) {
        return NextResponse.json({ error: 'Server tidak terkonfigurasi' }, { status: 500 });
      }
      // Dev only: log warning, still reject without explicit test flag
      console.warn('[WEBHOOK] MIDTRANS_SERVER_KEY tidak diset — tolak webhook di dev mode');
      return NextResponse.json({ error: 'Server key belum dikonfigurasi' }, { status: 403 });
    }

    const isValid = verifySignature(order_id, status_code, gross_amount, serverKey, signature_key);
    if (!isValid) {
      return NextResponse.json({ error: 'Signature tidak valid' }, { status: 403 });
    }

    const order = await prisma.order.findFirst({
      where: { midtransOrderId: order_id },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      // Update order to PAID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paymentMethod: payment_type,
        },
      });

      // Get package for durationDays
      const pkg = await prisma.package.findUnique({ where: { id: order.packageId } });
      const durationDays = pkg?.durationDays ?? 90;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      // Check if invitation already exists for this order
      const existingInvitation = await prisma.invitation.findUnique({
        where: { orderId: order.id },
      });

      if (!existingInvitation) {
        // Generate unique slug
        let slug = generateSlug();
        let slugExists = true;
        while (slugExists) {
          const existing = await prisma.invitation.findUnique({ where: { slug } });
          if (!existing) {
            slugExists = false;
          } else {
            slug = generateSlug();
          }
        }

        const invitation = await prisma.invitation.create({
          data: {
            userId: order.userId,
            templateId: order.templateId,
            orderId: order.id,
            slug,
            data: emptyInvitationData() as object,
            expiresAt,
            isPublished: false,
          },
          include: { template: true },
        });

        // Send order confirmation email
        const baseUrl = process.env.NEXTAUTH_URL ?? 'https://nikahyuk.id';
        sendOrderConfirmation({
          to: order.user.email,
          name: order.user.name ?? order.user.email,
          packageName: pkg?.name ?? 'Paket',
          templateName: invitation.template.name,
          amount: order.amount,
          orderId: order.id,
          invitationUrl: `${baseUrl}/app/undangan/${invitation.id}/edit`,
        }).catch(err => console.error('Email error:', err));
      }
    } else if (transaction_status === 'expire') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'EXPIRED' },
      });
    } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/payment/webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
