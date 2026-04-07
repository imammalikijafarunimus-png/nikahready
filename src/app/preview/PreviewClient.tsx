'use client'

// ============================================================
// src/app/preview/PreviewClient.tsx  (FINAL — Phase 5: Grade A)
// ============================================================

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import Link from 'next/link'
import {
  Pencil,
  Eye,
  Download,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ChevronRight,
  FileText,
  Sparkles,
  Info,
  X,
  Printer,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useFormState } from '@/context/FormContext'
import { useRequireAuth } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OPTIONS_TEMPLATE } from '@/lib/constants'
import { generatePdf } from '@/lib/generatePdf'
import type { FormState } from '@/types'
import './preview.css'

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

const PDF_WIDTH_PX       = 794
const PDF_PAGE_HEIGHT_PX = 1123

// ── Skeletons & States ────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="preview-loading">
      <div className="preview-loading-content">
        <p className="preview-loading-arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        <div className="preview-loading-spinner" />
        <p className="preview-loading-text">Memuat preview…</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="preview-empty">
      <div className="preview-empty-icon">
        📄
      </div>
      <h2 className="preview-empty-title">Belum Ada CV Taaruf</h2>
      <p className="preview-empty-desc">
        Isi data taarufmu terlebih dahulu untuk melihat preview Lembar Taaruf.
      </p>
      <p className="preview-empty-desc" style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '-8px' }}>
        Alhamdulillah, perjalanan dimulai dari langkah pertama.
      </p>
      <Link href="/create" className="preview-empty-cta">
        <Pencil />
        Mulai Isi Data
      </Link>
    </div>
  )
}

// ── Download Overlay ──────────────────────────────────────────
function DownloadOverlay({ step }: { step: string }) {
  return (
    <div className="preview-download-overlay">
      <div className="preview-download-card">
        <div className="preview-download-spinner">
          <div className="preview-download-spinner-ring" />
          <div className="preview-download-spinner-progress" />
          <div className="preview-download-spinner-icon">
            <Download />
          </div>
        </div>
        <p className="preview-download-title">Membuat PDF…</p>
        <p className="preview-download-step">{step}</p>
        <p className="preview-download-hint">
          Proses ini membutuhkan beberapa detik. Jangan tutup atau refresh halaman ini.
        </p>
      </div>
    </div>
  )
}

// ── Success Overlay ───────────────────────────────────────────
function SuccessOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="preview-success-overlay">
      <div className="preview-success-card">
        <div className="preview-success-icon">
          <CheckCircle2 />
        </div>
        <p className="preview-success-arabic">بَارَكَ اللهُ فِيكَ</p>
        <p className="preview-success-meaning">&ldquo;Semoga Allah memberkahi kamu&rdquo;</p>
        <h3 className="preview-success-title">PDF Berhasil Diunduh!</h3>
        <p className="preview-success-desc">
          Lembar Taarufmu siap dibagikan ke wali atau murabbi. Semoga menjadi jalan
          untuk pernikahan yang barokah.
        </p>
        <div className="preview-success-actions">
          <Link href="/dashboard" className="preview-success-btn preview-success-btn-primary">
            Ke Dashboard
          </Link>
          <button onClick={onClose} className="preview-success-btn preview-success-btn-secondary">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Top Bar ────────────────────────────────────────────────────
function PreviewTopBar({
  pageCount,
  templateName,
  onDownload,
  isDownloading,
}: {
  pageCount: number
  templateName: string
  onDownload: () => void
  isDownloading: boolean
}) {
  return (
    <header className="preview-topbar">
      <div className="preview-topbar-inner">
        {/* ── Left: Brand + Edit ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div className="preview-topbar-brand">
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #065F46, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
            }}>
              N
            </div>
            <span>NikahReady</span>
          </div>
          <Link href="/create" className="preview-btn-edit">
            <Pencil />
            Edit
          </Link>
        </div>

        {/* ── Center: Title ── */}
        <div className="preview-topbar-center">
          <p className="preview-topbar-title">Preview Lembar Taaruf</p>
          <p className="preview-topbar-subtitle">
            Template {templateName} · {pageCount} halaman
          </p>
        </div>

        {/* ── Right: Print + Download ── */}
        <div className="preview-topbar-actions">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => window.print()}
            className="preview-btn-print"
            title="Cetak / Save PDF"
          >
            <Printer />
            <span className="hidden sm:inline">Cetak</span>
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="preview-btn-download"
          >
            {isDownloading ? (
              <>
                <div className="preview-loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span className="hidden sm:inline">Memproses…</span>
              </>
            ) : (
              <>
                <Download />
                <span className="hidden sm:inline">Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

// ── Scale Wrapper ──────────────────────────────────────────────
function ScaleWrapper({
  children,
  innerRef,
  pageCount,
}: {
  children: React.ReactNode
  innerRef: React.RefObject<HTMLDivElement>
  pageCount: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    if (!containerRef.current) return
    const available = containerRef.current.clientWidth - 24
    setScale(Math.min(1, available / PDF_WIDTH_PX))
  }, [])

  useEffect(() => {
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [updateScale])

  const scaledHeight = pageCount * PDF_PAGE_HEIGHT_PX * scale

  return (
    <div ref={containerRef} className="w-full">
      <div style={{ height: `${scaledHeight}px` }} className="relative flex justify-center">
        <div
          ref={innerRef}
          style={{
            transform:       `scale(${scale})`,
            transformOrigin: 'top center',
            width:           PDF_WIDTH_PX,
            position:        'absolute',
            top:             0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function hasMinimumData(state: FormState): boolean {
  return Boolean(state.dataPribadi.nama_lengkap)
}

// ── Main ────────────────────────────────────────────────────────
export function PreviewClient() {
  const state       = useFormState()
  const { plan }    = useRequireAuth()
  const wrapperRef  = useRef<HTMLDivElement>(null)  // ref ke ScaleWrapper inner div

  const [isHydrated,    setIsHydrated]    = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStep,  setDownloadStep]  = useState('')
  const [errorMsg,      setErrorMsg]      = useState<string | null>(null)
  const [showSuccess,   setShowSuccess]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsHydrated(true), 150)
    return () => clearTimeout(t)
  }, [])

  // Fixed page count per template (all pages are always rendered)
  const TEMPLATE_PAGE_COUNT: Record<string, number> = {
    ringkas: 1,
    sederhana: 2,
    minimal_islami: 1,
    akademik: 5,
    elegant_islamic: 5,
    modern_dark: 4,
  }
  const pageCount = TEMPLATE_PAGE_COUNT[state.fotoTemplate.template_pilihan] ?? 1

  // ── Template switching logic ──
  const templateMap: Record<string, React.ComponentType<{ state: FormState }>> = {
    ringkas: TemplateRingkas,
    sederhana: TemplateSederhana,
    minimal_islami: TemplateMinimalIslami,
    akademik: TemplateAkademik,
    elegant_islamic: TemplateElegantIslamic,
    modern_dark: TemplateModernPremium,
  }
  const ActiveTemplate = templateMap[state.fotoTemplate.template_pilihan] || TemplateRingkas
  const templateName = state.fotoTemplate.template_pilihan === 'ringkas' ? 'Ringkas'
    : state.fotoTemplate.template_pilihan === 'sederhana' ? 'Sederhana'
    : state.fotoTemplate.template_pilihan === 'minimal_islami' ? 'Minimal Islami'
    : state.fotoTemplate.template_pilihan === 'akademik' ? 'Akademik'
    : state.fotoTemplate.template_pilihan === 'elegant_islamic' ? 'Elegant Islamic'
    : state.fotoTemplate.template_pilihan === 'modern_dark' ? 'Modern Dark'
    : 'Ringkas'

  const handleDownload = useCallback(async () => {
    if (!wrapperRef.current || isDownloading) return

    setIsDownloading(true)
    setErrorMsg(null)
    setShowSuccess(false)

    try {
      setDownloadStep('Menyiapkan dokumen…')
      await new Promise((r) => setTimeout(r, 80))

      setDownloadStep('Memuat font & aset…')
      await document.fonts.ready
      await new Promise((r) => setTimeout(r, 150))

      // Cari div template yang sesungguhnya (id="taaruf-template")
      // wrapperRef → ScaleWrapper inner div → TemplateAkademik root div
      const templateEl = wrapperRef.current.querySelector<HTMLElement>(
        '#taaruf-template'
      )

      if (!templateEl) {
        throw new Error('Elemen template tidak ditemukan. Coba refresh halaman.')
      }

      setDownloadStep('Mengambil screenshot setiap halaman…')

      const result = await generatePdf({
        templateElement: templateEl,
        ownerName: state.dataPribadi.nama_lengkap || 'taaruf',
        isFreeUser: plan !== 'premium',
      })

      if (!result.success) {
        throw new Error(result.error ?? 'Gagal membuat PDF')
      }

      setDownloadStep('Selesai ✓')
      await new Promise((r) => setTimeout(r, 500))
      setShowSuccess(true)

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui')
    } finally {
      setIsDownloading(false)
      setDownloadStep('')
    }
  }, [isDownloading, plan, state.dataPribadi.nama_lengkap])

  if (!isHydrated) return <LoadingSkeleton />
  if (!hasMinimumData(state)) return <EmptyState />

  // ── Premium template check ──────────────────────────────────
  const currentTemplate = OPTIONS_TEMPLATE.find(t => t.value === state.fotoTemplate.template_pilihan)
  const isPremiumTemplate = currentTemplate?.isPremiumOnly ?? false

  if (plan !== 'premium' && isPremiumTemplate) {
    return (
      <div className="preview-page">
        <div className="preview-pattern" />
        <div className="preview-glow" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Template Premium</h2>
            <p className="text-sm text-navy-400 mb-6">
              Template &ldquo;{currentTemplate?.label}&rdquo; hanya tersedia untuk pengguna NikahReady Pro.
              Upgrade untuk menggunakan semua template premium dan fitur lengkap lainnya.
            </p>
            <Link href="/upgrade" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-white text-sm font-semibold hover:from-gold-500 hover:to-gold-400 transition-all">
              <Sparkles size={16} />
              Upgrade ke Pro
            </Link>
            <div className="mt-4">
              <Link href="/create" className="text-xs text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors">
                &larr; Kembali ke form (pilih template gratis)
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="preview-page">
      <div className="preview-pattern" />
      <div className="preview-glow" />

      <div className="relative z-10">
        <PreviewTopBar
          pageCount={pageCount}
          templateName={templateName}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />

        {isDownloading && <DownloadOverlay step={downloadStep} />}
        {showSuccess && <SuccessOverlay onClose={() => setShowSuccess(false)} />}

        {/* Error toast */}
        {errorMsg && (
          <div
            role="alert"
            className="preview-error-toast"
          >
            <Info />
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg(null)}>
              <X />
            </button>
          </div>
        )}

        <main className="py-6 px-2">
          {/* Info banner */}
          <div className="preview-info-banner" style={{ margin: '0 auto 16px' }}>
            <Info />
            <p>
              Ini preview Lembar Taarufmu ({pageCount} halaman, template {templateName}).
              Klik <strong>Download PDF</strong> untuk mengunduh.
            </p>
          </div>

          <ScaleWrapper innerRef={wrapperRef} pageCount={pageCount}>
            <ActiveTemplate state={state} />
          </ScaleWrapper>

          <div className="h-12" />

          {/* Trust strip */}
          <div className="preview-trust">
            <div className="preview-trust-inner">
              <div className="preview-trust-item">
                <ShieldCheck /> <span>Data Terenkripsi</span>
              </div>
              <div className="preview-trust-item">
                <Lock /> <span>Server Aman</span>
              </div>
              <div className="preview-trust-item">
                <CheckCircle2 /> <span>Privasi Terjaga</span>
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