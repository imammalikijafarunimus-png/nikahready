// ============================================================
// src/app/api/admin/users/[id]/route.ts
//
// PATCH /api/admin/users/[id] — Update user plan or role.
// DELETE /api/admin/users/[id] — Delete user (danger zone).
//
// All operations create audit logs server-side.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, AdminError } from '../../verify'

// ── PATCH: Update Plan or Role ──────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, adminId, adminEmail } = await verifyAdmin(request)
    const { id: userId } = await params
    const body = await request.json()

    const { action, value, notes } = body as {
      action: 'update_plan' | 'update_role'
      value: string
      notes?: string
    }

    if (!action || !value) {
      return NextResponse.json({ error: 'Missing action or value' }, { status: 400 })
    }

    // Prevent self-demotion (admin can't remove their own admin role)
    if (userId === adminId && action === 'update_role' && value === 'user') {
      return NextResponse.json(
        { error: 'Cannot remove your own admin role' },
        { status: 403 }
      )
    }

    if (action === 'update_plan') {
      if (value !== 'free' && value !== 'premium') {
        return NextResponse.json({ error: 'Invalid plan value' }, { status: 400 })
      }
      return await handleUpdatePlan(supabase, adminId, userId, value, notes)
    }

    if (action === 'update_role') {
      if (value !== 'user' && value !== 'admin') {
        return NextResponse.json({ error: 'Invalid role value' }, { status: 400 })
      }
      return await handleUpdateRole(supabase, adminId, userId, value, notes)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    if (err instanceof AdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[NikahReady] PATCH /api/admin/users/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE: Delete User ─────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { supabase, adminId } = await verifyAdmin(request)
    const { id: userId } = await params

    // Prevent self-deletion
    if (userId === adminId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      )
    }

    // Get target user email for audit log
    const { data: targetUser } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    // Create audit log BEFORE deletion
    await supabase.from('audit_logs').insert({
      admin_id: adminId,
      action: 'delete_user',
      target_user_id: userId,
      target_email: targetUser?.email ?? null,
      details: {},
    })

    // Delete from public.users (CASCADE deletes profiles + relations)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Note: auth.users deletion requires Supabase Admin API or Dashboard.
    // The trigger on_auth_user_created will re-create a public.users row
    // if the auth.users row still exists, but all profile data is gone.

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof AdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[NikahReady] DELETE /api/admin/users/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── Helpers ──────────────────────────────────────────────────

async function handleUpdatePlan(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createServerSupabaseClient>>,
  adminId: string,
  userId: string,
  newPlan: string,
  notes?: string
) {
  // Get old user data
  const { data: oldUser, error: fetchError } = await supabase
    .from('users')
    .select('plan, email')
    .eq('id', userId)
    .single()

  if (fetchError || !oldUser) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  const oldPlan = oldUser.plan

  // Update plan
  const { error: updateError } = await supabase
    .from('users')
    .update({ plan: newPlan })
    .eq('id', userId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  // Expire old active subscriptions if downgrading
  if (newPlan === 'free') {
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('status', 'active')
  }

  // Create subscription record
  await supabase.from('subscriptions').insert({
    user_id: userId,
    plan: newPlan,
    status: newPlan === 'premium' ? 'active' : 'expired',
    notes: notes || null,
    created_by: adminId,
    payment_provider: 'manual',
    end_date: newPlan === 'premium' ? null : new Date().toISOString(),
  })

  // Audit log
  await supabase.from('audit_logs').insert({
    admin_id: adminId,
    action: newPlan === 'premium' ? 'upgrade_plan' : 'downgrade_plan',
    target_user_id: userId,
    target_email: oldUser.email,
    details: { old_plan: oldPlan, new_plan: newPlan, notes },
  })

  return NextResponse.json({ success: true })
}

async function handleUpdateRole(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createServerSupabaseClient>>,
  adminId: string,
  userId: string,
  newRole: string,
  notes?: string
) {
  // Get old user data
  const { data: oldUser, error: fetchError } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', userId)
    .single()

  if (fetchError || !oldUser) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  // Update role
  const { error: updateError } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    admin_id: adminId,
    action: newRole === 'admin' ? 'promote_admin' : 'demote_admin',
    target_user_id: userId,
    target_email: oldUser.email,
    details: { old_role: oldUser.role, new_role: newRole, notes },
  })

  return NextResponse.json({ success: true })
}