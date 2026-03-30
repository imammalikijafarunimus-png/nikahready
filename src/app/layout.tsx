// ============================================================
// src/app/layout.tsx  (FINAL — Phase 6)
// ============================================================

import type { Metadata, Viewport } from 'next'
import { Inter, Amiri } from 'next/font/google'
import { FormProvider } from '@/context/FormContext'
import { AuthProvider } from '@/context/AuthContext'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['latin', 'arabic'],
  variable: '--font-amiri',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://nikahready.vercel.app'
  ),
  title: {
    default: 'NikahReady — Generator CV Taaruf Islami',
    template: '%s | NikahReady',
  },
  description:
    'Buat CV Taaruf profesional dan Islami. Isi form, pilih template, download PDF — langsung dari HP.',
  keywords: ['taaruf', 'CV taaruf', 'biodata taaruf', 'pernikahan islami'],
  authors: [{ name: 'NikahReady' }],
  creator: 'NikahReady',
  applicationName: 'NikahReady',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'NikahReady',
    title: 'NikahReady — Generator CV Taaruf Islami',
    description: 'Buat CV Taaruf profesional dan Islami dalam hitungan menit.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NikahReady',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <AuthProvider>
          <FormProvider>
            {children}
            <PWAInstallPrompt />
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
