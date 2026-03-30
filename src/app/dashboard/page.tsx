'use client'

// ============================================================
// src/app/dashboard/page.tsx
// Dashboard NikahReady — user profile overview & navigation
//
// Features:
// - Welcome message with user name/email
// - Profile completion status
// - Quick action cards (Edit Profil, Preview CV, Download PDF)
// - Logout button
// - Account info (plan, join date)
// ============================================================

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useRequireAuth, useAuthActions } from '@/context/AuthContext'
import { useFormState, useFormDispatch } from '@/context/FormContext'
import { loadProfile } from '@/lib/supabase/loadProfile'
import { STEP_DEFINITIONS } from '@/lib/constants'

// ── Utility: calculate profile completion ──────────────────
function calculateCompletion(state: ReturnType<typeof useFormState>): number {
  const scalarSections = [
    state.dataPribadi,
    state.fisikKesehatan,
    state.karakter,
    state.ibadah,
    state.gayaHidup,
    state.visiMisi,
    state.kriteria,
    state.financialPlanning,
    state.pandanganIsu,
    state.fotoTemplate,
  ] as unknown as Record<string, unknown>[]

  let filledFields = 0
  let totalFields = 0

  for (const section of scalarSections) {
    for (const [key, value] of Object.entries(section)) {
      if (key === 'plan' || key === 'penghasilan_range') continue // skip metadata
      totalFields++
      if (value !== '' && value !== null && value !== undefined && value !== 0) {
        if (Array.isArray(value) && value.length === 0) continue
        filledFields++
      }
    }
  }

  // Check array sections
  const arraySections = [
    state.riwayatPendidikan,
    state.riwayatPekerjaan,
    state.perjalananHidup,
    state.sosialMedia,
    state.anggotaKeluarga,
    state.rencanaMasaDepan,
  ] as unknown[][]

  for (const arr of arraySections) {
    totalFields++
    if (arr.length > 0) filledFields++
  }

  return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
}

// ── Dashboard Component ─────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const { userId, userEmail, plan, isLoading: authLoading, user } = useRequireAuth()
  const { signOut } = useAuthActions()
  const state = useFormState()
  const dispatch = useFormDispatch()

  const [completion, setCompletion] = useState(0)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const userName = user?.user_metadata?.nama || userEmail?.split('@')[0] || 'User'

  // ── Load profile from Supabase on mount ───────────────────
  useEffect(() => {
    if (!userId) return

    async function load() {
      setProfileLoading(true)
      const result = await loadProfile(userId!)
      if (result.success && result.profile) {
        dispatch({ type: 'LOAD_PROFILE', payload: result.profile })
        if (result.profileId) {
          dispatch({ type: 'SET_PROFILE_ID', profileId: result.profileId })
        }
      }
      setProfileLoading(false)
    }

    load()
  }, [userId, dispatch])

  // Calculate completion when state changes
  useEffect(() => {
    setCompletion(calculateCompletion(state))
  }, [state])

  // ── Handle logout ─────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    await signOut()
    router.replace('/')
  }, [signOut, router])

  // ── Loading state ─────────────────────────────────────────
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <div className="auth-spinner" style={{ width: '2.5rem', height: '2.5rem' }} />
          <p className="text-sm text-navy-400">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // ── Completion color ──────────────────────────────────────
  const completionColor = completion >= 80 ? '#10B981' : completion >= 50 ? '#F59E0B' : '#F87171'

  return (
    <div style={{ minHeight: '100vh', background: '#020617' }}>
      {/* ── Dashboard Nav ──────────────────────────────────── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(30, 41, 59, 0.6)',
      }}>
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.5rem',
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}>
            <Image
              src="/icons/icon-192.png"
              alt="NikahReady"
              width={28}
              height={28}
              style={{ borderRadius: '0.5rem' }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9' }}>
              NikahReady
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'none' }} className="sm-hide">
              {userEmail}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(100, 116, 139, 0.4)',
                color: '#94A3B8',
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#EF4444'
                e.currentTarget.style.color = '#FCA5A5'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.4)'
                e.currentTarget.style.color = '#94A3B8'
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* ── Dashboard Content ─────────────────────────────── */}
      <main style={{
        maxWidth: '48rem',
        margin: '0 auto',
        padding: '5rem 1.25rem 3rem',
      }}>
        {/* Welcome */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
          }}>
            Assalamu&apos;alaikum, {userName} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
            Lanjutkan Perjalanan Pengenalanmu
          </p>
        </div>

        {/* Completion Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(30, 41, 59, 0.6)',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F1F5F9' }}>
              Kelengkapan Profil
            </span>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: completionColor,
            }}>
              {completion}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${completion}%`,
              height: '100%',
              background: completionColor,
              borderRadius: '4px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>
            {completion >= 80
              ? 'Profil hampir lengkap! Lanjutkan ke preview.'
              : completion >= 50
                ? 'Profil sudah cukup. Lengkapi data lainnya untuk CV yang lebih baik.'
                : 'Lengkapi data dirimu untuk mendapatkan Lembar Taaruf yang optimal.'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {/* Edit Profile */}
          <Link href="/create" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.5rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(30, 41, 59, 0.6)',
            borderRadius: '1.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(6, 78, 59, 0.4)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.6)'
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <div style={{
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              background: 'rgba(6, 78, 59, 0.15)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
              Edit Profil
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
              Isi atau lengkapi 22 langkah pengenalan
            </span>
          </Link>

          {/* Preview CV */}
          <Link href="/preview" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.5rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(30, 41, 59, 0.6)',
            borderRadius: '1.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.3)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.6)'
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <div style={{
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              background: 'rgba(217, 119, 6, 0.15)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
              Preview CV
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
              Lihat tampilan Lembar Taarufmu
            </span>
          </Link>

          {/* Download PDF */}
          <Link href="/preview" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.5rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(30, 41, 59, 0.6)',
            borderRadius: '1.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.8)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.6)'
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            <div style={{
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              background: 'rgba(30, 41, 59, 0.5)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
              Download PDF
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
              Download Lembar Taaruf siap bagikan
            </span>
          </Link>
        </div>

        {/* Steps Overview */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(30, 41, 59, 0.6)',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '1rem' }}>
            Langkah Pengenalan
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.5rem',
          }}>
            {STEP_DEFINITIONS.map((step) => {
              const isAccessible = plan === 'premium' || !step.isPremiumOnly
              const isCurrentStep = step.step === state.currentStep
              return (
                <Link
                  key={step.step}
                  href={isAccessible ? `/create` : '#'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    color: isAccessible ? '#CBD5E1' : '#475569',
                    background: isCurrentStep
                      ? 'rgba(6, 78, 59, 0.15)'
                      : 'transparent',
                    border: isCurrentStep
                      ? '1px solid rgba(6, 78, 59, 0.3)'
                      : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    cursor: isAccessible ? 'pointer' : 'default',
                  }}
                  title={!isAccessible ? 'Fitur premium — upgrade untuk akses' : step.title}
                >
                  <span style={{ fontSize: '0.85rem' }}>{step.icon}</span>
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {step.title}
                  </span>
                  {step.isPremiumOnly && plan === 'free' && (
                    <span style={{
                      fontSize: '0.55rem',
                      padding: '0.1rem 0.3rem',
                      borderRadius: '0.25rem',
                      background: 'rgba(217, 119, 6, 0.15)',
                      color: '#FCD34D',
                      flexShrink: 0,
                    }}>
                      PRO
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Account Info */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(30, 41, 59, 0.4)',
          borderRadius: '1.25rem',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '0.75rem' }}>
            Informasi Akun
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: '#64748B' }}>Email</span>
              <span style={{ color: '#CBD5E1' }}>{userEmail}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: '#64748B' }}>Paket</span>
              <span style={{
                color: plan === 'premium' ? '#FCD34D' : '#6EE7B7',
                fontWeight: 600,
              }}>
                {plan === 'premium' ? 'NikahReady Pro ✨' : 'Gratis'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: '#64748B' }}>Langkah Tersedia</span>
              <span style={{ color: '#CBD5E1' }}>
                {plan === 'premium'
                  ? `${STEP_DEFINITIONS.length} langkah`
                  : `${STEP_DEFINITIONS.filter(s => !s.isPremiumOnly).length} / ${STEP_DEFINITIONS.length} langkah`
                }
              </span>
            </div>
          </div>
          {plan === 'free' && (
            <button
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.65rem',
                background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '0.625rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Upgrade ke NikahReady Pro
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', color: '#475569' }}>
            &copy; {new Date().getFullYear()} NikahReady · Jujur · Bermartabat · Hangat
          </p>
        </div>
      </main>

      {/* ── Logout Confirmation Modal ─────────────────────── */}
      {showLogoutConfirm && (
        <div style={{
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
    </div>
  )
}