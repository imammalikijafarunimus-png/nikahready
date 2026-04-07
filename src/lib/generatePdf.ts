// ============================================================
// src/lib/generatePdf.ts
//
// PDF Generator untuk NikahReady
//
// Strategi: capture setiap page div secara individual
// menggunakan html2canvas, lalu gabungkan di jsPDF.
// Ini lebih reliable daripada html2pdf auto-pagebreak
// karena kita punya kontrol penuh atas setiap halaman.
//
// PENTING: File ini hanya boleh di-import di dalam
// async function (bukan module level) karena html2canvas
// dan jsPDF mengakses `window` / `document`.
//
// v2.0 — Improved: font loading, text normalization,
//         scale transform fix, PNG output for quality.
// ============================================================

interface GeneratePdfOptions {
  /** Element yang berisi semua page div (id="taaruf-template") */
  templateElement: HTMLElement
  /** Nama file output tanpa ekstensi */
  filename?: string
  /** Nama pemilik CV untuk nama file */
  ownerName?: string
  /** Jika true, tambahkan watermark "NikahReady Free" di setiap halaman */
  isFreeUser?: boolean
}

interface GeneratePdfResult {
  success: boolean
  error?: string
}

// ── A4 dimensions (96 DPI) ───────────────────────────────────
const A4_WIDTH_PX  = 794
const A4_HEIGHT_PX = 1123
const PDF_W_MM     = 210
const PDF_H_MM     = 297

/**
 * Menghapus CSS transform sementara untuk mendapatkan
 * screenshot ukuran asli (794px), bukan ukuran yang di-scale.
 *
 * Perbaikan v2: force reflow setelah transform removal
 * agar browser menghitung ulang layout sebelum capture.
 */
function removeTransformTemporarily(el: HTMLElement): (() => void) {
  const originalTransform       = el.style.transform
  const originalTransformOrigin = el.style.transformOrigin
  const originalPosition        = el.style.position
  const originalVisibility      = el.style.visibility
  const originalZIndex          = el.style.zIndex
  const originalLeft            = el.style.left
  const originalTop             = el.style.top

  el.style.transform       = 'none'
  el.style.transformOrigin = 'unset'
  // Pastikan element visible & di atas semuanya tapi tidak mengganggu layout
  el.style.position        = 'fixed'
  el.style.visibility      = 'visible'
  el.style.zIndex          = '9999'
  el.style.left            = '0'
  el.style.top             = '0'

  // Force reflow — ini kritis agar browser menghitung ulang layout
  // setelah transform dihapus. Tanpa ini, html2canvas bisa saja
  // membaca layout yang masih "cached" sebelum transform removal.
  void el.offsetHeight
  void el.offsetWidth

  // Return restore function
  return () => {
    el.style.transform       = originalTransform
    el.style.transformOrigin = originalTransformOrigin
    el.style.position        = originalPosition
    el.style.visibility      = originalVisibility
    el.style.zIndex          = originalZIndex
    el.style.left            = originalLeft
    el.style.top             = originalTop
    void el.offsetHeight // Force reflow saat restore juga
  }
}

/**
 * Memastikan semua font yang dipakai template sudah loaded.
 * html2canvas hanya bisa render font yang sudah loaded.
 * 
 * Strategy: 
 * 1. Tunggu document.fonts.ready (native)
 * 2. Buat span test untuk setiap font, render ke DOM,
 *    lalu tunggu sampai computed style menunjukkan font yang benar
 * 3. Cleanup span test
 */
async function ensureFontsLoaded(): Promise<void> {
  // 1. Tunggu native font loading
  await document.fonts.ready

  // 2. Font yang wajib tersedia di template
  const requiredFonts = [
    { family: 'Inter', weight: '400' },
    { family: 'Inter', weight: '500' },
    { family: 'Inter', weight: '600' },
    { family: 'Inter', weight: '700' },
    { family: 'Inter', weight: '800' },
    { family: 'Amiri', weight: '400' },
    { family: 'Amiri', weight: '700' },
  ]

  // 3. Buat test span untuk setiap font, cek apakah benar-benar loaded
  const testSpans: HTMLSpanElement[] = []
  const container = document.createElement('div')
  container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;'
  document.body.appendChild(container)

  for (const font of requiredFonts) {
    const span = document.createElement('span')
    span.textContent = 'NikahReady Test'
    span.style.fontFamily = `'${font.family}', sans-serif`
    span.style.fontWeight = font.weight
    span.style.fontSize = '16px'
    container.appendChild(span)
    testSpans.push(span)
  }

  // 4. Tunggu sejenak dan verifikasi
  await new Promise<void>((resolve) => {
    let checks = 0
    const maxChecks = 20 // Max 2 detik (20 * 100ms)
    const interval = setInterval(() => {
      checks++
      // Cek apakah semua font sudah loaded
      const allLoaded = requiredFonts.every((font) =>
        document.fonts.check(`16px "${font.family}"`)
      )
      if (allLoaded || checks >= maxChecks) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })

  // 5. Cleanup
  document.body.removeChild(container)
}

/**
 * Menambahkan watermark footer bar "NikahReady Free" di setiap halaman PDF.
 * Strip branding tipis di bagian bawah halaman, berisi teks branding
 * di kiri dan nomor halaman di kanan.
 * 
 * Footer bar di-render langsung di PDF menggunakan jsPDF,
 * sehingga tidak terlihat di browser preview.
 */
function addWatermark(pdf: { [K: string]: any }, totalPages: number): void {
  const FOOTER_HEIGHT_MM = 12
  const FOOTER_Y = PDF_H_MM - FOOTER_HEIGHT_MM // Top edge of footer bar
  const TEXT_Y = FOOTER_Y + (FOOTER_HEIGHT_MM / 2) + 1.2 // Vertically centered text
  const MARGIN_LEFT = 10
  const MARGIN_RIGHT = 10
  const FOOTER_BG: [number, number, number] = [15, 23, 42] // #0F172A
  const TEXT_COLOR: [number, number, number] = [200, 210, 220] // Semi-transparent white

  for (let page = 0; page < totalPages; page++) {
    pdf.setPage(page + 1)

    pdf.saveGraphicsState()

    // ── Background bar ──────────────────────────────────────
    pdf.setFillColor(...FOOTER_BG)
    pdf.rect(0, FOOTER_Y, PDF_W_MM, FOOTER_HEIGHT_MM, 'F')

    // ── Text styling ────────────────────────────────────────
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...TEXT_COLOR)

    // ── Left: branding text ─────────────────────────────────
    pdf.text('NikahReady Free \u2014 Upgrade untuk tanpa watermark', MARGIN_LEFT, TEXT_Y)

    // ── Right: page number ──────────────────────────────────
    const pageLabel = `Hal. ${page + 1}/${totalPages}`
    const pageLabelWidth = pdf.getTextWidth(pageLabel)
    pdf.text(pageLabel, PDF_W_MM - MARGIN_RIGHT - pageLabelWidth, TEXT_Y)

    pdf.restoreGraphicsState()
  }
}

export async function generatePdf({
  templateElement,
  filename,
  ownerName = 'taaruf',
  isFreeUser = false,
}: GeneratePdfOptions): Promise<GeneratePdfResult> {
  try {
    // ── 1. Dynamic import (WAJIB — bukan module level) ────────
    // Kedua library ini mengakses document/window saat di-load
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])
    const html2canvas = html2canvasModule.default
    const { jsPDF }   = jsPDFModule

    // ── 2. Pastikan semua font sudah loaded ────────────────────
    // Kritis: tanpa ini, screenshot bisa pakai fallback font
    // yang ukurannya beda → posisi teks berantakan di PDF
    await ensureFontsLoaded()

    // ── 3. Temukan semua page div ──────────────────────────────
    // Setiap halaman PDF adalah direct child pertama dari template
    // yang punya width 794px
    const pageElements = Array.from(
      templateElement.children
    ) as HTMLElement[]

    if (pageElements.length === 0) {
      return { success: false, error: 'Tidak ada halaman untuk di-render' }
    }

    // ── 4. Remove scale transform sementara ───────────────────
    // ScaleWrapper di PreviewClient memberi scale transform.
    // Kita butuh screenshot element ukuran ASLI (794px).
    // Cari ancestor yang punya transform — bisa jadi parent atau
    // parent-nya parent dari templateElement.
    let scaledAncestor: HTMLElement | null = null
    let el: HTMLElement | null = templateElement.parentElement
    while (el) {
      const transform = window.getComputedStyle(el).transform
      if (transform && transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
        scaledAncestor = el
        break
      }
      el = el.parentElement
    }

    const restoreTransform = scaledAncestor
      ? removeTransformTemporarily(scaledAncestor)
      : () => {}

    // Juga pastikan template container sendiri tidak ter-scale
    const restoreTemplate = removeTransformTemporarily(templateElement)

    try {
      // ── 5. Inisialisasi jsPDF ────────────────────────────────
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      // ── 6. Capture setiap halaman ────────────────────────────
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i]

        // Tambah halaman baru (kecuali halaman pertama)
        if (i > 0) {
          pdf.addPage('a4', 'portrait')
        }

        // Pastikan halaman memiliki dimensi yang benar
        const originalWidth = pageEl.style.width
        const originalMinHeight = pageEl.style.minHeight
        pageEl.style.width = `${A4_WIDTH_PX}px`
        pageEl.style.minHeight = `${A4_HEIGHT_PX}px`
        void pageEl.offsetHeight // Force reflow

        try {
          // html2canvas config — optimized untuk akurasi
          const canvas = await html2canvas(pageEl, {
            scale: 2,              // 2x untuk kualitas retina / print
            useCORS: true,         // Untuk gambar dari Supabase Storage
            allowTaint: false,     // Lebih aman dengan useCORS: true
            backgroundColor: '#ffffff',
            logging: false,        // Matikan log di production
            imageTimeout: 15000,   // Timeout 15 detik per gambar

            // Perbaikan v2: width eksplisit agar html2canvas
            // tidak menghitung ulang dengan dimensi yang salah
            width: A4_WIDTH_PX,
            windowWidth: A4_WIDTH_PX,

            // Perbaikan v2: hilangkan elemen yang tidak terlihat
            ignoreElements: (element) => {
              // Skip elemen yang hidden atau tooltip
              const tag = element.tagName?.toLowerCase()
              if (tag === 'script' || tag === 'style') return true
              if ((element as HTMLElement).style?.display === 'none') return true
              return false
            },

            onclone: (clonedDoc, clonedElement) => {
              // ── Perbaikan v2: Normalisasi text rendering ──
              // Ini mengeliminasi perbedaan sub-pixel rendering
              // antara browser dan canvas
              const normalizeStyle = clonedDoc.createElement('style')
              normalizeStyle.textContent = `
                /* Normalisasi text spacing untuk akurasi PDF */
                * {
                  letter-spacing: normal !important;
                  word-spacing: normal !important;
                  text-rendering: geometricPrecision !important;
                  -webkit-font-smoothing: antialiased !important;
                  -moz-osx-font-smoothing: grayscale !important;
                }

                /* Pastikan semua elemen menggunakan Inter */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
                
                body, div, span, p, h1, h2, h3, h4, h5, h6,
                li, ul, ol, td, th, label, a, strong, em, b, i {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
                }

                /* Font Arabic khusus */
                .font-arabic, [style*="Amiri"], [class*="arabic"] {
                  font-family: 'Amiri', Georgia, 'Times New Roman', serif !important;
                }

                /* Fix flexbox layout consistency */
                .template-page > div > div,
                .template-page section {
                  flex-shrink: 0 !important;
                  min-width: 0 !important;
                  overflow: hidden !important;
                }
              `
              clonedDoc.head.appendChild(normalizeStyle)

              // Pastikan elemen yang di-clone juga tidak ter-scale
              clonedElement.style.transform       = 'none'
              clonedElement.style.transformOrigin = 'unset'
              clonedElement.style.width          = `${A4_WIDTH_PX}px`
              clonedElement.style.minHeight      = `${A4_HEIGHT_PX}px`

              // Force reflow di clone juga
              void clonedElement.offsetHeight
            },
          })

          // ── Convert canvas ke image data ────────────────────
          // Perbaikan v2: gunakan PNG untuk kualitas text yang lebih tajam.
          // JPEG menghilangkan detail halus pada teks kecil (font size < 10px).
          // Tradeoff: file size lebih besar ~2-3x, tapi text jauh lebih tajam.
          const imgData   = canvas.toDataURL('image/png')
          const imgWidth  = PDF_W_MM
          // Hitung tinggi proporsional (A4 @96dpi → 794x1123px)
          const imgHeight = (canvas.height * PDF_W_MM) / canvas.width

          // Tambahkan image ke halaman PDF
          // Jika imgHeight > PDF_H_MM (konten overflow), pdf akan crop
          // Ini acceptable karena kita sudah set overflow: hidden pada tiap page
          pdf.addImage(
            imgData,
            'PNG',           // Perbaikan: PNG untuk kualitas text
            0,               // x margin
            0,               // y margin
            imgWidth,
            imgHeight,
            undefined,       // alias (auto)
            'FAST',          // compression: NONE | FAST | MEDIUM | SLOW
          )
        } finally {
          // Restore original dimensions
          pageEl.style.width = originalWidth
          pageEl.style.minHeight = originalMinHeight
        }
      }

      // ── 7. Tambahkan watermark untuk free user ──────────────
      if (isFreeUser) {
        addWatermark(pdf, pageElements.length)
      }

      // ── 8. Generate nama file ──────────────────────────────
      const safeName = ownerName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 30)

      const dateStr = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '')

      const outputFilename = filename ?? `CV_NikahReady_${safeName}_${dateStr}.pdf`

      // ── 8. Download ────────────────────────────────────────
      pdf.save(outputFilename)

      return { success: true }

    } finally {
      // Selalu restore transform, bahkan jika ada error
      restoreTransform()
      restoreTemplate()
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat PDF'
    console.error('[NikahReady] generatePdf error:', err)
    return { success: false, error: message }
  }
}