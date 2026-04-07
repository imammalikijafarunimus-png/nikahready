// ============================================================
// src/lib/admin/adminHelpers.ts
//
// Helper functions untuk operasi admin.
// FASE 2 REFACTOR: Semua operasi admin sekarang dilakukan
// melalui server-side API routes (/api/admin/*) bukan langsung
// dari client-side Supabase client.
//
// Keuntungan:
// - Validasi admin dilakukan server-side (tidak bisa di-bypass)
// - Audit log dibuat dari server (tidak bisa dimanipulasi client)
// - Input validation di server sebelum DB operation
// - Self-demotion/self-deletion prevention
//
// FASE 1 FIX:
// - getAdminStats() sekarang THROW error alih-alih return 0
// - getAdminUsers() sekarang THROW error alih-alih return empty
// - Error dari API (401, 403, 500) di-propagate ke UI
// - adminApi() sekarang log error detail untuk debugging
// ============================================================

import { createClient } from '@/lib/supabase/client'

// ── Types ────────────────────────────────────────────────────
export interface AdminUser {
  id: string
  email: string
  phone: string | null
  plan: 'free' | 'premium'
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface AdminStats {
  totalUsers: number
  freeUsers: number
  premiumUsers: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  totalSubscriptions: number
  activeSubscriptions: number
}

export interface SubscriptionRecord {
  id: string
  user_id: string
  user_email: string
  plan: 'free' | 'premium'
  start_date: string
  end_date: string | null
  payment_provider: string | null
  transaction_id: string | null
  status: 'active' | 'expired' | 'cancelled' | 'trial'
  notes: string | null
  created_at: string
  created_by: string | null
}

export interface AuditLog {
  id: string
  admin_id: string
  admin_email: string
  action: string
  target_user_id: string | null
  target_email: string | null
  details: Record<string, unknown>
  created_at: string
}

// ── Custom Error ─────────────────────────────────────────────

/**
 * Custom error untuk admin API yang membawa status code.
 * Digunakan oleh UI untuk menampilkan pesan error yang sesuai.
 */
export class AdminApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'AdminApiError'
  }
}

// ── Admin Auth Check ─────────────────────────────────────────

/**
 * Cek apakah user yang sedang login adalah admin.
 * Returns { isAdmin, userId }
 *
 * FIX (Fase 1): 3-layer check dengan fallback:
 * 1. Cek app_metadata.role (paling cepat, dari JWT, tidak perlu DB query)
 * 2. Cek tabel users.role (DB query, untuk admin yang di-set via SQL)
 * 3. Jika keduanya gagal, log error dan return false
 *
 * NOTE: checkIsAdmin() tetap client-side karena digunakan oleh
 * AdminLayout.tsx untuk UI gating. Perlindungan sesungguhnya
 * ada di API routes (server-side verifyAdmin).
 */
export async function checkIsAdmin(): Promise<{
  isAdmin: boolean
  userId: string | null
}> {
  const supabase = createClient()

  // Step 1: Get auth user
  let user: import('@supabase/supabase-js').User | null = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error('[NikahReady] checkIsAdmin: auth.getUser() failed:', err)
    return { isAdmin: false, userId: null }
  }

  if (!user) return { isAdmin: false, userId: null }

  // Step 2: Cek app_metadata.role (fast path — no DB query needed)
  if (user.app_metadata?.role === 'admin') {
    console.log('[NikahReady] checkIsAdmin: admin via app_metadata ✅', user.email)
    return { isAdmin: true, userId: user.id }
  }

  // Step 3: Cek tabel public.users.role (fallback)
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.warn('[NikahReady] checkIsAdmin: DB query failed:', error.message)
      console.warn('[NikahReady] Tip: Pastikan migration "ALTER TABLE users ADD COLUMN role" sudah dijalankan di Supabase SQL Editor.')
    } else if (data?.role === 'admin') {
      console.log('[NikahReady] checkIsAdmin: admin via users.role ✅', user.email)
      return { isAdmin: true, userId: user.id }
    }
  } catch (err) {
    console.error('[NikahReady] checkIsAdmin: unexpected error:', err)
  }

  // Step 4: Bukan admin
  console.log('[NikahReady] checkIsAdmin: NOT admin ❌', user.email)
  return { isAdmin: false, userId: user.id }
}

// ── API Helper ───────────────────────────────────────────────

/**
 * Wrapper untuk memanggil admin API routes.
 * Secara otomatis menyertakan session cookie untuk autentikasi.
 *
 * FIX (Fase 1): Error handling lebih detail.
 * - 401 → session expired / not authenticated
 * - 403 → bukan admin
 * - 500 → server error
 */
async function adminApi(path: string, options?: RequestInit): Promise<Response> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.error('[NikahReady] adminApi: No active session — user not logged in or session expired')
    throw new AdminApiError('Sesi telah kadaluarsa. Silakan logout dan login ulang.', 401)
  }

  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  })

  // Log error responses for debugging
  if (!res.ok) {
    let errorBody = ''
    try {
      const json = await res.json()
      errorBody = json.error || JSON.stringify(json)
    } catch {
      errorBody = `HTTP ${res.status}`
    }

    console.error(`[NikahReady] adminApi ${path} failed:`, res.status, errorBody)

    // Map common errors to friendly messages
    if (res.status === 401) {
      throw new AdminApiError('Sesi telah kadaluarsa. Silakan logout dan login ulang.', 401)
    }
    if (res.status === 403) {
      throw new AdminApiError('Akses ditolak. Akun Anda tidak memiliki role admin.', 403)
    }

    throw new AdminApiError(errorBody, res.status)
  }

  return res
}

// ── Dashboard Stats ──────────────────────────────────────────

/**
 * FIX (Fase 1): Stats sekarang THROW error alih-alih silently return 0.
 * UI akan menampilkan ErrorCard dengan pesan yang jelas.
 *
 * FIX (Fase 2): Stats diambil dari server-side API route.
 * Server-side memverifikasi admin + mengeksekusi query paralel.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await adminApi('/api/admin/stats')
  return await res.json()
}

// ── Fetch All Users ──────────────────────────────────────────

/**
 * FIX (Fase 1): Throw error alih-alih silently return empty array.
 *
 * FIX (Fase 2): User list dari server-side API route.
 * Search sanitization dilakukan server-side (regex whitelist).
 */
export async function getAdminUsers(options?: {
  search?: string
  plan?: 'free' | 'premium'
  role?: 'user' | 'admin'
  page?: number
  perPage?: number
}): Promise<{ users: AdminUser[]; total: number }> {
  const params = new URLSearchParams()
  if (options?.search) params.set('search', options.search)
  if (options?.plan) params.set('plan', options.plan)
  if (options?.role) params.set('role', options.role)
  if (options?.page) params.set('page', String(options.page))
  if (options?.perPage) params.set('perPage', String(options.perPage))

  const res = await adminApi(`/api/admin/users?${params.toString()}`)
  return await res.json()
}

// ── Update User Plan ─────────────────────────────────────────

/**
 * FIX (Fase 2): Update plan via server-side API route.
 * Server memverifikasi admin, mencegah invalid values,
 * dan membuat audit log dari server-side.
 */
export async function updateUserPlan(
  userId: string,
  newPlan: 'free' | 'premium',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await adminApi(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'update_plan', value: newPlan, notes }),
    })

    return await res.json()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mengubah plan'
    return { success: false, error: message }
  }
}

// ── Update User Role ─────────────────────────────────────────

/**
 * FIX (Fase 2): Update role via server-side API route.
 * Server mencegah self-demotion (admin hapus role sendiri).
 */
export async function updateUserRole(
  userId: string,
  newRole: 'user' | 'admin',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await adminApi(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'update_role', value: newRole, notes }),
    })

    return await res.json()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mengubah role'
    return { success: false, error: message }
  }
}

// ── Fetch Subscriptions ──────────────────────────────────────

/**
 * FIX (Fase 2): Subscriptions list dari server-side API route.
 */
export async function getSubscriptions(options?: {
  page?: number
  perPage?: number
  status?: string
}): Promise<{ subscriptions: SubscriptionRecord[]; total: number }> {
  const params = new URLSearchParams()
  if (options?.status) params.set('status', options.status)
  if (options?.page) params.set('page', String(options.page))
  if (options?.perPage) params.set('perPage', String(options.perPage))

  const res = await adminApi(`/api/admin/subscriptions?${params.toString()}`)
  return await res.json()
}

// ── Delete User (Danger Zone) ────────────────────────────────

/**
 * FIX (Fase 2): Delete user via server-side API route.
 * Server mencegah self-deletion dan membuat audit log.
 */
export async function deleteUser(
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await adminApi(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    })

    return await res.json()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus user'
    return { success: false, error: message }
  }
}