'use client'

// ============================================================
// src/app/dashboard/page.tsx
// Dashboard NikahReady — user profile overview & navigation
//
// Features:
// - Emotional welcome with Arabic quote
// - Celebratory profile completion status
// - Premium quick action cards (Edit Profil, Preview CV, Download PDF)
// - Organized steps overview with access control
// - Trust indicators strip
// - Account info (plan, join date)
// ============================================================

import '../dashboard.css'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useRequireAuth, useAuthActions } from '@/context/AuthContext'
import { useFormState, useFormDispatch } from '@/context/FormContext'
import { loadProfile } from '@/lib/supabase/loadProfile'
import { STEP_DEFINITIONS } from '@/lib/constants'
import {
  ShieldCheck,
  Lock,
  Eye,
  Pencil,
  Eye as EyeIcon,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
 LayoutDashboard,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

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
  const { userId, userEmail, plan, isLoading: authLoading, user, role } = useRequireAuth()
  const { signOut } = useAuthActions()
  const state = useFormState()
  const dispatch = useFormDispatch()

  const [completion, setCompletion] = useState(0)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const userName = user?.user_metadata?.nama || userEmail?.split('@')[0] || 'User'

  // ── Load profile from Supabase on mount ───────────────────
  // FIX: Hanya override form state jika Supabase punya data.
  // Jika profile kosong, jangan timpa draft dari localStorage.
  useEffect(() => {
    if (!userId) return

    async function load() {
      setProfileLoading(true)
      const result = await loadProfile(userId!)
      if (result.success && result.profile && result.profileId) {
        // Hanya dispatch jika ada data di Supabase
        dispatch({ type: 'LOAD_PROFILE', payload: result.profile })
        dispatch({ type: 'SET_PROFILE_ID', profileId: result.profileId })
      }
      // Jika tidak ada profile (belum pernah save), biarkan state dari localStorage
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

  // ── Completion visual config ──────────────────────────────
  const completionClass = completion >= 100
    ? 'text-sage-300'
    : completion >= 80
      ? 'text-sage-400'
      : completion >= 50
        ? 'text-gold-400'
        : completion >= 1
          ? 'text-gold-500'
          : 'text-red-400'

  const completionBg = completion >= 100
    ? 'bg-sage-300'
    : completion >= 80
      ? 'bg-sage-400'
      : completion >= 50
        ? 'bg-gold-400'
        : completion >= 1
          ? 'bg-gold-500'
          : 'bg-red-400'

  const completionMessage = completion >= 100
    ? 'Masya Allah, profilmu lengkap! 🎉 Semoga menjadi jalan kemudahan dalam taarufmu.'
    : completion >= 80
      ? 'Profil hampir lengkap! Beberapa langkah lagi menuju Lembar Taaruf yang siap dibagikan.'
      : completion >= 50
        ? 'Sudah setengah jalan. Lanjutkan — profil yang lengkap menunjukkan kesungguhanmu.'
        : completion >= 1
          ? 'Profil sedang dibentuk. Setiap data yang kamu isi membantu proses taaruf menjadi lebih serius.'
          : 'Belum dimulai. Mulai dari Data Pribadi — langkah pertama yang paling penting.'

  // ── Loading state ─────────────────────────────────────────
  if (authLoading || profileLoading) {
    return (
      <div className="dashboard-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="auth-spinner w-10 h-10" />
          <p className="text-sm text-navy-400">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-pattern" aria-hidden="true" />
      <div className="dashboard-glow" aria-hidden="true" />

      {/* ── Dashboard Nav ──────────────────────────────────── */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-inner">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <Image
              src="/icons/icon-192.png"
              alt="NikahReady"
              width={28}
              height={28}
              className="rounded"
            />
            <span
              className="text-sm font-bold text-navy-100"
              style={{ letterSpacing: '-0.01em' }}
            >
              NikahReady
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden sm:block text-[11px] text-navy-500">
              {userEmail}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="group px-3 py-1.5 rounded-lg text-xs border border-navy-600/40 text-navy-400 bg-transparent hover:border-red-400 hover:text-red-300 active:scale-95 transition-all cursor-pointer"
            >
              ← Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* ── Dashboard Content ─────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5 pt-10 pb-12 relative z-10">
        {/* ── Welcome Section (Emotional) ──────────────────── */}
        <div className="dashboard-welcome">
          <p className="dashboard-welcome-arabic">
            رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي
          </p>
          <h1 className="dashboard-welcome-title">
            Assalamu&apos;alaikum, <span>{userName}</span>
          </h1>
          <p className="dashboard-welcome-subtitle">
            {completion === 0
              ? "Saatnya memulai perjalanan taarufmu. Isi data diri dengan jujur dan penuh keyakinan — Allah akan memudahkan jalanmu."
              : completion < 50
                ? "Langkah baik sudah dimulai. Terus lengkapi profilmu — setiap bagian membantu wali memahami dirimu dengan lebih baik."
                : completion < 80
                  ? "Profilmu sudah cukup kuat. Lengkapi sisa bagian untuk mendapatkan Lembar Taaruf yang menyeluruh dan meyakinkan."
                  : "Profilmu hampir sempurna. Saatnya melihat hasilnya dan membagikan Lembar Taarufmu kepada keluarga calon pasangan."
            }
          </p>
        </div>

        {/* ── Completion Card (Celebratory) ────────────────── */}
        <div className="dash-card dash-completion mb-6">
          <div className="dash-completion-header">
            <span className="dash-completion-label">
              Kelengkapan Profil
            </span>
            <span className={`dash-completion-percent ${completionClass}`}>
              {completion}%
            </span>
          </div>
          <div className="dash-progress-track">
            <div
              className={`dash-progress-bar ${completionBg}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="dash-completion-message">
            {completionMessage}
          </p>
          {completion >= 80 && (
            <p className="text-[10px] text-sage-500 mt-2 italic">
              &quot;Barangsiapa bertakwa kepada Allah, niscaya Allah akan memberikan jalan keluar.&quot; — QS. At-Talaq: 2
            </p>
          )}
        </div>

        {/* ── Quick Action Cards (Premium) ─────────────────── */}
        <div className="dash-actions">
          {/* Edit Profile */}
          <Link href="/create" className="dash-action-card hover:border-sage-800/40">
            <div className="dash-action-icon dash-action-icon-sage">
              <Pencil className="text-sage-400" size={22} />
            </div>
            <span className="dash-action-title">
              Edit Profil
            </span>
            <span className="dash-action-desc">
              Isi atau lengkapi 22 langkah pengenalan diri
            </span>
            <ChevronRight size={14} className="text-navy-600 mt-auto" />
          </Link>

          {/* Preview CV */}
          <Link href="/preview" className="dash-action-card hover:border-gold-700/30">
            <div className="dash-action-icon dash-action-icon-gold">
              <EyeIcon className="text-gold-300" size={22} />
            </div>
            <span className="dash-action-title">
              Preview CV
            </span>
            <span className="dash-action-desc">
              Lihat tampilan Lembar Taarufmu sebelum download
            </span>
            <ChevronRight size={14} className="text-navy-600 mt-auto" />
          </Link>

          {/* Download PDF */}
          {plan === 'premium' ? (
            <Link href="/preview" className="dash-action-card hover:border-navy-700">
              <div className="dash-action-icon dash-action-icon-navy">
                <Download className="text-navy-300" size={22} />
              </div>
              <span className="dash-action-title">
                Download PDF
              </span>
              <span className="dash-action-desc">
                Download PDF siap dibagikan ke wali atau murabbi
              </span>
              <ChevronRight size={14} className="text-navy-600 mt-auto" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/upgrade')}
              className="dash-action-card hover:border-navy-700 cursor-pointer text-left"
            >
              <div className="dash-action-icon dash-action-icon-navy">
                <Download className="text-navy-300" size={22} />
              </div>
              <span className="dash-action-title flex items-center gap-2">
                Download PDF
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold-900/40 text-gold-400 border border-gold-700/40">
                  PRO
                </span>
              </span>
              <span className="dash-action-desc">
                Download PDF siap dibagikan ke wali atau murabbi
              </span>
              <Sparkles size={14} className="text-gold-500/60 mt-auto" />
            </button>
          )}
        </div>

        {/* ── Steps Overview (Organized) ───────────────────── */}
        <div className="dash-steps">
          <h2 className="dash-steps-title">
            Langkah Pengenalan
          </h2>
          <div className="dash-steps-grid">
            {STEP_DEFINITIONS.map((step) => {
              const isPremium = step.isPremiumOnly
              const isCurrentStep = step.step === state.currentStep
              return (
                <Link
                  key={step.step}
                  href='/create'
                  className={[
                    'dash-step-chip',
                    isCurrentStep
                      ? 'dash-step-chip-current'
                      : isPremium && plan === 'free'
                        ? 'dash-step-chip-locked'
                        : 'dash-step-chip-accessible',
                  ].join(' ')}
                  title={isPremium && plan === 'free' ? 'Preview saja — upgrade untuk mengisi' : step.title}
                >
                  <span className="dash-step-chip-icon">{step.icon}</span>
                  <span className="dash-step-chip-text">
                    {step.title}
                  </span>
                  {step.isPremiumOnly && plan === 'free' && (
                    <span className="dash-step-chip-badge">
                      PRO
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Admin Quick Access ───────────────────────────── */}
        {role === 'admin' && (
          <Link
            href="/admin"
            className="dash-action-card hover:border-sage-800/40"
          >
            <div className="dash-action-icon dash-action-icon-sage">
              <LayoutDashboard className="text-sage-400" size={22} />
            </div>
            <span className="dash-action-title flex items-center gap-2">
              Panel Admin
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-sage-900/40 text-sage-300 border border-sage-700/40">
                ADMIN
              </span>
            </span>
            <span className="dash-action-desc">
              Kelola pengguna, subscription, dan statistik
            </span>
            <ChevronRight size={14} className="text-navy-600 mt-auto" />
          </Link>
        )}

        {/* ── Account Info (Polished) ──────────────────────── */}
        <div className="dash-account">
          <h2 className="dash-account-title">
            Informasi Akun
          </h2>
          <div className="flex flex-col gap-2">
            <div className="dash-account-row">
              <span className="dash-account-label">Email</span>
              <span className="dash-account-value">{userEmail}</span>
            </div>
            <div className="dash-account-row">
              <span className="dash-account-label">Paket</span>
              <span className={plan === 'premium' ? 'dash-account-value-premium' : 'dash-account-value-free'}>
                {plan === 'premium' ? 'NikahReady Pro' : 'Gratis'}
              </span>
            </div>
            <div className="dash-account-row">
              <span className="dash-account-label">Langkah</span>
              <span className="dash-account-value">
                {plan === 'premium'
                  ? `${STEP_DEFINITIONS.length} langkah (semua bisa diisi)`
                  : `${STEP_DEFINITIONS.length} langkah · ${STEP_DEFINITIONS.filter(s => !s.isPremiumOnly).length} bisa diisi`
                }
              </span>
            </div>
          </div>
          {plan === 'free' && (
            <button
              onClick={() => router.push('/upgrade')}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold active:scale-95 transition-all cursor-pointer border-0 hover:from-gold-500 hover:to-gold-400"
            >
              Upgrade ke NikahReady Pro
            </button>
          )}
        </div>

        {/* ── Trust Strip ──────────────────────────────────── */}
        <div className="dash-trust">
          <span className="dash-trust-item">
            <ShieldCheck size={12} className="text-sage-600 opacity-70" />
            Data Terenkripsi
          </span>
          <span className="dash-trust-item">
            <Lock size={12} className="text-sage-600 opacity-70" />
            Server Aman
          </span>
          <span className="dash-trust-item">
            <CheckCircle2 size={12} className="text-sage-600 opacity-70" />
            Hapus Data Kapan Saja
          </span>
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className="dash-footer">
          <p className="dash-footer-brand">
            © {new Date().getFullYear()} NikahReady · Alat Bantu CV Taaruf
          </p>
          <p className="dash-footer-values">
            Jujur · Bermartabat · Aman
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