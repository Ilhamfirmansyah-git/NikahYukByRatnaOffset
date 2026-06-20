import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog Pernikahan — Tips & Inspirasi Undangan Digital',
    template: '%s | Blog Nikah Yuk',
  },
  description: 'Tips, tutorial, dan inspirasi seputar undangan pernikahan digital. Panduan lengkap membuat undangan nikah online yang elegan dan berkesan.',
  keywords: ['blog pernikahan', 'tips undangan pernikahan digital', 'tutorial undangan nikah online', 'inspirasi undangan pernikahan', 'undangan pernikahan islami'],
  alternates: {
    canonical: 'https://ratnaoffset.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
