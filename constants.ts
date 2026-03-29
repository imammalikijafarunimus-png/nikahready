// ============================================================
// src/lib/constants.ts
// Initial state, step definitions, select options
// ============================================================

import type {
  FormState,
  StepDefinition,
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
} from '@/types'

// ── Initial values per section ──────────────────────────────

export const INITIAL_DATA_PRIBADI: DataPribadi = {
  nama_lengkap: '',
  nama_panggilan: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  kewarganegaraan: 'Indonesia',
  suku_bangsa: '',
  domisili_kota: '',
  domisili_provinsi: '',
  status_pernikahan: '',
  jumlah_anak: 0,
}

export const INITIAL_FISIK_KESEHATAN: FisikKesehatan = {
  tinggi_badan: '',
  berat_badan: '',
  golongan_darah: '',
  warna_kulit: '',
  kondisi_kesehatan: '',
  riwayat_penyakit: '',
  kebutuhan_khusus: '',
}

export const INITIAL_KARAKTER: Karakter = {
  karakter_diri: '',
  kelebihan: [],
  kekurangan: [],
  hobi: [],
  mbti_type: '',
  bahasa_cinta: '',
}

export const INITIAL_IBADAH: Ibadah = {
  mazhab: '',
  cara_berpakaian: '',
  shalat_fardhu: '',
  shalat_sunnah: '',
  tilawah_rutin: false,
  hafalan_quran: '',
  kajian_rutin: false,
  deskripsi_ibadah: '',
}

export const INITIAL_GAYA_HIDUP: GayaHidup = {
  gaya_hidup: '',
  pola_makan: '',
  olahraga_rutin: false,
  tipe_kepribadian: '',
  kebiasaan_positif: '',
  hal_tidak_disukai: '',
}

export const INITIAL_VISI_MISI: VisiMisi = {
  visi: '',
  misi_suami: '',
  misi_istri: '',
  tujuan_pernikahan: [],
}

export const INITIAL_KRITERIA: Kriteria = {
  kriteria_usia_min: '',
  kriteria_usia_max: '',
  kriteria_domisili: '',
  kriteria_pendidikan: '',
  kriteria_pekerjaan: '',
  kriteria_karakter: '',
  kriteria_ibadah: '',
  kriteria_lainnya: '',
  bersedia_poligami: null,
  bersedia_pindah_domisili: null,
}

export const INITIAL_FINANCIAL_PLANNING: FinancialPlanning = {
  penghasilan_range: '',
  kebutuhan_pokok_persen: 45,
  tabungan_persen: 25,
  investasi_persen: 15,
  sedekah_persen: 10,
  lainnya_persen: 5,
  deskripsi: '',
}

export const INITIAL_PANDANGAN_ISU: PandanganIsu = {
  pandangan_isu: '',
  pandangan_istri_bekerja: '',
  pandangan_kb: '',
  pandangan_parenting: '',
  pandangan_mertua: '',
}

export const INITIAL_FOTO_TEMPLATE: FotoTemplate = {
  foto_pribadi_url: '',
  foto_formal_url: '',
  template_pilihan: 'akademik',
}

// ── Full Initial Form State ──────────────────────────────────
export const INITIAL_FORM_STATE: FormState = {
  // Navigation
  currentStep: 1,
  totalSteps: 22,

  // Scalar sections
  dataPribadi: INITIAL_DATA_PRIBADI,
  fisikKesehatan: INITIAL_FISIK_KESEHATAN,
  karakter: INITIAL_KARAKTER,
  ibadah: INITIAL_IBADAH,
  gayaHidup: INITIAL_GAYA_HIDUP,
  visiMisi: INITIAL_VISI_MISI,
  kriteria: INITIAL_KRITERIA,
  financialPlanning: INITIAL_FINANCIAL_PLANNING,
  pandanganIsu: INITIAL_PANDANGAN_ISU,
  fotoTemplate: INITIAL_FOTO_TEMPLATE,

  // Array sections
  riwayatPendidikan: [],
  riwayatPekerjaan: [],
  perjalananHidup: [],
  riwayatOrganisasi: [],
  sosialMedia: [],
  galeriFoto: [],
  anggotaKeluarga: [],
  rencanaMasaDepan: [],

  // Metadata
  profileId: null,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  plan: 'premium', // MVP: default premium
}

// ── Step Definitions (22 steps) ─────────────────────────────
export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    step: 1,
    title: 'Data Pribadi',
    subtitle: 'Informasi dasar tentang dirimu',
    icon: '👤',
    section: 'dataPribadi',
    isPremiumOnly: false,
  },
  {
    step: 2,
    title: 'Fisik & Kesehatan',
    subtitle: 'Kondisi fisik dan riwayat kesehatan',
    icon: '💪',
    section: 'fisikKesehatan',
    isPremiumOnly: false,
  },
  {
    step: 3,
    title: 'Riwayat Pendidikan',
    subtitle: 'Perjalanan akademik dan pesantren',
    icon: '🎓',
    section: 'riwayatPendidikan',
    isPremiumOnly: false,
  },
  {
    step: 4,
    title: 'Riwayat Pekerjaan',
    subtitle: 'Karir dan pengalaman profesional',
    icon: '💼',
    section: 'riwayatPekerjaan',
    isPremiumOnly: true,
  },
  {
    step: 5,
    title: 'Perjalanan Hidup',
    subtitle: 'Fase-fase penting dalam hidupmu',
    icon: '🛤️',
    section: 'perjalananHidup',
    isPremiumOnly: true,
  },
  {
    step: 6,
    title: 'Riwayat Organisasi',
    subtitle: 'Pengalaman berorganisasi dan komunitas',
    icon: '🤝',
    section: 'riwayatOrganisasi',
    isPremiumOnly: true,
  },
  {
    step: 7,
    title: 'Karakter & Kepribadian',
    subtitle: 'Sifat, kelebihan, dan kekuranganmu',
    icon: '✨',
    section: 'karakter',
    isPremiumOnly: false,
  },
  {
    step: 8,
    title: 'Ibadah & Keislaman',
    subtitle: 'Kondisi dan perjalanan ibadahmu',
    icon: '🕌',
    section: 'ibadah',
    isPremiumOnly: false,
  },
  {
    step: 9,
    title: 'Gaya Hidup',
    subtitle: 'Keseharian dan kebiasaan hidupmu',
    icon: '🌱',
    section: 'gayaHidup',
    isPremiumOnly: true,
  },
  {
    step: 10,
    title: 'Visi & Misi Pernikahan',
    subtitle: 'Tujuan dan arah kehidupan berumah tangga',
    icon: '🌟',
    section: 'visiMisi',
    isPremiumOnly: true,
  },
  {
    step: 11,
    title: 'Kriteria Pasangan',
    subtitle: 'Kriteria yang kamu harapkan',
    icon: '💍',
    section: 'kriteria',
    isPremiumOnly: false,
  },
  {
    step: 12,
    title: 'Financial Planning',
    subtitle: 'Rencana dan alokasi keuangan keluarga',
    icon: '💰',
    section: 'financialPlanning',
    isPremiumOnly: true,
  },
  {
    step: 13,
    title: 'Pandangan Isu',
    subtitle: 'Pandanganmu tentang isu-isu pernikahan',
    icon: '💬',
    section: 'pandanganIsu',
    isPremiumOnly: true,
  },
  {
    step: 14,
    title: 'Anggota Keluarga',
    subtitle: 'Struktur keluarga dan latar belakangnya',
    icon: '👨‍👩‍👧‍👦',
    section: 'anggotaKeluarga',
    isPremiumOnly: true,
  },
  {
    step: 15,
    title: 'Rencana Masa Depan',
    subtitle: 'Rencana jangka pendek dan panjang',
    icon: '🗓️',
    section: 'rencanaMasaDepan',
    isPremiumOnly: true,
  },
  {
    step: 16,
    title: 'Sosial Media',
    subtitle: 'Akun media sosial yang aktif',
    icon: '📱',
    section: 'sosialMedia',
    isPremiumOnly: false,
  },
  {
    step: 17,
    title: 'Galeri Foto',
    subtitle: 'Foto-foto pilihan untuk CV',
    icon: '📸',
    section: 'galeriFoto',
    isPremiumOnly: true,
  },
  {
    step: 18,
    title: 'Foto & Template',
    subtitle: 'Pilih foto utama dan desain CV',
    icon: '🎨',
    section: 'fotoTemplate',
    isPremiumOnly: false,
  },
  // Steps 19-22 reserved untuk future features
  {
    step: 19,
    title: 'Surat Taaruf',
    subtitle: 'Surat perkenalan diri (opsional)',
    icon: '✉️',
    section: 'pandanganIsu', // placeholder, extend later
    isPremiumOnly: true,
  },
  {
    step: 20,
    title: 'Referensi',
    subtitle: 'Kontak referensi dari ustadz/keluarga',
    icon: '📋',
    section: 'pandanganIsu', // placeholder
    isPremiumOnly: true,
  },
  {
    step: 21,
    title: 'Harapan & Doa',
    subtitle: 'Harapanmu di pernikahan ini',
    icon: '🤲',
    section: 'visiMisi', // placeholder
    isPremiumOnly: true,
  },
  {
    step: 22,
    title: 'Review & Simpan',
    subtitle: 'Periksa dan simpan profilmu',
    icon: '✅',
    section: 'navigation',
    isPremiumOnly: false,
  },
]

// ── Step access by plan ──────────────────────────────────────
export const FREE_STEPS = STEP_DEFINITIONS
  .filter((s) => !s.isPremiumOnly)
  .map((s) => s.step)

export const PREMIUM_STEPS = STEP_DEFINITIONS.map((s) => s.step)

export function getAccessibleSteps(plan: 'free' | 'premium'): number[] {
  return plan === 'premium' ? PREMIUM_STEPS : FREE_STEPS
}

// ── Select Options ───────────────────────────────────────────

export const OPTIONS_STATUS_PERNIKAHAN = [
  { value: 'lajang', label: 'Lajang / Belum Pernah Menikah' },
  { value: 'duda', label: 'Duda' },
  { value: 'janda', label: 'Janda' },
  { value: 'cerai_mati', label: 'Cerai Mati' },
  { value: 'cerai_hidup', label: 'Cerai Hidup' },
]

export const OPTIONS_GOLONGAN_DARAH = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
  { value: 'Tidak Tahu', label: 'Tidak Tahu' },
]

export const OPTIONS_JENJANG_PENDIDIKAN = [
  { value: 'SD', label: 'SD / Ibtidaiyah' },
  { value: 'SMP', label: 'SMP / Tsanawiyah' },
  { value: 'SMA', label: 'SMA / Aliyah' },
  { value: 'Pesantren', label: 'Pesantren' },
  { value: 'D1', label: 'D1' },
  { value: 'D2', label: 'D2' },
  { value: 'D3', label: 'D3' },
  { value: 'D4', label: 'D4' },
  { value: 'S1', label: 'S1 / Sarjana' },
  { value: 'S2', label: 'S2 / Magister' },
  { value: 'S3', label: 'S3 / Doktor' },
  { value: 'Kursus', label: 'Kursus / Sertifikasi' },
  { value: 'Lainnya', label: 'Lainnya' },
]

export const OPTIONS_FASE_HIDUP = [
  { value: 'masa_kecil', label: '🌱 Masa Kecil (0-12 tahun)' },
  { value: 'remaja', label: '📚 Remaja (13-17 tahun)' },
  { value: 'dewasa_awal', label: '🚀 Dewasa Awal (18-25 tahun)' },
  { value: 'saat_ini', label: '⭐ Fase Sekarang (26+ tahun)' },
]

export const OPTIONS_SHALAT_FARDHU = [
  { value: 'selalu_berjamaah', label: 'Alhamdulillah, selalu berjamaah' },
  { value: 'sering_berjamaah', label: 'Sering berjamaah' },
  { value: 'sering_sendiri', label: 'Sering, tapi sendiri' },
  { value: 'kadang', label: 'Kadang-kadang' },
  { value: 'masih_berjuang', label: 'Masih berjuang, minta doanya 🤲' },
]

export const OPTIONS_TIPE_KEPRIBADIAN = [
  { value: 'introvert', label: '🤫 Introvert — mengisi energi dengan menyendiri' },
  { value: 'ekstrovert', label: '🗣️ Ekstrovert — mengisi energi dengan bersosialisasi' },
  { value: 'ambivert', label: '⚖️ Ambivert — seimbang antara keduanya' },
]

export const OPTIONS_PLATFORM_SOSMED = [
  { value: 'WhatsApp', label: '📱 WhatsApp' },
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'LinkedIn', label: '💼 LinkedIn' },
  { value: 'TikTok', label: '🎵 TikTok' },
  { value: 'Twitter', label: '🐦 Twitter / X' },
  { value: 'Facebook', label: '👥 Facebook' },
  { value: 'YouTube', label: '▶️ YouTube' },
  { value: 'Telegram', label: '✈️ Telegram' },
  { value: 'Lainnya', label: 'Lainnya' },
]

export const OPTIONS_HUBUNGAN_KELUARGA = [
  { value: 'Ayah', label: '👨 Ayah' },
  { value: 'Ibu', label: '👩 Ibu' },
  { value: 'Kakak', label: '🧑 Kakak' },
  { value: 'Adik', label: '🧒 Adik' },
  { value: 'Wali', label: '🤝 Wali' },
  { value: 'Lainnya', label: 'Lainnya' },
]

export const OPTIONS_KATEGORI_GALERI = [
  { value: 'formal', label: '👔 Formal' },
  { value: 'aktivitas', label: '🏃 Aktivitas' },
  { value: 'keluarga', label: '👨‍👩‍👧 Keluarga' },
  { value: 'prestasi', label: '🏆 Prestasi' },
  { value: 'lainnya', label: '🖼️ Lainnya' },
]

export const OPTIONS_TEMPLATE = [
  {
    value: 'akademik',
    label: 'Akademik',
    description: 'Formal, clean, hijau-navy-gold. Cocok untuk profesional.',
    isPremiumOnly: false,
  },
  {
    value: 'elegant_islamic',
    label: 'Elegant Islamic',
    description: 'Ornamen islami, cream & gold. Elegan dan hangat.',
    isPremiumOnly: true,
  },
  {
    value: 'modern_dark',
    label: 'Modern Dark',
    description: 'Dark mode, aksen emas. Modern dan berkarakter.',
    isPremiumOnly: true,
  },
]

export const OPTIONS_PENGHASILAN_RANGE = [
  { value: '<3jt', label: 'Di bawah Rp 3 juta' },
  { value: '3-5jt', label: 'Rp 3 – 5 juta' },
  { value: '5-10jt', label: 'Rp 5 – 10 juta' },
  { value: '10-20jt', label: 'Rp 10 – 20 juta' },
  { value: '20-30jt', label: 'Rp 20 – 30 juta' },
  { value: '>30jt', label: 'Di atas Rp 30 juta' },
]

export const OPTIONS_MBTI = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
].map((v) => ({ value: v, label: v }))

export const OPTIONS_BAHASA_CINTA = [
  { value: 'words_of_affirmation', label: '💬 Words of Affirmation — Kata-kata penyemangat' },
  { value: 'acts_of_service', label: '🙏 Acts of Service — Bantuan dan tindakan' },
  { value: 'receiving_gifts', label: '🎁 Receiving Gifts — Pemberian hadiah' },
  { value: 'quality_time', label: '⏰ Quality Time — Waktu berkualitas bersama' },
  { value: 'physical_touch', label: '🤗 Physical Touch — Sentuhan fisik (halal tentunya)' },
]

// ── Provinsi Indonesia ────────────────────────────────────────
export const PROVINSI_INDONESIA = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau',
  'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung',
  'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta',
  'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
  'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
  'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara',
  'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah',
  'Papua Pegunungan', 'Papua Barat Daya',
].map((v) => ({ value: v, label: v }))

// ── Local storage key ────────────────────────────────────────
export const FORM_DRAFT_KEY = 'taarufcv_form_draft'
export const FORM_DRAFT_VERSION = '1.0.0' // bump saat schema berubah
