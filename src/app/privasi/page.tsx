import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Kebijakan Privasi — Nikah Yuk' };

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary hover:underline">← Kembali ke Beranda</Link>
        </div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-400 mb-8">Terakhir diperbarui: Juni 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, dan nomor telepon saat mendaftar atau menggunakan layanan kami. Kami juga mengumpulkan data penggunaan secara otomatis untuk meningkatkan kualitas layanan.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Menyediakan, mengoperasikan, dan meningkatkan layanan undangan digital kami</li>
              <li>Memproses transaksi pembayaran Anda</li>
              <li>Mengirimkan informasi terkait layanan dan pembaruan</li>
              <li>Merespons pertanyaan dan memberikan dukungan pelanggan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Keamanan Data</h2>
            <p>Kami menggunakan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi informasi pribadi Anda dari akses tidak sah, penggunaan yang salah, atau pengungkapan. Pembayaran diproses melalui Midtrans yang bersertifikat PCI-DSS.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Berbagi Informasi</h2>
            <p>Kami tidak menjual, memperdagangkan, atau mengalihkan informasi pribadi Anda kepada pihak ketiga kecuali diperlukan untuk menjalankan layanan (misalnya pemrosesan pembayaran) atau diwajibkan oleh hukum yang berlaku.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Hak Anda</h2>
            <p>Anda berhak mengakses, memperbaiki, atau menghapus informasi pribadi Anda. Untuk permintaan terkait data pribadi, silakan hubungi kami melalui WhatsApp atau email yang tertera di halaman kontak.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Perubahan Kebijakan</h2>
            <p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform kami.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
