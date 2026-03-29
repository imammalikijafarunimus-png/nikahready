// ============================================================
// src/lib/supabase/saveProfile.ts
// Utility: simpan seluruh FormState ke Supabase
// Strategi array: DELETE lama → INSERT baru (simpler than diff)
// ============================================================

import type { FormState } from '@/types'
import { createClient } from './client'

export interface SaveResult {
  success: boolean
  profileId?: string
  error?: string
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

    // Jika profileId ada → update, jika tidak → insert
    let profileId = state.profileId

    if (profileId) {
      const { error } = await supabase
        .from('taaruf_profiles')
        .update(profilePayload)
        .eq('id', profileId)
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('taaruf_profiles')
        .insert(profilePayload)
        .select('id')
        .single()
      if (error) throw error
      profileId = data.id
    }

    // ── 2. Simpan array tables (delete-then-insert) ────────
    // Helper: delete all by profile_id, then insert new rows
    async function replaceArray<T extends object>(
      tableName: string,
      rows: T[]
    ) {
      // Hapus semua data lama
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('profile_id', profileId!)
      if (deleteError) throw deleteError

      // Insert data baru jika ada
      if (rows.length > 0) {
        const { error: insertError } = await supabase
          .from(tableName)
          .insert(rows)
        if (insertError) throw insertError
      }
    }

    // Riwayat Pendidikan
    await replaceArray(
      'riwayat_pendidikan',
      state.riwayatPendidikan.map((item) => ({
        profile_id:     profileId,
        jenjang:        item.jenjang,
        nama_institusi: item.nama_institusi,
        jurusan:        item.jurusan,
        tahun_mulai:    item.tahun_mulai || null,
        tahun_selesai:  item.tahun_selesai || null,
        prestasi:       item.prestasi,
        urutan:         item.urutan,
      }))
    )

    // Riwayat Pekerjaan
    await replaceArray(
      'riwayat_pekerjaan',
      state.riwayatPekerjaan.map((item) => ({
        profile_id:          profileId,
        nama_perusahaan:     item.nama_perusahaan,
        posisi_jabatan:      item.posisi_jabatan,
        deskripsi_pekerjaan: item.deskripsi_pekerjaan,
        is_masih_aktif:      item.is_masih_aktif,
        tahun_mulai:         item.tahun_mulai || null,
        tahun_selesai:       item.is_masih_aktif ? null : item.tahun_selesai || null,
        urutan:              item.urutan,
      }))
    )

    // Perjalanan Hidup
    await replaceArray(
      'perjalanan_hidup',
      state.perjalananHidup.map((item) => ({
        profile_id:   profileId,
        fase:         item.fase,
        judul:        item.judul,
        cerita:       item.cerita,
        pelajaran:    item.pelajaran,
        tahun_mulai:  item.tahun_mulai || null,
        tahun_selesai: item.tahun_selesai || null,
        urutan:       item.urutan,
      }))
    )

    // Riwayat Organisasi
    await replaceArray(
      'riwayat_organisasi',
      state.riwayatOrganisasi.map((item) => ({
        profile_id:       profileId,
        nama_organisasi:  item.nama_organisasi,
        jabatan:          item.jabatan,
        deskripsi:        item.deskripsi,
        tahun_mulai:      item.tahun_mulai || null,
        tahun_selesai:    item.tahun_selesai || null,
        urutan:           item.urutan,
      }))
    )

    // Sosial Media
    await replaceArray(
      'sosial_media',
      state.sosialMedia.map((item) => ({
        profile_id:   profileId,
        platform:     item.platform,
        username:     item.username,
        url:          item.url,
        is_primary:   item.is_primary,
        tampil_di_pdf: item.tampil_di_pdf,
      }))
    )

    // Anggota Keluarga
    await replaceArray(
      'anggota_keluarga',
      state.anggotaKeluarga.map((item) => ({
        profile_id:  profileId,
        hubungan:    item.hubungan,
        nama:        item.nama,
        pekerjaan:   item.pekerjaan,
        pendidikan:  item.pendidikan,
        keterangan:  item.keterangan,
        urutan:      item.urutan,
      }))
    )

    // Rencana Masa Depan
    await replaceArray(
      'rencana_masa_depan',
      state.rencanaMasaDepan.map((item) => ({
        profile_id: profileId,
        tipe:       item.tipe,
        waktu:      item.waktu,
        rencana:    item.rencana,
        target:     item.target,
        urutan:     item.urutan,
      }))
    )

    return { success: true, profileId: profileId! }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal menyimpan profil'
    console.error('[TaarufCV] saveProfile error:', err)
    return { success: false, error: message }
  }
}
