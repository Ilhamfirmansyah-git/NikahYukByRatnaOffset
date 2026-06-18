import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DevSeedButton } from './DevSeedButton';

function StatusBadge({ isPublished, expiresAt }: { isPublished: boolean; expiresAt: Date | null }) {
  const isExpired = expiresAt && expiresAt < new Date();
  if (isExpired) {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">Kadaluarsa</span>;
  }
  if (isPublished) {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">Aktif</span>;
  }
  return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">Draft</span>;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: { template: true, rsvps: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalRsvp = invitations.reduce((sum, inv) => sum + inv.rsvps.length, 0);
  const activeInvitations = invitations.filter(inv => inv.isPublished && (!inv.expiresAt || inv.expiresAt > new Date()));

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">
            Selamat datang, {session?.user?.name ?? 'Pengguna'}!
          </h1>
          <p className="text-gray-500 mt-1">Kelola undangan pernikahan Anda di sini.</p>
        </div>
        {process.env.MIDTRANS_IS_PRODUCTION !== 'true' && (
          <DevSeedButton />
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Undangan Aktif</span>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeInvitations.length}</p>
          <p className="text-xs text-gray-400 mt-1">dari {invitations.length} total undangan</p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total RSVP</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalRsvp}</p>
          <p className="text-xs text-gray-400 mt-1">konfirmasi kehadiran</p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Masa Berlaku</span>
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {activeInvitations.length > 0 && activeInvitations[0].expiresAt ? (
            <>
              <p className="text-lg font-bold text-gray-900">
                {new Date(activeInvitations[0].expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-400 mt-1">undangan aktif terbaru</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-gray-400">-</p>
              <p className="text-xs text-gray-400 mt-1">belum ada undangan aktif</p>
            </>
          )}
        </div>
      </div>

      {/* Invitations list */}
      <div className="bg-white rounded-xl border border-cream-200">
        <div className="p-6 border-b border-cream-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Undangan Saya</h2>
          <Link
            href="/app/beli"
            className="text-sm text-primary hover:text-primary-700 font-medium"
          >
            + Buat Baru
          </Link>
        </div>

        {invitations.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum ada undangan</h3>
            <p className="text-gray-400 mb-6 text-sm">Mulai buat undangan pernikahan digital Anda yang pertama!</p>
            <Link
              href="/app/beli"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm"
            >
              Beli Paket Sekarang
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-cream-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {(inv.data as { mempelai?: { pria?: { namaPanggilan?: string }; wanita?: { namaPanggilan?: string } } })?.mempelai?.pria?.namaPanggilan && (inv.data as { mempelai?: { pria?: { namaPanggilan?: string }; wanita?: { namaPanggilan?: string } } })?.mempelai?.wanita?.namaPanggilan
                        ? `${(inv.data as { mempelai?: { pria?: { namaPanggilan?: string }; wanita?: { namaPanggilan?: string } } })?.mempelai?.pria?.namaPanggilan} & ${(inv.data as { mempelai?: { pria?: { namaPanggilan?: string }; wanita?: { namaPanggilan?: string } } })?.mempelai?.wanita?.namaPanggilan}`
                        : `Undangan ${inv.template.name}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">/{inv.slug} · {inv.rsvps.length} RSVP</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge isPublished={inv.isPublished} expiresAt={inv.expiresAt} />
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/app/undangan/${inv.id}/edit`}
                      className="text-xs text-primary hover:text-primary-700 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/app/undangan/${inv.id}/tamu`}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Tamu
                    </Link>
                    <Link
                      href={`/app/undangan/${inv.id}/rsvp`}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      RSVP
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
