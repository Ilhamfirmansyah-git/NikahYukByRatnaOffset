'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';

const CATEGORIES = [
  { value: 'tips', label: 'Tips & Inspirasi' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'template', label: 'Template' },
  { value: 'islami', label: 'Islami' },
];

interface FormState {
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; category: string;
  isPublished: boolean; metaTitle: string; metaDesc: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormState>({
    title: '', slug: '', excerpt: '', content: '',
    coverImage: '', category: 'tips',
    isPublished: false, metaTitle: '', metaDesc: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          excerpt: data.excerpt ?? '',
          content: data.content ?? '',
          coverImage: data.coverImage ?? '',
          category: data.category ?? 'tips',
          isPublished: data.isPublished ?? false,
          metaTitle: data.metaTitle ?? '',
          metaDesc: data.metaDesc ?? '',
        });
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(publish: boolean) {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, isPublished: publish }),
    });
    if (res.ok) {
      router.push('/admin/blog');
    } else {
      const data = await res.json();
      setError(data.error ?? 'Terjadi kesalahan');
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Memuat artikel...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
        {form.isPublished && (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Published</span>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      <div className="space-y-6">
        {/* Cover image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <ImageUpload
            value={form.coverImage}
            onChange={url => setForm(f => ({ ...f, coverImage: url }))}
            className="h-48"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Judul <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slug URL <span className="text-red-500">*</span></label>
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
            <span className="px-4 py-3 bg-gray-50 text-gray-400 text-sm border-r border-gray-300 whitespace-nowrap">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="flex-1 px-4 py-3 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ringkasan (Excerpt) <span className="text-red-500">*</span></label>
          <textarea
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Konten (Markdown) <span className="text-red-500">*</span></label>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            rows={20}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none font-mono"
          />
        </div>

        {/* SEO */}
        <div className="border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">SEO (Opsional)</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
              placeholder="Default: judul artikel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Meta Description</label>
            <textarea
              value={form.metaDesc}
              onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))}
              rows={2}
              placeholder="Default: excerpt artikel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Simpan sebagai Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : form.isPublished ? 'Simpan & Tetap Published' : 'Simpan & Publikasikan'}
          </button>
        </div>
      </div>
    </div>
  );
}
