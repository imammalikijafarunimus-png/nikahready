// ============================================================
// src/app/api/admin/subscriptions/route.ts
//
// GET /api/admin/subscriptions — List subscription records.
// Query params: status, page, perPage
//
// FIX: Specify FK name in join untuk menghindari
// "more than one relationship" error. Tabel subscriptions
// punya 2 FK ke users: user_id dan created_by.
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

    // FIX: Gunakan query terpisah untuk menghindari ambiguous FK join.
    // subscriptions punya 2 FK ke users: user_id dan created_by.
    // Daripada pakai join yang ambigu, kita ambil subscriptions dulu,
    // lalu ambil email user secara terpisah.

    let query = supabase
      .from('subscriptions')
      .select(
        'id, user_id, plan, start_date, end_date, payment_provider, transaction_id, status, notes, created_at, created_by',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Ambil email user secara terpisah untuk menghindari ambiguous FK
    let userEmails: Record<string, string> = {}
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((row: { user_id: string }) => row.user_id))]
      const { data: usersData } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds)

      if (usersData) {
        userEmails = Object.fromEntries(
          usersData.map((u: { id: string; email: string }) => [u.id, u.email])
        )
      }
    }

    const subscriptions = (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id,
      user_id: row.user_id,
      user_email: userEmails[(row.user_id as string)] ?? 'Unknown',
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