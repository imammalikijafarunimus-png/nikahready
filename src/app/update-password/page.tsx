'use client'

// ============================================================
// src/app/update-password/page.tsx
//
// Halaman untuk mengubah password setelah klik link reset
// dari email "Lupa Password".
//
// Flow:
// 1. User klik "Lupa Password" di login → kirim email reset
// 2. User klik link di email → /auth/callback?type=recovery
// 3. Callback exchange code → session → redirect ke /update-password
// 4. User isi password baru → supabase.auth.updateUser()
// 5. Redirect ke login dengan success message
// ============================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import '../auth.css'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Password strength check
  const passwordStrength = getPasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newPassword) {
      setError('Password baru wajib diisi.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok.')
      return
    }

    setIsLoading(true)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        if (error.message.includes('Same password')) {
          setError('Password baru harus berbeda dari password lama.')
        } else {
          setError(error.message)
        }
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.replace('/login?message=' + encodeURIComponent('Password berhasil diubah. Silakan masuk dengan password baru.'))
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah password.')
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #065F46, #10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h1 className="auth-title">Password Berhasil Diubah!</h1>
          <p className="auth-subtitle">
            Kamu akan diarahkan ke halaman login dalam beberapa saat...
          </p>
          <Link
            href="/login"
            className="auth-submit"
            style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            <Image src="/icons/icon-192.png" alt="NikahReady" width={32} height={32} style={{ borderRadius: '0.5rem' }} />
            <span className="auth-logo-text">NikahReady</span>
          </Link>

          <div style={{ margin: '1rem 0 1.5rem', textAlign: 'center' }}>
            <p className="font-arabic auth-arabic" style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '0.3rem' }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
            <p className="auth-arabic-translation" style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 0, marginBottom: 0, letterSpacing: '0.01em' }}>
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
            </p>
          </div>

          <h1 className="auth-title">Ubah Password</h1>
          <p className="auth-subtitle">
            Masukkan password baru untuk akunmu. Pastikan password kuat dan mudah diingat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-message auth-message-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Password Baru */}
          <div className="auth-field">
            <label htmlFor="new-password" className="auth-label">Password Baru</label>
            <div className="auth-password-wrap">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password strength indicator */}
            {newPassword.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{
                  display: 'flex', gap: '0.25rem', marginBottom: '0.25rem'
                }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: passwordStrength.score >= level
                          ? passwordStrength.color
                          : 'rgba(100,116,139,0.2)',
                        transition: 'background 0.2s'
                      }}
                    />
                  ))}
                </div>
                <p style={{
                  fontSize: '0.7rem',
                  color: passwordStrength.color,
                  margin: 0
                }}>
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="auth-field">
            <label htmlFor="confirm-password" className="auth-label">Konfirmasi Password</label>
            <div className="auth-password-wrap">
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p style={{ fontSize: '0.7rem', color: '#F87171', margin: '0.25rem 0 0' }}>
                Password tidak cocok
              </p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}>
            {isLoading ? <div className="auth-spinner" /> : <span>Simpan Password Baru</span>}
          </button>
        </form>

        {/* Trust indicators */}
        <div
          className="auth-trust"
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap',
            marginTop: '1.25rem', paddingTop: '1rem',
            borderTop: '1px solid rgba(100,116,139,0.15)',
          }}
        >
          <span className="auth-trust-item" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#6EE7B7', fontWeight: 500 }}>
            Password Terenkripsi
          </span>
        </div>
      </div>

      <div className="auth-footer">
        <p className="auth-footer-brand">NikahReady · CV Taaruf Profesional</p>
        <p className="auth-footer-values">Bukan Dating App · Bermartabat · Kamu yang Pegang Kendali</p>
      </div>
    </div>
  )
}

// ── Password Strength Helper ─────────────────────────────────
function getPasswordStrength(password: string): {
  score: number
  color: string
  label: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, color: '#EF4444', label: 'Lemah — tambahkan huruf besar, angka, dan simbol' }
  if (score <= 2) return { score: 2, color: '#F97316', label: 'Cukup — gunakan kombinasi huruf besar, angka, simbol' }
  if (score <= 3) return { score: 3, color: '#EAB308', label: 'Baik — tambahkan simbol untuk keamanan lebih' }
  return { score: 4, color: '#10B981', label: 'Kuat — password sudah aman' }
}