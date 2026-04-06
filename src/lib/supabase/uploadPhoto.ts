// ============================================================
// src/lib/supabase/uploadPhoto.ts
// Utility: Upload foto ke Supabase Storage dengan auto-compress
//
// Fitur:
// - Compress otomatis ke max MAX_FILE_SIZE (500KB)
// - Resize via Canvas API jika file terlalu besar
// - Upload ke folder {userId}/ di bucket yang sesuai
// - Return public URL
// - Validasi MIME type (jpeg, png, webp)
// ============================================================

import { createClient } from './client'

// ── Konfigurasi ────────────────────────────────────────────
const MAX_FILE_SIZE = 500 * 1024          // 500KB
const MAX_DIMENSION = 1200                // max px (lebar atau tinggi)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const

type AllowedMime = (typeof ALLOWED_TYPES)[number]
type BucketName = 'profile-photos' | 'gallery-photos'

// ── Types ──────────────────────────────────────────────────
export interface UploadPhotoResult {
  success: boolean
  publicUrl?: string
  error?: string
}

// ── Helpers ────────────────────────────────────────────────

/**
 * Validasi file sebelum upload.
 * Return { valid: false, error: '...' } jika tidak lolos.
 */
function validateFile(file: File): { valid: true } | { valid: false; error: string } {
  // Cek MIME type
  if (!ALLOWED_TYPES.includes(file.type as AllowedMime)) {
    return {
      valid: false,
      error: `Format tidak didukung. Gunakan: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  // Cek ukuran file (max 10MB sebelum compress — hard limit)
  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File terlalu besar. Maksimal 10MB sebelum kompresi.',
    }
  }

  return { valid: true }
}

/**
 * Compress dan/atau resize gambar via Canvas API.
 * Tujuannya agar ukuran file <= MAX_FILE_SIZE (500KB).
 *
 * Strategi:
 * 1. Jika file sudah <= MAX_FILE_SIZE → return as-is (no compress)
 * 2. Load ke Canvas → scale down jika dimensi > MAX_DIMENSION
 * 3. Export sebagai JPEG (quality 0.8) atau WebP (quality 0.8)
 * 4. Jika masih > MAX_FILE_SIZE, turunkan quality secara bertahap
 * 5. Return Blob yang sudah di-compress
 */
async function compressImage(file: File): Promise<Blob> {
  // Jika sudah kecil, langsung return
  if (file.size <= MAX_FILE_SIZE) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Gagal membaca file gambar'))
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onerror = () => reject(new Error('Gagal memuat gambar'))
    img.onload = () => {
      // Hitung dimensi baru (scale down jika perlu)
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Gambar di canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas tidak didukung di browser ini'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      // Tentukan output format
      // WebP lebih efisien, tapi fallback ke JPEG
      const useWebP = file.type === 'image/webp' || typeof canvas.toBlob === 'function'
      const mimeType = useWebP ? 'image/webp' : 'image/jpeg'

      // Coba export dengan quality 0.8
      let quality = 0.8

      function tryExport(): void {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengompres gambar'))
              return
            }

            // Jika sudah <= MAX_FILE_SIZE, selesai
            if (blob.size <= MAX_FILE_SIZE || quality <= 0.3) {
              resolve(blob)
              return
            }

            // Turunkan quality dan coba lagi
            quality -= 0.1
            tryExport()
          },
          mimeType,
          quality
        )
      }

      tryExport()
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Ambil extension berdasarkan MIME type.
 */
function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  return map[mimeType] ?? 'jpg'
}

// ── Main Upload Function ───────────────────────────────────

/**
 * Upload foto ke Supabase Storage.
 *
 * Flow:
 * 1. Validasi file (type, ukuran)
 * 2. Compress ke max 500KB
 * 3. Upload ke {bucket}/{userId}/{timestamp}_{random}.{ext}
 * 4. Return public URL
 *
 * @param file - File dari <input type="file">
 * @param userId - Auth user ID
 * @param bucket - Nama bucket ('profile-photos' atau 'gallery-photos')
 */
export async function uploadPhoto(
  file: File,
  userId: string,
  bucket: BucketName
): Promise<UploadPhotoResult> {
  try {
    // 1. Validasi
    const validation = validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // 2. Compress
    const compressed = await compressImage(file)

    // 3. Upload ke Supabase Storage
    const supabase = createClient()

    // Buat nama file unik: {userId}/{timestamp}_{random8}.{ext}
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2, 10)
    const ext = getExtension(compressed.type)
    const filePath = `${userId}/${timestamp}_${random}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, compressed, {
        cacheControl: '31536000', // 1 year cache (file tidak berubah)
        upsert: false,             // jangan overwrite file lain
        contentType: compressed.type,
      })

    if (uploadError) {
      return {
        success: false,
        error: `Upload gagal: ${uploadError.message}`,
      }
    }

    // 4. Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'Gagal mendapatkan URL publik',
      }
    }

    return {
      success: true,
      publicUrl: urlData.publicUrl,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal mengupload foto'
    console.error('[NikahReady] uploadPhoto error:', err)
    return { success: false, error: message }
  }
}

/**
 * Hapus foto dari Supabase Storage.
 * Dipakai saat user mengganti foto atau menghapus item galeri.
 *
 * FIX (Fase 2): Validasi ownership — pastikan folder pertama
 * dalam filePath sama dengan userId. Ini mencegah user menghapus
 * foto milik user lain.
 */
export async function deletePhoto(
  publicUrl: string,
  bucket: BucketName,
  userId?: string  // FIX: Tambahkan userId untuk validasi ownership
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Ekstrak filePath dari publicUrl
    // Format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{filePath}
    const url = new URL(publicUrl)
    const parts = url.pathname.split('/')
    // Cari index bucket dalam path
    const bucketIndex = parts.findIndex((p) => p === bucket)
    if (bucketIndex === -1 || bucketIndex + 1 >= parts.length) {
      return { success: false, error: 'URL tidak valid' }
    }
    const filePath = parts.slice(bucketIndex + 1).join('/')

    // FIX: Validasi ownership — cek folder pertama = userId
    if (userId) {
      const folderOwner = filePath.split('/')[0]
      if (folderOwner !== userId) {
        console.warn('[NikahReady] deletePhoto: ownership violation — user', userId, 'tried to delete file owned by', folderOwner)
        return { success: false, error: 'Tidak memiliki izin untuk menghapus foto ini' }
      }
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal menghapus foto'
    console.error('[NikahReady] deletePhoto error:', err)
    return { success: false, error: message }
  }
}