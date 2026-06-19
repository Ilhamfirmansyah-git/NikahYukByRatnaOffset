"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

interface PackageFeatures {
  maxPhotos?: number;
  musik?: boolean;
  livestream?: boolean;
  guestManagement?: boolean;
  customDomain?: boolean;
  prioritasSupport?: boolean;
  digitalAngpao?: boolean;
}

interface Package {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: PackageFeatures;
  isActive: boolean;
}

const BASE_FEATURES = [
  "RSVP online",
  "Buku tamu digital",
  "Link undangan unik",
  "Countdown timer",
  "Semua template premium",
];

const DYNAMIC_FEATURES: { key: keyof PackageFeatures; label: string }[] = [
  { key: "musik", label: "Musik latar belakang" },
  { key: "guestManagement", label: "Manajemen tamu" },
  { key: "livestream", label: "Live streaming" },
  { key: "customDomain", label: "Custom domain" },
  { key: "prioritasSupport", label: "Prioritas support" },
  { key: "digitalAngpao", label: "Digital angpao" },
];

const faqs = [
  {
    q: "Apakah ada biaya tersembunyi?",
    a: "Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk semua fitur yang disebutkan. Anda hanya membayar sekali, tidak ada biaya langganan bulanan.",
  },
  {
    q: "Bisakah saya upgrade paket setelah membeli?",
    a: "Ya, Anda bisa upgrade kapan saja. Hubungi tim support kami untuk informasi lebih lanjut.",
  },
  {
    q: "Apa yang terjadi setelah masa aktif berakhir?",
    a: "Setelah masa aktif berakhir, undangan tidak akan bisa diakses oleh tamu. Data Anda tetap tersimpan dan Anda bisa memperpanjang kapan saja.",
  },
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Kami menerima transfer bank (BCA, Mandiri, BNI, BRI), dompet digital (GoPay, OVO, DANA, ShopeePay), QRIS, dan kartu kredit/debit via Midtrans.",
  },
  {
    q: "Apakah ada garansi?",
    a: "Jika ada kendala teknis yang tidak bisa kami selesaikan, kami siap memberikan solusi terbaik. Hubungi tim support kami kapan saja.",
  },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-cream-200 rounded-xl overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-cream-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-800 pr-4">{q}</span>
        <svg
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-cream-100">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

function CheckVal({ value }: { value: boolean | string | undefined }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-700 font-medium">{value}</span>;
  }
  if (value) {
    return (
      <svg className="w-5 h-5 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border-2 border-cream-200 bg-white p-6 animate-pulse">
      <div className="h-7 bg-cream-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-cream-100 rounded w-full mb-6" />
      <div className="h-10 bg-cream-200 rounded w-1/2 mb-1" />
      <div className="h-4 bg-cream-100 rounded w-2/3 mb-6" />
      <div className="h-10 bg-cream-200 rounded mb-6" />
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-cream-100 rounded w-4/5" />
        ))}
      </div>
    </div>
  );
}

export default function HargaPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: Package[]) => {
        if (Array.isArray(data)) setPackages(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const highlightIndex = Math.floor(packages.length / 2);

  return (
    <>
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <section className="gradient-warm py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Harga yang Transparan
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Satu kali bayar, tanpa biaya bulanan. Pilih paket yang sesuai dengan kebutuhan pernikahan Anda.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {loading
              ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : packages.map((pkg, idx) => {
                  const isHighlight = idx === highlightIndex;
                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl border-2 p-6 transition-all ${
                        isHighlight
                          ? "border-primary bg-primary text-white shadow-2xl md:scale-105"
                          : "border-cream-200 bg-white hover:border-primary/40 hover:shadow-lg"
                      }`}
                    >
                      {isHighlight && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-5 py-1.5 rounded-full shadow">
                          PALING POPULER
                        </div>
                      )}

                      <div className="mb-6">
                        <h2
                          className={`font-display text-2xl font-bold mb-1 ${
                            isHighlight ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {pkg.name}
                        </h2>
                      </div>

                      <div className="mb-6">
                        <span
                          className={`text-4xl font-bold ${
                            isHighlight ? "text-white" : "text-primary"
                          }`}
                        >
                          {formatRupiah(pkg.price)}
                        </span>
                        <br />
                        <span
                          className={`text-sm ${
                            isHighlight ? "text-primary-200" : "text-gray-500"
                          }`}
                        >
                          aktif {pkg.durationDays} hari · bayar sekali
                        </span>
                      </div>

                      <Link href={`/daftar?plan=${pkg.id}`}>
                        <Button
                          variant={isHighlight ? "secondary" : "primary"}
                          size="md"
                          fullWidth
                          className="mb-6"
                        >
                          Pilih {pkg.name}
                        </Button>
                      </Link>

                      <ul className="space-y-2.5">
                        {/* Base features */}
                        {BASE_FEATURES.map((feat) => (
                          <li key={feat} className="flex items-center gap-2.5">
                            <svg
                              className={`w-4 h-4 flex-shrink-0 ${
                                isHighlight ? "text-amber-300" : "text-primary"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className={`text-sm ${
                                isHighlight ? "text-primary-50" : "text-gray-700"
                              }`}
                            >
                              {feat}
                            </span>
                          </li>
                        ))}

                        {/* maxPhotos */}
                        {pkg.features.maxPhotos !== undefined && (
                          <li className="flex items-center gap-2.5">
                            <svg
                              className={`w-4 h-4 flex-shrink-0 ${
                                isHighlight ? "text-amber-300" : "text-primary"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className={`text-sm ${
                                isHighlight ? "text-primary-50" : "text-gray-700"
                              }`}
                            >
                              Maks. {pkg.features.maxPhotos} foto galeri
                            </span>
                          </li>
                        )}

                        {/* Dynamic features — only show enabled ones */}
                        {DYNAMIC_FEATURES.filter(
                          (f) => pkg.features[f.key]
                        ).map((f) => (
                          <li key={f.key} className="flex items-center gap-2.5">
                            <svg
                              className={`w-4 h-4 flex-shrink-0 ${
                                isHighlight ? "text-amber-300" : "text-primary"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className={`text-sm ${
                                isHighlight ? "text-primary-50" : "text-gray-700"
                              }`}
                            >
                              {f.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
          </div>

          {/* Comparison Table */}
          {!loading && packages.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
                Perbandingan Fitur Lengkap
              </h2>

              <div className="overflow-x-auto rounded-2xl border border-cream-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cream-50 border-b border-cream-200">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-1/2">
                        Fitur
                      </th>
                      {packages.map((pkg, idx) => (
                        <th
                          key={pkg.id}
                          className={`px-4 py-4 text-center text-sm font-bold ${
                            idx === highlightIndex ? "text-primary" : "text-gray-700"
                          }`}
                        >
                          {pkg.name}
                          {idx === highlightIndex && (
                            <span className="ml-1.5 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                              Populer
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Masa aktif */}
                    <tr className="border-b border-cream-100 bg-white">
                      <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">Masa aktif</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="px-4 py-3.5 text-center">
                          <span className="text-sm text-gray-700">{pkg.durationDays} hari</span>
                        </td>
                      ))}
                    </tr>

                    {/* Base features */}
                    {BASE_FEATURES.map((feat, i) => (
                      <tr
                        key={feat}
                        className={`border-b border-cream-100 ${
                          i % 2 === 0 ? "bg-cream-50/50" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{feat}</td>
                        {packages.map((pkg) => (
                          <td key={pkg.id} className="px-4 py-3.5 text-center">
                            <CheckVal value={true} />
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* maxPhotos */}
                    <tr className="border-b border-cream-100 bg-white">
                      <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">
                        Maks. foto galeri
                      </td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="px-4 py-3.5 text-center">
                          <CheckVal value={`${pkg.features.maxPhotos ?? 0} foto`} />
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic features */}
                    {DYNAMIC_FEATURES.map((f, i) => {
                      const anyPkgHas = packages.some((p) => p.features[f.key]);
                      if (!anyPkgHas) return null;
                      return (
                        <tr
                          key={f.key}
                          className={`border-b border-cream-100 ${
                            i % 2 === 0 ? "bg-cream-50/50" : "bg-white"
                          }`}
                        >
                          <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">
                            {f.label}
                          </td>
                          {packages.map((pkg) => (
                            <td key={pkg.id} className="px-4 py-3.5 text-center">
                              <CheckVal value={Boolean(pkg.features[f.key])} />
                            </td>
                          ))}
                        </tr>
                      );
                    })}

                    {/* Price row */}
                    <tr className="bg-primary/5 border-t-2 border-primary/20">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">Harga</td>
                      {packages.map((pkg, idx) => (
                        <td key={pkg.id} className="px-4 py-4 text-center">
                          <div
                            className={`font-bold ${
                              idx === highlightIndex
                                ? "text-primary text-lg"
                                : "text-gray-800"
                            }`}
                          >
                            {formatRupiah(pkg.price)}
                          </div>
                          <Link href={`/daftar?plan=${pkg.id}`}>
                            <Button
                              variant={idx === highlightIndex ? "primary" : "outline"}
                              size="sm"
                              className="mt-2"
                            >
                              Pilih
                            </Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: "🔒", title: "Pembayaran Aman", desc: "Diproses oleh Midtrans" },
              { icon: "🛡️", title: "Terpercaya", desc: "Ribuan pasangan puas" },
              { icon: "🎯", title: "Tanpa Biaya Tambahan", desc: "Bayar sekali, pakai selamanya" },
              { icon: "💬", title: "Support 24/7", desc: "Tim kami siap membantu" },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-4 bg-cream-50 rounded-2xl border border-cream-200"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
              Pertanyaan Seputar Harga
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Siap Membuat Undangan Impian?
            </h2>
            <p className="text-primary-100 mb-6">
              Pilih paket sesuai kebutuhan dan buat undangan pernikahan digital Anda sekarang.
            </p>
            <Link href="/daftar">
              <Button size="lg" className="bg-white text-primary hover:bg-cream-100 font-semibold">
                Buat Undangan Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
