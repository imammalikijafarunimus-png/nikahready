// ============================================================
// src/types/index.ts
// Semua TypeScript interface untuk NikahReady
// ============================================================

// ── Step 1: Data Pribadi ─────────────────────────────────────
export type StatusPernikahan =
  | ''
  | 'lajang'
  | 'duda'
  | 'janda'
  | 'cerai_mati'
  | 'cerai_hidup'

export interface DataPribadi {
  nama_lengkap: string
  nama_panggilan: string
  tempat_lahir: string
  tanggal_lahir: string       // ISO date string: "YYYY-MM-DD"
  kewarganegaraan: string
  suku_bangsa: string
  domisili_kota: string
  domisili_provinsi: string
  status_pernikahan: StatusPernikahan
  jumlah_anak: number
}

// ── Step 2: Fisik & Kesehatan ────────────────────────────────
export type GolonganDarah = '' | 'A' | 'B' | 'AB' | 'O' | 'Tidak Tahu'

export interface FisikKesehatan {
  tinggi_badan: number | ''
  berat_badan: number | ''
  golongan_darah: GolonganDarah
  warna_kulit: string
  kondisi_kesehatan: string
  riwayat_penyakit: string
  kebutuhan_khusus: string
}

// ── Step 3: Riwayat Pendidikan (array) ───────────────────────
export interface RiwayatPendidikanItem {
  id: string
  jenjang: string             // SD, SMP, SMA, S1, S2, S3, Pesantren, dll
  nama_institusi: string
  jurusan: string
  tahun_mulai: number | ''
  tahun_selesai: number | ''
  prestasi: string
  urutan: number
}

// ── Step 4: Riwayat Pekerjaan (array) ───────────────────────
export interface RiwayatPekerjaanItem {
  id: string
  nama_perusahaan: string
  posisi_jabatan: string
  deskripsi_pekerjaan: string
  is_masih_aktif: boolean
  tahun_mulai: number | ''
  tahun_selesai: number | ''  // kosong jika is_masih_aktif = true
  urutan: number
}

// ── Step 5: Perjalanan Hidup (array) ─────────────────────────
export type FaseHidup = '' | 'masa_kecil' | 'remaja' | 'dewasa_awal' | 'saat_ini'

export interface PerjalananHidupItem {
  id: string
  fase: FaseHidup
  judul: string
  cerita: string
  pelajaran: string
  tahun_mulai: number | ''
  tahun_selesai: number | ''
  urutan: number
}

// ── Step 6: Riwayat Organisasi (array) ──────────────────────
export interface RiwayatOrganisasiItem {
  id: string
  nama_organisasi: string
  jabatan: string
  deskripsi: string
  tahun_mulai: number | ''
  tahun_selesai: number | ''
  urutan: number
}

// ── Step 7: Karakter & Kepribadian ───────────────────────────
export interface Karakter {
  karakter_diri: string
  kelebihan: string[]         // array of tags
  kekurangan: string[]        // array of tags
  hobi: string[]              // array of tags
  mbti_type: string           // INTJ, ENFP, dll
  bahasa_cinta: string        // words of affirmation, acts of service, dll
}

// ── Step 8: Ibadah & Keislaman ───────────────────────────────
export type KualitasShalat =
  | ''
  | 'selalu_berjamaah'
  | 'sering_berjamaah'
  | 'sering_sendiri'
  | 'kadang'
  | 'masih_berjuang'

export interface Ibadah {
  mazhab: string
  cara_berpakaian: string
  shalat_fardhu: KualitasShalat
  shalat_sunnah: string       // deskripsi bebas: Tahajud, Dhuha, dll
  tilawah_rutin: boolean
  hafalan_quran: string       // "Juz 30", "5 Juz", dll
  kajian_rutin: boolean
  deskripsi_ibadah: string   // cerita perkembangan ibadah
}

// ── Step 9: Gaya Hidup ───────────────────────────────────────
export type TipeKepribadian = '' | 'introvert' | 'ekstrovert' | 'ambivert'

export interface GayaHidup {
  gaya_hidup: string
  pola_makan: string
  olahraga_rutin: boolean
  tipe_kepribadian: TipeKepribadian
  kebiasaan_positif: string
  hal_tidak_disukai: string
}

// ── Step 10: Visi & Misi Pernikahan ──────────────────────────
export interface VisiMisi {
  visi: string
  misi_suami: string
  misi_istri: string
  tujuan_pernikahan: string[] // array of tags / bullet points
}

// ── Step 11: Kriteria Pasangan ───────────────────────────────
export interface Kriteria {
  kriteria_usia_min: number | ''
  kriteria_usia_max: number | ''
  kriteria_domisili: string
  kriteria_pendidikan: string
  kriteria_pekerjaan: string
  kriteria_karakter: string
  kriteria_ibadah: string
  kriteria_lainnya: string
  bersedia_poligami: boolean | null   // null = belum ditentukan
  bersedia_pindah_domisili: boolean | null
}

// ── Step 12: Financial Planning ──────────────────────────────
export type RangePenghasilan =
  | ''
  | '<3jt'
  | '3-5jt'
  | '5-10jt'
  | '10-20jt'
  | '20-30jt'
  | '>30jt'

export interface FinancialPlanning {
  penghasilan_range: RangePenghasilan
  // Alokasi dalam persen (total boleh tidak tepat 100 untuk fleksibilitas input)
  kebutuhan_pokok_persen: number  // recommended: 40-45%
  tabungan_persen: number          // recommended: 20-30%
  investasi_persen: number         // recommended: 10-15%
  sedekah_persen: number           // recommended: 5-10%
  lainnya_persen: number
  deskripsi: string
}

// ── Step 13: Pandangan Isu Pernikahan ────────────────────────
export interface PandanganIsu {
  pandangan_isu: string           // pandangan umum ttg pernikahan
  pandangan_istri_bekerja: string
  pandangan_kb: string
  pandangan_parenting: string
  pandangan_mertua: string
}

// ── Step 14: Anggota Keluarga (array) ────────────────────────
export type HubunganKeluarga =
  | ''
  | 'Ayah'
  | 'Ibu'
  | 'Kakak'
  | 'Adik'
  | 'Wali'
  | 'Lainnya'

export interface AnggotaKeluargaItem {
  id: string
  hubungan: HubunganKeluarga
  nama: string
  pekerjaan: string
  pendidikan: string
  keterangan: string
  urutan: number
}

// ── Step 15: Rencana Masa Depan (array) ──────────────────────
export type TipeRencana = 'pendek' | 'panjang'

export interface RencanaMasaDepanItem {
  id: string
  tipe: TipeRencana           // pendek: 1-2th, panjang: 5-10th
  waktu: string               // "1 Tahun", "2026", "5 Tahun"
  rencana: string
  target: string
  urutan: number
}

// ── Step 16: Sosial Media (array) ────────────────────────────
export type PlatformSosmed =
  | ''
  | 'WhatsApp'
  | 'Instagram'
  | 'LinkedIn'
  | 'TikTok'
  | 'Twitter'
  | 'Facebook'
  | 'YouTube'
  | 'Telegram'
  | 'Lainnya'

export interface SosialMediaItem {
  id: string
  platform: PlatformSosmed
  username: string
  url: string
  is_primary: boolean         // kontak utama (WA)
  tampil_di_pdf: boolean
  urutan: number
}

// ── Step 17: Galeri Foto (array) ─────────────────────────────
export type KategoriGaleri =
  | ''
  | 'formal'
  | 'aktivitas'
  | 'keluarga'
  | 'prestasi'
  | 'lainnya'

export interface GaleriFotoItem {
  id: string
  kategori: KategoriGaleri
  url: string                 // URL Supabase Storage
  keterangan: string
  urutan: number
}

// ── Step 18: Foto & Template Pilihan ─────────────────────────
export type TemplatePilihan =
  | 'ringkas'
  | 'sederhana'
  | 'minimal_islami'
  | 'akademik'
  | 'elegant_islamic'
  | 'modern_dark'

export interface FotoTemplate {
  foto_pribadi_url: string    // URL foto utama (profil)
  foto_formal_url: string     // URL foto formal
  template_pilihan: TemplatePilihan // default: 'ringkas'
}

// ── Aggregate Types ──────────────────────────────────────────

/**
 * Scalar sections — berisi object tunggal (bukan array)
 * Digunakan oleh UPDATE_FIELD action
 */
export type ScalarSection =
  | 'dataPribadi'
  | 'fisikKesehatan'
  | 'karakter'
  | 'ibadah'
  | 'gayaHidup'
  | 'visiMisi'
  | 'kriteria'
  | 'financialPlanning'
  | 'pandanganIsu'
  | 'fotoTemplate'

/**
 * Array sections — berisi array of items
 * Digunakan oleh ADD/REMOVE/UPDATE_ITEM actions
 */
export type ArraySection =
  | 'riwayatPendidikan'
  | 'riwayatPekerjaan'
  | 'perjalananHidup'
  | 'riwayatOrganisasi'
  | 'sosialMedia'
  | 'galeriFoto'
  | 'anggotaKeluarga'
  | 'rencanaMasaDepan'

/**
 * Union semua tipe item array (untuk type-safe ADD_ITEM)
 */
export type AnyArrayItem =
  | RiwayatPendidikanItem
  | RiwayatPekerjaanItem
  | PerjalananHidupItem
  | RiwayatOrganisasiItem
  | SosialMediaItem
  | GaleriFotoItem
  | AnggotaKeluargaItem
  | RencanaMasaDepanItem

// ── Full Form State ──────────────────────────────────────────
export interface FormState {
  // Navigation
  currentStep: number
  totalSteps: number

  // Scalar sections
  dataPribadi: DataPribadi
  fisikKesehatan: FisikKesehatan
  karakter: Karakter
  ibadah: Ibadah
  gayaHidup: GayaHidup
  visiMisi: VisiMisi
  kriteria: Kriteria
  financialPlanning: FinancialPlanning
  pandanganIsu: PandanganIsu
  fotoTemplate: FotoTemplate

  // Array sections
  riwayatPendidikan: RiwayatPendidikanItem[]
  riwayatPekerjaan: RiwayatPekerjaanItem[]
  perjalananHidup: PerjalananHidupItem[]
  riwayatOrganisasi: RiwayatOrganisasiItem[]
  sosialMedia: SosialMediaItem[]
  galeriFoto: GaleriFotoItem[]
  anggotaKeluarga: AnggotaKeluargaItem[]
  rencanaMasaDepan: RencanaMasaDepanItem[]

  // Metadata
  profileId: string | null
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: string | null  // ISO string (serializable)
  plan: 'free' | 'premium'
}

// ── Typed Actions (Discriminated Union) ─────────────────────
export type FormAction =
  // Navigation
  | { type: 'SET_STEP'; payload: number }

  // Scalar: update satu field dalam satu section
  | { type: 'UPDATE_FIELD'; section: ScalarSection; field: string; value: unknown }

  // Array: tambah item baru
  | { type: 'ADD_ITEM'; section: ArraySection; item: AnyArrayItem }

  // Array: hapus item berdasarkan id
  | { type: 'REMOVE_ITEM'; section: ArraySection; id: string }

  // Array: update satu field dalam satu item
  | { type: 'UPDATE_ITEM'; section: ArraySection; id: string; field: string; value: unknown }

  // Array: reorder (drag & drop)
  | { type: 'REORDER_ITEMS'; section: ArraySection; items: AnyArrayItem[] }

  // Persistence
  | { type: 'LOAD_PROFILE'; payload: Partial<FormState> }
  | { type: 'SET_PROFILE_ID'; profileId: string }
  | { type: 'SET_SAVING'; isSaving: boolean }
  | { type: 'SET_SAVED'; timestamp: string }
  | { type: 'SET_DIRTY'; isDirty: boolean }

  // Reset
  | { type: 'RESET_FORM' }

// ── Tipe helper untuk pemetaan section → item type ──────────
export interface ArraySectionItemMap {
  riwayatPendidikan: RiwayatPendidikanItem
  riwayatPekerjaan: RiwayatPekerjaanItem
  perjalananHidup: PerjalananHidupItem
  riwayatOrganisasi: RiwayatOrganisasiItem
  sosialMedia: SosialMediaItem
  galeriFoto: GaleriFotoItem
  anggotaKeluarga: AnggotaKeluargaItem
  rencanaMasaDepan: RencanaMasaDepanItem
}

// ── Step Definition ──────────────────────────────────────────
export interface StepDefinition {
  step: number
  title: string
  subtitle: string
  icon: string        // emoji icon
  section: ScalarSection | ArraySection | 'navigation'
  isPremiumOnly: boolean
}