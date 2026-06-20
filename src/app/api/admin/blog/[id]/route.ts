import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/admin/blog/[id] error:', error);
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, isPublished, metaTitle, metaDesc } = body;

    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });

    const wasPublished = existing.isPublished;

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        category: category || 'tips',
        isPublished: Boolean(isPublished),
        publishedAt: isPublished && !wasPublished ? new Date() : existing.publishedAt,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
      },
    });

    return NextResponse.json(post);
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }
    console.error('PUT /api/admin/blog/[id] error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus artikel' }, { status: 500 });
  }
}
