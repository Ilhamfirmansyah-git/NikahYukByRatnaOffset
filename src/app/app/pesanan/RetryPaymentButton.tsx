'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';


function loadSnapScript(clientKey: string, isProduction: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    document.querySelectorAll('script[data-snap]').forEach(s => s.remove());
    delete (window as { snap?: unknown }).snap;
    const script = document.createElement('script');
    script.src = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    script.setAttribute('data-snap', '1');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Midtrans'));
    document.body.appendChild(script);
  });
}

export default function RetryPaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/retry`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal');

      if (!data.snapToken || data.snapToken === 'dummy-token') {
        toast.error('Midtrans belum dikonfigurasi');
        return;
      }

      const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
      await loadSnapScript(data.clientKey, isProduction);

      window.snap.pay(data.snapToken, {
        onSuccess: () => { toast.success('Pembayaran berhasil!'); window.location.reload(); },
        onPending: () => { toast('Pembayaran sedang diproses.', { icon: '⏳' }); window.location.reload(); },
        onError: () => { toast.error('Pembayaran gagal.'); setLoading(false); },
        onClose: () => { toast('Pembayaran dibatalkan.', { icon: 'ℹ️' }); setLoading(false); },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRetry}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          Memuat...
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Lanjut Bayar
        </>
      )}
    </button>
  );
}
