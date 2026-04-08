// ============================================================
// src/components/templates/TemplateRingkas.tsx
//
// Template CV Taaruf -- Gaya Ringkas (FREE Template)
// Theme: Navy + Gold (THEME_NAVY from pdf-tokens)
// 1 halaman A4 -- compact, clean, profesional
//
// PDF-SAFE RULES:
// - Every page: width 794px, min-height 1123px, overflow hidden
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
} from '@/types'

import {
  PAGE_W,
  PAGE_H,
  SPACING,
  FONT,
  THEME_NAVY,
  SHALAT_LABELS,
  TIPE_LABELS,
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
  const gl     = state.gayaHidup
  const vm     = state.visiMisi
  const kr     = state.kriteria

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

  const pad = SPACING.pagePadFree

  return (
    <div
      id="taaruf-template"
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: T.bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: T.text,
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          1. HEADER STRIP (navy bg)
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: T.primary,
          padding: `${18}px ${pad}px 16px`,
          position: 'relative',
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

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          {/* Foto */}
          <div style={{ flexShrink: 0, marginTop: 16 }}>
            {state.fotoTemplate.foto_pribadi_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={state.fotoTemplate.foto_pribadi_url}
                alt={nama}
                style={{
                  width: 72,
                  height: 88,
                  objectFit: 'cover',
                  borderRadius: 6,
                  border: `2px solid ${T.accent}`,
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{ borderRadius: 6, overflow: 'hidden' }}>
                <PdfPhotoPlaceholder
                  width={72}
                  height={88}
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
            {/* Bismillah */}
            <p
              style={{
                fontFamily: "'Amiri', Georgia, serif",
                fontSize: 14,
                color: T.accentAlt,
                direction: 'rtl',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
            <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', marginTop: 0, marginBottom: 6 }}>
              Bismillahirrahmanirrahim
            </p>

            {/* Nama */}
            <h1
              style={{
                fontSize: 20,
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
              {usia && (
                <span style={{
                  padding: '2px 8px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                }}>
                  {usia} tahun
                </span>
              )}
              {p.domisili_kota && (
                <span style={{
                  padding: '2px 8px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                }}>
                  {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
                </span>
              )}
              {p.status_pernikahan && (
                <span style={{
                  padding: '2px 8px', borderRadius: 999,
                  backgroundColor: T.accent,
                  fontSize: 9, color: '#FFFFFF', fontWeight: 600,
                }}>
                  {STATUS_LABELS[p.status_pernikahan] ?? p.status_pernikahan}
                </span>
              )}
              {p.suku_bangsa && (
                <span style={{
                  padding: '2px 8px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
                }}>
                  Suku {p.suku_bangsa}
                </span>
              )}
              {p.jumlah_anak > 0 && (
                <span style={{
                  padding: '2px 8px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
                }}>
                  {p.jumlah_anak} anak
                </span>
              )}
            </div>

            {/* Sosial media */}
            {visibleSosmed.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                {visibleSosmed.map((s) => (
                  <span key={s.id} style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                    {s.platform}: {s.username}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2. BODY (2-column grid)
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          gap: pad,
          padding: `${14}px ${pad}px 0`,
        }}
      >
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Data Pribadi */}
          <PdfSectionTitle title="Data Pribadi" color={T.primary} accentColor={T.accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 10 }}>
            <PdfInfoRow
              label="TTL"
              value={ttl}
              fullWidth
            />
            {p.kewarganegaraan && <PdfInfoRow label="WN" value={p.kewarganegaraan} />}
          </div>

          <PdfDivider color={T.divider} margin="0 0 8px" />

          {/* Fisik & Kesehatan */}
          <PdfSectionTitle title="Fisik & Kesehatan" color={T.primary} accentColor={T.accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 10 }}>
            {(f.tinggi_badan || f.berat_badan) && (
              <PdfInfoRow
                label="TB/BB"
                value={`${f.tinggi_badan || '?'} cm / ${f.berat_badan || '?'} kg`}
              />
            )}
            <PdfInfoRow label="Gol. Darah" value={f.golongan_darah || null} />
            <PdfInfoRow label="Warna Kulit" value={f.warna_kulit} />
            {f.kondisi_kesehatan && <PdfInfoRow label="Kondisi" value={f.kondisi_kesehatan} />}
          </div>

          <PdfDivider color={T.divider} margin="0 0 8px" />

          {/* Ibadah & Keislaman */}
          <PdfSectionTitle title="Ibadah" color={T.primary} accentColor={T.accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 10 }}>
            <PdfInfoRow label="Mazhab" value={ibadah.mazhab} />
            <PdfInfoRow label="Shalat" value={SHALAT_LABELS[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
            <PdfInfoRow label="Sunnah" value={ibadah.shalat_sunnah} />
            <PdfInfoRow label="Hafalan" value={ibadah.hafalan_quran} />
            <PdfInfoRow label="Tilawah" value={ibadah.tilawah_rutin ? 'Ya' : null} />
            <PdfInfoRow label="Kajian" value={ibadah.kajian_rutin ? 'Ya' : null} />
            <PdfInfoRow label="Berpakaian" value={ibadah.cara_berpakaian} />
          </div>

          <PdfDivider color={T.divider} margin="0 0 8px" />

          {/* Gaya Hidup */}
          <PdfSectionTitle title="Gaya Hidup" color={T.primary} accentColor={T.accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 4 }}>
            {gl.gaya_hidup && <PdfInfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
            {gl.pola_makan && <PdfInfoRow label="Pola Makan" value={gl.pola_makan} />}
            <PdfInfoRow label="Olahraga" value={gl.olahraga_rutin ? 'Ya' : null} />
            {gl.tipe_kepribadian && (
              <PdfInfoRow label="Kepribadian" value={TIPE_LABELS[gl.tipe_kepribadian] ?? gl.tipe_kepribadian} />
            )}
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Pendidikan */}
          {pendidikan.length > 0 && (
            <>
              <PdfSectionTitle title="Pendidikan" color={T.primary} accentColor={T.accent} />
              <div style={{ marginBottom: 10 }}>
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
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.3 }}>
                      {item.jenjang}{item.jurusan ? ` \u2014 ${item.jurusan}` : ''}
                    </p>
                    {item.nama_institusi && (
                      <p style={{ fontSize: 9, color: T.textMid, margin: '1px 0 0', lineHeight: 1.3 }}>
                        {item.nama_institusi}
                      </p>
                    )}
                  </PdfTimelineItem>
                ))}
              </div>

              <PdfDivider color={T.divider} margin="0 0 8px" />
            </>
          )}

          {/* Pekerjaan */}
          {pekerjaan.length > 0 && (
            <>
              <PdfSectionTitle title="Pekerjaan" color={T.primary} accentColor={T.accent} />
              <div style={{ marginBottom: 10 }}>
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
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.3 }}>
                      {item.posisi_jabatan}{item.is_masih_aktif ? ' (Aktif)' : ''}
                    </p>
                    <p style={{ fontSize: 9, color: T.textMid, margin: '1px 0 0', lineHeight: 1.3 }}>
                      {item.nama_perusahaan}{item.tahun_mulai ? ` \u00b7 ${item.tahun_mulai}${item.is_masih_aktif ? '\u2013sekarang' : item.tahun_selesai ? `\u2013${item.tahun_selesai}` : ''}` : ''}
                    </p>
                  </PdfTimelineItem>
                ))}
              </div>

              <PdfDivider color={T.divider} margin="0 0 8px" />
            </>
          )}

          {/* Karakter */}
          {(k.kelebihan.length > 0 || k.kekurangan.length > 0 || k.hobi.length > 0 || k.karakter_diri) && (
            <>
              <PdfSectionTitle title="Karakter" color={T.primary} accentColor={T.accent} />
              {k.karakter_diri && (
                <p style={{ fontSize: 9, color: T.textMid, lineHeight: 1.4, margin: '0 0 6px' }}>
                  {truncate(k.karakter_diri, 120)}
                </p>
              )}
              <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
                {k.kelebihan.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 8, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
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
                    <span style={{ fontSize: 8, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                      Kekurangan
                    </span>
                    <div>
                      {k.kekurangan.slice(0, 3).map((tag) => (
                        <PdfTag key={tag} text={tag} variant="muted" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                {k.hobi.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 8, color: T.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                      Hobi
                    </span>
                    <div>
                      {k.hobi.slice(0, 4).map((tag) => (
                        <PdfTag key={tag} text={tag} variant="accent" />
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ width: 100, flexShrink: 0 }}>
                  {k.mbti_type && <PdfInfoRow label="MBTI" value={k.mbti_type} />}
                  {k.bahasa_cinta && (
                    <PdfInfoRow
                      label="Cinta"
                      value={k.bahasa_cinta.replace(/_/g, ' ')}
                    />
                  )}
                </div>
              </div>

              <PdfDivider color={T.divider} margin="0 0 8px" />
            </>
          )}

          {/* Kriteria Pasangan */}
          {(kr.kriteria_usia_min || kr.kriteria_usia_max || kr.kriteria_domisili || kr.kriteria_pendidikan || kr.kriteria_pekerjaan || kr.kriteria_karakter || kr.kriteria_ibadah) && (
            <PdfSectionTitle title="Kriteria Pasangan" color={T.primary} accentColor={T.accent} />
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px', marginBottom: 4 }}>
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <PdfInfoRow
                label="Usia"
                value={`${kr.kriteria_usia_min || '?'}\u2013${kr.kriteria_usia_max || '?'} th`}
              />
            )}
            <PdfInfoRow label="Domisili" value={kr.kriteria_domisili} />
            <PdfInfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
            <PdfInfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
            <PdfInfoRow label="Karakter" value={kr.kriteria_karakter} />
            <PdfInfoRow label="Ibadah" value={kr.kriteria_ibadah} />
            {kr.bersedia_poligami !== null && (
              <PdfInfoRow label="Poligami" value={kr.bersedia_poligami ? 'Bersedia' : 'Tidak'} />
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. BOTTOM -- Visi Pernikahan (full-width card)
          ═══════════════════════════════════════════════════════ */}
      {(vm.visi || vm.misi_suami || vm.misi_istri || vm.tujuan_pernikahan.length > 0) && (
        <div
          style={{
            margin: `${10}px ${pad}px 0`,
            backgroundColor: T.bgAlt,
            border: `1px solid ${T.divider}`,
            borderRadius: 6,
            padding: '8px 12px',
          }}
        >
          <PdfSectionTitle title="Visi & Misi Pernikahan" color={T.primary} accentColor={T.accent} />

          <div style={{ display: 'flex', gap: 12 }}>
            {/* Visi */}
            {vm.visi && (
              <div
                style={{
                  flex: 1.5,
                  backgroundColor: T.primary,
                  borderRadius: 5,
                  padding: '6px 10px',
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                  Visi
                </span>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4, fontStyle: 'italic' }}>
                  &lsquo;{truncate(vm.visi, 150)}&rsquo;
                </p>
              </div>
            )}

            {/* Misi cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {vm.misi_suami && (
                <div style={{ backgroundColor: T.bg, borderRadius: 4, padding: '4px 8px', border: `1px solid ${T.divider}` }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: T.tertiary, textTransform: 'uppercase' }}>Suami: </span>
                  <span style={{ fontSize: 9, color: T.textMid, lineHeight: 1.3 }}>
                    {truncate(vm.misi_suami, 80)}
                  </span>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ backgroundColor: T.bg, borderRadius: 4, padding: '4px 8px', border: '1px solid #FDE68A' }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Istri: </span>
                  <span style={{ fontSize: 9, color: T.textMid, lineHeight: 1.3 }}>
                    {truncate(vm.misi_istri, 80)}
                  </span>
                </div>
              )}
              {vm.tujuan_pernikahan.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {vm.tujuan_pernikahan.slice(0, 4).map((t) => (
                    <PdfTag key={t} text={t} variant="primary" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
  )
}