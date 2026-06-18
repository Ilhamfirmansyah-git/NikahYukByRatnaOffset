import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

function AttendanceBadge({ attendance }: { attendance: string }) {
  const map: Record<string, { label: string; className: string }> = {
    HADIR: { label: 'Hadir', className: 'bg-green-100 text-green-700' },
    TIDAK_HADIR: { label: 'Tidak Hadir', className: 'bg-red-100 text-red-700' },
    RAGU: { label: 'Masih Ragu', className: 'bg-yellow-100 text-yellow-700' },
  };
  const config = map[attendance] ?? { label: attendance, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default async function RsvpPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const userId = (session.user as { id?: string })?.id;

  const invitation = await prisma.invitation.findUnique({
    where: { id: params.id },
    include: {
      rsvps: { orderBy: { createdAt: 'desc' } },
      guestbook: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!invitation || invitation.userId !== userId) redirect('/app');

  const hadirCount = invitation.rsvps.filter(r => r.attendance === 'HADIR').length;
  const tidakHadirCount = invitation.rsvps.filter(r => r.attendance === 'TIDAK_HADIR').length;
  const raguCount = invitation.rsvps.filter(r => r.attendance === 'RAGU').length;
  const totalTamu = invitation.rsvps.filter(r => r.attendance === 'HADIR').reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-gray-900">RSVP & Buku Tamu</h1>
        <p className="text-gray-500 mt-1">Data konfirmasi kehadiran dan pesan dari tamu.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-cream-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{hadirCount}</p>
          <p className="text-sm text-gray-500 mt-1">Hadir</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{tidakHadirCount}</p>
          <p className="text-sm text-gray-500 mt-1">Tidak Hadir</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{raguCount}</p>
          <p className="text-sm text-gray-500 mt-1">Masih Ragu</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4 text-center">
          <p className="text-3xl font-bold text-primary">{totalTamu}</p>
          <p className="text-sm text-gray-500 mt-1">Total Tamu Hadir</p>
        </div>
      </div>

      {/* RSVP table */}
      <div className="bg-white rounded-xl border border-cream-200 mb-6">
        <div className="p-6 border-b border-cream-100">
          <h2 className="font-semibold text-gray-900">
            Konfirmasi Kehadiran <span className="text-gray-400 font-normal">({invitation.rsvps.length})</span>
          </h2>
        </div>
        {invitation.rsvps.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Belum ada konfirmasi kehadiran</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Nama</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Jumlah Tamu</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-50">
                {invitation.rsvps.map(rsvp => (
                  <tr key={rsvp.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{rsvp.name}</td>
                    <td className="px-6 py-4">
                      <AttendanceBadge attendance={rsvp.attendance} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rsvp.guestCount} orang</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(rsvp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guestbook */}
      <div className="bg-white rounded-xl border border-cream-200">
        <div className="p-6 border-b border-cream-100">
          <h2 className="font-semibold text-gray-900">
            Buku Tamu <span className="text-gray-400 font-normal">({invitation.guestbook.length})</span>
          </h2>
        </div>
        {invitation.guestbook.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Belum ada pesan dari tamu</div>
        ) : (
          <div className="divide-y divide-cream-100">
            {invitation.guestbook.map(entry => (
              <div key={entry.id} className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm font-semibold">{entry.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{entry.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{entry.message}</p>
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
