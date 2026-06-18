'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DevSeedButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch('/api/dev/seed-invitation', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? 'Gagal membuat undangan test');
        return;
      }
      router.push(`/app/undangan/${data.invitationId}/edit`);
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a2 2 0 01-1.415.586H9.586a2 2 0 01-1.414-.586l-.347-.347z" />
        </svg>
      )}
      {loading ? 'Membuat...' : 'Buat Undangan Test (Dev)'}
    </button>
  );
}
