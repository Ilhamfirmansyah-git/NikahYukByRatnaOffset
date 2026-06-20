import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Template Undangan Pernikahan Digital',
  description: 'Temukan template undangan pernikahan digital yang elegan dan modern. Pilih dari berbagai tema: Elegan Gold, Islami, Javanese Heritage, Romantis Pink, Gelap Romantis, dan Minimalis Putih.',
  keywords: [
    'template undangan pernikahan',
    'desain undangan pernikahan digital',
    'undangan pernikahan islami',
    'undangan pernikahan elegan',
    'template nikah online',
    'undangan digital javanese',
    'undangan pernikahan romantis',
  ],
  openGraph: {
    title: 'Template Undangan Pernikahan — Nikah Yuk by Ratna Offset',
    description: 'Temukan template undangan pernikahan digital yang elegan. Berbagai pilihan tema untuk hari istimewa Anda.',
    url: 'https://ratnaoffset.com/template',
  },
  alternates: {
    canonical: 'https://ratnaoffset.com/template',
  },
};

export default function TemplateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
