import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Called by Vercel Cron — secured by CRON_SECRET header
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Unpublish all invitations that have passed their expiry date
  const result = await prisma.invitation.updateMany({
    where: {
      expiresAt: { lte: now },
      isPublished: true,
    },
    data: { isPublished: false },
  });

  console.log(`[cron] Unpublished ${result.count} expired invitations at ${now.toISOString()}`);

  return NextResponse.json({ unpublished: result.count, timestamp: now.toISOString() });
}
