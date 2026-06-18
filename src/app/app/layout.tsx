import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ShoppingCartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const isAdmin = (session.user as { role?: string })?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-cream-200 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-cream-200">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-display text-primary font-semibold text-lg">NikahYuk</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/app"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-cream-100 hover:text-primary transition-colors group"
          >
            <span className="text-gray-400 group-hover:text-primary transition-colors"><HomeIcon /></span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="/app/beli"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-cream-100 hover:text-primary transition-colors group"
          >
            <span className="text-gray-400 group-hover:text-primary transition-colors"><ShoppingCartIcon /></span>
            <span className="text-sm font-medium">Beli Paket</span>
          </Link>
          <Link
            href="/app"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-cream-100 hover:text-primary transition-colors group"
          >
            <span className="text-gray-400 group-hover:text-primary transition-colors"><MailIcon /></span>
            <span className="text-sm font-medium">Undangan Saya</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors group mt-4"
            >
              <span className="text-purple-400 group-hover:text-purple-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="text-sm font-medium">Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-cream-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary text-sm font-semibold">
                {(session.user?.name ?? session.user?.email ?? 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user?.name ?? 'Pengguna'}
              </p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 w-full"
          >
            <LogoutIcon />
            Keluar
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
