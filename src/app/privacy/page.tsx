import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-sage-400 hover:text-sage-300 transition-colors mb-8 inline-block">
          &larr; Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-bold mb-8">Kebijakan Privasi</h1>
        <p className="text-navy-400 text-sm mb-8">Terakhir diperbarui: April 2025</p>

        <div className="space-y-6 text-navy-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">1. Pendahuluan</h2>
            <p>NikahReady berkomitmen untuk melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan layanan NikahReady.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">2. Data yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan data yang Anda berikan secara sukarela melalui formulir CV Taaruf, termasuk namun tidak terbatas pada: data pribadi (nama, tanggal lahir, domisili), informasi fisik dan kesehatan, riwayat pendidikan dan pekerjaan, informasi keagamaan, visi pernikahan, dan foto yang diunggah. Kami juga mengumpulkan data teknis seperti alamat IP, jenis browser, dan data penggunaan untuk keperluan analitik.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">3. Penggunaan Data</h2>
            <p>Data Anda digunakan untuk: (a) membuat dan menyimpan CV Taaruf Anda, (b) menampilkan preview dan menghasilkan file PDF, (c) menyediakan fitur berbagi dengan pihak yang Anda otorisasi, (d) meningkatkan kualitas layanan, dan (e) keperluan keamanan sistem. Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">4. Keamanan Data</h2>
            <p>Kami menggunakan enkripsi SSL/TLS, autentikasi berlapis, dan penyimpanan aman untuk melindungi data Anda. Meskipun demikian, tidak ada sistem yang 100% aman. Kami menganjurkan Anda untuk tidak membagikan informasi sensitif berlebihan.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">5. Hak Pengguna</h2>
            <p>Anda berhak untuk: (a) mengakses data pribadi Anda, (b) meminta perbaikan data yang tidak akurat, (c) meminta penghapusan data Anda, dan (d) menarik persetujuan penggunaan data. Untuk permintaan tersebut, hubungi kami melalui WhatsApp di 0889-8050-7501.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">6. Penyimpanan Data</h2>
            <p>Data Anda disimpan selama akun Anda aktif. Jika Anda menghapus akun, data akan dihapus secara permanen dalam waktu 30 hari kerja, kecuali jika penyimpanan diperlukan oleh hukum.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">7. Perubahan Kebijakan</h2>
            <p>Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di dalam aplikasi.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">8. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui WhatsApp di{' '}
              <a href="https://wa.me/6288980507501" className="text-sage-400 hover:text-sage-300 underline" target="_blank" rel="noopener noreferrer">
                0889-8050-7501
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}