-- ============================================================
-- TaarufCV — Supabase Schema
-- Eksekusi file ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Data akun pengguna TaarufCV';
COMMENT ON COLUMN public.users.plan IS 'free = 7 step, 1 template; premium = 22 step, 3 template';

-- ============================================================
-- 2. TAARUF_PROFILES (Data statis / scalar per profil)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.taaruf_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Step 1: Data Pribadi
  nama_lengkap        TEXT,
  nama_panggilan      TEXT,
  tempat_lahir        TEXT,
  tanggal_lahir       DATE,
  kewarganegaraan     TEXT DEFAULT 'Indonesia',
  suku_bangsa         TEXT,
  domisili_kota       TEXT,
  domisili_provinsi   TEXT,
  status_pernikahan   TEXT CHECK (status_pernikahan IN ('lajang', 'duda', 'janda', 'cerai_mati', 'cerai_hidup')),
  jumlah_anak         INTEGER DEFAULT 0,

  -- Step 2: Data Fisik & Kesehatan
  tinggi_badan        INTEGER,  -- cm
  berat_badan         INTEGER,  -- kg
  golongan_darah      TEXT CHECK (golongan_darah IN ('A', 'B', 'AB', 'O', 'Tidak Tahu')),
  warna_kulit         TEXT,
  kondisi_kesehatan   TEXT,     -- deskripsi bebas
  riwayat_penyakit    TEXT,
  kebutuhan_khusus    TEXT,

  -- Step 3: Pendidikan Terakhir (ringkasan, detail ada di tabel riwayat_pendidikan)
  pendidikan_terakhir TEXT,     -- S1, S2, S3, SMA, dll
  jurusan_terakhir    TEXT,
  institusi_terakhir  TEXT,

  -- Step 4: Karakter & Kepribadian
  karakter_diri       TEXT,
  kelebihan           JSONB DEFAULT '[]'::JSONB,   -- array of string
  kekurangan          JSONB DEFAULT '[]'::JSONB,   -- array of string
  hobi                JSONB DEFAULT '[]'::JSONB,   -- array of string
  mbti_type           TEXT,
  bahasa_cinta        TEXT,

  -- Step 5: Ibadah & Keislaman
  mazhab              TEXT,
  cara_berpakaian     TEXT,
  shalat_fardhu       TEXT CHECK (shalat_fardhu IN ('selalu_berjamaah', 'sering_berjamaah', 'sering_sendiri', 'kadang', 'masih_berjuang')),
  shalat_sunnah       TEXT,
  tilawah_rutin       BOOLEAN DEFAULT FALSE,
  hafalan_quran       TEXT,     -- misal: "Juz 30", "5 Juz"
  kajian_rutin        BOOLEAN DEFAULT FALSE,
  deskripsi_ibadah    TEXT,

  -- Step 6: Gaya Hidup
  gaya_hidup          TEXT,
  pola_makan          TEXT,
  olahraga_rutin      BOOLEAN DEFAULT FALSE,
  tipe_introvert_ekstrovert TEXT CHECK (tipe_introvert_ekstrovert IN ('introvert', 'ekstrovert', 'ambivert')),
  kebiasaan_positif   TEXT,
  hal_tidak_disukai   TEXT,

  -- Step 7: Visi & Misi Pernikahan
  visi_misi           JSONB DEFAULT '{}'::JSONB,
  -- Struktur: { visi: string, misi_suami: string, misi_istri: string, tujuan_pernikahan: string[] }

  -- Step 8: Kriteria Pasangan
  kriteria_usia_min       INTEGER,
  kriteria_usia_max       INTEGER,
  kriteria_domisili        TEXT,
  kriteria_pendidikan      TEXT,
  kriteria_pekerjaan       TEXT,
  kriteria_karakter        TEXT,
  kriteria_ibadah          TEXT,
  kriteria_lainnya         TEXT,
  bersedia_poligami        BOOLEAN,
  bersedia_pindah_domisili BOOLEAN,

  -- Step 9: Financial Planning
  financial_planning  JSONB DEFAULT '{}'::JSONB,
  -- Struktur: { penghasilan_bulanan: number, tabungan_persen: number, kebutuhan_pokok_persen: number,
  --             investasi_persen: number, sedekah_persen: number, lainnya_persen: number, deskripsi: string }

  -- Step 10: Pandangan Isu Pernikahan
  pandangan_isu       TEXT,
  pandangan_istri_bekerja TEXT,
  pandangan_kb         TEXT,
  pandangan_parenting  TEXT,
  pandangan_mertua     TEXT,

  -- Foto & Template
  foto_pribadi_url    TEXT,   -- URL dari Supabase Storage
  foto_formal_url     TEXT,
  template_pilihan    TEXT NOT NULL DEFAULT 'akademik' CHECK (template_pilihan IN ('akademik', 'elegant_islamic', 'modern_dark')),

  -- Metadata
  is_published        BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.taaruf_profiles IS 'Data profil taaruf utama (scalar fields)';
CREATE INDEX idx_taaruf_profiles_user_id ON public.taaruf_profiles(user_id);

-- ============================================================
-- 3. RIWAYAT_PENDIDIKAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.riwayat_pendidikan (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  jenjang         TEXT NOT NULL, -- SD, SMP, SMA, S1, S2, S3, Pesantren, Kursus, dll
  nama_institusi  TEXT NOT NULL,
  jurusan         TEXT,
  tahun_mulai     INTEGER,
  tahun_selesai   INTEGER,
  prestasi        TEXT,
  urutan          INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.riwayat_pendidikan IS 'Riwayat pendidikan per profil';
CREATE INDEX idx_riwayat_pendidikan_profile_id ON public.riwayat_pendidikan(profile_id);

-- ============================================================
-- 4. RIWAYAT_PEKERJAAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.riwayat_pekerjaan (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id           UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  nama_perusahaan      TEXT NOT NULL,
  posisi_jabatan       TEXT NOT NULL,
  deskripsi_pekerjaan  TEXT,
  is_masih_aktif       BOOLEAN NOT NULL DEFAULT FALSE,
  tahun_mulai          INTEGER,
  tahun_selesai        INTEGER,  -- NULL jika is_masih_aktif = true
  urutan               INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.riwayat_pekerjaan IS 'Riwayat pekerjaan per profil';
CREATE INDEX idx_riwayat_pekerjaan_profile_id ON public.riwayat_pekerjaan(profile_id);

-- ============================================================
-- 5. PERJALANAN_HIDUP
-- ============================================================
CREATE TABLE IF NOT EXISTS public.perjalanan_hidup (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  fase        TEXT NOT NULL, -- masa_kecil, remaja, dewasa_awal, saat_ini
  judul       TEXT NOT NULL,
  cerita      TEXT,
  pelajaran   TEXT,
  tahun_mulai INTEGER,
  tahun_selesai INTEGER,
  urutan      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.perjalanan_hidup IS 'Fase-fase perjalanan hidup per profil';
CREATE INDEX idx_perjalanan_hidup_profile_id ON public.perjalanan_hidup(profile_id);

-- ============================================================
-- 6. RIWAYAT_ORGANISASI
-- ============================================================
CREATE TABLE IF NOT EXISTS public.riwayat_organisasi (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id        UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  nama_organisasi   TEXT NOT NULL,
  jabatan           TEXT,
  deskripsi         TEXT,
  tahun_mulai       INTEGER,
  tahun_selesai     INTEGER,
  urutan            INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.riwayat_organisasi IS 'Riwayat organisasi per profil';
CREATE INDEX idx_riwayat_organisasi_profile_id ON public.riwayat_organisasi(profile_id);

-- ============================================================
-- 7. SOSIAL_MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sosial_media (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id        UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  platform          TEXT NOT NULL CHECK (platform IN ('WhatsApp', 'Instagram', 'LinkedIn', 'TikTok', 'Twitter', 'Facebook', 'YouTube', 'Telegram', 'Lainnya')),
  username          TEXT NOT NULL,
  url               TEXT,
  is_primary        BOOLEAN NOT NULL DEFAULT FALSE,
  tampil_di_pdf     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.sosial_media IS 'Data sosial media per profil';
CREATE INDEX idx_sosial_media_profile_id ON public.sosial_media(profile_id);

-- ============================================================
-- 8. GALERI_FOTO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.galeri_foto (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  kategori    TEXT NOT NULL CHECK (kategori IN ('formal', 'aktivitas', 'keluarga', 'prestasi', 'lainnya')),
  url         TEXT NOT NULL,  -- URL Supabase Storage
  keterangan  TEXT,
  urutan      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.galeri_foto IS 'Galeri foto per profil';
CREATE INDEX idx_galeri_foto_profile_id ON public.galeri_foto(profile_id);

-- ============================================================
-- 9. ANGGOTA_KELUARGA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.anggota_keluarga (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  hubungan    TEXT NOT NULL CHECK (hubungan IN ('Ayah', 'Ibu', 'Kakak', 'Adik', 'Wali', 'Lainnya')),
  nama        TEXT NOT NULL,
  pekerjaan   TEXT,
  pendidikan  TEXT,
  keterangan  TEXT,
  urutan      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.anggota_keluarga IS 'Data anggota keluarga per profil';
CREATE INDEX idx_anggota_keluarga_profile_id ON public.anggota_keluarga(profile_id);

-- ============================================================
-- 10. RENCANA_MASA_DEPAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rencana_masa_depan (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID NOT NULL REFERENCES public.taaruf_profiles(id) ON DELETE CASCADE,
  tipe        TEXT NOT NULL CHECK (tipe IN ('pendek', 'panjang')),
  -- pendek: 1-2 tahun, panjang: 5-10 tahun
  waktu       TEXT,  -- contoh: "1 Tahun", "5 Tahun", "2026-2027"
  rencana     TEXT NOT NULL,
  target      TEXT,
  urutan      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.rencana_masa_depan IS 'Rencana masa depan per profil';
CREATE INDEX idx_rencana_masa_depan_profile_id ON public.rencana_masa_depan(profile_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taaruf_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_pendidikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_pekerjaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perjalanan_hidup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_organisasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sosial_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota_keluarga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rencana_masa_depan ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa akses data miliknya sendiri
CREATE POLICY "Users can manage own data"
  ON public.users FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own profiles"
  ON public.taaruf_profiles FOR ALL
  USING (auth.uid() = user_id);

-- Policy untuk tabel relasi: akses melalui profile_id yang dimiliki user
CREATE POLICY "Users can manage own pendidikan"
  ON public.riwayat_pendidikan FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own pekerjaan"
  ON public.riwayat_pekerjaan FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own perjalanan_hidup"
  ON public.perjalanan_hidup FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own organisasi"
  ON public.riwayat_organisasi FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own sosmed"
  ON public.sosial_media FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own galeri"
  ON public.galeri_foto FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own keluarga"
  ON public.anggota_keluarga FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own rencana"
  ON public.rencana_masa_depan FOR ALL
  USING (profile_id IN (SELECT id FROM public.taaruf_profiles WHERE user_id = auth.uid()));

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.taaruf_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- SUPABASE STORAGE BUCKETS
-- ============================================================
-- Jalankan via Supabase Dashboard > Storage, atau via SQL:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gallery-photos', 'gallery-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policy
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('profile-photos', 'gallery-photos'));

CREATE POLICY "Allow public reads"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('profile-photos', 'gallery-photos'));

CREATE POLICY "Allow owner delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (auth.uid()::text = (storage.foldername(name))[1]);
