// ============================================================
// src/lib/supabase/loadProfile.ts
// Utility: Load existing profile from Supabase into FormState
//
// Dipanggil setelah user login untuk mengembalikan draft
// yang tersimpan di Supabase ke dalam form context.
// ============================================================

import type { FormState } from '@/types'
import { createClient } from './client'

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
      .maybeSingle() // Gunakan maybeSingle — mungkin belum ada profil

    if (profileError) throw profileError

    // Jika belum ada profil, kembalikan kosong
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

    // Throw on any error
    if (pendidikanRes.error) throw pendidikanRes.error
    if (pekerjaanRes.error) throw pekerjaanRes.error
    if (perjalananRes.error) throw perjalananRes.error
    if (organisasiRes.error) throw organisasiRes.error
    if (sosmedRes.error) throw sosmedRes.error
    if (galeriRes.error) throw galeriRes.error
    if (keluargaRes.error) throw keluargaRes.error
    if (rencanaRes.error) throw rencanaRes.error

    // ── 3. Build FormState partial ──────────────────────────
    const formState: Partial<FormState> = {
      profileId,

      // Scalar sections
      dataPribadi: {
        nama_lengkap: profile.nama_lengkap ?? '',
        nama_panggilan: profile.nama_panggilan ?? '',
        tempat_lahir: profile.tempat_lahir ?? '',
        tanggal_lahir: profile.tanggal_lahir ?? '',
        kewarganegaraan: profile.kewarganegaraan ?? 'Indonesia',
        suku_bangsa: profile.suku_bangsa ?? '',
        domisili_kota: profile.domisili_kota ?? '',
        domisili_provinsi: profile.domisili_provinsi ?? '',
        status_pernikahan: profile.status_pernikahan ?? '',
        jumlah_anak: profile.jumlah_anak ?? 0,
      },

      fisikKesehatan: {
        tinggi_badan: profile.tinggi_badan ?? '',
        berat_badan: profile.berat_badan ?? '',
        golongan_darah: profile.golongan_darah ?? '',
        warna_kulit: profile.warna_kulit ?? '',
        kondisi_kesehatan: profile.kondisi_kesehatan ?? '',
        riwayat_penyakit: profile.riwayat_penyakit ?? '',
        kebutuhan_khusus: profile.kebutuhan_khusus ?? '',
      },

      karakter: {
        karakter_diri: profile.karakter_diri ?? '',
        kelebihan: Array.isArray(profile.kelebihan) ? profile.kelebihan : [],
        kekurangan: Array.isArray(profile.kekurangan) ? profile.kekurangan : [],
        hobi: Array.isArray(profile.hobi) ? profile.hobi : [],
        mbti_type: profile.mbti_type ?? '',
        bahasa_cinta: profile.bahasa_cinta ?? '',
      },

      ibadah: {
        mazhab: profile.mazhab ?? '',
        cara_berpakaian: profile.cara_berpakaian ?? '',
        shalat_fardhu: profile.shalat_fardhu ?? '',
        shalat_sunnah: profile.shalat_sunnah ?? '',
        tilawah_rutin: profile.tilawah_rutin ?? false,
        hafalan_quran: profile.hafalan_quran ?? '',
        kajian_rutin: profile.kajian_rutin ?? false,
        deskripsi_ibadah: profile.deskripsi_ibadah ?? '',
      },

      gayaHidup: {
        gaya_hidup: profile.gaya_hidup ?? '',
        pola_makan: profile.pola_makan ?? '',
        olahraga_rutin: profile.olahraga_rutin ?? false,
        tipe_kepribadian: profile.tipe_introvert_ekstrovert ?? '',
        kebiasaan_positif: profile.kebiasaan_positif ?? '',
        hal_tidak_disukai: profile.hal_tidak_disukai ?? '',
      },

      visiMisi: {
        ...(typeof profile.visi_misi === 'object' && profile.visi_misi
          ? profile.visi_misi
          : { visi: '', misi_suami: '', misi_istri: '', tujuan_pernikahan: [] }),
      },

      kriteria: {
        kriteria_usia_min: profile.kriteria_usia_min ?? '',
        kriteria_usia_max: profile.kriteria_usia_max ?? '',
        kriteria_domisili: profile.kriteria_domisili ?? '',
        kriteria_pendidikan: profile.kriteria_pendidikan ?? '',
        kriteria_pekerjaan: profile.kriteria_pekerjaan ?? '',
        kriteria_karakter: profile.kriteria_karakter ?? '',
        kriteria_ibadah: profile.kriteria_ibadah ?? '',
        kriteria_lainnya: profile.kriteria_lainnya ?? '',
        bersedia_poligami: profile.bersedia_poligami ?? null,
        bersedia_pindah_domisili: profile.bersedia_pindah_domisili ?? null,
      },

      financialPlanning: {
        ...(typeof profile.financial_planning === 'object' && profile.financial_planning
          ? profile.financial_planning
          : {
              penghasilan_range: '',
              kebutuhan_pokok_persen: 45,
              tabungan_persen: 25,
              investasi_persen: 15,
              sedekah_persen: 10,
              lainnya_persen: 5,
              deskripsi: '',
            }),
      },

      pandanganIsu: {
        pandangan_isu: profile.pandangan_isu ?? '',
        pandangan_istri_bekerja: profile.pandangan_istri_bekerja ?? '',
        pandangan_kb: profile.pandangan_kb ?? '',
        pandangan_parenting: profile.pandangan_parenting ?? '',
        pandangan_mertua: profile.pandangan_mertua ?? '',
      },

      fotoTemplate: {
        foto_pribadi_url: profile.foto_pribadi_url ?? '',
        foto_formal_url: profile.foto_formal_url ?? '',
        template_pilihan: profile.template_pilihan ?? 'akademik',
      },

      // Array sections — map Supabase rows to form items
      riwayatPendidikan: pendidikanRes.data.map((r) => ({
        id: r.id,
        jenjang: r.jenjang,
        nama_institusi: r.nama_institusi,
        jurusan: r.jurusan ?? '',
        tahun_mulai: r.tahun_mulai ?? '',
        tahun_selesai: r.tahun_selesai ?? '',
        prestasi: r.prestasi ?? '',
        urutan: r.urutan,
      })),

      riwayatPekerjaan: pekerjaanRes.data.map((r) => ({
        id: r.id,
        nama_perusahaan: r.nama_perusahaan,
        posisi_jabatan: r.posisi_jabatan,
        deskripsi_pekerjaan: r.deskripsi_pekerjaan ?? '',
        is_masih_aktif: r.is_masih_aktif,
        tahun_mulai: r.tahun_mulai ?? '',
        tahun_selesai: r.tahun_selesai ?? '',
        urutan: r.urutan,
      })),

      perjalananHidup: perjalananRes.data.map((r) => ({
        id: r.id,
        fase: r.fase,
        judul: r.judul,
        cerita: r.cerita ?? '',
        pelajaran: r.pelajaran ?? '',
        tahun_mulai: r.tahun_mulai ?? '',
        tahun_selesai: r.tahun_selesai ?? '',
        urutan: r.urutan,
      })),

      riwayatOrganisasi: organisasiRes.data.map((r) => ({
        id: r.id,
        nama_organisasi: r.nama_organisasi,
        jabatan: r.jabatan ?? '',
        deskripsi: r.deskripsi ?? '',
        tahun_mulai: r.tahun_mulai ?? '',
        tahun_selesai: r.tahun_selesai ?? '',
        urutan: r.urutan,
      })),

      sosialMedia: sosmedRes.data.map((r) => ({
        id: r.id,
        platform: r.platform,
        username: r.username,
        url: r.url,
        is_primary: r.is_primary,
        tampil_di_pdf: r.tampil_di_pdf,
        urutan: r.urutan,
      })),

      galeriFoto: galeriRes.data.map((r) => ({
        id: r.id,
        kategori: r.kategori,
        url: r.url,
        keterangan: r.keterangan ?? '',
        urutan: r.urutan,
      })),

      anggotaKeluarga: keluargaRes.data.map((r) => ({
        id: r.id,
        hubungan: r.hubungan,
        nama: r.nama,
        pekerjaan: r.pekerjaan ?? '',
        pendidikan: r.pendidikan ?? '',
        keterangan: r.keterangan ?? '',
        urutan: r.urutan,
      })),

      rencanaMasaDepan: rencanaRes.data.map((r) => ({
        id: r.id,
        tipe: r.tipe,
        waktu: r.waktu ?? '',
        rencana: r.rencana,
        target: r.target ?? '',
        urutan: r.urutan,
      })),
    }

    return {
      success: true,
      profileId,
      profile: formState,
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal memuat profil'
    console.error('[NikahReady] loadProfile error:', err)
    return { success: false, error: message }
  }
}