import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { defaultInvitationData } from '@/types/invitation';

// Hanya tersedia di mode development / sandbox
export async function POST() {
  if (process.env.MIDTRANS_IS_PRODUCTION === 'true') {
    return NextResponse.json({ error: 'Tidak tersedia di production' }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
  }

  try {
    // Ambil template dan paket pertama
    const template = await prisma.template.findFirst({ where: { isActive: true } });
    const pkg = await prisma.package.findFirst({ where: { isActive: true } });

    if (!template || !pkg) {
      return NextResponse.json({ error: 'Tidak ada template atau paket' }, { status: 404 });
    }

    // Cek apakah user sudah punya test invitation
    const existing = await prisma.invitation.findFirst({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json({ invitationId: existing.id, slug: existing.slug, alreadyExists: true });
    }

    // Buat order PAID langsung
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        packageId: pkg.id,
        templateId: template.id,
        amount: pkg.price,
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod: 'dev_bypass',
      },
    });

    // Generate slug unik
    const slug = `test-${Math.random().toString(36).slice(2, 10)}`;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pkg.durationDays);

    const invitation = await prisma.invitation.create({
      data: {
        userId: session.user.id,
        templateId: template.id,
        orderId: order.id,
        slug,
        isPublished: false,
        expiresAt,
        data: defaultInvitationData() as object,
      },
    });

    return NextResponse.json({ invitationId: invitation.id, slug: invitation.slug });
  } catch (error) {
    console.error('Dev seed error:', error);
    return NextResponse.json({ error: 'Gagal membuat undangan test' }, { status: 500 });
  }
}
