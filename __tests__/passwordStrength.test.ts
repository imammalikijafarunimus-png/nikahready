import { describe, it, expect } from 'vitest'
import { getPasswordStrength } from '@/lib/passwordStrength'

describe('getPasswordStrength', () => {
  describe('score 0 — empty password', () => {
    it('returns score 0 for empty string', () => {
      const result = getPasswordStrength('')
      expect(result.score).toBe(0)
      expect(result.label).toBe('')
      expect(result.color).toBe('')
    })
  })

  describe('score 1 — weak', () => {
    it('returns score 1 for single character', () => {
      const result = getPasswordStrength('a')
      expect(result.score).toBe(1)
      expect(result.label).toContain('Lemah')
      expect(result.color).toBe('#EF4444')
    })

    it('returns score 1 for short password without variation', () => {
      const result = getPasswordStrength('abcdef')
      expect(result.score).toBe(1) // floor: non-empty → min 1
      expect(result.label).toContain('Lemah')
    })
  })

  describe('score 2 — fair', () => {
    it('returns score 2 for 12+ lowercase chars', () => {
      const result = getPasswordStrength('abcdefghijkl')
      // length>=8 (+1) + length>=12 (+1) = 2
      expect(result.score).toBe(2)
      expect(result.label).toContain('Cukup')
      expect(result.color).toBe('#F97316')
    })

    it('returns score 2 for 8+ chars with mixed case', () => {
      const result = getPasswordStrength('Abcdefgh')
      // length>=8 (+1) + mixed case (+1) = 2
      expect(result.score).toBe(2)
    })
  })

  describe('score 3 — good', () => {
    it('returns score 3 for mixed case + number', () => {
      const result = getPasswordStrength('Abcdefgh1')
      // length>=8 (+1) + mixed (+1) + digit (+1) = 3
      expect(result.score).toBe(3)
      expect(result.label).toContain('Baik')
      expect(result.color).toBe('#EAB308')
    })
  })

  describe('score 4 — strong', () => {
    it('returns score 4 for mixed case + number + special', () => {
      const result = getPasswordStrength('Abcdefgh1!')
      // length>=8 (+1) + mixed (+1) + digit (+1) + special (+1) = 4
      expect(result.score).toBe(4)
      expect(result.label).toContain('Kuat')
      expect(result.color).toBe('#10B981')
    })

    it('returns score 4 (capped) for very strong password', () => {
      const result = getPasswordStrength('MyStr0ng!Passw0rd#2024')
      // All 5 criteria → raw 5, capped to 4
      expect(result.score).toBe(4)
    })
  })

  describe('edge cases', () => {
    it('floor at 1 for any non-empty password', () => {
      const result = getPasswordStrength('!')
      // special char (+1) = 1
      expect(result.score).toBe(1)
    })

    it('score never exceeds 4', () => {
      // 5 criteria: >=8, >=12, mixed, digit, special → raw 5 → cap 4
      const result = getPasswordStrength('Abcdefghijkl1!')
      expect(result.score).toBe(4)
    })
  })
})