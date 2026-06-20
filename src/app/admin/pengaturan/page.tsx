'use client';

import { useState, useEffect } from 'react';

interface Settings {
  tiktokUrl?: string;
  waUrl?: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({ tiktokUrl: '', waUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: Settings) => {
        setForm({ tiktokUrl: data.tiktokUrl ?? '', waUrl: data.waUrl ?? '' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Gagal');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Situs</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md" />
          <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Situs</h1>
        <p className="text-sm text-gray-500 mt-1">Konfigurasi URL media sosial yang tampil di footer.</p>
      </div>

      <form onSubmit={handleSave} className="max-w-lg space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Media Sosial</h2>

          {/* TikTok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              URL TikTok
            </label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                </svg>
              </div>
              <input
                type="url"
                value={form.tiktokUrl}
                onChange={e => setForm(f => ({ ...f, tiktokUrl: e.target.value }))}
                placeholder="https://tiktok.com/@namaakun"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Kosongkan untuk menyembunyikan ikon TikTok di footer.</p>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              URL WhatsApp
            </label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <input
                type="url"
                value={form.waUrl}
                onChange={e => setForm(f => ({ ...f, waUrl: e.target.value }))}
                placeholder="https://wa.me/6281234567890"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Format: <code className="bg-gray-100 px-1 rounded">https://wa.me/628xxxxxxxxxx</code> (tanpa tanda +).
              Digunakan untuk ikon WA di footer dan link Hubungi Kami.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">✓ Tersimpan</span>
          )}
        </div>
      </form>
    </div>
  );
}
