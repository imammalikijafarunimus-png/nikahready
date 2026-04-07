// ============================================================
// src/lib/mappers/profileToFormState.ts
// Fase 4.1 — Shared mapper: Supabase profile row → FormState
//
// Mengeliminasi duplikasi mapping logic yang sebelumnya ada di:
// - loadProfile.ts (authenticated)
// - loadProfilePublic.ts (public)
//
// Kedua file tersebut sekarang mengimpor mapper ini
// dan hanya menangani fetch logic yang berbeda.
// ============================================================

import type {
  FormState,
  FaseHidup,
  PlatformSosmed,
  KategoriGaleri,
  HubunganKeluarga,
  TipeRencana,
  RiwayatPendidikanItem,
  RiwayatPekerjaanItem,
  PerjalananHidupItem,
  RiwayatOrganisasiItem,
  SosialMediaItem,
  GaleriFotoItem,
  AnggotaKeluargaItem,
  RencanaMasaDepanItem,
} from '@/types'

/** Tipe untuk row dari tabel taaruf_profiles di Supabase */
export interface SupabaseProfileRow {
  id: string
  user_id: string
  share_id?: string
  is_published?: boolean
  user_plan?: string

  // Data Pribadi
  nama_lengkap?: string | null
  nama_panggilan?: string | null
  tempat_lahir?: string | null
  tanggal_lahir?: string | null
  kewarganegaraan?: string | null
  suku_bangsa?: string | null
  domisili_kota?: string | null
  domisili_provinsi?: string | null
  status_pernikahan?: string | null
  jumlah_anak?: number | null

  // Fisik & Kesehatan
  tinggi_badan?: number | string | null
  berat_badan?: number | string | null
  golongan_darah?: string | null
  warna_kulit?: string | null
  kondisi_kesehatan?: string | null
  riwayat_penyakit?: string | null
  kebutuhan_khusus?: string | null

  // Karakter
  karakter_diri?: string | null
  kelebihan?: unknown
  kekurangan?: unknown
  hobi?: unknown
  mbti_type?: string | null
  bahasa_cinta?: string | null

  // Ibadah
  mazhab?: string | null
  cara_berpakaian?: string | null
  shalat_fardhu?: string | null
  shalat_sunnah?: string | null
  tilawah_rutin?: boolean | null
  hafalan_quran?: string | null
  kajian_rutin?: boolean | null
  deskripsi_ibadah?: string | null

  // Gaya Hidup
  gaya_hidup?: string | null
  pola_makan?: string | null
  olahraga_rutin?: boolean | null
  tipe_introvert_ekstrovert?: string | null
  kebiasaan_positif?: string | null
  hal_tidak_disukai?: string | null

  // Visi Misi
  visi_misi?: unknown

  // Kriteria
  kriteria_usia_min?: number | string | null
  kriteria_usia_max?: number | string | null
  kriteria_domisili?: string | null
  kriteria_pendidikan?: string | null
  kriteria_pekerjaan?: string | null
  kriteria_karakter?: string | null
  kriteria_ibadah?: string | null
  kriteria_lainnya?: string | null
  bersedia_poligami?: boolean | null
  bersedia_pindah_domisili?: boolean | null

  // Financial
  financial_planning?: unknown

  // Pandangan
  pandangan_isu?: string | null
  pandangan_istri_bekerja?: string | null
  pandangan_kb?: string | null
  pandangan_parenting?: string | null
  pandangan_mertua?: string | null

  // Foto & Template
  foto_pribadi_url?: string | null
  foto_formal_url?: string | null
  template_pilihan?: string | null

  // Pendidikan terakhir (computed)
  pendidikan_terakhir?: string | null
  jurusan_terakhir?: string | null
  institusi_terakhir?: string | null
}

// ── Helper: safe array cast ────────────────────────────────
function safeArray(val: unknown): string[] {
  return Array.isArray(val) ? val : []
}

// ── Helper: safe number/string coalesce ────────────────────
function str(val: unknown, fallback = ''): string {
  if (val === null || val === undefined) return fallback
  return String(val)
}

function numStr(val: unknown, fallback: number | '' = ''): number | '' {
  if (val === null || val === undefined || val === '') return fallback
  const n = Number(val)
  return isNaN(n) ? fallback : n
}

// ── Visi Misi parser ───────────────────────────────────────
// ✅ SESUDAH — field required, sudah di-handle oleh parseVisiMisi()
interface VisiMisiData {
  visi: string
  misi_suami: string
  misi_istri: string
  tujuan_pernikahan: string[]
}

function parseVisiMisi(raw: unknown): VisiMisiData {
  if (!raw || typeof raw !== 'object') {
    return { visi: '', misi_suami: '', misi_istri: '', tujuan_pernikahan: [] }
  }
  const obj = raw as VisiMisiData
  return {
    visi: obj.visi || '',
    misi_suami: obj.misi_suami || '',
    misi_istri: obj.misi_istri || '',
    tujuan_pernikahan: Array.isArray(obj.tujuan_pernikahan) ? obj.tujuan_pernikahan : [],
  }
}

// ── Financial Planning parser ──────────────────────────────
interface FinancialPlanningData {
  penghasilan_range?: string
  penghasilan_bulanan?: string
  kebutuhan_pokok_persen?: number
  tabungan_persen?: number
  investasi_persen?: number
  sedekah_persen?: number
  lainnya_persen?: number
  deskripsi?: string
}

function parseFinancialPlanning(raw: unknown): FinancialPlanningData {
  if (!raw || typeof raw !== 'object') {
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
  const obj = raw as FinancialPlanningData
  return {
    penghasilan_range: obj.penghasilan_range || obj.penghasilan_bulanan || '',
    kebutuhan_pokok_persen: obj.kebutuhan_pokok_persen || 45,
    tabungan_persen: obj.tabungan_persen || 25,
    investasi_persen: obj.investasi_persen || 15,
    sedekah_persen: obj.sedekah_persen || 10,
    lainnya_persen: obj.lainnya_persen || 5,
    deskripsi: obj.deskripsi || '',
  }
}

// ── Main Mapper: Supabase Profile → Partial<FormState> ─────
export function mapProfileToFormState(
  profile: SupabaseProfileRow,
  arrays: {
    riwayatPendidikan?: Record<string, unknown>[]
    riwayatPekerjaan?: Record<string, unknown>[]
    perjalananHidup?: Record<string, unknown>[]
    riwayatOrganisasi?: Record<string, unknown>[]
    sosialMedia?: Record<string, unknown>[]
    galeriFoto?: Record<string, unknown>[]
    anggotaKeluarga?: Record<string, unknown>[]
    rencanaMasaDepan?: Record<string, unknown>[]
  }
): Partial<FormState> {
  const vm = parseVisiMisi(profile.visi_misi)
  const fp = parseFinancialPlanning(profile.financial_planning)

  return {
    profileId: profile.id,

    // ── Scalar sections ────────────────────────────────────
    dataPribadi: {
      nama_lengkap: str(profile.nama_lengkap),
      nama_panggilan: str(profile.nama_panggilan),
      tempat_lahir: str(profile.tempat_lahir),
      tanggal_lahir: str(profile.tanggal_lahir),
      kewarganegaraan: str(profile.kewarganegaraan, 'Indonesia'),
      suku_bangsa: str(profile.suku_bangsa),
      domisili_kota: str(profile.domisili_kota),
      domisili_provinsi: str(profile.domisili_provinsi),
      status_pernikahan: str(profile.status_pernikahan) as FormState['dataPribadi']['status_pernikahan'],
      jumlah_anak: profile.jumlah_anak ?? 0,
    },

    fisikKesehatan: {
      tinggi_badan: numStr(profile.tinggi_badan),
      berat_badan: numStr(profile.berat_badan),
      golongan_darah: str(profile.golongan_darah) as FormState['fisikKesehatan']['golongan_darah'],
      warna_kulit: str(profile.warna_kulit),
      kondisi_kesehatan: str(profile.kondisi_kesehatan),
      riwayat_penyakit: str(profile.riwayat_penyakit),
      kebutuhan_khusus: str(profile.kebutuhan_khusus),
    },

    karakter: {
      karakter_diri: str(profile.karakter_diri),
      kelebihan: safeArray(profile.kelebihan),
      kekurangan: safeArray(profile.kekurangan),
      hobi: safeArray(profile.hobi),
      mbti_type: str(profile.mbti_type),
      bahasa_cinta: str(profile.bahasa_cinta),
    },

    ibadah: {
      mazhab: str(profile.mazhab),
      cara_berpakaian: str(profile.cara_berpakaian),
      shalat_fardhu: str(profile.shalat_fardhu) as FormState['ibadah']['shalat_fardhu'],
      shalat_sunnah: str(profile.shalat_sunnah),
      tilawah_rutin: profile.tilawah_rutin ?? false,
      hafalan_quran: str(profile.hafalan_quran),
      kajian_rutin: profile.kajian_rutin ?? false,
      deskripsi_ibadah: str(profile.deskripsi_ibadah),
    },

    gayaHidup: {
      gaya_hidup: str(profile.gaya_hidup),
      pola_makan: str(profile.pola_makan),
      olahraga_rutin: profile.olahraga_rutin ?? false,
      tipe_kepribadian: str(profile.tipe_introvert_ekstrovert) as FormState['gayaHidup']['tipe_kepribadian'],
      kebiasaan_positif: str(profile.kebiasaan_positif),
      hal_tidak_disukai: str(profile.hal_tidak_disukai),
    },

    // ✅ SESUDAH (langsung assign, tipe sudah aman)
    visiMisi: {
      visi: vm.visi,
      misi_suami: vm.misi_suami,
      misi_istri: vm.misi_istri,
      tujuan_pernikahan: vm.tujuan_pernikahan,
    },

    kriteria: {
      kriteria_usia_min: numStr(profile.kriteria_usia_min),
      kriteria_usia_max: numStr(profile.kriteria_usia_max),
      kriteria_domisili: str(profile.kriteria_domisili),
      kriteria_pendidikan: str(profile.kriteria_pendidikan),
      kriteria_pekerjaan: str(profile.kriteria_pekerjaan),
      kriteria_karakter: str(profile.kriteria_karakter),
      kriteria_ibadah: str(profile.kriteria_ibadah),
      kriteria_lainnya: str(profile.kriteria_lainnya),
      bersedia_poligami: profile.bersedia_poligami ?? null,
      bersedia_pindah_domisili: profile.bersedia_pindah_domisili ?? null,
    },

    financialPlanning: {
      penghasilan_range: fp.penghasilan_range as FormState['financialPlanning']['penghasilan_range'],
      kebutuhan_pokok_persen: fp.kebutuhan_pokok_persen ?? 0,
      tabungan_persen: fp.tabungan_persen ?? 0,
      investasi_persen: fp.investasi_persen ?? 0,
      sedekah_persen: fp.sedekah_persen ?? 0,
      lainnya_persen: fp.lainnya_persen ?? 0,
      deskripsi: fp.deskripsi ?? '',
    },

    pandanganIsu: {
      pandangan_isu: str(profile.pandangan_isu),
      pandangan_istri_bekerja: str(profile.pandangan_istri_bekerja),
      pandangan_kb: str(profile.pandangan_kb),
      pandangan_parenting: str(profile.pandangan_parenting),
      pandangan_mertua: str(profile.pandangan_mertua),
    },

    fotoTemplate: {
      foto_pribadi_url: str(profile.foto_pribadi_url),
      foto_formal_url: str(profile.foto_formal_url),
      template_pilihan: str(profile.template_pilihan, 'ringkas') as FormState['fotoTemplate']['template_pilihan'],
    },

    // ── Array sections ─────────────────────────────────────
    riwayatPendidikan: mapArray(arrays.riwayatPendidikan, mapPendidikan),
    riwayatPekerjaan: mapArray(arrays.riwayatPekerjaan, mapPekerjaan),
    perjalananHidup: mapArray(arrays.perjalananHidup, mapPerjalanan),
    riwayatOrganisasi: mapArray(arrays.riwayatOrganisasi, mapOrganisasi),
    sosialMedia: mapArray(arrays.sosialMedia, mapSosmed),
    galeriFoto: mapArray(arrays.galeriFoto, mapGaleri),
    anggotaKeluarga: mapArray(arrays.anggotaKeluarga, mapKeluarga),
    rencanaMasaDepan: mapArray(arrays.rencanaMasaDepan, mapRencana),
  }
}

// ── Array item mappers ─────────────────────────────────────
function mapArray<T>(
  data: Record<string, unknown>[] | undefined,
  mapper: (row: Record<string, unknown>) => T
): T[] {
  return (data || []).map(mapper)
}

function mapPendidikan(r: Record<string, unknown>): RiwayatPendidikanItem {
  return {
    id: r.id as string,
    jenjang: r.jenjang as string,
    nama_institusi: r.nama_institusi as string,
    jurusan: str(r.jurusan),
    tahun_mulai: numStr(r.tahun_mulai),
    tahun_selesai: numStr(r.tahun_selesai),
    prestasi: str(r.prestasi),
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapPekerjaan(r: Record<string, unknown>): RiwayatPekerjaanItem {
  return {
    id: r.id as string,
    nama_perusahaan: r.nama_perusahaan as string,
    posisi_jabatan: r.posisi_jabatan as string,
    deskripsi_pekerjaan: str(r.deskripsi_pekerjaan),
    is_masih_aktif: (r.is_masih_aktif as boolean) ?? false,
    tahun_mulai: numStr(r.tahun_mulai),
    tahun_selesai: numStr(r.tahun_selesai),
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapPerjalanan(r: Record<string, unknown>): PerjalananHidupItem {
  return {
    id: r.id as string,
    fase: r.fase as FaseHidup,
    judul: r.judul as string,
    cerita: str(r.cerita),
    pelajaran: str(r.pelajaran),
    tahun_mulai: numStr(r.tahun_mulai),
    tahun_selesai: numStr(r.tahun_selesai),
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapOrganisasi(r: Record<string, unknown>): RiwayatOrganisasiItem {
  return {
    id: r.id as string,
    nama_organisasi: r.nama_organisasi as string,
    jabatan: str(r.jabatan),
    deskripsi: str(r.deskripsi),
    tahun_mulai: numStr(r.tahun_mulai),
    tahun_selesai: numStr(r.tahun_selesai),
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapSosmed(r: Record<string, unknown>): SosialMediaItem {
  return {
    id: r.id as string,
    platform: r.platform as PlatformSosmed,
    username: r.username as string,
    url: str(r.url),
    is_primary: (r.is_primary as boolean) ?? false,
    tampil_di_pdf: (r.tampil_di_pdf as boolean) ?? false,
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapGaleri(r: Record<string, unknown>): GaleriFotoItem {
  return {
    id: r.id as string,
    kategori: r.kategori as KategoriGaleri,
    url: r.url as string,
    keterangan: str(r.keterangan),
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapKeluarga(r: Record<string, unknown>): AnggotaKeluargaItem {
  return {
    id: r.id as string,
    hubungan: r.hubungan as HubunganKeluarga,
    nama: r.nama as string,
    pekerjaan: str(r.pekerjaan),
    pendidikan: str(r.pendidikan),
    keterangan: str(r.keterangan),
    urutan: (r.urutan as number) ?? 0,
  }
}

function mapRencana(r: Record<string, unknown>): RencanaMasaDepanItem {
  return {
    id: r.id as string,
    tipe: r.tipe as TipeRencana,
    waktu: str(r.waktu),
    rencana: r.rencana as string,
    target: str(r.target),
    urutan: (r.urutan as number) ?? 0,
  }
}

// ── Batch fetch helper ─────────────────────────────────────
// Digunakan oleh loadProfile dan loadProfilePublic
export interface ArrayTableResults {
  riwayatPendidikan: Record<string, unknown>[]
  riwayatPekerjaan: Record<string, unknown>[]
  perjalananHidup: Record<string, unknown>[]
  riwayatOrganisasi: Record<string, unknown>[]
  sosialMedia: Record<string, unknown>[]
  galeriFoto: Record<string, unknown>[]
  anggotaKeluarga: Record<string, unknown>[]
  rencanaMasaDepan: Record<string, unknown>[]
}

/**
 * Fetch semua tabel relasi secara paralel berdasarkan profileId.
 * Mengembalikan ArrayTableResults yang bisa langsung
 * diteruskan ke mapProfileToFormState().
 */
export async function fetchArrayTables(
  profileId: string,
  supabase: { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { order: (col: string, opts?: { ascending: boolean }) => Promise<{ data: unknown[]; error: { message: string } | null }> } } } }
): Promise<ArrayTableResults> {
  const tables = [
    'riwayat_pendidikan',
    'riwayat_pekerjaan',
    'perjalanan_hidup',
    'riwayat_organisasi',
    'sosial_media',
    'galeri_foto',
    'anggota_keluarga',
    'rencana_masa_depan',
  ] as const

  const results = await Promise.all(
    tables.map((table) =>
      supabase
        .from(table)
        .select('*')
        .eq('profile_id', profileId)
        .order('urutan', { ascending: true })
    )
  )

  // Validate — throw on any error
  for (const [i, result] of results.entries()) {
    if (result.error) {
      throw new Error(`Fetch ${tables[i]} error: ${result.error.message}`)
    }
  }

  return {
    riwayatPendidikan: (results[0].data || []) as Record<string, unknown>[],
    riwayatPekerjaan: (results[1].data || []) as Record<string, unknown>[],
    perjalananHidup: (results[2].data || []) as Record<string, unknown>[],
    riwayatOrganisasi: (results[3].data || []) as Record<string, unknown>[],
    sosialMedia: (results[4].data || []) as Record<string, unknown>[],
    galeriFoto: (results[5].data || []) as Record<string, unknown>[],
    anggotaKeluarga: (results[6].data || []) as Record<string, unknown>[],
    rencanaMasaDepan: (results[7].data || []) as Record<string, unknown>[],
  }
}
