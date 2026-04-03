// ============================================================
// src/lib/loadProfilePublic.ts
//
// Fetch profile data untuk halaman publik /cv/[shareId].
// Menggunakan anon key — tidak butuh auth.
// RLS memastikan hanya published profiles yang bisa dibaca.
// ============================================================

import { createClient } from '@/lib/supabase/client'
import type { FormState } from '@/types'
import { INITIAL_FORM_STATE } from '@/lib/constants'

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

  // 1. Fetch main profile
  const { data: profile, error: profileError } = await supabase
    .from('taaruf_profiles')
    .select('id')
    .eq('share_id', shareId)
    .eq('is_published', true)
    .single()

  if (profileError || !profile) {
    return {
      success: false,
      error: 'CV tidak ditemukan atau sudah tidak dipublikasikan.',
    }
  }

  const profileId = profile.id

  // 2. Fetch all profile data (scalar fields)
  const { data: fullProfile, error: fullError } = await supabase
    .from('taaruf_profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (fullError || !fullProfile) {
    return { success: false, error: 'Gagal memuat data profil.' }
  }

  // 3. Fetch all related tables in parallel
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

  // 4. Map to FormState
  const state: FormState = {
    ...INITIAL_FORM_STATE,

    // Step 1: Data Pribadi
    dataPribadi: {
      nama_lengkap: fullProfile.nama_lengkap || '',
      nama_panggilan: fullProfile.nama_panggilan || '',
      tempat_lahir: fullProfile.tempat_lahir || '',
      tanggal_lahir: fullProfile.tanggal_lahir || '',
      kewarganegaraan: fullProfile.kewarganegaraan || 'Indonesia',
      suku_bangsa: fullProfile.suku_bangsa || '',
      domisili_kota: fullProfile.domisili_kota || '',
      domisili_provinsi: fullProfile.domisili_provinsi || '',
      status_pernikahan: fullProfile.status_pernikahan || '',
      jumlah_anak: fullProfile.jumlah_anak || 0,
    },

    // Step 2: Fisik & Kesehatan
    fisikKesehatan: {
      tinggi_badan: fullProfile.tinggi_badan?.toString() || '',
      berat_badan: fullProfile.berat_badan?.toString() || '',
      golongan_darah: fullProfile.golongan_darah || '',
      warna_kulit: fullProfile.warna_kulit || '',
      kondisi_kesehatan: fullProfile.kondisi_kesehatan || '',
      riwayat_penyakit: fullProfile.riwayat_penyakit || '',
      kebutuhan_khusus: fullProfile.kebutuhan_khusus || '',
    },

    // Step 3: Karakter & Kepribadian
    karakter: {
      karakter_diri: fullProfile.karakter_diri || '',
      kelebihan: Array.isArray(fullProfile.kelebihan) ? fullProfile.kelebihan : [],
      kekurangan: Array.isArray(fullProfile.kekurangan) ? fullProfile.kekurangan : [],
      hobi: Array.isArray(fullProfile.hobi) ? fullProfile.hobi : [],
      mbti_type: fullProfile.mbti_type || '',
      bahasa_cinta: fullProfile.bahasa_cinta || '',
    },

    // Step 4: Ibadah & Keislaman
    ibadah: {
      mazhab: fullProfile.mazhab || '',
      cara_berpakaian: fullProfile.cara_berpakaian || '',
      shalat_fardhu: fullProfile.shalat_fardhu || '',
      shalat_sunnah: fullProfile.shalat_sunnah || '',
      tilawah_rutin: fullProfile.tilawah_rutin || false,
      hafalan_quran: fullProfile.hafalan_quran || '',
      kajian_rutin: fullProfile.kajian_rutin || false,
      deskripsi_ibadah: fullProfile.deskripsi_ibadah || '',
    },

    // Step 5: Gaya Hidup
    gayaHidup: {
      gaya_hidup: fullProfile.gaya_hidup || '',
      pola_makan: fullProfile.pola_makan || '',
      olahraga_rutin: fullProfile.olahraga_rutin || false,
      tipe_kepribadian: fullProfile.tipe_introvert_ekstrovert || '',
      kebiasaan_positif: fullProfile.kebiasaan_positif || '',
      hal_tidak_disukai: fullProfile.hal_tidak_disukai || '',
    },

    // Step 6: Visi & Misi
    visiMisi: (() => {
      const vm = fullProfile.visi_misi
      if (!vm || typeof vm !== 'object') {
        return { visi: '', misi_suami: '', misi_istri: '', tujuan_pernikahan: [] }
      }
      return {
        visi: vm.visi || '',
        misi_suami: vm.misi_suami || '',
        misi_istri: vm.misi_istri || '',
        tujuan_pernikahan: Array.isArray(vm.tujuan_pernikahan) ? vm.tujuan_pernikahan : [],
      }
    })(),

    // Step 7: Kriteria
    kriteria: {
      kriteria_usia_min: fullProfile.kriteria_usia_min?.toString() || '',
      kriteria_usia_max: fullProfile.kriteria_usia_max?.toString() || '',
      kriteria_domisili: fullProfile.kriteria_domisili || '',
      kriteria_pendidikan: fullProfile.kriteria_pendidikan || '',
      kriteria_pekerjaan: fullProfile.kriteria_pekerjaan || '',
      kriteria_karakter: fullProfile.kriteria_karakter || '',
      kriteria_ibadah: fullProfile.kriteria_ibadah || '',
      kriteria_lainnya: fullProfile.kriteria_lainnya || '',
      bersedia_poligami: fullProfile.bersedia_poligami ?? null,
      bersedia_pindah_domisili: fullProfile.bersedia_pindah_domisili ?? null,
    },

    // Step 8: Financial Planning
    financialPlanning: (() => {
      const fp = fullProfile.financial_planning
      if (!fp || typeof fp !== 'object') {
        return {
          penghasilan_range: '',
          kebutuhan_pokok_persen: 45,
          tabungan_persen: 25,
          investasi_persen: 15,
          sedekah_persen: 10,
          lainnya_persen: 5,
          deskripsi: '',
        }
      }
      return {
        penghasilan_range: fp.penghasilan_range || fp.penghasilan_bulanan || '',
        kebutuhan_pokok_persen: fp.kebutuhan_pokok_persen || 45,
        tabungan_persen: fp.tabungan_persen || 25,
        investasi_persen: fp.investasi_persen || 15,
        sedekah_persen: fp.sedekah_persen || 10,
        lainnya_persen: fp.lainnya_persen || 5,
        deskripsi: fp.deskripsi || '',
      }
    })(),

    // Step 9: Pandangan Isu
    pandanganIsu: {
      pandangan_isu: fullProfile.pandangan_isu || '',
      pandangan_istri_bekerja: fullProfile.pandangan_istri_bekerja || '',
      pandangan_kb: fullProfile.pandangan_kb || '',
      pandangan_parenting: fullProfile.pandangan_parenting || '',
      pandangan_mertua: fullProfile.pandangan_mertua || '',
    },

    // Step 10: Foto & Template
    fotoTemplate: {
      foto_pribadi_url: fullProfile.foto_pribadi_url || '',
      foto_formal_url: fullProfile.foto_formal_url || '',
      template_pilihan: fullProfile.template_pilihan || 'ringkas',
    },

    // Array sections
    riwayatPendidikan: (riwayatPendidikan || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  jenjang: r.jenjang as string,
  nama_institusi: r.nama_institusi as string,
  jurusan: (r.jurusan as string) || '',
  tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
  tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
  prestasi: (r.prestasi as string) || '',
  urutan: r.urutan as number,
})),

    riwayatPekerjaan: (riwayatPekerjaan || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  nama_perusahaan: r.nama_perusahaan as string,
  posisi_jabatan: r.posisi_jabatan as string,
  deskripsi_pekerjaan: (r.deskripsi_pekerjaan as string) || '',
  is_masih_aktif: r.is_masih_aktif as boolean,
  tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
  tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
  urutan: r.urutan as number,
})),

    perjalananHidup: (perjalananHidup || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  fase: r.fase as import('@/types').FaseHidup,
  judul: r.judul as string,
  cerita: (r.cerita as string) || '',
  pelajaran: (r.pelajaran as string) || '',
  tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
  tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
  urutan: r.urutan as number,
})),

    riwayatOrganisasi: (riwayatOrganisasi || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  nama_organisasi: r.nama_organisasi as string,
  jabatan: (r.jabatan as string) || '',
  deskripsi: (r.deskripsi as string) || '',
  tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
  tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
  urutan: r.urutan as number,
})),

sosialMedia: (sosialMedia || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  platform: r.platform as import('@/types').PlatformSosmed,
  username: r.username as string,
  url: (r.url as string) || '',
  is_primary: r.is_primary as boolean,
  tampil_di_pdf: r.tampil_di_pdf as boolean,
  urutan: r.urutan as number,
})),

    galeriFoto: (galeriFoto || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  kategori: r.kategori as import('@/types').KategoriGaleri,
  url: r.url as string,
  keterangan: (r.keterangan as string) || '',
  urutan: r.urutan as number,
})),

anggotaKeluarga: (anggotaKeluarga || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  hubungan: r.hubungan as import('@/types').HubunganKeluarga,
  nama: r.nama as string,
  pekerjaan: (r.pekerjaan as string) || '',
  pendidikan: (r.pendidikan as string) || '',
  keterangan: (r.keterangan as string) || '',
  urutan: r.urutan as number,
})),    

    rencanaMasaDepan: (rencanaMasaDepan || []).map((r: Record<string, unknown>) => ({
  id: r.id as string,
  tipe: r.tipe as import('@/types').TipeRencana,
  waktu: (r.waktu as string) || '',
  rencana: r.rencana as string,
  target: (r.target as string) || '',
  urutan: r.urutan as number,
})),

    // Metadata
    profileId: profileId,
    plan: fullProfile.user_plan || 'free', // Not relevant for public view
  }

  return { success: true, state }
}