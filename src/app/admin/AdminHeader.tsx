'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Ringkasan' },
  { href: '/admin/pengguna', label: 'Pengguna' },
  { href: '/admin/pesanan', label: 'Pesanan' },
  { href: '/admin/undangan', label: 'Undangan' },
  { href: '/admin/template', label: 'Template' },
  { href: '/admin/paket', label: 'Paket' },
  { href: '/admin/kupon', label: 'Kupon' },
  { href: '/admin/lagu', label: 'Lagu' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/preview', label: 'Preview' },
  { href: '/admin/pengaturan', label: 'Pengaturan' },
];

export default function AdminHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-semibold text-sm tracking-wide whitespace-nowrap">Admin — Nikah Yuk</span>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/app" className="hidden sm:block text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap">
            ← Kembali ke App
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile slide-in sidebar */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 md:hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="font-semibold text-sm text-white">Admin — Nikah Yuk</span>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/10 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10">
              <Link href="/app" onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-white transition-colors">
                ← Kembali ke App
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
