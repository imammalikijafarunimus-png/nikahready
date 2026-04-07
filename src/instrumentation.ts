// ============================================================
// src/instrumentation.ts
// Sentry server-side initialization (Node + Edge)
// Called by Next.js instrumentation hook automatically.
// ============================================================

import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment:
        process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      enabled: process.env.NODE_ENV !== 'development',
      enableLogs: true,

      integrations: [
        Sentry.httpIntegration(),
      ],

      ignoreErrors: [
        'Non-Error promise rejection captured',
      ],
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment:
        process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      enabled: process.env.NODE_ENV !== 'development',
    })
  }
}

export const onRequestError = Sentry.captureRequestError