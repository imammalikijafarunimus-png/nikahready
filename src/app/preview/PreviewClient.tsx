'use client'

// ============================================================
// src/app/preview/PreviewClient.tsx  (FINAL — Phase 6)
// ============================================================

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import Link from 'next/link'
import { useFormState } from '@/context/FormContext'
import { TemplateAkademik } from '@/components/templates/TemplateAkademik'
import { generatePdf } from '@/lib/generatePdf'
import type { FormState } from '@/types'

const PDF_WIDTH_PX       = 794
const PDF_PAGE_HEIGHT_PX = 1123

// ── Skeletons & States ────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-sage-700 border-t-sage-400 animate-spin" />
        <p className="text-sm text-navy-400">Memuat preview…</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center max-w-sm">
        <span className="text-5xl block mb-4">📄</span>
        <h2 className="text-lg font-bold text-white mb-2">CV Taaruf Belum Dibuat</h2>
        <p className="text-sm text-navy-400 leading-relaxed">
          Isi data taarufmu terlebih dahulu untuk melihat preview CV.
        </p>
      </div>
      <Link
        href="/create"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sage-700 to-sage-600 text-white text-sm font-semibold hover:from-sage-600 hover:to-sage-500 transition-all active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
        Mulai Isi Data
      </Link>
    </div>
  )
}

// ── Download Overlay ──────────────────────────────────────────
function DownloadOverlay({ step }: { step: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 max-w-xs text-center px-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-sage-900" />
          <div className="absolute inset-0 rounded-full border-2 border-sage-400 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-base font-semibold text-white">Membuat PDF…</p>
          <p className="text-sm text-navy-400 mt-1 min-h-[1.25rem]">{step}</p>
        </div>
        <p className="text-xs text-navy-600 leading-relaxed">
          Proses ini membutuhkan beberapa detik.
          Jangan tutup atau refresh halaman ini.
        </p>
      </div>
    </div>
  )
}

// ── Top Bar ────────────────────────────────────────────────────
function PreviewTopBar({
  pageCount,
  onDownload,
  isDownloading,
}: {
  pageCount: number
  onDownload: () => void
  isDownloading: boolean
}) {
  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-sm border-b border-navy-800">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          href="/create"
          className="flex items-center gap-1.5 text-sm text-navy-400 hover:text-white transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Edit
        </Link>

        <div className="flex-1 text-center min-w-0">
          <h1 className="text-sm font-semibold text-white">Preview CV Taaruf</h1>
          <p className="text-xs text-navy-500">
            Template Akademik · {pageCount} halaman
          </p>
        </div>

        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className={[
            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0',
            'transition-all duration-200 active:scale-95',
            isDownloading
              ? 'bg-navy-700 text-navy-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:opacity-90 shadow-gold',
          ].join(' ')}
        >
          {isDownloading ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span className="hidden sm:inline">Memproses…</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </>
          )}
        </button>
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
  const wrapperRef  = useRef<HTMLDivElement>(null)  // ref ke ScaleWrapper inner div

  const [isHydrated,    setIsHydrated]    = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStep,  setDownloadStep]  = useState('')
  const [errorMsg,      setErrorMsg]      = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setIsHydrated(true), 150)
    return () => clearTimeout(t)
  }, [])

  const pageCount = useMemo(() => {
    let count = 1
    if (
      state.riwayatPendidikan.length > 0 ||
      state.riwayatPekerjaan.length > 0 ||
      state.riwayatOrganisasi.length > 0
    ) count++
    if (state.perjalananHidup.length > 0) count++
    if (
      state.karakter.karakter_diri ||
      state.karakter.kelebihan.length > 0 ||
      state.ibadah.shalat_fardhu
    ) count++
    if (
      state.visiMisi.visi ||
      state.kriteria.kriteria_karakter ||
      state.pandanganIsu.pandangan_isu
    ) count++
    return Math.max(count, 1)
  }, [state])

  const handleDownload = useCallback(async () => {
    if (!wrapperRef.current || isDownloading) return

    setIsDownloading(true)
    setErrorMsg(null)

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
      })

      if (!result.success) {
        throw new Error(result.error ?? 'Gagal membuat PDF')
      }

      setDownloadStep('Selesai ✓')
      await new Promise((r) => setTimeout(r, 500))

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui')
    } finally {
      setIsDownloading(false)
      setDownloadStep('')
    }
  }, [isDownloading, state.dataPribadi.nama_lengkap])

  if (!isHydrated) return <LoadingSkeleton />
  if (!hasMinimumData(state)) return <EmptyState />

  return (
    <div className="min-h-screen bg-navy-950">
      <PreviewTopBar
        pageCount={pageCount}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

      {isDownloading && <DownloadOverlay step={downloadStep} />}

      {/* Error toast */}
      {errorMsg && (
        <div
          role="alert"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-900 border border-red-700 text-red-200 text-sm shadow-lg animate-slide-up max-w-sm w-full mx-4"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="flex-1">{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="opacity-70 hover:opacity-100">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <main className="py-6 px-2">
        <div className="max-w-2xl mx-auto mb-4 px-2">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
            <svg className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-navy-400 leading-relaxed">
              Ini adalah preview CV-mu ({pageCount} halaman). Klik{' '}
              <strong className="text-gold-400">Download PDF</strong> di atas
              untuk mengunduh. Proses membutuhkan beberapa detik.
            </p>
          </div>
        </div>

        <ScaleWrapper innerRef={wrapperRef} pageCount={pageCount}>
          <TemplateAkademik state={state} />
        </ScaleWrapper>

        <div className="h-12" />
      </main>
    </div>
  )
}
