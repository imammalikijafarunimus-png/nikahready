// ============================================================
// Template Minimal Islami — FREE template (1 halaman)
// Gaya: padat, ornamental Islamic, cream + gold
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Page div: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style (BUKAN CSS var / Tailwind)
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, box-shadow spread
// ✓ Flexbox / explicit grid
// ✓ Font: Inter (body) dan Amiri (Arabic)
// ✓ Root div MUST have id="taaruf-template"
// ✓ All images: crossOrigin="anonymous"
// ✓ NO emojis — hanya teks dan bentuk (SVG)
// ✓ Uses shared tokens from @/lib/pdf-tokens
// ✓ Uses shared components from @/lib/pdf-shared-components
// ============================================================

import React from 'react'
import type { FormState } from '@/types'

// ── Shared Design Tokens ──────────────────────────────────────
import {
  THEME_ISLAMIC,
  SPACING,
  FONT,
  PAGE_W,
  PAGE_H,
  STATUS_LABELS,
  SHALAT_LABELS,
  TIPE_LABELS,
  hitungUsia,
  formatTTL,
} from '@/lib/pdf-tokens'

// ── Shared Components ─────────────────────────────────────────
import {
  PdfPage,
  PdfSectionTitle,
  PdfInfoRow,
  PdfTag,
  PdfPhotoPlaceholder,
  PdfPageFooter,
  PdfOrnDivider,
  PdfCornerOrnament,
} from '@/lib/pdf-shared-components'

// ── Theme alias ───────────────────────────────────────────────
const T = THEME_ISLAMIC

// ── Page padding (free = compact) ─────────────────────────────
const PAD = SPACING.pagePadFree

// ── Main Export ──────────────────────────────────────────────
export function TemplateMinimalIslami({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const nama = p.nama_lengkap || 'Nama Lengkap'

  const usia = hitungUsia(p.tanggal_lahir)
  const ttl = formatTTL(p.tempat_lahir, p.tanggal_lahir)

  const tinggiBerat =
    state.fisikKesehatan.tinggi_badan && state.fisikKesehatan.berat_badan
      ? `${state.fisikKesehatan.tinggi_badan} cm / ${state.fisikKesehatan.berat_badan} kg`
      : undefined

  // Last 2 pendidikan only (compact for free)
  const eduLast2 = state.riwayatPendidikan
    .slice()
    .sort((a, b) => (b.tahun_selesai as number) - (a.tahun_selesai as number))
    .slice(0, 2)

  // Sosmed yang tampil di PDF
  const sosmedVisible = state.sosialMedia.filter(s => s.tampil_di_pdf)

  return (
    <div
      id="taaruf-template"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        width: PAGE_W,
        backgroundColor: '#E5E7EB',
      }}
    >
      <PdfPage bg={T.bg} pad={PAD}>
        {/* Corner ornaments */}
        <PdfCornerOrnament position="top-left" color={T.gold} />
        <PdfCornerOrnament position="top-right" color={T.gold} />
        <PdfCornerOrnament position="bottom-left" color={T.gold} />
        <PdfCornerOrnament position="bottom-right" color={T.gold} />

        <div style={{ padding: `28px ${PAD}px ${SPACING.pageBottom}px` }}>

          {/* ─── 1. BISMILLAH ─── */}
          <div style={{ textAlign: 'center', marginBottom: 2 }}>
            <p style={{
              fontFamily: "'Amiri', Georgia, serif", fontSize: 26,
              color: T.primary, direction: 'rtl', margin: 0, lineHeight: 1.8,
            }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
          <PdfOrnDivider color={T.gold} />

          {/* ─── 2. NAME + PHOTO ─── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
            {/* Photo */}
            {state.fotoTemplate.foto_pribadi_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={state.fotoTemplate.foto_pribadi_url}
                alt={nama}
                style={{
                  width: 80, height: 100, objectFit: 'cover', borderRadius: 8,
                  border: `2.5px solid ${T.gold}`, flexShrink: 0,
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <PdfPhotoPlaceholder
                width={80}
                height={100}
                borderRadius={8}
                borderColor={T.gold}
                bg={T.bgGold}
                label="Foto"
              />
            )}

            {/* Name & chips */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: T.primary, margin: 0, lineHeight: 1.2 }}>
                {nama}
              </h1>
              {p.nama_panggilan && (
                <p style={{ fontSize: 10, color: T.textSoft, marginTop: 1, fontStyle: 'italic' }}>
                  &lsquo;{p.nama_panggilan}&rsquo;
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
                {usia && (
                  <PdfTag text={`${usia} tahun`} variant="primary" />
                )}
                {p.domisili_kota && (
                  <PdfTag text={p.domisili_kota} variant="primary" />
                )}
                {p.suku_bangsa && (
                  <PdfTag text={p.suku_bangsa} variant="primary" />
                )}
                {p.status_pernikahan && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 999, backgroundColor: T.gold,
                    fontSize: 9, color: '#FFFFFF', fontWeight: 600, display: 'inline-block',
                  }}>
                    {STATUS_LABELS[p.status_pernikahan] ?? p.status_pernikahan}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ─── Karakter diri (about me) ─── */}
          {state.karakter.karakter_diri && (
            <p style={{
              fontSize: 10, lineHeight: 1.6, color: T.textMid,
              margin: '0 0 8px', textAlign: 'center', fontStyle: 'italic',
              maxWidth: 580, marginLeft: 'auto', marginRight: 'auto',
            }}>
              &ldquo;{state.karakter.karakter_diri}&rdquo;
            </p>
          )}

          <PdfOrnDivider color={T.gold} />

          {/* ─── 3. TWO-COLUMN BODY ─── */}
          <div style={{ display: 'flex', gap: 20 }}>

            {/* LEFT COLUMN: Data Pribadi + Ibadah */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <PdfSectionTitle title="Data Pribadi" color={T.primary} accentColor={T.gold} />
              <PdfInfoRow label="Tempat, Tanggal Lahir" value={ttl} />
              <PdfInfoRow label="Domisili" value={
                p.domisili_kota && p.domisili_provinsi
                  ? `${p.domisili_kota}, ${p.domisili_provinsi}`
                  : p.domisili_kota || p.domisili_provinsi || undefined
              } />
              <PdfInfoRow label="Tinggi / Berat" value={tinggiBerat} />
              <PdfInfoRow label="Gol. Darah" value={state.fisikKesehatan.golongan_darah} />
              <PdfInfoRow label="Kondisi Kesehatan" value={state.fisikKesehatan.kondisi_kesehatan} />

              <div style={{ marginTop: 10 }}>
                <PdfSectionTitle title="Ibadah & Keislaman" color={T.primary} accentColor={T.gold} />
                <PdfInfoRow label="Mazhab" value={state.ibadah.mazhab} />
                <PdfInfoRow label="Shalat Fardhu" value={SHALAT_LABELS[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu} />
                <PdfInfoRow label="Shalat Sunnah" value={state.ibadah.shalat_sunnah} />
                <PdfInfoRow label="Hafalan Qur'an" value={state.ibadah.hafalan_quran} />
                <PdfInfoRow label="Tilawah Rutin" value={state.ibadah.tilawah_rutin ? 'Ya' : undefined} />
                <PdfInfoRow label="Kajian Rutin" value={state.ibadah.kajian_rutin ? 'Ya' : undefined} />
              </div>

              {/* Gaya Hidup compact */}
              {(state.gayaHidup.gaya_hidup || state.gayaHidup.tipe_kepribadian) && (
                <div style={{ marginTop: 10 }}>
                  <PdfSectionTitle title="Gaya Hidup" color={T.primary} accentColor={T.gold} />
                  <PdfInfoRow label="Gaya Hidup" value={state.gayaHidup.gaya_hidup} />
                  <PdfInfoRow label="Tipe Kepribadian" value={
                    TIPE_LABELS[state.gayaHidup.tipe_kepribadian]
                    || state.gayaHidup.tipe_kepribadian || undefined
                  } />
                  <PdfInfoRow label="Kebiasaan Positif" value={state.gayaHidup.kebiasaan_positif} />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Pendidikan + Karakter + Kriteria */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Pendidikan (last 2) */}
              {eduLast2.length > 0 && (
                <>
                  <PdfSectionTitle title="Pendidikan" color={T.primary} accentColor={T.gold} />
                  <div style={{ marginBottom: 10 }}>
                    {eduLast2.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${T.tertiary}40` }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: T.text, margin: 0 }}>
                          {edu.jenjang}{edu.jurusan ? ` — ${edu.jurusan}` : ''}
                        </p>
                        <p style={{ fontSize: 9, color: T.textMid, margin: '1px 0 0' }}>
                          {edu.nama_institusi}
                          {edu.tahun_selesai ? ` · ${edu.tahun_selesai}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pekerjaan terakhir */}
              {state.riwayatPekerjaan.length > 0 && (
                <>
                  <PdfSectionTitle title="Pekerjaan" color={T.primary} accentColor={T.gold} />
                  <div style={{ marginBottom: 10 }}>
                    {(() => {
                      const lastJob = state.riwayatPekerjaan[0]
                      return (
                        <div style={{ paddingLeft: 10, borderLeft: `2px solid ${T.gold}40` }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: T.text, margin: 0 }}>
                            {lastJob.posisi_jabatan}
                            {lastJob.is_masih_aktif && (
                              <span style={{ marginLeft: 5, padding: '1px 5px', borderRadius: 999, backgroundColor: T.bgGreen, color: T.primary, fontSize: 8, fontWeight: 600 }}>Aktif</span>
                            )}
                          </p>
                          <p style={{ fontSize: 9, color: T.textMid, margin: '1px 0 0' }}>
                            {lastJob.nama_perusahaan}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                </>
              )}

              {/* Karakter tags */}
              {(state.karakter.kelebihan.length > 0 || state.karakter.kekurangan.length > 0 || state.karakter.hobi.length > 0 || state.karakter.mbti_type) && (
                <>
                  <PdfSectionTitle title="Karakter" color={T.primary} accentColor={T.gold} />
                  {state.karakter.mbti_type && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: T.primary, color: '#FFFFFF', fontSize: 9, fontWeight: 700, display: 'inline-block' }}>
                        {state.karakter.mbti_type}
                      </span>
                    </div>
                  )}
                  {state.karakter.kelebihan.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: T.textMuted, textTransform: 'uppercase', marginRight: 4 }}>Kelebihan</span>
                      {state.karakter.kelebihan.map((t) => (
                        <PdfTag key={t} text={t} variant="primary" />
                      ))}
                    </div>
                  )}
                  {state.karakter.kekurangan.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: T.textMuted, textTransform: 'uppercase', marginRight: 4 }}>Kekurangan</span>
                      {state.karakter.kekurangan.map((t) => (
                        <PdfTag key={t} text={t} variant="accent" />
                      ))}
                    </div>
                  )}
                  {state.karakter.hobi.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: T.textMuted, textTransform: 'uppercase', marginRight: 4 }}>Hobi</span>
                      {state.karakter.hobi.map((t) => (
                        <PdfTag key={t} text={t} variant="muted" />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Kriteria Pasangan (compact) */}
              {(state.kriteria.kriteria_usia_min || state.kriteria.kriteria_usia_max || state.kriteria.kriteria_karakter || state.kriteria.kriteria_ibadah || state.kriteria.kriteria_pendidikan || state.kriteria.kriteria_domisili) && (
                <>
                  <div style={{ marginTop: 10 }}>
                    <PdfSectionTitle title="Kriteria Pasangan" color={T.primary} accentColor={T.gold} />
                    <PdfInfoRow
                      label="Usia"
                      value={
                        state.kriteria.kriteria_usia_min || state.kriteria.kriteria_usia_max
                          ? `${state.kriteria.kriteria_usia_min || '?'} – ${state.kriteria.kriteria_usia_max || '?'} tahun`
                          : undefined
                      }
                    />
                    <PdfInfoRow label="Domisili" value={state.kriteria.kriteria_domisili} />
                    <PdfInfoRow label="Pendidikan" value={state.kriteria.kriteria_pendidikan} />
                    <PdfInfoRow label="Karakter" value={state.kriteria.kriteria_karakter} />
                    <PdfInfoRow label="Ibadah" value={state.kriteria.kriteria_ibadah} />
                    <PdfInfoRow label="Lainnya" value={state.kriteria.kriteria_lainnya} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ─── 4. BOTTOM: VISI + SOSMED ─── */}
          <PdfOrnDivider color={T.gold} />

          {/* Visi card with gold border */}
          {state.visiMisi.visi && (
            <div style={{
              border: `2px solid ${T.gold}60`,
              borderRadius: 8,
              padding: '10px 16px',
              marginBottom: 10,
              backgroundColor: T.bgGold,
            }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: T.goldDark, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                Visi Pernikahan
              </p>
              <p style={{ fontSize: 11, color: T.primary, lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
                &ldquo;{state.visiMisi.visi}&rdquo;
              </p>
              {(state.visiMisi.misi_suami || state.visiMisi.misi_istri) && (
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {state.visiMisi.misi_suami && (
                    <div style={{ flex: 1, padding: '6px 10px', backgroundColor: '#FFFFFF', borderRadius: 4, border: `1px solid ${T.tertiary}20` }}>
                      <p style={{ fontSize: 8, fontWeight: 700, color: T.secondary, textTransform: 'uppercase', marginBottom: 2 }}>Peran Suami</p>
                      <p style={{ fontSize: 9, color: T.text, lineHeight: 1.4, margin: 0 }}>{state.visiMisi.misi_suami}</p>
                    </div>
                  )}
                  {state.visiMisi.misi_istri && (
                    <div style={{ flex: 1, padding: '6px 10px', backgroundColor: '#FFFFFF', borderRadius: 4, border: `1px solid ${T.gold}20` }}>
                      <p style={{ fontSize: 8, fontWeight: 700, color: T.goldDark, textTransform: 'uppercase', marginBottom: 2 }}>Peran Istri</p>
                      <p style={{ fontSize: 9, color: T.text, lineHeight: 1.4, margin: 0 }}>{state.visiMisi.misi_istri}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Social media row */}
          {sosmedVisible.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10,
              justifyContent: 'center',
            }}>
              {sosmedVisible.map((s) => (
                <span key={s.id} style={{
                  padding: '2px 10px', borderRadius: 999,
                  backgroundColor: '#FFFFFF', border: `1px solid ${T.gold}30`,
                  fontSize: 9, color: T.textMid, fontWeight: 500,
                }}>
                  {s.platform}: {s.username}
                </span>
              ))}
            </div>
          )}

          {/* ─── Closing doa (QS Al-Furqan:74) ─── */}
          <div style={{
            backgroundColor: T.primary,
            borderRadius: 8,
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Amiri', Georgia, serif",
              fontSize: 15,
              color: T.goldLight,
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.8,
            }}>
              رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
            </p>
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 5, fontStyle: 'italic' }}>
              &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami istri-istri dan keturunan kami sebagai penyenang hati&rdquo; — QS Al-Furqan: 74
            </p>
          </div>

        </div>

        {/* ─── Page Footer ─── */}
        <PdfPageFooter
          nama={nama}
          footerBg={T.footerBg}
          footerText={T.footerText}
          footerTextStrong={T.footerTextStrong}
          brandText="TAARUFCV · DOKUMEN RAHASIA"
          pad={PAD}
        />
      </PdfPage>
    </div>
  )
}