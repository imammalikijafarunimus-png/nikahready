'use client'

// ============================================================
// src/components/PWAInstallPrompt.tsx
//
// Komponen install prompt PWA yang muncul di bottom bar.
//
// Menangani 2 skenario:
// 1. Android/Chrome: pakai `beforeinstallprompt` event
// 2. iOS Safari: tidak ada event → tampilkan instruksi manual
//
// Rules:
// - Semua browser detection hanya di useEffect (bukan render)
// - Event object disimpan di useRef (bukan useState) karena
//   BeforeInstallPromptEvent tidak serializable
// - localStorage guard dengan typeof window check
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────
// BeforeInstallPromptEvent tidak ada di TypeScript built-in
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

// ── Storage Keys ──────────────────────────────────────────────
const DISMISSED_KEY     = 'taarufcv_pwa_dismissed'
const DISMISSED_UNTIL   = 'taarufcv_pwa_dismissed_until'
const DISMISS_DURATION  = 7 * 24 * 60 * 60 * 1000  // 7 hari dalam ms

// ── Helpers ───────────────────────────────────────────────────
function isDismissedRecently(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const until = localStorage.getItem(DISMISSED_UNTIL)
    if (!until) return false
    return Date.now() < parseInt(until, 10)
  } catch {
    return false
  }
}

function saveDismissal() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DISMISSED_KEY, '1')
    localStorage.setItem(
      DISMISSED_UNTIL,
      String(Date.now() + DISMISS_DURATION)
    )
  } catch {
    // silent fail (private mode / storage penuh)
  }
}

function isRunningAsStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari check
    ('standalone' in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

// ── iOS Instruction Card ───────────────────────────────────────
function IOSInstructions({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative bg-navy-900 border-t border-navy-700 rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-navy-600 rounded-full mx-auto mb-4" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-navy-800 flex items-center justify-center text-navy-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-sage flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">☪</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              Install TaarufCV
            </h3>
            <p className="text-xs text-navy-400">
              Tambahkan ke Home Screen untuk akses cepat
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {[
            {
              step: 1,
              icon: '⬆️',
              text: (
                <>
                  Tap tombol{' '}
                  <strong className="text-white">Share</strong>{' '}
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-navy-600 text-xs">⬆</span>{' '}
                  di bagian bawah Safari
                </>
              ),
            },
            {
              step: 2,
              icon: '➕',
              text: (
                <>
                  Scroll ke bawah, pilih{' '}
                  <strong className="text-white">"Add to Home Screen"</strong>
                </>
              ),
            },
            {
              step: 3,
              icon: '✅',
              text: (
                <>
                  Tap <strong className="text-white">"Add"</strong> di pojok
                  kanan atas — selesai!
                </>
              ),
            },
          ].map(({ step, icon, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-sage-900/60 border border-sage-800 flex items-center justify-center text-sm flex-shrink-0">
                {icon}
              </div>
              <p className="text-sm text-navy-300 leading-relaxed pt-0.5">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Android / Chrome Install Banner ───────────────────────────
function AndroidBanner({
  onInstall,
  onClose,
  isInstalling,
}: {
  onInstall: () => void
  onClose:   () => void
  isInstalling: boolean
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
      role="dialog"
      aria-label="Install TaarufCV"
    >
      <div className="bg-navy-900 border-t border-navy-700 px-4 py-4 flex items-center gap-3 shadow-2xl">
        {/* App icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-sage flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">☪</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">
            Install TaarufCV
          </p>
          <p className="text-xs text-navy-400 leading-tight mt-0.5">
            Akses lebih cepat langsung dari Home Screen
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Nanti saja"
            className="px-3 py-1.5 rounded-lg text-xs text-navy-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            Nanti
          </button>
          <button
            type="button"
            onClick={onInstall}
            disabled={isInstalling}
            className={[
              'flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold',
              'transition-all duration-200 active:scale-95',
              isInstalling
                ? 'bg-navy-700 text-navy-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-sage-700 to-sage-600 text-white hover:from-sage-600 hover:to-sage-500',
            ].join(' ')}
          >
            {isInstalling ? (
              <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function PWAInstallPrompt() {
  // Simpan event di ref — event tidak serializable ke state
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)

  const [showAndroidBanner, setShowAndroidBanner] = useState(false)
  const [showIOSSheet,      setShowIOSSheet]      = useState(false)
  const [isInstalling,      setIsInstalling]      = useState(false)
  const [isInstalled,       setIsInstalled]       = useState(false)

  useEffect(() => {
    // Jika sudah running sebagai standalone → sudah di-install
    if (isRunningAsStandalone()) {
      setIsInstalled(true)
      return
    }

    // Jika sudah dismiss baru-baru ini → jangan tampilkan
    if (isDismissedRecently()) return

    // ── Handler untuk Android/Chrome ──────────────────────
    const handleBeforeInstall = (e: Event) => {
      // Cegah prompt native browser muncul otomatis
      e.preventDefault()
      deferredPromptRef.current = e as BeforeInstallPromptEvent
      // Tampilkan banner kita setelah delay kecil (UX: biarkan halaman load dulu)
      setTimeout(() => setShowAndroidBanner(true), 2000)
    }

    // ── Handler setelah app di-install ────────────────────
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowAndroidBanner(false)
      deferredPromptRef.current = null
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    // ── iOS Detection ──────────────────────────────────────
    // iOS tidak punya beforeinstallprompt → deteksi manual
    // Tampilkan hanya di Safari iOS yang belum standalone
    if (isIOS()) {
      const isSafari = /safari/i.test(navigator.userAgent) &&
                       !/crios|fxios|opios|mercury/i.test(navigator.userAgent)
      if (isSafari) {
        setTimeout(() => setShowIOSSheet(true), 3000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // ── Handle install (Android) ───────────────────────────────
  const handleInstall = useCallback(async () => {
    if (!deferredPromptRef.current) return
    setIsInstalling(true)

    try {
      await deferredPromptRef.current.prompt()
      const { outcome } = await deferredPromptRef.current.userChoice

      if (outcome === 'accepted') {
        setShowAndroidBanner(false)
        deferredPromptRef.current = null
      }
    } catch (err) {
      console.warn('[TaarufCV] Install prompt error:', err)
    } finally {
      setIsInstalling(false)
    }
  }, [])

  // ── Handle dismiss ─────────────────────────────────────────
  const handleDismissAndroid = useCallback(() => {
    setShowAndroidBanner(false)
    saveDismissal()
  }, [])

  const handleDismissIOS = useCallback(() => {
    setShowIOSSheet(false)
    saveDismissal()
  }, [])

  // Tidak render apa-apa jika sudah di-install atau tidak ada prompt
  if (isInstalled) return null

  return (
    <>
      {showAndroidBanner && (
        <AndroidBanner
          onInstall={handleInstall}
          onClose={handleDismissAndroid}
          isInstalling={isInstalling}
        />
      )}
      {showIOSSheet && (
        <IOSInstructions onClose={handleDismissIOS} />
      )}
    </>
  )
}
