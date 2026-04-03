'use client'

import { useRequireAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ArrowLeft, Check, Sparkles, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'
import '../dashboard.css' // Reuse dashboard styles

// ── Feature comparison data ──────────────────────────────────
const FREE_FEATURES = [
  '12 langkah pengenalan diri (termasuk Kriteria Pasangan & Review)',
  'Template Ringkas (1 halaman)',
  'Template Sederhana (2 halaman)',
  'Template Minimal Islami (1 halaman)',
  'Upload foto pribadi & formal',
  'Sosial Media (akun yang aktif)',
  'Anggota Keluarga',
  'Data tersimpan di cloud',
]

const PRO_FEATURES = [
  'Semua 22 langkah pengenalan diri',
  '6 template premium (Akademik, Elegant Islamic, Modern Dark)',
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
  'Galeri Foto', 'Surat Taaruf', 'Referensi', 'Harapan & Doa'
]

export default function UpgradePage() {
  const { plan } = useRequireAuth()

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
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Plan */}
          <div className="rounded-2xl border border-navy-700 bg-navy-900/60 p-6">
            <h2 className="text-lg font-bold text-white mb-1">Gratis</h2>
            <p className="text-xs text-navy-500 mb-4">Untuk memulai perjalanan taaruf</p>
            <div className="text-3xl font-bold text-white mb-6">Rp 0<span className="text-sm font-normal text-navy-500">/selamanya</span></div>

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
            <p className="text-xs text-navy-500 mb-4">Untuk keseriusan & kelengkapan taaruf</p>
            <div className="text-3xl font-bold text-gold-400 mb-6">Rp 49.000<span className="text-sm font-normal text-navy-500">/sekali bayar</span></div>

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
              <button
                className="w-full mt-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold active:scale-95 transition-all cursor-pointer border-0 hover:from-gold-500 hover:to-gold-400"
                onClick={() => alert('Fitur pembayaran segera hadir! Hubungi admin@nikahready.com untuk info.')}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Upgrade Sekarang — Rp 49.000
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ── Pro Steps Preview ────────────────────────────── */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 mb-8">
          <h2 className="text-base font-bold text-white mb-4">10 Langkah Premium yang Akan Terbuka</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {PRO_STEPS_NAMES.map((name) => (
              <div key={name} className="flex items-center gap-2 text-sm">
                <span className={plan === 'premium' ? 'text-sage-400' : 'text-navy-400'}>{name}</span>
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
            <Lock size={12} className="text-sage-600 opacity-70" />
            Data Terenkripsi
          </span>
          <span className="dash-trust-item">
            <CheckCircle2 size={12} className="text-sage-600 opacity-70" />
            Garansi Uang Kembali
          </span>
        </div>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <div className="mt-10 space-y-4">
          <h2 className="text-base font-bold text-white text-center mb-6">Pertanyaan Umum</h2>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Apakah sekali bayar untuk selamanya?</h3>
            <p className="text-xs text-navy-400 leading-relaxed">Ya, pembayaran Rp 49.000 adalah satu kali. Tidak ada biaya bulanan atau tahunan. Setelah upgrade, kamu mendapat akses Pro selamanya.</p>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Apa bedanya plan gratis dan Pro?</h3>
            <p className="text-xs text-navy-400 leading-relaxed">Plan gratis memberikan 12 langkah pengenalan diri (Data Pribadi sampai Review & Simpan), foto pribadi, sosial media, dan 3 template. Pro membuka semua 22 langkah termasuk Perjalanan Hidup, Gaya Hidup, Financial Planning, Galeri Foto, Surat Taaruf, dan 6 template premium.</p>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Apakah data saya aman?</h3>
            <p className="text-xs text-navy-400 leading-relaxed">Semua data dienkripsi dan disimpan di server yang aman. Kamu bisa menghapus data kapan saja dari Dashboard. Kami tidak membagikan data ke pihak ketiga.</p>
          </div>
        </div>
      </main>
    </div>
  )
}