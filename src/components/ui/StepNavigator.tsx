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
import '../../app/create/create.css'

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

  // Handle klik langkah — semua step bisa dikunjungi (view-only untuk premium)
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
        className="form-navigator-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="form-navigator-panel form-navigator-slide-in"
        role="dialog"
        aria-modal="true"
        aria-label="Navigasi langkah"
      >
        {/* ── Panel Header ──────────────────────────────────── */}
        <div className="form-navigator-header">
          <div>
            <h2 className="form-navigator-title">Langkah Form</h2>
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
        <div className="form-navigator-progress">
          <div className="form-navigator-progress-bar">
            <div
              className="form-navigator-progress-fill"
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
              const isLocked = stepDef.isPremiumOnly && plan === 'free'

              return (
                <li key={stepDef.step}>
                  <button
                    type="button"
                    onClick={() => handleStepClick(stepDef.step)}
                    className={
                      isCurrent
                        ? 'form-navigator-item form-navigator-item-current'
                        : 'form-navigator-item form-navigator-item-hover'
                    }
                  >
                    {/* Step number / status icon */}
                    <span
                      className={
                        status === 'completed'
                          ? 'form-navigator-number form-navigator-number-completed'
                          : status === 'current'
                          ? 'form-navigator-number form-navigator-number-current'
                          : 'form-navigator-number form-navigator-number-upcoming'
                      }
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

                    {/* Icon: premium steps show lock for free users */}
                    {isLocked ? (
                      <span className="text-base flex-shrink-0 opacity-50">{stepDef.icon}</span>
                    ) : (
                      <span className="text-base flex-shrink-0">{stepDef.icon}</span>
                    )}

                    {/* Title + subtitle */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={
                          isCurrent
                            ? 'form-navigator-step-title form-navigator-step-title-current'
                            : status === 'completed'
                            ? 'form-navigator-step-title form-navigator-step-title-completed'
                            : 'form-navigator-step-title form-navigator-step-title-upcoming'
                        }
                      >
                        {stepDef.title}
                      </p>
                      <p className="form-navigator-step-subtitle">
                        {isLocked
                          ? 'Preview saja — upgrade untuk mengisi'
                          : status === 'placeholder'
                          ? 'Segera hadir'
                          : stepDef.subtitle}
                      </p>
                    </div>

                    {/* Current step indicator */}
                    {isCurrent && (
                      <span className="form-navigator-current-dot" />
                    )}

                    {/* Premium badge */}
                    {stepDef.isPremiumOnly && plan === 'free' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gold-900/30 border border-gold-700/40 text-gold-500 font-semibold flex-shrink-0">
                        PRO
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ── Panel Footer ──────────────────────────────────── */}
        <div className="form-navigator-footer">
          <p className="text-xs text-navy-500 text-center">
            Klik langkah untuk langsung menuju ke sana
          </p>
        </div>
      </div>
    </>
  )
}