// ============================================================
// src/components/ui/FocusTrap.tsx
// Simple focus trap for modal/dialog accessibility (WCAG 2.1)
// Traps Tab key within a container element
// ============================================================

'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface FocusTrapProps {
  children: ReactNode
  active: boolean
}

/**
 * FocusTrap — wraps children and traps keyboard focus inside when active.
 * Used for modals and dialogs to meet WCAG 2.1 focus management requirements.
 *
 * - Tab: moves focus to next focusable element (wraps around)
 * - Shift+Tab: moves focus to previous focusable element (wraps around)
 * - Escape: does NOT close (caller handles this)
 */
export function FocusTrap({ children, active }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current

    const FOCUSABLE_SELECTOR = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null
      )

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus the first focusable element when trap activates
    const focusable = getFocusableElements()
    if (focusable.length > 0) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => focusable[0].focus())
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}