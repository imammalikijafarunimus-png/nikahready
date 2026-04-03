// ============================================================
// src/lib/shareProfile.ts
//
// Fungsi untuk publish/unpublish CV dan generate share link.
// Dipakai di PreviewClient dan ShareMenu.
// ============================================================

import { createClient } from '@/lib/supabase/client'

/**
 * Generate random share ID yang aman untuk URL.
 * 12 karakter, tanpa huruf ambigu (0, O, I, l, 1).
 * Contoh: "nkr8x2m4q7pf"
 */
function generateShareId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let result = ''
  // Use crypto.getRandomValues for better randomness
  const randomValues = new Uint32Array(12)
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(randomValues)
  }
  for (let i = 0; i < 12; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return `nkr-${result}`
}

/**
 * Get the public URL for a shared CV.
 */
export function getShareUrl(shareId: string): string {
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || ''
  return `${base}/cv/${shareId}`
}

/**
 * Publish CV — generate share_id (kalau belum ada) dan set is_published = true.
 * Returns shareId yang bisa dipakai untuk share link.
 */
export async function publishProfile(): Promise<{
  success: boolean
  shareId?: string
  error?: string
}> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Belum login' }

  // Cek apakah sudah punya profile
  const { data: existing, error: fetchError } = await supabase
    .from('taaruf_profiles')
    .select('id, share_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchError) return { success: false, error: fetchError.message }

  // Kalau belum ada profile sama sekali, tidak bisa publish
  if (!existing) return { success: false, error: 'Belum ada profil. Isi data terlebih dahulu.' }

  // Gunakan share_id yang sudah ada, atau generate baru
  const shareId = existing.share_id || generateShareId()

  const { error: updateError } = await supabase
    .from('taaruf_profiles')
    .update({
      is_published: true,
      share_id: shareId,
    })
    .eq('id', existing.id)

  if (updateError) return { success: false, error: updateError.message }

  return { success: true, shareId }
}

/**
 * Unpublish CV — set is_published = false.
 * share_id tetap disimpan supaya kalau publish lagi,
 * URL tetap sama.
 */
export async function unpublishProfile(): Promise<{
  success: boolean
  error?: string
}> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Belum login' }

  const { error } = await supabase
    .from('taaruf_profiles')
    .update({ is_published: false })
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  return { success: true }
}

/**
 * Cek status publish profile saat ini.
 * Returns { isPublished, shareId } untuk inisialisasi state.
 */
export async function getShareStatus(): Promise<{
  isPublished: boolean
  shareId: string | null
}> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isPublished: false, shareId: null }

  const { data } = await supabase
    .from('taaruf_profiles')
    .select('is_published, share_id')
    .eq('user_id', user.id)
    .maybeSingle()

  return {
    isPublished: data?.is_published ?? false,
    shareId: data?.share_id ?? null,
  }
}