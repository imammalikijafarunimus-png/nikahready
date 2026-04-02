'use client'

// ============================================================
// src/app/login/page.tsx
// Login Page NikahReady — email + password authentication
//
// Features:
// - Email & password login
// - "Lupa Password" reset flow
// - Friendly error messages in Indonesian
// - Redirect to `?next=` param or /dashboard after login
// - Responsive design consistent with brand
// ============================================================

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions, useAuthState } from '@/context/AuthContext'
import { ShieldCheck, Lock, Eye, ArrowRight } from 'lucide-react'
import '../auth.css'

// ── Password visibility toggle icon ─────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

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

  // Read query params
  const redirectAfter = searchParams.get('next') || '/dashboard'
  const queryMessage = searchParams.get('message')
  const queryError = searchParams.get('error')

  // Set initial message/error from query params
  useEffect(() => {
    if (queryMessage) setMessage(queryMessage)
    if (queryError) setError(queryError)
  }, [queryMessage, queryError])

  // Redirect setelah login berhasil atau jika sudah authenticated
  // Gunakan window.location.replace() BUKAN router.replace() karena:
  // 1. Full page navigation memastikan cookies dikirim ke server
  // 2. Middleware di server bisa baca session cookie dengan benar
  // 3. Menghindari PWA service worker yang meny cache redirect response
  // 4. Tidak ada Next.js router cache yang bisa interferensi
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

    // Validation
    if (!email.trim()) {
      setError('Email wajib diisi.')
      return
    }
    if (!password) {
      setError('Password wajib diisi.')
      return
    }

    setIsLoading(true)

    const result = await signIn(email.trim(), password)

    if (result.success) {
      // JANGAN router.push() langsung di sini!
      // Biarkan useEffect yang menunggu status='authenticated'
      // dari AuthContext agar cookie session sudah tersinkron
      // dengan middleware sebelum navigasi terjadi.
      // Loading state tetap aktif menunggu redirect dari useEffect.
    } else {
      setError(result.error ?? 'Gagal masuk. Coba lagi.')
      setIsLoading(false)
    }
  }, [email, password, signIn])

  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Masukkan email untuk reset password.')
      return
    }

    setIsLoading(true)

    const result = await resetPassword(email.trim())

    if (result.success) {
      setForgotEmailSent(true)
    } else {
      setError(result.error ?? 'Gagal mengirim email reset.')
    }

    setIsLoading(false)
  }, [email, resetPassword])

  // ── Loading state while checking auth ─────────────────────
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
              <Image
                src="/icons/icon-192.png"
                alt="NikahReady"
                width={32}
                height={32}
                style={{ borderRadius: '0.5rem' }}
              />
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
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotEmailSent(false)
                }}
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
                <label htmlFor="forgot-email" className="auth-label">Alamat Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  className="auth-input"
                  placeholder="Email aktif kamu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="auth-spinner" />
                ) : (
                  <span>Kirim Link Reset</span>
                )}
              </button>

              <div className="auth-links">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError(null)
                  }}
                  className="auth-link auth-link-primary"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                >
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
            <Image
              src="/icons/icon-192.png"
              alt="NikahReady"
              width={32}
              height={32}
              style={{ borderRadius: '0.5rem' }}
            />
            <span className="auth-logo-text">NikahReady</span>
          </Link>

          <p className="font-arabic auth-arabic">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <p className="auth-arabic-translation">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>

          <h1 className="auth-title">Selamat Datang Kembali</h1>
          <p className="auth-subtitle">
            CV taarufmu menunggumu. Masuk dan lanjutkan perjalananmu dengan tenang.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Message / Error banner */}
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
            <label htmlFor="email" className="auth-label">Alamat Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="Email aktif kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Password yang kamu ingat"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true)
                setError(null)
              }}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#94A3B8' }}
            >
              Lupa Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="auth-spinner" />
            ) : (
              <>
                <span>Masuk ke Akun Saya</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Links */}
          <div className="auth-links">
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Belum punya akun?{' '}
              <Link href="/signup" className="auth-link auth-link-primary">
                Buat Akun
              </Link>
            </span>
          </div>
        </form>

        {/* Trust indicators */}
        <div className="auth-trust">
          <span className="auth-trust-item">
            <ShieldCheck className="auth-trust-icon" />
            Data Terenkripsi
          </span>
          <span className="auth-trust-item">
            <Lock className="auth-trust-icon" />
            Server Aman
          </span>
          <span className="auth-trust-item">
            <Eye className="auth-trust-icon" />
            Tanpa Profil Publik
          </span>
        </div>
      </div>

      <div className="auth-footer">
        <p className="auth-footer-brand">NikahReady · Alat Bantu CV Taaruf</p>
        <p className="auth-footer-values">Jujur · Bermartabat · Aman</p>
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