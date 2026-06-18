import { prisma } from '@/lib/prisma';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { invitations: true, orders: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengguna</h1>
        <span className="text-sm text-gray-500">{users.length} total</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Nama</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Role</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Undangan</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Pesanan</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Bergabung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{user.name ?? '-'}</td>
                <td className="px-5 py-3 text-gray-500">{user.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-700">{user._count.invitations}</td>
                <td className="px-5 py-3 text-gray-700">{user._count.orders}</td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">Belum ada pengguna</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
