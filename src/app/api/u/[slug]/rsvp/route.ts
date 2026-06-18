import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const { name, attendance, guestCount } = await req.json();

    if (!name || !attendance) {
      return NextResponse.json({ error: 'Nama dan kehadiran wajib diisi' }, { status: 400 });
    }

    const validAttendance = ['HADIR', 'TIDAK_HADIR', 'RAGU'];
    if (!validAttendance.includes(attendance)) {
      return NextResponse.json({ error: 'Status kehadiran tidak valid' }, { status: 400 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: invitation.id,
        name,
        attendance,
        guestCount: guestCount ?? 1,
      },
    });

    return NextResponse.json({ ok: true, id: rsvp.id });
  } catch (error) {
    console.error('POST /api/u/[slug]/rsvp error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan RSVP' }, { status: 500 });
  }
}
