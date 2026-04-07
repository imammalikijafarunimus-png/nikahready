// ============================================================
// src/components/templates/TemplateAkademik.tsx
//
// Template CV Taaruf — Gaya Akademik Islami (PREMIUM)
// Warna: Sage Green (#064E3B), Navy (#0F172A), Gold (#D97706)
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style (bukan CSS var / Tailwind color)
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, box-shadow spread
// ✓ Flexbox / explicit grid — tidak ada auto row height pada grid
// ✓ Font: Inter (body) dan Amiri (Arabic) — sudah di-preload di layout.tsx
// ✓ NO emojis — hanya teks dan bentuk (SVG)
// ✓ Semua token dari @/lib/pdf-tokens, komponen dari @/lib/pdf-shared-components
// ============================================================

import React from 'react'
import type {
  FormState,
  RiwayatPendidikanItem,
  RiwayatPekerjaanItem,
  PerjalananHidupItem,
  RiwayatOrganisasiItem,
  AnggotaKeluargaItem,
} from '@/types'

// ── Shared Design Tokens ──────────────────────────────────────
import {
  THEME_SAGE,
  SPACING,
  FONT,
  PAGE_W,
  PAGE_H,
  FASE_COLORS,
  FINANCIAL_COLORS,
  STATUS_LABELS,
  SHALAT_LABELS,
  TIPE_LABELS,
  hitungUsia,
  formatTTL,
} from '@/lib/pdf-tokens'

// ── Shared Components ─────────────────────────────────────────
import {
  PdfPage,
  PdfSectionHeading,
  PdfInfoRow,
  PdfTag,
  PdfTimelineItem,
  PdfPhaseItem,
  PdfFinancialBar,
  PdfPhotoPlaceholder,
  PdfPageFooter,
  PdfDivider,
  PdfFamilyCard,
} from '@/lib/pdf-shared-components'

// ── Theme alias for convenience ───────────────────────────────
const T = THEME_SAGE

// ── Page padding (premium) ────────────────────────────────────
const PAD = SPACING.pagePadPremium
const TOTAL_PAGES = 5

// ── PAGE 1: Cover + Biodata + Fisik + Keluarga + Sosmed ──────
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const f = state.fisikKesehatan
  const nama = p.nama_lengkap || 'Nama Lengkap'
  const kontakWA = state.sosialMedia.find(
    (s) => s.platform === 'WhatsApp' && s.tampil_di_pdf
  )

  const usia = hitungUsia(p.tanggal_lahir)

  return (
    <PdfPage bg={T.bg} pad={PAD}>
      {/* ── Header Banner ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: T.primary,
          padding: `${PAD}px ${PAD}px 28px`,
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 60, height: 60, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }} />

        {/* Bismillah */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p
            style={{
              fontFamily: "'Amiri', Georgia, serif",
              fontSize: FONT.arabic,
              color: T.accentGoldAlt,
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <p style={{ fontSize: FONT.micro, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            Bismillahirrahmanirrahim
          </p>
        </div>

        {/* Foto + Nama */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
          {/* Foto profil */}
          <div style={{ flexShrink: 0 }}>
            {state.fotoTemplate.foto_pribadi_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={state.fotoTemplate.foto_pribadi_url}
                alt={nama}
                style={{
                  width: 100,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: `3px solid ${T.accentGold}`,
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 120,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: `2px dashed ${T.accentGold}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                {/* User SVG icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Foto Profil</span>
              </div>
            )}
          </div>

          {/* Nama + info utama */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: FONT.name,
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {nama}
            </h1>
            {p.nama_panggilan && (
              <p style={{ fontSize: FONT.subheading, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontStyle: 'italic' }}>
                &lsquo;{p.nama_panggilan}&rsquo;
              </p>
            )}

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {usia && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: FONT.body, color: '#FFFFFF', fontWeight: 500,
                }}>
                  {usia} tahun
                </span>
              )}
              {p.domisili_kota && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: FONT.body, color: '#FFFFFF', fontWeight: 500,
                }}>
                  {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
                </span>
              )}
              {p.status_pernikahan && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: T.accentGold,
                  fontSize: FONT.body, color: '#FFFFFF', fontWeight: 600,
                }}>
                  {STATUS_LABELS[p.status_pernikahan] ?? p.status_pernikahan}
                </span>
              )}
            </div>

            {/* Kontak WA */}
            {kontakWA && (
              <p style={{ fontSize: FONT.body, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                WhatsApp: {kontakWA.username}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Body Content ─────────────────────────────────────── */}
      <div style={{ padding: `24px ${PAD}px ${SPACING.pageBottom + 8}px` }}>
        {/* Data Pribadi + Fisik (2 kolom) */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Kolom kiri: Data Pribadi */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <PdfSectionHeading title="Data Pribadi" color={T.primary} accentColor={T.accentGold} />
            <PdfInfoRow label="Nama Lengkap" value={p.nama_lengkap} />
            {p.tempat_lahir && p.tanggal_lahir && (
              <PdfInfoRow
                label="Tempat, Tanggal Lahir"
                value={formatTTL(p.tempat_lahir, p.tanggal_lahir)}
              />
            )}
            <PdfInfoRow label="Kewarganegaraan" value={p.kewarganegaraan} />
            <PdfInfoRow label="Suku Bangsa" value={p.suku_bangsa} />
            <PdfInfoRow label="Domisili" value={[p.domisili_kota, p.domisili_provinsi].filter(Boolean).join(', ')} />
            <PdfInfoRow label="Status Pernikahan" value={STATUS_LABELS[p.status_pernikahan ?? ''] ?? ''} />
            {p.jumlah_anak > 0 && (
              <PdfInfoRow label="Jumlah Anak" value={`${p.jumlah_anak} anak`} />
            )}
          </div>

          {/* Kolom kanan: Fisik & Kesehatan */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <PdfSectionHeading title="Fisik & Kesehatan" color={T.primary} accentColor={T.accentGold} />
            {f.tinggi_badan && f.berat_badan && (
              <PdfInfoRow label="Tinggi / Berat" value={`${f.tinggi_badan} cm / ${f.berat_badan} kg`} />
            )}
            <PdfInfoRow label="Golongan Darah" value={f.golongan_darah || null} />
            <PdfInfoRow label="Warna Kulit" value={f.warna_kulit} />
            {f.kondisi_kesehatan && (
              <PdfInfoRow label="Kondisi Kesehatan" value={f.kondisi_kesehatan} />
            )}
            {f.riwayat_penyakit && (
              <PdfInfoRow label="Riwayat Penyakit" value={f.riwayat_penyakit} />
            )}
            {f.kebutuhan_khusus && (
              <PdfInfoRow label="Kebutuhan Khusus" value={f.kebutuhan_khusus} />
            )}
          </div>
        </div>

        {/* Divider */}
        <PdfDivider color={T.divider} margin="20px 0" />

        {/* Keluarga */}
        {state.anggotaKeluarga.length > 0 && (
          <>
            <PdfSectionHeading title="Latar Belakang Keluarga" color={T.primary} accentColor={T.accentGold} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              {state.anggotaKeluarga.map((anggota: AnggotaKeluargaItem) => (
                <PdfFamilyCard
                  key={anggota.id}
                  hubungan={anggota.hubungan}
                  nama={anggota.nama}
                  pekerjaan={anggota.pekerjaan}
                  pendidikan={anggota.pendidikan}
                  accentColor={T.accent}
                />
              ))}
            </div>
            <PdfDivider color={T.divider} margin="20px 0" />
          </>
        )}

        {/* Sosial media yang tampil di PDF */}
        {state.sosialMedia.filter((s) => s.tampil_di_pdf).length > 1 && (
          <>
            <PdfSectionHeading title="Sosial Media & Kontak" color={T.primary} accentColor={T.accentGold} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
              {state.sosialMedia
                .filter((s) => s.tampil_di_pdf)
                .map((s) => (
                  <span key={s.id} style={{ fontSize: FONT.body, color: T.textMid }}>
                    <strong style={{ color: T.text }}>{s.platform}</strong>: {s.username}
                  </span>
                ))}
            </div>
          </>
        )}
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={1}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        pad={PAD}
      />
    </PdfPage>
  )
}

// ── PAGE 2: Pendidikan + Pekerjaan + Organisasi ───────────────
function Page2({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <PdfPage bg={T.bg} pad={PAD}>
      <div style={{ padding: `0 0 ${SPACING.pageBottom + 8}px` }}>
        {/* ── Riwayat Pendidikan ─────────────────────────── */}
        {state.riwayatPendidikan.length > 0 && (
          <>
            <PdfSectionHeading title="Riwayat Pendidikan" color={T.primary} accentColor={T.accentGold} />
            <div style={{ marginBottom: 24 }}>
              {state.riwayatPendidikan.map((item: RiwayatPendidikanItem, i: number) => (
                <PdfTimelineItem
                  key={item.id}
                  year={item.tahun_selesai ? String(item.tahun_selesai) : item.tahun_mulai ? `${item.tahun_mulai}–` : undefined}
                  isLast={i === state.riwayatPendidikan.length - 1}
                  dotColor={T.accent}
                  lineColor={T.bgAlt}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                    {item.jenjang} {item.jurusan ? `— ${item.jurusan}` : ''}
                  </p>
                  <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                    {item.nama_institusi}
                    {item.tahun_mulai && item.tahun_selesai
                      ? ` · ${item.tahun_mulai}–${item.tahun_selesai}`
                      : ''}
                  </p>
                  {item.prestasi && (
                    <p style={{ fontSize: FONT.body, color: T.tertiary, marginTop: 3, fontStyle: 'italic' }}>
                      Prestasi: {item.prestasi}
                    </p>
                  )}
                </PdfTimelineItem>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {state.riwayatPendidikan.length > 0 && state.riwayatPekerjaan.length > 0 && (
          <PdfDivider color={T.divider} margin="4px 0 20px" />
        )}

        {/* ── Riwayat Pekerjaan ──────────────────────────── */}
        {state.riwayatPekerjaan.length > 0 && (
          <>
            <PdfSectionHeading title="Riwayat Pekerjaan" color={T.primary} accentColor={T.accentGold} />
            <div style={{ marginBottom: 24 }}>
              {state.riwayatPekerjaan.map((item: RiwayatPekerjaanItem, i: number) => (
                <PdfTimelineItem
                  key={item.id}
                  year={item.is_masih_aktif ? 'Kini' : item.tahun_selesai ? String(item.tahun_selesai) : undefined}
                  isLast={i === state.riwayatPekerjaan.length - 1}
                  dotColor={T.accent}
                  lineColor={T.bgAlt}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                    {item.posisi_jabatan}
                    {item.is_masih_aktif && (
                      <span style={{
                        marginLeft: 6, padding: '1px 6px', borderRadius: 999,
                        backgroundColor: T.bgAlt, color: T.secondary,
                        fontSize: FONT.micro, fontWeight: 600,
                      }}>
                        Aktif
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                    {item.nama_perusahaan}
                    {item.tahun_mulai
                      ? ` · ${item.tahun_mulai}${item.is_masih_aktif ? ' – sekarang' : item.tahun_selesai ? ` – ${item.tahun_selesai}` : ''}`
                      : ''}
                  </p>
                  {item.deskripsi_pekerjaan && (
                    <p style={{ fontSize: FONT.body, color: T.textMid, marginTop: 4, lineHeight: 1.5 }}>
                      {item.deskripsi_pekerjaan}
                    </p>
                  )}
                </PdfTimelineItem>
              ))}
            </div>
          </>
        )}

        {/* ── Riwayat Organisasi ─────────────────────────── */}
        {state.riwayatOrganisasi.length > 0 && (
          <>
            <PdfDivider color={T.divider} margin="4px 0 20px" />
            <PdfSectionHeading title="Riwayat Organisasi" color={T.primary} accentColor={T.accentGold} />
            <div>
              {state.riwayatOrganisasi.map((item: RiwayatOrganisasiItem, i: number) => (
                <PdfTimelineItem
                  key={item.id}
                  year={item.tahun_selesai ? String(item.tahun_selesai) : undefined}
                  isLast={i === state.riwayatOrganisasi.length - 1}
                  dotColor={T.accent}
                  lineColor={T.bgAlt}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                    {item.jabatan || item.nama_organisasi}
                  </p>
                  <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                    {item.nama_organisasi}
                    {item.tahun_mulai && ` · ${item.tahun_mulai}${item.tahun_selesai ? `–${item.tahun_selesai}` : ''}`}
                  </p>
                  {item.deskripsi && (
                    <p style={{ fontSize: FONT.body, color: T.textMid, marginTop: 3 }}>{item.deskripsi}</p>
                  )}
                </PdfTimelineItem>
              ))}
            </div>
          </>
        )}
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={2}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        pad={PAD}
      />
    </PdfPage>
  )
}

// ── PAGE 3: Perjalanan Hidup ──────────────────────────────────
function Page3({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <PdfPage bg={T.bg} pad={PAD}>
      <div style={{ padding: `0 0 ${SPACING.pageBottom + 8}px` }}>
        {/* Ayat pembuka halaman 3 */}
        <div
          style={{
            backgroundColor: T.bgAlt,
            border: `1px solid ${T.accent}`,
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
            textAlign: 'center',
            borderWidth: 1,
            borderStyle: 'solid',
          }}
        >
          <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 14, color: T.accentGold, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
            وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
          </p>
          <p style={{ fontSize: FONT.micro, color: T.textSoft, marginTop: 4, fontStyle: 'italic' }}>
            &ldquo;Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu&rdquo; — QS Al-Baqarah: 216
          </p>
        </div>

        <PdfSectionHeading title="Perjalanan Hidup" color={T.primary} accentColor={T.accentGold} />

        <div>
          {state.perjalananHidup.map((item: PerjalananHidupItem, i: number) => (
            <PdfPhaseItem
              key={item.id}
              fase={item.fase}
              judul={item.judul}
              cerita={item.cerita}
              pelajaran={item.pelajaran}
              tahunMulai={item.tahun_mulai ? String(item.tahun_mulai) : undefined}
              tahunSelesai={item.tahun_selesai ? String(item.tahun_selesai) : undefined}
              isLast={i === state.perjalananHidup.length - 1}
            />
          ))}
        </div>
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={3}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        pad={PAD}
      />
    </PdfPage>
  )
}

// ── PAGE 4: Karakter + Ibadah + Gaya Hidup ───────────────────
function Page4({ state }: { state: FormState }) {
  const nama   = state.dataPribadi.nama_lengkap || 'Nama'
  const k      = state.karakter
  const ibadah = state.ibadah
  const gl     = state.gayaHidup

  return (
    <PdfPage bg={T.bg} pad={PAD}>
      <div style={{ padding: `0 0 ${SPACING.pageBottom + 8}px` }}>

        {/* ── Karakter & Kepribadian ────────────────────── */}
        <PdfSectionHeading title="Karakter & Kepribadian" color={T.primary} accentColor={T.accentGold} />

        {k.karakter_diri && (
          <p style={{ fontSize: FONT.subheading, color: T.textMid, lineHeight: 1.6, marginBottom: 14 }}>
            {k.karakter_diri}
          </p>
        )}

        <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
          {/* Kelebihan */}
          {k.kelebihan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: FONT.micro, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kelebihan
              </p>
              <div>{k.kelebihan.map((tag) => <PdfTag key={tag} text={tag} variant="primary" />)}</div>
            </div>
          )}

          {/* Kekurangan */}
          {k.kekurangan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: FONT.micro, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kekurangan
              </p>
              <div>{k.kekurangan.map((tag) => <PdfTag key={tag} text={tag} variant="muted" />)}</div>
            </div>
          )}
        </div>

        {/* Hobi + MBTI */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 6 }}>
          {k.hobi.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: FONT.micro, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Hobi & Minat
              </p>
              <div>{k.hobi.map((tag) => <PdfTag key={tag} text={tag} variant="accent" />)}</div>
            </div>
          )}
          <div style={{ width: 160, flexShrink: 0 }}>
            {k.mbti_type && <PdfInfoRow label="Tipe MBTI" value={k.mbti_type} />}
            {k.bahasa_cinta && <PdfInfoRow label="Bahasa Cinta" value={k.bahasa_cinta.replace(/_/g, ' ')} />}
            {gl.tipe_kepribadian && (
              <PdfInfoRow label="Tipe Kepribadian" value={TIPE_LABELS[gl.tipe_kepribadian] ?? ''} />
            )}
          </div>
        </div>

        {/* Divider */}
        <PdfDivider color={T.divider} margin="16px 0" />

        {/* ── Ibadah & Keislaman ────────────────────────── */}
        <PdfSectionHeading title="Ibadah & Keislaman" color={T.primary} accentColor={T.accentGold} />

        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <PdfInfoRow label="Mazhab" value={ibadah.mazhab} />
            <PdfInfoRow label="Cara Berpakaian" value={ibadah.cara_berpakaian} />
            <PdfInfoRow label="Shalat Fardhu" value={SHALAT_LABELS[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
            <PdfInfoRow label="Shalat Sunnah" value={ibadah.shalat_sunnah} />
          </div>
          <div style={{ flex: 1 }}>
            <PdfInfoRow label="Hafalan Qur'an" value={ibadah.hafalan_quran} />
            <PdfInfoRow label="Tilawah Rutin" value={ibadah.tilawah_rutin ? 'Ya' : 'Belum rutin'} />
            <PdfInfoRow label="Kajian Rutin" value={ibadah.kajian_rutin ? 'Ya' : 'Belum rutin'} />
          </div>
        </div>

        {ibadah.deskripsi_ibadah && (
          <div style={{
            backgroundColor: T.bgAlt,
            border: `1px solid ${T.accent}`,
            borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          }}>
            <p style={{ fontSize: FONT.body, color: T.primary, lineHeight: 1.6, margin: 0 }}>
              {ibadah.deskripsi_ibadah}
            </p>
          </div>
        )}

        {/* Divider */}
        <PdfDivider color={T.divider} margin="4px 0 16px" />

        {/* ── Gaya Hidup ────────────────────────────────── */}
        <PdfSectionHeading title="Gaya Hidup" color={T.primary} accentColor={T.accentGold} />

        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            {gl.gaya_hidup && <PdfInfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
            {gl.pola_makan && <PdfInfoRow label="Pola Makan" value={gl.pola_makan} />}
            <PdfInfoRow label="Olahraga Rutin" value={gl.olahraga_rutin ? 'Ya' : 'Belum rutin'} />
          </div>
          <div style={{ flex: 1 }}>
            {gl.kebiasaan_positif && <PdfInfoRow label="Kebiasaan Positif" value={gl.kebiasaan_positif} />}
            {gl.hal_tidak_disukai && <PdfInfoRow label="Hal yang Tidak Disukai" value={gl.hal_tidak_disukai} />}
          </div>
        </div>
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={4}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        pad={PAD}
      />
    </PdfPage>
  )
}

// ── PAGE 5: Visi Misi + Kriteria + Financial + Pandangan ──────
function Page5({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'
  const vm   = state.visiMisi
  const kr   = state.kriteria
  const fp   = state.financialPlanning
  const pi   = state.pandanganIsu

  return (
    <PdfPage bg={T.bg} pad={PAD} isLast>
      <div style={{ padding: `0 0 ${SPACING.pageBottom + 8}px` }}>

        {/* ── Visi & Misi Pernikahan ─────────────────────── */}
        {(vm.visi || vm.misi_suami || vm.misi_istri) && (
          <>
            <PdfSectionHeading title="Visi & Misi Pernikahan" color={T.primary} accentColor={T.accentGold} />

            {vm.visi && (
              <div style={{
                backgroundColor: T.primary,
                borderRadius: 8, padding: '10px 14px', marginBottom: 12,
              }}>
                <p style={{ fontSize: FONT.micro, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>
                  VISI
                </p>
                <p style={{ fontSize: FONT.subheading, color: '#FFFFFF', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  &lsquo;{vm.visi}&rsquo;
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              {vm.misi_suami && (
                <div style={{ flex: 1, backgroundColor: T.divider, borderRadius: 6, padding: '8px 10px' }}>
                  <p style={{ fontSize: FONT.micro, fontWeight: 700, color: T.navyMid, textTransform: 'uppercase', marginBottom: 3 }}>Peran Suami</p>
                  <p style={{ fontSize: FONT.body, color: T.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_suami}</p>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ flex: 1, backgroundColor: T.bgAltGold, borderRadius: 6, padding: '8px 10px' }}>
                  <p style={{ fontSize: FONT.micro, fontWeight: 700, color: T.accentGold, textTransform: 'uppercase', marginBottom: 3 }}>Peran Istri</p>
                  <p style={{ fontSize: FONT.body, color: T.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_istri}</p>
                </div>
              )}
            </div>

            {vm.tujuan_pernikahan.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <p style={{ fontSize: FONT.micro, fontWeight: 600, color: T.textSoft, textTransform: 'uppercase', marginBottom: 4 }}>
                  Tujuan Pernikahan
                </p>
                <div>{vm.tujuan_pernikahan.map((t) => <PdfTag key={t} text={t} variant="primary" />)}</div>
              </div>
            )}

            <PdfDivider color={T.divider} margin="14px 0" />
          </>
        )}

        {/* ── Kriteria Pasangan + Financial (2 kolom) ─────── */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>

          {/* Kriteria */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <PdfSectionHeading title="Kriteria Pasangan" color={T.primary} accentColor={T.accentGold} />
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <PdfInfoRow
                label="Usia"
                value={`${kr.kriteria_usia_min || '?'} – ${kr.kriteria_usia_max || '?'} tahun`}
              />
            )}
            <PdfInfoRow label="Domisili" value={kr.kriteria_domisili} />
            <PdfInfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
            <PdfInfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
            <PdfInfoRow label="Karakter" value={kr.kriteria_karakter} />
            <PdfInfoRow label="Ibadah" value={kr.kriteria_ibadah} />
            {kr.bersedia_poligami !== null && (
              <PdfInfoRow
                label="Bersedia Poligami"
                value={kr.bersedia_poligami ? 'Ya' : 'Tidak'}
              />
            )}
            {kr.bersedia_pindah_domisili !== null && (
              <PdfInfoRow
                label="Bersedia Pindah"
                value={kr.bersedia_pindah_domisili ? 'Ya' : 'Tidak'}
              />
            )}
            {kr.kriteria_lainnya && (
              <PdfInfoRow label="Lainnya" value={kr.kriteria_lainnya} />
            )}
          </div>

          {/* Financial Planning */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <PdfSectionHeading title="Financial Planning" color={T.primary} accentColor={T.accentGold} />

            {fp.penghasilan_range && (
              <div style={{
                backgroundColor: T.bgAlt,
                border: `1px solid ${T.accent}`,
                borderRadius: 6, padding: '6px 10px', marginBottom: 12,
              }}>
                <span style={{ fontSize: FONT.micro, color: T.textSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Rentang Penghasilan
                </span>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.primary, margin: '2px 0 0' }}>
                  {fp.penghasilan_range}
                </p>
              </div>
            )}

            <p style={{ fontSize: FONT.micro, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Alokasi Keuangan
            </p>

            <PdfFinancialBar label="Kebutuhan Pokok" persen={fp.kebutuhan_pokok_persen} color={FINANCIAL_COLORS.pokok} />
            <PdfFinancialBar label="Tabungan"        persen={fp.tabungan_persen}         color={FINANCIAL_COLORS.tabungan} />
            <PdfFinancialBar label="Investasi"       persen={fp.investasi_persen}        color={FINANCIAL_COLORS.investasi} />
            <PdfFinancialBar label="Sedekah / Zakat" persen={fp.sedekah_persen}          color={FINANCIAL_COLORS.sedekah} />
            <PdfFinancialBar label="Lainnya"         persen={fp.lainnya_persen}          color={FINANCIAL_COLORS.lainnya} />

            {fp.deskripsi && (
              <p style={{ fontSize: FONT.body, color: T.textMid, lineHeight: 1.5, marginTop: 8, fontStyle: 'italic' }}>
                {fp.deskripsi}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        {pi.pandangan_isu && (
          <PdfDivider color={T.divider} margin="4px 0 16px" />
        )}

        {/* ── Pandangan Isu (ringkasan) ─────────────────── */}
        {pi.pandangan_isu && (
          <>
            <PdfSectionHeading title="Pandangan tentang Pernikahan" color={T.primary} accentColor={T.accentGold} />
            <p style={{ fontSize: FONT.body, color: T.textMid, lineHeight: 1.6 }}>
              {pi.pandangan_isu}
            </p>
          </>
        )}

        {/* ── Penutup (Closing doa) ──────────────────────── */}
        <div style={{
          marginTop: 24,
          backgroundColor: T.primary,
          borderRadius: 8,
          padding: '14px 20px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 16, color: T.accentGoldAlt, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
          </p>
          <p style={{ fontSize: FONT.micro, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontStyle: 'italic' }}>
            &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami istri-istri dan keturunan kami
            sebagai penyenang hati kami&rdquo; — QS Al-Furqan: 74
          </p>
          <p style={{ fontSize: FONT.micro, color: 'rgba(255,255,255,0.3)', marginTop: 10, letterSpacing: '0.05em' }}>
            CV INI DIBUAT DENGAN TAARUFCV · DOKUMEN BERSIFAT RAHASIA
          </p>
        </div>
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={5}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        pad={PAD}
      />
    </PdfPage>
  )
}

// ── Main Template Component ───────────────────────────────────
export function TemplateAkademik({ state }: { state: FormState }) {
  const showPage2 =
    state.riwayatPendidikan.length > 0 ||
    state.riwayatPekerjaan.length > 0 ||
    state.riwayatOrganisasi.length > 0

  const showPage3 = state.perjalananHidup.length > 0

  const showPage4 =
    (state.karakter.karakter_diri && state.karakter.karakter_diri.length > 0) ||
    state.karakter.kelebihan.length > 0 ||
    (state.ibadah.mazhab && state.ibadah.mazhab.length > 0) ||
    (state.ibadah.shalat_fardhu && state.ibadah.shalat_fardhu.length > 0) ||
    (state.gayaHidup.gaya_hidup && state.gayaHidup.gaya_hidup.length > 0)

  const showPage5 =
    (state.visiMisi.visi && state.visiMisi.visi.length > 0) ||
    (state.kriteria.kriteria_karakter && state.kriteria.kriteria_karakter.length > 0) ||
    state.financialPlanning.kebutuhan_pokok_persen > 0 ||
    (state.pandanganIsu.pandangan_isu && state.pandanganIsu.pandangan_isu.length > 0)

  return (
    <div
      id="taaruf-template"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        width: PAGE_W,
        // Background antar halaman (hanya terlihat di preview)
        backgroundColor: '#E5E7EB',
        gap: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Page1 state={state} />
      {showPage2 && <Page2 state={state} />}
      {showPage3 && <Page3 state={state} />}
      {showPage4 && <Page4 state={state} />}
      {showPage5 && <Page5 state={state} />}
    </div>
  )
}