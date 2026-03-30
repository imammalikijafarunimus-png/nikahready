// ============================================================
// src/app/page.tsx
// Landing Page NikahReady — Fase 1
// ============================================================

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LandingNav } from '@/components/LandingNav'
import './landing.css'

export const metadata: Metadata = {
  title: 'NikahReady — Kenalkan Dirimu Seutuhnya, Jujur, Islami, Bermartabat',
  description:
    'Buat Lembar Taaruf profesional dan Islami. Isi 22 langkah pengenalan, pilih template, download PDF. NikahReady bukan aplikasi kencan — ini alat untuk memperkenalkan diri dengan bermartabat.',
  keywords: [
    'nikah ready', 'taaruf', 'cv taaruf', 'biodata taaruf',
    'pernikahan islami', 'lembar taaruf', 'nikah siap',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'NikahReady',
    title: 'NikahReady — Kenalkan Dirimu Seutuhnya, Jujur, Islami, Bermartabat',
    description: 'Buat Lembar Taaruf profesional dan Islami dalam hitungan menit. Gratis.',
    images: [{ url: '/images/og-card-1344x768.png', width: 1344, height: 768, type: 'image/png' }],
  },
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* ── Navbar (dynamic based on auth state) ────────── */}
      <LandingNav />

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-pattern" />
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot" />
            Bukan Aplikasi Kencan
          </div>
          <h1 className="landing-hero-title">
            Kenalkan Dirimu
            <span className="landing-hero-title-accent">
              Seutuhnya.
            </span>
          </h1>
          <p className="landing-hero-subtitle">
            Jujur, Islami, Bermartabat. Buat Lembar Taaruf profesional
            dalam hitungan menit — langsung dari HP-mu.
          </p>
          <p className="font-arabic landing-hero-arabic">
            وَمَن يَتَّقِ اللَّهُ يَجْعَل لَهُ خَرِيجًا
          </p>
          <div className="landing-hero-ctas">
            <Link href="/create" className="landing-btn-primary">
              <span>Buat Lembar Taaruf</span>
              <svg className="landing-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="#cara-kerja" className="landing-btn-secondary">
              Pelajari Lebih Lanjut
            </Link>
          </div>
          <p className="landing-hero-note">
            Gratis. Tanpa akun. Tanpa batas.
          </p>
        </div>
      </section>

      {/* ── Differentiator Section ──────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-diff">
            <div className="landing-diff-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 018-5.727L12 12l0 0-3.27 0M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75" />
              </svg>
            </div>
            <div>
              <h2 className="landing-diff-title">
                NikahReady Bukan Aplikasi Kencan.
              </h2>
              <p className="landing-diff-desc">
                Tidak ada swipe, tidak ada match, tidak ada DM dari orang asing.
                NikahReady adalah <strong>alat</strong> — kamu yang memegang kendali penuh
                atas siapa yang menerima Lembar Taarufmu. Ini menarik justru dari orang
                yang <em>anti-dating app</em> tapi butuh alat taaruf yang profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features (3 Cards) ─────────────────────────────── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-section-title">
            Mengapa NikahReady?
          </h2>
          <div className="landing-features">
            <div className="landing-feature-card">
              <div className="landing-feature-icon-wrap landing-feature-icon-sage">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3>Bukan Sekadar Biodata</h3>
              <p>
                22 langkah pengenalan yang memandu kamu menceritakan
                perjalanan hidup, karakter, dan visimu — bukan hanya nama dan umur.
              </p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon-wrap landing-feature-icon-gold">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 21.75c0 .738.093 1.47.277 2.177L10.5 6.042z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 17.25l1.5 3.013M12 21l-3.75-1.5M3.75 17.25V6.75L10.5 3.25" />
                </svg>
              </div>
              <h3>Dirancang untuk Taaruf Islami</h3>
              <p>
                Form multi-step dengan tone yang hangat dan bermartabat.
                Ayat Al-Quran sebagai pengantar di setiap fase penting.
              </p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon-wrap landing-feature-icon-navy">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <h3>CV Cantik, Download Seketika</h3>
              <p>
                Pilih dari 3 template yang elegan. Preview langsung di browser.
                Download PDF siap dibagikan ke calon pasangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className="landing-section" id="cara-kerja">
        <div className="landing-container">
          <h2 className="landing-section-title">
            Cara Kerja
          </h2>
          <p className="landing-section-subtitle">
            Tiga langkah mudah untuk membuat Lembar Taarufmu
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Isi Perjalanan Pengenalan</h3>
              <p>
                Jawab 22 langkah dari data pribadi, karakter, ibadah,
                visi pernikahan, hingga pandangan hidupmu. Semua bisa disimpan
                otomatis — tidak perlu selesai dalam satu kali.
              </p>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3>Pilih Template</h3>
              <p>
                Preview langsung di browser. Pilih dari template Akademik (gratis),
                Elegant Islamic, atau Modern Dark. Lihat bagaimana CV-mu
                tampil sebelum diunduh.
              </p>
            </div>
            <div className="landing-step">
              <div className="landing-number landing-step-number-final">3</div>
              <h3>Unduh Lembar Taaruf</h3>
              <p>
                Download PDF dalam hitungan detik. Bagikan ke wali, orang tua,
                atau calon pasangan — sepenuhnya kendali kamu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────────── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <div className="landing-trust">
            <div className="landing-trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 4.5 4.5 0 009 9v10.5m0 0l3-3m-3 3l3 3m-9 3V6.75A9.75 9.75 0 016.75 21h10.5a9.75 9.75 0 0019.5 16.5v-3.375" />
              </svg>
            </div>
            <div>
              <h2 className="landing-trust-title">Data Kamu Aman</h2>
              <ul className="landing-trust-list">
                <li>
                  <svg className="landing-trust-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Lembar Taaruf hanya kamu yang pegang — tidak ada akun publik</span>
                </li>
                <li>
                  <svg className="landing-trust-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Tidak ada matchmaking otomatis — kamu yang memutuskan</span>
                </li>
                <li>
                  <svg className="landing-trust-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Data tersimpan di server terenkripsi (Supabase)</span>
                </li>
                <li>
                  <svg className="landing-trust-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Bisa diakses offline sebagai PWA di HP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────── */}
      <section className="landing-cta">
        <div className="landing-container landing-cta-content">
          <p className="font-arabic landing-cta-arabic">
            فَبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <h2 className="landing-cta-title">
            Siap Membuat Lembar Taarufmu?
          </h2>
          <p className="landing-cta-subtitle">
            Gratis. Tanpa akun. Langsung mulai.
          </p>
          <Link href="/create" className="landing-btn-primary landing-btn-lg">
            <span>Buat Lembar Taaruf Sekarang</span>
            <svg className="landing-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-top">
            <div className="landing-footer-brand">
              <Image
                src="/icons/icon-96.png"
                alt="NikahReady"
                width={28}
                height={28}
              />
              <span className="landing-footer-name">NikahReady</span>
            </div>
            <div className="landing-footer-links">
              <Link href="/privacy">Kebijakan Privasi</Link>
              <span className="landing-footer-sep">·</span>
              <a
                href="https://instagram.com/nikahready.id"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} NikahReady. Dibuat dengan cinta untuk umat.
            </p>
            <p className="landing-footer-tagline">
              Jujur · Bermartabat · Hangat
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
