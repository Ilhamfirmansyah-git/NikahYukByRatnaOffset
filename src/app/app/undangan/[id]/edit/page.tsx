'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import type { InvitationData, Acara, LoveStoryItem, RekeningItem, EWalletItem } from '@/types/invitation';

const TABS = [
  { id: 'mempelai', label: 'Mempelai' },
  { id: 'acara', label: 'Acara' },
  { id: 'galeri', label: 'Galeri & Musik' },
  { id: 'lovestory', label: 'Love Story & Quote' },
  { id: 'amplop', label: 'Amplop Digital' },
  { id: 'pengaturan', label: 'Pengaturan' },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-cream-200 p-6 mb-4">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder }: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm resize-none"
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
  const [invitation, setInvitation] = useState<{ slug: string; isPublished: boolean; expiresAt: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [extending, setExtending] = useState(false);
  const [extendDays, setExtendDays] = useState(30);

  useEffect(() => {
    fetch(`/api/invitations/${id}`)
      .then(r => r.json())
      .then(inv => {
        setData(inv.data as InvitationData);
        setInvitation({ slug: inv.slug, isPublished: inv.isPublished, expiresAt: inv.expiresAt });
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

  async function handleExtend() {
    setExtending(true);
    try {
      const res = await fetch(`/api/invitations/${id}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: extendDays }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Gagal memperpanjang');
      setInvitation(prev => prev ? { ...prev, expiresAt: result.expiresAt } : prev);
      toast.success(`Undangan diperpanjang ${extendDays} hari!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal memperpanjang');
    } finally {
      setExtending(false);
    }
  }

  function copyLink() {
    if (!invitation) return;
    const url = `${window.location.origin}/u/${invitation.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link berhasil disalin!');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Edit Undangan</h1>
          {invitation && (
            <p className="text-sm text-gray-500 mt-1">
              {invitation.isPublished
                ? <span className="text-green-600 font-medium">● Dipublikasikan</span>
                : <span className="text-yellow-600 font-medium">● Draft</span>}
              {' · '}/u/{invitation.slug}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePublish} loading={publishing}>
            {invitation?.isPublished ? 'Sembunyikan' : 'Publikasikan'}
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving}>
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-white border border-cream-200 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-cream-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Mempelai */}
      {activeTab === 'mempelai' && (
        <div>
          <SectionCard title="Data Mempelai Pria">
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

          <SectionCard title="Data Mempelai Wanita">
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

          <SectionCard title="Urutan Tampil">
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
              <Button
                variant="danger"
                size="sm"
                onClick={() => updateData('acara', data.acara.filter((_, j) => j !== i))}
              >
                Hapus Acara Ini
              </Button>
            </SectionCard>
          ))}
          <button
            onClick={() => updateData('acara', [...data.acara, { nama: '', tanggal: '', waktuMulai: '', waktuSelesai: '', lokasi: '', alamat: '', mapsUrl: '' } as Acara])}
            className="w-full py-3 border-2 border-dashed border-cream-300 rounded-xl text-primary hover:border-primary hover:bg-cream-50 transition-colors text-sm font-medium"
          >
            + Tambah Acara
          </button>
        </div>
      )}

      {/* Tab 3: Galeri & Musik */}
      {activeTab === 'galeri' && (
        <div>
          <SectionCard title="Galeri Foto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {data.galeri.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-cream-200" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; }} />
                  <button
                    onClick={() => updateData('galeri', data.galeri.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div>
                <ImageUpload
                  value=""
                  onChange={url => { if (url) updateData('galeri', [...data.galeri, url]); }}
                  className="h-32"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">Klik foto untuk menghapus. Klik kotak + untuk menambah foto baru.</p>
          </SectionCard>

          <SectionCard title="Musik Latar">
            <div className="space-y-4">
              <Input label="URL Musik (MP3)" value={data.musik.url ?? ''} onChange={e => updateData('musik', { ...data.musik, url: e.target.value })} placeholder="https://example.com/musik.mp3" />
              <Input label="Judul Lagu" value={data.musik.judul ?? ''} onChange={e => updateData('musik', { ...data.musik, judul: e.target.value })} placeholder="Namanya Dia – Yovie & Nuno" />
              <Toggle checked={data.musik.autoplay} onChange={v => updateData('musik', { ...data.musik, autoplay: v })} label="Putar otomatis saat undangan dibuka" />
            </div>
          </SectionCard>
        </div>
      )}

      {/* Tab 4: Love Story & Quote */}
      {activeTab === 'lovestory' && (
        <div>
          <SectionCard title="Love Story">
            {data.loveStory.map((item, i) => (
              <div key={i} className="mb-4 p-4 bg-cream-50 rounded-lg border border-cream-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <Input label="Tahun" value={item.tahun} onChange={e => { const l = [...data.loveStory]; l[i] = { ...l[i], tahun: e.target.value }; updateData('loveStory', l); }} placeholder="2020" />
                  <Input label="Judul" value={item.judul} onChange={e => { const l = [...data.loveStory]; l[i] = { ...l[i], judul: e.target.value }; updateData('loveStory', l); }} placeholder="Pertama Kali Bertemu" />
                </div>
                <TextArea label="Cerita" value={item.cerita} onChange={v => { const l = [...data.loveStory]; l[i] = { ...l[i], cerita: v }; updateData('loveStory', l); }} placeholder="Cerita singkat tentang momen ini..." />
                <button
                  onClick={() => updateData('loveStory', data.loveStory.filter((_, j) => j !== i))}
                  className="mt-3 text-xs text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              onClick={() => updateData('loveStory', [...data.loveStory, { tahun: '', judul: '', cerita: '' } as LoveStoryItem])}
              className="w-full py-3 border-2 border-dashed border-cream-300 rounded-xl text-primary hover:border-primary hover:bg-cream-50 transition-colors text-sm font-medium"
            >
              + Tambah Cerita
            </button>
          </SectionCard>

          <SectionCard title="Kutipan">
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
              />
            </div>

            {data.amplopDigital.aktif && (
              <>
                <div className="mb-4">
                  <Input
                    label="Alamat Pengiriman Kado Fisik (opsional)"
                    value={data.amplopDigital.alamatKado ?? ''}
                    onChange={e => updateData('amplopDigital', { ...data.amplopDigital, alamatKado: e.target.value })}
                    placeholder="Jl. Contoh No. 123, Jakarta"
                  />
                </div>

                <h4 className="font-medium text-gray-800 mb-3">Rekening Bank</h4>
                {data.amplopDigital.rekening.map((rek, i) => (
                  <div key={i} className="p-4 bg-cream-50 rounded-lg border border-cream-200 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input label="Nama Bank" value={rek.bank} onChange={e => { const r = [...data.amplopDigital.rekening]; r[i] = { ...r[i], bank: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, rekening: r }); }} placeholder="BCA" />
                      <Input label="Nomor Rekening" value={rek.nomor} onChange={e => { const r = [...data.amplopDigital.rekening]; r[i] = { ...r[i], nomor: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, rekening: r }); }} placeholder="1234567890" />
                      <Input label="Atas Nama" value={rek.atasNama} onChange={e => { const r = [...data.amplopDigital.rekening]; r[i] = { ...r[i], atasNama: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, rekening: r }); }} placeholder="Muhammad Budi" />
                    </div>
                    <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, rekening: data.amplopDigital.rekening.filter((_, j) => j !== i) })} className="mt-2 text-xs text-red-500 hover:text-red-700">Hapus</button>
                  </div>
                ))}
                <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, rekening: [...data.amplopDigital.rekening, { bank: '', nomor: '', atasNama: '' } as RekeningItem] })} className="w-full py-2.5 border-2 border-dashed border-cream-300 rounded-lg text-primary hover:border-primary text-sm font-medium mb-4">
                  + Tambah Rekening
                </button>

                <h4 className="font-medium text-gray-800 mb-3">E-Wallet</h4>
                {data.amplopDigital.eWallet.map((ew, i) => (
                  <div key={i} className="p-4 bg-cream-50 rounded-lg border border-cream-200 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input label="Jenis E-Wallet" value={ew.jenis} onChange={e => { const w = [...data.amplopDigital.eWallet]; w[i] = { ...w[i], jenis: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, eWallet: w }); }} placeholder="GoPay / OVO / Dana" />
                      <Input label="Nomor" value={ew.nomor} onChange={e => { const w = [...data.amplopDigital.eWallet]; w[i] = { ...w[i], nomor: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, eWallet: w }); }} placeholder="0812345678" />
                      <Input label="URL QR Code (opsional)" value={ew.qrUrl ?? ''} onChange={e => { const w = [...data.amplopDigital.eWallet]; w[i] = { ...w[i], qrUrl: e.target.value }; updateData('amplopDigital', { ...data.amplopDigital, eWallet: w }); }} placeholder="https://..." />
                    </div>
                    <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, eWallet: data.amplopDigital.eWallet.filter((_, j) => j !== i) })} className="mt-2 text-xs text-red-500 hover:text-red-700">Hapus</button>
                  </div>
                ))}
                <button onClick={() => updateData('amplopDigital', { ...data.amplopDigital, eWallet: [...data.amplopDigital.eWallet, { jenis: '', nomor: '', qrUrl: '' } as EWalletItem] })} className="w-full py-2.5 border-2 border-dashed border-cream-300 rounded-lg text-primary hover:border-primary text-sm font-medium">
                  + Tambah E-Wallet
                </button>
              </>
            )}
          </SectionCard>
        </div>
      )}

      {/* Tab 6: Pengaturan */}
      {activeTab === 'pengaturan' && (
        <div>
          <SectionCard title="Livestream">
            <div className="space-y-4">
              <Toggle checked={data.livestream.aktif} onChange={v => updateData('livestream', { ...data.livestream, aktif: v })} label="Aktifkan fitur livestream" />
              {data.livestream.aktif && (
                <>
                  <Input label="Platform" value={data.livestream.platform ?? ''} onChange={e => updateData('livestream', { ...data.livestream, platform: e.target.value })} placeholder="YouTube / Zoom / dll" />
                  <Input label="URL Livestream" value={data.livestream.url ?? ''} onChange={e => updateData('livestream', { ...data.livestream, url: e.target.value })} placeholder="https://youtube.com/live/..." />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Fitur Interaktif">
            <div className="space-y-4">
              <Toggle checked={data.rsvpAktif} onChange={v => updateData('rsvpAktif', v)} label="Aktifkan RSVP (konfirmasi kehadiran)" />
              <Toggle checked={data.guestbookAktif} onChange={v => updateData('guestbookAktif', v)} label="Aktifkan Buku Tamu" />
            </div>
          </SectionCard>

          <SectionCard title="Protokol Kesehatan">
            <div className="space-y-4">
              <Toggle checked={data.protokolKesehatan.aktif} onChange={v => updateData('protokolKesehatan', { ...data.protokolKesehatan, aktif: v })} label="Tampilkan protokol kesehatan" />
              {data.protokolKesehatan.aktif && (
                <TextArea label="Catatan Protokol" value={data.protokolKesehatan.catatan ?? ''} onChange={v => updateData('protokolKesehatan', { ...data.protokolKesehatan, catatan: v })} placeholder="Harap memakai masker, menjaga jarak, dan membawa hand sanitizer..." />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Masa Berlaku">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {invitation?.expiresAt
                    ? <>Aktif hingga: <strong className="text-gray-900">{new Date(invitation.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></>
                    : <span className="text-gray-400">Belum ada tanggal kadaluarsa</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 whitespace-nowrap">Perpanjang</label>
                  <select
                    value={extendDays}
                    onChange={e => setExtendDays(Number(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    {[7, 14, 30, 60, 90, 180, 365].map(d => (
                      <option key={d} value={d}>{d} hari</option>
                    ))}
                  </select>
                </div>
                <Button size="sm" onClick={handleExtend} loading={extending}>
                  Perpanjang
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Link Undangan">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug URL (tidak dapat diubah)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-mono">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://nikahyuk.com'}/u/{invitation?.slug}
                  </div>
                  <Button size="sm" variant="outline" onClick={copyLink}>
                    Salin Link
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={invitation?.isPublished ? 'danger' : 'primary'}
                  onClick={handlePublish}
                  loading={publishing}
                >
                  {invitation?.isPublished ? 'Sembunyikan Undangan' : 'Publikasikan Undangan'}
                </Button>
                {invitation?.isPublished && (
                  <a
                    href={`/u/${invitation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat Undangan →
                  </a>
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Floating save bar */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={handleSave} loading={saving} size="lg" className="shadow-lg">
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
