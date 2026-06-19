import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import AppShell from './AppShell';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const user = session.user as { id?: string; name?: string; email?: string; role?: string };
  const isAdmin = user?.role === 'ADMIN';
  const userName = user?.name ?? 'Pengguna';
  const userEmail = user?.email ?? '';
  const userInitial = (user?.name ?? user?.email ?? 'U')[0].toUpperCase();

  return (
    <AppShell
      userName={userName}
      userEmail={userEmail}
      userInitial={userInitial}
      isAdmin={isAdmin}
    >
      {children}
    </AppShell>
  );
}
