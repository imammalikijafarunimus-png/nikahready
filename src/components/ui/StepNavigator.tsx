'use client'

// ============================================================
// src/components/ui/StepNavigator.tsx
//
// Slide-in sidebar panel yang menampilkan semua 22 langkah form
// dengan indikator penyelesaian. Memungkinkan navigasi cepat
// antar langkah.
// ============================================================

import React, { useMemo, useEffect, useCallback } from 'react'
import type { FormState, StepDefinition } from '@/types'

// ── Array sections (langkah yang datanya berupa array) ────────
const ARRAY_SECTIONS = new Set([
  'riwayatPendidikan',
  'riwayatPekerjaan',
  'perjalananHidup',
  'riwayatOrganisasi',
  'sosialMedia',
  'galeriFoto',
  'anggotaKeluarga',
  'rencanaMasaDepan',
] as const)

// ── Placeholder steps (tidak punya section sendiri) ──────────
const PLACEHOLDER_STEPS = new Set([19, 20, 21, 22])

// ── Helper: cek apakah scalar section punya data ─────────────
function isScalarSectionFilled(
  state: FormState,
  section: string
): boolean {
  const data = (state as unknown as Record<string, unknown>)[section]
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false

  return Object.values(data).some((v) => {
    if (v === '' || v === null || v === undefined) return false
    if (Array.isArray(v) && v.length === 0) return false
    if (typeof v === 'number' && v === 0) return false
    return true
  })
}

// ── Helper: cek apakah array section punya data ──────────────
function isArraySectionFilled(
  state: FormState,
  section: string
): boolean {
  const data = (state as unknown as Record<string, unknown>)[section]
  return Array.isArray(data) && data.length > 0
}

// ── Props ────────────────────────────────────────────────────
interface StepNavigatorProps {
  isOpen: boolean
  onClose: () => void
  currentStep: number
  totalSteps: number
  onGoToStep: (step: number) => void
  formState: FormState
  stepDefinitions: StepDefinition[]
  plan: 'free' | 'premium'
}

// ── Status type untuk setiap langkah ─────────────────────────
type StepStatus = 'completed' | 'current' | 'upcoming' | 'placeholder'

// ── Main Component ───────────────────────────────────────────
export function StepNavigator({
  isOpen,
  onClose,
  currentStep,
  totalSteps,
  onGoToStep,
  formState,
  stepDefinitions,
  plan,
}: StepNavigatorProps) {
  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Hitung status & kelengkapan setiap langkah
  const stepStatuses = useMemo(() => {
    const statuses: StepStatus[] = []

    for (let i = 0; i < totalSteps; i++) {
      const stepDef = stepDefinitions[i]
      if (!stepDef) {
        statuses.push('upcoming')
        continue
      }

      const stepNum = stepDef.step

      if (PLACEHOLDER_STEPS.has(stepNum)) {
        statuses.push('placeholder')
        continue
      }

      if (stepNum === currentStep) {
        statuses.push('current')
        continue
      }

      // Cek kelengkapan berdasarkan tipe section
      const section = stepDef.section
      let isFilled = false

      if (section === 'navigation') {
        isFilled = false
      } else if (ARRAY_SECTIONS.has(section as typeof ARRAY_SECTIONS extends Set<infer T> ? T : never)) {
        isFilled = isArraySectionFilled(formState, section)
      } else {
        isFilled = isScalarSectionFilled(formState, section)
      }

      statuses.push(isFilled ? 'completed' : 'upcoming')
    }

    return statuses
  }, [totalSteps, stepDefinitions, currentStep, formState])

  // Hitung jumlah langkah yang selesai
  const completedCount = useMemo(
    () => stepStatuses.filter((s) => s === 'completed').length,
    [stepStatuses]
  )

  const completionPercent = Math.round((completedCount / totalSteps) * 100)

  // Handle klik langkah
  const handleStepClick = useCallback(
    (step: number) => {
      onGoToStep(step)
      onClose()
    },
    [onGoToStep, onClose]
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-navy-900 border-l border-navy-700 shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Navigasi langkah"
      >
        {/* ── Panel Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-navy-800">
          <div>
            <h2 className="text-base font-bold text-white">Langkah Form</h2>
            <p className="text-xs text-navy-400 mt-0.5">
              {completedCount} dari {totalSteps} langkah selesai
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800 transition-colors duration-200"
            aria-label="Tutup panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Completion progress bar ───────────────────────── */}
        <div className="px-4 py-3 border-b border-navy-800">
          <div className="w-full bg-navy-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-sage-600 to-sage-400 transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-xs text-navy-500 mt-1.5 text-center">
            {completionPercent}% selesai
          </p>
        </div>

        {/* ── Step List (scrollable) ────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {stepDefinitions.map((stepDef, index) => {
              const status = stepStatuses[index] ?? 'upcoming'
              const isCurrent = stepDef.step === currentStep

              return (
                <li key={stepDef.step}>
                  <button
                    type="button"
                    onClick={() => handleStepClick(stepDef.step)}
                    className={[
                      'w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200',
                      isCurrent
                        ? 'bg-sage-900/30 border-l-2 border-sage-500'
                        : 'hover:bg-navy-800/60 border-l-2 border-transparent',
                    ].join(' ')}
                  >
                    {/* Step number / status icon */}
                    <span
                      className={[
                        'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200',
                        status === 'completed'
                          ? 'bg-sage-800 text-sage-300 border border-sage-600'
                          : status === 'current'
                          ? 'bg-sage-600 text-white border border-sage-400'
                          : status === 'placeholder'
                          ? 'bg-navy-800 text-navy-500 border border-navy-700'
                          : 'bg-navy-800 text-navy-500 border border-navy-700',
                      ].join(' ')}
                    >
                      {status === 'completed' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : status === 'placeholder' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      ) : (
                        stepDef.step
                      )}
                    </span>

                    {/* Icon */}
                    <span className="text-base flex-shrink-0">{stepDef.icon}</span>

                    {/* Title + subtitle */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={[
                          'text-sm font-medium truncate',
                          isCurrent ? 'text-sage-300' : status === 'completed' ? 'text-white' : 'text-navy-400',
                        ].join(' ')}
                      >
                        {stepDef.title}
                      </p>
                      <p className="text-xs text-navy-500 truncate">
                        {stepDef.isPremiumOnly && plan === 'free'
                          ? 'NikahReady Pro'
                          : status === 'placeholder'
                          ? 'Segera hadir'
                          : stepDef.subtitle}
                      </p>
                    </div>

                    {/* Current step indicator */}
                    {isCurrent && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sage-400" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ── Panel Footer ──────────────────────────────────── */}
        <div className="px-4 py-3 border-t border-navy-800">
          <p className="text-xs text-navy-500 text-center">
            Klik langkah untuk langsung menuju ke sana
          </p>
        </div>
      </div>
    </>
  )
}