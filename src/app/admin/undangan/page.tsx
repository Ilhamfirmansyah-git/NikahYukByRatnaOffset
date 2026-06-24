import { prisma } from '@/lib/prisma';
import { InvitationData } from '@/types/invitation';
import Link from 'next/link';
import ExtendButton from './ExtendButton';

export default async function AdminInvitationsPage() {
  const [invitations, packages] = await Promise.all([
    prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        template: { select: { name: true } },
        order: { select: { packageId: true } },
        _count: { select: { rsvps: true, guestbook: true } },
      },
      take: 100,
    }),
    prisma.package.findMany({ select: { id: true, name: true, durationDays: true } }),
  ]);

  const pkgMap = new Map(packages.map(p => [p.id, p]));
  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Undangan</h1>
        <span className="text-sm text-gray-500">{invitations.length} total</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium">Undangan</th>
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium">Pemilik</th>
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Template / Paket</th>
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium">RSVP</th>
              <th className="text-left px-4 sm:px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Masa Berlaku</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invitations.map(inv => {
              const data = inv.data as unknown as InvitationData;
              const pria = data.mempelai?.pria?.namaPanggilan;
              const wanita = data.mempelai?.wanita?.namaPanggilan;
              const title = pria && wanita ? `${pria} & ${wanita}` : `/${inv.slug}`;
              const isExpired = inv.expiresAt && inv.expiresAt < now;
              const pkg = inv.order?.packageId ? pkgMap.get(inv.order.packageId) : null;

              return (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-5 py-3">
                    <div className="font-medium text-gray-900">{title}</div>
                    <Link href={`/u/${inv.slug}`} target="_blank" className="text-xs text-blue-500 hover:underline">
                      /{inv.slug}
                    </Link>
                  </td>
                  <td className="px-4 sm:px-5 py-3">
                    <div className="text-gray-700">{inv.user.name ?? '-'}</div>
                    <div className="text-xs text-gray-400">{inv.user.email}</div>
                  </td>
                  <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                    <div className="text-gray-700">{inv.template.name}</div>
                    {pkg && (
                      <div className="text-xs text-gray-400">
                        {pkg.name} · {pkg.durationDays} hari
                      </div>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3">
                    {isExpired ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Kadaluarsa</span>
                    ) : inv.isPublished ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Aktif</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Draft</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-gray-700">{inv._count.rsvps}</td>
                  <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                    <ExtendButton
                      invitationId={inv.id}
                      currentExpiresAt={inv.expiresAt?.toISOString() ?? null}
                    />
                  </td>
                </tr>
              );
            })}
            {invitations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">Belum ada undangan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
