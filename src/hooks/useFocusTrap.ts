// ============================================================
// src/hooks/useFocusTrap.ts
// Fase 4.3 — WCAG 2.1 Focus Trap hook
//
// Menjembatani fokus keyboard di dalam modal/dialog.
// Saat modal terbuka, Tab dan Shift+Tab hanya berpindah
// antar elemen focusable di dalam container.
// Saat modal tertutup, fokus kembali ke trigger element.
//
// Digunakan oleh:
// - dashboard/page.tsx (logout confirmation modal)
// - Komponen modal lainnya
// ============================================================

'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseFocusTrapOptions {
  /** Aktifkan focus trap */
  active: boolean
  /** Selector atau ref elemen yang menjadi container */
  containerRef?: React.RefObject<HTMLElement | null>
  /** Elemen yang memicu modal (fokus kembali ke sini saat tutup) */
  triggerRef?: React.RefObject<HTMLElement | null>
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useFocusTrap({
  active,
  containerRef,
  triggerRef,
}: UseFocusTrapOptions) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback((): HTMLElement[] => {
    const container = containerRef?.current
    if (!container) return []

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    )
    return elements.filter((el) => {
      // Filter hidden elements
      if (el.offsetParent === null && el.style.position !== 'fixed') return false
      if (el.getAttribute('aria-hidden') === 'true') return false
      if (el.style.display === 'none') return false
      if (el.style.visibility === 'hidden') return false
      return true
    })
  }, [containerRef])

  // ✅ SESUDAH
  useEffect(() => {
    if (!active) return

    // Simpan elemen yang sedang fokus sebelum trap aktif
    previouslyFocusedRef.current = document.activeElement as HTMLElement

    // ⬇️ FIX: Copy triggerRef.current ke variable lokal di awal effect
    const triggerEl = triggerRef?.current ?? null

    const focusables = getFocusableElements()
    if (focusables.length > 0) {
      const cancelButton = focusables.find((el) =>
        el.textContent?.toLowerCase().includes('batal')
      )
      ;(cancelButton || focusables[0]).focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusables = getFocusableElements()
      if (focusables.length === 0) {
        e.preventDefault()
        return
      }

      const firstEl = focusables[0]
      const lastEl = focusables[focusables.length - 1]
      const activeEl = document.activeElement

      if (e.shiftKey) {
        if (activeEl === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (activeEl === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)

      // ✅ Pakai variable lokal, bukan triggerRef.current langsung
      const restoreFocus = triggerEl || previouslyFocusedRef.current
      if (restoreFocus && typeof restoreFocus.focus === 'function') {
        setTimeout(() => restoreFocus.focus(), 0)
      }
    }
  }, [active, containerRef, triggerRef, getFocusableElements])
}
