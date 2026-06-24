'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  tips: 'Tips & Inspirasi',
  tutorial: 'Tutorial',
  template: 'Template',
  islami: 'Islami',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch('/api/admin/blog');
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    await fetchPosts();
    setDeleting(null);
  }

  async function handleTogglePublish(post: BlogPost) {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, isPublished: !post.isPublished }),
    });
    await fetchPosts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} artikel</p>
        </div>
        <Link href="/admin/blog/new" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          + Tulis Artikel Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">Belum ada artikel.</p>
          <Link href="/admin/blog/new" className="text-primary font-semibold hover:underline">Tulis artikel pertama →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Judul</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Tanggal</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 max-w-xs truncate">{post.title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{CATEGORY_LABELS[post.category] ?? post.category}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        post.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {post.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{formatDate(post.publishedAt ?? post.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 sm:gap-2">
                      {post.isPublished && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-primary">
                          Lihat
                        </a>
                      )}
                      <Link href={`/admin/blog/${post.id}/edit`} className="text-xs text-primary hover:underline font-medium">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleting === post.id}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        {deleting === post.id ? '...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
