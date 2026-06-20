import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ALLOWED_KEYS = ['tiktokUrl', 'waUrl'];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });

  const rows = await prisma.siteSetting.findMany({ where: { key: { in: ALLOWED_KEYS } } });
  const result = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });

  const body = await req.json() as Record<string, string>;

  const updates = ALLOWED_KEYS.filter(k => k in body).map(key =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value: body[key] ?? '' },
      create: { key, value: body[key] ?? '' },
    })
  );

  await Promise.all(updates);
  return NextResponse.json({ ok: true });
}
