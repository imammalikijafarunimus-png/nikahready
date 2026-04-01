// ============================================================
// src/app/page.tsx
// NikahReady Landing Page — Enterprise + Conversion Optimized
// ============================================================

import Link from "next/link"
import { LandingNav } from "@/components/LandingNav"
import { TemplatePreviewSection } from "@/components/TemplatePreviewSection"
import {
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
} from "lucide-react"
import { components } from "@/lib/design-system"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">

      <LandingNav />

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20 text-center px-6">
        <div className="max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-xs text-navy-300 mb-6">
            <span className="w-2 h-2 bg-sage-400 rounded-full" />
            Bukan Aplikasi Kencan
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Taaruf Tanpa Drama.
            <span className="text-sage-400 block">
              Tetap Bermartabat.
            </span>
          </h1>

          <p className="mt-6 text-navy-300 text-lg">
            Tidak ada swipe. Tidak ada chat random.
            Hanya kamu — memperkenalkan diri dengan cara yang benar.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link href="/create" className={components.buttons.primary}>
              Buat CV Taaruf Saya
            </Link>

            <Link href="#cara-kerja" className={components.buttons.secondary}>
              Lihat Cara Kerja
            </Link>
          </div>

          <p className="mt-4 text-xs text-navy-500">
            ⏱️ 5 menit · Gratis · Tanpa akun
          </p>

        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="py-16 px-6 border-t border-navy-800">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-xl font-semibold mb-8">
            Taaruf Hari Ini Tidak Mudah
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-sm text-navy-300">
            <div className={components.cards.default}>
              ❌ Tidak nyaman pakai dating app
            </div>
            <div className={components.cards.default}>
              ❌ Bingung mulai perkenalan
            </div>
            <div className={components.cards.default}>
              ❌ Takut dinilai dangkal
            </div>
          </div>

          <p className="mt-6 text-navy-500 text-sm">
            Kamu bukan satu-satunya.
          </p>

        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-xl font-semibold">
            NikahReady Adalah Alat, Bukan Platform
          </h2>

          <p className="mt-4 text-navy-300">
            Kamu yang pegang kendali penuh. Tidak ada algoritma. Tidak ada intervensi.
          </p>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 px-6 border-t border-navy-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

          <div className={components.cards.glass}>
            <FileText className="mb-4 text-sage-400" />
            <h3 className="font-semibold mb-2">Ceritakan Dirimu Utuh</h3>
            <p className="text-sm text-navy-300">
              Bukan sekadar biodata, tapi perjalanan hidup dan visi pernikahanmu.
            </p>
          </div>

          <div className={components.cards.glass}>
            <Sparkles className="mb-4 text-sage-400" />
            <h3 className="font-semibold mb-2">Terarah & Islami</h3>
            <p className="text-sm text-navy-300">
              Dipandu langkah demi langkah dengan pendekatan yang bermartabat.
            </p>
          </div>

          <div className={components.cards.glass}>
            <Download className="mb-4 text-sage-400" />
            <h3 className="font-semibold mb-2">Siap Dibagikan</h3>
            <p className="text-sm text-navy-300">
              Download CV taaruf elegan dalam hitungan detik.
            </p>
          </div>

        </div>
      </section>

      {/* ================= TEMPLATE PREVIEW (LIVE RENDER) ================= */}
      <TemplatePreviewSection />

      {/* ================= HOW IT WORKS ================= */}
      <section id="cara-kerja" className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-xl font-semibold mb-10">
            3 Langkah Selesai
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, label: "Isi data dirimu" },
              { step: 2, label: "Pilih tampilan" },
              { step: 3, label: "Download & bagikan" },
            ].map(({ step, label }) => (
              <div key={step}>
                <div className="w-10 h-10 rounded-full bg-sage-600 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step}
                </div>
                <p className="text-sm">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="py-16 px-6 border-t border-navy-800">
        <div className="max-w-3xl mx-auto text-center">

          <ShieldCheck className="mx-auto mb-4 text-sage-400" />

          <h2 className="text-xl font-semibold">
            Privasi Kamu Prioritas
          </h2>

          <ul className="mt-6 text-sm text-navy-300 space-y-2">
            <li>🔒 Tidak ada profil publik</li>
            <li>🔒 Tidak bisa dicari</li>
            <li>🔒 Tidak ada matching</li>
            <li>🔒 Kamu yang menentukan</li>
          </ul>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center px-6">
        <h2 className="text-2xl font-bold">
          Mulai Taaruf dengan Cara Lebih Baik
        </h2>

        <p className="mt-4 text-navy-300">
          Tanpa drama. Tanpa kompromi nilai.
        </p>

        <div className="mt-8">
          <Link href="/create" className={components.buttons.primary}>
            Mulai Sekarang — Gratis
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-xs text-navy-500 border-t border-navy-800">
        © {new Date().getFullYear()} NikahReady
      </footer>

    </div>
  )
}