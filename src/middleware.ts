// ============================================================
// src/middleware.ts
//
// Middleware untuk:
// 1. Refresh Supabase auth token (auto-refresh session)
// 2. Protect authenticated routes (/create, /preview, /dashboard)
// 3. Redirect unauthenticated users to /login
//
// Pattern: Supabase SSR middleware with cookie-based session
// ============================================================

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/create', '/preview', '/dashboard']

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request cookies so server components can read them
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Update response cookies so browser gets them
          supabaseResponse.cookies.set({
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
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session — important for keeping session alive
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Protect authenticated routes ──────────────────────────
  // If user is not authenticated, redirect to login
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Store original destination for redirect after login
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // ── Redirect authenticated users away from auth pages ─────
  // If user is already authenticated and visits login/signup, redirect to dashboard
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (icons, images, manifest, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|icons/|images/|manifest\\.json|sw\\.js|workbox-*).*)',
  ],
}
