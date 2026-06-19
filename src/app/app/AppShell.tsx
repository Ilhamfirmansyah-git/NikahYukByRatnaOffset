'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HomeIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ShoppingCartIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ReceiptIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V3H5zm8 0v14a2 2 0 002 2h4a2 2 0 002-2V3h-8zM7 7h2v2H7V7zm2 4H7v2h2v-2zm8-4h-2v2h2V7zm-2 4h2v2h-2v-2z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function UserIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}

function NavLink({ href, icon, label, className = '', onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/app' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
        isActive
          ? 'bg-primary-50 text-primary'
          : 'text-gray-600 hover:bg-cream-100 hover:text-primary'
      } ${className}`}
    >
      <span className={`transition-colors flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

interface Props {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  userInitial: string;
  isAdmin: boolean;
}

const BOTTOM_NAV = [
  { href: '/app', label: 'Beranda', icon: (a: boolean) => <HomeIcon filled={a} /> },
  { href: '/app/beli', label: 'Beli', icon: (a: boolean) => <ShoppingCartIcon filled={a} /> },
  { href: '/app/pesanan', label: 'Pesanan', icon: (a: boolean) => <ReceiptIcon filled={a} /> },
  { href: '/app/profil', label: 'Profil', icon: (a: boolean) => <UserIcon filled={a} /> },
];

export default function AppShell({ children, userName, userEmail, userInitial, isAdmin }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-cream-200 flex items-center justify-between">
        <Link href="/app" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div>
            <span className="font-display text-primary font-semibold text-lg leading-none block">NikahYuk</span>
            <span className="text-xs text-gray-400 leading-none">by Ratna Offset</span>
          </div>
        </Link>
        <button
          className="md:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium px-3 mb-2">Menu</p>
        <NavLink href="/app" icon={<HomeIcon />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
        <NavLink href="/app/beli" icon={<ShoppingCartIcon />} label="Beli Paket" onClick={() => setSidebarOpen(false)} />
        <NavLink href="/app/pesanan" icon={<ReceiptIcon />} label="Pesanan Saya" onClick={() => setSidebarOpen(false)} />
        <NavLink href="/app/profil" icon={<UserIcon />} label="Profil" onClick={() => setSidebarOpen(false)} />
        {isAdmin && (
          <>
            <div className="h-px bg-cream-200 my-2" />
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium px-3 mb-2">Admin</p>
            <NavLink
              href="/admin"
              icon={<AdminIcon />}
              label="Admin Panel"
              className="text-purple-700"
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-cream-200">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">{userInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
        <a
          href="/api/auth/signout"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-cream-200 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Buka menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <div>
            <span className="font-display text-primary font-semibold leading-none block">NikahYuk</span>
            <span className="text-[10px] text-gray-400 leading-none">by Ratna Offset</span>
          </div>
        </Link>
        {/* Right: user initials */}
        <Link href="/app/profil" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-semibold">{userInitial}</span>
        </Link>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-64 bg-white border-r border-cream-200 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="md:ml-64 pt-14 pb-20 md:pb-0 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-5xl">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-cream-200 flex items-stretch safe-area-bottom">
        {BOTTOM_NAV.map(item => {
          const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {item.icon(isActive)}
              <span className={`text-[10px] font-medium leading-tight ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
