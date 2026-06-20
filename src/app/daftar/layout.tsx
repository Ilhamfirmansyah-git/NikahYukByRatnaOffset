import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Undangan Pernikahan Digital Gratis',
  description: 'Daftar sekarang dan buat undangan pernikahan digital Anda dalam hitungan menit. Pilih template, isi data mempelai, dan bagikan kepada semua tamu.',
  openGraph: {
    title: 'Daftar — Nikah Yuk by Ratna Offset',
    description: 'Buat undangan pernikahan digital Anda sekarang. Mudah, cepat, dan elegan.',
    url: 'https://ratnaoffset.com/daftar',
  },
  alternates: {
    canonical: 'https://ratnaoffset.com/daftar',
  },
};

export default function DaftarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
