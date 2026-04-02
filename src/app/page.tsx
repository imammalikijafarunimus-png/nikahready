// ============================================================
// src/app/page.tsx
// NikahReady Landing Page — Enterprise Refactor
// ============================================================

import './landing.css'
import Link from "next/link"
import { LandingNav } from "@/components/LandingNav"
import { TemplatePreviewSection } from "@/components/TemplatePreviewSection"
import {
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Star,
  ChevronDown,
} from "lucide-react"
import { components } from "@/lib/design-system"

// ─── Static data ───────────────────────────────────────────

const STATS = [
  { value: "10.000+", label: "CV Dibuat" },
  { value: "4.9 ★",  label: "Rating Pengguna" },
  { value: "< 5 Menit", label: "Waktu Pengerjaan" },
  { value: "100% Gratis", label: "Tanpa Biaya Apapun" },
]

const PROBLEMS = [
  {
    icon: "😓",
    title: "Dating app tidak sesuai nilai",
    desc: "Format swipe dan chat dengan orang asing tanpa perantara terasa tidak nyaman dan tidak sejalan dengan cara taaruf yang benar.",
  },
  {
    icon: "📝",
    title: "Bingung harus mulai dari mana",
    desc: "Apa yang perlu disampaikan? Bagaimana formatnya? Informasi apa yang penting untuk wali dan murabbi?",
  },
  {
    icon: "😰",
    title: "Takut terkesan tidak serius",
    desc: "Perkenalan yang tidak terstruktur mempersulit kamu untuk menunjukkan kesungguhan dan karakter aslimu.",
  },
]

const FEATURES = [
  {
    icon: <FileText className="text-sage-400" size={22} />,
    title: "Biodata Lengkap & Bermakna",
    desc: "Bukan sekadar nama dan foto. Panduan isian mencakup latar keluarga, pendidikan, keseharian, hingga visi pernikahan — semua yang wali perlu tahu.",
    tags: ["25+ Poin Isian", "Panduan di Setiap Langkah"],
  },
  {
    icon: <Sparkles className="text-sage-400" size={22} />,
    title: "Pendekatan Islami, Step-by-Step",
    desc: "Setiap pertanyaan mendorong refleksi yang jujur. Tidak ada tekanan. Hanya percakapan yang bermartabat dengan dirimu sendiri.",
    tags: ["Panduan Taaruf", "Reflektif & Terstruktur"],
  },
  {
    icon: <Download className="text-sage-400" size={22} />,
    title: "PDF Elegan, Siap Dibagikan",
    desc: "Pilih template yang mencerminkan karaktermu. Download dalam hitungan detik. Siap dibagikan lewat wali, murabbi, atau perantara tepercaya.",
    tags: ["Template Premium", "PDF Instan"],
  },
]

const STEPS = [
  {
    step: "01",
    title: "Isi Data Dirimu",
    desc: "Jawab pertanyaan terstruktur tentang dirimu, keluarga, keseharian, dan visi pernikahanmu. Panduan jelas di setiap langkah.",
  },
  {
    step: "02",
    title: "Pilih Tampilan",
    desc: "Pilih dari beberapa template elegan yang dirancang untuk meninggalkan kesan serius kepada keluarga calon pasanganmu.",
  },
  {
    step: "03",
    title: "Download & Bagikan",
    desc: "Unduh CV taaruf dalam format PDF berkualitas tinggi. Bagikan melalui wali, murabbi, atau perantara tepercaya.",
  },
]

const TESTIMONIALS = [
  {
    name: "Fatimah A.",
    city: "Jakarta",
    quote:
      "Alhamdulillah, wali saya langsung terkesan. CV taaruf ini membantu saya menjelaskan diri dengan serius tanpa harus bertemu langsung terlebih dahulu.",
    stars: 5,
  },
  {
    name: "Rizky M.",
    city: "Surabaya",
    quote:
      "Sudah coba bikin sendiri pakai Word, hasilnya berantakan. NikahReady selesai dalam 10 menit dan hasilnya jauh lebih rapi dan profesional.",
    stars: 5,
  },
  {
    name: "Hana S.",
    city: "Bandung",
    quote:
      "Yang saya suka, bukan hanya biodata biasa. Ada bagian visi pernikahan yang benar-benar membantu proses taaruf menjadi lebih serius dan bermakna.",
    stars: 5,
  },
]

const PRIVACY_POINTS = [
  "Tidak ada profil publik",
  "Tidak bisa dicari siapapun",
  "Tidak ada fitur matching",
  "Data tidak dikirim ke server",
]

const FAQ = [
  {
    q: "Apakah data saya tersimpan di server?",
    a: "Tidak. Seluruh proses pengisian terjadi di browser kamu. Kami tidak menyimpan, membaca, atau mengirim data pribadimu ke server manapun.",
  },
  {
    q: "Apakah NikahReady benar-benar gratis?",
    a: "Ya, gratis sepenuhnya. Tidak ada biaya tersembunyi, langganan, atau fitur berbayar. Kamu bisa buat dan download CV taaruf tanpa mengeluarkan satu rupiah pun.",
  },
  {
    q: "Bisakah saya mengedit CV setelah didownload?",
    a: "Kamu bisa kembali ke halaman buat CV kapan saja dan mengisi ulang. Selama data masih tersimpan di browser, isian sebelumnya akan muncul kembali.",
  },
  {
    q: "Apakah ini aman untuk dibagikan ke wali atau murabbi?",
    a: "Tentu. CV taaruf ini dirancang agar nyaman dibagikan melalui wali, murabbi, atau ustaz — bukan dibagikan langsung ke calon pasangan.",
  },
]

// ─── Page ──────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white antialiased">

      <LandingNav />

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">

        {/* Ambient background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
        >
          <div className="w-[640px] h-[420px] rounded-full bg-sage-600/10 blur-[130px] -translate-y-1/3" />
        </div>

        <div className="relative max-w-3xl mx-auto">

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sage-700/40 bg-navy-900/80 backdrop-blur text-xs text-sage-300 mb-8 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-pulse" />
            Dipercaya lebih dari 10.000 Muslim Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Perkenalkan Dirimu
            <br />
            <span className="text-sage-400">Dengan Cara yang Layak.</span>
          </h1>

          {/* Sub-headline — specific & actionable */}
          <p className="mt-6 text-navy-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Buat CV taaruf profesional dalam 5 menit —
            lengkap, terstruktur, dan siap dibagikan
            kepada wali atau murabbi tanpa rasa canggung.
          </p>

          {/* CTA group */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/create"
              className={`${components.buttons.primary} group flex items-center gap-2`}
            >
              Buat CV Taaruf Gratis
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link href="#preview" className={components.buttons.secondary}>
              Lihat Contoh Hasil
            </Link>
          </div>

          {/* Micro trust signals */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-navy-400">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-sage-500" />
              Selesai dalam 5 menit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-sage-500" />
              Gratis selamanya
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-sage-500" />
              Tanpa akun, tanpa simpan data
            </span>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="border-y border-navy-800 bg-navy-900/50">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-sage-400">{value}</p>
              <p className="text-xs text-navy-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROBLEM — emotional, specific
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs text-sage-500 tracking-widest uppercase mb-3 font-medium">
              Kenapa Taaruf Terasa Sulit
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-snug">
              Niat sudah kuat.
              <br className="hidden md:block" />
              Tapi caranya belum jelas.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PROBLEMS.map(({ icon, title, desc }) => (
              <div key={title} className={`${components.cards.glass} text-left`}>
                <span className="text-2xl mb-4 block">{icon}</span>
                <h3 className="font-semibold mb-2 text-sm">{title}</h3>
                <p className="text-xs text-navy-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SOLUTION — authoritative positioning
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-navy-800">
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-xs text-sage-500 tracking-widest uppercase mb-3 font-medium">Solusi</p>

          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            Bukan platform. Bukan aplikasi kencan.
            <br />
            <span className="text-sage-400">Alat ini milikmu sepenuhnya.</span>
          </h2>

          <p className="mt-6 text-navy-300 leading-relaxed">
            NikahReady membantu kamu menyusun perkenalan diri yang bermartabat —
            terstruktur, profesional, dan mencerminkan siapa kamu sesungguhnya.
            Tidak ada algoritma yang menentukan siapa yang cocok.
            Tidak ada profil yang bisa dicari atau dicocokan.
            Kamu yang memegang kendali penuh.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-900/40 border border-sage-800/50 text-sage-300 text-sm">
            <ShieldCheck size={14} />
            Data tidak pernah meninggalkan perangkatmu
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES — richer, with benefit tags
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs text-sage-500 tracking-widest uppercase mb-3 font-medium">Fitur</p>
            <h2 className="text-2xl md:text-3xl font-bold">
              Dirancang untuk Taaruf yang Serius
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc, tags }) => (
              <div key={title} className={`${components.cards.glass} flex flex-col`}>
                <div className="mb-4">{icon}</div>
                <h3 className="font-semibold mb-3 text-sm leading-snug">{title}</h3>
                <p className="text-xs text-navy-400 leading-relaxed flex-1">{desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-sage-900/50 text-sage-400 border border-sage-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — with connector line
      ═══════════════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-20 px-6 border-t border-navy-800">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs text-sage-500 tracking-widest uppercase mb-3 font-medium">
              Cara Kerja
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              Tiga Langkah. Satu CV Taaruf.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">

            {/* Connector line — desktop only */}
            <div
              aria-hidden
              className="hidden md:block absolute top-5 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-navy-800 via-sage-700/50 to-navy-800"
            />

            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="w-10 h-10 rounded-full bg-navy-950 border border-sage-700/50 flex items-center justify-center mx-auto mb-5 text-xs font-bold text-sage-400 relative z-10">
                  {step}
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-navy-400 leading-relaxed">{desc}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TEMPLATE PREVIEW
      ═══════════════════════════════════════════════════ */}
      <div id="preview">
        <TemplatePreviewSection />
      </div>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS — new, builds credibility
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-navy-800">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs text-sage-500 tracking-widest uppercase mb-3 font-medium">
              Cerita Pengguna
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">Mereka Sudah Memulai</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, quote, stars }) => (
              <div key={name} className={`${components.cards.glass} flex flex-col`}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-navy-200 leading-relaxed flex-1 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-4 pt-4 border-t border-navy-700/50">
                  <p className="text-xs font-semibold text-white">{name}</p>
                  <p className="text-[10px] text-navy-500 mt-0.5">{city}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRIVACY / TRUST — elevated card layout
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-navy-700 bg-navy-900/60 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-sage-900/50 border border-sage-800/50 flex items-center justify-center">
                  <ShieldCheck className="text-sage-400" size={26} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Privasi adalah Standar Kami</h2>
                <p className="text-navy-300 text-sm leading-relaxed mb-6">
                  Dari awal, NikahReady dirancang dengan prinsip sederhana:
                  data pribadimu bukan urusan kami. Semua pemrosesan terjadi
                  di perangkatmu sendiri, bukan di server kami.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRIVACY_POINTS.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-navy-300">
                      <CheckCircle2 size={13} className="text-sage-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ — new, answers objections
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-navy-800">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <p className="text-xs text-sage-500 tracking-widest uppercase mb-3 font-medium">
              Pertanyaan Umum
            </p>
            <h2 className="text-2xl font-bold">Ada yang Ingin Ditanyakan?</h2>
          </div>

          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className={`${components.cards.glass} group cursor-pointer`}
              >
                <summary className="flex items-center justify-between gap-4 text-sm font-medium list-none select-none">
                  {q}
                  <ChevronDown
                    size={16}
                    className="text-sage-500 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-4 text-xs text-navy-400 leading-relaxed border-t border-navy-700/50 pt-4">
                  {a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA — strong & specific
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[500px] h-[300px] rounded-full bg-sage-700/10 blur-[100px]" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Mulai Taaruf dengan
            <span className="text-sage-400 block">
              Cara yang Benar-Benar Bermartabat.
            </span>
          </h2>

          <p className="mt-5 text-navy-300">
            Tidak ada alasan untuk menunda.
            Gratis. Tanpa akun. Selesai dalam 5 menit.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/create"
              className={`${components.buttons.primary} group flex items-center gap-2`}
            >
              Buat CV Taaruf Saya
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link href="#cara-kerja" className={components.buttons.secondary}>
              Pelajari Lebih Lanjut
            </Link>
          </div>

          <p className="mt-6 text-xs text-navy-500">
            Sudah lebih dari 10.000 Muslim Indonesia mempercayai NikahReady.
          </p>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER — enterprise-grade
      ═══════════════════════════════════════════════════ */}
      <footer className="border-t border-navy-800 py-12 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start gap-10">

            <div className="max-w-xs">
              <p className="font-bold text-sm text-white mb-2">NikahReady</p>
              <p className="text-xs text-navy-500 leading-relaxed">
                Alat bantu membuat CV taaruf profesional untuk Muslim Indonesia.
                Bukan platform kencan. Bukan layanan matching.
                Hanya alat yang membantu kamu memperkenalkan diri dengan bermartabat.
              </p>
            </div>

            <div className="flex gap-12 text-xs text-navy-400">
              <div>
                <p className="text-white font-semibold mb-3 text-xs">Produk</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/create" className="hover:text-sage-400 transition-colors">
                      Buat CV Taaruf
                    </Link>
                  </li>
                  <li>
                    <Link href="#preview" className="hover:text-sage-400 transition-colors">
                      Lihat Template
                    </Link>
                  </li>
                  <li>
                    <Link href="#cara-kerja" className="hover:text-sage-400 transition-colors">
                      Cara Kerja
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-3 text-xs">Legal</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="hover:text-sage-400 transition-colors">
                      Kebijakan Privasi
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-sage-400 transition-colors">
                      Syarat Penggunaan
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-navy-800 text-xs text-navy-600">
            © {new Date().getFullYear()} NikahReady · Dibuat dengan niat baik untuk Muslim Indonesia.
          </div>

        </div>
      </footer>

    </div>
  )
}