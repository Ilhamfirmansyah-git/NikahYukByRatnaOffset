"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
}

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
  templateIds: string[];
}

// ──── DATA ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Desain Elegan",
    description:
      "Pilih dari puluhan template premium yang dirancang khusus untuk pasangan Indonesia. Setiap desain memadukan keindahan modern dan nuansa budaya Nusantara.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    title: "Mudah Dibagikan",
    description:
      "Sebar undangan via WhatsApp, Instagram, atau link langsung. Tamu bisa membuka undangan dari perangkat apa pun tanpa perlu install aplikasi.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "RSVP & Guestbook",
    description:
      "Kelola konfirmasi kehadiran tamu secara real-time. Ucapan dan doa dari tamu tersimpan rapi dalam buku tamu digital yang bisa Anda kenang selamanya.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Statistik Tamu",
    description:
      "Pantau siapa saja yang sudah membuka undangan, konfirmasi hadir atau tidak hadir. Semua data tersedia di dashboard yang intuitif dan mudah dipahami.",
  },
];

const steps = [
  {
    number: "01",
    title: "Daftar Akun",
    description: "Buat akun dalam hitungan detik. Mulai perjalanan undangan digital Anda.",
  },
  {
    number: "02",
    title: "Pilih Template",
    description: "Pilih template yang sesuai dengan tema dan kepribadian Anda.",
  },
  {
    number: "03",
    title: "Isi Data Pernikahan",
    description: "Lengkapi data pengantin, lokasi, tanggal, dan galeri foto.",
  },
  {
    number: "04",
    title: "Sebar Link Undangan",
    description: "Bagikan link unik Anda ke semua tamu via WhatsApp atau media sosial.",
  },
];

const categoryGradient: Record<string, string> = {
  elegan: 'from-amber-50 to-amber-100',
  minimalis: 'from-gray-50 to-gray-100',
  islami: 'from-emerald-50 to-teal-100',
  romantis: 'from-rose-50 to-pink-100',
};

const categoryAccent: Record<string, string> = {
  elegan: 'bg-amber-600',
  minimalis: 'bg-gray-500',
  islami: 'bg-emerald-700',
  romantis: 'bg-rose-500',
};

const categoryLabel: Record<string, string> = {
  elegan: 'Elegan',
  minimalis: 'Minimalis',
  islami: 'Islami',
  romantis: 'Romantis',
};

function HomeThumbnail({ tmpl }: { tmpl: Template }) {
  const [imgError, setImgError] = useState(false);
  if (!imgError) {
    return (
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={`/templates/${tmpl.slug}.svg`}
          alt={tmpl.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  return (
    <div className={`h-48 bg-gradient-to-br ${categoryGradient[tmpl.category] ?? 'from-primary-50 to-primary-100'} flex items-center justify-center`}>
      <div className="text-center">
        <div className={`w-12 h-12 ${categoryAccent[tmpl.category] ?? 'bg-primary'} rounded-full mx-auto mb-2 flex items-center justify-center`}>
          <span className="text-white font-display font-bold text-lg">{tmpl.name[0]}</span>
        </div>
        <p className="font-display font-semibold text-gray-800">{tmpl.name}</p>
        <p className="text-sm text-gray-600">{tmpl.description}</p>
      </div>
    </div>
  );
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

const DYNAMIC_FEATURES: { key: keyof PackageFeatures; label: string }[] = [
  { key: "musik", label: "Musik latar belakang" },
  { key: "guestManagement", label: "Manajemen tamu" },
  { key: "livestream", label: "Live streaming" },
  { key: "customDomain", label: "Custom domain" },
  { key: "prioritasSupport", label: "Prioritas support" },
  { key: "digitalAngpao", label: "Digital angpao" },
];

const testimonials = [
  {
    name: "Siti & Reza",
    location: "Jakarta",
    avatar: "SR",
    rating: 5,
    text: "Alhamdulillah, undangan digitalnya sangat cantik! Banyak tamu yang memuji betapa elegannya tampilan undangan kami. Proses pembuatannya pun mudah banget, hanya butuh 1 jam sudah jadi.",
  },
  {
    name: "Dewi & Ahmad",
    location: "Surabaya",
    avatar: "DA",
    rating: 5,
    text: "Awalnya ragu, tapi setelah coba demo langsung jatuh hati. Fitur RSVP-nya sangat membantu kami mengatur undangan. Tidak perlu repot konfirmasi satu per satu lagi!",
  },
  {
    name: "Putri & Bagas",
    location: "Yogyakarta",
    avatar: "PB",
    rating: 5,
    text: "Template Batik Klasiknya luar biasa. Cocok banget dengan tema pernikahan adat Jawa kami. Tim support juga ramah dan cepat dalam membantu kami.",
  },
];

const staticFaqs = [
  {
    q: "Apakah saya perlu keahlian teknis untuk membuat undangan?",
    a: "Tidak sama sekali! Nikah Yuk dirancang agar mudah digunakan oleh siapa saja. Anda hanya perlu mengisi formulir, upload foto, dan undangan siap disebarkan.",
  },
  {
    q: "Apakah tamu perlu menginstall aplikasi untuk membuka undangan?",
    a: "Tidak perlu. Undangan kami berbasis web, sehingga tamu cukup membuka link di browser HP atau komputer mereka tanpa perlu install apapun.",
  },
  {
    q: "Bisakah saya mengedit konten undangan setelah dipublish?",
    a: "Ya, Anda bisa mengedit konten undangan kapan saja selama masa aktif. Perubahan akan langsung terlihat oleh tamu yang membuka link.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Kami menerima pembayaran via transfer bank, GoPay, OVO, DANA, dan kartu kredit/debit melalui Midtrans yang aman dan terpercaya.",
  },
];

// ──── COMPONENTS ──────────────────────────────────────────────────────────────

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

// ──── PAGE ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  const faqs = [
    staticFaqs[0],
    staticFaqs[1],
    {
      q: "Berapa lama undangan saya aktif?",
      a: packages.length > 0
        ? `Masa aktif tergantung paket yang dipilih: ${packages.map(p => `${p.name} (${p.durationDays} hari)`).join(', ')} — dihitung sejak tanggal pembayaran.`
        : "Masa aktif tergantung paket yang dipilih, dihitung sejak tanggal pembayaran.",
    },
    staticFaqs[2],
    staticFaqs[3],
  ];

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then((data: Template[]) => setTemplates(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
    fetch('/api/packages')
      .then(r => r.json())
      .then((data: Package[]) => { if (Array.isArray(data)) setPackages(data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-warm-50 via-cream-100 to-warm-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Dipercaya 10.000+ Pasangan Indonesia
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Undangan Pernikahan{" "}
              <span className="text-primary italic">Online</span> yang{" "}
              <span className="text-primary">Simpel & Elegan</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Buat undangan pernikahan digital yang indah dalam hitungan menit.
              Bagikan via WhatsApp, pantau RSVP, dan rayakan momen istimewa Anda bersama orang-orang tersayang.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/daftar">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Buat Undangan Sekarang
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/template">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Lihat Template
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Bayar sekali · Tanpa biaya bulanan · Mulai dalam 5 menit
            </p>
          </div>

          {/* Hero mockup */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-600 p-6 text-white text-center">
                  <p className="font-display text-lg italic mb-1">Bismillahirrahmanirrahim</p>
                  <h2 className="font-display text-2xl font-bold">Siti Nurhaliza</h2>
                  <p className="text-primary-200 text-sm my-1">&</p>
                  <h2 className="font-display text-2xl font-bold">Ahmad Fauzan</h2>
                  <p className="text-primary-100 text-sm mt-2">Sabtu, 14 Februari 2026</p>
                </div>
                <div className="p-6 flex justify-around text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">142</div>
                    <div className="text-xs text-gray-500">Tamu Diundang</div>
                  </div>
                  <div className="w-px bg-cream-200" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">98</div>
                    <div className="text-xs text-gray-500">Konfirmasi Hadir</div>
                  </div>
                  <div className="w-px bg-cream-200" />
                  <div>
                    <div className="text-2xl font-bold text-gray-600">24</div>
                    <div className="text-xs text-gray-500">Hari Tersisa</div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                ✓ RSVP Real-time
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                ♥ 1.204 Dibagikan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-10 sm:py-16 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Platform lengkap untuk membuat, mengelola, dan menyebarkan undangan pernikahan digital Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-cream-50 border border-cream-200 hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-10 sm:py-16 md:py-28 gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja Nikah Yuk
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Dalam 4 langkah mudah, undangan digital Anda siap disebarkan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full border-t-2 border-dashed border-primary/30" />
                )}
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full font-display font-bold text-xl mb-4 shadow-lg">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATE PREVIEW */}
      <section className="py-10 sm:py-16 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Template Terpopuler
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Dirancang oleh desainer profesional untuk kesan yang memukau.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
            {templates.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-cream-100 rounded-t-2xl" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-cream-200 rounded w-1/2" />
                      <div className="h-3 bg-cream-100 rounded w-3/4" />
                    </div>
                  </div>
                ))
              : templates.map((tmpl) => (
                  <div key={tmpl.id} className="card group cursor-pointer hover:shadow-lg transition-shadow">
                    <HomeThumbnail tmpl={tmpl} />
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {categoryLabel[tmpl.category] ?? tmpl.category}
                      </span>
                      <a
                        href={`/preview/${tmpl.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        Lihat Preview →
                      </a>
                    </div>
                  </div>
                ))
            }
          </div>

          <div className="text-center">
            <Link href="/template">
              <Button variant="outline" size="lg">
                Lihat Semua Template
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-10 sm:py-16 md:py-28 gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Harga Terjangkau, Kualitas Premium
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Investasi terbaik untuk dokumentasi momen terindah dalam hidup Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {packages.length === 0
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border-2 border-cream-200 bg-white p-6 animate-pulse">
                    <div className="h-6 bg-cream-200 rounded w-1/2 mb-3" />
                    <div className="h-9 bg-cream-200 rounded w-2/3 mb-1" />
                    <div className="h-4 bg-cream-100 rounded w-1/2 mb-6" />
                    <div className="h-10 bg-cream-200 rounded mb-5" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 bg-cream-100 rounded w-4/5" />
                      ))}
                    </div>
                  </div>
                ))
              : packages.map((pkg, idx) => {
                  const isHighlight = idx === Math.floor(packages.length / 2);
                  const templateLabel = pkg.templateIds.length === 0
                    ? "Semua template"
                    : `${pkg.templateIds.length} template pilihan`;
                  const pkgFeatures: string[] = [
                    "RSVP online & buku tamu",
                    "Countdown timer",
                    templateLabel,
                    ...(pkg.features.maxPhotos !== undefined
                      ? [`Maks. ${pkg.features.maxPhotos} foto galeri`]
                      : []),
                    ...DYNAMIC_FEATURES.filter((f) => pkg.features[f.key]).map(
                      (f) => f.label
                    ),
                  ];
                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl p-6 border-2 transition-all ${
                        isHighlight
                          ? "border-primary bg-primary text-white shadow-xl sm:scale-105"
                          : "border-cream-200 bg-white hover:border-primary/40"
                      }`}
                    >
                      {isHighlight && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full shadow">
                          TERPOPULER
                        </div>
                      )}
                      <h3
                        className={`font-display text-xl font-bold mb-1 ${
                          isHighlight ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {pkg.name}
                      </h3>
                      <div className="mb-4">
                        <span
                          className={`text-3xl font-bold ${
                            isHighlight ? "text-white" : "text-primary"
                          }`}
                        >
                          {formatRupiah(pkg.price)}
                        </span>
                        <span
                          className={`text-sm ml-1 ${
                            isHighlight ? "text-primary-200" : "text-gray-500"
                          }`}
                        >
                          / {pkg.durationDays} hari aktif
                        </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {pkgFeatures.map((f) => (
                          <li
                            key={f}
                            className={`flex items-center gap-2 text-sm ${
                              isHighlight ? "text-primary-50" : "text-gray-600"
                            }`}
                          >
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
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/daftar?plan=${pkg.id}`}>
                        <Button
                          variant={isHighlight ? "secondary" : "primary"}
                          size="md"
                          fullWidth
                        >
                          Pilih {pkg.name}
                        </Button>
                      </Link>
                    </div>
                  );
                })}
          </div>

          <div className="text-center mt-8">
            <Link href="/harga" className="text-primary font-medium hover:underline text-sm">
              Lihat perbandingan fitur lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-10 sm:py-16 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Kata Mereka tentang Nikah Yuk
            </h2>
            <p className="text-gray-600 text-lg">
              Lebih dari 10.000 pasangan telah mempercayakan momen spesial mereka kepada kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-10 sm:py-16 md:py-28 gradient-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 text-lg">
              Masih ada pertanyaan? Kami siap membantu.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                Hubungi Kami via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Mulai Buat Undangan Impian Anda
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah bersama ribuan pasangan yang telah mempercayakan undangan pernikahan digital mereka kepada Nikah Yuk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/daftar">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-cream-100 font-semibold w-full sm:w-auto"
              >
                Buat Undangan Sekarang
              </Button>
            </Link>
            <Link href="/template">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Lihat Template
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
