'use client'

// ============================================================
// src/app/login/page.tsx
// Login Page NikahReady — email + password authentication
//
// Refactored:
// 1. Arabic + terjemahan: ukuran lebih kecil, spasi lebih lega
// 2. Trust indicators: horizontal row, ikon hijau
// 3. Footer copy: selaras dengan brand identity landing page
// ============================================================

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions, useAuthState } from '@/context/AuthContext'
import { EyeIcon } from '@/components/ui/EyeIcon'
import { TrustIndicator } from '@/components/ui/TrustIndicator'
import '../auth.css'

// ── Inner component (needs useSearchParams inside Suspense) ─
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useAuthState()
  const { signIn, resetPassword } = useAuthActions()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmailSent, setForgotEmailSent] = useState(false)

  const redirectAfter = searchParams.get('next') || '/dashboard'
  const queryMessage = searchParams.get('message')
  const queryError = searchParams.get('error')

  useEffect(() => {
    if (queryMessage) setMessage(queryMessage)
    if (queryError) setError(queryError)
  }, [queryMessage, queryError])

  const hasRedirected = useRef(false)
  useEffect(() => {
    if (status === 'authenticated' && !hasRedirected.current) {
      hasRedirected.current = true
      window.location.replace(redirectAfter)
    }
  }, [status, redirectAfter])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!email.trim()) { setError('Email wajib diisi.'); return }
    if (!password) { setError('Password wajib diisi.'); return }
    setIsLoading(true)
    const result = await signIn(email.trim(), password)
    if (!result.success) {
      setError(result.error ?? 'Gagal masuk. Coba lagi.')
      setIsLoading(false)
    }
  }, [email, password, signIn])

  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) { setError('Masukkan email untuk reset password.'); return }
    setIsLoading(true)
    const result = await resetPassword(email.trim())
    if (result.success) {
      setForgotEmailSent(true)
    } else {
      setError(result.error ?? 'Gagal mengirim email reset.')
    }
    setIsLoading(false)
  }, [email, resetPassword])

  // ── Loading state ──────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-spinner" style={{ margin: '2rem auto' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Memeriksa sesi...</p>
        </div>
      </div>
    )
  }

  // ── Forgot Password Form ──────────────────────────────────
  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              <Image src="/icons/icon-192.png" alt="NikahReady" width={32} height={32} style={{ borderRadius: '0.5rem' }} />
              <span className="auth-logo-text">NikahReady</span>
            </Link>
            <h1 className="auth-title">Lupa Password</h1>
            <p className="auth-subtitle">
              Masukkan email yang terdaftar. Kami akan mengirimkan link untuk reset password.
            </p>
          </div>

          {forgotEmailSent ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div className="auth-message auth-message-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>Email reset password sudah dikirim. Cek inbox atau folder spam.</span>
              </div>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setForgotEmailSent(false) }}
                className="auth-submit"
                style={{ marginTop: '1rem' }}
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="auth-form">
              {error && (
                <div className="auth-message auth-message-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="forgot-email" className="auth-label">Email</label>
                <input id="forgot-email" type="email" className="auth-input" placeholder="nama@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} autoComplete="email" autoFocus />
              </div>
              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <div className="auth-spinner" /> : <span>Kirim Link Reset</span>}
              </button>
              <div className="auth-links">
                <button type="button" onClick={() => { setShowForgotPassword(false); setError(null) }}
                  className="auth-link auth-link-primary"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>
                  ← Kembali ke Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  // ── Main Login Form ───────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            <Image src="/icons/icon-192.png" alt="NikahReady" width={32} height={32} style={{ borderRadius: '0.5rem' }} />
            <span className="auth-logo-text">NikahReady</span>
          </Link>

          {/* ── FIX 1: Arabic + terjemahan — ukuran lebih kecil, spasi lebih proporsional ── */}
          <div style={{ margin: '1rem 0 1.5rem', textAlign: 'center' }}>
            <p
              className="font-arabic auth-arabic"
              style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '0.3rem' }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
            <p
              className="auth-arabic-translation"
              style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 0, marginBottom: 0, letterSpacing: '0.01em' }}
            >
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
            </p>
          </div>

          <h1 className="auth-title">Selamat Datang Kembali</h1>
          <p className="auth-subtitle">
            Masuk untuk melanjutkan CV taarufmu. Data tersimpan aman dan terenkripsi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message && (
            <div className="auth-message auth-message-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="auth-message auth-message-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email</label>
            <input id="email" type="email" className="auth-input" placeholder="nama@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} autoComplete="email" autoFocus />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right' }}>
            <button type="button" onClick={() => { setShowForgotPassword(true); setError(null) }}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#94A3B8' }}>
              Lupa Password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? <div className="auth-spinner" /> : <span>Masuk</span>}
          </button>

          {/* Links */}
          <div className="auth-links">
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Belum punya akun?{' '}
              <Link href="/signup" className="auth-link auth-link-primary">Buat Akun</Link>
            </span>
          </div>
        </form>

        {/* Trust indicators */}
        <TrustIndicator />
      </div>

      {/* ── FIX 5: Footer — selaras brand identity landing page ── */}
      <div className="auth-footer">
        <p className="auth-footer-brand">NikahReady · CV Taaruf Profesional</p>
        <p className="auth-footer-values">Bukan Dating App · Bermartabat · Kamu yang Pegang Kendali</p>
      </div>
    </div>
  )
}

// ── Page Component with Suspense boundary ───────────────────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="auth-spinner" style={{ margin: '2rem auto' }} />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}