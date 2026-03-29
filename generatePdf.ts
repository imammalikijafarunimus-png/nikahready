// ============================================================
// src/lib/generatePdf.ts
//
// PDF Generator untuk TaarufCV
//
// Strategi: capture setiap page div secara individual
// menggunakan html2canvas, lalu gabungkan di jsPDF.
// Ini lebih reliable daripada html2pdf auto-pagebreak
// karena kita punya kontrol penuh atas setiap halaman.
//
// PENTING: File ini hanya boleh di-import di dalam
// async function (bukan module level) karena html2canvas
// dan jsPDF mengakses `window` / `document`.
// ============================================================

interface GeneratePdfOptions {
  /** Element yang berisi semua page div (id="taaruf-template") */
  templateElement: HTMLElement
  /** Nama file output tanpa ekstensi */
  filename?: string
  /** Nama pemilik CV untuk nama file */
  ownerName?: string
}

interface GeneratePdfResult {
  success: boolean
  error?: string
}

/**
 * Menghapus CSS transform sementara untuk mendapatkan
 * screenshot ukuran asli (794px), bukan ukuran yang di-scale.
 */
function removeTransformTemporarily(el: HTMLElement): (() => void) {
  const originalTransform       = el.style.transform
  const originalTransformOrigin = el.style.transformOrigin
  const originalPosition        = el.style.position

  el.style.transform       = 'none'
  el.style.transformOrigin = 'unset'
  // Pastikan element visible tapi tidak mengganggu layout
  el.style.position        = 'absolute'

  // Return restore function
  return () => {
    el.style.transform       = originalTransform
    el.style.transformOrigin = originalTransformOrigin
    el.style.position        = originalPosition
  }
}

export async function generatePdf({
  templateElement,
  filename,
  ownerName = 'taaruf',
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

    // ── 2. Tunggu semua font selesai load ─────────────────────
    // Kritis: tanpa ini, screenshot bisa pakai fallback font
    await document.fonts.ready

    // ── 3. Temukan semua page div ──────────────────────────────
    // Setiap halaman PDF adalah direct child pertama dari template
    // yang punya minHeight 1123px
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
      // ── 5. A4 dimensions (mm) ────────────────────────────────
      const PDF_W_MM = 210  // A4 width in mm
      const PDF_H_MM = 297  // A4 height in mm

      // Inisialisasi jsPDF
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

        // html2canvas config
        const canvas = await html2canvas(pageEl, {
          scale: 2,              // 2x untuk kualitas retina / print
          useCORS: true,         // Untuk gambar dari Supabase Storage
          allowTaint: false,     // Lebih aman dengan useCORS: true
          backgroundColor: '#ffffff',
          logging: false,        // Matikan log di production
          imageTimeout: 15000,   // Timeout 15 detik per gambar
          onclone: (clonedDoc, clonedElement) => {
            // Pastikan elemen yang di-clone juga tidak ter-scale
            clonedElement.style.transform       = 'none'
            clonedElement.style.transformOrigin = 'unset'

            // Force semua font di clone dokumen
            const style = clonedDoc.createElement('style')
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
              * { font-family: 'Inter', system-ui, sans-serif !important; }
              .font-arabic, [style*="Amiri"] { font-family: 'Amiri', Georgia, serif !important; }
            `
            clonedDoc.head.appendChild(style)
          },
        })

        // Convert canvas ke image data
        const imgData   = canvas.toDataURL('image/jpeg', 0.95)
        const imgWidth  = PDF_W_MM
        // Hitung tinggi proporsional (A4 @96dpi → 794x1123px)
        const imgHeight = (canvas.height * PDF_W_MM) / canvas.width

        // Tambahkan image ke halaman PDF
        // Jika imgHeight > PDF_H_MM (konten overflow), pdf akan crop
        // Ini acceptable karena kita sudah set overflow: hidden pada tiap page
        pdf.addImage(
          imgData,
          'JPEG',
          0,           // x margin
          0,           // y margin
          imgWidth,
          imgHeight,
          undefined,   // alias (auto)
          'FAST',      // compression: NONE | FAST | MEDIUM | SLOW
        )
      }

      // ── 7. Generate nama file ──────────────────────────────
      const safeName = ownerName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 30)

      const dateStr = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '')

      const outputFilename = filename ?? `cv_taaruf_${safeName}_${dateStr}.pdf`

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
    console.error('[TaarufCV] generatePdf error:', err)
    return { success: false, error: message }
  }
}
