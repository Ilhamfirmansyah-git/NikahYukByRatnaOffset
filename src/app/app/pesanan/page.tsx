import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RetryPaymentButton from './RetryPaymentButton';

export const dynamic = 'force-dynamic';

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', className: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Lunas', className: 'bg-green-100 text-green-800' },
  EXPIRED: { label: 'Kadaluarsa', className: 'bg-gray-100 text-gray-600' },
  FAILED: { label: 'Gagal', className: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Dikembalikan', className: 'bg-orange-100 text-orange-700' },
};

export default async function PesananPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = (session.user as { id?: string })?.id;
  if (!userId) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      invitation: { select: { id: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const templateIds = Array.from(new Set(orders.map(o => o.templateId)));
  const templates = await prisma.template.findMany({ where: { id: { in: templateIds } } });
  const templateMap = Object.fromEntries(templates.map(t => [t.id, t.name]));

  const packageIds = Array.from(new Set(orders.map(o => o.packageId)));
  const packages = await prisma.package.findMany({ where: { id: { in: packageIds } } });
  const packageMap = Object.fromEntries(packages.map(p => [p.id, p.name]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-gray-900">Pesanan Saya</h1>
        <p className="text-gray-500 mt-1">Riwayat pembelian dan status pembayaran Anda.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-cream-200 p-16 text-center">
          <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-4">Belum ada pesanan.</p>
          <Link
            href="/app/beli"
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Beli Paket Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const badge = STATUS_BADGE[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
            const templateName = templateMap[order.templateId] ?? order.templateId;
            const packageName = packageMap[order.packageId] ?? order.packageId;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-cream-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                      {order.couponCode && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          Kupon: {order.couponCode}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {packageName} — {templateName}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {order.status === 'PENDING' && (
                      <p className="text-xs text-yellow-600 font-medium">
                        Menunggu pembayaran — segera selesaikan pembayaran Anda.
                      </p>
                    )}
                  </div>

                  <div className="text-right space-y-1 flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">{formatRupiah(order.amount)}</p>
                    {order.discountAmount > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        Hemat {formatRupiah(order.discountAmount)}
                      </p>
                    )}
                    {order.status === 'PENDING' && (
                      <RetryPaymentButton orderId={order.id} />
                    )}
                    {order.status === 'PAID' && order.invitation && (
                      <Link
                        href={`/app/undangan/${order.invitation.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Edit Undangan →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
