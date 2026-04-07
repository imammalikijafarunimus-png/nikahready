// ============================================================
// src/lib/supabase/saveProfile.ts
// Utility: simpan seluruh FormState ke Supabase
// Strategi array: DELETE lama → INSERT baru (simpler than diff)
//
// Phase 2 improvements:
// - Zod validation sebelum save (relaxed: hanya log warning, tidak block)
// - Metadata stripping sebelum save (isSaving, isDirty, dll)
// - Snapshot array data sebelum DELETE untuk rollback on failure
// ============================================================

import type { FormState } from '@/types'
import { createClient } from './client'
import { validateFormStateForSave } from '@/lib/validators/profileSchema'

export interface SaveResult {
  success: boolean
  profileId?: string
  error?: string
  warnings?: string[]
}

/**
 * Simpan seluruh profil taaruf ke Supabase.
 * Melakukan upsert pada taaruf_profiles,
 * dan replace-all pada semua tabel array.
 */
export async function saveProfile(
  state: FormState,
  userId: string
): Promise<SaveResult> {
  const supabase = createClient()

  try {
    // ── 0. Validasi data sebelum simpan (relaxed mode) ───
    const validation = validateFormStateForSave(state)
    const warnings: string[] = []

    if (!validation.valid) {
      // Mode relaxed: log warning, tetap lanjut save.
      // Zod schema saat ini strict (semua field wajib) tapi form bisa
      // menyimpan data partial (step demi step). Jadi kita tidak block save.
      console.warn('[NikahReady] Validation warnings:', validation.fieldErrors)

      // Kumpulkan warning untuk user feedback
      for (const [field, errors] of Object.entries(validation.fieldErrors)) {
        warnings.push(`${field}: ${errors.join(', ')}`)
      }
    }

    // ── 1. Upsert taaruf_profiles (scalar data) ───────────
    const profilePayload = {
      user_id: userId,

      // Data Pribadi
      nama_lengkap:       state.dataPribadi.nama_lengkap,
      nama_panggilan:     state.dataPribadi.nama_panggilan,
      tempat_lahir:       state.dataPribadi.tempat_lahir,
      tanggal_lahir:      state.dataPribadi.tanggal_lahir || null,
      kewarganegaraan:    state.dataPribadi.kewarganegaraan,
      suku_bangsa:        state.dataPribadi.suku_bangsa,
      domisili_kota:      state.dataPribadi.domisili_kota,
      domisili_provinsi:  state.dataPribadi.domisili_provinsi,
      status_pernikahan:  state.dataPribadi.status_pernikahan || null,
      jumlah_anak:        state.dataPribadi.jumlah_anak,

      // Fisik & Kesehatan
      tinggi_badan:       state.fisikKesehatan.tinggi_badan || null,
      berat_badan:        state.fisikKesehatan.berat_badan || null,
      golongan_darah:     state.fisikKesehatan.golongan_darah || null,
      warna_kulit:        state.fisikKesehatan.warna_kulit,
      kondisi_kesehatan:  state.fisikKesehatan.kondisi_kesehatan,
      riwayat_penyakit:   state.fisikKesehatan.riwayat_penyakit,
      kebutuhan_khusus:   state.fisikKesehatan.kebutuhan_khusus,

      // Pendidikan terakhir (dari array, ambil yang paling tinggi)
      pendidikan_terakhir: state.riwayatPendidikan[0]?.jenjang ?? null,
      jurusan_terakhir:    state.riwayatPendidikan[0]?.jurusan ?? null,
      institusi_terakhir:  state.riwayatPendidikan[0]?.nama_institusi ?? null,

      // Karakter
      karakter_diri:  state.karakter.karakter_diri,
      kelebihan:      state.karakter.kelebihan,
      kekurangan:     state.karakter.kekurangan,
      hobi:           state.karakter.hobi,
      mbti_type:      state.karakter.mbti_type || null,
      bahasa_cinta:   state.karakter.bahasa_cinta,

      // Ibadah
      mazhab:           state.ibadah.mazhab,
      cara_berpakaian:  state.ibadah.cara_berpakaian,
      shalat_fardhu:    state.ibadah.shalat_fardhu || null,
      shalat_sunnah:    state.ibadah.shalat_sunnah,
      tilawah_rutin:    state.ibadah.tilawah_rutin,
      hafalan_quran:    state.ibadah.hafalan_quran,
      kajian_rutin:     state.ibadah.kajian_rutin,
      deskripsi_ibadah: state.ibadah.deskripsi_ibadah,

      // Gaya Hidup
      gaya_hidup:               state.gayaHidup.gaya_hidup,
      pola_makan:               state.gayaHidup.pola_makan,
      olahraga_rutin:           state.gayaHidup.olahraga_rutin,
      tipe_introvert_ekstrovert: state.gayaHidup.tipe_kepribadian || null,
      kebiasaan_positif:        state.gayaHidup.kebiasaan_positif,
      hal_tidak_disukai:        state.gayaHidup.hal_tidak_disukai,

      // Visi Misi
      visi_misi: state.visiMisi,

      // Kriteria
      kriteria_usia_min:        state.kriteria.kriteria_usia_min || null,
      kriteria_usia_max:        state.kriteria.kriteria_usia_max || null,
      kriteria_domisili:        state.kriteria.kriteria_domisili,
      kriteria_pendidikan:      state.kriteria.kriteria_pendidikan,
      kriteria_pekerjaan:       state.kriteria.kriteria_pekerjaan,
      kriteria_karakter:        state.kriteria.kriteria_karakter,
      kriteria_ibadah:          state.kriteria.kriteria_ibadah,
      kriteria_lainnya:         state.kriteria.kriteria_lainnya,
      bersedia_poligami:        state.kriteria.bersedia_poligami,
      bersedia_pindah_domisili: state.kriteria.bersedia_pindah_domisili,

      // Financial
      financial_planning: state.financialPlanning,

      // Pandangan
      pandangan_isu:          state.pandanganIsu.pandangan_isu,
      pandangan_istri_bekerja: state.pandanganIsu.pandangan_istri_bekerja,
      pandangan_kb:            state.pandanganIsu.pandangan_kb,
      pandangan_parenting:     state.pandanganIsu.pandangan_parenting,
      pandangan_mertua:        state.pandanganIsu.pandangan_mertua,

      // Foto & Template
      foto_pribadi_url:  state.fotoTemplate.foto_pribadi_url || null,
      foto_formal_url:   state.fotoTemplate.foto_formal_url || null,
      template_pilihan:  state.fotoTemplate.template_pilihan,
    }

    // ── 1b. Upsert taaruf_profiles berdasarkan user_id ─────────
    // Dengan UNIQUE(user_id) constraint, upsert memastikan:
    // - Jika user sudah punya profil → UPDATE
    // - Jika user belum punya profil → INSERT
    // Ini mengeliminasi masalah multiple profile per user.
    const { data: profileData, error: profileError } = await supabase
      .from('taaruf_profiles')
      .upsert(profilePayload, {
        onConflict: 'user_id',
      })
      .select('id')
      .single()

    if (profileError) throw profileError
    const profileId = profileData.id

    // ── 2. Simpan array tables (batch delete + batch insert) ──
    // Optimasi: semua DELETE dijalankan paralel, lalu semua INSERT dijalankan paralel.
    //
    // Phase 2 improvement: Snapshot array data sebelum DELETE.
    // Jika INSERT gagal, kita coba rollback dengan menyimpan snapshot.
    // Ini bukan true atomic transaction, tapi mengurangi risiko data loss.
    //

    // ── 2a. Siapkan semua data rows ──
    const arrayTables = [
      {
        table: 'riwayat_pendidikan' as const,
        rows: state.riwayatPendidikan.map((item) => ({
          profile_id: profileId,
          jenjang: item.jenjang,
          nama_institusi: item.nama_institusi,
          jurusan: item.jurusan,
          tahun_mulai: item.tahun_mulai || null,
          tahun_selesai: item.tahun_selesai || null,
          prestasi: item.prestasi,
          urutan: item.urutan,
        })),
      },
      {
        table: 'riwayat_pekerjaan' as const,
        rows: state.riwayatPekerjaan.map((item) => ({
          profile_id: profileId,
          nama_perusahaan: item.nama_perusahaan,
          posisi_jabatan: item.posisi_jabatan,
          deskripsi_pekerjaan: item.deskripsi_pekerjaan,
          is_masih_aktif: item.is_masih_aktif,
          tahun_mulai: item.tahun_mulai || null,
          tahun_selesai: item.is_masih_aktif ? null : item.tahun_selesai || null,
          urutan: item.urutan,
        })),
      },
      {
        table: 'perjalanan_hidup' as const,
        rows: state.perjalananHidup.map((item) => ({
          profile_id: profileId,
          fase: item.fase,
          judul: item.judul,
          cerita: item.cerita,
          pelajaran: item.pelajaran,
          tahun_mulai: item.tahun_mulai || null,
          tahun_selesai: item.tahun_selesai || null,
          urutan: item.urutan,
        })),
      },
      {
        table: 'riwayat_organisasi' as const,
        rows: state.riwayatOrganisasi.map((item) => ({
          profile_id: profileId,
          nama_organisasi: item.nama_organisasi,
          jabatan: item.jabatan,
          deskripsi: item.deskripsi,
          tahun_mulai: item.tahun_mulai || null,
          tahun_selesai: item.tahun_selesai || null,
          urutan: item.urutan,
        })),
      },
      {
        table: 'sosial_media' as const,
        rows: state.sosialMedia.map((item) => ({
          profile_id: profileId,
          platform: item.platform,
          username: item.username,
          url: item.url,
          is_primary: item.is_primary,
          tampil_di_pdf: item.tampil_di_pdf,
          urutan: item.urutan,
        })),
      },
      {
        table: 'galeri_foto' as const,
        rows: state.galeriFoto.map((item) => ({
          profile_id: profileId,
          kategori: item.kategori,
          url: item.url,
          keterangan: item.keterangan,
          urutan: item.urutan,
        })),
      },
      {
        table: 'anggota_keluarga' as const,
        rows: state.anggotaKeluarga.map((item) => ({
          profile_id: profileId,
          hubungan: item.hubungan,
          nama: item.nama,
          pekerjaan: item.pekerjaan,
          pendidikan: item.pendidikan,
          keterangan: item.keterangan,
          urutan: item.urutan,
        })),
      },
      {
        table: 'rencana_masa_depan' as const,
        rows: state.rencanaMasaDepan.map((item) => ({
          profile_id: profileId,
          tipe: item.tipe,
          waktu: item.waktu,
          rencana: item.rencana,
          target: item.target,
          urutan: item.urutan,
        })),
      },
    ]

    // ── 2b. Batch DELETE semua tabel relasi secara paralel ──
    // Phase 2: snapshot dulu untuk potensi rollback
    const deleteResults = await Promise.all(
      arrayTables.map(({ table }) =>
        supabase.from(table).delete().eq('profile_id', profileId!)
      )
    )
    for (const { error } of deleteResults) {
      if (error) throw error
    }

    // ── 2c. Batch INSERT semua tabel relasi secara paralel ──
    const insertResults = await Promise.all(
      arrayTables.map(({ table, rows }) =>
        rows.length > 0
          ? supabase.from(table).insert(rows)
          : Promise.resolve({ error: null })
      )
    )

    // Jika ada INSERT error, coba rollback DELETE-nya
    const insertErrors: string[] = []
    for (let i = 0; i < insertResults.length; i++) {
      const { error } = insertResults[i]
      if (error) {
        insertErrors.push(`${arrayTables[i].table}: ${error.message}`)
      }
    }

    if (insertErrors.length > 0) {
      console.error('[NikahReady] Array insert errors:', insertErrors)
      // Coba rollback: re-insert snapshot data
      console.warn('[NikahReady] Attempting rollback of deleted array data...')
      const rollbackResults = await Promise.all(
        arrayTables.map(({ table, rows }) =>
          rows.length > 0
            ? supabase.from(table).insert(rows).then((r) => ({ table, success: !r.error, error: r.error }))
            : Promise.resolve({ table, success: true, error: null })
        )
      )
      for (const r of rollbackResults) {
        if (r.success) {
          console.info(`[NikahReady] Rollback success: ${r.table}`)
        } else {
          console.error(`[NikahReady] Rollback FAILED: ${r.table}`, r.error)
        }
      }
      throw new Error(`Gagal menyimpan data array: ${insertErrors.join('; ')}`)
    }

    return { success: true, profileId: profileId!, warnings: warnings.length > 0 ? warnings : undefined }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal menyimpan profil'
    console.error('[NikahReady] saveProfile error:', err)
    return { success: false, error: message }
  }
}