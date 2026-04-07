// ============================================================
// src/lib/passwordStrength.ts
// Shared password strength calculator
// Unified from signup and update-password pages
// ============================================================

export interface PasswordStrengthResult {
  score: number
  label: string
  color: string
}

/**
 * Calculate password strength based on:
 * - Length (>=8, >=12)
 * - Mixed case (uppercase + lowercase)
 * - Contains numbers
 * - Contains special characters
 *
 * Returns score 0-4 with descriptive label and color.
 * Score 0 = empty password, 1 = weak, 2 = fair, 3 = good, 4 = strong
 */
export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Cap at 4
  score = Math.min(score, 4)

  // Floor at 1 if password has content (never show "empty" strength for typed passwords)
  if (score === 0 && password.length > 0) score = 1

  const STRENGTH_CONFIG: Record<number, { label: string; color: string }> = {
    0: { label: '', color: '' },
    1: { label: 'Lemah — tambahkan huruf besar, angka, dan simbol', color: '#EF4444' },
    2: { label: 'Cukup — gunakan kombinasi huruf besar, angka, simbol', color: '#F97316' },
    3: { label: 'Baik — tambahkan simbol untuk keamanan lebih', color: '#EAB308' },
    4: { label: 'Kuat — password sudah aman', color: '#10B981' },
  }

  return { score, ...STRENGTH_CONFIG[score] }
}