// ============================================================
// src/lib/supabase/loadProfile.ts
// Utility: Load existing profile from Supabase into FormState
//
// Dipanggil setelah user login untuk mengembalikan draft
// yang tersimpan di Supabase ke dalam form context.
//
// Phase 4.1: Refactored to use shared mapDbProfileToFormState()
// ============================================================

import type { FormState } from '@/types'
import { createClient } from './client'
import { mapDbProfileToFormState } from '@/lib/mapDbProfileToFormState'
import type { DbProfileRow } from '@/lib/mapDbProfileToFormState'

export interface LoadProfileResult {
  success: boolean
  profileId?: string
  profile?: Partial<FormState>
  error?: string
}

/**
 * Load profil taaruf dari Supabase berdasarkan userId.
 * Mengembalikan data scalar dari taaruf_profiles dan
 * data array dari semua tabel relasi.
 */
export async function loadProfile(userId: string): Promise<LoadProfileResult> {
  const supabase = createClient()

  try {
    // ── 1. Load scalar data dari taaruf_profiles ───────────
    const { data: profile, error: profileError } = await supabase
      .from('taaruf_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (profileError) throw profileError

    if (!profile) {
      return { success: true }
    }

    const profileId = profile.id

    // ── 2. Load array tables ───────────────────────────────
    const [pendidikanRes, pekerjaanRes, perjalananRes, organisasiRes, sosmedRes, galeriRes, keluargaRes, rencanaRes] =
      await Promise.all([
        supabase
          .from('riwayat_pendidikan')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('riwayat_pekerjaan')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('perjalanan_hidup')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('riwayat_organisasi')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('sosial_media')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('galeri_foto')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('anggota_keluarga')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
        supabase
          .from('rencana_masa_depan')
          .select('*')
          .eq('profile_id', profileId)
          .order('urutan', { ascending: true }),
      ])

    if (pendidikanRes.error) throw pendidikanRes.error
    if (pekerjaanRes.error) throw pekerjaanRes.error
    if (perjalananRes.error) throw perjalananRes.error
    if (organisasiRes.error) throw organisasiRes.error
    if (sosmedRes.error) throw sosmedRes.error
    if (galeriRes.error) throw galeriRes.error
    if (keluargaRes.error) throw keluargaRes.error
    if (rencanaRes.error) throw rencanaRes.error

    // ── 3. Build FormState partial using shared mapper ─────
    const formState = mapDbProfileToFormState(
      profile as unknown as DbProfileRow,
      {
        riwayatPendidikan: (pendidikanRes.data || []) as Record<string, unknown>[],
        riwayatPekerjaan: (pekerjaanRes.data || []) as Record<string, unknown>[],
        perjalananHidup: (perjalananRes.data || []) as Record<string, unknown>[],
        riwayatOrganisasi: (organisasiRes.data || []) as Record<string, unknown>[],
        sosialMedia: (sosmedRes.data || []) as Record<string, unknown>[],
        galeriFoto: (galeriRes.data || []) as Record<string, unknown>[],
        anggotaKeluarga: (keluargaRes.data || []) as Record<string, unknown>[],
        rencanaMasaDepan: (rencanaRes.data || []) as Record<string, unknown>[],
      },
      // Private profile: use ?? (nullish coalescing), no stringify
      { useOrFallback: false, stringifyNumbers: false }
    )

    return {
      success: true,
      profileId,
      profile: formState as Partial<FormState>,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal memuat profil'
    console.error('[NikahReady] loadProfile error:', err)
    return { success: false, error: message }
  }
}