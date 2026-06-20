import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      include: {
        packages: {
          where: { isActive: true },
          select: { id: true, name: true },
        },
      },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('GET /api/templates error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data template' }, { status: 500 });
  }
}
