import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
      include: { templates: { select: { id: true } } },
    });
    return NextResponse.json(
      packages.map(p => ({
        ...p,
        templateIds: p.templates.map(t => t.id),
        templates: undefined,
      }))
    );
  } catch (error) {
    console.error('GET /api/packages error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data paket' }, { status: 500 });
  }
}
