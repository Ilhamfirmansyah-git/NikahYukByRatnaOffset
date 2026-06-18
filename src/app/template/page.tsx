"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const categories = ["Semua", "Elegan", "Minimalis", "Islami", "Rustic"];

const templates = [
  {
    id: "1",
    name: "Jasmine Gold",
    slug: "jasmine-gold",
    category: "Elegan",
    description: "Template mewah dengan nuansa gold dan bunga jasmine yang romantis. Cocok untuk pernikahan formal.",
    color: "from-amber-100 to-yellow-50",
    accent: "#D97706",
    accentBg: "bg-amber-500",
    price: "Mulai Rp 99.000",
    badge: "Terpopuler",
    badgeColor: "bg-amber-100 text-amber-800",
    features: ["Animasi halaman", "Musik latar", "Galeri foto"],
  },
  {
    id: "2",
    name: "Sakura Putih",
    slug: "sakura-putih",
    category: "Minimalis",
    description: "Desain bersih dan modern dengan elemen bunga sakura yang lembut. Kesan simpel namun berkelas.",
    color: "from-rose-100 to-pink-50",
    accent: "#BE185D",
    accentBg: "bg-rose-500",
    price: "Mulai Rp 99.000",
    badge: "Baru",
    badgeColor: "bg-rose-100 text-rose-800",
    features: ["Countdown timer", "RSVP online", "Peta lokasi"],
  },
  {
    id: "3",
    name: "Batik Klasik",
    slug: "batik-klasik",
    category: "Islami",
    description: "Keindahan motif batik tradisional bertemu dengan sentuhan islami yang hangat dan penuh makna.",
    color: "from-emerald-100 to-teal-50",
    accent: "#065F46",
    accentBg: "bg-emerald-700",
    price: "Mulai Rp 99.000",
    badge: "Favorit",
    badgeColor: "bg-emerald-100 text-emerald-800",
    features: ["Kaligrafi arab", "Doa pembuka", "Galeri foto"],
  },
  {
    id: "4",
    name: "Rustic Garden",
    slug: "rustic-garden",
    category: "Rustic",
    description: "Nuansa alam pedesaan yang hangat dengan elemen kayu dan bunga liar. Sempurna untuk outdoor wedding.",
    color: "from-stone-100 to-amber-50",
    accent: "#78350F",
    accentBg: "bg-stone-700",
    price: "Mulai Rp 199.000",
    badge: "Premium",
    badgeColor: "bg-stone-100 text-stone-800",
    features: ["Animasi daun", "Musik akustik", "Album foto"],
  },
  {
    id: "5",
    name: "Royal Majestic",
    slug: "royal-majestic",
    category: "Elegan",
    description: "Keanggunan kerajaan dengan warna biru navy dan aksen emas. Untuk pernikahan yang berkelas tinggi.",
    color: "from-indigo-100 to-blue-50",
    accent: "#1E3A8A",
    accentBg: "bg-indigo-800",
    price: "Mulai Rp 199.000",
    badge: "Premium",
    badgeColor: "bg-indigo-100 text-indigo-800",
    features: ["Custom font", "Video intro", "Musik orkestra"],
  },
  {
    id: "6",
    name: "Boho Chic",
    slug: "boho-chic",
    category: "Rustic",
    description: "Gaya bohemian modern dengan warna earthy tones. Untuk pasangan yang unik dan kreatif.",
    color: "from-orange-100 to-amber-50",
    accent: "#C2410C",
    accentBg: "bg-orange-600",
    price: "Mulai Rp 99.000",
    badge: null,
    badgeColor: "",
    features: ["Ilustrasi custom", "Countdown", "RSVP"],
  },
  {
    id: "7",
    name: "Islamic Ornament",
    slug: "islamic-ornament",
    category: "Islami",
    description: "Ornamen islami yang indah dengan kaligrafi dan pola geometris. Penuh nuansa keagamaan yang khidmat.",
    color: "from-green-100 to-emerald-50",
    accent: "#166534",
    accentBg: "bg-green-800",
    price: "Mulai Rp 99.000",
    badge: null,
    badgeColor: "",
    features: ["Kaligrafi", "Sholawat", "Doa nikah"],
  },
  {
    id: "8",
    name: "Modern Serif",
    slug: "modern-serif",
    category: "Minimalis",
    description: "Tipografi serif yang kuat dengan layout modern. Cocok untuk pasangan yang menghargai estetika minimalis.",
    color: "from-slate-100 to-gray-50",
    accent: "#1E293B",
    accentBg: "bg-slate-800",
    price: "Mulai Rp 99.000",
    badge: null,
    badgeColor: "",
    features: ["Custom typography", "B&W mode", "PDF export"],
  },
  {
    id: "9",
    name: "Floral Vintage",
    slug: "floral-vintage",
    category: "Elegan",
    description: "Motif bunga vintage yang timeless dengan palet warna dusty rose dan sage. Romantis dan nostalgia.",
    color: "from-pink-100 to-rose-50",
    accent: "#9D174D",
    accentBg: "bg-pink-800",
    price: "Mulai Rp 349.000",
    badge: "Exclusive",
    badgeColor: "bg-pink-100 text-pink-800",
    features: ["Animasi bunga", "Custom palette", "Video gallery"],
  },
];

export default function TemplatePage() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered =
    activeCategory === "Semua"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <>
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <section className="gradient-warm py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Galeri Template
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Pilih template yang mencerminkan kepribadian Anda. Semua template dapat dikustomisasi sepenuhnya.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="sticky top-16 z-30 bg-white border-b border-cream-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-sm"
                      : "bg-cream-100 text-gray-600 hover:bg-cream-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-sm text-gray-500 mb-6">
            Menampilkan {filtered.length} template
            {activeCategory !== "Semua" && ` dalam kategori "${activeCategory}"`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((template) => (
              <div
                key={template.id}
                className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className={`relative h-52 bg-gradient-to-br ${template.color} flex items-center justify-center overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-current" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 border-current" />
                  </div>

                  {/* Center content */}
                  <div className="text-center z-10">
                    <div
                      className={`w-14 h-14 ${template.accentBg} rounded-full mx-auto mb-3 flex items-center justify-center shadow-md`}
                    >
                      <span className="text-white font-display font-bold text-xl">
                        {template.name[0]}
                      </span>
                    </div>
                    <p className="font-display font-semibold text-gray-800 text-sm">
                      Siti & Ahmad
                    </p>
                    <p className="text-xs text-gray-500">14 Februari 2026</p>
                  </div>

                  {/* Badge */}
                  {template.badge && (
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${template.badgeColor}`}>
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {template.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 text-right">{template.price}</span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{template.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.features.map((f) => (
                      <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      Preview
                    </Button>
                    <Link href="/daftar" className="flex-1">
                      <Button variant="primary" size="sm" fullWidth>
                        Pilih Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">
                Template tidak ditemukan
              </h3>
              <p className="text-gray-500">Coba pilih kategori lain.</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Tidak Menemukan yang Cocok?
            </h2>
            <p className="text-primary-100 mb-6">
              Kami bisa membuat desain custom sesuai keinginan Anda. Hubungi tim kami sekarang.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                <Button size="md" className="bg-white text-primary hover:bg-cream-100 font-semibold w-full sm:w-auto">
                  Request Desain Custom
                </Button>
              </a>
              <Link href="/daftar">
                <Button variant="outline" size="md" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
