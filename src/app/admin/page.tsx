import { prisma } from '@/lib/prisma';

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default async function AdminPage() {
  const [userCount, orderCount, invitationCount, revenueAgg] = await Promise.all([
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.invitation.count(),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.amount ?? 0;
  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(totalRevenue);

  const recentOrders = await prisma.order.findMany({
    where: { status: 'PAID' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Pengguna" value={userCount} />
        <StatCard label="Pesanan Berbayar" value={orderCount} />
        <StatCard label="Total Undangan" value={invitationCount} />
        <StatCard label="Total Pendapatan" value={formattedRevenue} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Pengguna</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Tanggal</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td className="px-5 py-3 font-medium text-gray-900">{order.user.name ?? '-'}</td>
                <td className="px-5 py-3 text-gray-500">{order.user.email}</td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">Belum ada pesanan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
