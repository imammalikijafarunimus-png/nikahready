// ============================================================
// src/components/ui/AriaLive.tsx
// Accessible live region for screen reader announcements (WCAG 2.1)
// Used to announce status changes (save success, errors, etc.)
// ============================================================

'use client'

import { useEffect, useRef } from 'react'

interface AriaLiveProps {
  message: string | null
  /** 'polite' waits for idle, 'assertive' interrupts immediately */
  politeness?: 'polite' | 'assertive'
}

/**
 * AriaLive — renders an invisible live region that announces
 * messages to screen readers when the message changes.
 *
 * Usage:
 * ```tsx
 * const [saveMsg, setSaveMsg] = useState<string | null>(null)
 * <AriaLive message={saveMsg} />
 * ```
 */
export function AriaLive({ message, politeness = 'polite' }: AriaLiveProps) {
  const lastAnnounced = useRef<string | null>(null)

  useEffect(() => {
    if (message && message !== lastAnnounced.current) {
      lastAnnounced.current = message
    }
  }, [message])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {message}
    </div>
  )
}