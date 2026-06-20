import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harga Paket Undangan Pernikahan Digital',
  description: 'Pilih paket undangan pernikahan digital terbaik. Paket Basic mulai Rp99.000, Premium Rp199.000, dan Exclusive Rp349.000 — sudah termasuk musik latar, RSVP online, buku tamu, dan countdown timer.',
  keywords: [
    'harga undangan pernikahan online',
    'paket undangan digital',
    'undangan pernikahan murah',
    'biaya undangan digital',
    'paket undangan nikah',
    'harga undangan nikah online',
  ],
  openGraph: {
    title: 'Harga Paket — Nikah Yuk by Ratna Offset',
    description: 'Pilih paket undangan pernikahan digital terbaik. Mulai Rp99.000 dengan musik, RSVP, dan countdown timer.',
    url: 'https://nikahyuk.id/harga',
  },
  alternates: {
    canonical: 'https://nikahyuk.id/harga',
  },
};

export default function HargaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
