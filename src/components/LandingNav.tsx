'use client'

// ============================================================
// src/components/LandingNav.tsx
//
// Landing page navbar yang menampilkan state berbeda
// berdasarkan status autentikasi:
// - Not logged in: "Mulai Gratis" + "Masuk"
// - Logged in: User greeting + "Dashboard" + "Keluar"
// ============================================================

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthState, useAuthActions } from '@/context/AuthContext'

export function LandingNav() {
  const router = useRouter()
  const { status, userEmail, user } = useAuthState()
  const { signOut } = useAuthActions()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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

          <div className="landing-nav-actions">
            {isLoading ? (
              // Loading skeleton
              <div style={{
                width: '120px',
                height: '28px',
                borderRadius: '8px',
                background: 'rgba(51, 65, 85, 0.4)',
                animation: 'authSpin 1.5s linear infinite',
              }} />
            ) : isAuthenticated ? (
              <>
                {/* Logged in state */}
                <Link
                  href="/create"
                  className="landing-btn-ghost"
                  style={{ fontSize: '0.75rem' }}
                >
                  Edit Profil
                </Link>
                <Link
                  href="/dashboard"
                  className="landing-btn-outline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="landing-btn-ghost"
                  style={{ fontSize: '0.75rem', color: '#94A3B8' }}
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
                <Link
                  href="/login"
                  className="landing-btn-outline"
                >
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Logout Confirmation Modal ───────────────────────── */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(2, 6, 23, 0.8)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '20rem',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(30, 41, 59, 0.6)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Keluar dari NikahReady?
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Data profilmu tetap tersimpan. Kamu bisa masuk kembali kapan saja.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'transparent',
                  border: '1px solid rgba(100, 116, 139, 0.4)',
                  color: '#94A3B8',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderRadius: '0.625rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'rgba(220, 38, 38, 0.15)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#FCA5A5',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '0.625rem',
                  cursor: 'pointer',
                }}
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
