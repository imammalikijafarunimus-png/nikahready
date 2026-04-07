// ============================================================
// src/lib/loadProfilePublic.ts
//
// Fetch profile data untuk halaman publik /cv/[shareId].
// Menggunakan anon key — tidak butuh auth.
// RLS memastikan hanya published profiles yang bisa dibaca.
//
// Phase 4.1: Refactored to use shared mapDbProfileToFormState()
// ============================================================

import { createClient } from '@/lib/supabase/client'
import type { FormState } from '@/types'
import { INITIAL_FORM_STATE } from '@/lib/constants'
import { mapDbProfileToFormState } from '@/lib/mapDbProfileToFormState'
import type { DbProfileRow } from '@/lib/mapDbProfileToFormState'

interface PublicProfileResult {
  success: boolean
  state?: FormState
  error?: string
}

/**
 * Fetch semua data profile berdasarkan share_id.
 * Mengembalikan FormState yang bisa langsung dipakai
 * oleh template component.
 */
export async function loadProfilePublic(
  shareId: string
): Promise<PublicProfileResult> {
  const supabase = createClient()

  const { data: fullProfile, error: profileError } = await supabase
    .from('taaruf_profiles')
    .select('*')
    .eq('share_id', shareId)
    .eq('is_published', true)
    .single()

  if (profileError || !fullProfile) {
    return {
      success: false,
      error: 'CV tidak ditemukan atau sudah tidak dipublikasikan.',
    }
  }

  const profileId = fullProfile.id

  // Fetch all related tables in parallel
  const [
    { data: riwayatPendidikan },
    { data: riwayatPekerjaan },
    { data: perjalananHidup },
    { data: riwayatOrganisasi },
    { data: sosialMedia },
    { data: galeriFoto },
    { data: anggotaKeluarga },
    { data: rencanaMasaDepan },
  ] = await Promise.all([
    supabase.from('riwayat_pendidikan').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('riwayat_pekerjaan').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('perjalanan_hidup').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('riwayat_organisasi').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('sosial_media').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('galeri_foto').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('anggota_keluarga').select('*').eq('profile_id', profileId).order('urutan'),
    supabase.from('rencana_masa_depan').select('*').eq('profile_id', profileId).order('urutan'),
  ])

  // Map using shared mapper with public-specific options
  const mapped = mapDbProfileToFormState(
    fullProfile as unknown as DbProfileRow,
    {
      riwayatPendidikan: (riwayatPendidikan || []) as Record<string, unknown>[],
      riwayatPekerjaan: (riwayatPekerjaan || []) as Record<string, unknown>[],
      perjalananHidup: (perjalananHidup || []) as Record<string, unknown>[],
      riwayatOrganisasi: (riwayatOrganisasi || []) as Record<string, unknown>[],
      sosialMedia: (sosialMedia || []) as Record<string, unknown>[],
      galeriFoto: (galeriFoto || []) as Record<string, unknown>[],
      anggotaKeluarga: (anggotaKeluarga || []) as Record<string, unknown>[],
      rencanaMasaDepan: (rencanaMasaDepan || []) as Record<string, unknown>[],
    },
    // Public profile: use || (OR), stringify numbers
    { useOrFallback: true, stringifyNumbers: true }
  )

  // Spread with INITIAL_FORM_STATE to ensure complete FormState
  const state: FormState = {
    ...INITIAL_FORM_STATE,
    ...mapped,
  }

  return { success: true, state }
}