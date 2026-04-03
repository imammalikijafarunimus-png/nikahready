// ============================================================
// src/lib/admin/adminHelpers.ts
//
// Helper functions untuk operasi admin:
// - Fetch users, dashboard stats, subscriptions
// - Upgrade/downgrade plan
// - Audit logging
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

// ── Admin Auth Check ─────────────────────────────────────────

/**
 * Cek apakah user yang sedang login adalah admin.
 * Returns { isAdmin, userId }
 */
export async function checkIsAdmin(): Promise<{
  isAdmin: boolean
  userId: string | null
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isAdmin: false, userId: null }

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return { isAdmin: data?.role === 'admin', userId: user.id }
}

// ── Dashboard Stats ──────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient()

  // Total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Free users
  const { count: freeUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'free')

  // Premium users
  const { count: premiumUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'premium')

  // New this week
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const { count: newUsersThisWeek } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneWeekAgo.toISOString())

  // New this month
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const { count: newUsersThisMonth } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneMonthAgo.toISOString())

  // Subscriptions
  const { count: totalSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })

  const { count: activeSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return {
    totalUsers: totalUsers ?? 0,
    freeUsers: freeUsers ?? 0,
    premiumUsers: premiumUsers ?? 0,
    newUsersThisWeek: newUsersThisWeek ?? 0,
    newUsersThisMonth: newUsersThisMonth ?? 0,
    totalSubscriptions: totalSubscriptions ?? 0,
    activeSubscriptions: activeSubscriptions ?? 0,
  }
}

// ── Fetch All Users ──────────────────────────────────────────

export async function getAdminUsers(options?: {
  search?: string
  plan?: 'free' | 'premium'
  role?: 'user' | 'admin'
  page?: number
  perPage?: number
}): Promise<{ users: AdminUser[]; total: number }> {
  const supabase = createClient()
  const search = options?.search ?? ''
  const plan = options?.plan
  const role = options?.role
  const page = options?.page ?? 1
  const perPage = options?.perPage ?? 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('users')
    .select('id, email, phone, plan, role, created_at, updated_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(`email.ilike.%${search}%`)
  }
  if (plan) {
    query = query.eq('plan', plan)
  }
  if (role) {
    query = query.eq('role', role)
  }

  const { data, count } = await query

  return {
    users: (data as AdminUser[]) ?? [],
    total: count ?? 0,
  }
}

// ── Update User Plan ─────────────────────────────────────────

export async function updateUserPlan(
  userId: string,
  newPlan: 'free' | 'premium',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // 1. Ambil data user sebelumnya untuk audit
  const { data: oldUser } = await supabase
    .from('users')
    .select('plan, email')
    .eq('id', userId)
    .single()

  if (!oldUser) return { success: false, error: 'User tidak ditemukan' }

  const oldPlan = oldUser.plan

  // 2. Update plan user
  const { error: updateError } = await supabase
    .from('users')
    .update({ plan: newPlan })
    .eq('id', userId)

  if (updateError) return { success: false, error: updateError.message }

  // 3. Expired subscription lama yang aktif (kalau ada)
  if (newPlan === 'free') {
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('status', 'active')
  }

  // 4. Buat record subscription baru
  const { data: { user: admin } } = await supabase.auth.getUser()

  const subscriptionPayload = {
    user_id: userId,
    plan: newPlan,
    status: newPlan === 'premium' ? 'active' : 'expired',
    notes: notes || null,
    created_by: admin?.id || null,
    payment_provider: 'manual',
  }

  if (newPlan === 'premium') {
    // Premium manual = no end_date (unlimited sampai admin downgrade)
    Object.assign(subscriptionPayload, { end_date: null })
  }

  await supabase
    .from('subscriptions')
    .insert(subscriptionPayload)

  // 5. Audit log
  await createAuditLog(
    newPlan === 'premium' ? 'upgrade_plan' : 'downgrade_plan',
    userId,
    oldUser.email,
    { old_plan: oldPlan, new_plan: newPlan, notes }
  )

  return { success: true }
}

// ── Update User Role ─────────────────────────────────────────

export async function updateUserRole(
  userId: string,
  newRole: 'user' | 'admin',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // 1. Ambil data lama
  const { data: oldUser } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', userId)
    .single()

  if (!oldUser) return { success: false, error: 'User tidak ditemukan' }

  // 2. Update role
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) return { success: false, error: error.message }

  // 3. Audit log
  await createAuditLog(
    newRole === 'admin' ? 'promote_admin' : 'demote_admin',
    userId,
    oldUser.email,
    { old_role: oldUser.role, new_role: newRole, notes }
  )

  return { success: true }
}

// ── Fetch Subscriptions ──────────────────────────────────────

export async function getSubscriptions(options?: {
  page?: number
  perPage?: number
  status?: string
}): Promise<{ subscriptions: SubscriptionRecord[]; total: number }> {
  const supabase = createClient()
  const page = options?.page ?? 1
  const perPage = options?.perPage ?? 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('subscriptions')
    .select(`
      id, user_id, plan, start_date, end_date,
      payment_provider, transaction_id, status,
      notes, created_at, created_by,
      users!inner(email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  const { data, count } = await query

  const subscriptions: SubscriptionRecord[] = (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    user_email: (row.users as Record<string, string>).email,
    plan: row.plan as 'free' | 'premium',
    start_date: row.start_date as string,
    end_date: row.end_date as string | null,
    payment_provider: row.payment_provider as string | null,
    transaction_id: row.transaction_id as string | null,
    status: row.status as 'active' | 'expired' | 'cancelled' | 'trial',
    notes: row.notes as string | null,
    created_at: row.created_at as string,
    created_by: row.created_by as string | null,
  }))

  return { subscriptions, total: count ?? 0 }
}

// ── Audit Logs ───────────────────────────────────────────────

async function createAuditLog(
  action: string,
  targetUserId?: string | null,
  targetEmail?: string | null,
  details?: Record<string, unknown>
): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    action,
    target_user_id: targetUserId || null,
    target_email: targetEmail || null,
    details: details || {},
  })
}

export async function getAuditLogs(options?: {
  page?: number
  perPage?: number
}): Promise<{ logs: AuditLog[]; total: number }> {
  const supabase = createClient()
  const page = options?.page ?? 1
  const perPage = options?.perPage ?? 50
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count } = await supabase
    .from('audit_logs')
    .select(`
      id, admin_id, action, target_user_id, target_email,
      details, created_at,
      admin:users!admin_id(email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const logs: AuditLog[] = (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    admin_id: row.admin_id as string,
    admin_email: (row.admin as Record<string, string>)?.email || 'Unknown',
    action: row.action as string,
    target_user_id: row.target_user_id as string | null,
    target_email: row.target_email as string | null,
    details: (row.details as Record<string, unknown>) || {},
    created_at: row.created_at as string,
  }))

  return { logs, total: count ?? 0 }
}

// ── Delete User (Danger Zone) ────────────────────────────────

export async function deleteUser(
  userId: string,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // 1. Audit log dulu (sebelum user dihapus)
  await createAuditLog(
    'delete_user',
    userId,
    userEmail,
    {}
  )

  // 2. Hapus dari public.users (CASCADE akan hapus relasi)
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) return { success: false, error: error.message }

  // Note: auth.users TIDAK bisa dihapus via client.
  // Perlu Supabase Admin API atau Supabase Dashboard.
  // User yang dihapus dari public.users tidak bisa login lagi
  // karena trigger on_auth_user_created akan insert ulang,
  // tapi data profilnya sudah hilang.

  return { success: true }
}