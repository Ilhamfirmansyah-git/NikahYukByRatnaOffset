import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ALLOWED_PUBLIC_KEYS = ['tiktokUrl', 'waUrl'];

export async function GET(req: NextRequest) {
  const requested = req.nextUrl.searchParams.get('keys')?.split(',').filter(Boolean) ?? [];
  const keys = requested.filter(k => ALLOWED_PUBLIC_KEYS.includes(k));

  if (keys.length === 0) return NextResponse.json({});

  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    const result = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}
