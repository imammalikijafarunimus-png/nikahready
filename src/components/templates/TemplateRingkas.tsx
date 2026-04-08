// ============================================================
// src/components/templates/TemplateRingkas.tsx
//
// Template CV Taaruf -- Gaya Ringkas (FREE Template)
// Theme: Navy + Gold (THEME_NAVY from pdf-tokens)
// 1 halaman A4 -- compact, clean, profesional
//
// PDF-SAFE RULES:
// - Every page: width 794px, height 1123px, overflow hidden
// - Colors: hex literals in inline styles only
// - No CSS vars, no Tailwind, no position fixed/sticky
// - Font: Inter (body), Amiri (Arabic)
// - No emojis -- shapes and text only
// ============================================================

import React from 'react'
import type {
  FormState,
  RiwayatPendidikanItem,
  RiwayatPekerjaanItem,
  AnggotaKeluargaItem,
} from '@/types'

import {
  PAGE_W,
  PAGE_H,
  SPACING,
  THEME_NAVY,
  SHALAT_LABELS,
  STATUS_LABELS,
  hitungUsia,
  formatTTL,
} from '@/lib/pdf-tokens'

import {
  PdfSectionTitle,
  PdfInfoRow,
  PdfTag,
  PdfPhotoPlaceholder,
  PdfPageFooter,
  PdfDivider,
  PdfTimelineItem,
} from '@/lib/pdf-shared-components'

// ── Shorthand for theme colors ───────────────────────────────
const T = THEME_NAVY

// ── Truncation helpers ───────────────────────────────────────
function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}...` : text
}

// ── MAIN TEMPLATE ────────────────────────────────────────────
export function TemplateRingkas({ state }: { state: FormState }) {
  const p      = state.dataPribadi
  const f      = state.fisikKesehatan
  const k      = state.karakter
  const ibadah = state.ibadah
  const vm     = state.visiMisi
  const kr     = state.kriteria
  const keluarga = state.anggotaKeluarga

  const nama = p.nama_lengkap || 'Nama Lengkap'
  const usia = hitungUsia(p.tanggal_lahir)
  const ttl  = formatTTL(p.tempat_lahir, p.tanggal_lahir)

  // Pendidikan items (sorted, take last 3 for compact)
  const pendidikan = [...state.riwayatPendidikan]
    .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
    .slice(-3)

  // Pekerjaan items (sorted, take last 2 for compact)
  const pekerjaan = [...state.riwayatPekerjaan]
    .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
    .slice(-2)

  // Sosial media visible in PDF (first 2)
  const visibleSosmed = state.sosialMedia
    .filter((s) => s.tampil_di_pdf)
    .slice(0, 2)

  // Anggota keluarga (sorted by urutan)
  const anggotaKeluarga = [...keluarga]
    .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
    .slice(0, 6)

  const pad = SPACING.pagePadFree
  const FOOTER_H = 28

  // Check if there's kriteria data
  const hasKriteria = kr.kriteria_usia_min || kr.kriteria_usia_max || kr.kriteria_domisili || kr.kriteria_pendidikan || kr.kriteria_pekerjaan || kr.kriteria_karakter || kr.kriteria_ibadah

  // Check if there's visi misi data
  const hasVisiMisi = vm.visi || vm.misi_suami || vm.misi_istri || vm.tujuan_pernikahan.length > 0

  return (
    <div
      id="taaruf-template"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Single page div — generatePdf captures children of #taaruf-template as pages */}
      <div
        style={{
          width: PAGE_W,
          height: PAGE_H,
          backgroundColor: T.bg,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: T.text,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      {/* ═══════════════════════════════════════════════════════
          1. HEADER STRIP (navy bg) — COMPACT
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: T.primary,
          padding: `${14}px ${pad}px 12px`,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', bottom: -15, left: pad,
          width: 40, height: 40, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {/* Foto — smaller 62×76 */}
          <div style={{ flexShrink: 0, marginTop: 12 }}>
            {state.fotoTemplate.foto_pribadi_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={state.fotoTemplate.foto_pribadi_url}
                alt={nama}
                style={{
                  width: 62,
                  height: 76,
                  objectFit: 'cover',
                  borderRadius: 5,
                  border: `2px solid ${T.accent}`,
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{ borderRadius: 5, overflow: 'hidden' }}>
                <PdfPhotoPlaceholder
                  width={62}
                  height={76}
                  borderRadius={0}
                  borderColor="rgba(255,255,255,0.25)"
                  bg="rgba(255,255,255,0.07)"
                  label="Foto"
                />
              </div>
            )}
          </div>

          {/* Bismillah + Nama + Chips */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Bismillah — 13px */}
            <p
              style={{
                fontFamily: "'Amiri', Georgia, serif",
                fontSize: 13,
                color: T.accentAlt,
                direction: 'rtl',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
            <p style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.35)', marginTop: 0, marginBottom: 4 }}>
              Bismillahirrahmanirrahim
            </p>

            {/* Nama */}
            <h1
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              {nama}
            </h1>

            {/* Chips row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {usia && (
                <span style={{
                  padding: '1px 7px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 8.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                }}>
                  {usia} tahun
                </span>
              )}
              {p.domisili_kota && (
                <span style={{
                  padding: '1px 7px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 8.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                }}>
                  {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
                </span>
              )}
              {p.status_pernikahan && (
                <span style={{
                  padding: '1px 7px', borderRadius: 999,
                  backgroundColor: T.accent,
                  fontSize: 8.5, color: '#FFFFFF', fontWeight: 600,
                }}>
                  {STATUS_LABELS[p.status_pernikahan] ?? p.status_pernikahan}
                </span>
              )}
              {p.suku_bangsa && (
                <span style={{
                  padding: '1px 7px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontSize: 8.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
                }}>
                  Suku {p.suku_bangsa}
                </span>
              )}
              {p.jumlah_anak > 0 && (
                <span style={{
                  padding: '1px 7px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontSize: 8.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
                }}>
                  {p.jumlah_anak} anak
                </span>
              )}
            </div>

            {/* Sosial media */}
            {visibleSosmed.length > 0 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {visibleSosmed.map((s) => (
                  <span key={s.id} style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                    {s.platform}: {s.username}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2. BODY (2-column, gap=0, border-right separator)
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          padding: `${10}px ${pad}px 0`,
          flexShrink: 0,
        }}
      >
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: pad, borderRight: `1px solid ${T.divider}` }}>
          {/* Data Pribadi & Fisik — DIGABUNG */}
          <PdfSectionTitle title="Data Pribadi & Fisik" color={T.primary} accentColor={T.accent} mb={5} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 10px', marginBottom: 3 }}>
            <PdfInfoRow label="TTL" value={ttl} fullWidth mb={3} />
            {p.kewarganegaraan && <PdfInfoRow label="WN" value={p.kewarganegaraan} mb={3} />}
            {(f.tinggi_badan || f.berat_badan) && (
              <PdfInfoRow label="TB/BB" value={`${f.tinggi_badan || '?'} cm / ${f.berat_badan || '?'} kg`} mb={3} />
            )}
            <PdfInfoRow label="Gol. Darah" value={f.golongan_darah || null} mb={3} />
            <PdfInfoRow label="Warna Kulit" value={f.warna_kulit} mb={3} />
            {f.kondisi_kesehatan && <PdfInfoRow label="Kondisi" value={f.kondisi_kesehatan} mb={3} />}
          </div>

          <PdfDivider color={T.divider} margin="4px 0 6px" />

          {/* Ibadah — grid compact */}
          <PdfSectionTitle title="Ibadah" color={T.primary} accentColor={T.accent} mb={5} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 10px', marginBottom: 3 }}>
            <PdfInfoRow label="Mazhab" value={ibadah.mazhab} mb={3} />
            <PdfInfoRow label="Shalat" value={SHALAT_LABELS[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} mb={3} />
            <PdfInfoRow label="Sunnah" value={ibadah.shalat_sunnah} mb={3} />
            <PdfInfoRow label="Hafalan" value={ibadah.hafalan_quran} mb={3} />
            <PdfInfoRow label="Tilawah" value={ibadah.tilawah_rutin ? 'Ya' : null} mb={3} />
            <PdfInfoRow label="Kajian" value={ibadah.kajian_rutin ? 'Ya' : null} mb={3} />
            <PdfInfoRow label="Berpakaian" value={ibadah.cara_berpakaian} mb={3} />
          </div>

          <PdfDivider color={T.divider} margin="4px 0 6px" />

          {/* Anggota Keluarga (FREE step 14) */}
          {anggotaKeluarga.length > 0 && (
            <>
              <PdfSectionTitle title="Anggota Keluarga" color={T.primary} accentColor={T.accent} mb={5} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
                {anggotaKeluarga.map((item: AnggotaKeluargaItem) => (
                  <div key={item.id} style={{ minWidth: 120, marginBottom: 4 }}>
                    <span style={{ fontSize: 7, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
                      {item.hubungan}
                    </span>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: T.text }}>{item.nama}</span>
                    {item.pekerjaan && (
                      <span style={{ fontSize: 8, color: T.textMid, display: 'block' }}>{item.pekerjaan}</span>
                    )}
                    {item.pendidikan && (
                      <span style={{ fontSize: 8, color: T.textSoft }}>{item.pendidikan}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0, paddingLeft: pad }}>
          {/* Pendidikan */}
          {pendidikan.length > 0 && (
            <>
              <PdfSectionTitle title="Pendidikan" color={T.primary} accentColor={T.accent} mb={5} />
              <div style={{ marginBottom: 8 }}>
                {pendidikan.map((item: RiwayatPendidikanItem, i: number) => (
                  <PdfTimelineItem
                    key={item.id}
                    year={
                      item.tahun_selesai
                        ? String(item.tahun_selesai)
                        : item.tahun_mulai
                          ? `${item.tahun_mulai}\u2013`
                          : undefined
                    }
                    dotColor={T.secondary}
                    lineColor={T.divider}
                    isLast={i === pendidikan.length - 1}
                  >
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.3 }}>
                      {item.jenjang}{item.jurusan ? ` \u2014 ${item.jurusan}` : ''}
                    </p>
                    {item.nama_institusi && (
                      <p style={{ fontSize: 8.5, color: T.textMid, margin: '1px 0 0', lineHeight: 1.3 }}>
                        {item.nama_institusi}
                      </p>
                    )}
                  </PdfTimelineItem>
                ))}
              </div>
              <PdfDivider color={T.divider} margin="0 0 6px" />
            </>
          )}

          {/* Pekerjaan */}
          {pekerjaan.length > 0 && (
            <>
              <PdfSectionTitle title="Pekerjaan" color={T.primary} accentColor={T.accent} mb={5} />
              <div style={{ marginBottom: 8 }}>
                {pekerjaan.map((item: RiwayatPekerjaanItem, i: number) => (
                  <PdfTimelineItem
                    key={item.id}
                    year={
                      item.is_masih_aktif
                        ? 'Kini'
                        : item.tahun_selesai
                          ? String(item.tahun_selesai)
                          : undefined
                    }
                    dotColor={T.accent}
                    lineColor={T.divider}
                    isLast={i === pekerjaan.length - 1}
                  >
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.3 }}>
                      {item.posisi_jabatan}{item.is_masih_aktif ? ' (Aktif)' : ''}
                    </p>
                    <p style={{ fontSize: 8.5, color: T.textMid, margin: '1px 0 0', lineHeight: 1.3 }}>
                      {item.nama_perusahaan}{item.tahun_mulai ? ` \u00b7 ${item.tahun_mulai}${item.is_masih_aktif ? '\u2013sekarang' : item.tahun_selesai ? `\u2013${item.tahun_selesai}` : ''}` : ''}
                    </p>
                  </PdfTimelineItem>
                ))}
              </div>
              <PdfDivider color={T.divider} margin="0 0 6px" />
            </>
          )}

          {/* Karakter & Kepribadian — 3-kolom */}
          {(k.kelebihan.length > 0 || k.kekurangan.length > 0 || k.hobi.length > 0 || k.karakter_diri) && (
            <>
              <PdfSectionTitle title="Karakter & Kepribadian" color={T.primary} accentColor={T.accent} mb={5} />
              {k.karakter_diri && (
                <p style={{ fontSize: 8.5, color: T.textMid, lineHeight: 1.4, margin: '0 0 5px' }}>
                  {truncate(k.karakter_diri, 150)}
                </p>
              )}
              {/* 3-kolom: kelebihan | kekurangan | MBTI+Cinta+Hobi */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                {k.kelebihan.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 7, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                      Kelebihan
                    </span>
                    <div>
                      {k.kelebihan.slice(0, 4).map((tag) => (
                        <PdfTag key={tag} text={tag} variant="primary" />
                      ))}
                    </div>
                  </div>
                )}
                {k.kekurangan.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 7, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                      Kekurangan
                    </span>
                    <div>
                      {k.kekurangan.slice(0, 3).map((tag) => (
                        <PdfTag key={tag} text={tag} variant="muted" />
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {k.hobi.length > 0 && (
                    <>
                      <span style={{ fontSize: 7, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                        Hobi
                      </span>
                      <div style={{ marginBottom: 3 }}>
                        {k.hobi.slice(0, 3).map((tag) => (
                          <PdfTag key={tag} text={tag} variant="accent" />
                        ))}
                      </div>
                    </>
                  )}
                  {k.mbti_type && <PdfInfoRow label="MBTI" value={k.mbti_type} mb={2} />}
                  {k.bahasa_cinta && (
                    <PdfInfoRow label="Cinta" value={k.bahasa_cinta.replace(/_/g, ' ')} mb={2} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2b. KRITERIA PASANGAN (full-width, bg ungu muda)
          ═══════════════════════════════════════════════════════ */}
      {hasKriteria && (
        <div
          style={{
            margin: `${8}px ${pad}px 0`,
            backgroundColor: '#F0EEF5',
            borderRadius: 5,
            padding: '6px 10px',
            flexShrink: 0,
          }}
        >
          <PdfSectionTitle title="Kriteria Pasangan" color={T.primary} accentColor={T.accent} mb={4} />

          {/* Short fields: inline row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px', marginBottom: 4 }}>
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <PdfInfoRow
                label="Usia"
                value={`${kr.kriteria_usia_min || '?'}\u2013${kr.kriteria_usia_max || '?'} th`}
                mb={3}
              />
            )}
            <PdfInfoRow label="Domisili" value={kr.kriteria_domisili} mb={3} />
            <PdfInfoRow label="Pendidikan" value={kr.kriteria_pendidikan} mb={3} />
            <PdfInfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} mb={3} />
            {kr.bersedia_poligami !== null && (
              <PdfInfoRow label="Poligami" value={kr.bersedia_poligami ? 'Bersedia' : 'Tidak'} mb={3} />
            )}
          </div>

          {/* Long-text fields: full-width paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {kr.kriteria_karakter && (
              <div>
                <span style={{ fontSize: 7.5, color: '#7C6D9E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 1 }}>Karakter</span>
                <p style={{ fontSize: 8.5, color: '#4A3F6B', lineHeight: 1.4, margin: 0 }}>
                  {kr.kriteria_karakter}
                </p>
              </div>
            )}
            {kr.kriteria_ibadah && (
              <div>
                <span style={{ fontSize: 7.5, color: '#7C6D9E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 1 }}>Ibadah</span>
                <p style={{ fontSize: 8.5, color: '#4A3F6B', lineHeight: 1.4, margin: 0 }}>
                  {kr.kriteria_ibadah}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          3. VISI MISI (full-width, flex-fill, 3 kolom seimbang)
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          margin: `${8}px ${pad}px ${FOOTER_H}px`,
          backgroundColor: hasVisiMisi ? T.bgAlt : T.bg,
          border: hasVisiMisi ? `1px solid ${T.divider}` : 'none',
          borderRadius: 5,
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {hasVisiMisi && (
          <>
            <PdfSectionTitle title="Visi, Misi & Tujuan Pernikahan" color={T.primary} accentColor={T.accent} mb={5} />

            {/* 3 columns: Visi | Misi Suami | Harapan Istri */}
            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
              {/* Kolom 1: Visi Keluarga (navy bg) */}
              {vm.visi && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: T.primary,
                    borderRadius: 5,
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                    Visi Keluarga
                  </span>
                  <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4, fontStyle: 'italic', flex: 1 }}>
                    &lsquo;{truncate(vm.visi, 250)}&rsquo;
                  </p>
                </div>
              )}

              {/* Kolom 2: Misi sebagai Suami (blue bg) */}
              {vm.misi_suami && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#1E3A5F',
                    borderRadius: 5,
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                    Misi Suami
                  </span>
                  <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4, flex: 1 }}>
                    {truncate(vm.misi_suami, 200)}
                  </p>
                </div>
              )}

              {/* Kolom 3: Harapan untuk Istri (amber bg) */}
              {vm.misi_istri && (
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#78350F',
                    borderRadius: 5,
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                    Harapan Istri
                  </span>
                  <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4, flex: 1 }}>
                    {truncate(vm.misi_istri, 200)}
                  </p>
                </div>
              )}
            </div>

            {/* Tujuan Menikah: row terpisah di bawah */}
            {vm.tujuan_pernikahan.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 7.5, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                  Tujuan Pernikahan
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {vm.tujuan_pernikahan.slice(0, 6).map((t) => (
                    <PdfTag key={t} text={t} variant="green" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          4. PAGE FOOTER
          ═══════════════════════════════════════════════════════ */}
      <PdfPageFooter
        nama={nama}
        pageNum={1}
        totalPages={1}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF -- DOKUMEN RAHASIA"
        pad={pad}
      />
      </div>
    </div>
  )
}