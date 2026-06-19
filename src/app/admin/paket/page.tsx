'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface Features {
  maxPhotos: number;
  musik: boolean;
  livestream: boolean;
  guestManagement: boolean;
  customDomain: boolean;
}

interface TemplateRef {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: Features;
  isActive: boolean;
  templates: TemplateRef[];
}

const EMPTY_FEATURES: Features = {
  maxPhotos: 5,
  musik: true,
  livestream: false,
  guestManagement: false,
  customDomain: false,
};

const EMPTY_FORM = {
  name: '',
  price: '',
  durationDays: '',
  features: EMPTY_FEATURES,
  isActive: true,
  templateIds: [] as string[],
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function CheckIcon({ on }: { on: boolean }) {
  return on ? (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function AdminPaketPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [allTemplates, setAllTemplates] = useState<TemplateRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [pkgRes, tmplRes] = await Promise.all([
      fetch('/api/admin/packages'),
      fetch('/api/admin/templates'),
    ]);
    if (pkgRes.ok) setPackages(await pkgRes.json());
    if (tmplRes.ok) {
      const tmplData = await tmplRes.json();
      setAllTemplates(tmplData.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(p: Package) {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      durationDays: String(p.durationDays),
      features: p.features,
      isActive: p.isActive,
      templateIds: p.templates.map(t => t.id),
    });
    setShowModal(true);
  }

  function setFeature<K extends keyof Features>(key: K, value: Features[K]) {
    setForm(f => ({ ...f, features: { ...f.features, [key]: value } }));
  }

  function toggleTemplate(id: string) {
    setForm(f => ({
      ...f,
      templateIds: f.templateIds.includes(id)
        ? f.templateIds.filter(tid => tid !== id)
        : [...f.templateIds, id],
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.durationDays) {
      toast.error('Nama, harga, dan durasi wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/packages/${editing.id}` : '/api/admin/packages';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          durationDays: Number(form.durationDays),
          features: form.features,
          isActive: form.isActive,
          templateIds: form.templateIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal menyimpan');
      toast.success(editing ? 'Paket diperbarui' : 'Paket ditambahkan');
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Package) {
    if (!confirm(`Hapus paket "${p.name}"?`)) return;
    setDeleting(p.id);
    try {
      const res = await fetch(`/api/admin/packages/${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Paket dihapus');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal menghapus');
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleActive(p: Package) {
    try {
      const res = await fetch(`/api/admin/packages/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, templateIds: p.templates.map(t => t.id), isActive: !p.isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success(p.isActive ? 'Paket dinonaktifkan' : 'Paket diaktifkan');
      load();
    } catch {
      toast.error('Gagal mengubah status');
    }
  }

  const featureLabels: { key: keyof Features; label: string }[] = [
    { key: 'musik', label: 'Musik Latar' },
    { key: 'livestream', label: 'Livestream' },
    { key: 'guestManagement', label: 'Manajemen Tamu' },
    { key: 'customDomain', label: 'Custom Domain' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Paket</h1>
          <p className="text-sm text-gray-500 mt-1">{packages.length} paket terdaftar</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Paket
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map(p => (
            <div
              key={p.id}
              className={`bg-white rounded-xl border-2 p-5 ${p.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{formatRupiah(p.price)}</p>
                  <p className="text-xs text-gray-400">{p.durationDays} hari aktif</p>
                </div>
                <button
                  onClick={() => handleToggleActive(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {p.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Maks. {p.features.maxPhotos} foto
                </div>
                {featureLabels.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon on={Boolean(p.features[key])} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Template count */}
              <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {p.templates.length === 0 ? 'Semua template' : `${p.templates.length} template`}
                  </span>
                  {p.templates.length === 0 ? ' tersedia (tidak dibatasi)' : ' tersedia'}
                </p>
                {p.templates.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {p.templates.map(t => t.name).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 text-sm font-medium py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={deleting === p.id}
                  className="flex-1 text-sm font-medium py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  {deleting === p.id ? '...' : 'Hapus'}
                </button>
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">Belum ada paket</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Paket' : 'Tambah Paket Baru'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="cth: Premium"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="199000"
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (hari) *</label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))}
                    placeholder="180"
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Foto</label>
                <input
                  type="number"
                  value={form.features.maxPhotos}
                  onChange={e => setFeature('maxPhotos', Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitur</label>
                <div className="space-y-2">
                  {featureLabels.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(form.features[key])}
                        onChange={e => setFeature(key, e.target.checked as Features[typeof key])}
                        className="w-4 h-4 accent-gray-900 rounded"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Template selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template yang Tersedia
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Kosongkan = semua template tersedia. Pilih untuk membatasi template di paket ini.
                </p>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {allTemplates.length === 0 ? (
                    <p className="text-xs text-gray-400 p-3">Belum ada template aktif</p>
                  ) : (
                    allTemplates.map(t => (
                      <label key={t.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.templateIds.includes(t.id)}
                          onChange={() => toggleTemplate(t.id)}
                          className="w-4 h-4 accent-gray-900 rounded"
                        />
                        <span className="text-sm text-gray-700">{t.name}</span>
                      </label>
                    ))
                  )}
                </div>
                {form.templateIds.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {form.templateIds.length} template dipilih
                  </p>
                )}
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
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Paket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
