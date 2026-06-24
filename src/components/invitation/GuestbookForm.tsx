'use client';

import { useState } from 'react';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestbookFormProps {
  guestbook: GuestbookEntry[];
  onSubmit: (data: { name: string; message: string }) => Promise<void>;
  primaryColor?: string;
  className?: string;
  guestName?: string;
}

export default function GuestbookForm({ guestbook, onSubmit, primaryColor = '#8B5E3C', className = '', guestName }: GuestbookFormProps) {
  const [name, setName] = useState(guestName ?? '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { setError('Nama dan pesan wajib diisi'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), message: message.trim() });
      setSuccess(true);
      setName('');
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Gagal mengirim pesan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {success ? (
        <div className="text-center py-4">
          <p className="font-semibold">Terima kasih atas ucapannya! 💌</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none text-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ucapan & Doa</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa terbaik Anda..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none text-gray-900 text-sm resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
          <p className="text-center text-xs opacity-40 mt-1">
            Protected by reCAPTCHA —{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>
            {' & '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>
          </p>
        </form>
      )}

      {guestbook.length > 0 && (
        <div className="mt-8 space-y-4 max-h-64 overflow-y-auto pr-1">
          {guestbook.map(g => (
            <div key={g.id} className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {g.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{g.name}</p>
                <p className="text-sm opacity-80 mt-0.5 break-words">{g.message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(g.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
