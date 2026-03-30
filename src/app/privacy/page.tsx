// ============================================================
// src/app/privacy/page.tsx
// Kebijakan Privasi — NikahReady
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi NikahReady — bagaimana kami mengelola data kamu.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Nav back */}
      <nav className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur-sm border-b border-navy-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </Link>
          <h1 className="text-sm font-semibold text-white">Kebijakan Privasi</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-safe">
        <div className="prose prose prose-invert max-w-none">
          {/* Last updated */}
          <p className="text-xs text-navy-500 mb-8">
            Terakhir diperbarui: 29 Maret 2026
          </p>

          <h2 className="text-xl font-bold text-white">
            1. Data yang Kami Kumpulkan
          </h2>
          <p>
            NikahReady mengumpulkan data berikut dari yang kamu isi di form:
          </p>
          <ul>
            <li><strong>Data Pribadi:</strong> nama, tanggal lahir, domisili, status pernikahan, dll</li>
            <li><strong>Data Fisik &amp; Kesehatan:</strong> tinggi badan, berat badan, golongan darah, dll</li>
            <li><strong>Riwayat Pendidikan &amp; Pekerjaan:</strong> institusi, jurusan, posisi, tahun</li>
            <li><strong>Perjalanan Hidup:</strong> cerita per fase hidup, pelajaran &amp; hikmah</li>
            <li><strong>Karakter &amp; Kepribadian:</strong> sifat, kelebihan, kekurangan, MBTI, bahasa cinta</li>
            <li><strong>Ibadah &amp; Keislaman:</strong> mazhab, shalat, hafalan, kajian</li>
            <li><strong>Visi Misi Pernikahan:</strong> visi, peran suami/istri, tujuan pernikahan</li>
            <li><strong>Kriteria Pasangan:</strong> usia, domisili, pendidikan, ibadah</li>
            <li><strong>Financial Planning:</strong> penghasilan, alokasi keuangan</li>
            <li><strong>Pandangan Isu:</strong> istri bekerja, KB, parenting, mertua</li>
            <li><strong>Anggota Keluarga:</strong> nama, pekerjaan, pendidikan</li>
            <li><strong>Sosial Media &amp; Kontak:</strong> platform, username</li>
            <li><strong>Foto:</strong> foto profil dan foto formal (disimpan di Supabase Storage)</li>
          </ul>

          <h2 className="text-xl font-bold text-white">
            2. Bagaimana Kami Menggunakan Data
          </h2>
          <p>
            Data yang kamu isi digunakan <strong>hanya</strong> untuk:
          </p>
          <ul>
            <li>Mengisi Lembar Taaruf (CV Taaruf) yang bisa kamu download sebagai PDF.</li>
            <li>Menyimpan progress form secara otomatis (localStorage dan Supabase) agar kamu bisa melanjutkan nanti.</li>
            <li>Menampilkan preview CV sebelum diunduh.</li>
          </ul>
          <p>
            Kami <strong>tidak</strong> menggunakan data kamu untuk:
          </p>
          <ul>
            <li>Matchmaking otomatis atau algoritma pencarian pasangan.</li>
            <li>Menampilkan profil ke publik.</li>
            <li>Menjual data ke pihak ketiga manapun.</li>
            <li>Mengirim notifikasi tanpa izin kamu.</li>
          </ul>

          <h2 className="text-xl font-bold text-white">
            3. Penyimpanan Data
          </h2>
          <p><strong>Browser (localStorage):</strong></p>
          <p>
            Form secara otomatis menyimpan progress ke localStorage browser kamu
            (dengan label &quot;Catatan Sementara&quot;). Data ini hanya tersimpan di
            perangkatmu dan tidak dikirim ke server manapun. Data ini bisa hilang
            jika kamu menghapus data browser.
          </p>
          <p><strong>Server (Supabase):</strong></p>
          <p>
            Saat kamu login dan menyimpan, data dikirim ke Supabase (cloud database).
            Penyimpanan dilindungi oleh:
          </p>
          <ul>
            <li><strong>Enkripsi di transit:</strong> semua koneksi ke Supabase menggunakan HTTPS/TLS.</li>
            <li><strong>Row Level Security (RLS):</strong> setiap user hanya bisa akses data miliknya sendiri. Tidak ada user yang bisa melihat data user lain.</li>
            <li><strong>Akun terpisah:</strong> data tidak dicampur dengan user lain dalam database.</li>
          </ul>

          <h2 className="text-xl font-bold text-white">
            4. Foto
          </h2>
          <p>
            Foto yang kamu upload (profil dan galeri) disimpan di Supabase Storage.
            Akses foto diatur oleh RLS policy — hanya pemilik yang bisa melihat
            dan menghapus fotonya sendiri.
          </p>

          <h2 className="text-xl font-bold text-white">
            5. Berapa Kami Tidak Meminta Data yang Tidak Perlu
          </h2>
          <p>
            Kami tidak meminta: lokasi GPS, nomor telepon (kecuali yang kamu
            isi di sosial media), riwayat browser, data perangkat, atau
            informasi dari aplikasi lain.
          </p>

          <h2 className="text-xl font-bold text-white">
            6. Penghapusan Data
          </h2>
          <p>
            Kamu bisa menghapus data kapan saja dengan cara:
          </p>
          <ul>
            <li><strong>Hapus dari localStorage:</strong> buka Developer Tools &gt; Application &gt; Local Storage &gt; hapus &quot;nikahready_&quot; items.</li>
            <li><strong>Hapus dari Supabase:</strong> hubungi kami via email (lihat footer) atau hapus akun Supabase.</li>
            <li><strong>Hapus akun:</strong> saat akun dihapus, semua data terkait akan otomatis dihapus (ON DELETE CASCADE).</li>
          </ul>

          <h2 className="text-xl font-bold text-white">
            7. Cookie
          </h2>
          <p>
            NikahReady menggunakan cookie dari Supabase Auth untuk menyimpan sesi login
            agar kamu tidak perlu login ulang setiap kali. Cookie ini berlaku 1 tahun.
          </p>

          <h2 className="text-xl font-bold text-white">
            8. Perubahan Kebijakan Privasi
          </h2>
          <p>
            Jika kami mengubah kebijakan privasi ini, kami akan memperbarui halaman ini
            dan memberitahu melalui notifikasi di dalam aplikasi (atau email jika
            kamu berlangganan).
          </p>

          <h2 className="text-xl font-bold text-white">
            9. Hubungi Kami
          </h2>
          <p>
            Pertanyaan tentang privasi? Hubungi kami di:
          </p>
          <ul>
            <li>Email: <strong>privasi@nikahready.id</strong></li>
            <li>Instagram: <a href="https://instagram.com/nikahready.id" target="_blank" rel="noopener noreferrer">@nikahready.id</a></li>
          </ul>

          <div className="mt-12 p-4 rounded-xl bg-navy-900/60 border border-navy-800">
            <p className="text-sm text-navy-300 font-medium mb-2">
              Dibuat dengan cinta untuk umat.
            </p>
            <p className="text-xs text-navy-500">
              Jujur · Bermartabat · Hangat
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
