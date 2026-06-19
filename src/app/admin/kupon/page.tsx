'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export default function AdminKuponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: '',
    discountType: 'PERCENT' as 'PERCENT' | 'FIXED',
    discountValue: '',
    maxUses: '',
    expiresAt: '',
  });

  async function loadCoupons() {
    setLoading(true);
    const res = await fetch('/api/admin/coupons');
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadCoupons(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal membuat kupon');
      toast.success('Kupon berhasil dibuat!');
      setForm({ code: '', discountType: 'PERCENT', discountValue: '', maxUses: '', expiresAt: '' });
      setShowForm(false);
      loadCoupons();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Nonaktifkan kupon ini?')) return;
    const res = await fetch('/api/admin/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success('Kupon dinonaktifkan');
      loadCoupons();
    } else {
      toast.error('Gagal menonaktifkan kupon');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Manajemen Kupon</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola kode diskon</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          {showForm ? 'Tutup' : '+ Buat Kupon'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Buat Kupon Baru</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Kupon</label>
              <input
                required
                type="text"
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="DISKON50"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Diskon</label>
              <select
                value={form.discountType}
                onChange={e => setForm(p => ({ ...p, discountType: e.target.value as 'PERCENT' | 'FIXED' }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="PERCENT">Persen (%)</option>
                <option value="FIXED">Nominal (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nilai Diskon {form.discountType === 'PERCENT' ? '(%)' : '(Rp)'}
              </label>
              <input
                required
                type="number"
                min="1"
                max={form.discountType === 'PERCENT' ? '100' : undefined}
                value={form.discountValue}
                onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))}
                placeholder={form.discountType === 'PERCENT' ? '20' : '50000'}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Maks. Penggunaan (opsional)</label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                placeholder="100 (kosongkan = tidak terbatas)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Kadaluarsa (opsional)</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Membuat...' : 'Buat Kupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
        <div className="p-6 border-b border-cream-100">
          <h2 className="font-semibold text-gray-900">Daftar Kupon ({coupons.length})</h2>
        </div>

        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">Belum ada kupon</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diskon</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Penggunaan</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kadaluarsa</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {coupons.map(coupon => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isExhausted = coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;
                  const effectivelyActive = coupon.isActive && !isExpired && !isExhausted;
                  return (
                    <tr key={coupon.id} className="hover:bg-cream-50">
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900">{coupon.code}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {coupon.discountType === 'PERCENT'
                          ? `${coupon.discountValue}%`
                          : formatRupiah(coupon.discountValue)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {coupon.usedCount}{coupon.maxUses !== null ? ` / ${coupon.maxUses}` : ' / ∞'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString('id-ID')
                          : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        {effectivelyActive ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">Aktif</span>
                        ) : isExpired ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 font-medium">Kadaluarsa</span>
                        ) : isExhausted ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700 font-medium">Habis</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">Nonaktif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {coupon.isActive && (
                          <button
                            onClick={() => handleDeactivate(coupon.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Nonaktifkan
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
