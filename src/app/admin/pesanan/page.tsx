import { prisma } from '@/lib/prisma';

const statusLabel: Record<string, string> = {
  PAID: 'Berbayar',
  PENDING: 'Menunggu',
  EXPIRED: 'Kadaluarsa',
  FAILED: 'Gagal',
  REFUNDED: 'Refund',
};

const statusColor: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-blue-100 text-blue-700',
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
    take: 100,
  });

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
        <div className="text-sm text-gray-500">
          {orders.filter(o => o.status === 'PAID').length} berbayar ·{' '}
          <span className="font-medium text-gray-700">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ID</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Pengguna</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Metode</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Tanggal</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{order.id.slice(-8).toUpperCase()}</td>
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-900">{order.user.name ?? '-'}</div>
                  <div className="text-xs text-gray-400">{order.user.email}</div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{order.paymentMethod ?? '-'}</td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">Belum ada pesanan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
