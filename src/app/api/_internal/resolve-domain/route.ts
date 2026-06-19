import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret');
  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const domain = req.nextUrl.searchParams.get('domain');
  if (!domain) {
    return NextResponse.json({ slug: null });
  }

  const invitation = await prisma.invitation.findUnique({
    where: { customDomain: domain },
    select: { slug: true, isPublished: true, expiresAt: true },
  });

  if (!invitation || !invitation.isPublished) {
    return NextResponse.json({ slug: null });
  }

  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    return NextResponse.json({ slug: null });
  }

  return NextResponse.json({ slug: invitation.slug });
}
