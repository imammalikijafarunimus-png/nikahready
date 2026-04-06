// ============================================================
// src/lib/rateLimit.ts
//
// Simple in-memory rate limiter untuk auth endpoints.
// Digunakan di login dan signup pages (client-side) serta
// bisa dipakai di API routes (server-side).
//
// Limitasi:
// - In-memory = tidak persist antar serverless instances.
//   Untuk Vercel hobby plan (1 instance) ini cukup.
//   Untuk production multi-instance, gunakan Upstash Redis.
// - Counter reset setelah window expiry.
// ============================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store: key = identifier (email or IP), value = entry
const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries setiap 5 menit
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /** Jumlah maksimal request dalam satu window */
  maxRequests: number
  /** Durasi window dalam detik */
  windowSeconds: number
}

/** Default configs */
export const RATE_LIMITS = {
  /** Login: 5 percobaan per email per 15 menit */
  login: { maxRequests: 5, windowSeconds: 900 } as RateLimitConfig,
  /** Signup: 3 per IP per jam */
  signup: { maxRequests: 3, windowSeconds: 3600 } as RateLimitConfig,
  /** Password reset: 3 per email per jam */
  passwordReset: { maxRequests: 3, windowSeconds: 3600 } as RateLimitConfig,
  /** Global: 100 per IP per menit */
  global: { maxRequests: 100, windowSeconds: 60 } as RateLimitConfig,
} as const

export type RateLimitType = keyof typeof RATE_LIMITS

/**
 * Cek apakah request diperbolehkan berdasarkan rate limit.
 * Returns { allowed: true } jika OK, atau { allowed: false, retryAfter }
 * jika sudah melebihi batas.
 *
 * @param identifier - Email (untuk login/password reset) atau IP (untuk signup/global)
 * @param type - Tipe rate limit dari RATE_LIMITS
 */
export function checkRateLimit(
  identifier: string,
  type: RateLimitType
): { allowed: true } | { allowed: false; retryAfter: number } {
  const config = RATE_LIMITS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()

  let entry = store.get(key)

  // Jika tidak ada entry atau sudah expired, buat baru
  if (!entry || entry.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    })
    return { allowed: true }
  }

  // Increment counter
  entry.count += 1

  // Cek apakah melebihi batas
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  return { allowed: true }
}

/**
 * Reset rate limit counter untuk identifier tertentu.
 * Dipanggil setelah login berhasil (reset counter gagal login).
 */
export function resetRateLimit(identifier: string, type: RateLimitType): void {
  const key = `${type}:${identifier}`
  store.delete(key)
}

/**
 * Format retryAfter (dalam detik) menjadi string yang bisa ditampilkan.
 * Contoh: 120 → "2 menit", 3600 → "1 jam"
 */
export function formatRetryAfter(seconds: number): string {
  if (seconds < 60) return `${seconds} detik`
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} menit`
  return `${Math.ceil(seconds / 3600)} jam`
}