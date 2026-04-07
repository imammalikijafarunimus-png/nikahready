// ============================================================
// src/components/ui/StepWrapper.tsx
//
// Layout container untuk setiap step form.
// Server Component — tidak ada interaktivitas di sini,
// children-lah yang bertanggung jawab atas interaksi.
// ============================================================

import React from 'react'
import '../../app/create/create.css'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface StepWrapperProps {
  // Metadata step
  stepNumber: number
  totalSteps: number
  title: string
  subtitle: string
  icon?: string

  // Navigation state
  progressPercent: number
  isFirstStep: boolean
  isLastStep: boolean
  isDirty?: boolean
  isSaving?: boolean
  lastSavedLabel?: string | null

  // Callbacks (dari parent client component)
  onNext: () => void
  onPrev: () => void

  // New UX callbacks
  onSave?: () => void
  onGoToDashboard?: () => void
  onToggleNavigator?: () => void
  showNavigator?: boolean

  // Content
  children: React.ReactNode

  // Optional: kelas tambahan untuk area konten
  className?: string
}

// ── Progress Bar ─────────────────────────────────────────────
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="form-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="form-progress-bar"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

// ── Save Status Badge ────────────────────────────────────────
function SaveStatus({
  isSaving,
  isDirty,
  lastSavedLabel,
}: {
  isSaving?: boolean
  isDirty?: boolean
  lastSavedLabel?: string | null
}) {
  if (isSaving) {
    return (
      <span className="flex items-center gap-1 text-xs text-sage-400">
        <span className="inline-block w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
        Menyimpan…
      </span>
    )
  }
  if (!isDirty && lastSavedLabel) {
    return (
      <span className="flex items-center gap-1 text-xs text-navy-500 dark:text-navy-400">
        <svg className="w-3 h-3 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        Tersimpan {lastSavedLabel}
      </span>
    )
  }
  if (isDirty) {
    return (
      <span className="flex items-center gap-1 text-xs text-gold-500">
        <span className="inline-block w-2 h-2 rounded-full bg-gold-500" />
        Belum tersimpan
      </span>
    )
  }
  return null
}

// ── Main Component ───────────────────────────────────────────
export function StepWrapper({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  icon,
  progressPercent,
  isFirstStep,
  isLastStep,
  isDirty,
  isSaving,
  lastSavedLabel,
  onNext,
  onPrev,
  onSave,
  onGoToDashboard,
  onToggleNavigator,
  showNavigator = false,
  children,
  className = '',
}: StepWrapperProps) {
  return (
    <div className="form-page">
      {/* Pattern overlay & ambient glow */}
      <div className="form-pattern" aria-hidden="true" />
      <div className="form-glow" aria-hidden="true" />

      {/* ── Top Header Bar ─────────────────────────────────── */}
      <header className="form-header">
        <div className="form-header-inner">
          {/* Row 1: Dashboard + branding + navigator/save + save status */}
          <div className="flex items-center justify-between mb-2">
            {/* Left: Dashboard button + Logo */}
            <div className="flex items-center gap-2">
              {/* Dashboard button */}
              {onGoToDashboard && (
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  aria-label="Kembali ke Dashboard"
                  className="flex items-center gap-1 text-navy-600 dark:text-navy-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span className="text-xs hidden sm:inline">Dashboard</span>
                </button>
              )}
              {/* Logo kecil */}
              <div className="w-6 h-6 rounded-md bg-gradient-sage flex items-center justify-center">
                <span className="text-xs">☪</span>
              </div>
              <span className="text-xs font-medium text-navy-700 dark:text-navy-300">
                NikahReady
              </span>
            </div>

            {/* Right: Save status + Simpan + Theme toggle + Navigator */}
            <div className="flex items-center gap-3">
              {/* Save status */}
              <SaveStatus
                isSaving={isSaving}
                isDirty={isDirty}
                lastSavedLabel={lastSavedLabel}
              />

              {/* Simpan button */}
              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  aria-label="Simpan profil"
                  className={[
                    'flex items-center gap-1 text-navy-600 dark:text-navy-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors duration-200',
                    isSaving ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                  </svg>
                  <span className="text-xs hidden sm:inline">Simpan</span>
                </button>
              )}

              {/* Theme toggle */}
              <ThemeToggle size={16} />

              {/* Navigator toggle button */}
              {onToggleNavigator && (
                <button
                  type="button"
                  onClick={onToggleNavigator}
                  aria-label="Buka navigasi langkah"
                  className={[
                    'flex items-center gap-1 text-navy-600 dark:text-navy-400 hover:text-sage-600 dark:hover:text-sage-400 transition-colors duration-200',
                    showNavigator ? 'text-sage-600 dark:text-sage-400' : '',
                  ].join(' ')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                  </svg>
                  <span className="text-xs font-medium">{stepNumber}/{totalSteps}</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Progress bar */}
          <ProgressBar percent={progressPercent} />
        </div>
      </header>

      {/* ── Main Content Area ──────────────────────────────── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 relative z-10">
        {/* Step title card */}
        <div className="form-step-title-area">
          <div className="flex items-start gap-3">
            {icon && (
              <span
                className="text-3xl flex-shrink-0 mt-0.5"
                role="img"
                aria-hidden="true"
              >
                {icon}
              </span>
            )}
            <div>
              <h1 className="form-step-title">
                {title}
              </h1>
              <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{subtitle}</p>
            </div>
          </div>

          {/* Dekoratif: garis hijau tipis di bawah judul */}
          <div className="mt-4 flex gap-1">
            <div className="h-0.5 w-12 rounded-full bg-sage-600" />
            <div className="h-0.5 w-4 rounded-full bg-gold-600" />
            <div className="h-0.5 w-2 rounded-full bg-sage-800" />
          </div>
        </div>

        {/* Form content */}
        <div className={`space-y-5 ${className}`}>{children}</div>
      </main>

      {/* ── Bottom Navigation Bar ──────────────────────────── */}
      <nav className="form-bottom-nav">
        <div className="form-bottom-nav-inner">
          {/* Prev button / Dashboard on first step */}
          {isFirstStep ? (
            /* On first step: Dashboard button */
            onGoToDashboard ? (
              <button
                type="button"
                onClick={onGoToDashboard}
                aria-label="Kembali ke Dashboard"
                className="form-btn-prev"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Dashboard
              </button>
            ) : null
          ) : (
            /* Normal: Kembali button */
            <button
              type="button"
              onClick={onPrev}
              aria-label="Langkah sebelumnya"
              className="form-btn-prev"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Kembali
            </button>
          )}

          {/* Step dots (max 7 visible) */}
          <div className="flex-1 flex items-center justify-center gap-1" aria-hidden="true">
            {Array.from({ length: Math.min(totalSteps, 7) }).map((_, i) => {
              const dotStep = i + 1
              const isActive = dotStep === stepNumber
              const isPast = dotStep < stepNumber
              return (
                <div
                  key={dotStep}
                  className={
                    isActive
                      ? 'form-step-dot form-step-dot-active'
                      : isPast
                      ? 'form-step-dot form-step-dot-past'
                      : 'form-step-dot form-step-dot-upcoming'
                  }
                />
              )
            })}
            {totalSteps > 7 && (
              <span className="text-xs text-navy-400 dark:text-navy-500 ml-1">…</span>
            )}
          </div>

          {/* Next / Submit / Selesai button */}
          <button
            type="button"
            onClick={onNext}
            aria-label={isLastStep ? 'Simpan dan selesai' : 'Langkah berikutnya'}
            className={isLastStep ? 'form-btn-submit' : 'form-btn-next'}
          >
            {isLastStep ? (
              <>
                Simpan
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </>
            ) : (
              <>
                Lanjut
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </>
            )}
          </button>
        </div>
      </nav>
    </div>
  )
}