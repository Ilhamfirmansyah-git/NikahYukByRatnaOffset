'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import type { InvitationData, Acara, LoveStoryItem, RekeningItem, EWalletItem } from '@/types/invitation';
import MusicPicker from './MusicPicker';

const TABS = [
  { id: 'mempelai', label: 'Mempelai', shortLabel: 'Mempelai' },
  { id: 'acara', label: 'Acara', shortLabel: 'Acara' },
  { id: 'galeri', label: 'Galeri & Musik', shortLabel: 'Galeri' },
  { id: 'lovestory', label: 'Kisah & Quote', shortLabel: 'Kisah' },
  { id: 'amplop', label: 'Amplop Digital', shortLabel: 'Amplop' },
  { id: 'pengaturan', label: 'Pengaturan', shortLabel: 'Setelan' },
];

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <div>
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-5 mb-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder, description }: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  description?: string;
}) {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm resize-none bg-gray-50 focus:bg-white"
      />
    </div>
  );
}

export default function EditInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState('mempelai');
  const [data, setData] = useState<InvitationData | null>(null);
  const [invitation, setInvitation] = useState<{ slug: string; isPublished: boolean; expiresAt: string | null; customDomain: string | null } | null>(null);
  const [packageFeatures, setPackageFeatures] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [savingDomain, setSavingDomain] = useState(false);
  const [regeneratingSlug, setRegeneratingSlug] = useState(false);

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'ratnaoffset.com';

  useEffect(() => {
    fetch(`/api/invitations/${id}`)
      .then(r => r.json())
      .then(inv => {
        setData(inv.data as InvitationData);
        setInvitation({ slug: inv.slug, isPublished: inv.isPublished, expiresAt: inv.expiresAt, customDomain: inv.customDomain ?? null });
        setPackageFeatures((inv.packageFeatures as Record<string, unknown>) ?? null);
        setCustomDomainInput(inv.customDomain ?? '');
        setLoading(false);
      })
      .catch(() => {
        toast.error('Gagal memuat undangan');
        router.push('/app');
      });
  }, [id, router]);

  const updateData = useCallback(<K extends keyof InvitationData>(key: K, value: InvitationData[K]) => {
    setData(prev => prev ? { ...prev, [key]: value } : prev);
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      toast.success('Perubahan berhasil disimpan!');
    } catch {
      toast.error('Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/invitations/${id}/publish`, { method: 'POST' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Gagal');
      setInvitation(prev => prev ? { ...prev, isPublished: result.isPublished } : prev);
      toast.success(result.isPublished ? 'Undangan dipublikasikan!' : 'Undangan disembunyikan');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal mengubah status');
    } finally {
      setPublishing(false);
    }
  }

  function getInvitationUrl() {
    if (!invitation) return '';
    if (invitation.customDomain) return `https://${invitation.customDomain}.${appDomain}`;
    return `${window.location.origin}/u/${invitation.slug}`;
  }

  function copyLink() {
    if (!invitation) return;
    navigator.clipboard.writeText(getInvitationUrl());
    toast.success('Link berhasil disalin!');
  }

  async function handleGenerateSlugFromNames() {
    if (!data) return;
    const namaPria = data.mempelai.pria.namaPanggilan || data.mempelai.pria.namaLengkap;
    const namaWanita = data.mempelai.wanita.namaPanggilan || data.mempelai.wanita.namaLengkap;
    if (!namaPria || !namaWanita) {
      toast.error('Isi nama panggilan kedua pengantin terlebih dahulu');
      return;
    }
    setRegeneratingSlug(true);
    try {
      const res = await fetch(`/api/invitations/${id}/slug`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaPria, namaWanita }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Gagal');
      setInvitation(prev => prev ? { ...prev, slug: result.slug } : prev);
      toast.success('Link berhasil diperbarui!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal memperbarui link');
    } finally {
      setRegeneratingSlug(false);
    }
  }

  async function handleSaveDomain() {
    setSavingDomain(true);
    try {
      const res = await fetch(`/api/invitations/${id}/custom-domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix: customDomainInput.trim() || null }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Gagal menyimpan subdomain');
      setInvitation(prev => prev ? { ...prev, customDomain: result.customDomain } : prev);
      setCustomDomainInput(result.customDomain ?? '');
      toast.success(result.customDomain ? `Subdomain aktif: ${result.customDomain}.${appDomain}` : 'Subdomain dihapus');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal menyimpan subdomain');
    } finally {
      setSavingDomain(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        <p className="text-sm text-gray-400">Memuat undangan...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {/* Sticky header — top-14 on mobile to clear the app top bar, top-0 on desktop */}
      <div className="sticky top-14 md:top-0 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-white/95 backdrop-blur-sm border-b border-cream-200 mb-6">
        <div className="flex items-center gap-3 max-w-5xl">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-display font-semibold text-gray-900 leading-tight">Edit Undangan</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {invitation?.isPublished ? (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Aktif
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Draft
                </span>
              )}
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400 font-mono truncate">
                {invitation?.customDomain ? `${invitation.customDomain}.${appDomain}` : `/u/${invitation?.slug}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {invitation?.isPublished && (
              <a
                href={invitation.customDomain ? `https://${invitation.customDomain}.${appDomain}` : `/u/${invitation.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-cream-50 transition-colors"
                title="Lihat undangan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <Button variant="outline" size="sm" onClick={handlePublish} loading={publishing}>
              {invitation?.isPublished ? 'Sembunyikan' : 'Publikasikan'}
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              Simpan
            </Button>
          </div>
        </div>
      </div>

      {/* Quick links bar */}
      {invitation?.isPublished && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-green-700 flex-1 min-w-0">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Undangan aktif</span>
            <span className="text-green-500 font-mono text-xs truncate">
              {invitation.customDomain ? `${invitation.customDomain}.${appDomain}` : `/u/${invitation.slug}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="text-xs text-green-700 font-medium px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
            >
              Salin Link
            </button>
            <a
              href={invitation.customDomain ? `https://${invitation.customDomain}.${appDomain}` : `/u/${invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-700 font-medium px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
            >
              Lihat →
            </a>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div className="relative mb-6">
        <div className="flex gap-1 bg-white border border-cream-200 rounded-2xl p-1 overflow-x-auto scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-cream-50'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
        {/* Right fade hint for scroll */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream-50 to-transparent pointer-events-none rounded-r-2xl sm:hidden" />
      </div>

      {/* Tab 1: Mempelai */}
      {activeTab === 'mempelai' && (
        <div>
          <SectionCard title="Data Mempelai Pria" description="Informasi lengkap tentang pengantin pria">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nama Lengkap" value={data.mempelai.pria.namaLengkap ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, namaLengkap: e.target.value } })} placeholder="Muhammad Budi Santoso" />
              <Input label="Nama Panggilan" value={data.mempelai.pria.namaPanggilan ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, namaPanggilan: e.target.value } })} placeholder="Budi" />
              <Input label="Anak Ke-" value={data.mempelai.pria.anakKe ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, anakKe: e.target.value } })} placeholder="1" />
              <Input label="Nama Ayah" value={data.mempelai.pria.ayah ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, ayah: e.target.value } })} placeholder="Bapak Santoso" />
              <Input label="Nama Ibu" value={data.mempelai.pria.ibu ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, ibu: e.target.value } })} placeholder="Ibu Sari" />
              <Input label="Instagram" value={data.mempelai.pria.instagram ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, instagram: e.target.value } })} placeholder="@budisantoso" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Mempelai Pria</label>
              <ImageUpload
                value={data.mempelai.pria.foto ?? ''}
                onChange={url => updateData('mempelai', { ...data.mempelai, pria: { ...data.mempelai.pria, foto: url } })}
              />
            </div>
          </SectionCard>

          <SectionCard title="Data Mempelai Wanita" description="Informasi lengkap tentang pengantin wanita">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nama Lengkap" value={data.mempelai.wanita.namaLengkap ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, namaLengkap: e.target.value } })} placeholder="Siti Nurhaliza" />
              <Input label="Nama Panggilan" value={data.mempelai.wanita.namaPanggilan ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, namaPanggilan: e.target.value } })} placeholder="Siti" />
              <Input label="Anak Ke-" value={data.mempelai.wanita.anakKe ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, anakKe: e.target.value } })} placeholder="2" />
              <Input label="Nama Ayah" value={data.mempelai.wanita.ayah ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, ayah: e.target.value } })} placeholder="Bapak Nurdin" />
              <Input label="Nama Ibu" value={data.mempelai.wanita.ibu ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, ibu: e.target.value } })} placeholder="Ibu Halimah" />
              <Input label="Instagram" value={data.mempelai.wanita.instagram ?? ''} onChange={e => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, instagram: e.target.value } })} placeholder="@sitinurhaliza" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Mempelai Wanita</label>
              <ImageUpload
                value={data.mempelai.wanita.foto ?? ''}
                onChange={url => updateData('mempelai', { ...data.mempelai, wanita: { ...data.mempelai.wanita, foto: url } })}
              />
            </div>
          </SectionCard>

          <SectionCard title="Urutan Tampil" description="Pilih siapa yang tampil lebih dulu di undangan">
            <div className="flex gap-6">
              {(['pria-dulu', 'wanita-dulu'] as const).map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urutanTampil"
                    value={opt}
                    checked={data.mempelai.urutanTampil === opt}
                    onChange={() => updateData('mempelai', { ...data.mempelai, urutanTampil: opt })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{opt === 'pria-dulu' ? 'Pria dahulu' : 'Wanita dahulu'}</span>
                </label>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Tab 2: Acara */}
      {activeTab === 'acara' && (
        <div>
          {data.acara.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Belum ada acara. Tambahkan acara di bawah.
            </div>
          )}
          {data.acara.map((acara, i) => (
            <SectionCard key={i} title={`Acara ${i + 1}${acara.nama ? ` — ${acara.nama}` : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Nama Acara" value={acara.nama} onChange={e => { const a = [...data.acara]; a[i] = { ...a[i], nama: e.target.value }; updateData('acara', a); }} placeholder="Akad Nikah" />
                <Input type="date" label="Tanggal" value={acara.tanggal} onChange={e => { const a = [...data.acara]; a[i] = { ...a[i], tanggal: e.target.value }; updateData('acara', a); }} />
                <Input type="time" label="Waktu Mulai" value={acara.waktuMulai} onChange={e => { const a = [...data.acara]; a[i] = { ...a[i], waktuMulai: e.target.value }; updateData('acara', a); }} />
                <Input type="time" label="Waktu Selesai" value={acara.waktuSelesai} onChange={e => { const a = [...data.acara]; a[i] = { ...a[i], waktuSelesai: e.target.value }; updateData('acara', a); }} />
                <Input label="Nama Lokasi" value={acara.lokasi} onChange={e => { const a = [...data.acara]; a[i] = { ...a[i], lokasi: e.target.value }; updateData('acara', a); }} placeholder="Masjid Al-Hikmah" />
                <Input label="URL Google Maps" value={acara.mapsUrl ?? ''} onChange={e => { const a = [...data.acara]; a[i] = { ...a[i], mapsUrl: e.target.value }; updateData('acara', a); }} placeholder="https://maps.google.com/..." />
              </div>
              <div className="mb-4">
                <TextArea label="Alamat Lengkap" value={acara.alamat} onChange={v => { const a = [...data.acara]; a[i] = { ...a[i], alamat: v }; updateData('acara', a); }} placeholder="Jl. Contoh No. 123, Jakarta Selatan" />
              </div>
              <Button variant="danger" size="sm" onClick={() => updateData('acara', data.acara.filter((_, j) => j !== i))}>
                Hapus Acara Ini
              </Button>
            </SectionCard>
          ))}
          <button
            onClick={() => updateData('acara', [...data.acara, { nama: '', tanggal: '', waktuMulai: '', waktuSelesai: '', lokasi: '', alamat: '', mapsUrl: '' } as Acara])}
            className="w-full py-4 border-2 border-dashed border-cream-300 rounded-2xl text-primary hover:border-primary hover:bg-cream-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Acara
          </button>
        </div>
      )}

      {/* Tab 3: Galeri & Musik */}
      {activeTab === 'galeri' && (
        <div>
          <SectionCard title="Galeri Foto" description="Tambah foto-foto indah untuk ditampilkan di undangan">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
              {data.galeri.map((url, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover rounded-xl border border-cream-200" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; }} />
                  <button
                    onClick={() => updateData('galeri', data.galeri.filter((_, j) => j !== i))}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs shadow-md"
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
                </div>
              ))}
              <div className="aspect-square">
                <ImageUpload
                  value=""
                  onChange={url => { if (url) updateData('galeri', [...data.galeri, url]); }}
                  className="h-full"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">Hover foto lalu klik × untuk menghapus.</p>
          </SectionCard>

          <SectionCard title="Musik Latar" description="Pilih musik yang diputar saat tamu membuka undangan">
            <MusicPicker value={data.musik} onChange={v => updateData('musik', v)} />
          </SectionCard>
        </div>
      )}

      {/* Tab 4: Kisah & Quote */}
      {activeTab === 'lovestory' && (
        <div>
          <SectionCard title="Love Story" description="Ceritakan perjalanan cinta kalian">
            {data.loveStory.map((item, i) => (
              <div key={i} className="mb-4 p-4 bg-cream-50 rounded-xl border border-cream-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <Input label="Tahun" value={item.tahun} onChange={e => { const l = [...data.loveStory]; l[i] = { ...l[i], tahun: e.target.value }; updateData('loveStory', l); }} placeholder="2020" />
                  <Input label="Judul" value={item.judul} onChange={e => { const l = [...data.loveStory]; l[i] = { ...l[i], judul: e.target.value }; updateData('loveStory', l); }} placeholder="Pertama Kali Bertemu" />
                </div>
                <TextArea label="Cerita" value={item.cerita} onChange={v => { const l = [...data.loveStory]; l[i] = { ...l[i], cerita: v }; updateData('loveStory', l); }} placeholder="Cerita singkat tentang momen ini..." />
                <button
                  onClick={() => updateData('loveStory', data.loveStory.filter((_, j) => j !== i))}
                  className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Hapus cerita ini
                </button>
              </div>
            ))}
            <button
              onClick={() => updateData('loveStory', [...data.loveStory, { tahun: '', judul: '', cerita: '' } as LoveStoryItem])}
              className="w-full py-4 border-2 border-dashed border-cream-300 rounded-2xl text-primary hover:border-primary hover:bg-cream-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Cerita
            </button>
          </SectionCard>

          <SectionCard title="Kutipan" description="Ayat atau kata-kata yang ingin ditampilkan di undangan">
            <div className="space-y-4">
              <TextArea label="Teks Kutipan" value={data.quote.teks ?? ''} onChange={v => updateData('quote', { ...data.quote, teks: v })} placeholder="Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri..." rows={4} />
              <Input label="Sumber" value={data.quote.sumber ?? ''} onChange={e => updateData('quote', { ...data.quote, sumber: e.target.value })} placeholder="QS. Ar-Rum: 21" />
            </div>
          </SectionCard>
        </div>
      )}

      {/* Tab 5: Amplop Digital */}
      {activeTab === 'amplop' && (
        <div>
          <SectionCard title="Amplop Digital">
            <div className="mb-6">
              <Toggle
                checked={data.amplopDigital.aktif}
                onChange={v => updateData('amplopDigital', { ...data.amplopDigital, aktif: v })}
                label="Aktifkan fitur amplop digital"
                description="Tamu dapat mengirim hadiah melalui transfer bank atau e-wallet"
              />
            </div>

            {data.amplopDigital.aktif && (
              <>
                <div className="mb-5">
                  <Input
                    label="Alamat Pengiriman Kado Fisik (opsional)"
                    value={data.amplopDigital.alamatKado ?? ''}
                    onChange={e => updateData('amplopDigital', { ...data.amplopDigital, alamatKado: e.target.value })}
                    placeholder="Jl. Contoh No. 123, Jakarta"
                  />
                </div>

                <div className="mb-5">
                  <h4 className="font-semibold text-gray-800 mb-3">Rekening Bank</h4>
                  {data.amplopDigital.rekening.map((rek, i) => (
                    <div key={i} className="p-4 bg-cream-50 rounded-xl border border-cream-200 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input label="Nama Bank" value={rek.bank} onChange={e => { const r = [...data.amplopDigital.rekening]; r[i] = { ...r[i], bank: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, rekening: r }); }} placeholder="BCA" />
                        <Input label="Nomor Rekening" value={rek.nomor} onChange={e => { const r = [...data.amplopDigital.rekening]; r[i] = { ...r[i], nomor: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, rekening: r }); }} placeholder="1234567890" />
                        <Input label="Atas Nama" value={rek.atasNama} onChange={e => { const r = [...data.amplopDigital.rekening]; r[i] = { ...r[i], atasNama: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, rekening: r }); }} placeholder="Muhammad Budi" />
                      </div>
                      <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, rekening: data.amplopDigital.rekening.filter((_, j) => j !== i) })} className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">Hapus</button>
                    </div>
                  ))}
                  <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, rekening: [...data.amplopDigital.rekening, { bank: '', nomor: '', atasNama: '' } as RekeningItem] })} className="w-full py-3 border-2 border-dashed border-cream-300 rounded-xl text-primary hover:border-primary text-sm font-medium transition-colors">
                    + Tambah Rekening
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">E-Wallet</h4>
                  {data.amplopDigital.eWallet.map((ew, i) => (
                    <div key={i} className="p-4 bg-cream-50 rounded-xl border border-cream-200 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input label="Jenis E-Wallet" value={ew.jenis} onChange={e => { const w = [...data.amplopDigital.eWallet]; w[i] = { ...w[i], jenis: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, eWallet: w }); }} placeholder="GoPay / OVO / Dana" />
                        <Input label="Nomor" value={ew.nomor} onChange={e => { const w = [...data.amplopDigital.eWallet]; w[i] = { ...w[i], nomor: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, eWallet: w }); }} placeholder="0812345678" />
                        <Input label="URL QR Code (opsional)" value={ew.qrUrl ?? ''} onChange={e => { const w = [...data.amplopDigital.eWallet]; w[i] = { ...w[i], qrUrl: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, eWallet: w }); }} placeholder="https://..." />
                      </div>
                      <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, eWallet: data.amplopDigital.eWallet.filter((_, j) => j !== i) })} className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">Hapus</button>
                    </div>
                  ))}
                  <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, eWallet: [...data.amplopDigital.eWallet, { jenis: '', nomor: '', qrUrl: '' } as EWalletItem] })} className="w-full py-3 border-2 border-dashed border-cream-300 rounded-xl text-primary hover:border-primary text-sm font-medium transition-colors">
                    + Tambah E-Wallet
                  </button>
                </div>
              </>
            )}
          </SectionCard>
        </div>
      )}

      {/* Tab 6: Pengaturan */}
      {activeTab === 'pengaturan' && (
        <div>
          <SectionCard title="Fitur Undangan" description="Aktifkan atau nonaktifkan fitur yang ditampilkan kepada tamu">
            <div className="divide-y divide-cream-100">
              <div className="pb-4">
                <Toggle
                  checked={data.rsvpAktif}
                  onChange={v => updateData('rsvpAktif', v)}
                  label="RSVP — Konfirmasi Kehadiran"
                  description="Tamu dapat mengkonfirmasi apakah mereka akan hadir"
                />
              </div>
              <div className="py-4">
                <Toggle
                  checked={data.guestbookAktif}
                  onChange={v => updateData('guestbookAktif', v)}
                  label="Buku Tamu — Ucapan & Doa"
                  description="Tamu dapat menuliskan ucapan dan doa untuk pasangan"
                />
              </div>
              <div className="py-4">
                <Toggle
                  checked={data.livestream.aktif}
                  onChange={v => updateData('livestream', { ...data.livestream, aktif: v })}
                  label="Livestream — Siarkan Acara Online"
                  description="Tamu yang tidak hadir dapat menyaksikan acara secara langsung"
                />
                {data.livestream.aktif && (
                  <div className="mt-4 space-y-3 pl-14">
                    <Input label="Platform" value={data.livestream.platform ?? ''} onChange={e => updateData('livestream', { ...data.livestream, platform: e.target.value })} placeholder="YouTube / Zoom / dll" />
                    <Input label="URL Livestream" value={data.livestream.url ?? ''} onChange={e => updateData('livestream', { ...data.livestream, url: e.target.value })} placeholder="https://youtube.com/live/..." />
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Toggle
                  checked={data.protokolKesehatan.aktif}
                  onChange={v => updateData('protokolKesehatan', { ...data.protokolKesehatan, aktif: v })}
                  label="Protokol Kesehatan"
                  description="Tampilkan panduan kesehatan untuk para tamu"
                />
                {data.protokolKesehatan.aktif && (
                  <div className="mt-4 pl-14">
                    <TextArea value={data.protokolKesehatan.catatan ?? ''} onChange={v => updateData('protokolKesehatan', { ...data.protokolKesehatan, catatan: v })} placeholder="Harap memakai masker, menjaga jarak, dan membawa hand sanitizer..." />
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Masa Berlaku" description="Durasi aktif undangan sesuai paket yang dibeli">
            {(() => {
              if (!invitation?.expiresAt) {
                return (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Masa berlaku belum ditetapkan</p>
                  </div>
                );
              }
              const expiresAt = new Date(invitation.expiresAt);
              const now = new Date();
              const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpired = daysLeft <= 0;
              const isWarning = !isExpired && daysLeft <= 14;
              const isOk = !isExpired && !isWarning;

              return (
                <div className="space-y-3">
                  <div className={`p-4 rounded-xl border ${
                    isExpired ? 'bg-red-50 border-red-200' :
                    isWarning ? 'bg-amber-50 border-amber-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-xs font-medium mb-0.5 ${
                          isExpired ? 'text-red-500' : isWarning ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {isExpired ? 'Kadaluarsa' : isWarning ? 'Segera kadaluarsa' : 'Aktif hingga'}
                        </p>
                        <p className={`text-base font-semibold ${
                          isExpired ? 'text-red-700' : isWarning ? 'text-amber-800' : 'text-green-800'
                        }`}>
                          {expiresAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className={`flex-shrink-0 text-center px-3 py-1.5 rounded-lg ${
                        isExpired ? 'bg-red-100' : isWarning ? 'bg-amber-100' : 'bg-green-100'
                      }`}>
                        <p className={`text-xl font-bold leading-none ${
                          isExpired ? 'text-red-600' : isWarning ? 'text-amber-700' : 'text-green-700'
                        }`}>
                          {isExpired ? Math.abs(daysLeft) : daysLeft}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          isExpired ? 'text-red-500' : isWarning ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {isExpired ? 'hari lalu' : 'hari lagi'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(isExpired || isWarning) && (
                    <div className="flex items-start gap-3 p-3 bg-cream-50 border border-cream-200 rounded-xl">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-700 font-medium">
                          {isExpired ? 'Undangan sudah tidak aktif' : 'Undangan hampir kadaluarsa'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Hubungi admin untuk memperpanjang masa berlaku undangan Anda.
                        </p>
                      </div>
                    </div>
                  )}

                  {isOk && (
                    <p className="text-xs text-gray-400 text-center">
                      Masa berlaku ditentukan oleh paket yang Anda beli. Hubungi admin untuk perpanjangan.
                    </p>
                  )}
                </div>
              );
            })()}
          </SectionCard>

          <SectionCard title="Link Undangan">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">URL Undangan</label>
                  {invitation?.customDomain && (
                    <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      Subdomain aktif
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 px-4 py-2.5 border rounded-xl text-sm font-mono truncate ${
                    invitation?.customDomain
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}>
                    {getInvitationUrl()}
                  </div>
                  <Button size="sm" variant="outline" onClick={copyLink}>
                    Salin
                  </Button>
                </div>
              </div>

              {/* Non-exclusive: button to generate slug from couple names */}
              {packageFeatures?.customDomain !== true && (
                <div className="flex items-center gap-3 p-3 bg-cream-50 border border-cream-200 rounded-xl">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">Buat link dari nama pengantin</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Contoh: <span className="font-mono">budi-siti</span> → <span className="font-mono">/u/budi-siti</span>
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleGenerateSlugFromNames} loading={regeneratingSlug}>
                    Perbarui
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant={invitation?.isPublished ? 'danger' : 'primary'}
                  onClick={handlePublish}
                  loading={publishing}
                >
                  {invitation?.isPublished ? 'Sembunyikan Undangan' : 'Publikasikan Undangan'}
                </Button>
                {invitation?.isPublished && (
                  <a
                    href={getInvitationUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                  >
                    Lihat Undangan
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="QR Code Undangan" description="Download QR code untuk dicetak atau dibagikan">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 p-3 bg-white border border-cream-200 rounded-xl shadow-sm">
                <img
                  src={`/api/invitations/${id}/qrcode`}
                  alt="QR Code"
                  className="w-28 h-28"
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Tamu scan QR code ini untuk membuka undangan langsung di ponsel mereka.</p>
                <a
                  href={`/api/invitations/${id}/qrcode`}
                  download="qrcode-undangan.png"
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-600 transition-colors shadow-sm shadow-primary/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </a>
                <p className="text-xs text-gray-400">Format PNG, 400×400px</p>
              </div>
            </div>
          </SectionCard>

          {/* Subdomain — only for Exclusive users */}
          {packageFeatures?.customDomain === true ? (
            <SectionCard title="Link Eksklusif (Subdomain)" description="Dapatkan link undangan dengan nama Anda sendiri tanpa beli domain">
              <div className="space-y-4">
                {invitation?.customDomain && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-800 font-mono font-medium">
                      {invitation.customDomain}.{appDomain}
                    </span>
                    <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Aktif</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama subdomain Anda</label>
                  <div className="flex items-center gap-0">
                    <input
                      type="text"
                      value={customDomainInput}
                      onChange={e => setCustomDomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="budi-siti"
                      maxLength={40}
                      className="flex-1 px-4 py-2.5 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50 focus:bg-white font-mono"
                    />
                    <div className="px-3 py-2.5 bg-gray-100 border border-gray-200 text-sm text-gray-500 font-mono whitespace-nowrap">
                      .{appDomain}
                    </div>
                    <Button size="sm" onClick={handleSaveDomain} loading={savingDomain} className="rounded-l-none ml-2">
                      Simpan
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Huruf kecil, angka, dan tanda hubung (-). Min. 3 karakter. Contoh: <span className="font-mono">budi-siti</span>
                  </p>
                </div>

                {customDomainInput && customDomainInput !== (invitation?.customDomain ?? '') && (
                  <div className="px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl">
                    <p className="text-xs text-gray-500 mb-0.5">Preview URL setelah disimpan:</p>
                    <p className="text-sm font-mono text-primary font-medium">
                      https://{customDomainInput}.{appDomain}
                    </p>
                  </div>
                )}

                {invitation?.customDomain && (
                  <button
                    onClick={() => { setCustomDomainInput(''); void handleSaveDomain(); }}
                    className="text-xs text-red-400 hover:text-red-600 hover:underline"
                  >
                    Hapus subdomain
                  </button>
                )}
              </div>
            </SectionCard>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 text-sm">Link Eksklusif (Subdomain)</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Dapatkan link seperti <span className="font-mono">nama-anda.{appDomain}</span> — hanya di paket Exclusive. Tanpa beli domain tambahan.
                  </p>
                  <a href="/app/beli" className="inline-block mt-2.5 text-xs font-semibold text-primary hover:underline">
                    Upgrade ke Exclusive →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom save bar on mobile */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg shadow-primary/30 hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-60"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
