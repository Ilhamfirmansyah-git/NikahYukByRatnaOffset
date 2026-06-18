import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Ringkasan' },
  { href: '/admin/pengguna', label: 'Pengguna' },
  { href: '/admin/pesanan', label: 'Pesanan' },
  { href: '/admin/undangan', label: 'Undangan' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;

  if (!user?.id || user.role !== 'ADMIN') {
    redirect('/app');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-sm tracking-wide">Admin — Nikah Yuk</span>
          <nav className="flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/app" className="text-xs text-gray-400 hover:text-white transition-colors">
          ← Kembali ke App
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
