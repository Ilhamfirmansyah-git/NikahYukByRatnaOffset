'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function TikTokIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [waUrl, setWaUrl] = useState('');

  useEffect(() => {
    fetch('/api/settings?keys=tiktokUrl,waUrl')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        setTiktokUrl(data.tiktokUrl ?? '');
        setWaUrl(data.waUrl ?? '');
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cream-200 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-bold">N</span>
              </div>
              <div className="leading-tight">
                <span className="font-display font-bold text-cream-200 text-base block leading-none">
                  Nikah Yuk
                </span>
                <span className="text-xs text-primary-200 block leading-none">
                  by Ratna Offset
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-200 leading-relaxed">
              Undangan pernikahan online, simpel dan elegan. Bagikan momen bahagia Anda dengan cara yang modern.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Produk</h3>
            <ul className="space-y-2">
              {[
                { href: '/template', label: 'Template' },
                { href: '/harga', label: 'Harga' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-200 hover:text-cream-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Bantuan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#faq" className="text-sm text-primary-200 hover:text-cream-200 transition-colors">
                  FAQ
                </Link>
              </li>
              {waUrl && (
                <li>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-200 hover:text-cream-200 transition-colors"
                  >
                    Hubungi Kami
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              {[
                { href: '/privasi', label: 'Kebijakan Privasi' },
                { href: '/syarat', label: 'Syarat & Ketentuan' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-200 hover:text-cream-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social media */}
            <div className="flex gap-3">
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
              )}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-primary-700 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-primary-300">
            &copy; {currentYear} Nikah Yuk by Ratna Offset. Seluruh hak dilindungi.
          </p>
          <p className="text-sm text-primary-300">
            Dibuat dengan ❤️ untuk pasangan Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
