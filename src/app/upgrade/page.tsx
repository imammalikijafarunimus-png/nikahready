'use client'

import { useRequireAuth } from '@/context/AuthContext'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Lock,
  CheckCircle2,
  MessageCircle,
  Copy,
  Phone,
  Building2,
  QrCode,
  Clock,
} from 'lucide-react'
import { useState } from 'react'
import '../dashboard.css' // Reuse dashboard styles

// ── Config (dari .env.local) ─────────────────────────────────
// NEXT_PUBLIC_WA_NUMBER, NEXT_PUBLIC_BANK_NAME, NEXT_PUBLIC_BANK_ACC,
// NEXT_PUBLIC_BANK_HOLDER, NEXT_PUBLIC_QRIS_ACTIVE, NEXT_PUBLIC_PRO_PRICE
// Semua nilai di bawah diambil dari environment variable.
// Jika env kosong, gunakan fallback default.
const ADMIN_WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || ''

// ── Feature comparison data ──────────────────────────────────
const FREE_FEATURES = [
  '12 langkah pengenalan diri (termasuk Kriteria Pasangan & Review)',
  'Template Ringkas (1 halaman)',
  'Template Qonaah (2 halaman)',
  'Template Sakinah (1 halaman)',
  'Upload foto pribadi & formal',
  'Sosial Media (akun yang aktif)',
  'Anggota Keluarga',
  'Data tersimpan di cloud',
]

const PRO_FEATURES = [
  'Semua 22 langkah pengenalan diri',
  '6 template premium (Amanah, Syar\'i, Modern Dark)',
  'Financial Planning & alokasi keuangan',
  'Pandangan Isu (parenting, poligami, karir istri)',
  'Perjalanan Hidup & Riwayat Organisasi',
  'Gaya Hidup & Rencana Masa Depan',
  'Galeri Foto untuk CV',
  'Surat Taaruf & Referensi',
  'Harapan & Doa',
  'Download PDF siap bagikan',
  'Priority support',
]

const PRO_STEPS_NAMES = [
  'Perjalanan Hidup', 'Riwayat Organisasi', 'Gaya Hidup',
  'Financial Planning', 'Pandangan Isu', 'Rencana Masa Depan',
  'Galeri Foto', 'Surat Taaruf', 'Referensi', 'Harapan & Doa',
]

// ── Payment info (dari .env.local) ──────────────────────────
const PAYMENT_INFO = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || '-',
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACC || '-',
  accountName: process.env.NEXT_PUBLIC_BANK_HOLDER || '-',
  qrisActive: process.env.NEXT_PUBLIC_QRIS_ACTIVE === 'false',
  price: process.env.NEXT_PUBLIC_PRO_PRICE || '49.000',
}

// ── Helpers ──────────────────────────────────────────────────
function buildWaLink(email: string | null, nama: string | null) {
  const namaDisplay = nama || 'User NikahReady'
  const emailDisplay = email || '-'
  const message = `Assalamu'alaikum, saya ingin upgrade ke paket Pro NikahReady.\n\nNama: ${namaDisplay}\nEmail: ${emailDisplay}\nPaket: Pro (Rp 49.000 sekali bayar)\n\nMohon info cara pembayaran. Jazakallahu khairan 🤲`
  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-navy-800 border border-navy-700 text-navy-300 hover:text-white hover:border-gold-600 transition-all cursor-pointer"
      title={`Salin ${label}`}
    >
      <Copy size={12} />
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  )
}

// ── Main ────────────────────────────────────────────────────
export default function UpgradePage() {
  const { plan, userEmail, user } = useRequireAuth()
  const nama = user?.user_metadata?.nama || null

  return (
    <div className="dashboard-page">
      <div className="dashboard-pattern" aria-hidden="true" />
      <div className="dashboard-glow" aria-hidden="true" />

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-inner">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline">
            <ArrowLeft size={18} className="text-navy-400" />
            <span className="text-sm text-navy-400">Kembali ke Dashboard</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 pt-8 pb-12 relative z-10">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-900/30 border border-gold-700/40 text-gold-400 text-xs font-medium mb-4">
            <Sparkles size={14} />
            NikahReady Pro
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Lengkapi Perjalanan Taarufmu
          </h1>
          <p className="text-sm text-navy-400 max-w-lg mx-auto">
            {plan === 'premium'
              ? 'Kamu sudah menjadi pengguna Pro. Nikmati semua fitur premium!'
              : 'Upgrade ke Pro untuk membuka 10 langkah premium, template eksklusif, dan download PDF CV Taaruf.'
            }
          </p>
        </div>

        {/* ── Pricing Cards ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Free Plan */}
          <div className="rounded-2xl border border-navy-700 bg-navy-900/60 p-6">
            <h2 className="text-lg font-bold text-white mb-1">Gratis</h2>
            <p className="text-xs text-navy-500 mb-4">Untuk memulai perjalanan taaruf</p>
            <div className="text-3xl font-bold text-white mb-6">
              Rp 0<span className="text-sm font-normal text-navy-500">/selamanya</span>
            </div>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-navy-300">
                  <Check size={16} className="text-sage-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {plan === 'free' && (
              <div className="mt-6 px-3 py-2 rounded-lg bg-sage-900/20 border border-sage-700/30 text-center">
                <span className="text-xs text-sage-400 font-medium">✓ Paket kamu saat ini</span>
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-gold-600 bg-navy-900/80 p-6 relative shadow-gold">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Recommended
            </div>
            <h2 className="text-lg font-bold text-white mb-1">NikahReady Pro</h2>
            <p className="text-xs text-navy-500 mb-4">
              Untuk keseriusan & kelengkapan taaruf
            </p>
            <div className="text-3xl font-bold text-gold-400 mb-6">
              Rp {PAYMENT_INFO.price}
              <span className="text-sm font-normal text-navy-500">/sekali bayar</span>
            </div>

            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={`pro-${f}`} className="flex items-start gap-2 text-sm text-navy-300">
                  <Check size={16} className="text-sage-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
              <div className="border-t border-navy-700 my-2" />
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gold-300/90">
                  <Sparkles size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {plan === 'premium' ? (
              <div className="mt-6 px-3 py-2.5 rounded-xl bg-gold-900/20 border border-gold-700/30 text-center">
                <span className="text-xs text-gold-400 font-medium">✓ Kamu sudah Pro</span>
              </div>
            ) : (
              <a
                href={buildWaLink(userEmail, nama)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold active:scale-95 transition-all hover:from-gold-500 hover:to-gold-400 flex items-center justify-center gap-2 no-underline text-center"
              >
                <MessageCircle size={16} />
                Upgrade via WhatsApp — Rp {PAYMENT_INFO.price}
              </a>
            )}
          </div>
        </div>

        {/* ── Cara Pembayaran ──────────────────────────────── */}
        {plan !== 'premium' && (
          <div className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 mb-10">
            <h2 className="text-base font-bold text-white mb-2">
              Cara Pembayaran
            </h2>
            <p className="text-xs text-navy-500 mb-5">
              Pilih salah satu metode pembayaran di bawah ini
            </p>

            <div className="space-y-4">
              {/* Step 1: Hubungi via WA */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-900/40 border border-green-700/40 flex items-center justify-center text-xs font-bold text-green-400">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Klik tombol &quot;Upgrade via WhatsApp&quot;
                  </h3>
                  <p className="text-xs text-navy-400 leading-relaxed">
                    Kamu akan diarahkan ke WhatsApp admin NikahReady. Pesan otomatis sudah
                    berisi data kamu (nama & email) sehingga admin bisa langsung verifikasi.
                  </p>
                </div>
              </div>

              {/* Step 2: Transfer */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-900/40 border border-blue-700/40 flex items-center justify-center text-xs font-bold text-blue-400">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Transfer Pembayaran
                  </h3>

                  {/* Bank Transfer */}
                  <div className="rounded-xl border border-navy-700 bg-navy-900/60 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={14} className="text-blue-400" />
                      <span className="text-xs font-semibold text-white">
                        Transfer Bank
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-navy-500">Bank</span>
                        <span className="text-xs text-navy-300 font-medium">
                          {PAYMENT_INFO.bankName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-navy-500">Nomor Rekening</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white font-mono font-semibold">
                            {PAYMENT_INFO.accountNumber}
                          </span>
                          <CopyButton text={PAYMENT_INFO.accountNumber} label="nomor rekening" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-navy-500">Atas Nama</span>
                        <span className="text-xs text-navy-300 font-medium">
                          {PAYMENT_INFO.accountName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QRIS */}
                  {PAYMENT_INFO.qrisActive && (
                    <div className="rounded-xl border border-navy-700 bg-navy-900/60 p-4 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode size={14} className="text-purple-400" />
                        <span className="text-xs font-semibold text-white">
                          QRIS (GoPay, OVO, ShopeePay, Dana, dll)
                        </span>
                      </div>
                      <p className="text-xs text-navy-400 leading-relaxed">
                        Minta QRIS ke admin via WhatsApp. Admin akan mengirimkan gambar QRIS
                        yang bisa kamu scan langsung dari aplikasi e-wallet manapun.
                      </p>
                    </div>
                  )}

                  {/* E-wallet */}
                  <div className="rounded-xl border border-navy-700 bg-navy-900/60 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={14} className="text-emerald-400" />
                      <span className="text-xs font-semibold text-white">
                        E-Wallet
                      </span>
                    </div>
                    <p className="text-xs text-navy-400 leading-relaxed">
                      Tersedia juga pembayaran via GoPay, OVO, ShopeePay, atau Dana.
                      Minta nomor tujuan ke admin via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Kirim bukti */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-900/40 border border-amber-700/40 flex items-center justify-center text-xs font-bold text-amber-400">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Kirim Bukti Transfer
                  </h3>
                  <p className="text-xs text-navy-400 leading-relaxed">
                    Screenshot bukti transfer dan kirim ke admin via WhatsApp.
                    Admin akan memverifikasi dan mengaktifkan akun Pro kamu.
                  </p>
                </div>
              </div>

              {/* Step 4: Done */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-900/40 border border-gold-700/40 flex items-center justify-center text-xs font-bold text-gold-400">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    Akun Pro Aktif!
                  </h3>
                  <p className="text-xs text-navy-400 leading-relaxed">
                    Setelah diverifikasi, refresh halaman Dashboard kamu. Semua fitur
                    Pro akan langsung terbuka. Proses biasanya selesai dalam hitungan menit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Pro Steps Preview ────────────────────────────── */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 mb-8">
          <h2 className="text-base font-bold text-white mb-4">
            10 Langkah Premium yang Akan Terbuka
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {PRO_STEPS_NAMES.map((name) => (
              <div key={name} className="flex items-center gap-2 text-sm">
                <Sparkles
                  size={12}
                  className={plan === 'premium' ? 'text-gold-400' : 'text-navy-400'}
                />
                <span className={plan === 'premium' ? 'text-gold-300' : 'text-navy-400'}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust strip ──────────────────────────────────── */}
        <div className="dash-trust">
          <span className="dash-trust-item">
            <ShieldCheck size={12} className="text-sage-600 opacity-70" />
            Pembayaran Aman
          </span>
          <span className="dash-trust-item">
            <Clock size={12} className="text-sage-600 opacity-70" />
            Verifikasi Cepat
          </span>
          <span className="dash-trust-item">
            <Lock size={12} className="text-sage-600 opacity-70" />
            Data Terenkripsi
          </span>
          <span className="dash-trust-item">
            <CheckCircle2 size={12} className="text-sage-600 opacity-70" />
            Sekali Bayar Selamanya
          </span>
        </div>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <div className="mt-10 space-y-4">
          <h2 className="text-base font-bold text-white text-center mb-6">
            Pertanyaan Umum
          </h2>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              Apakah sekali bayar untuk selamanya?
            </h3>
            <p className="text-xs text-navy-400 leading-relaxed">
              Ya, pembayaran Rp 49.000 adalah satu kali. Tidak ada biaya bulanan
              atau tahunan. Setelah upgrade, kamu mendapat akses Pro selamanya.
            </p>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              Bagaimana cara bayarnya?
            </h3>
            <p className="text-xs text-navy-400 leading-relaxed">
              Klik tombol &quot;Upgrade via WhatsApp&quot; di atas, lalu admin akan
              memberikan info rekening BSI atau QRIS. Transfer sesuai nominal,
              kirim bukti transfer via WhatsApp, dan akun Pro kamu akan langsung
              aktif setelah verifikasi.
            </p>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              Berapa lama proses verifikasinya?
            </h3>
            <p className="text-xs text-navy-400 leading-relaxed">
              Biasanya dalam hitungan menit (jam operasional 08.00–22.00 WIB).
              Jika di luar jam operasional, akun akan diaktifkan keesokan harinya.
            </p>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              Metode pembayaran apa saja yang tersedia?
            </h3>
            <p className="text-xs text-navy-400 leading-relaxed">
              Transfer bank (BSI), QRIS (GoPay, OVO, ShopeePay, Dana, dan semua
              aplikasi e-wallet yang mendukung QRIS). Minta info lengkap ke admin
              via WhatsApp.
            </p>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">
              Apakah data saya aman?
            </h3>
            <p className="text-xs text-navy-400 leading-relaxed">
              Semua data dienkripsi dan disimpan di server yang aman. Kamu bisa
              menghapus data kapan saja dari Dashboard. Kami tidak membagikan
              data ke pihak ketiga.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}