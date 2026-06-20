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

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, category: true, isPublished: true, publishedAt: true, createdAt: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/admin/blog error:', error);
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, isPublished, metaTitle, metaDesc } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Title, slug, excerpt, dan content wajib diisi' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        category: category || 'tips',
        isPublished: Boolean(isPublished),
        publishedAt: isPublished ? new Date() : null,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug sudah digunakan, ganti slug artikel' }, { status: 409 });
    }
    console.error('POST /api/admin/blog error:', error);
    return NextResponse.json({ error: 'Gagal membuat artikel' }, { status: 500 });
  }
}
