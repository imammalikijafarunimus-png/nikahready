// ============================================================
// src/lib/mapDbProfileToFormState.ts
// Shared mapper: Supabase DB row → FormState shape
// Extracted from loadProfile.ts and loadProfilePublic.ts
//
// This eliminates ~200 lines of duplicate mapping logic.
// ============================================================

import type {
  FormState,
  DataPribadi,
  FisikKesehatan,
  Karakter,
  Ibadah,
  GayaHidup,
  VisiMisi,
  Kriteria,
  FinancialPlanning,
  PandanganIsu,
  FotoTemplate,
  RiwayatPendidikanItem,
  RiwayatPekerjaanItem,
  PerjalananHidupItem,
  RiwayatOrganisasiItem,
  SosialMediaItem,
  GaleriFotoItem,
  AnggotaKeluargaItem,
  RencanaMasaDepanItem,
} from '@/types'

/**
 * Raw profile row from taaruf_profiles table.
 * We use a generic type to avoid coupling with Supabase generated types.
 */
export interface DbProfileRow {
  id: string
  // Data Pribadi
  nama_lengkap: string | null
  nama_panggilan: string | null
  tempat_lahir: string | null
  tanggal_lahir: string | null
  kewarganegaraan: string | null
  suku_bangsa: string | null
  domisili_kota: string | null
  domisili_provinsi: string | null
  status_pernikahan: string | null
  jumlah_anak: number | null
  // Fisik & Kesehatan
  tinggi_badan: number | string | null
  berat_badan: number | string | null
  golongan_darah: string | null
  warna_kulit: string | null
  kondisi_kesehatan: string | null
  riwayat_penyakit: string | null
  kebutuhan_khusus: string | null
  // Karakter
  karakter_diri: string | null
  kelebihan: string[] | null
  kekurangan: string[] | null
  hobi: string[] | null
  mbti_type: string | null
  bahasa_cinta: string | null
  // Ibadah
  mazhab: string | null
  cara_berpakaian: string | null
  shalat_fardhu: string | null
  shalat_sunnah: string | null
  tilawah_rutin: boolean | null
  hafalan_quran: string | null
  kajian_rutin: boolean | null
  deskripsi_ibadah: string | null
  // Gaya Hidup
  gaya_hidup: string | null
  pola_makan: string | null
  olahraga_rutin: boolean | null
  tipe_introvert_ekstrovert: string | null
  kebiasaan_positif: string | null
  hal_tidak_disukai: string | null
  // Visi Misi
  visi_misi: Record<string, unknown> | null
  // Kriteria
  kriteria_usia_min: number | string | null
  kriteria_usia_max: number | string | null
  kriteria_domisili: string | null
  kriteria_pendidikan: string | null
  kriteria_pekerjaan: string | null
  kriteria_karakter: string | null
  kriteria_ibadah: string | null
  kriteria_lainnya: string | null
  bersedia_poligami: boolean | null
  bersedia_pindah_domisili: boolean | null
  // Financial Planning
  financial_planning: Record<string, unknown> | null
  // Pandangan Isu
  pandangan_isu: string | null
  pandangan_istri_bekerja: string | null
  pandangan_kb: string | null
  pandangan_parenting: string | null
  pandangan_mertua: string | null
  // Foto & Template
  foto_pribadi_url: string | null
  foto_formal_url: string | null
  template_pilihan: string | null
  // Metadata
  share_id?: string | null
  is_published?: boolean | null
  user_plan?: string | null
}

/** Options to customize mapping behavior */
export interface MapProfileOptions {
  /** If true, use || operator instead of ?? for fallbacks (public profiles) */
  useOrFallback?: boolean
  /** If true, convert numeric fields to string (public profiles may return numbers) */
  stringifyNumbers?: boolean
}

// ── Helper: safe fallback ────────────────────────────────────
function fb(value: unknown, fallback: string, useOr: boolean, stringify = false): string {
  const str = stringify ? String(value ?? '') : (value as string ?? '')
  if (useOr) return str || fallback
  return str ?? fallback
}

// ── Scalar section mappers ───────────────────────────────────

function mapDataPribadi(p: DbProfileRow, opts: Required<MapProfileOptions>): DataPribadi {
  return {
    nama_lengkap: fb(p.nama_lengkap, '', opts.useOrFallback),
    nama_panggilan: fb(p.nama_panggilan, '', opts.useOrFallback),
    tempat_lahir: fb(p.tempat_lahir, '', opts.useOrFallback),
    tanggal_lahir: fb(p.tanggal_lahir, '', opts.useOrFallback),
    kewarganegaraan: fb(p.kewarganegaraan, 'Indonesia', opts.useOrFallback),
    suku_bangsa: fb(p.suku_bangsa, '', opts.useOrFallback),
    domisili_kota: fb(p.domisili_kota, '', opts.useOrFallback),
    domisili_provinsi: fb(p.domisili_provinsi, '', opts.useOrFallback),
    status_pernikahan: fb(p.status_pernikahan, '', opts.useOrFallback) as DataPribadi['status_pernikahan'],
    jumlah_anak: (p.jumlah_anak ?? 0) as number,
  }
}

function mapFisikKesehatan(p: DbProfileRow, opts: Required<MapProfileOptions>): FisikKesehatan {
  return {
    tinggi_badan: opts.stringifyNumbers
      ? (p.tinggi_badan?.toString() || '') as number | ''
      : (p.tinggi_badan ?? '') as number | '',
    berat_badan: opts.stringifyNumbers
      ? (p.berat_badan?.toString() || '') as number | ''
      : (p.berat_badan ?? '') as number | '',
    golongan_darah: fb(p.golongan_darah, '', opts.useOrFallback) as FisikKesehatan['golongan_darah'],
    warna_kulit: fb(p.warna_kulit, '', opts.useOrFallback),
    kondisi_kesehatan: fb(p.kondisi_kesehatan, '', opts.useOrFallback),
    riwayat_penyakit: fb(p.riwayat_penyakit, '', opts.useOrFallback),
    kebutuhan_khusus: fb(p.kebutuhan_khusus, '', opts.useOrFallback),
  }
}

function mapKarakter(p: DbProfileRow, opts: Required<MapProfileOptions>): Karakter {
  return {
    karakter_diri: fb(p.karakter_diri, '', opts.useOrFallback),
    kelebihan: Array.isArray(p.kelebihan) ? p.kelebihan : [],
    kekurangan: Array.isArray(p.kekurangan) ? p.kekurangan : [],
    hobi: Array.isArray(p.hobi) ? p.hobi : [],
    mbti_type: fb(p.mbti_type, '', opts.useOrFallback),
    bahasa_cinta: fb(p.bahasa_cinta, '', opts.useOrFallback),
  }
}

function mapIbadah(p: DbProfileRow, opts: Required<MapProfileOptions>): Ibadah {
  return {
    mazhab: fb(p.mazhab, '', opts.useOrFallback),
    cara_berpakaian: fb(p.cara_berpakaian, '', opts.useOrFallback),
    shalat_fardhu: fb(p.shalat_fardhu, '', opts.useOrFallback) as Ibadah['shalat_fardhu'],
    shalat_sunnah: fb(p.shalat_sunnah, '', opts.useOrFallback),
    tilawah_rutin: p.tilawah_rutin ?? false,
    hafalan_quran: fb(p.hafalan_quran, '', opts.useOrFallback),
    kajian_rutin: p.kajian_rutin ?? false,
    deskripsi_ibadah: fb(p.deskripsi_ibadah, '', opts.useOrFallback),
  }
}

function mapGayaHidup(p: DbProfileRow, opts: Required<MapProfileOptions>): GayaHidup {
  return {
    gaya_hidup: fb(p.gaya_hidup, '', opts.useOrFallback),
    pola_makan: fb(p.pola_makan, '', opts.useOrFallback),
    olahraga_rutin: p.olahraga_rutin ?? false,
    tipe_kepribadian: fb(p.tipe_introvert_ekstrovert, '', opts.useOrFallback) as GayaHidup['tipe_kepribadian'],
    kebiasaan_positif: fb(p.kebiasaan_positif, '', opts.useOrFallback),
    hal_tidak_disukai: fb(p.hal_tidak_disukai, '', opts.useOrFallback),
  }
}

function mapVisiMisi(p: DbProfileRow): VisiMisi {
  const vm = p.visi_misi
  if (!vm || typeof vm !== 'object') {
    return { visi: '', misi_suami: '', misi_istri: '', tujuan_pernikahan: [] }
  }
  return {
    visi: (vm.visi as string) || '',
    misi_suami: (vm.misi_suami as string) || '',
    misi_istri: (vm.misi_istri as string) || '',
    tujuan_pernikahan: Array.isArray(vm.tujuan_pernikahan) ? vm.tujuan_pernikahan : [],
  }
}

function mapKriteria(p: DbProfileRow, opts: Required<MapProfileOptions>): Kriteria {
  return {
    kriteria_usia_min: opts.stringifyNumbers
      ? (p.kriteria_usia_min?.toString() || '') as number | ''
      : (p.kriteria_usia_min ?? '') as number | '',
    kriteria_usia_max: opts.stringifyNumbers
      ? (p.kriteria_usia_max?.toString() || '') as number | ''
      : (p.kriteria_usia_max ?? '') as number | '',
    kriteria_domisili: fb(p.kriteria_domisili, '', opts.useOrFallback),
    kriteria_pendidikan: fb(p.kriteria_pendidikan, '', opts.useOrFallback),
    kriteria_pekerjaan: fb(p.kriteria_pekerjaan, '', opts.useOrFallback),
    kriteria_karakter: fb(p.kriteria_karakter, '', opts.useOrFallback),
    kriteria_ibadah: fb(p.kriteria_ibadah, '', opts.useOrFallback),
    kriteria_lainnya: fb(p.kriteria_lainnya, '', opts.useOrFallback),
    bersedia_poligami: p.bersedia_poligami ?? null,
    bersedia_pindah_domisili: p.bersedia_pindah_domisili ?? null,
  }
}

function mapFinancialPlanning(p: DbProfileRow): FinancialPlanning {
  const fp = p.financial_planning
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
    penghasilan_range: ((fp.penghasilan_range as string) || (fp.penghasilan_bulanan as string) || '') as FinancialPlanning['penghasilan_range'],
    kebutuhan_pokok_persen: (fp.kebutuhan_pokok_persen as number) || 45,
    tabungan_persen: (fp.tabungan_persen as number) || 25,
    investasi_persen: (fp.investasi_persen as number) || 15,
    sedekah_persen: (fp.sedekah_persen as number) || 10,
    lainnya_persen: (fp.lainnya_persen as number) || 5,
    deskripsi: (fp.deskripsi as string) || '',
  }
}

function mapPandanganIsu(p: DbProfileRow, opts: Required<MapProfileOptions>): PandanganIsu {
  return {
    pandangan_isu: fb(p.pandangan_isu, '', opts.useOrFallback),
    pandangan_istri_bekerja: fb(p.pandangan_istri_bekerja, '', opts.useOrFallback),
    pandangan_kb: fb(p.pandangan_kb, '', opts.useOrFallback),
    pandangan_parenting: fb(p.pandangan_parenting, '', opts.useOrFallback),
    pandangan_mertua: fb(p.pandangan_mertua, '', opts.useOrFallback),
  }
}

function mapFotoTemplate(p: DbProfileRow, opts: Required<MapProfileOptions>): FotoTemplate {
  return {
    foto_pribadi_url: fb(p.foto_pribadi_url, '', opts.useOrFallback),
    foto_formal_url: fb(p.foto_formal_url, '', opts.useOrFallback),
    template_pilihan: fb(p.template_pilihan, 'ringkas', opts.useOrFallback) as FotoTemplate['template_pilihan'],
  }
}

// ── Array section mappers ────────────────────────────────────

export interface ArrayDataMap {
  riwayatPendidikan: Record<string, unknown>[]
  riwayatPekerjaan: Record<string, unknown>[]
  perjalananHidup: Record<string, unknown>[]
  riwayatOrganisasi: Record<string, unknown>[]
  sosialMedia: Record<string, unknown>[]
  galeriFoto: Record<string, unknown>[]
  anggotaKeluarga: Record<string, unknown>[]
  rencanaMasaDepan: Record<string, unknown>[]
}

function mapArraySections(data: ArrayDataMap) {
  return {
    riwayatPendidikan: (data.riwayatPendidikan || []).map((r) => ({
      id: r.id as string,
      jenjang: r.jenjang as string,
      nama_institusi: r.nama_institusi as string,
      jurusan: (r.jurusan as string) || '',
      tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
      tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
      prestasi: (r.prestasi as string) || '',
      urutan: r.urutan as number,
    })) as RiwayatPendidikanItem[],

    riwayatPekerjaan: (data.riwayatPekerjaan || []).map((r) => ({
      id: r.id as string,
      nama_perusahaan: r.nama_perusahaan as string,
      posisi_jabatan: r.posisi_jabatan as string,
      deskripsi_pekerjaan: (r.deskripsi_pekerjaan as string) || '',
      is_masih_aktif: r.is_masih_aktif as boolean,
      tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
      tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
      urutan: r.urutan as number,
    })) as RiwayatPekerjaanItem[],

    perjalananHidup: (data.perjalananHidup || []).map((r) => ({
      id: r.id as string,
      fase: r.fase as PerjalananHidupItem['fase'],
      judul: r.judul as string,
      cerita: (r.cerita as string) || '',
      pelajaran: (r.pelajaran as string) || '',
      tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
      tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
      urutan: r.urutan as number,
    })) as PerjalananHidupItem[],

    riwayatOrganisasi: (data.riwayatOrganisasi || []).map((r) => ({
      id: r.id as string,
      nama_organisasi: r.nama_organisasi as string,
      jabatan: (r.jabatan as string) || '',
      deskripsi: (r.deskripsi as string) || '',
      tahun_mulai: (r.tahun_mulai as number) ?? '' as number | '',
      tahun_selesai: (r.tahun_selesai as number) ?? '' as number | '',
      urutan: r.urutan as number,
    })) as RiwayatOrganisasiItem[],

    sosialMedia: (data.sosialMedia || []).map((r) => ({
      id: r.id as string,
      platform: r.platform as SosialMediaItem['platform'],
      username: r.username as string,
      url: (r.url as string) || '',
      is_primary: r.is_primary as boolean,
      tampil_di_pdf: r.tampil_di_pdf as boolean,
      urutan: r.urutan as number,
    })) as SosialMediaItem[],

    galeriFoto: (data.galeriFoto || []).map((r) => ({
      id: r.id as string,
      kategori: r.kategori as GaleriFotoItem['kategori'],
      url: r.url as string,
      keterangan: (r.keterangan as string) || '',
      urutan: r.urutan as number,
    })) as GaleriFotoItem[],

    anggotaKeluarga: (data.anggotaKeluarga || []).map((r) => ({
      id: r.id as string,
      hubungan: r.hubungan as AnggotaKeluargaItem['hubungan'],
      nama: r.nama as string,
      pekerjaan: (r.pekerjaan as string) || '',
      pendidikan: (r.pendidikan as string) || '',
      keterangan: (r.keterangan as string) || '',
      urutan: r.urutan as number,
    })) as AnggotaKeluargaItem[],

    rencanaMasaDepan: (data.rencanaMasaDepan || []).map((r) => ({
      id: r.id as string,
      tipe: r.tipe as RencanaMasaDepanItem['tipe'],
      waktu: (r.waktu as string) || '',
      rencana: r.rencana as string,
      target: (r.target as string) || '',
      urutan: r.urutan as number,
    })) as RencanaMasaDepanItem[],
  }
}

// ── Main mapper function ─────────────────────────────────────

/**
 * Map a Supabase profile row + array data into FormState shape.
 *
 * @param profile - The taaruf_profiles row from Supabase
 * @param arrayData - All 8 array table data sets
 * @param options - Mapping behavior options
 * @returns Partial<FormState> (for authenticated users) or full FormState (spread with INITIAL_FORM_STATE by caller)
 */
export function mapDbProfileToFormState(
  profile: DbProfileRow,
  arrayData: ArrayDataMap,
  options: MapProfileOptions = {}
): Omit<FormState, 'currentStep' | 'totalSteps' | 'isDirty' | 'isSaving' | 'lastSavedAt'> {
  const opts: Required<MapProfileOptions> = {
    useOrFallback: false,
    stringifyNumbers: false,
    ...options,
  }

  return {
    profileId: profile.id,

    // Scalar sections
    dataPribadi: mapDataPribadi(profile, opts),
    fisikKesehatan: mapFisikKesehatan(profile, opts),
    karakter: mapKarakter(profile, opts),
    ibadah: mapIbadah(profile, opts),
    gayaHidup: mapGayaHidup(profile, opts),
    visiMisi: mapVisiMisi(profile),
    kriteria: mapKriteria(profile, opts),
    financialPlanning: mapFinancialPlanning(profile),
    pandanganIsu: mapPandanganIsu(profile, opts),
    fotoTemplate: mapFotoTemplate(profile, opts),

    // Array sections
    ...mapArraySections(arrayData),

    // Metadata
    plan: (profile.user_plan as 'free' | 'premium') || 'free',
  }
}