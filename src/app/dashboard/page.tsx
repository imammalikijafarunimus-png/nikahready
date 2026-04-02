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
          <div className="auth-spinner w-10 h-10" />
          <p className="text-sm text-navy-400">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // ── Completion color classes ──────────────────────────────
  const completionClass = completion >= 80 ? 'text-sage-500' : completion >= 50 ? 'text-gold-500' : 'text-red-400'
  const completionBg = completion >= 80 ? 'bg-sage-500' : completion >= 50 ? 'bg-gold-500' : 'bg-red-400'

  return (
    <div className="min-h-screen bg-navy-950">
      {/* ── Dashboard Nav ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-navy-900/85 backdrop-blur-sm border-b border-navy-800/60">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image
              src="/icons/icon-192.png"
              alt="NikahReady"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="text-sm font-bold text-navy-100">
              NikahReady
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-navy-400">
              {userEmail}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3 py-1.5 rounded-lg text-xs border border-navy-600/40 text-navy-400 bg-transparent hover:border-red-400 hover:text-red-300 active:scale-95 transition-all cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* ── Dashboard Content ─────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5 pt-20 pb-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white mb-1 tracking-tight">
            Assalamu&apos;alaikum, {userName} 👋
          </h1>
          <p className="text-sm text-navy-400">
            Lanjutkan Perjalanan Pengenalanmu
          </p>
        </div>

        {/* Completion Card */}
        <div className="rounded-2xl border border-navy-800/60 bg-navy-900/60 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-navy-100">
              Kelengkapan Profil
            </span>
            <span className={`text-sm font-bold ${completionClass}`}>
              {completion}%
            </span>
          </div>
          <div className="w-full h-2 bg-navy-800/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${completionBg}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-navy-500 mt-2">
            {completion >= 80
              ? 'Profil hampir lengkap! Lanjutkan ke preview.'
              : completion >= 50
                ? 'Profil sudah cukup. Lengkapi data lainnya untuk CV yang lebih baik.'
                : 'Lengkapi data dirimu untuk mendapatkan Lembar Taaruf yang optimal.'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
          {/* Edit Profile */}
          <Link
            href="/create"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-navy-800/60 bg-navy-900/60 no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-sage-800/40"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-sage-900/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">
              Edit Profil
            </span>
            <span className="text-xs text-navy-500 text-center">
              Isi atau lengkapi 22 langkah pengenalan
            </span>
          </Link>

          {/* Preview CV */}
          <Link
            href="/preview"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-navy-800/60 bg-navy-900/60 no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-gold-700/30"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gold-600/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">
              Preview CV
            </span>
            <span className="text-xs text-navy-500 text-center">
              Lihat tampilan Lembar Taarufmu
            </span>
          </Link>

          {/* Download PDF */}
          <Link
            href="/preview"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-navy-800/60 bg-navy-900/60 no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-navy-700"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-navy-800/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">
              Download PDF
            </span>
            <span className="text-xs text-navy-500 text-center">
              Download Lembar Taaruf siap bagikan
            </span>
          </Link>
        </div>

        {/* Steps Overview */}
        <div className="rounded-2xl border border-navy-800/60 bg-navy-900/60 p-6 mb-8">
          <h2 className="text-base font-bold text-navy-100 mb-4">
            Langkah Pengenalan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {STEP_DEFINITIONS.map((step) => {
              const isAccessible = plan === 'premium' || !step.isPremiumOnly
              const isCurrentStep = step.step === state.currentStep
              return (
                <Link
                  key={step.step}
                  href={isAccessible ? `/create` : '#'}
                  className={[
                    'flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs no-underline transition-all duration-150',
                    isAccessible ? 'text-navy-300' : 'text-navy-500 cursor-default',
                    isCurrentStep
                      ? 'bg-sage-900/15 border border-sage-900/30'
                      : 'border border-transparent',
                  ].join(' ')}
                  title={!isAccessible ? 'Fitur premium — upgrade untuk akses' : step.title}
                >
                  <span className="text-sm shrink-0">{step.icon}</span>
                  <span className="truncate">
                    {step.title}
                  </span>
                  {step.isPremiumOnly && plan === 'free' && (
                    <span className="text-2xs px-1 py-0.5 rounded bg-gold-600/15 text-gold-300 shrink-0">
                      PRO
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl border border-navy-800/40 bg-navy-900/40 p-5 mb-8">
          <h2 className="text-sm font-semibold text-navy-100 mb-3">
            Informasi Akun
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-navy-500">Email</span>
              <span className="text-navy-300">{userEmail}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy-500">Paket</span>
              <span className={`font-semibold ${plan === 'premium' ? 'text-gold-300' : 'text-sage-300'}`}>
                {plan === 'premium' ? 'NikahReady Pro ✨' : 'Gratis'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy-500">Langkah Tersedia</span>
              <span className="text-navy-300">
                {plan === 'premium'
                  ? `${STEP_DEFINITIONS.length} langkah`
                  : `${STEP_DEFINITIONS.filter(s => !s.isPremiumOnly).length} / ${STEP_DEFINITIONS.length} langkah`
                }
              </span>
            </div>
          </div>
          {plan === 'free' && (
            <button className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold active:scale-95 transition-all cursor-pointer border-0">
              Upgrade ke NikahReady Pro
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-2xs text-navy-600">
            &copy; {new Date().getFullYear()} NikahReady · Jujur · Bermartabat · Hangat
          </p>
        </div>
      </main>

      {/* ── Logout Confirmation Modal ─────────────────────── */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 backdrop-blur-sm"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-[90%] max-w-80 rounded-2xl border border-navy-800/60 bg-navy-900/95 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white mb-2">
              Keluar dari NikahReady?
            </h3>
            <p className="text-xs text-navy-400 mb-5 leading-relaxed">
              Data profilmu tetap tersimpan. Kamu bisa masuk kembali kapan saja.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-transparent border border-navy-600/40 text-navy-400 text-xs font-medium cursor-pointer transition-all hover:border-navy-500 active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-900/15 border border-red-800/30 text-red-300 text-xs font-semibold cursor-pointer transition-all hover:bg-red-900/25 active:scale-95"
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