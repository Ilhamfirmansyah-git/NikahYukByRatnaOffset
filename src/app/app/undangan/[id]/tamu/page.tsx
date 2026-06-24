'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { InvitationData } from '@/types/invitation';

interface Guest {
  id: string;
  name: string;
  group: string | null;
  slug: string;
}

const GROUP_OPTIONS = [
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'teman', label: 'Teman' },
  { value: 'rekan kerja', label: 'Rekan Kerja' },
];

const VALID_GROUPS = GROUP_OPTIONS.map(o => o.value);

const DEFAULT_TEMPLATE = `Kepada Yth.
Bapak/Ibu/Saudara/i {nama}

Assalamu'alaikum Wr. Wb.

Bismillahirahmanirrahim.
Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami:

{pria}
           &
{wanita}

Berikut klik link untuk info lengkap dari acara kami :

{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Wassalamu'alaikum Wr. Wb.

Terima Kasih..

Hormat kami,
{pria} & {wanita}`;

function parseCSV(text: string): Array<{ name: string; group: string }> {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 1) return [];
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('nama') || firstLine.includes('name');
  const dataLines = hasHeader ? lines.slice(1) : lines;
  return dataLines
    .map(line => {
      const cols = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g) ?? line.split(',');
      const name = (cols[0] ?? '').replace(/^"|"$/g, '').trim();
      const rawGroup = (cols[1] ?? '').replace(/^"|"$/g, '').trim().toLowerCase();
      const group = VALID_GROUPS.includes(rawGroup) ? rawGroup : 'keluarga';
      return { name, group };
    })
    .filter(r => r.name.length > 0);
}

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const csv = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const groupColor: Record<string, string> = {
  keluarga: 'bg-purple-100 text-purple-700',
  teman: 'bg-blue-100 text-blue-700',
  'rekan kerja': 'bg-orange-100 text-orange-700',
};

const groupIcon: Record<string, string> = {
  keluarga: '👨‍👩‍👧',
  teman: '👥',
  'rekan kerja': '💼',
};

export default function TamuPage() {
  const params = useParams();
  const id = params.id as string;
  const importRef = useRef<HTMLInputElement>(null);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestManagementAllowed, setGuestManagementAllowed] = useState(true);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('keluarga');
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [invitationSlug, setInvitationSlug] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [priaNama, setPriaNama] = useState('');
  const [wanitaNama, setWanitaNama] = useState('');
  const [waTemplate, setWaTemplate] = useState(DEFAULT_TEMPLATE);
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'ratnaoffset.com';
  const [showTemplate, setShowTemplate] = useState(false);
  const [search, setSearch] = useState('');
  const [importPreview, setImportPreview] = useState<Array<{ name: string; group: string }> | null>(null);

  const loadGuests = useCallback(async () => {
    try {
      const [guestsRes, invRes] = await Promise.all([
        fetch(`/api/invitations/${id}/guests`),
        fetch(`/api/invitations/${id}`),
      ]);
      const invData = await invRes.json();

      const features = invData?.packageFeatures as Record<string, unknown> | null;
      if (features && features.guestManagement === false) {
        setGuestManagementAllowed(false);
        setLoading(false);
        return;
      }

      const guestsData = await guestsRes.json();
      setGuests(Array.isArray(guestsData) ? guestsData : []);
      setInvitationSlug(invData.slug ?? '');
      setCustomDomain(invData.customDomain ?? '');

      const data = invData.data as InvitationData;
      setPriaNama(data?.mempelai?.pria?.namaLengkap || data?.mempelai?.pria?.namaPanggilan || '');
      setWanitaNama(data?.mempelai?.wanita?.namaLengkap || data?.mempelai?.wanita?.namaPanggilan || '');
    } catch {
      toast.error('Gagal memuat data tamu');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadGuests(); }, [loadGuests]);

  async function handleAdd() {
    if (!name.trim()) { toast.error('Nama tamu wajib diisi'); return; }
    setAdding(true);
    try {
      const res = await fetch(`/api/invitations/${id}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), group }),
      });
      if (!res.ok) throw new Error('Gagal menambah tamu');
      await loadGuests();
      setName('');
      toast.success('Tamu berhasil ditambahkan!');
    } catch {
      toast.error('Gagal menambah tamu');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(guestId: string) {
    if (!confirm('Hapus tamu ini?')) return;
    try {
      const res = await fetch(`/api/invitations/${id}/guests`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });
      if (!res.ok) throw new Error('Gagal menghapus');
      setGuests(prev => prev.filter(g => g.id !== guestId));
      toast.success('Tamu dihapus');
    } catch {
      toast.error('Gagal menghapus tamu');
    }
  }

  function getPersonalLink(guestName: string): string {
    const base = customDomain
      ? `https://${customDomain}.${appDomain}`
      : `${typeof window !== 'undefined' ? window.location.origin : `https://${appDomain}`}/u/${invitationSlug}`;
    return `${base}?to=${encodeURIComponent(guestName)}`;
  }

  function copyLink(guestName: string) {
    navigator.clipboard.writeText(getPersonalLink(guestName));
    toast.success('Link berhasil disalin!');
  }

  function sendWhatsApp(guestName: string) {
    const personalLink = getPersonalLink(guestName);
    const message = waTemplate
      .replace(/\{nama\}/g, guestName)
      .replace(/\{link\}/g, personalLink)
      .replace(/\{pria\}/g, priaNama)
      .replace(/\{wanita\}/g, wanitaNama);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function handleDownloadTemplate() {
    downloadCSV('template-tamu.csv', [
      ['Budi Santoso', 'keluarga'],
      ['Siti Rahayu', 'teman'],
      ['Ahmad Rizki', 'rekan kerja'],
    ], ['Nama', 'Kelompok']);
  }

  function handleExport() {
    if (guests.length === 0) { toast.error('Belum ada tamu untuk diekspor'); return; }
    const rows = guests.map((g, i) => [
      String(i + 1),
      g.name,
      g.group ?? '',
      getPersonalLink(g.name),
    ]);
    downloadCSV('daftar-tamu.csv', rows, ['No', 'Nama', 'Kelompok', 'Link Undangan']);
    toast.success(`${guests.length} tamu berhasil diekspor`);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        toast.error('Tidak ada data tamu yang ditemukan dalam file');
      } else {
        setImportPreview(parsed);
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  }

  async function handleConfirmImport() {
    if (!importPreview || importPreview.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch(`/api/invitations/${id}/guests/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: importPreview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal mengimpor');
      setImportPreview(null);
      await loadGuests();
      toast.success(`${data.imported} tamu berhasil diimpor!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengimpor tamu');
    } finally {
      setImporting(false);
    }
  }

  const filteredGuests = search.trim()
    ? guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || (g.group ?? '').toLowerCase().includes(search.toLowerCase()))
    : guests;

  // Group counts
  const groupCounts = guests.reduce<Record<string, number>>((acc, g) => {
    const key = g.group ?? 'lainnya';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!guestManagementAllowed) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-display font-semibold text-gray-900">Manajemen Tamu</h1>
          <p className="text-gray-500 text-sm mt-1">Tambah dan kelola daftar tamu undangan Anda.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border-2 border-dashed border-cream-300">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Fitur Tidak Tersedia</h2>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Manajemen tamu hanya tersedia untuk paket <strong>Premium</strong> dan <strong>Exclusive</strong>.
          </p>
          <a
            href="/app/beli"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors"
          >
            Upgrade Paket
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-semibold text-gray-900">Manajemen Tamu</h1>
        <p className="text-gray-500 text-sm mt-1">Tambah dan kelola daftar tamu undangan Anda.</p>
      </div>

      {/* Stats */}
      {guests.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-cream-200 p-3 sm:p-4 text-center">
            <p className="text-2xl font-bold text-primary">{guests.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Tamu</p>
          </div>
          {GROUP_OPTIONS.map(opt => (
            <div key={opt.value} className="bg-white rounded-xl border border-cream-200 p-3 sm:p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{groupCounts[opt.value] ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">{opt.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add guest form */}
      <div className="bg-white rounded-xl border border-cream-200 p-4 sm:p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Tambah Tamu Baru</h2>
        <div className="space-y-3">
          {/* Name – always full width */}
          <Input
            label="Nama Tamu"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          {/* Group + Button – side by side */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kelompok</label>
              <select
                value={group}
                onChange={e => setGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm bg-white"
              >
                {GROUP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleAdd} loading={adding} className="flex-shrink-0">
              Tambah
            </Button>
          </div>
        </div>
      </div>

      {/* WhatsApp message template – collapsible */}
      <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
        <button
          onClick={() => setShowTemplate(v => !v)}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Template Pesan WhatsApp</p>
              <p className="text-xs text-gray-400">Kustomisasi pesan undangan WhatsApp</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${showTemplate ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showTemplate && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-cream-100">
            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-xs text-gray-500">
                Gunakan{' '}
                {['{nama}', '{link}', '{pria}', '{wanita}'].map(v => (
                  <code key={v} className="bg-gray-100 px-1 py-0.5 rounded text-green-700 font-mono mr-1">{v}</code>
                ))}
              </p>
              {waTemplate !== DEFAULT_TEMPLATE && (
                <button
                  onClick={() => setWaTemplate(DEFAULT_TEMPLATE)}
                  className="text-xs text-primary hover:underline flex-shrink-0 ml-3"
                >
                  Reset
                </button>
              )}
            </div>
            <textarea
              value={waTemplate}
              onChange={e => setWaTemplate(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y leading-relaxed"
              placeholder="Tulis template pesan WhatsApp di sini..."
            />
          </div>
        )}
      </div>

      {/* Guest list */}
      <div className="bg-white rounded-xl border border-cream-200">
        {/* List header */}
        <div className="p-4 sm:p-5 border-b border-cream-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h2 className="font-semibold text-gray-900 flex-1">
              Daftar Tamu{' '}
              <span className="text-gray-400 font-normal text-sm">({guests.length})</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 text-xs text-gray-600 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span className="hidden sm:inline">Unduh </span>Template
              </button>

              <input ref={importRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
              <button
                onClick={() => importRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-primary px-3 py-2 rounded-lg border border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import CSV
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 text-xs text-green-700 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Search */}
          {guests.length > 0 && (
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau kelompok..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50"
              />
            </div>
          )}
        </div>

        {guests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Belum ada tamu</p>
            <p className="text-gray-400 text-xs">Tambahkan tamu di atas atau import dari file CSV.</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-400 text-sm">Tidak ada tamu yang cocok dengan pencarian &quot;{search}&quot;</p>
            <button onClick={() => setSearch('')} className="mt-2 text-xs text-primary hover:underline">Hapus pencarian</button>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {filteredGuests.map(guest => (
              <div key={guest.id} className="p-4 sm:p-4">
                {/* Mobile: stacked, Desktop: single row */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-semibold">{guest.name[0].toUpperCase()}</span>
                  </div>

                  {/* Info + actions */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{guest.name}</p>
                      {guest.group && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${groupColor[guest.group] ?? 'bg-gray-100 text-gray-600'}`}>
                          {groupIcon[guest.group] ?? ''} {guest.group}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => copyLink(guest.name)}
                        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-700 px-2.5 py-1.5 rounded-lg hover:bg-primary-50 border border-primary/20 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Salin Link</span>
                      </button>

                      <button
                        onClick={() => sendWhatsApp(guest.name)}
                        className="flex items-center gap-1.5 text-xs text-white bg-green-500 hover:bg-green-600 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span>Kirim WA</span>
                      </button>

                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="ml-auto flex items-center justify-center w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus tamu"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Import preview modal */}
      {importPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Konfirmasi Import</h3>
              <p className="text-sm text-gray-500 mt-1">
                {importPreview.length} tamu ditemukan. Periksa sebelum mengimpor.
              </p>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b">
                    <th className="pb-2 pr-4">Nama</th>
                    <th className="pb-2">Kelompok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {importPreview.map((g, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-4 font-medium text-gray-800">{g.name}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${groupColor[g.group] ?? 'bg-gray-100 text-gray-600'}`}>
                          {g.group}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 sm:p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setImportPreview(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <Button onClick={handleConfirmImport} loading={importing} className="flex-1">
                Import {importPreview.length} Tamu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
