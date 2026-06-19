'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string;
  category: string;
  componentKey: string;
}

const CATEGORIES = ['Semua', 'elegan', 'minimalis', 'islami'];

const categoryGradient: Record<string, string> = {
  elegan: 'from-amber-50 to-amber-100',
  minimalis: 'from-rose-50 to-pink-100',
  islami: 'from-emerald-50 to-teal-100',
};

const categoryAccent: Record<string, string> = {
  elegan: 'bg-amber-500',
  minimalis: 'bg-rose-400',
  islami: 'bg-emerald-600',
};

const categoryLabel: Record<string, string> = {
  elegan: 'Elegan',
  minimalis: 'Minimalis',
  islami: 'Islami',
};

function getGradient(category: string) {
  return categoryGradient[category] ?? 'from-primary-50 to-primary-100';
}

function getAccent(category: string) {
  return categoryAccent[category] ?? 'bg-primary';
}

export default function TemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then((data: Template[]) => {
        setTemplates(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setTemplates([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === 'Semua'
      ? templates
      : templates.filter(t => t.category === activeCategory);

  return (
    <>
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <section className="gradient-warm py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Galeri Template
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Pilih template yang mencerminkan kepribadian Anda. Semua template dapat dikustomisasi sepenuhnya.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="sticky top-16 z-30 bg-white border-b border-cream-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-cream-100 text-gray-600 hover:bg-cream-200'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua' : (categoryLabel[cat] ?? cat)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Menampilkan {filtered.length} template
                {activeCategory !== 'Semua' && ` dalam kategori "${categoryLabel[activeCategory] ?? activeCategory}"`}
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">
                    Template tidak ditemukan
                  </h3>
                  <p className="text-gray-500">Coba pilih kategori lain.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(template => (
                    <div
                      key={template.id}
                      className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Thumbnail */}
                      <div className={`relative h-52 bg-gradient-to-br ${getGradient(template.category)} flex items-center justify-center overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-current" />
                          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 border-current" />
                        </div>
                        <div className="text-center z-10">
                          <div className={`w-14 h-14 ${getAccent(template.category)} rounded-full mx-auto mb-3 flex items-center justify-center shadow-md`}>
                            <span className="text-white font-display font-bold text-xl">
                              {template.name[0]}
                            </span>
                          </div>
                          <p className="font-display font-semibold text-gray-800 text-sm">
                            Siti &amp; Ahmad
                          </p>
                          <p className="text-xs text-gray-500">14 Februari 2026</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                              {categoryLabel[template.category] ?? template.category}
                            </span>
                          </div>
                        </div>

                        {template.description && (
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {template.description}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <a
                            href={`/preview/${template.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Lihat Preview
                          </a>
                          <Link
                            href="/app/beli"
                            className="flex-1 flex items-center justify-center text-sm font-medium px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors"
                          >
                            Pilih Template Ini
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Tidak Menemukan yang Cocok?
            </h2>
            <p className="text-primary-100 mb-6">
              Kami bisa membuat desain custom sesuai keinginan Anda. Hubungi tim kami sekarang.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-cream-100 transition-colors"
              >
                Request Desain Custom
              </a>
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
