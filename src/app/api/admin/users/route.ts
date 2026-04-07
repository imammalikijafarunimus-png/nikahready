// ============================================================
// src/app/api/admin/users/route.ts
//
// GET /api/admin/users — List users with search, filter, pagination.
// Query params: search, plan, role, page, perPage
// ============================================================

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, AdminError } from '../verify'

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await verifyAdmin(request)

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const plan = searchParams.get('plan') || ''
    const role = searchParams.get('role') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('users')
      .select('id, email, phone, plan, role, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // FIX: Sanitize search input (same as client-side fix)
    if (search) {
      const safeSearch = /^[a-zA-Z0-9@._-]+$/.test(search) ? search : ''
      if (safeSearch) {
        query = query.or(`email.ilike.%${safeSearch}%`)
      }
    }

    if (plan && (plan === 'free' || plan === 'premium')) {
      query = query.eq('plan', plan)
    }
    if (role && (role === 'user' || role === 'admin')) {
      query = query.eq('role', role)
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      users: data ?? [],
      total: count ?? 0,
    })
  } catch (err) {
    if (err instanceof AdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[NikahReady] /api/admin/users error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}