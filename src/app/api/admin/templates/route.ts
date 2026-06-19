import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { invitations: true } } },
  });

  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug, componentKey, category, description, thumbnail, isActive } = body;

  if (!name?.trim() || !slug?.trim() || !componentKey?.trim() || !category?.trim()) {
    return NextResponse.json({ error: 'name, slug, componentKey, dan category wajib diisi' }, { status: 400 });
  }

  const existing = await prisma.template.findUnique({ where: { slug: slug.trim() } });
  if (existing) {
    return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
  }

  const template = await prisma.template.create({
    data: {
      name: name.trim(),
      slug: slug.trim(),
      componentKey: componentKey.trim(),
      category: category.trim(),
      description: description?.trim() || null,
      thumbnail: thumbnail?.trim() || '/templates/placeholder.jpg',
      isActive: isActive !== false,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
