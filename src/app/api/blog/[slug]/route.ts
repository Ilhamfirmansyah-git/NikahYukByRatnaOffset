import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, isPublished: true },
    });
    if (!post) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/blog/[slug] error:', error);
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 });
  }
}
