'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  slug: string;
  componentKey: string;
  category: string;
  description: string | null;
  thumbnail: string;
  isActive: boolean;
  _count: { invitations: number };
}

const CATEGORIES = ['elegan', 'minimalis', 'islami', 'romantis'];
const CATEGORY_LABELS: Record<string, string> = {
  elegan: 'Elegan',
  minimalis: 'Minimalis',
  islami: 'Islami',
  romantis: 'Romantis',
};

const EMPTY_FORM = {
  name: '',
  slug: '',
  componentKey: '',
  category: 'elegan',
  description: '',
  thumbnail: '',
  isActive: true,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminTemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/templates');
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(t: Template) {
    setEditing(t);
    setForm({
      name: t.name,
      slug: t.slug,
      componentKey: t.componentKey,
      category: t.category,
      description: t.description ?? '',
      thumbnail: t.thumbnail,
      isActive: t.isActive,
    });
    setShowModal(true);
  }

  function handleNameChange(name: string) {
    setForm(f => ({
      ...f,
      name,
      slug: editing ? f.slug : slugify(name),
      componentKey: editing ? f.componentKey : slugify(name),
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim() || !form.componentKey.trim()) {
      toast.error('Nama, slug, dan component key wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/templates/${editing.id}` : '/api/admin/templates';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal menyimpan');
      toast.success(editing ? 'Template diperbarui' : 'Template ditambahkan');
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(t: Template) {
    if (!confirm(`Hapus template "${t.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(t.id);
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Template dihapus');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus');
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleActive(t: Template) {
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, description: t.description ?? '', isActive: !t.isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success(t.isActive ? 'Template dinonaktifkan' : 'Template diaktifkan');
      load();
    } catch {
      toast.error('Gagal mengubah status');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Template</h1>
          <p className="text-sm text-gray-500 mt-1">{templates.length} template terdaftar</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Template
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Template</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Slug / Component Key</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Kategori</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Undangan</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{t.description ?? '-'}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 block mb-1">{t.slug}</code>
                    <code className="text-xs bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 block">{t.componentKey}</code>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 font-medium capitalize">
                      {CATEGORY_LABELS[t.category] ?? t.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-semibold text-gray-700">{t._count.invitations}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(t)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        t.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {t.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/preview/${t.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => openEdit(t)}
                        className="text-xs text-gray-600 hover:text-gray-900 font-medium px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        disabled={deleting === t.id || t._count.invitations > 0}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        title={t._count.invitations > 0 ? 'Tidak bisa dihapus — masih digunakan' : ''}
                      >
                        {deleting === t.id ? '...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">Belum ada template</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Template' : 'Tambah Template Baru'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="cth: Romantis Pink"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="romantis-pink"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Component Key *</label>
                  <input
                    type="text"
                    value={form.componentKey}
                    onChange={e => setForm(f => ({ ...f, componentKey: slugify(e.target.value) }))}
                    placeholder="romantis-pink"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-0.5">Harus cocok dengan key di registry.ts</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Deskripsi singkat template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
                <input
                  type="text"
                  value={form.thumbnail}
                  onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                  placeholder="/templates/romantis-pink.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-gray-700">Aktif (tampil di halaman beli)</span>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
