// ============================================================
// src/components/templates/TemplateRingkas.tsx
//
// Template CV Taaruf — Gaya Ringkas (FREE Template)
// Warna: Navy (#0F172A), White (#FFFFFF), Gold (#D97706)
// 1 halaman A4 — compact, clean, profesional
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style (bukan CSS var / Tailwind color)
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, box-shadow spread
// ✓ Flexbox / explicit grid — tidak ada auto row height pada grid
// ✓ Font: Inter (body) dan Amiri (Arabic)
// ============================================================

import React from 'react'
import type {
  FormState,
  RiwayatPendidikanItem,
  RiwayatPekerjaanItem,
} from '@/types'

// ── Design Tokens (hex — bukan CSS var) ──────────────────────
const C = {
  navy900:    '#0F172A',
  navy800:    '#1E293B',
  navy700:    '#334155',
  navy600:    '#475569',
  navy500:    '#64748B',
  navy400:    '#94A3B8',
  navy300:    '#CBD5E1',
  navy200:    '#E2E8F0',
  navy100:    '#F1F5F9',
  navy50:     '#F8FAFC',
  gold700:    '#B45309',
  gold600:    '#D97706',
  gold500:    '#F59E0B',
  gold400:    '#FBBF24',
  gold100:    '#FEF3C7',
  gold50:     '#FFFBEB',
  white:      '#FFFFFF',
  text:       '#1E293B',
  textMid:    '#475569',
  textSoft:   '#94A3B8',
}

// ── Ukuran A4 @96dpi ─────────────────────────────────────────
const PAGE_W = 794
const PAGE_H = 1123
const PAGE_PAD = 32
const CONTENT_W = PAGE_W - PAGE_PAD * 2

// ── Shared compact section heading ───────────────────────────
function SectionHeading({
  title,
  icon,
}: {
  title: string
  icon?: string
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && (
          <span style={{ fontSize: 12 }}>{icon}</span>
        )}
        <h2
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.navy900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 3 }}>
        <div style={{ height: 2, width: 28, backgroundColor: C.navy800, borderRadius: 1 }} />
        <div style={{ height: 2, width: 10, backgroundColor: C.gold600, borderRadius: 1 }} />
      </div>
    </div>
  )
}

// ── Compact info row (inline label:value) ────────────────────
function InfoRow({
  label,
  value,
  fullWidth = false,
}: {
  label: string
  value: string | number | undefined | null
  fullWidth?: boolean
}) {
  if (!value && value !== 0) return null
  return (
    <div style={{ marginBottom: 4, width: fullWidth ? '100%' : undefined }}>
      <span style={{ fontSize: 8, color: C.textSoft, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
      <span style={{ fontSize: 10, color: C.text, fontWeight: 500, display: 'block', marginTop: 1, lineHeight: 1.35 }}>
        {value}
      </span>
    </div>
  )
}

// ── Inline info pair (label: value side by side) ─────────────
function InfoPair({
  label,
  value,
}: {
  label: string
  value: string | number | undefined | null
}) {
  if (!value && value !== 0) return null
  return (
    <span style={{ fontSize: 10, color: C.text, lineHeight: 1.35 }}>
      <span style={{ color: C.textSoft, fontWeight: 600, fontSize: 9 }}>{label}: </span>
      {value}
    </span>
  )
}

// ── Tag chip (compact) ──────────────────────────────────────
function Tag({ text, color = 'navy' }: { text: string; color?: 'navy' | 'gold' | 'navylight' }) {
  const styles = {
    navy:      { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    gold:      { bg: C.gold50,  border: '#FDE68A', text: C.gold700 },
    navylight: { bg: C.navy100, border: C.navy300, text: C.navy800 },
  }[color]

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        borderRadius: 999,
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        fontSize: 9,
        color: styles.text,
        fontWeight: 500,
        margin: '0 3px 3px 0',
        lineHeight: 1.5,
      }}
    >
      {text}
    </span>
  )
}

// ── Mini timeline row ────────────────────────────────────────
function MiniTimeline({
  year,
  title,
  subtitle,
  isLast,
}: {
  year?: string
  title: string
  subtitle?: string
  isLast?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 8, paddingBottom: isLast ? 0 : 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
        <span style={{ fontSize: 8, color: C.textSoft, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
          {year ?? ''}
        </span>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.navy800, marginTop: 2, flexShrink: 0 }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, backgroundColor: C.navy200, marginTop: 2 }} />
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.3 }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontSize: 9, color: C.textMid, margin: '1px 0 0', lineHeight: 1.3 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Page footer ───────────────────────────────────────────────
function PageFooter({
  nama,
}: {
  nama: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 24,
        backgroundColor: C.navy900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: PAGE_PAD,
        paddingRight: PAGE_PAD,
      }}
    >
      <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', fontWeight: 600 }}>
        CV TAARUF — DOKUMEN RAHASIA
      </span>
      <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
        {nama || 'Nama'} · Hal. 1
      </span>
    </div>
  )
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

  // Hitung usia
  const usia = p.tanggal_lahir
    ? Math.floor(
        (Date.now() - new Date(p.tanggal_lahir).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null

  // Status label map
  const statusLabel: Record<string, string> = {
    lajang:      'Lajang',
    duda:        'Duda',
    janda:       'Janda',
    cerai_mati:  'Cerai Mati',
    cerai_hidup: 'Cerai Hidup',
  }

  // Shalat label map
  const shalatLabel: Record<string, string> = {
    selalu_berjamaah: 'Selalu berjamaah',
    sering_berjamaah: 'Sering berjamaah',
    sering_sendiri:   'Sering sendiri',
    kadang:           'Kadang-kadang',
    masih_berjuang:   'Masih berjuang',
  }

  // Tipe kepribadian label
  const tipeLabel: Record<string, string> = {
    introvert:  'Introvert',
    ekstrovert: 'Ekstrovert',
    ambivert:   'Ambivert',
  }

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

  return (
    <div
      id="taaruf-template"
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: C.white,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: C.text,
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          1. HEADER STRIP (navy bg)
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: C.navy900,
          padding: `${18}px ${PAGE_PAD}px 16px`,
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
          position: 'absolute', bottom: -15, left: PAGE_PAD,
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
                  border: `2px solid ${C.gold600}`,
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 88,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: `2px dashed rgba(255,255,255,0.15)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 20 }}>👤</span>
                <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>Foto</span>
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
                color: C.gold400,
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
                color: C.white,
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
                  backgroundColor: C.gold600,
                  fontSize: 9, color: C.white, fontWeight: 600,
                }}>
                  {statusLabel[p.status_pernikahan] ?? p.status_pernikahan}
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
          gap: PAGE_PAD,
          padding: `${14}px ${PAGE_PAD}px 0`,
        }}
      >
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Data Pribadi */}
          <SectionHeading title="Data Pribadi" icon="👤" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 10 }}>
            <InfoRow
              label="TTL"
              value={
                [p.tempat_lahir, p.tanggal_lahir]
                  .filter(Boolean)
                  .map((v, i) => i === 1 ? new Date(v as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : v)
                  .join(', ')
              }
              fullWidth
            />
            {p.kewarganegaraan && <InfoRow label="WN" value={p.kewarganegaraan} />}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: C.navy100, marginBottom: 8 }} />

          {/* Fisik & Kesehatan */}
          <SectionHeading title="Fisik & Kesehatan" icon="💪" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 10 }}>
            {(f.tinggi_badan || f.berat_badan) && (
              <InfoRow
                label="TB/BB"
                value={`${f.tinggi_badan || '?'} cm / ${f.berat_badan || '?'} kg`}
              />
            )}
            <InfoRow label="Gol. Darah" value={f.golongan_darah || null} />
            <InfoRow label="Warna Kulit" value={f.warna_kulit} />
            {f.kondisi_kesehatan && <InfoRow label="Kondisi" value={f.kondisi_kesehatan} />}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: C.navy100, marginBottom: 8 }} />

          {/* Ibadah & Keislaman */}
          <SectionHeading title="Ibadah" icon="🕌" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 10 }}>
            <InfoRow label="Mazhab" value={ibadah.mazhab} />
            <InfoRow label="Shalat" value={shalatLabel[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
            <InfoRow label="Sunnah" value={ibadah.shalat_sunnah} />
            <InfoRow label="Hafalan" value={ibadah.hafalan_quran} />
            <InfoRow label="Tilawah" value={ibadah.tilawah_rutin ? 'Ya' : null} />
            <InfoRow label="Kajian" value={ibadah.kajian_rutin ? 'Ya' : null} />
            <InfoRow label="Berpakaian" value={ibadah.cara_berpakaian} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: C.navy100, marginBottom: 8 }} />

          {/* Gaya Hidup */}
          <SectionHeading title="Gaya Hidup" icon="🌱" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginBottom: 4 }}>
            {gl.gaya_hidup && <InfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
            {gl.pola_makan && <InfoRow label="Pola Makan" value={gl.pola_makan} />}
            <InfoRow label="Olahraga" value={gl.olahraga_rutin ? 'Ya' : null} />
            {gl.tipe_kepribadian && (
              <InfoRow label="Kepribadian" value={tipeLabel[gl.tipe_kepribadian] ?? gl.tipe_kepribadian} />
            )}
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Pendidikan */}
          {pendidikan.length > 0 && (
            <>
              <SectionHeading title="Pendidikan" icon="🎓" />
              <div style={{ marginBottom: 10 }}>
                {pendidikan.map((item: RiwayatPendidikanItem, i: number) => (
                  <MiniTimeline
                    key={item.id}
                    year={item.tahun_selesai ? String(item.tahun_selesai) : item.tahun_mulai ? `${item.tahun_mulai}–` : undefined}
                    title={`${item.jenjang}${item.jurusan ? ` — ${item.jurusan}` : ''}`}
                    subtitle={item.nama_institusi}
                    isLast={i === pendidikan.length - 1}
                  />
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: C.navy100, marginBottom: 8 }} />
            </>
          )}

          {/* Pekerjaan */}
          {pekerjaan.length > 0 && (
            <>
              <SectionHeading title="Pekerjaan" icon="💼" />
              <div style={{ marginBottom: 10 }}>
                {pekerjaan.map((item: RiwayatPekerjaanItem, i: number) => (
                  <MiniTimeline
                    key={item.id}
                    year={item.is_masih_aktif ? 'Kini' : item.tahun_selesai ? String(item.tahun_selesai) : undefined}
                    title={`${item.posisi_jabatan}${item.is_masih_aktif ? ' (Aktif)' : ''}`}
                    subtitle={`${item.nama_perusahaan}${item.tahun_mulai ? ` · ${item.tahun_mulai}${item.is_masih_aktif ? '–sekarang' : item.tahun_selesai ? `–${item.tahun_selesai}` : ''}` : ''}`}
                    isLast={i === pekerjaan.length - 1}
                  />
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: C.navy100, marginBottom: 8 }} />
            </>
          )}

          {/* Karakter */}
          {(k.kelebihan.length > 0 || k.kekurangan.length > 0 || k.hobi.length > 0 || k.karakter_diri) && (
            <>
              <SectionHeading title="Karakter" icon="✨" />
              {k.karakter_diri && (
                <p style={{ fontSize: 9, color: C.textMid, lineHeight: 1.4, margin: '0 0 6px' }}>
                  {k.karakter_diri.length > 120 ? `${k.karakter_diri.slice(0, 120)}...` : k.karakter_diri}
                </p>
              )}
              <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
                {k.kelebihan.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 8, color: C.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                      Kelebihan
                    </span>
                    <div>{k.kelebihan.slice(0, 4).map((tag) => <Tag key={tag} text={tag} color="navy" />)}</div>
                  </div>
                )}
                {k.kekurangan.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 8, color: C.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                      Kekurangan
                    </span>
                    <div>{k.kekurangan.slice(0, 3).map((tag) => <Tag key={tag} text={tag} color="navylight" />)}</div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                {k.hobi.length > 0 && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 8, color: C.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                      Hobi
                    </span>
                    <div>{k.hobi.slice(0, 4).map((tag) => <Tag key={tag} text={tag} color="gold" />)}</div>
                  </div>
                )}
                <div style={{ width: 100, flexShrink: 0 }}>
                  {k.mbti_type && <InfoRow label="MBTI" value={k.mbti_type} />}
                  {k.bahasa_cinta && (
                    <InfoRow
                      label="Cinta"
                      value={k.bahasa_cinta.replace(/_/g, ' ')}
                    />
                  )}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: C.navy100, marginBottom: 8 }} />
            </>
          )}

          {/* Kriteria Pasangan */}
          {(kr.kriteria_usia_min || kr.kriteria_usia_max || kr.kriteria_domisili || kr.kriteria_pendidikan || kr.kriteria_pekerjaan || kr.kriteria_karakter || kr.kriteria_ibadah) && (
            <SectionHeading title="Kriteria Pasangan" icon="💍" />
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 14px', marginBottom: 4 }}>
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <InfoRow
                label="Usia"
                value={`${kr.kriteria_usia_min || '?'}–${kr.kriteria_usia_max || '?'} th`}
              />
            )}
            <InfoRow label="Domisili" value={kr.kriteria_domisili} />
            <InfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
            <InfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
            <InfoRow label="Karakter" value={kr.kriteria_karakter} />
            <InfoRow label="Ibadah" value={kr.kriteria_ibadah} />
            {kr.bersedia_poligami !== null && (
              <InfoRow label="Poligami" value={kr.bersedia_poligami ? 'Bersedia' : 'Tidak'} />
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. BOTTOM — Visi Pernikahan (full-width card)
          ═══════════════════════════════════════════════════════ */}
      {(vm.visi || vm.misi_suami || vm.misi_istri || vm.tujuan_pernikahan.length > 0) && (
        <div
          style={{
            margin: `${10}px ${PAGE_PAD}px 0`,
            backgroundColor: C.navy50,
            border: `1px solid ${C.navy200}`,
            borderRadius: 6,
            padding: '8px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <span style={{ fontSize: 11 }}>🌟</span>
            <h2 style={{ fontSize: 10, fontWeight: 700, color: C.navy900, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Visi & Misi Pernikahan
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {/* Visi */}
            {vm.visi && (
              <div
                style={{
                  flex: 1.5,
                  backgroundColor: C.navy900,
                  borderRadius: 5,
                  padding: '6px 10px',
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                  Visi
                </span>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4, fontStyle: 'italic' }}>
                  &lsquo;{vm.visi.length > 150 ? `${vm.visi.slice(0, 150)}...` : vm.visi}&rsquo;
                </p>
              </div>
            )}

            {/* Misi cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {vm.misi_suami && (
                <div style={{ backgroundColor: C.white, borderRadius: 4, padding: '4px 8px', border: `1px solid ${C.navy200}` }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: C.navy700, textTransform: 'uppercase' }}>Suami: </span>
                  <span style={{ fontSize: 9, color: C.textMid, lineHeight: 1.3 }}>
                    {vm.misi_suami.length > 80 ? `${vm.misi_suami.slice(0, 80)}...` : vm.misi_suami}
                  </span>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ backgroundColor: C.white, borderRadius: 4, padding: '4px 8px', border: `1px solid #FDE68A` }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: C.gold700, textTransform: 'uppercase' }}>Istri: </span>
                  <span style={{ fontSize: 9, color: C.textMid, lineHeight: 1.3 }}>
                    {vm.misi_istri.length > 80 ? `${vm.misi_istri.slice(0, 80)}...` : vm.misi_istri}
                  </span>
                </div>
              )}
              {vm.tujuan_pernikahan.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {vm.tujuan_pernikahan.slice(0, 4).map((t) => <Tag key={t} text={t} color="navy" />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          4. PAGE FOOTER
          ═══════════════════════════════════════════════════════ */}
      <PageFooter nama={nama} />
    </div>
  )
}