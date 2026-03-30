// ============================================================
// src/lib/supabase/server.ts
// Supabase server client — untuk Server Components, Route Handlers, dan Middleware.
//
// Menggunakan cookies untuk menyimpan session token.
// Cookie name default Supabase: sb-<project-ref>-auth-token
// ============================================================

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Cookie already set by middleware — ignore in Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Cookie already set by middleware — ignore in Server Component
          }
        },
      },
    }
  )
}

/**
 * Get the current authenticated user's ID from server side.
 * Returns null if not authenticated.
 */
export async function getServerUserId(): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}
