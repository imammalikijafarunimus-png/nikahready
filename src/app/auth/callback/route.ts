// ============================================================
// src/app/auth/callback/route.ts
//
// Auth callback handler untuk Supabase.
// Dipanggil setelah:
// 1. Email confirmation link (signup)
// 2. Password reset link
// 3. OAuth redirect (if implemented later)
//
// Flow:
// - Supabase mengirim token di URL hash
// - Route ini menukar code → session
// - Redirect ke halaman yang sesuai
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'signup', 'recovery', 'email'

  // Redirect destination after successful auth
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      // Create a response and set up Supabase to exchange code for session
      // We use the route handler pattern with cookie handling
      const response = NextResponse.redirect(`${origin}${next}`)

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              // Set cookie on the response
              request.cookies.set({
                name,
                value,
                ...options,
              })
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value: '',
                ...options,
              })
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      // Exchange auth code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('[NikahReady] Auth callback error:', error.message)
        // Redirect to login with error message
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent('Gagal memverifikasi. Coba lagi.')}`
        )
      }

      // Determine redirect based on type
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent('Password berhasil direset. Silakan masuk.')}`)
      }

      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent('Akun berhasil dibuat! Silakan masuk.')}`)
      }

      // Default: redirect to next (dashboard or wherever)
      return response
    } catch (err) {
      console.error('[NikahReady] Auth callback unexpected error:', err)
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Terjadi kesalahan. Coba lagi.')}`
      )
    }
  }

  // No code provided — redirect to login
  return NextResponse.redirect(`${origin}/login`)
}