'use client'

// ============================================================
// src/app/signup/page.tsx
// Signup Page NikahReady — registration with email, password, nama
//
// Refactored:
// 1. Arabic + terjemahan: ukuran lebih kecil, spasi lebih proporsional
// 2. Nama Lengkap: placeholder diubah jadi "Sesuai KTP" — bukan nama panggilan
// 3. Password placeholder: diperpendek, padding-right cukup untuk ikon mata
// 4. Trust indicators: horizontal row, ikon hijau
// 5. Footer copy: selaras dengan brand identity landing page
// ============================================================

import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions, useAuthState } from '@/context/AuthContext'
import { EyeIcon } from '@/components/ui/EyeIcon'
import { TrustIndicator } from '@/components/ui/TrustIndicator'
import { getPasswordStrength } from '@/lib/passwordStrength'
import '../auth.css'

// ── Inner component (needs useSearchParams inside Suspense) ─
function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useAuthState()
  const { signUp } = useAuthActions()

  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const queryMessage = searchParams.get('message')
  const queryError = searchParams.get('error')

  useEffect(() => {
    if (queryMessage) setMessage(queryMessage)
    if (queryError) setError(queryError)
  }, [queryMessage, queryError])

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!nama.trim()) { setError('Nama wajib diisi.'); return }
    if (nama.trim().length < 2) { setError('Nama minimal 2 karakter.'); return }
    if (!email.trim()) { setError('Email wajib diisi.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Format email tidak valid.'); return }
    if (password.length < 8) { setError('Password minimal 8 karakter.'); return }
    if (password !== confirmPassword) { setError('Password dan konfirmasi password tidak sama.'); return }
    if (!agreeTerms) { setError('Kamu harus menyetujui syarat dan ketentuan.'); return }

    setIsLoading(true)

    const result = await signUp(email.trim(), password, nama.trim())

    if (result.success) {
      setMessage('Akun berhasil dibuat! Silakan cek email untuk konfirmasi, lalu masuk.')
      setTimeout(() => {
        router.push('/login?message=' + encodeURIComponent(
          'Akun berhasil dibuat! Silakan masuk dengan email dan passwordmu.'
        ))
      }, 2000)
    } else {
      let friendlyError = result.error ?? 'Gagal mendaftar. Coba lagi.'
      if (friendlyError.includes('already registered') || friendlyError.includes('already in use')) {
        friendlyError = 'Email sudah terdaftar. Coba masuk atau gunakan email lain.'
      } else if (friendlyError.includes('Password should be at least')) {
        friendlyError = 'Password minimal 8 karakter.'
      }
      setError(friendlyError)
    }

    setIsLoading(false)
  }, [nama, email, password, confirmPassword, agreeTerms, signUp, router])

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

  // ── Success message ───────────────────────────────────────
  if (message) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-message auth-message-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{message}</span>
          </div>
          <div className="auth-spinner" style={{ margin: '1rem auto' }} />
        </div>
      </div>
    )
  }

  // ── Signup Form ───────────────────────────────────────────
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
              وَمَن يَتَّقِ اللَّهَ يَجْعَل لَهُ مَخْرَجًا
            </p>
            <p
              className="auth-arabic-translation"
              style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 0, marginBottom: 0, letterSpacing: '0.01em' }}
            >
              Dan barangsiapa bertakwa kepada Allah, niscaya Allah akan memberikan jalan keluar
            </p>
          </div>

          <h1 className="auth-title">Buat Akun Baru</h1>
          <p className="auth-subtitle">
            Mulai buat CV taarufmu. Gratis untuk memulai, data tersimpan aman di server terenkripsi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-message auth-message-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── FIX 2: Nama Lengkap — placeholder sesuai KTP, bukan nama panggilan ── */}
          <div className="auth-field">
            <label htmlFor="nama" className="auth-label">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              className="auth-input"
              placeholder="Sesuai KTP"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isLoading}
              autoComplete="name"
              autoFocus
            />
            <span style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
              Nama ini akan muncul di CV taarufmu
            </span>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">Email</label>
            <input id="signup-email" type="email" className="auth-input" placeholder="nama@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} autoComplete="email" />
          </div>

          {/* ── FIX 3: Password — placeholder pendek, padding-right cukup untuk ikon ── */}
          <div className="auth-field">
            <label htmlFor="signup-password" className="auth-label">Password</label>
            <div className="auth-password-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Min. 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {/* Password strength bar */}
            {password && (
              <div data-testid="password-strength" style={{ marginTop: '0.35rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: level <= passwordStrength.score ? passwordStrength.color : 'rgba(51, 65, 85, 0.4)',
                      transition: 'background 0.2s ease',
                    }} />
                  ))}
                </div>
                {passwordStrength.label && (
                  <span style={{ fontSize: '0.7rem', color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="auth-field">
            <label htmlFor="confirm-password" className="auth-label">Konfirmasi Password</label>
            <div className="auth-password-wrap">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`auth-input ${confirmPassword && confirmPassword !== password ? 'auth-input-error' : ''}`}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}>
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <span className="auth-error-text">Password tidak sama</span>
            )}
          </div>

          {/* Terms checkbox */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.75rem', color: '#94A3B8', cursor: 'pointer',
            lineHeight: '1.4', marginTop: '0.25rem',
          }}>
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={isLoading} style={{ marginTop: '2px', accentColor: '#064E3B' }} />
            <span>
              Saya menyetujui{' '}
              <Link href="/privacy" target="_blank" style={{ color: '#6EE7B7', textDecoration: 'underline' }}>
                Kebijakan Privasi
              </Link>{' '}
              NikahReady dan memahami bahwa data saya tersimpan di server terenkripsi serta hanya dapat diakses oleh saya sendiri.
            </span>
          </label>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? <div className="auth-spinner" /> : <span>Buat Akun</span>}
          </button>

          {/* Links */}
          <div className="auth-links">
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Sudah punya akun?{' '}
              <Link href="/login" className="auth-link auth-link-primary">Masuk</Link>
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
export default function SignupPage() {
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
      <SignupForm />
    </Suspense>
  )
}