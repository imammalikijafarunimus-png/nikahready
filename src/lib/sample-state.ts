// ============================================================
// src/lib/sample-state.ts
// Data preview landing page — 100% selaras dengan types/index.ts
// ============================================================

import type { FormState } from "@/types"

export const SAMPLE_STATE: FormState = {
  // ── Navigation ─────────────────────────────────────────────
  currentStep: 1,
  totalSteps: 17,

  // ── Step 1: Data Pribadi ───────────────────────────────────
  dataPribadi: {
    nama_lengkap: "Ahmad Fauzan Hakim",
    nama_panggilan: "Fauzan",
    tempat_lahir: "Jakarta",
    tanggal_lahir: "1995-03-15",
    kewarganegaraan: "WNI",
    suku_bangsa: "Jawa",
    domisili_kota: "Jakarta Selatan",
    domisili_provinsi: "DKI Jakarta",
    status_pernikahan: "lajang",
    jumlah_anak: 0,
  },

  // ── Step 2: Fisik & Kesehatan ─────────────────────────────
  fisikKesehatan: {
    tinggi_badan: 175,
    berat_badan: 72,
    golongan_darah: "O",
    warna_kulit: "Sawo matang",
    kondisi_kesehatan: "Sehat alhamdulillah",
    riwayat_penyakit: "",
    kebutuhan_khusus: "",
  },

  // ── Step 3: Pendidikan ────────────────────────────────────
  riwayatPendidikan: [
    {
      id: "edu-1",
      jenjang: "S1",
      nama_institusi: "Universitas Indonesia",
      jurusan: "Teknik Informatika",
      tahun_mulai: 2013,
      tahun_selesai: 2017,
      prestasi: "Cum Laude",
      urutan: 1,
    },
  ],

  // ── Step 4: Pekerjaan ─────────────────────────────────────
  riwayatPekerjaan: [
    {
      id: "job-1",
      nama_perusahaan: "PT Teknologi Nusantara",
      posisi_jabatan: "Software Engineer",
      deskripsi_pekerjaan: "Mengembangkan sistem backend untuk aplikasi fintech.",
      is_masih_aktif: true,
      tahun_mulai: 2017,
      tahun_selesai: "",
      urutan: 1,
    },
  ],

  // ── Step 5: Perjalanan Hidup ──────────────────────────────
  perjalananHidup: [
    {
      id: "ph-1",
      fase: "masa_kecil",
      judul: "Kecil di Jakarta",
      cerita: "Besarkan di lingkungan keluarga yang religius. Ayah selalu mengajak shalat berjamaah di masjid.",
      pelajaran: "Pentingnya keteladanan orang tua dalam membentuk karakter keimanan.",
      tahun_mulai: 1995,
      tahun_selesai: 2007,
      urutan: 1,
    },
  ],

  // ── Step 6: Organisasi ────────────────────────────────────
  riwayatOrganisasi: [
    {
      id: "org-1",
      nama_organisasi: "Remaja Masjid Al-Ikhlas",
      jabatan: "Ketua Divisi Kajian",
      deskripsi: "Mengelola kajian rutin mingguan untuk remaja masjid.",
      tahun_mulai: 2015,
      tahun_selesai: 2017,
      urutan: 1,
    },
  ],

  // ── Step 7: Karakter ──────────────────────────────────────
  karakter: {
    karakter_diri:
      "Pribadi yang mudah bergaul, bertanggung jawab, dan menjunjung tinggi adab. Menyukai diskusi ilmiah serta aktif di kegiatan sosial masjid.",
    kelebihan: ["Disiplin", "Jujur", "Peduli", "Rajin"],
    kekurangan: ["Kadang terlalu serius"],
    hobi: ["Membaca", "Futsal", "Belajar coding"],
    mbti_type: "INTJ",
    bahasa_cinta: "acts_of_service",
  },

  // ── Step 8: Ibadah ────────────────────────────────────────
  ibadah: {
    mazhab: "Syafi'i",
    cara_berpakaian: "Rapi & menutup aurat",
    shalat_fardhu: "selalu_berjamaah",
    shalat_sunnah: "Dhuha & Tahajjud kadang-kadang",
    tilawah_rutin: true,
    hafalan_quran: "Juz 30",
    kajian_rutin: true,
    deskripsi_ibadah:
      "Alhamdulillah berusaha istiqomah dalam shalat berjamaah dan mengikuti kajian mingguan.",
  },

  // ── Step 9: Gaya Hidup ────────────────────────────────────
  gayaHidup: {
    gaya_hidup: "Sederhana",
    pola_makan: "Tidak pilih-pilih makanan",
    olahraga_rutin: true,
    tipe_kepribadian: "ambivert",
    kebiasaan_positif:
      "Bangun subuh, membaca minimal 10 halaman buku per hari",
    hal_tidak_disukai: "Sikap sombong & boros",
  },

  // ── Step 10: Visi Misi ───────────────────────────────────
  visiMisi: {
    visi: "Membangun keluarga sakinah yang menjadi cerminan cinta Rasulullah SAW",
    misi_suami:
      "Menjadi pemimpin yang adil, penyejuk hati, dan pelindung keluarga",
    misi_istri:
      "Mendidik anak dengan penuh kasih sayang dan menjadi istri yang shalihah",
    tujuan_pernikahan: ["Sakinah", "Mawaddah", "Warahmah"],
  },

  // ── Step 11: Kriteria ─────────────────────────────────────
  kriteria: {
    kriteria_usia_min: 22,
    kriteria_usia_max: 28,
    kriteria_domisili: "Jakarta atau sekitarnya",
    kriteria_pendidikan: "Minimal D3",
    kriteria_pekerjaan: "Tidak terikat",
    kriteria_karakter: "Sabar, penyayang, dan istiqomah dalam ibadah",
    kriteria_ibadah: "Shalat 5 waktu",
    kriteria_lainnya: "",
    bersedia_poligami: null,
    bersedia_pindah_domisili: null,
  },

  // ── Step 12: Financial Planning ──────────────────────────
  financialPlanning: {
    penghasilan_range: "10-20jt",
    kebutuhan_pokok_persen: 50,
    tabungan_persen: 15,
    investasi_persen: 15,
    sedekah_persen: 10,
    lainnya_persen: 10,
    deskripsi: "Berusaha mengelola keuangan dengan prinsip syariah.",
  },

  // ── Step 13: Pandangan Isu ───────────────────────────────
  pandanganIsu: {
    pandangan_isu:
      "Pernikahan adalah ibadah yang memerlukan keseriusan, bukan sekadar formalitas. Komunikasi terbuka dan niat lurus adalah kunci.",
    pandangan_istri_bekerja: "Boleh dengan kesepakatan bersama",
    pandangan_kb: "Ikut pendapat ulama yang terpercaya",
    pandangan_parenting: "Mendidik dengan kasih sayang dan konsistensi",
    pandangan_mertua: "Saling menghormati, menjaga silaturahim",
  },

  // ── Step 14: Anggota Keluarga ────────────────────────────
  anggotaKeluarga: [
    {
      id: "fam-1",
      hubungan: "Ayah",
      nama: "H. Abdul Hakim",
      pekerjaan: "PNS",
      pendidikan: "S1",
      keterangan: "",
      urutan: 1,
    },
    {
      id: "fam-2",
      hubungan: "Ibu",
      nama: "Hj. Siti Aminah",
      pekerjaan: "Guru SMA",
      pendidikan: "S1",
      keterangan: "",
      urutan: 2,
    },
    {
      id: "fam-3",
      hubungan: "Adik",
      nama: "Muhammad Rizki",
      pekerjaan: "Mahasiswa",
      pendidikan: "S1",
      keterangan: "",
      urutan: 3,
    },
  ],

  // ── Step 15: Rencana Masa Depan ──────────────────────────
  rencanaMasaDepan: [],

  // ── Step 16: Sosial Media ────────────────────────────────
  sosialMedia: [
    {
      id: "soc-1",
      platform: "WhatsApp",
      username: "0812-xxxx-xxxx",
      url: "",
      is_primary: true,
      tampil_di_pdf: true,
      urutan: 1,
    },
    {
      id: "soc-2",
      platform: "Instagram",
      username: "@fauzan.hakim",
      url: "",
      is_primary: false,
      tampil_di_pdf: false,
      urutan: 2,
    },
  ],

  // ── Step 17: Galeri Foto ─────────────────────────────────
  galeriFoto: [],

  // ── Step 18: Foto & Template ─────────────────────────────
  fotoTemplate: {
    foto_pribadi_url: "",
    foto_formal_url: "",
    template_pilihan: "akademik",
  },

  // ── Metadata ──────────────────────────────────────────────
  profileId: null,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  plan: "free",
}