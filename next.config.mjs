// ============================================================
// next.config.mjs (MODIFIED — Fase 5.1 + Theme)
//
// Perubahan dari original:
// 1. Tambahkan withSentryConfig wrapper
// 2. Sensible defaults untuk Sentry
// ============================================================

const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gfonts-webfonts-cache',
          expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: ({ url }) => url.origin === process.env.NEXT_PUBLIC_SUPABASE_URL,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api-cache',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static-cache',
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: /\/_next\/image\?.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-image-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'html2canvas', 'jspdf']
    }
    return config
  },
}

// ── Fase 5.1: Sentry wrapper ──────────────────────────────
module.exports = withSentryConfig(
  withPWA(nextConfig),
  {
    silent: true, // Suppress Sentry CLI output during build
    hideSourceMaps: true, // Don't upload source maps in production
    disableLogger: true,  // Disable Sentry logger to reduce noise
    tunnelRoute: '/api/sentry-tunnel', // Use tunnel to avoid ad-blockers
  }
)
