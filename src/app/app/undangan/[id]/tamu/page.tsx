'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

export default function TamuPage() {
  const params = useParams();
  const id = params.id as string;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('keluarga');
  const [adding, setAdding] = useState(false);
  const [invitationSlug, setInvitationSlug] = useState('');

  const loadGuests = useCallback(async () => {
    try {
      const [guestsRes, invRes] = await Promise.all([
        fetch(`/api/invitations/${id}/guests`),
        fetch(`/api/invitations/${id}`),
      ]);
      const guestsData = await guestsRes.json();
      const invData = await invRes.json();
      setGuests(Array.isArray(guestsData) ? guestsData : []);
      setInvitationSlug(invData.slug ?? '');
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
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/u/${invitationSlug}?to=${encodeURIComponent(guestName)}`;
  }

  function copyLink(guestName: string) {
    navigator.clipboard.writeText(getPersonalLink(guestName));
    toast.success('Link berhasil disalin!');
  }

  const groupColor: Record<string, string> = {
    keluarga: 'bg-purple-100 text-purple-700',
    teman: 'bg-blue-100 text-blue-700',
    'rekan kerja': 'bg-orange-100 text-orange-700',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-gray-900">Manajemen Tamu</h1>
        <p className="text-gray-500 mt-1">Tambah dan kelola daftar tamu undangan Anda.</p>
      </div>

      {/* Add guest form */}
      <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Tambah Tamu Baru</h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Nama Tamu"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Budi Santoso"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="w-48">
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
          <Button onClick={handleAdd} loading={adding}>
            Tambah
          </Button>
        </div>
      </div>

      {/* Guest list */}
      <div className="bg-white rounded-xl border border-cream-200">
        <div className="p-6 border-b border-cream-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Daftar Tamu <span className="text-gray-400 font-normal">({guests.length})</span>
          </h2>
        </div>

        {guests.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Belum ada tamu. Tambahkan tamu di atas.</p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {guests.map(guest => (
              <div key={guest.id} className="p-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-sm font-semibold">{guest.name[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{guest.name}</p>
                  {guest.group && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${groupColor[guest.group] ?? 'bg-gray-100 text-gray-600'}`}>
                      {guest.group}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(guest.name)}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 border border-primary/20 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Salin Link
                  </button>
                  <button
                    onClick={() => handleDelete(guest.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
