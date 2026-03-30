'use client'

// ============================================================
// src/app/signup/page.tsx
// Signup Page NikahReady — registration with email, password, nama
//
// Features:
// - Email, nama, password + konfirmasi password
// - Password strength indicator
// - Minimum password length validation
// - Friendly error messages in Indonesian
// - Redirect to /login after signup (email confirmation flow)
// ============================================================

import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions, useAuthState } from '@/context/AuthContext'
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

// ── Password strength calculator ────────────────────────────
function getPasswordStrength(password: string): {
  score: number    // 0-4
  label: string
  color: string
} {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Clamp to 4
  score = Math.min(score, 4)

  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  const colors = ['', '#EF4444', '#F59E0B', '#10B981', '#064E3B']

  return { score, label: labels[score], color: colors[score] }
}

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

  // Read query params
  const queryMessage = searchParams.get('message')
  const queryError = searchParams.get('error')

  useEffect(() => {
    if (queryMessage) setMessage(queryMessage)
    if (queryError) setError(queryError)
  }, [queryMessage, queryError])

  // If already authenticated, redirect to dashboard
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

    // Validation
    if (!nama.trim()) {
      setError('Nama wajib diisi.')
      return
    }
    if (nama.trim().length < 2) {
      setError('Nama minimal 2 karakter.')
      return
    }
    if (!email.trim()) {
      setError('Email wajib diisi.')
      return
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Format email tidak valid.')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.')
      return
    }
    if (!agreeTerms) {
      setError('Kamu harus menyetujui syarat dan ketentuan.')
      return
    }

    setIsLoading(true)

    const result = await signUp(email.trim(), password, nama.trim())

    if (result.success) {
      // After signup, redirect to login with success message
      setMessage(
        'Akun berhasil dibuat! Silakan cek email untuk konfirmasi, lalu masuk.'
      )
      // Redirect to login after showing message
      setTimeout(() => {
        router.push('/login?message=' + encodeURIComponent(
          'Akun berhasil dibuat! Silakan masuk dengan email dan passwordmu.'
        ))
      }, 2000)
    } else {
      // Friendly error mapping
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
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَهُ مَخْرَجًا
          </p>

          <h1 className="auth-title">Buat Akun NikahReady</h1>
          <p className="auth-subtitle">
            Mulai Perjalanan Pengenalanmu — gratis dan tanpa batas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Error banner */}
          {error && (
            <div className="auth-message auth-message-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div className="auth-field">
            <label htmlFor="nama" className="auth-label">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              className="auth-input"
              placeholder="Nama panggilan atau nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={isLoading}
              autoComplete="name"
              autoFocus
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">Email</label>
            <input
              id="signup-email"
              type="email"
              className="auth-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="signup-password" className="auth-label">Password</label>
            <div className="auth-password-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
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
            {/* Password strength bar */}
            {password && (
              <div style={{ marginTop: '0.35rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '0.25rem',
                }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '2px',
                        background: level <= passwordStrength.score
                          ? passwordStrength.color
                          : 'rgba(51, 65, 85, 0.4)',
                        transition: 'background 0.2s ease',
                      }}
                    />
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
                className={`auth-input ${
                  confirmPassword && confirmPassword !== password ? 'auth-input-error' : ''
                }`}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <span className="auth-error-text">Password tidak sama</span>
            )}
          </div>

          {/* Terms checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#94A3B8',
            cursor: 'pointer',
            lineHeight: '1.4',
            marginTop: '0.25rem',
          }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={isLoading}
              style={{
                marginTop: '2px',
                accentColor: '#064E3B',
              }}
            />
            <span>
              Saya menyetujui{' '}
              <Link href="/privacy" target="_blank" style={{ color: '#6EE7B7', textDecoration: 'underline' }}>
                Kebijakan Privasi
              </Link>{' '}
              NikahReady dan memahami bahwa data saya dienkripsi dan hanya untuk keperluan taaruf.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="auth-spinner" />
            ) : (
              <span>Buat Akun</span>
            )}
          </button>

          {/* Links */}
          <div className="auth-links">
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Sudah punya akun?{' '}
              <Link href="/login" className="auth-link auth-link-primary">
                Masuk
              </Link>
            </span>
          </div>
        </form>
      </div>

      <div className="auth-footer">
        <p>Jujur · Bermartabat · Hangat</p>
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
