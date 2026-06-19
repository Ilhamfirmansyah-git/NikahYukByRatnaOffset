"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const pricingTiers = [
  {
    name: "Basic",
    price: 99000,
    priceStr: "Rp 99.000",
    duration: "90 hari",
    description: "Cocok untuk pasangan yang menginginkan undangan digital sederhana namun berkesan.",
    highlight: false,
    cta: "Pilih Basic",
    href: "/daftar?plan=basic",
    features: {
      "Template pilihan": "Semua template",
      "Masa aktif": "90 hari",
      "RSVP online": true,
      "Buku tamu digital": true,
      "Link undangan unik": true,
      "Countdown timer": true,
      "Maks. foto galeri": "5 foto",
      "Musik latar belakang": true,
      "Peta lokasi interaktif": true,
      "Manajemen tamu": false,
      "Live streaming": false,
      "Custom domain": false,
      "Prioritas support": false,
      "Digital angpao": false,
    },
  },
  {
    name: "Premium",
    price: 199000,
    priceStr: "Rp 199.000",
    duration: "180 hari",
    description: "Fitur terlengkap untuk pernikahan yang tak terlupakan. Pilihan terbaik untuk kebanyakan pasangan.",
    highlight: true,
    cta: "Pilih Premium",
    href: "/daftar?plan=premium",
    features: {
      "Template pilihan": "Semua template",
      "Masa aktif": "180 hari",
      "RSVP online": true,
      "Buku tamu digital": true,
      "Link undangan unik": true,
      "Countdown timer": true,
      "Maks. foto galeri": "20 foto",
      "Musik latar belakang": true,
      "Peta lokasi interaktif": true,
      "Manajemen tamu": true,
      "Live streaming": true,
      "Custom domain": false,
      "Prioritas support": false,
      "Digital angpao": false,
    },
  },
  {
    name: "Exclusive",
    price: 349000,
    priceStr: "Rp 349.000",
    duration: "365 hari",
    description: "Pengalaman premium penuh untuk pernikahan istimewa yang layak dikenang selamanya.",
    highlight: false,
    cta: "Pilih Exclusive",
    href: "/daftar?plan=exclusive",
    features: {
      "Template pilihan": "Semua template",
      "Masa aktif": "365 hari (1 tahun)",
      "RSVP online": true,
      "Buku tamu digital": true,
      "Link undangan unik": true,
      "Countdown timer": true,
      "Maks. foto galeri": "50 foto",
      "Musik latar belakang": true,
      "Peta lokasi interaktif": true,
      "Manajemen tamu": true,
      "Live streaming": true,
      "Custom domain": true,
      "Prioritas support": true,
      "Digital angpao": true,
    },
  },
];

const faqs = [
  {
    q: "Apakah ada biaya tersembunyi?",
    a: "Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk semua fitur yang disebutkan. Anda hanya membayar sekali, tidak ada biaya langganan bulanan.",
  },
  {
    q: "Bisakah saya upgrade paket setelah membeli?",
    a: "Ya, Anda bisa upgrade kapan saja. Anda hanya membayar selisih harga antara paket lama dan paket baru.",
  },
  {
    q: "Apa yang terjadi setelah masa aktif berakhir?",
    a: "Setelah masa aktif berakhir, undangan tidak akan bisa diakses oleh tamu. Data Anda tetap tersimpan selama 30 hari setelah masa aktif, dan Anda bisa memperpanjang kapan saja.",
  },
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Kami menerima transfer bank (BCA, Mandiri, BNI, BRI), dompet digital (GoPay, OVO, DANA, ShopeePay), QRIS, dan kartu kredit/debit via Midtrans.",
  },
  {
    q: "Apakah ada garansi uang kembali?",
    a: "Jika ada kendala teknis yang tidak bisa kami selesaikan, kami akan memberikan solusi terbaik atau pengembalian dana. Hubungi tim support kami untuk informasi lebih lanjut.",
  },
];

const featureKeys = [
  "Template pilihan",
  "Masa aktif",
  "RSVP online",
  "Buku tamu digital",
  "Link undangan unik",
  "Countdown timer",
  "Maks. foto galeri",
  "Musik latar belakang",
  "Peta lokasi interaktif",
  "Manajemen tamu",
  "Live streaming",
  "Custom domain",
  "Prioritas support",
  "Digital angpao",
];

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

function CheckIcon({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-700">{value}</span>;
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

export default function HargaPage() {
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

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border-2 p-6 transition-all ${
                  tier.highlight
                    ? "border-primary bg-primary text-white shadow-2xl md:scale-105"
                    : "border-cream-200 bg-white hover:border-primary/40 hover:shadow-lg"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-5 py-1.5 rounded-full shadow">
                    PALING POPULER
                  </div>
                )}

                <div className="mb-6">
                  <h2 className={`font-display text-2xl font-bold mb-1 ${tier.highlight ? "text-white" : "text-gray-900"}`}>
                    {tier.name}
                  </h2>
                  <p className={`text-sm leading-relaxed ${tier.highlight ? "text-primary-100" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${tier.highlight ? "text-white" : "text-primary"}`}>
                    {tier.priceStr}
                  </span>
                  <br />
                  <span className={`text-sm ${tier.highlight ? "text-primary-200" : "text-gray-500"}`}>
                    aktif {tier.duration} · bayar sekali
                  </span>
                </div>

                <Link href={tier.href}>
                  <Button
                    variant={tier.highlight ? "secondary" : "primary"}
                    size="md"
                    fullWidth
                    className="mb-6"
                  >
                    {tier.cta}
                  </Button>
                </Link>

                <ul className="space-y-2.5">
                  {featureKeys.map((key) => {
                    const val = tier.features[key as keyof typeof tier.features];
                    if (typeof val === "boolean" && !val) return null;
                    return (
                      <li key={key} className="flex items-center gap-2.5">
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ${tier.highlight ? "text-amber-300" : "text-primary"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-sm ${tier.highlight ? "text-primary-50" : "text-gray-700"}`}>
                          {typeof val === "string" ? val : key}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
              Perbandingan Fitur Lengkap
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-cream-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream-50 border-b border-cream-200">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-1/2">Fitur</th>
                    {pricingTiers.map((tier) => (
                      <th
                        key={tier.name}
                        className={`px-4 py-4 text-center text-sm font-bold ${
                          tier.highlight ? "text-primary" : "text-gray-700"
                        }`}
                      >
                        {tier.name}
                        {tier.highlight && (
                          <span className="ml-1.5 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                            Populer
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureKeys.map((key, idx) => (
                    <tr
                      key={key}
                      className={`border-b border-cream-100 ${idx % 2 === 0 ? "bg-white" : "bg-cream-50/50"}`}
                    >
                      <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{key}</td>
                      {pricingTiers.map((tier) => (
                        <td key={tier.name} className="px-4 py-3.5 text-center">
                          <CheckIcon value={tier.features[key as keyof typeof tier.features]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Price row */}
                  <tr className="bg-primary/5 border-t-2 border-primary/20">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">Harga</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.name} className="px-4 py-4 text-center">
                        <div className={`font-bold ${tier.highlight ? "text-primary text-lg" : "text-gray-800"}`}>
                          {tier.priceStr}
                        </div>
                        <Link href={tier.href}>
                          <Button
                            variant={tier.highlight ? "primary" : "outline"}
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

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: "🔒", title: "Pembayaran Aman", desc: "Diproses oleh Midtrans" },
              { icon: "🛡️", title: "Terpercaya", desc: "Ribuan pasangan puas" },
              { icon: "🎯", title: "Tanpa Biaya Tambahan", desc: "Bayar sekali, pakai selamanya" },
              { icon: "💬", title: "Support 24/7", desc: "Tim kami siap membantu" },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 bg-cream-50 rounded-2xl border border-cream-200">
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
              Pilih paket sesuai kebutuhan dan buat undangan impian Anda sekarang.
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
