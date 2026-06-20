import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan Nikah Yuk by Ratna Offset. Baca dengan seksama sebelum menggunakan platform undangan pernikahan digital kami.',
  alternates: { canonical: 'https://nikahyuk.id/syarat' },
};

export default function SyaratPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary hover:underline">← Kembali ke Beranda</Link>
        </div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Syarat & Ketentuan</h1>
        <p className="text-sm text-gray-400 mb-8">Terakhir diperbarui: Juni 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Penerimaan Syarat</h2>
            <p>Dengan menggunakan layanan Nikah Yuk by Ratna Offset, Anda menyetujui syarat dan ketentuan ini. Jika tidak setuju, harap tidak menggunakan layanan kami.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Layanan</h2>
            <p>Nikah Yuk menyediakan platform pembuatan undangan pernikahan digital berbasis web. Layanan aktif sesuai dengan durasi paket yang dipilih, dihitung sejak pembayaran berhasil diverifikasi.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Akun Pengguna</h2>
            <p>Anda bertanggung jawab menjaga kerahasiaan akun dan kata sandi Anda. Segala aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Pembayaran dan Refund</h2>
            <p>Semua pembayaran bersifat final. Kami tidak menyediakan pengembalian dana (refund) setelah undangan berhasil dibuat dan diaktifkan, kecuali terjadi kegagalan teknis dari pihak kami yang tidak dapat diselesaikan.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Konten Pengguna</h2>
            <p>Anda bertanggung jawab atas seluruh konten yang diunggah ke platform kami, termasuk foto, teks, dan informasi lainnya. Anda menjamin bahwa konten tersebut tidak melanggar hak cipta, privasi, atau hukum yang berlaku.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Batasan Tanggung Jawab</h2>
            <p>Nikah Yuk tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan. Layanan disediakan &quot;sebagaimana adanya&quot; (as-is) tanpa jaminan apapun.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Masa Aktif Layanan</h2>
            <p>Setelah masa aktif berakhir, undangan tidak dapat diakses oleh tamu. Anda dapat menghubungi admin untuk perpanjangan masa aktif sesuai ketentuan yang berlaku.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Perubahan Syarat</h2>
            <p>Kami berhak mengubah syarat dan ketentuan ini kapan saja. Penggunaan layanan secara berkelanjutan setelah perubahan dianggap sebagai penerimaan atas syarat yang baru.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Hukum yang Berlaku</h2>
            <p>Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah mufakat.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
