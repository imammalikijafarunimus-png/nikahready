// ============================================================
// src/lib/supabase/client.ts
// Supabase browser client — untuk dipakai di Client Components
// ============================================================

import { createBrowserClient } from '@supabase/ssr'

/**
 * Membuat Supabase browser client.
 * Panggil fungsi ini di dalam komponen/hook, bukan di module level,
 * agar tidak ada singleton yang menyebabkan masalah di SSR.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
