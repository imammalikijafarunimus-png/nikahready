'use client'

// ============================================================
// src/context/AuthContext.tsx
//
// Auth Context untuk NikahReady
// Mengelola state autentikasi Supabase: login, signup, logout,
// session tracking, dan auto-load profile.
//
// Arsitektur:
// - Split context (AuthState + AuthActions) untuk optimasi re-render
// - Supabase listener onAuthStateChange untuk real-time session update
// - Auto-ensure user row di tabel public.users setelah signup/login
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthState {
  user: User | null
  session: Session | null
  status: AuthStatus
  userId: string | null
  userEmail: string | null
  plan: 'free' | 'premium'
}

export interface AuthActions {
  signUp: (email: string, password: string, nama: string) => Promise<{
    success: boolean
    error?: string
  }>
  signIn: (email: string, password: string) => Promise<{
    success: boolean
    error?: string
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    success: boolean
    error?: string
  }>
  refreshSession: () => Promise<void>
}

// ── Context Declarations ─────────────────────────────────────
const AuthStateContext = createContext<AuthState | null>(null)
const AuthActionsContext = createContext<AuthActions | null>(null)

// ── Default state ────────────────────────────────────────────
const DEFAULT_STATE: AuthState = {
  user: null,
  session: null,
  status: 'loading',
  userId: null,
  userEmail: null,
  plan: 'free',
}

// ── Provider ─────────────────────────────────────────────────
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(DEFAULT_STATE)

  // ── Ensure user row exists in public.users ────────────────
  // Supabase Auth creates auth.users row, but we also need
  // a matching row in public.users for RLS to work properly.
  const ensureUserRow = useCallback(async (userId: string, email: string) => {
    try {
      const supabase = createClient()
      // FIX: Cek dulu apakah row sudah ada.
      // Sebelumnya upsert selalu set plan='free' yang menyebabkan
      // plan premium di-reset setiap kali user login.
      // Sekarang hanya INSERT jika row belum ada (tidak override data).
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('id', userId)

      if (!count) {
        const { error } = await supabase
          .from('users')
          .insert({ id: userId, email, plan: 'free' })
        if (error) {
          console.warn('[NikahReady] ensureUserRow insert failed:', error.message)
        }
      }
    } catch (err) {
      console.warn('[NikahReady] ensureUserRow error:', err)
    }
  }, [])

  // ── Fetch user plan from public.users ─────────────────────
  const fetchUserPlan = useCallback(async (userId: string): Promise<'free' | 'premium'> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('plan')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('[NikahReady] fetchUserPlan failed:', error.message)
        return 'free'
      }
      return (data?.plan as 'free' | 'premium') ?? 'free'
    } catch {
      return 'free'
    }
  }, [])

  // ── Initialize: listen to auth state changes ──────────────
  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    // FIX: Set status='authenticated' SEGERA setelah session valid,
    // jangan tunggu ensureUserRow & fetchUserPlan (2 DB query berurutan).
    // Jalankan keduanya di background agar UI tidak stuck di loading.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Set authenticated FIRST — user sudah login, jangan block UI
        setState({
          user: session.user,
          session,
          status: 'authenticated',
          userId: session.user.id,
          userEmail: session.user.email ?? null,
          plan: 'free' as const, // default dulu, nanti di-update
        })

        // Background tasks — tidak blocking UI
        ensureUserRow(session.user.id, session.user.email ?? '')
        fetchUserPlan(session.user.id).then((plan) => {
          setState((prev) => ({ ...prev, plan }))
        })
      } else {
        setState((prev) => ({ ...prev, status: 'unauthenticated' }))
      }
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'INITIAL_SESSION') return // already handled above

        if (session?.user) {
          // Set authenticated FIRST
          setState({
            user: session.user,
            session,
            status: 'authenticated',
            userId: session.user.id,
            userEmail: session.user.email ?? null,
            plan: 'free' as const,
          })

          // Background tasks
          ensureUserRow(session.user.id, session.user.email ?? '')
          fetchUserPlan(session.user.id).then((plan) => {
            setState((prev) => ({ ...prev, plan }))
          })
        } else {
          setState(DEFAULT_STATE)
          setState((prev) => ({ ...prev, status: 'unauthenticated' }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [ensureUserRow, fetchUserPlan])

  // ── Actions ───────────────────────────────────────────────
  const actions: AuthActions = useMemo(() => ({
    signUp: async (email: string, password: string, nama: string) => {
      try {
        const supabase = createClient()

        // Supabase signup — user_metadata.nama for display name
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nama },
          },
        })

        if (error) {
          return { success: false, error: error.message }
        }

        // If email confirmation is required, user won't have session yet
        if (data.user && !data.session) {
          return {
            success: true,
          }
        }

        // If no email confirmation required, user is immediately logged in
        if (data.session?.user) {
          setState({
            user: data.session.user,
            session: data.session,
            status: 'authenticated',
            userId: data.session.user.id,
            userEmail: data.session.user.email ?? null,
            plan: 'free' as const,
          })
          ensureUserRow(data.session.user.id, data.session.user.email ?? '')
          fetchUserPlan(data.session.user.id).then((plan) => {
            setState((prev) => ({ ...prev, plan }))
          })
        }

        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal mendaftar'
        return { success: false, error: message }
      }
    },

    signIn: async (email: string, password: string) => {
      try {
        const supabase = createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          // Map common errors to friendly Indonesian messages
          let friendlyError = error.message
          if (error.message.includes('Invalid login credentials')) {
            friendlyError = 'Email atau password salah. Periksa kembali.'
          } else if (error.message.includes('Email not confirmed')) {
            friendlyError = 'Email belum dikonfirmasi. Cek inbox atau folder spam.'
          } else if (error.message.includes('Too many requests')) {
            friendlyError = 'Terlalu banyak percobaan. Tunggu beberapa saat.'
          }
          return { success: false, error: friendlyError }
        }

        if (data.session?.user) {
          // Set authenticated FIRST — jangan block UI
          setState({
            user: data.session.user,
            session: data.session,
            status: 'authenticated',
            userId: data.session.user.id,
            userEmail: data.session.user.email ?? null,
            plan: 'free' as const,
          })
          // Background tasks
          ensureUserRow(data.session.user.id, data.session.user.email ?? '')
          fetchUserPlan(data.session.user.id).then((plan) => {
            setState((prev) => ({ ...prev, plan }))
          })
        }

        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal masuk'
        return { success: false, error: message }
      }
    },

    signOut: async () => {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
        setState(DEFAULT_STATE)
        setState((prev) => ({ ...prev, status: 'unauthenticated' }))
      } catch (err) {
        console.error('[NikahReady] signOut error:', err)
      }
    },

    resetPassword: async (email: string) => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal mengirim email reset'
        return { success: false, error: message }
      }
    },

    refreshSession: async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.refreshSession()
        if (error) throw error

        if (data.session?.user) {
          const plan = await fetchUserPlan(data.session.user.id)
          setState({
            user: data.session.user,
            session: data.session,
            status: 'authenticated',
            userId: data.session.user.id,
            userEmail: data.session.user.email ?? null,
            plan,
          })
        }
      } catch (err) {
        console.error('[NikahReady] refreshSession error:', err)
      }
    },
  }), [ensureUserRow, fetchUserPlan])

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

// ── Hooks ────────────────────────────────────────────────────

/**
 * Hook untuk membaca auth state (user, session, status).
 * Komponen yang hanya perlu mengecek status login harus menggunakan ini,
 * bukan useAuth() yang full context.
 */
export function useAuthState(): AuthState {
  const ctx = useContext(AuthStateContext)
  if (ctx === null) {
    throw new Error(
      '[NikahReady] useAuthState harus digunakan di dalam <AuthProvider>.'
    )
  }
  return ctx
}

/**
 * Hook untuk mendapatkan auth actions (signUp, signIn, signOut, dll).
 * Komponen yang hanya perlu aksi auth (tombol login, dll) menggunakan ini
 * agar tidak re-render saat user/session berubah.
 */
export function useAuthActions(): AuthActions {
  const ctx = useContext(AuthActionsContext)
  if (ctx === null) {
    throw new Error(
      '[NikahReady] useAuthActions harus digunakan di dalam <AuthProvider>.'
    )
  }
  return ctx
}

/**
 * Hook convenience yang menggabungkan state + actions.
 * Gunakan jika komponen membutuhkan keduanya sekaligus.
 */
export function useAuth(): AuthState & AuthActions {
  const state = useAuthState()
  const actions = useAuthActions()
  return { ...state, ...actions }
}

/**
 * Hook yang menunggu auth loading selesai, lalu return user info.
 * Berguna untuk halaman yang membutuhkan user wajib login.
 */
export function useRequireAuth() {
  const { user, status, userId, userEmail, plan } = useAuthState()

  return {
    user,
    status,
    userId,
    userEmail,
    plan,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
  }
}