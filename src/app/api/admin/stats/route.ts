// ============================================================
// src/app/api/admin/stats/route.ts
//
// GET /api/admin/stats — Dashboard statistics.
// Returns user counts, subscription counts, and growth metrics.
// All queries run in parallel via Promise.all().
// ============================================================

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, AdminError } from '../verify'

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await verifyAdmin(request)

    const [
      { count: totalUsers },
      { count: freeUsers },
      { count: premiumUsers },
      { count: newUsersThisWeek },
      { count: newUsersThisMonth },
      { count: totalSubscriptions },
      { count: activeSubscriptions },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('plan', 'free'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('plan', 'premium'),
      supabase.from('users').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('users').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ])

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      freeUsers: freeUsers ?? 0,
      premiumUsers: premiumUsers ?? 0,
      newUsersThisWeek: newUsersThisWeek ?? 0,
      newUsersThisMonth: newUsersThisMonth ?? 0,
      totalSubscriptions: totalSubscriptions ?? 0,
      activeSubscriptions: activeSubscriptions ?? 0,
    })
  } catch (err) {
    if (err instanceof AdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[NikahReady] /api/admin/stats error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}