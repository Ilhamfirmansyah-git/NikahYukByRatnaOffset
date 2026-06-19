import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DevSeedButton } from './DevSeedButton';

interface InvData {
  mempelai?: {
    pria?: { namaPanggilan?: string; namaLengkap?: string };
    wanita?: { namaPanggilan?: string; namaLengkap?: string };
  };
  acara?: Array<{ nama?: string; tanggal?: string }>;
}

function getCoupleName(data: unknown): { pria: string; wanita: string } {
  const d = data as InvData;
  return {
    pria: d?.mempelai?.pria?.namaPanggilan || d?.mempelai?.pria?.namaLengkap || '',
    wanita: d?.mempelai?.wanita?.namaPanggilan || d?.mempelai?.wanita?.namaLengkap || '',
  };
}

function getFirstEventDate(data: unknown): string {
  const d = data as InvData;
  const first = d?.acara?.[0];
  if (!first?.tanggal) return '';
  return new Date(first.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ isPublished, expiresAt }: { isPublished: boolean; expiresAt: Date | null }) {
  const isExpired = expiresAt && expiresAt < new Date();
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
        Kadaluarsa
      </span>
    );
  }
  if (isPublished) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
        Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
      Draft
    </span>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const userName = session?.user?.name ?? 'Pengguna';
  const firstName = userName.split(' ')[0];

  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: { template: true, rsvps: true, _count: { select: { visits: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const totalRsvp = invitations.reduce((sum, inv) => sum + inv.rsvps.length, 0);
  const totalVisits = invitations.reduce((sum, inv) => sum + inv._count.visits, 0);
  const activeInvitations = invitations.filter(inv => inv.isPublished && (!inv.expiresAt || inv.expiresAt > new Date()));
  const nearestExpiry = activeInvitations.length > 0 && activeInvitations[0].expiresAt
    ? new Date(activeInvitations[0].expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-primary font-medium">Selamat datang</p>
          <h1 className="text-2xl font-display font-semibold text-gray-900">{firstName} 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">Kelola undangan pernikahan digital Anda</p>
        </div>
        {process.env.MIDTRANS_IS_PRODUCTION !== 'true' && <DevSeedButton />}
      </div>

      {/* Stat cards — 2×2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-cream-200 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">Undangan Aktif</span>
            <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeInvitations.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">dari {invitations.length} total</p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">Total RSVP</span>
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalRsvp}</p>
          <p className="text-xs text-gray-400 mt-0.5">konfirmasi hadir</p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">Kunjungan</span>
            <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalVisits}</p>
          <p className="text-xs text-gray-400 mt-0.5">total tayangan</p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">Masa Berlaku</span>
            <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {nearestExpiry ? (
            <>
              <p className="text-base font-bold text-gray-900 leading-tight">{nearestExpiry}</p>
              <p className="text-xs text-gray-400 mt-0.5">undangan aktif</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-300">—</p>
              <p className="text-xs text-gray-400 mt-0.5">belum ada aktif</p>
            </>
          )}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Undangan Saya</h2>
        <Link
          href="/app/beli"
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Baru
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-display font-semibold text-gray-800 mb-1">Belum ada undangan</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Mulai buat undangan pernikahan digital yang elegan dan mudah dibagikan kepada tamu.
          </p>
          <Link
            href="/app/beli"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors text-sm shadow-sm shadow-primary/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Beli Paket Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {invitations.map((inv) => {
            const { pria, wanita } = getCoupleName(inv.data);
            const coupleName = pria && wanita ? `${pria} & ${wanita}` : pria || wanita;
            const eventDate = getFirstEventDate(inv.data);
            const isExpired = inv.expiresAt && inv.expiresAt < new Date();
            const expiresText = inv.expiresAt
              ? `Aktif s/d ${new Date(inv.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
              : null;

            return (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-md hover:border-cream-300 transition-all duration-200"
              >
                {/* Card header */}
                <div className={`px-5 pt-5 pb-4 ${inv.isPublished && !isExpired ? 'bg-gradient-to-br from-primary-50 via-white to-cream-50' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-xl border border-cream-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <StatusBadge isPublished={inv.isPublished} expiresAt={inv.expiresAt} />
                  </div>

                  <h3 className="font-display font-semibold text-gray-900 text-xl leading-tight mb-0.5">
                    {coupleName || 'Undangan Pernikahan'}
                  </h3>
                  <p className="text-xs text-gray-400">{inv.template.name}</p>

                  {(eventDate || expiresText) && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {eventDate && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {eventDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="px-5 py-3 border-y border-cream-100 flex items-center gap-5 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong className="text-gray-700">{inv._count.visits}</strong> kunjungan</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong className="text-gray-700">{inv.rsvps.length}</strong> RSVP</span>
                  </span>
                  {expiresText && (
                    <span className="ml-auto text-gray-400 truncate">{expiresText}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="px-5 py-4 flex items-center gap-2">
                  <Link
                    href={`/app/undangan/${inv.id}/edit`}
                    className="flex-1 py-2.5 bg-primary text-white text-sm text-center rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-sm shadow-primary/20"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/app/undangan/${inv.id}/tamu`}
                    className="flex-1 py-2.5 text-gray-700 text-sm text-center rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    Tamu
                  </Link>
                  <Link
                    href={`/app/undangan/${inv.id}/rsvp`}
                    className="flex-1 py-2.5 text-gray-700 text-sm text-center rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    RSVP
                  </Link>
                  {inv.isPublished && !isExpired && (
                    <a
                      href={`/u/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-gray-400 hover:text-primary rounded-xl hover:bg-cream-50 border border-gray-200 transition-colors flex-shrink-0"
                      title="Lihat undangan"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
