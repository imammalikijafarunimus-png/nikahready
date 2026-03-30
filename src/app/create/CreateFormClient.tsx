'use client'

// ============================================================
// src/app/create/CreateFormClient.tsx
// Orchestrator utama multi-step form.
// Mengatur: routing antar step, progress, save ke Supabase.
// ============================================================

import { useMemo, useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  useFormState,
  useFormDispatch,
  useStepNavigation,
  useSaveStatus,
} from '@/context/FormContext'
import { useRequireAuth } from '@/context/AuthContext'
import { STEP_DEFINITIONS } from '@/lib/constants'
import { saveProfile } from '@/lib/supabase/saveProfile'
import { StepWrapper } from '@/components/ui/StepWrapper'
import { StepNavigator } from '@/components/ui/StepNavigator'
import type { FormState } from '@/types'

// Step components
import { Step01_DataPribadi }        from '@/components/form/Step01_DataPribadi'
import { Step02_FisikKesehatan }     from '@/components/form/Step02_FisikKesehatan'
import { Step03_RiwayatPendidikan }  from '@/components/form/Step03_RiwayatPendidikan'
import { Step04_RiwayatPekerjaan }   from '@/components/form/Step04_RiwayatPekerjaan'
import { Step05_PerjalananHidup }   from '@/components/form/Step05_PerjalananHidup'
import { Step06_RiwayatOrganisasi }  from '@/components/form/Step06_RiwayatOrganisasi'
import { Step07_KarakterKepribadian } from '@/components/form/Step07_KarakterKepribadian'
import { Step08_IbadahKeislaman }    from '@/components/form/Step08_IbadahKeislaman'
import { Step09_GayaHidup }          from '@/components/form/Step09_GayaHidup'
import { Step10_VisiMisiPernikahan } from '@/components/form/Step10_VisiMisiPernikahan'
import { Step11_KriteriaPasangan }  from '@/components/form/Step11_KriteriaPasangan'
import { Step12_FinancialPlanning }  from '@/components/form/Step12_FinancialPlanning'
import { Step13_PandanganIsu }      from '@/components/form/Step13_PandanganIsu'
import { Step14_AnggotaKeluarga }   from '@/components/form/Step14_AnggotaKeluarga'
import { Step15_RencanaMasaDepan }  from '@/components/form/Step15_RencanaMasaDepan'
import { Step16_SosialMedia }       from '@/components/form/Step16_SosialMedia'
import { Step17_GaleriFoto }       from '@/components/form/Step17_GaleriFoto'
import { Step18_FotoTemplate }     from '@/components/form/Step18_FotoTemplate'
import { Step19_SuratTaaruf }    from '@/components/form/Step19_SuratTaaruf'
import { Step20_Referensi }      from '@/components/form/Step20_Referensi'
import { Step21_HarapanDoa }     from '@/components/form/Step21_HarapanDoa'
import { Step22_ReviewSimpan }   from '@/components/form/Step22_ReviewSimpan'

// ── Toast / feedback sederhana ────────────────────────────────
interface ToastProps {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

function Toast({ type, message, onClose }: ToastProps) {
  return (
    <div
      role="alert"
      className={[
        'fixed bottom-24 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg',
        'text-sm font-medium animate-slide-up max-w-xs w-full mx-4',
        type === 'success'
          ? 'bg-sage-800 border border-sage-600 text-sage-200'
          : 'bg-red-900 border border-red-700 text-red-200',
      ].join(' ')}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      )}
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Tutup notifikasi"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ── Placeholder untuk step yang belum diimplementasi ──────────
function StepComingSoon({ stepTitle }: { stepTitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4" role="img" aria-hidden="true">🚧</span>
      <h3 className="text-lg font-semibold text-white mb-2">
        {stepTitle}
      </h3>
      <p className="text-sm text-navy-400 max-w-xs leading-relaxed">
        Step ini sedang dalam pengembangan. Klik <strong className="text-sage-400">Lanjut</strong> untuk melewatinya.
      </p>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function CreateFormClient() {
  const router   = useRouter()
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const { userId, isLoading: authLoading, plan } = useRequireAuth()

  const nav = useStepNavigation()
  const { isSaving, isDirty, lastSavedLabel } = useSaveStatus()

  // ── Navigator state ──────────────────────────────────────
  const [showNavigator, setShowNavigator] = useState(false)
  const toggleNavigator = useCallback(() => {
    setShowNavigator((prev) => !prev)
  }, [])
  const closeNavigator = useCallback(() => {
    setShowNavigator(false)
  }, [])

  // ── All hooks must be called before any conditional return ──
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const stepDef = useMemo(
    () => STEP_DEFINITIONS[nav.currentStep - 1],
    [nav.currentStep]
  )

  const stepContent = useMemo(() => {
    switch (nav.currentStep) {
      case 1:  return <Step01_DataPribadi />
      case 2:  return <Step02_FisikKesehatan />
      case 3:  return <Step03_RiwayatPendidikan />
      case 4:  return <Step04_RiwayatPekerjaan />
      case 5:  return <Step05_PerjalananHidup />
      case 6:  return <Step06_RiwayatOrganisasi />
      case 7:  return <Step07_KarakterKepribadian />
      case 8:  return <Step08_IbadahKeislaman />
      case 9:  return <Step09_GayaHidup />
      case 10: return <Step10_VisiMisiPernikahan />
      case 11: return <Step11_KriteriaPasangan />
      case 12: return <Step12_FinancialPlanning />
      case 13: return <Step13_PandanganIsu />
      case 14: return <Step14_AnggotaKeluarga />
      case 15: return <Step15_RencanaMasaDepan />
      case 16: return <Step16_SosialMedia />
      case 17: return <Step17_GaleriFoto />
      case 18: return <Step18_FotoTemplate />
      case 19: return <Step19_SuratTaaruf />
      case 20: return <Step20_Referensi />
      case 21: return <Step21_HarapanDoa />
      case 22: return <Step22_ReviewSimpan />
      default: return <StepComingSoon stepTitle={stepDef?.title ?? `Step ${nav.currentStep}`} />
    }
  }, [nav.currentStep, stepDef])

  const handleNext = useCallback(async () => {
    // Jika step terakhir → simpan ke Supabase
    if (nav.isLastStep) {
      dispatch({ type: 'SET_SAVING', isSaving: true })

      // Gunakan real authenticated user ID
      if (!userId) {
        setToast({ type: 'error', message: 'Kamu harus login terlebih dahulu.' })
        dispatch({ type: 'SET_SAVING', isSaving: false })
        return
      }
      const result = await saveProfile(state, userId)

      if (result.success) {
        // Simpan profileId ke context
        if (result.profileId) {
          dispatch({ type: 'SET_PROFILE_ID', profileId: result.profileId })
        }
        dispatch({ type: 'SET_SAVED', timestamp: new Date().toISOString() })

        setToast({ type: 'success', message: 'Profil berhasil disimpan! 🎉' })

        // Navigasi ke halaman preview setelah 1.5 detik
        setTimeout(() => {
          router.push('/preview')
        }, 1500)
      } else {
        dispatch({ type: 'SET_SAVING', isSaving: false })
        setToast({
          type: 'error',
          message: result.error ?? 'Gagal menyimpan. Coba lagi.',
        })
      }
      return
    }

    // Bukan step terakhir → navigasi ke step berikutnya
    nav.nextStep()
  }, [nav, state, userId, dispatch, router])

  // ── Global Save handler (tanpa navigasi ke preview) ─────
  const handleGlobalSave = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', isSaving: true })

    if (!userId) {
      setToast({ type: 'error', message: 'Kamu harus login terlebih dahulu.' })
      dispatch({ type: 'SET_SAVING', isSaving: false })
      return
    }

    const result = await saveProfile(state, userId)

    if (result.success) {
      if (result.profileId) {
        dispatch({ type: 'SET_PROFILE_ID', profileId: result.profileId })
      }
      dispatch({ type: 'SET_SAVED', timestamp: new Date().toISOString() })
      setToast({ type: 'success', message: 'Profil tersimpan!' })
    } else {
      dispatch({ type: 'SET_SAVING', isSaving: false })
      setToast({
        type: 'error',
        message: result.error ?? 'Gagal menyimpan. Coba lagi.',
      })
    }
  }, [state, userId, dispatch])

  // ── Go to Dashboard handler ─────────────────────────────
  const handleGoToDashboard = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Ada perubahan belum tersimpan. Yakin ingin kembali ke Dashboard?'
      )
      if (!confirmed) return
    }
    router.push('/dashboard')
  }, [isDirty, router])

  // ── Redirect to login if not authenticated ────────────────
  // Fix: Tambahkan grace period 2 detik setelah auth selesai loading
  // untuk menghindari redirect premature akibat race condition
  // antara client-side auth state dan server-side middleware cookie
  useEffect(() => {
    if (authLoading) return // Masih loading, tunggu dulu

    if (!userId) {
      // Berikan waktu 2 detik setelah auth loading selesai
      // sebelum benar-benar redirect ke login.
      // Ini mencegah redirect saat session baru saja tersinkronkan
      // tetapi onAuthStateChange belum selesai diproses.
      const timer = setTimeout(() => {
        router.replace('/login?next=/create')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [authLoading, userId, router])

  // Sembunyikan toast otomatis setelah 4 detik
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  // ── Show loading while checking auth ──────────────────────
  if (authLoading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <div className="auth-spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
          <p className="text-sm text-navy-400">Memerikses autentikasi...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <StepWrapper
        stepNumber={nav.currentStep}
        totalSteps={nav.totalSteps}
        title={stepDef?.title ?? ''}
        subtitle={stepDef?.subtitle ?? ''}
        icon={stepDef?.icon}
        progressPercent={nav.progressPercent}
        isFirstStep={nav.isFirstStep}
        isLastStep={nav.isLastStep}
        isDirty={isDirty}
        isSaving={isSaving}
        lastSavedLabel={lastSavedLabel}
        onNext={handleNext}
        onPrev={nav.prevStep}
        onSave={handleGlobalSave}
        onGoToDashboard={handleGoToDashboard}
        onToggleNavigator={toggleNavigator}
        showNavigator={showNavigator}
      >
        {/* Animasi masuk saat ganti step */}
        <div key={nav.currentStep} className="animate-step-in">
          {stepContent}
        </div>
      </StepWrapper>

      {/* Step Navigator Sidebar */}
      <StepNavigator
        isOpen={showNavigator}
        onClose={closeNavigator}
        currentStep={nav.currentStep}
        totalSteps={nav.totalSteps}
        onGoToStep={nav.goToStep}
        formState={state}
        stepDefinitions={STEP_DEFINITIONS}
        plan={plan}
      />

      {/* Toast notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}