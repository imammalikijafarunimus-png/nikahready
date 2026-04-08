import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-sage-400 hover:text-sage-300 transition-colors mb-8 inline-block">
          &larr; Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-bold mb-8">Syarat Penggunaan</h1>
        <p className="text-navy-400 text-sm mb-8">Terakhir diperbarui: April 2025</p>

        <div className="space-y-6 text-navy-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">1. Penerimaan Syarat</h2>
            <p>Dengan menggunakan layanan NikahReady, Anda menyetujui Syarat Penggunaan ini. Jika Anda tidak menyetujui syarat-syarat ini, harap tidak menggunakan layanan kami.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">2. Tentang Layanan</h2>
            <p>
              NikahReady adalah alat bantu untuk membuat CV Taaruf (dokumen perkenalan diri untuk keperluan taaruf/pernikahan). NikahReady bukan platform kencan, bukan layanan matching, dan bukan layanan perjodohan. Kami hanya menyediakan alat yang membantu pengguna memperkenalkan diri secara bermartabat dalam konteks pernikahan Islam.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">3. Tanggung Jawab Pengguna</h2>
            <p>Anda bertanggung jawab penuh atas: (a) kebenaran informasi yang Anda masukkan, (b) kerahasiaan akun dan password Anda, (c) penggunaan fitur berbagi secara bijak, dan (d) tidak menggunakan layanan untuk tujuan yang melanggar hukum, syariat Islam, atau norma kesusilaan.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">4. Konten Pengguna</h2>
            <p>Anda mempertahankan kepemilikan atas data yang Anda masukkan. Dengan menggunakan NikahReady, Anda memberikan izin kepada kami untuk menyimpan, memproses, dan menampilkan data Anda sesuai fungsi layanan (preview CV, generate PDF, berbagi link).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">5. Batasan Tanggung Jawab</h2>
            <p>NikahReady tidak bertanggung jawab atas: (a) keakuratan informasi yang dimasukkan pengguna, (b) kerugian yang timbul dari penggunaan layanan, (c) penyalahgunaan data oleh pihak yang menerima link berbagi dari pengguna. Kami menyarankan pengguna untuk berhati-hati dalam berbagi informasi pribadi.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">6. Akun Premium</h2>
            <p>Layanan premium berbayar memberikan akses ke fitur tambahan (template premium, data lengkap). Pembayaran yang telah dilakukan tidak dapat dikembalikan. Kami berhak mengubah harga dan fitur premium dengan pemberitahuan sebelumnya.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">7. Penghentian</h2>
            <p>Kami berhak menghentikan akses pengguna yang melanggar syarat penggunaan ini. Pengguna juga dapat menghapus akun kapan saja melalui pengaturan akun atau menghubungi kami.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">8. Hukum yang Berlaku</h2>
            <p>Syarat Penggunaan ini tunduk pada hukum Republik Indonesia.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">9. Hubungi Kami</h2>
            <p>
              Untuk pertanyaan tentang Syarat Penggunaan, hubungi kami melalui WhatsApp di{' '}
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