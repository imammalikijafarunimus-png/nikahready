// ============================================================
// src/instrumentation-client.ts
// Sentry client-side initialization (Browser)
// Called by Next.js instrumentation hook automatically.
// ============================================================

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV !== 'development',
  enableLogs: true,
  sendDefaultPii: true,

  ignoreErrors: [
    // Browser extensions
    'Non-Error promise rejection captured',
    'NetworkError',
    'Failed to fetch',
    // ResizeObserver (browser bug, bukan app error)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],

  beforeSend(event) {
    // Attach user info dari Supabase session
    if (typeof window !== 'undefined') {
      try {
        const userInfo = localStorage.getItem('nikahready_debug_user')
        if (userInfo) {
          const user = JSON.parse(userInfo)
          event.user = {
            id: user.userId,
            email: user.userEmail,
          }
        }
      } catch {
        // Silently ignore
      }
    }
    return event
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart