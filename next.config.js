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
