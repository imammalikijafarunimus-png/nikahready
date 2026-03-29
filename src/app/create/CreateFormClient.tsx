'use client'

// ============================================================
// src/app/create/CreateFormClient.tsx
// Orchestrator utama multi-step form.
// Mengatur: routing antar step, progress, save ke Supabase.
// ============================================================

import { useMemo, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  useFormState,
  useFormDispatch,
  useStepNavigation,
  useSaveStatus,
} from '@/context/FormContext'
import { STEP_DEFINITIONS } from '@/lib/constants'
import { saveProfile } from '@/lib/supabase/saveProfile'
import { StepWrapper } from '@/components/ui/StepWrapper'

// Step components
import { Step01_DataPribadi }    from '@/components/form/Step01_DataPribadi'
import { Step02_RiwayatPekerjaan } from '@/components/form/Step02_RiwayatPekerjaan'
import { Step03_PerjalananHidup }  from '@/components/form/Step03_PerjalananHidup'
import { Step04_PandanganIsu }     from '@/components/form/Step04_PandanganIsu'

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

  const nav = useStepNavigation()
  const { isSaving, isDirty, lastSavedLabel } = useSaveStatus()

  // Toast state
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Ambil definisi step saat ini
  const stepDef = useMemo(
    () => STEP_DEFINITIONS[nav.currentStep - 1],
    [nav.currentStep]
  )

  // ── Handle next step / save ────────────────────────────────
  const handleNext = useCallback(async () => {
    // Jika step terakhir → simpan ke Supabase
    if (nav.isLastStep) {
      dispatch({ type: 'SET_SAVING', isSaving: true })

      // MVP: gunakan userId dummy (nanti diganti dengan auth.user.id)
      const DUMMY_USER_ID = 'dummy-user-id'
      const result = await saveProfile(state, DUMMY_USER_ID)

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
  }, [nav, state, dispatch, router])

  // ── Render step content ────────────────────────────────────
  const stepContent = useMemo(() => {
    switch (nav.currentStep) {
      case 1:  return <Step01_DataPribadi />
      case 2:  return <Step02_RiwayatPekerjaan />  // disesuaikan ke step 4 original
      case 3:  return <Step03_PerjalananHidup />
      case 4:  return <Step04_PandanganIsu />
      default: return <StepComingSoon stepTitle={stepDef?.title ?? `Step ${nav.currentStep}`} />
    }
  }, [nav.currentStep, stepDef])

  // Sembunyikan toast otomatis setelah 4 detik
  if (toast) {
    setTimeout(() => setToast(null), 4000)
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
      >
        {/* Animasi masuk saat ganti step */}
        <div key={nav.currentStep} className="animate-step-in">
          {stepContent}
        </div>
      </StepWrapper>

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
