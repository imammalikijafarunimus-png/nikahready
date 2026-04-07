'use client'

// ============================================================
// src/app/cv/[shareId]/page.tsx
//
// Halaman publik untuk melihat CV Taaruf yang sudah dipublish.
// Tidak butuh login — RLS memastikan hanya published profiles
// yang bisa diakses.
// ============================================================

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  FileText,
  Heart,
  Loader2,
  AlertTriangle,
  Printer,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { loadProfilePublic } from '@/lib/loadProfilePublic'
import type { FormState } from '@/types'
import '../../preview/preview.css'

// ── Lazy-loaded Templates (Phase 3: reduce initial JS bundle ~50%) ──
const TemplateRingkas = dynamic<{ state: FormState }>(
  () => import('@/components/templates/TemplateRingkas').then(m => ({ default: m.TemplateRingkas })),
  { ssr: false, loading: () => <TemplateLoadingFallback /> }
)
const TemplateSederhana = dynamic<{ state: FormState }>(
  () => import('@/components/templates/TemplateSederhana').then(m => ({ default: m.TemplateSederhana })),
  { ssr: false, loading: () => <TemplateLoadingFallback /> }
)
const TemplateMinimalIslami = dynamic<{ state: FormState }>(
  () => import('@/components/templates/TemplateMinimalIslami').then(m => ({ default: m.TemplateMinimalIslami })),
  { ssr: false, loading: () => <TemplateLoadingFallback /> }
)
const TemplateAkademik = dynamic<{ state: FormState }>(
  () => import('@/components/templates/TemplateAkademik').then(m => ({ default: m.TemplateAkademik })),
  { ssr: false, loading: () => <TemplateLoadingFallback /> }
)
const TemplateElegantIslamic = dynamic<{ state: FormState }>(
  () => import('@/components/templates/TemplateElegantIslamic').then(m => ({ default: m.TemplateElegantIslamic })),
  { ssr: false, loading: () => <TemplateLoadingFallback /> }
)
const TemplateModernPremium = dynamic<{ state: FormState }>(
  () => import('@/components/templates/TemplateModernPremium').then(m => ({ default: m.TemplateModernPremium })),
  { ssr: false, loading: () => <TemplateLoadingFallback /> }
)

/** Inline loading fallback saat template sedang lazy-load */
function TemplateLoadingFallback() {
  return (
    <div
      id="taaruf-template"
      style={{
        width: 794,
        minHeight: 1123,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#64748B',
        fontSize: '14px',
      }}
    >
      Memuat template…
    </div>
  )
}

// ── Template config ──────────────────────────────────────────
const TEMPLATE_PAGE_COUNT: Record<string, number> = {
  ringkas: 1,
  sederhana: 2,
  minimal_islami: 1,
  akademik: 5,
  elegant_islamic: 5,
  modern_dark: 4,
}

const TEMPLATE_LABEL: Record<string, string> = {
  ringkas: 'Ringkas',
  sederhana: 'Sederhana',
  minimal_islami: 'Minimal Islami',
  akademik: 'Akademik',
  elegant_islamic: 'Elegant Islamic',
  modern_dark: 'Modern Dark',
}

const templateMap: Record<string, React.ComponentType<{ state: FormState }>> = {
  ringkas: TemplateRingkas,
  sederhana: TemplateSederhana,
  minimal_islami: TemplateMinimalIslami,
  akademik: TemplateAkademik,
  elegant_islamic: TemplateElegantIslamic,
  modern_dark: TemplateModernPremium,
}

// ── Loading State ─────────────────────────────────────────────
function PublicLoading() {
  return (
    <div className="preview-page">
      <div className="preview-pattern" />
      <div className="preview-glow" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-white text-sm">Memuat CV Taaruf…</p>
        </div>
      </div>
    </div>
  )
}

// ── Error / Not Found State ───────────────────────────────────
function PublicNotFound({ message }: { message: string }) {
  return (
    <div className="preview-page">
      <div className="preview-pattern" />
      <div className="preview-glow" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-5xl mb-4">📄</div>
          <AlertTriangle size={40} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">CV Tidak Ditemukan</h2>
          <p className="text-sm text-navy-400 mb-6">{message}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all"
          >
            <Heart size={16} />
            Buat CV Taaruf Saya
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Scale Wrapper (same as PreviewClient) ─────────────────────
const PDF_WIDTH_PX = 794
const PDF_PAGE_HEIGHT_PX = 1123

function ScaleWrapper({
  children,
  pageCount,
}: {
  children: React.ReactNode
  pageCount: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const available = containerRef.current.clientWidth - 24
      setScale(Math.min(1, available / PDF_WIDTH_PX))
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const scaledHeight = pageCount * PDF_PAGE_HEIGHT_PX * scale

  return (
    <div ref={containerRef} className="w-full">
      <div style={{ height: `${scaledHeight}px` }} className="relative flex justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: PDF_WIDTH_PX,
            position: 'absolute',
            top: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Page Component ────────────────────────────────────────────
export default function PublicCvPage({ params }: { params: Promise<{ shareId: string }> }) {
  const [state, setState] = useState<FormState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(async ({ shareId }) => {
      try {
        const result = await loadProfilePublic(shareId)
        if (result.success && result.state) {
          setState(result.state)
        } else {
          setError(result.error || 'CV tidak ditemukan.')
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat CV.')
      } finally {
        setLoading(false)
      }
    })
  }, [params])

  if (loading) return <PublicLoading />
  if (error || !state) return <PublicNotFound message={error || 'CV tidak ditemukan.'} />

  const templateKey = state.fotoTemplate.template_pilihan
  const pageCount = TEMPLATE_PAGE_COUNT[templateKey] ?? 1
  const ActiveTemplate = templateMap[templateKey] || TemplateRingkas
  const templateName = TEMPLATE_LABEL[templateKey] || 'Ringkas'
  const ownerName = state.dataPribadi.nama_lengkap || 'Seseorang'

  return (
    <div className="preview-page">
      <div className="preview-pattern" />
      <div className="preview-glow" />

      <div className="relative z-10">
        {/* ── Public Top Bar ── */}
        <header className="preview-topbar">
          <div className="preview-topbar-inner">
            {/* Left: Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
              <div className="preview-topbar-brand">
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #065F46, #047857)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '13px', fontWeight: 700,
                }}>
                  N
                </div>
                <span>NikahReady</span>
              </div>
            </div>

            {/* Center: Info */}
            <div className="preview-topbar-center">
              <p className="preview-topbar-title">Lembar Taaruf</p>
              <p className="preview-topbar-subtitle">
                {ownerName} · Template {templateName} · {pageCount} halaman
              </p>
            </div>

            {/* Right: Print + CTA */}
            <div className="preview-topbar-actions">
              <button
                type="button"
                onClick={() => window.print()}
                className="preview-btn-print"
                title="Cetak / Save PDF"
              >
                <Printer />
                <span className="hidden sm:inline">Cetak</span>
              </button>
              <Link
                href="/"
                className="preview-btn-download"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
              >
                <Heart size={16} />
                <span className="hidden sm:inline">Buat CV Saya</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ── CV Content ── */}
        <main className="py-6 px-2">
          <div className="preview-info-banner" style={{ margin: '0 auto 16px' }}>
            <FileText />
            <p>
              Ini adalah Lembar Taaruf <strong>{ownerName}</strong>.
              Data ditampilkan berdasarkan izin pemilik CV.
            </p>
          </div>

          <ScaleWrapper pageCount={pageCount}>
            <ActiveTemplate state={state} />
          </ScaleWrapper>

          <div className="h-12" />

          {/* Trust strip */}
          <div className="preview-trust">
            <div className="preview-trust-inner">
              <div className="preview-trust-item">
                <ShieldCheck /> <span>Data Terverifikasi</span>
              </div>
              <div className="preview-trust-item">
                <Lock /> <span>Privasi Terjaga</span>
              </div>
              <div className="preview-trust-item">
                <Heart /> <span>Barokah</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="preview-footer">
          <p className="preview-footer-brand">© 2025 NikahReady · Alat Bantu CV Taaruf</p>
          <p className="preview-footer-values">Jujur · Bermartabat · Aman</p>
        </footer>
      </div>
    </div>
  )
}