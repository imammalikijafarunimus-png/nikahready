'use client'

// ============================================================
// src/components/LandingNav.tsx
//
// Landing page navbar yang menampilkan state berbeda
// berdasarkan status autentikasi:
// - Not logged in: Nav links + "Mulai Gratis" + "Masuk"
// - Logged in: Nav links + User greeting + "Dashboard" + "Keluar"
//
// Nav links: Cara Kerja, Template, FAQ (anchor ke section)
// ============================================================

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthState, useAuthActions } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function LandingNav() {
  const router = useRouter()
  const { status, userEmail, user } = useAuthState()
  const { signOut } = useAuthActions()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu on anchor click
  const handleAnchorClick = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const userName = user?.user_metadata?.nama || userEmail?.split('@')[0] || 'User'

  const handleLogout = useCallback(async () => {
    await signOut()
    setShowLogoutConfirm(false)
  }, [signOut])

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return (
    <>
      <nav className="landing-nav">
        <div className="landing-container landing-nav-inner">
          <Link href="/" className="landing-logo-link">
            <Image
              src="/icons/icon-192.png"
              alt="NikahReady"
              width={32}
              height={32}
              className="landing-logo-img"
            />
            <span className="landing-logo-text">NikahReady</span>
          </Link>

          {/* ── Center nav links (desktop only) ────────── */}
          <div className="landing-nav-links">
            <a href="#cara-kerja" className="landing-nav-link">Cara Kerja</a>
            <a href="#preview" className="landing-nav-link">Template</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
          </div>

          {/* ── Desktop actions ──────────────────────────────── */}
          <div className="landing-nav-actions">
            {isLoading ? (
              // Loading skeleton
              <div className="w-[120px] h-7 rounded-lg bg-navy-700/40 animate-pulse" />
            ) : isAuthenticated ? (
              <>
                {/* Logged in state */}
                <Link
                  href="/create"
                  className="landing-btn-ghost text-xs"
                >
                  Edit Profil
                </Link>
                <Link
                  href="/dashboard"
                  className="landing-btn-outline"
                >
                  Dashboard
                </Link>
                <ThemeToggle size={16} />
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="landing-btn-ghost text-xs text-navy-400"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                {/* Not logged in state */}
                <Link
                  href="/create"
                  className="landing-btn-ghost"
                >
                  Mulai Gratis
                </Link>
                <ThemeToggle size={16} />
                <Link
                  href="/login"
                  className="landing-btn-outline"
                >
                  Masuk
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger button (mobile only) ──────────────── */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="landing-hamburger"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* ── Mobile dropdown menu ──────────────────────────── */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <a href="#cara-kerja" className="landing-mobile-link" onClick={handleAnchorClick}>Cara Kerja</a>
            <a href="#preview" className="landing-mobile-link" onClick={handleAnchorClick}>Template</a>
            <a href="#faq" className="landing-mobile-link" onClick={handleAnchorClick}>FAQ</a>
            <div className="landing-mobile-divider" />
            {isLoading ? (
              <div className="w-full h-8 rounded-lg bg-navy-700/40 animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <Link href="/create" className="landing-mobile-link" onClick={handleAnchorClick}>Edit Profil</Link>
                <Link href="/dashboard" className="landing-mobile-link" onClick={handleAnchorClick}>Dashboard</Link>
                <button
                  onClick={() => { setShowLogoutConfirm(true); setMobileMenuOpen(false) }}
                  className="landing-mobile-link landing-mobile-link-danger"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/create" className="landing-mobile-link" onClick={handleAnchorClick}>Mulai Gratis</Link>
                <Link href="/login" className="landing-mobile-link" onClick={handleAnchorClick}>Masuk</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ── Logout Confirmation Modal ───────────────────────── */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-navy-950/80 backdrop-blur-sm"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-[90%] max-w-80 rounded-2xl border border-gray-200 dark:border-navy-800/60 bg-white dark:bg-navy-900/95 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">
              Keluar dari NikahReady?
            </h3>
            <p className="text-xs text-navy-500 dark:text-navy-400 mb-5 leading-relaxed">
              Data profilmu tetap tersimpan. Kamu bisa masuk kembali kapan saja.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-transparent border border-gray-300 dark:border-navy-600/40 text-navy-500 dark:text-navy-400 text-xs font-medium cursor-pointer transition-all hover:border-gray-400 dark:hover:border-navy-500 active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-300 text-xs font-semibold cursor-pointer transition-all hover:bg-red-100 dark:hover:bg-red-900/25 active:scale-95"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}