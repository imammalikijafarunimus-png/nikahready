// ============================================================
// src/middleware.ts
//
// Middleware untuk:
// 1. Refresh Supabase auth token (auto-refresh session)
// 2. Protect authenticated routes (/create, /preview, /dashboard)
// 3. Protect admin routes (/admin/*) — requires admin role
// 4. Redirect unauthenticated users to /login
//
// Pattern: Supabase SSR middleware with cookie-based session
// ============================================================

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/create', '/preview', '/dashboard']

// Routes that require admin role (authentication + admin check)
const ADMIN_ROUTES = ['/admin']

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
  // Fix: Wrap in try-catch agar middleware tidak crash saat
  // Supabase tidak tersedia atau cookie rusak.
  // Fail-open untuk public routes, fail-closed untuk protected routes.
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error('[NikahReady] Middleware auth error:', err)
    // Jika gagal membaca session, anggap user belum login
    // Protected routes akan tetap redirect ke login (fail-closed)
  }

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

  // ── Protect admin routes (server-side) ───────────────────
  // FIX: Admin protection di middleware SEBAGAI defense-in-depth.
  // Client-side check di AdminLayout tetap ada sebagai UX layer,
  // tapi middleware memastikan route tidak bisa di-bypass tanpa JS.
  //
  // FIX: 2-layer check:
  // 1. Cek app_metadata.role (dari JWT, tanpa DB query)
  // 2. Cek tabel users.role (fallback, untuk admin via SQL)
  // Ini memastikan admin tetap bisa akses meskipun ada masalah RLS.
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // Layer 1: Cek app_metadata.role (fast, reliable, no DB query)
    let isAdmin = user.app_metadata?.role === 'admin'

    // Layer 2: Fallback cek tabel users.role
    if (!isAdmin) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userError) {
          console.warn('[NikahReady] Middleware: admin DB check failed:', userError.message)
          console.warn('[NikahReady] Middleware: tip: run migration to add role column to users table')
        } else if (userData?.role === 'admin') {
          isAdmin = true
        }
      } catch (err) {
        console.error('[NikahReady] Middleware: admin check error:', err)
      }
    }

    // Fail-closed: redirect ke dashboard jika bukan admin
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
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
    '/((?!_next/static|_next/image|favicon\\.ico|auth/callback|icons/|images/|manifest\\.json|sw\\.js|workbox-*).*)',
  ],
}