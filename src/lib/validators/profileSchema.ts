// ============================================================
// src/lib/validators/profileSchema.ts
// Fase 4.2 — Zod validation schema untuk FormState
//
// Validasi dilakukan SEBELUM Supabase persistence (saveProfile).
// Menangkap error data yang tidak valid sebelum masuk ke database.
// ============================================================

import { z } from 'zod'

// ── Enum schemas ────────────────────────────────────────────
export const statusPernikahanSchema = z.enum([
  '', 'lajang', 'duda', 'janda', 'cerai_mati', 'cerai_hidup',
])

export const golonganDarahSchema = z.enum([
  '', 'A', 'B', 'AB', 'O', 'Tidak Tahu',
])

export const faseHidupSchema = z.enum([
  '', 'masa_kecil', 'remaja', 'dewasa_awal', 'saat_ini',
])

export const tipeKepribadianSchema = z.enum([
  '', 'introvert', 'ekstrovert', 'ambivert',
])

export const kualitasShalatSchema = z.enum([
  '', 'selalu_berjamaah', 'sering_berjamaah', 'sering_sendiri',
  'kadang', 'masih_berjuang',
])

export const rangePenghasilanSchema = z.enum([
  '', '<3jt', '3-5jt', '5-10jt', '10-20jt', '20-30jt', '>30jt',
])

export const platformSosmedSchema = z.enum([
  '', 'WhatsApp', 'Instagram', 'LinkedIn', 'TikTok',
  'Twitter', 'Facebook', 'YouTube', 'Telegram', 'Lainnya',
])

export const kategoriGaleriSchema = z.enum([
  '', 'formal', 'aktivitas', 'keluarga', 'prestasi', 'lainnya',
])

export const hubunganKeluargaSchema = z.enum([
  '', 'Ayah', 'Ibu', 'Kakak', 'Adik', 'Wali', 'Lainnya',
])

export const tipeRencanaSchema = z.enum(['pendek', 'panjang'])

export const templatePilihanSchema = z.enum([
  'ringkas', 'sederhana', 'minimal_islami',
  'akademik', 'elegant_islamic', 'modern_dark',
])

// ── Scalar section schemas ──────────────────────────────────
export const dataPribadiSchema = z.object({
  nama_lengkap: z.string(),
  nama_panggilan: z.string(),
  tempat_lahir: z.string(),
  tanggal_lahir: z.string(),
  kewarganegaraan: z.string(),
  suku_bangsa: z.string(),
  domisili_kota: z.string(),
  domisili_provinsi: z.string(),
  status_pernikahan: statusPernikahanSchema,
  jumlah_anak: z.number().int().min(0),
})

export const fisikKesehatanSchema = z.object({
  tinggi_badan: z.union([z.number(), z.literal('')]),
  berat_badan: z.union([z.number(), z.literal('')]),
  golongan_darah: golonganDarahSchema,
  warna_kulit: z.string(),
  kondisi_kesehatan: z.string(),
  riwayat_penyakit: z.string(),
  kebutuhan_khusus: z.string(),
})

export const karakterSchema = z.object({
  karakter_diri: z.string(),
  kelebihan: z.array(z.string()),
  kekurangan: z.array(z.string()),
  hobi: z.array(z.string()),
  mbti_type: z.string(),
  bahasa_cinta: z.string(),
})

export const ibadahSchema = z.object({
  mazhab: z.string(),
  cara_berpakaian: z.string(),
  shalat_fardhu: kualitasShalatSchema,
  shalat_sunnah: z.string(),
  tilawah_rutin: z.boolean(),
  hafalan_quran: z.string(),
  kajian_rutin: z.boolean(),
  deskripsi_ibadah: z.string(),
})

export const gayaHidupSchema = z.object({
  gaya_hidup: z.string(),
  pola_makan: z.string(),
  olahraga_rutin: z.boolean(),
  tipe_kepribadian: tipeKepribadianSchema,
  kebiasaan_positif: z.string(),
  hal_tidak_disukai: z.string(),
})

export const visiMisiSchema = z.object({
  visi: z.string(),
  misi_suami: z.string(),
  misi_istri: z.string(),
  tujuan_pernikahan: z.array(z.string()),
})

export const kriteriaSchema = z.object({
  kriteria_usia_min: z.union([z.number(), z.literal('')]),
  kriteria_usia_max: z.union([z.number(), z.literal('')]),
  kriteria_domisili: z.string(),
  kriteria_pendidikan: z.string(),
  kriteria_pekerjaan: z.string(),
  kriteria_karakter: z.string(),
  kriteria_ibadah: z.string(),
  kriteria_lainnya: z.string(),
  bersedia_poligami: z.boolean().nullable(),
  bersedia_pindah_domisili: z.boolean().nullable(),
})

export const financialPlanningSchema = z.object({
  penghasilan_range: rangePenghasilanSchema,
  kebutuhan_pokok_persen: z.number().min(0).max(100),
  tabungan_persen: z.number().min(0).max(100),
  investasi_persen: z.number().min(0).max(100),
  sedekah_persen: z.number().min(0).max(100),
  lainnya_persen: z.number().min(0).max(100),
  deskripsi: z.string(),
})

export const pandanganIsuSchema = z.object({
  pandangan_isu: z.string(),
  pandangan_istri_bekerja: z.string(),
  pandangan_kb: z.string(),
  pandangan_parenting: z.string(),
  pandangan_mertua: z.string(),
})

export const fotoTemplateSchema = z.object({
  foto_pribadi_url: z.string(),
  foto_formal_url: z.string(),
  template_pilihan: templatePilihanSchema,
})

// ── Array item schemas ──────────────────────────────────────
export const riwayatPendidikanItemSchema = z.object({
  id: z.string(),
  jenjang: z.string(),
  nama_institusi: z.string(),
  jurusan: z.string(),
  tahun_mulai: z.union([z.number(), z.literal('')]),
  tahun_selesai: z.union([z.number(), z.literal('')]),
  prestasi: z.string(),
  urutan: z.number(),
})

export const riwayatPekerjaanItemSchema = z.object({
  id: z.string(),
  nama_perusahaan: z.string(),
  posisi_jabatan: z.string(),
  deskripsi_pekerjaan: z.string(),
  is_masih_aktif: z.boolean(),
  tahun_mulai: z.union([z.number(), z.literal('')]),
  tahun_selesai: z.union([z.number(), z.literal('')]),
  urutan: z.number(),
})

export const perjalananHidupItemSchema = z.object({
  id: z.string(),
  fase: faseHidupSchema,
  judul: z.string(),
  cerita: z.string(),
  pelajaran: z.string(),
  tahun_mulai: z.union([z.number(), z.literal('')]),
  tahun_selesai: z.union([z.number(), z.literal('')]),
  urutan: z.number(),
})

export const riwayatOrganisasiItemSchema = z.object({
  id: z.string(),
  nama_organisasi: z.string(),
  jabatan: z.string(),
  deskripsi: z.string(),
  tahun_mulai: z.union([z.number(), z.literal('')]),
  tahun_selesai: z.union([z.number(), z.literal('')]),
  urutan: z.number(),
})

export const sosialMediaItemSchema = z.object({
  id: z.string(),
  platform: platformSosmedSchema,
  username: z.string(),
  url: z.string(),
  is_primary: z.boolean(),
  tampil_di_pdf: z.boolean(),
  urutan: z.number(),
})

export const galeriFotoItemSchema = z.object({
  id: z.string(),
  kategori: kategoriGaleriSchema,
  url: z.string(),
  keterangan: z.string(),
  urutan: z.number(),
})

export const anggotaKeluargaItemSchema = z.object({
  id: z.string(),
  hubungan: hubunganKeluargaSchema,
  nama: z.string(),
  pekerjaan: z.string(),
  pendidikan: z.string(),
  keterangan: z.string(),
  urutan: z.number(),
})

export const rencanaMasaDepanItemSchema = z.object({
  id: z.string(),
  tipe: tipeRencanaSchema,
  waktu: z.string(),
  rencana: z.string(),
  target: z.string(),
  urutan: z.number(),
})

// ── Full FormState Schema ───────────────────────────────────
export const formStateSchema = z.object({
  // Navigation
  currentStep: z.number().int().min(1).max(22),
  totalSteps: z.number().int().min(1),

  // Scalar sections
  dataPribadi: dataPribadiSchema,
  fisikKesehatan: fisikKesehatanSchema,
  karakter: karakterSchema,
  ibadah: ibadahSchema,
  gayaHidup: gayaHidupSchema,
  visiMisi: visiMisiSchema,
  kriteria: kriteriaSchema,
  financialPlanning: financialPlanningSchema,
  pandanganIsu: pandanganIsuSchema,
  fotoTemplate: fotoTemplateSchema,

  // Array sections
  riwayatPendidikan: z.array(riwayatPendidikanItemSchema),
  riwayatPekerjaan: z.array(riwayatPekerjaanItemSchema),
  perjalananHidup: z.array(perjalananHidupItemSchema),
  riwayatOrganisasi: z.array(riwayatOrganisasiItemSchema),
  sosialMedia: z.array(sosialMediaItemSchema),
  galeriFoto: z.array(galeriFotoItemSchema),
  anggotaKeluarga: z.array(anggotaKeluargaItemSchema),
  rencanaMasaDepan: z.array(rencanaMasaDepanItemSchema),

  // Metadata
  profileId: z.string().nullable(),
  isDirty: z.boolean(),
  isSaving: z.boolean(),
  lastSavedAt: z.string().nullable(),
  plan: z.enum(['free', 'premium']),
})

// ── Validation helper for saveProfile ───────────────────────
export type FormStateValidationResult = {
  valid: true
} | {
  valid: false
  errors: z.ZodIssue[]
  fieldErrors: Record<string, string[]>
}

/**
 * Validasi FormState sebelum menyimpan ke Supabase.
 * Mengembalikan hasil validasi dengan pesan error per field.
 */
export function validateFormStateForSave(
  state: unknown
): FormStateValidationResult {
  const result = formStateSchema.safeParse(state)

  if (result.success) {
    return { valid: true }
  }

  // Group errors by field path
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (!fieldErrors[path]) {
      fieldErrors[path] = []
    }
    fieldErrors[path].push(issue.message)
  }

  return {
    valid: false,
    errors: result.error.issues,
    fieldErrors,
  }
}
