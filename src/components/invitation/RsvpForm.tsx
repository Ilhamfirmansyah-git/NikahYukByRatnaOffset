'use client';

import { useState } from 'react';

interface RsvpEntry {
  id: string;
  name: string;
  attendance: string;
  guestCount: number;
  createdAt: string;
}

interface RsvpFormProps {
  slug: string;
  rsvps: RsvpEntry[];
  onSubmit: (data: { name: string; attendance: 'HADIR' | 'TIDAK_HADIR' | 'RAGU'; guestCount: number }) => Promise<void>;
  primaryColor?: string;
  className?: string;
}

const ATTENDANCE_LABELS: Record<string, string> = {
  HADIR: 'Hadir',
  TIDAK_HADIR: 'Tidak Hadir',
  RAGU: 'Masih Ragu',
};

export default function RsvpForm({ rsvps, onSubmit, primaryColor = '#8B5E3C', className = '' }: RsvpFormProps) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'HADIR' | 'TIDAK_HADIR' | 'RAGU'>('HADIR');
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nama wajib diisi'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), attendance, guestCount });
      setSuccess(true);
      setName('');
      setGuestCount(1);
    } catch {
      setError('Gagal mengirim RSVP. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {success ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-semibold text-lg">Terima kasih!</p>
          <p className="text-sm opacity-70 mt-1">Konfirmasi kehadiran Anda telah kami terima.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 underline text-sm opacity-70 hover:opacity-100"
          >
            Kirim lagi
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 text-sm"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Konfirmasi Kehadiran</label>
            <div className="flex flex-col gap-2">
              {(['HADIR', 'TIDAK_HADIR', 'RAGU'] as const).map(val => (
                <label key={val} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    value={val}
                    checked={attendance === val}
                    onChange={() => setAttendance(val)}
                    className="w-4 h-4"
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="text-sm">{ATTENDANCE_LABELS[val]}</span>
                </label>
              ))}
            </div>
          </div>
          {attendance === 'HADIR' && (
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Tamu</label>
              <input
                type="number"
                min={1}
                max={10}
                value={guestCount}
                onChange={e => setGuestCount(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none text-gray-900 text-sm"
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>
      )}

      {rsvps.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-sm uppercase tracking-wider opacity-60 mb-3">
            Tamu yang sudah konfirmasi ({rsvps.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {rsvps.map(r => (
              <div key={r.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                <span className="font-medium">{r.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.attendance === 'HADIR' ? 'bg-green-100 text-green-700' :
                  r.attendance === 'TIDAK_HADIR' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {ATTENDANCE_LABELS[r.attendance] || r.attendance}
                  {r.attendance === 'HADIR' && r.guestCount > 1 ? ` (${r.guestCount} orang)` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
