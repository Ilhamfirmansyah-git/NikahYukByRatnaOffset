'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabaseBrowser } from '@/lib/supabase-client';
import type { InvitationData, Acara, LoveStoryItem, RekeningItem, EWalletItem } from '@/types/invitation';
import { defaultInvitationData } from '@/types/invitation';
import MusicPicker from '@/app/app/undangan/[id]/edit/MusicPicker';

type Tab = 'mempelai' | 'acara' | 'galeri' | 'konten' | 'amplop' | 'musik';

const TABS: { id: Tab; label: string }[] = [
  { id: 'mempelai', label: 'Mempelai' },
  { id: 'acara', label: 'Acara' },
  { id: 'galeri', label: 'Galeri & Video' },
  { id: 'konten', label: 'Kisah & Quote' },
  { id: 'amplop', label: 'Amplop Digital' },
  { id: 'musik', label: 'Musik' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const INPUT = 'w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm';
const TEXTAREA = `${INPUT} resize-none`;

export default function AdminPreviewPage() {
  const [tab, setTab] = useState<Tab>('mempelai');
  const [data, setData] = useState<InvitationData>(defaultInvitationData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/preview')
      .then(r => r.json())
      .then(d => setData({ ...defaultInvitationData(), ...d }))
      .catch(() => toast.error('Gagal memuat data preview'))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/preview', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      toast.success('Data preview berhasil disimpan!');
    } catch {
      toast.error('Gagal menyimpan data preview');
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(file: File, fieldKey: string, onDone: (url: string) => void) {
    setUploadingField(fieldKey);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const filename = `${Date.now()}-${fieldKey.replace(/[^a-z0-9]/gi, '-')}.${ext}`;

      const presignRes = await fetch('/api/admin/preview/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, contentType: file.type || 'image/jpeg' }),
      });
      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.error ?? 'Gagal presign');

      const { token, path } = presignData;
      const { error } = await supabaseBrowser.storage
        .from('music')
        .uploadToSignedUrl(path, token, file, { contentType: file.type || 'image/jpeg' });
      if (error) throw new Error(error.message);

      const { data: urlData } = supabaseBrowser.storage.from('music').getPublicUrl(path);
      onDone(urlData.publicUrl);
      toast.success('Foto berhasil diunggah!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal upload foto');
    } finally {
      setUploadingField(null);
    }
  }

  function PhotoUpload({ fieldKey, currentUrl, onUploaded, label = 'Foto' }: {
    fieldKey: string; currentUrl?: string; onUploaded: (url: string) => void; label?: string;
  }) {
    const ref = useRef<HTMLInputElement>(null);
    const busy = uploadingField === fieldKey;
    return (
      <div className="space-y-2">
        {currentUrl && (
          <img src={currentUrl} alt={label} className="w-24 h-24 rounded-xl object-cover border border-gray-200" />
        )}
        <div className="flex items-center gap-2">
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f, fieldKey, onUploaded); }} />
          <button type="button" onClick={() => ref.current?.click()} disabled={busy}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
            {busy
              ? <><div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />Mengunggah...</>
              : <>{currentUrl ? 'Ganti' : 'Upload'} {label}</>
            }
          </button>
          {currentUrl && (
            <button type="button" onClick={() => onUploaded('')}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">
              Hapus
            </button>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Atau masukkan URL:</label>
          <input type="url" value={currentUrl ?? ''} onChange={e => onUploaded(e.target.value)}
            placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>
    );
  }

  function updatePria(key: string, val: string) {
    setData(d => ({ ...d, mempelai: { ...d.mempelai, pria: { ...d.mempelai.pria, [key]: val } } }));
  }
  function updateWanita(key: string, val: string) {
    setData(d => ({ ...d, mempelai: { ...d.mempelai, wanita: { ...d.mempelai.wanita, [key]: val } } }));
  }
  function updateAcara(i: number, key: keyof Acara, val: string) {
    setData(d => {
      const acara = [...d.acara];
      acara[i] = { ...acara[i], [key]: val };
      return { ...d, acara };
    });
  }
  function addAcara() {
    setData(d => ({
      ...d,
      acara: [...d.acara, { nama: '', tanggal: '', waktuMulai: '', waktuSelesai: '', lokasi: '', alamat: '' }],
    }));
  }
  function removeAcara(i: number) {
    setData(d => ({ ...d, acara: d.acara.filter((_, j) => j !== i) }));
  }
  function updateStory(i: number, key: keyof LoveStoryItem, val: string) {
    setData(d => {
      const ls = [...d.loveStory];
      ls[i] = { ...ls[i], [key]: val };
      return { ...d, loveStory: ls };
    });
  }
  function addStory() {
    setData(d => ({ ...d, loveStory: [...d.loveStory, { tahun: '', judul: '', cerita: '' }] }));
  }
  function removeStory(i: number) {
    setData(d => ({ ...d, loveStory: d.loveStory.filter((_, j) => j !== i) }));
  }
  function updateRek(i: number, key: keyof RekeningItem, val: string) {
    setData(d => {
      const r = [...d.amplopDigital.rekening];
      r[i] = { ...r[i], [key]: val };
      return { ...d, amplopDigital: { ...d.amplopDigital, rekening: r } };
    });
  }
  function updateWallet(i: number, key: keyof EWalletItem, val: string) {
    setData(d => {
      const w = [...d.amplopDigital.eWallet];
      w[i] = { ...w[i], [key]: val };
      return { ...d, amplopDigital: { ...d.amplopDigital, eWallet: w } };
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  const pria = data.mempelai.pria;
  const wanita = data.mempelai.wanita;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Mockup Preview</h1>
          <p className="text-gray-500 mt-1 text-sm">Data ini dipakai di semua halaman preview template.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="/preview/elegan-gold" target="_blank"
            className="text-sm text-primary hover:underline flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Lihat Preview
          </a>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</>
              : 'Simpan Semua'
            }
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* ── MEMPELAI ── */}
        {tab === 'mempelai' && (
          <div className="space-y-8">
            {/* Display order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampil</label>
              <div className="flex gap-4">
                {(['pria-dulu', 'wanita-dulu'] as const).map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="urutan" value={v}
                      checked={data.mempelai.urutanTampil === v}
                      onChange={() => setData(d => ({ ...d, mempelai: { ...d.mempelai, urutanTampil: v } }))}
                      className="accent-primary" />
                    <span className="text-sm">{v === 'pria-dulu' ? 'Pria dahulu' : 'Wanita dahulu'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pria */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Mempelai Pria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama Lengkap">
                  <input className={INPUT} value={pria.namaLengkap ?? ''} onChange={e => updatePria('namaLengkap', e.target.value)} placeholder="Ahmad Rizki Firmansyah" />
                </Field>
                <Field label="Nama Panggilan">
                  <input className={INPUT} value={pria.namaPanggilan ?? ''} onChange={e => updatePria('namaPanggilan', e.target.value)} placeholder="Rizki" />
                </Field>
                <Field label="Anak Ke-">
                  <input className={INPUT} value={pria.anakKe ?? ''} onChange={e => updatePria('anakKe', e.target.value)} placeholder="2" />
                </Field>
                <Field label="Instagram">
                  <input className={INPUT} value={pria.instagram ?? ''} onChange={e => updatePria('instagram', e.target.value)} placeholder="@rizki.firmansyah" />
                </Field>
                <Field label="Nama Ayah">
                  <input className={INPUT} value={pria.ayah ?? ''} onChange={e => updatePria('ayah', e.target.value)} placeholder="Hendra Firmansyah" />
                </Field>
                <Field label="Nama Ibu">
                  <input className={INPUT} value={pria.ibu ?? ''} onChange={e => updatePria('ibu', e.target.value)} placeholder="Ratna Dewi" />
                </Field>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Mempelai Pria</label>
                <PhotoUpload fieldKey="pria-foto" currentUrl={pria.foto} label="foto pria"
                  onUploaded={url => updatePria('foto', url)} />
              </div>
            </div>

            {/* Wanita */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Mempelai Wanita</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama Lengkap">
                  <input className={INPUT} value={wanita.namaLengkap ?? ''} onChange={e => updateWanita('namaLengkap', e.target.value)} placeholder="Siti Aminah Rahayu" />
                </Field>
                <Field label="Nama Panggilan">
                  <input className={INPUT} value={wanita.namaPanggilan ?? ''} onChange={e => updateWanita('namaPanggilan', e.target.value)} placeholder="Aminah" />
                </Field>
                <Field label="Anak Ke-">
                  <input className={INPUT} value={wanita.anakKe ?? ''} onChange={e => updateWanita('anakKe', e.target.value)} placeholder="1" />
                </Field>
                <Field label="Instagram">
                  <input className={INPUT} value={wanita.instagram ?? ''} onChange={e => updateWanita('instagram', e.target.value)} placeholder="@aminah.rahayu" />
                </Field>
                <Field label="Nama Ayah">
                  <input className={INPUT} value={wanita.ayah ?? ''} onChange={e => updateWanita('ayah', e.target.value)} placeholder="Agus Rahayu" />
                </Field>
                <Field label="Nama Ibu">
                  <input className={INPUT} value={wanita.ibu ?? ''} onChange={e => updateWanita('ibu', e.target.value)} placeholder="Sri Wahyuni" />
                </Field>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Mempelai Wanita</label>
                <PhotoUpload fieldKey="wanita-foto" currentUrl={wanita.foto} label="foto wanita"
                  onUploaded={url => updateWanita('foto', url)} />
              </div>
            </div>
          </div>
        )}

        {/* ── ACARA ── */}
        {tab === 'acara' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Countdown</label>
              <input type="date" className={INPUT} style={{ maxWidth: 240 }}
                value={data.countdown.tanggal ?? ''}
                onChange={e => setData(d => ({ ...d, countdown: { tanggal: e.target.value } }))} />
            </div>
            {data.acara.map((a, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Acara {i + 1}</h3>
                  <button onClick={() => removeAcara(i)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nama Acara">
                    <input className={INPUT} value={a.nama} onChange={e => updateAcara(i, 'nama', e.target.value)} placeholder="Akad Nikah" />
                  </Field>
                  <Field label="Tanggal">
                    <input type="date" className={INPUT} value={a.tanggal} onChange={e => updateAcara(i, 'tanggal', e.target.value)} />
                  </Field>
                  <Field label="Waktu Mulai">
                    <input type="time" className={INPUT} value={a.waktuMulai} onChange={e => updateAcara(i, 'waktuMulai', e.target.value)} />
                  </Field>
                  <Field label="Waktu Selesai">
                    <input type="time" className={INPUT} value={a.waktuSelesai} onChange={e => updateAcara(i, 'waktuSelesai', e.target.value)} />
                  </Field>
                  <Field label="Nama Lokasi">
                    <input className={INPUT} value={a.lokasi} onChange={e => updateAcara(i, 'lokasi', e.target.value)} placeholder="Masjid Agung Al-Falah" />
                  </Field>
                  <Field label="URL Google Maps">
                    <input className={INPUT} value={a.mapsUrl ?? ''} onChange={e => updateAcara(i, 'mapsUrl', e.target.value)} placeholder="https://maps.google.com/..." />
                  </Field>
                  <Field label="Alamat Lengkap">
                    <input className={INPUT} value={a.alamat} onChange={e => updateAcara(i, 'alamat', e.target.value)} placeholder="Jl. Merdeka No. 1, Bandung" />
                  </Field>
                </div>
              </div>
            ))}
            <button onClick={addAcara}
              className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Acara
            </button>
          </div>
        )}

        {/* ── GALERI & VIDEO ── */}
        {tab === 'galeri' && (
          <div className="space-y-8">
            {/* Gallery */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Foto Galeri</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                {data.galeri.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setData(d => ({ ...d, galeri: d.galeri.filter((_, j) => j !== i) }))}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                      Hapus
                    </button>
                  </div>
                ))}
                {/* Upload slot */}
                <GaleriUploadSlot
                  busy={uploadingField === 'galeri-new'}
                  onFile={f => uploadPhoto(f, 'galeri-new', url => {
                    setData(d => ({ ...d, galeri: [...d.galeri, url] }));
                  })}
                />
              </div>
              {/* URL input */}
              <div className="flex gap-2 mt-2">
                <input id="galeri-url-input" type="url" placeholder="Atau masukkan URL foto..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button
                  onClick={() => {
                    const input = document.getElementById('galeri-url-input') as HTMLInputElement;
                    const url = input.value.trim();
                    if (!url) return;
                    setData(d => ({ ...d, galeri: [...d.galeri, url] }));
                    input.value = '';
                  }}
                  className="px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
                  Tambah URL
                </button>
              </div>
            </div>

            {/* Livestream / Video */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Video / Livestream</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only"
                      checked={data.livestream.aktif}
                      onChange={e => setData(d => ({ ...d, livestream: { ...d.livestream, aktif: e.target.checked } }))} />
                    <div className={`w-11 h-6 rounded-full transition-colors ${data.livestream.aktif ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.livestream.aktif ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm text-gray-700">Tampilkan bagian livestream/video di preview</span>
                </label>
                {data.livestream.aktif && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
                    <Field label="Platform">
                      <input className={INPUT} value={data.livestream.platform ?? ''} placeholder="YouTube / Zoom / dll"
                        onChange={e => setData(d => ({ ...d, livestream: { ...d.livestream, platform: e.target.value } }))} />
                    </Field>
                    <Field label="URL Video / Live">
                      <input type="url" className={INPUT} value={data.livestream.url ?? ''} placeholder="https://youtube.com/live/..."
                        onChange={e => setData(d => ({ ...d, livestream: { ...d.livestream, url: e.target.value } }))} />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── KONTEN ── */}
        {tab === 'konten' && (
          <div className="space-y-8">
            {/* Love Story */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Kisah Cinta</h3>
              <div className="space-y-4">
                {data.loveStory.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Momen {i + 1}</span>
                      <button onClick={() => removeStory(i)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Tahun">
                        <input className={INPUT} value={item.tahun} onChange={e => updateStory(i, 'tahun', e.target.value)} placeholder="2019" />
                      </Field>
                      <Field label="Judul">
                        <input className={INPUT} value={item.judul} onChange={e => updateStory(i, 'judul', e.target.value)} placeholder="Pertama Bertemu" />
                      </Field>
                    </div>
                    <Field label="Cerita">
                      <textarea rows={3} className={TEXTAREA} value={item.cerita} onChange={e => updateStory(i, 'cerita', e.target.value)} placeholder="Cerita singkat..." />
                    </Field>
                  </div>
                ))}
                <button onClick={addStory}
                  className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Momen
                </button>
              </div>
            </div>

            {/* Quote */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Kutipan / Quote</h3>
              <div className="space-y-3">
                <Field label="Teks Kutipan">
                  <textarea rows={3} className={TEXTAREA} value={data.quote.teks ?? ''}
                    onChange={e => setData(d => ({ ...d, quote: { ...d.quote, teks: e.target.value } }))}
                    placeholder="Tuliskan kutipan inspiratif..." />
                </Field>
                <Field label="Sumber">
                  <input className={INPUT} value={data.quote.sumber ?? ''}
                    onChange={e => setData(d => ({ ...d, quote: { ...d.quote, sumber: e.target.value } }))}
                    placeholder="QS. Ar-Rum: 21" />
                </Field>
              </div>
            </div>

            {/* Protokol Kesehatan */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Protokol Kesehatan</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only"
                      checked={data.protokolKesehatan.aktif}
                      onChange={e => setData(d => ({ ...d, protokolKesehatan: { ...d.protokolKesehatan, aktif: e.target.checked } }))} />
                    <div className={`w-11 h-6 rounded-full transition-colors ${data.protokolKesehatan.aktif ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.protokolKesehatan.aktif ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm text-gray-700">Tampilkan protokol kesehatan</span>
                </label>
                {data.protokolKesehatan.aktif && (
                  <textarea rows={3} className={TEXTAREA}
                    value={data.protokolKesehatan.catatan ?? ''}
                    onChange={e => setData(d => ({ ...d, protokolKesehatan: { ...d.protokolKesehatan, catatan: e.target.value } }))}
                    placeholder="Mohon hadir dalam kondisi sehat..." />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── AMPLOP DIGITAL ── */}
        {tab === 'amplop' && (
          <div className="space-y-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only"
                  checked={data.amplopDigital.aktif}
                  onChange={e => setData(d => ({ ...d, amplopDigital: { ...d.amplopDigital, aktif: e.target.checked } }))} />
                <div className={`w-11 h-6 rounded-full transition-colors ${data.amplopDigital.aktif ? 'bg-primary' : 'bg-gray-200'}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.amplopDigital.aktif ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-gray-700">Tampilkan amplop digital di preview</span>
            </label>

            {data.amplopDigital.aktif && (
              <>
                {/* Rekening */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Rekening Bank</h3>
                  <div className="space-y-3">
                    {data.amplopDigital.rekening.map((r, i) => (
                      <div key={i} className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-gray-200">
                        <Field label="Bank">
                          <input className={INPUT} value={r.bank} onChange={e => updateRek(i, 'bank', e.target.value)} placeholder="BCA" />
                        </Field>
                        <Field label="Nomor Rekening">
                          <input className={INPUT} value={r.nomor} onChange={e => updateRek(i, 'nomor', e.target.value)} placeholder="1234567890" />
                        </Field>
                        <div>
                          <Field label="Atas Nama">
                            <input className={INPUT} value={r.atasNama} onChange={e => updateRek(i, 'atasNama', e.target.value)} placeholder="Nama" />
                          </Field>
                          <button onClick={() => setData(d => ({ ...d, amplopDigital: { ...d.amplopDigital, rekening: d.amplopDigital.rekening.filter((_, j) => j !== i) } }))}
                            className="text-xs text-red-400 hover:text-red-600 mt-2">Hapus</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setData(d => ({ ...d, amplopDigital: { ...d.amplopDigital, rekening: [...d.amplopDigital.rekening, { bank: '', nomor: '', atasNama: '' }] } }))}
                      className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Tambah Rekening
                    </button>
                  </div>
                </div>

                {/* E-wallet */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">E-Wallet</h3>
                  <div className="space-y-3">
                    {data.amplopDigital.eWallet.map((w, i) => (
                      <div key={i} className="flex items-end gap-3 p-4 rounded-xl border border-gray-200">
                        <Field label="Jenis">
                          <input className={INPUT} value={w.jenis} onChange={e => updateWallet(i, 'jenis', e.target.value)} placeholder="GoPay" style={{ width: 140 }} />
                        </Field>
                        <Field label="Nomor">
                          <input className={INPUT} value={w.nomor} onChange={e => updateWallet(i, 'nomor', e.target.value)} placeholder="081234567890" />
                        </Field>
                        <button onClick={() => setData(d => ({ ...d, amplopDigital: { ...d.amplopDigital, eWallet: d.amplopDigital.eWallet.filter((_, j) => j !== i) } }))}
                          className="text-sm text-red-400 hover:text-red-600 pb-2.5">Hapus</button>
                      </div>
                    ))}
                    <button onClick={() => setData(d => ({ ...d, amplopDigital: { ...d.amplopDigital, eWallet: [...d.amplopDigital.eWallet, { jenis: '', nomor: '' }] } }))}
                      className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Tambah E-Wallet
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── MUSIK ── */}
        {tab === 'musik' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Pilih lagu yang akan diputar di semua halaman preview template.</p>
            <MusicPicker
              value={data.musik}
              onChange={v => setData(d => ({ ...d, musik: v }))}
            />
          </div>
        )}
      </div>

      {/* Floating save */}
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors shadow-lg">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</>
            : 'Simpan Semua Perubahan'
          }
        </button>
      </div>
    </div>
  );
}

function GaleriUploadSlot({ busy, onFile }: { busy: boolean; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button type="button"
      onClick={() => ref.current?.click()}
      disabled={busy}
      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50">
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {busy
        ? <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
        : <>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs text-gray-400">Upload</span>
        </>
      }
    </button>
  );
}
