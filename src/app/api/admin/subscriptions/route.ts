// ============================================================
// src/app/api/admin/subscriptions/route.ts
//
// GET /api/admin/subscriptions — List subscription records.
// Query params: status, page, perPage
// ============================================================

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, AdminError } from '../verify'

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await verifyAdmin(request)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

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

    if (status) {
      query = query.eq('status', status)
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const subscriptions = (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id,
      user_id: row.user_id,
      user_email: (row.users as Record<string, string>)?.email ?? 'Unknown',
      plan: row.plan,
      start_date: row.start_date,
      end_date: row.end_date,
      payment_provider: row.payment_provider,
      transaction_id: row.transaction_id,
      status: row.status,
      notes: row.notes,
      created_at: row.created_at,
      created_by: row.created_by,
    }))

    return NextResponse.json({
      subscriptions,
      total: count ?? 0,
    })
  } catch (err) {
    if (err instanceof AdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[NikahReady] /api/admin/subscriptions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}