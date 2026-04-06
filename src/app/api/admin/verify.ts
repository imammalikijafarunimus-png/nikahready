// ============================================================
// src/app/api/admin/verify.ts
//
// Shared helper untuk admin API routes.
// Memverifikasi bahwa request berasal dari user yang login
// dan memiliki role admin. Digunakan oleh semua API routes
// di bawah /api/admin/.
// ============================================================

import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface AdminContext {
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>
  adminId: string
  adminEmail: string
}

/**
 * Verifikasi admin untuk API routes.
 * Returns { supabase, adminId, adminEmail } jika valid.
 * Throws NextResponse error jika tidak valid.
 */
export async function verifyAdmin(request: NextRequest): Promise<AdminContext> {
  const supabase = await createServerSupabaseClient()

  // 1. Cek apakah user sudah login
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new AdminError('Unauthorized', 401)
  }

  // 2. Cek apakah user adalah admin (app_metadata first, then DB)
  let isAdmin = user.app_metadata?.role === 'admin'

  if (!isAdmin) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role === 'admin') {
      isAdmin = true
    }
  }

  if (!isAdmin) {
    throw new AdminError('Forbidden: Admin access required', 403)
  }

  return {
    supabase,
    adminId: user.id,
    adminEmail: user.email ?? 'unknown',
  }
}

/**
 * Custom error class untuk admin API — distinguishable
 * from regular errors so routes can catch and return proper responses.
 */
export class AdminError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'AdminError'
  }
}