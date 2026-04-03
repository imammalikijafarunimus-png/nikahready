// ============================================================
// src/app/admin/page.tsx
// Redirect dari /admin ke /admin/dashboard
// ============================================================

import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/dashboard')
}