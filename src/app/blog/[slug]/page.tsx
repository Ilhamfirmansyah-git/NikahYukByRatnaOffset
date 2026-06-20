import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://ratnaoffset.com';

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = { tips: 'Tips & Inspirasi', tutorial: 'Tutorial', template: 'Template', islami: 'Islami' };
  return map[cat] ?? cat;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, isPublished: true } });
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDesc || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, isPublished: true } });
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: 'Nikah Yuk by Ratna Offset', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Nikah Yuk by Ratna Offset', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-2">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 pt-6">
            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden border border-cream-200">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {categoryLabel(post.category)}
            </span>
            {post.publishedAt && (
              <span className="text-sm text-gray-400">{formatDate(post.publishedAt)}</span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed border-b border-cream-200 pb-8">
            {post.excerpt}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <div className="bg-cream-50 rounded-3xl border border-cream-200 p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Buat Undangan Anda Sekarang</h2>
            <p className="text-gray-500 mb-6 text-sm">Undangan digital elegan dalam hitungan menit. Mulai gratis, tanpa kartu kredit.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/daftar" className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors text-sm">
                Mulai Gratis
              </Link>
              <Link href="/template" className="inline-flex items-center gap-2 border border-primary text-primary px-7 py-3 rounded-full font-semibold hover:bg-primary/5 transition-colors text-sm">
                Lihat Template
              </Link>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="max-w-3xl mx-auto px-4 pb-12">
          <Link href="/blog" className="text-sm text-primary hover:underline underline-offset-2">
            ← Kembali ke Blog
          </Link>
        </div>
      </div>
    </>
  );
}
