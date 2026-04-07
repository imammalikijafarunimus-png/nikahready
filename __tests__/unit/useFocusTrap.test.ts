// ============================================================
// __tests__/unit/useFocusTrap.test.ts
// Fase 5.3 — Unit tests untuk useFocusTrap hook
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock the hook since it depends on DOM APIs
// We test the concept rather than full DOM interaction
describe('useFocusTrap — concept test', () => {
  it('harus bisa di-import tanpa error', async () => {
    const { useFocusTrap } = await import('@/hooks/useFocusTrap')
    expect(typeof useFocusTrap).toBe('function')
  })

  it('hook tidak throw saat active=false', async () => {
    const { useFocusTrap } = await import('@/hooks/useFocusTrap')

    const containerRef = { current: document.createElement('div') }
    const { result } = renderHook(() =>
      useFocusTrap({ active: false, containerRef })
    )

    expect(result.current).toBeUndefined()
  })
})
