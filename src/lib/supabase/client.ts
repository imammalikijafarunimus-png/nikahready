// ============================================================
// src/lib/supabase/client.ts
// Supabase browser client — untuk dipakai di Client Components
//
// PENTING: Cookie storage harus explicit menggunakan getAll()/setAll()
// sesuai API @supabase/ssr v0.5.x. Tanpa ini, session bisa tersimpan
// di memory saja (bukan document.cookie), sehingga middleware
// di server-side tidak bisa membaca session cookie.
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie
            .split(';')
            .map((cookie) => {
              const [name, ...rest] = cookie.trim().split('=')
              return { name, value: rest.join('=') }
            })
            .filter(({ name }) => name.startsWith('sb-'))
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              document.cookie = [
                `${name}=${value}`,
                options?.maxAge ? `max-age=${options.maxAge}` : '',
                options?.domain ? `domain=${options.domain}` : '',
                options?.path ? `path=${options.path}` : '',
                options?.sameSite ? `samesite=${options.sameSite}` : '',
                options?.secure ? 'secure' : '',
              ]
                .filter(Boolean)
                .join('; ')
            )
          } catch {
            // Ignore cookie errors in environments where document.cookie is restricted
          }
        },
      },
    }
  )
}