import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== 'ADMIN') return null;
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug, componentKey, category, description, thumbnail, isActive } = body;

  if (!name?.trim() || !slug?.trim() || !componentKey?.trim() || !category?.trim()) {
    return NextResponse.json({ error: 'name, slug, componentKey, dan category wajib diisi' }, { status: 400 });
  }

  const conflict = await prisma.template.findFirst({
    where: { slug: slug.trim(), NOT: { id: params.id } },
  });
  if (conflict) {
    return NextResponse.json({ error: 'Slug sudah digunakan oleh template lain' }, { status: 409 });
  }

  const template = await prisma.template.update({
    where: { id: params.id },
    data: {
      name: name.trim(),
      slug: slug.trim(),
      componentKey: componentKey.trim(),
      category: category.trim(),
      description: description?.trim() || null,
      thumbnail: thumbnail?.trim() || '/templates/placeholder.jpg',
      isActive: Boolean(isActive),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const count = await prisma.invitation.count({ where: { templateId: params.id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Tidak dapat dihapus — ${count} undangan masih menggunakan template ini` },
      { status: 409 }
    );
  }

  await prisma.template.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
