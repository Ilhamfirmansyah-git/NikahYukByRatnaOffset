import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'tips', label: 'Tips & Inspirasi' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'template', label: 'Template' },
  { value: 'islami', label: 'Islami' },
];

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}

function categoryLabel(cat: string) {
  return CATEGORIES.find(c => c.value === cat)?.label ?? cat;
}

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category && searchParams.category !== 'all' ? searchParams.category : undefined;

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true, ...(category ? { category } : {}) },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, publishedAt: true },
  });

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-white border-b border-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-3">Blog</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tips & Inspirasi Pernikahan</h1>
          <p className="text-gray-500 text-lg">Panduan lengkap membuat undangan pernikahan digital yang elegan dan berkesan.</p>
        </div>
      </section>

      {/* Category filter */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.value}
              href={cat.value === 'all' ? '/blog' : `/blog?category=${cat.value}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                (category ?? 'all') === cat.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-cream-200 hover:border-primary hover:text-primary'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">Belum ada artikel di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {post.coverImage ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center">
                    <span className="text-primary/30 text-5xl font-display font-bold">N</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {categoryLabel(post.category)}
                    </span>
                    {post.publishedAt && (
                      <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                  <span className="mt-4 text-sm font-semibold text-primary group-hover:underline underline-offset-2">
                    Baca selengkapnya →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-cream-200 p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Siap Buat Undangan Digital?</h2>
          <p className="text-gray-500 mb-6">Buat undangan pernikahan online yang elegan dalam hitungan menit.</p>
          <Link href="/daftar" className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Mulai Gratis Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
