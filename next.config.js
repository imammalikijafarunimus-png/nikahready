// ============================================================
// next.config.js
//
// PENTING: Gunakan @ducanh2912/next-pwa (bukan next-pwa lama)
// karena fork ini mendukung Next.js 13+ App Router.
//
// Install: npm install @ducanh2912/next-pwa
// ============================================================

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',

  // KRITIS: Matikan di development agar tidak konflik dengan HMR
  disable: process.env.NODE_ENV === 'development',

  // Register service worker secara otomatis
  register: true,

  // Mulai service worker segera (sebelum page load selesai)
  // Berguna untuk cache-first strategy
  skipWaiting: true,

  // Cache semua aset statis
  cacheOnFrontEndNav: true,

  // Fallback page saat offline
  fallbacks: {
    document: '/offline',
  },

  // Runtime caching strategy
  workboxOptions: {
    // Maksimal 200 halaman di-cache untuk navigasi offline
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB per file

    runtimeCaching: [
      // ── Google Fonts (stylesheet) ──────────────────────────
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Google Fonts (files) ───────────────────────────────
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gfonts-webfonts-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Supabase API calls — Network First ─────────────────
      // Coba network, fallback ke cache jika offline
      {
        urlPattern: ({ url }) =>
          url.origin === process.env.NEXT_PUBLIC_SUPABASE_URL,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60, // 1 jam
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // ── Next.js static assets ──────────────────────────────
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
          },
        },
      },
      // ── Next.js image optimization ─────────────────────────
      {
        urlPattern: /\/_next\/image\?.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-image-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 hari
          },
        },
      },
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Image domains ────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Ganti dengan project ID Supabase kamu
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // ── Experimental features ────────────────────────────────────
  experimental: {
    // Optimasi package imports untuk ukuran bundle lebih kecil
    optimizePackageImports: ['@supabase/supabase-js'],
  },

  // ── Webpack: handle html2canvas & jsPDF ─────────────────────
  // Kedua library ini butuh kondisi browser
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Jangan bundle html2canvas dan jsPDF di server
      config.externals = [
        ...(config.externals || []),
        'html2canvas',
        'jspdf',
      ]
    }
    return config
  },
}

module.exports = withPWA(nextConfig)


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "imam-maliki-jafar-unimus",
  project: "nikahready",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
