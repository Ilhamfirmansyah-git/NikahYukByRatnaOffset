'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string;
  category: string;
  componentKey: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: {
    maxPhotos: number;
    customDomain: boolean;
    musik: boolean;
    livestream: boolean;
    guestManagement: boolean;
  };
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const categoryLabel: Record<string, string> = {
  elegan: 'Elegan',
  minimalis: 'Minimalis',
  islami: 'Islami',
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function BeliPage() {
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paying, setPaying] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: string; discountValue: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/templates').then(r => r.json()).then(setTemplates);
    fetch('/api/packages').then(r => r.json()).then(setPackages);
  }, []);

  function loadSnapScript(clientKey: string, isProduction: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      // Remove any existing snap script
      document.querySelectorAll('script[data-snap]').forEach(s => s.remove());
      delete (window as { snap?: unknown }).snap;

      const script = document.createElement('script');
      script.src = isProduction
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', clientKey);
      script.setAttribute('data-snap', '1');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Gagal memuat script Midtrans'));
      document.body.appendChild(script);
    });
  }

  async function handleValidateCoupon() {
    if (!couponInput.trim()) return;
    setCouponValidating(true);
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponInput.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? 'Kode kupon tidak valid');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        toast.success('Kupon berhasil diterapkan!');
      }
    } catch {
      setCouponError('Gagal memvalidasi kupon');
    } finally {
      setCouponValidating(false);
    }
  }

  function calcDiscount(price: number) {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'PERCENT') {
      return Math.round(price * appliedCoupon.discountValue / 100);
    }
    return Math.min(appliedCoupon.discountValue, price);
  }

  async function handleBayar() {
    if (!selectedTemplate || !selectedPackage) return;
    setPaying(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          packageId: selectedPackage.id,
          couponCode: appliedCoupon?.code ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal membuat pesanan');

      if (!data.snapToken || data.snapToken === 'dummy-token') {
        toast.error('Midtrans belum dikonfigurasi. Silakan hubungi admin.');
        setPaying(false);
        return;
      }

      const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
      await loadSnapScript(data.clientKey, isProduction);

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          toast.success('Pembayaran berhasil! Undangan Anda sedang dibuat.');
          window.location.href = '/app';
        },
        onPending: () => {
          toast('Pembayaran sedang diproses. Silakan cek email Anda.', { icon: '⏳' });
          window.location.href = '/app';
        },
        onError: () => {
          toast.error('Pembayaran gagal. Silakan coba lagi.');
          setPaying(false);
        },
        onClose: () => {
          toast('Pembayaran dibatalkan.', { icon: 'ℹ️' });
          setPaying(false);
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setPaying(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-gray-900">Beli Paket Undangan</h1>
        <p className="text-gray-500 mt-1">Pilih template dan paket yang sesuai untuk pernikahan Anda.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {[
          { num: 1, label: 'Pilih Template' },
          { num: 2, label: 'Pilih Paket' },
          { num: 3, label: 'Checkout' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                step > s.num ? 'bg-primary border-primary text-white' :
                step === s.num ? 'border-primary text-primary bg-white' :
                'border-gray-200 text-gray-400 bg-white'
              }`}>
                {step > s.num ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.num}
              </div>
              <span className={`text-sm font-medium ${step === s.num ? 'text-primary' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`h-0.5 w-12 mx-4 ${step > s.num ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Template */}
      {step === 1 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`bg-white rounded-xl border-2 cursor-pointer transition-all overflow-hidden hover:shadow-md ${
                  selectedTemplate?.id === tmpl.id
                    ? 'border-primary shadow-md ring-2 ring-primary/20'
                    : 'border-cream-200 hover:border-primary/40'
                }`}
              >
                <div className="h-48 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center relative group">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-primary/60 font-medium">{categoryLabel[tmpl.category] ?? tmpl.category}</span>
                  </div>
                  {/* Preview overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={`/preview/${tmpl.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cream-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Preview
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{tmpl.name}</h3>
                    {selectedTemplate?.id === tmpl.id && (
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{tmpl.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-cream-100 text-primary-700 font-medium">
                      {categoryLabel[tmpl.category] ?? tmpl.category}
                    </span>
                    <a
                      href={`/preview/${tmpl.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Lihat Preview
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              disabled={!selectedTemplate}
              onClick={() => setStep(2)}
            >
              Lanjut ke Pilih Paket →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Package */}
      {step === 2 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isPopular = pkg.name === 'Premium';
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative bg-white rounded-xl border-2 cursor-pointer transition-all p-6 hover:shadow-md ${
                    selectedPackage?.id === pkg.id
                      ? 'border-primary shadow-md ring-2 ring-primary/20'
                      : 'border-cream-200 hover:border-primary/40'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">Terpopuler</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                      <p className="text-sm text-gray-400">{pkg.durationDays} hari</p>
                    </div>
                    {selectedPackage?.id === pkg.id && (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <p className="text-3xl font-bold text-primary mb-6">
                    {formatRupiah(pkg.price)}
                  </p>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span className="text-gray-600">Maks. {pkg.features.maxPhotos} foto galeri</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {pkg.features.musik ? <CheckIcon /> : <XIcon />}
                      <span className={pkg.features.musik ? 'text-gray-600' : 'text-gray-400'}>Musik latar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {pkg.features.livestream ? <CheckIcon /> : <XIcon />}
                      <span className={pkg.features.livestream ? 'text-gray-600' : 'text-gray-400'}>Livestream</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {pkg.features.guestManagement ? <CheckIcon /> : <XIcon />}
                      <span className={pkg.features.guestManagement ? 'text-gray-600' : 'text-gray-400'}>Manajemen tamu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {pkg.features.customDomain ? <CheckIcon /> : <XIcon />}
                      <span className={pkg.features.customDomain ? 'text-gray-600' : 'text-gray-400'}>Custom domain</span>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>← Kembali</Button>
            <Button disabled={!selectedPackage} onClick={() => setStep(3)}>
              Lanjut ke Checkout →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Checkout */}
      {step === 3 && selectedTemplate && selectedPackage && (
        <div className="max-w-xl">
          <div className="bg-white rounded-xl border border-cream-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-cream-100">
                <div>
                  <p className="text-sm text-gray-500">Template</p>
                  <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
                  <span className="text-xs text-primary-600">{categoryLabel[selectedTemplate.category] ?? selectedTemplate.category}</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-primary hover:underline"
                >
                  Ubah
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-cream-100">
                <div>
                  <p className="text-sm text-gray-500">Paket</p>
                  <p className="font-medium text-gray-900">Paket {selectedPackage.name}</p>
                  <span className="text-xs text-gray-400">{selectedPackage.durationDays} hari aktif</span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-primary hover:underline"
                >
                  Ubah
                </button>
              </div>

              {/* Coupon */}
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Kode Kupon</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                    <div>
                      <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                      <span className="text-xs text-green-600 ml-2">
                        -{appliedCoupon.discountType === 'PERCENT' ? `${appliedCoupon.discountValue}%` : formatRupiah(appliedCoupon.discountValue)}
                      </span>
                    </div>
                    <button onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-xs text-red-500 hover:text-red-700">Hapus</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                      onKeyDown={e => e.key === 'Enter' && handleValidateCoupon()}
                      placeholder="Masukkan kode kupon"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <button
                      onClick={handleValidateCoupon}
                      disabled={couponValidating || !couponInput.trim()}
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponValidating ? '...' : 'Terapkan'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Diskon</span>
                  <span className="text-green-600 font-medium">-{formatRupiah(calcDiscount(selectedPackage.price))}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatRupiah(Math.max(0, selectedPackage.price - calcDiscount(selectedPackage.price)))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-cream-50 rounded-xl border border-cream-200 p-4 mb-6">
            <p className="text-sm text-gray-600">
              Pembayaran aman melalui <strong>Midtrans</strong>. Mendukung transfer bank, kartu kredit, GoPay, OVO, dan metode lainnya.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Kembali</Button>
            <Button
              onClick={handleBayar}
              loading={paying}
              className="flex-2"
            >
              Bayar Sekarang {formatRupiah(Math.max(0, selectedPackage.price - calcDiscount(selectedPackage.price)))}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
