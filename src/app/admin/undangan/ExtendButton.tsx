'use client';

import { useState } from 'react';

interface Props {
  invitationId: string;
  currentExpiresAt: string | null;
}

export default function ExtendButton({ invitationId, currentExpiresAt }: Props) {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [newExpiry, setNewExpiry] = useState<string | null>(currentExpiresAt);
  const [open, setOpen] = useState(false);

  async function handleExtend() {
    setLoading(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal');
      setNewExpiry(data.expiresAt);
      setOpen(false);
      alert(`Diperpanjang ${days} hari. Kadaluarsa baru: ${new Date(data.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memperpanjang');
    } finally {
      setLoading(false);
    }
  }

  const expiry = newExpiry ? new Date(newExpiry) : null;
  const now = new Date();
  const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className={`text-xs ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          {expiry
            ? expiry.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-'}
          {daysLeft !== null && !isExpired && (
            <span className={`ml-1 ${daysLeft <= 14 ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
              ({daysLeft}h)
            </span>
          )}
          {isExpired && <span className="ml-1 text-red-500">(kadaluarsa)</span>}
        </span>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium underline"
        >
          +Extend
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-52">
          <p className="text-xs font-semibold text-gray-700 mb-2">Perpanjang</p>
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg mb-2 bg-white"
          >
            {[7, 14, 30, 60, 90, 180, 365].map(d => (
              <option key={d} value={d}>{d} hari</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleExtend}
              disabled={loading}
              className="flex-1 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '...' : 'Perpanjang'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
