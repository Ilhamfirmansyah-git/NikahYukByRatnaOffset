import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: params.slug },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    if (!invitation.isPublished) {
      return NextResponse.json({ error: 'Undangan belum dipublikasikan' }, { status: 400 });
    }

    const { name, message, recaptchaToken } = await req.json();

    const captcha = await verifyRecaptcha(recaptchaToken ?? '');
    if (!captcha.success) {
      return NextResponse.json({ error: 'Verifikasi keamanan gagal. Coba lagi.' }, { status: 400 });
    }

    if (!name || !message) {
      return NextResponse.json({ error: 'Nama dan pesan wajib diisi' }, { status: 400 });
    }

    const entry = await prisma.guestbook.create({
      data: {
        invitationId: invitation.id,
        name,
        message,
      },
    });

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (error) {
    console.error('POST /api/u/[slug]/guestbook error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pesan' }, { status: 500 });
  }
}
