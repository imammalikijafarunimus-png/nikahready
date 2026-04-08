// ============================================================
// src/lib/sample-state.ts
//
// Data preview landing page — 100% selaras dengan types/index.ts
// Optimized: setiap template (free + premium) tampil maksimal
//
// Limits yang dipakai:
//   riwayatPendidikan:  max 3 (free) / 5 (pro)  → ambil 3
//   riwayatPekerjaan:   max 2 (free) / 4 (pro)  → ambil 2
//   perjalananHidup:    max 0 (free) / 5 (pro)  → ambil 3 (premium only)
//   riwayatOrganisasi:  max 0 (free) / 3 (pro)  → ambil 2 (premium only)
//   anggotaKeluarga:    max 3 (free) / 6 (pro)  → ambil 4
//   rencanaMasaDepan:   max 0 (free) / 4 (pro)  → ambil 2 (premium only)
//   sosialMedia:        max 2 (free) / 5 (pro)  → ambil 2 (both tampil_di_pdf)
//   galeriFoto:         max 0 (free) / 8 (pro)  → empty (preview only)
//   tags (kelebihan dll): max 3 (free) / 5 (pro) → ambil 4
// ============================================================

import type { FormState } from "@/types"

export const SAMPLE_STATE: FormState = {
  // ── Navigation ─────────────────────────────────────────────
  currentStep: 1,
  totalSteps: 22,

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

  // ── Step 3: Pendidikan (3 item — sesuai free max) ─────────
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
    {
      id: "edu-2",
      jenjang: "SMA",
      nama_institusi: "SMAN 1 Jakarta",
      jurusan: "IPA",
      tahun_mulai: 2010,
      tahun_selesai: 2013,
      prestasi: "",
      urutan: 2,
    },
    {
      id: "edu-3",
      jenjang: "SMP",
      nama_institusi: "SMP Islam Al-Azhar",
      jurusan: "",
      tahun_mulai: 2007,
      tahun_selesai: 2010,
      prestasi: "",
      urutan: 3,
    },
  ],

  // ── Step 4: Pekerjaan (2 item — sesuai free max) ─────────
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
    {
      id: "job-2",
      nama_perusahaan: "Startup Pendidikan",
      posisi_jabatan: "Frontend Developer",
      deskripsi_pekerjaan: "Membangun platform e-learning untuk pesantren.",
      is_masih_aktif: false,
      tahun_mulai: 2021,
      tahun_selesai: 2023,
      urutan: 2,
    },
  ],

  // ── Step 5: Perjalanan Hidup (3 item — premium only) ─────
  perjalananHidup: [
    {
      id: "ph-1",
      fase: "masa_kecil",
      judul: "Kecil di Jakarta",
      cerita: "Dibesarkan di lingkungan keluarga yang religius. Ayah selalu mengajak shalat berjamaah di masjid sejak kecil.",
      pelajaran: "Keteladanan orang tua membentuk fondasi keimanan yang kuat.",
      tahun_mulai: 1995,
      tahun_selesai: 2007,
      urutan: 1,
    },
    {
      id: "ph-2",
      fase: "remaja",
      judul: "Aktif di Remaja Masjid",
      cerita: "Menjadi ketua divisi kajian remaja masjid. Mulai belajar membaca Al-Quran dengan tajwid yang benar.",
      pelajaran: "Berkarya di jalan Allah sejak muda memberi keberkahan dalam hidup.",
      tahun_mulai: 2007,
      tahun_selesai: 2013,
      urutan: 2,
    },
    {
      id: "ph-3",
      fase: "dewasa_awal",
      judul: "Merantau & Bekerja",
      cerita: "Menyelesaikan kuliah sambil aktif di organisasi kampus. Memulai karir di dunia teknologi sambil tetap istiqomah mengaji.",
      pelajaran: "Dunia kerja mengajarkan kesabaran dan pentingnya menjaga niat ikhlas.",
      tahun_mulai: 2013,
      tahun_selesai: "",
      urutan: 3,
    },
  ],

  // ── Step 6: Organisasi (2 item — premium only) ────────────
  riwayatOrganisasi: [
    {
      id: "org-1",
      nama_organisasi: "Remaja Masjid Al-Ikhlas",
      jabatan: "Ketua Divisi Kajian",
      deskripsi: "Mengelola kajian rutin mingguan untuk remaja masjid.",
      tahun_mulai: 2011,
      tahun_selesai: 2013,
      urutan: 1,
    },
    {
      id: "org-2",
      nama_organisasi: "UKM Dakwah Kampus",
      jabatan: "Koordinator Acara",
      deskripsi: "Menyelenggarakan seminar dan kajian terbuka di kampus.",
      tahun_mulai: 2014,
      tahun_selesai: 2016,
      urutan: 2,
    },
  ],

  // ── Step 7: Karakter (tags sesuai max) ────────────────────
  karakter: {
    karakter_diri:
      "Pribadi yang mudah bergaul, bertanggung jawab, dan menjunjung tinggi adab. Menyukai diskusi ilmiah serta aktif di kegiatan sosial masjid. Berusaha menjadi pribadi yang lebih baik setiap harinya.",
    kelebihan: ["Disiplin", "Jujur", "Peduli", "Rajin"],
    kekurangan: ["Kadang terlalu serius", "Kurang ekspresif"],
    hobi: ["Membaca", "Futsal", "Coding"],
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
      "Alhamdulillah berusaha istiqomah dalam shalat berjamaah dan mengikuti kajian mingguan di masjid.",
  },

  // ── Step 9: Gaya Hidup ────────────────────────────────────
  gayaHidup: {
    gaya_hidup: "Sederhana",
    pola_makan: "Makanan rumahan",
    olahraga_rutin: true,
    tipe_kepribadian: "ambivert",
    kebiasaan_positif:
      "Bangun subuh, membaca minimal 10 halaman buku per hari",
    hal_tidak_disukai: "Sikap sombong & boros",
  },

  // ── Step 10: Visi Misi ───────────────────────────────────
  visiMisi: {
    visi: "Membangun keluarga sakinah yang menjadi cerminan cinta Rasulullah SAW untuk menuju ridha Allah SWT",
    misi_suami:
      "Menjadi pemimpin yang adil, penyejuk hati istri, dan pelindung keluarga dengan penuh tanggung jawab",
    misi_istri:
      "Mendidik anak dengan penuh kasih sayang, menjadi istri yang shalihah dan pendamping suami yang setia",
    tujuan_pernikahan: ["Sakinah", "Mawaddah", "Warahmah"],
  },

  // ── Step 11: Kriteria ─────────────────────────────────────
  kriteria: {
    kriteria_usia_min: 22,
    kriteria_usia_max: 28,
    kriteria_domisili: "Jakarta atau sekitarnya",
    kriteria_pendidikan: "Minimal D3",
    kriteria_pekerjaan: "Tidak terikat",
    kriteria_karakter: "Sabar, penyayang, istiqomah dalam ibadah",
    kriteria_ibadah: "Shalat 5 waktu",
    kriteria_lainnya: "",
    bersedia_poligami: null,
    bersedia_pindah_domisili: null,
  },

  // ── Step 12: Financial Planning (premium — total 100%) ───
  financialPlanning: {
    penghasilan_range: "10-20jt",
    kebutuhan_pokok_persen: 50,
    tabungan_persen: 15,
    investasi_persen: 15,
    sedekah_persen: 10,
    lainnya_persen: 10,
    deskripsi: "Berusaha mengelola keuangan keluarga dengan prinsip syariah dan perencanaan yang matang.",
  },

  // ── Step 13: Pandangan Isu (premium) ─────────────────────
  pandanganIsu: {
    pandangan_isu:
      "Pernikahan adalah ibadah yang memerlukan keseriusan, bukan sekadar formalitas. Komunikasi terbuka dan niat lurus adalah kunci keberhasilan rumah tangga.",
    pandangan_istri_bekerja: "Boleh dengan kesepakatan bersama dan tetap menjaga prioritas keluarga",
    pandangan_kb: "Ikut pendapat ulama yang terpercaya, mengutamakan kemaslahatan",
    pandangan_parenting: "Mendidik dengan kasih sayang, konsistensi, dan keteladanan",
    pandangan_mertua: "Saling menghormati, menjaga silaturahim, dan komunikasi yang baik",
  },

  // ── Step 14: Anggota Keluarga (4 item — > free 3, ≤ pro 6)
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
      nama: "Muhammad Rizki Hakim",
      pekerjaan: "Mahasiswa",
      pendidikan: "S1",
      keterangan: "",
      urutan: 3,
    },
    {
      id: "fam-4",
      hubungan: "Adik",
      nama: "Fatimah Azzahra",
      pekerjaan: "SMA",
      pendidikan: "SMA",
      keterangan: "",
      urutan: 4,
    },
  ],

  // ── Step 15: Rencana Masa Depan (2 item — premium only) ───
  rencanaMasaDepan: [
    {
      id: "plan-1",
      tipe: "pendek",
      rencana: "Naik posisi Senior Engineer",
      target: "Ingin berkembang di bidang teknologi dan mengambil peran kepemimpinan di tim engineering.",
      waktu: "2026",
      urutan: 1,
    },
    {
      id: "plan-2",
      tipe: "pendek",
      rencana: "Menikah dan membangun rumah tangga",
      target: "Mempersiapkan diri secara lahir dan batin untuk menjadi kepala keluarga yang bertanggung jawab.",
      waktu: "2025",
      urutan: 2,
    },
  ],

  // ── Step 16: Sosial Media (2 item, keduanya tampil_di_pdf)
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
      tampil_di_pdf: true,
      urutan: 2,
    },
  ],

  // ── Step 17: Galeri Foto (kosong — preview only) ─────────
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
  plan: "premium", // preview: tampilkan semua fitur premium
}