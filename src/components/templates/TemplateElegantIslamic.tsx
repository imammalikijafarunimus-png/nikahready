// ============================================================
// Template 2 — Elegant Islamic (PREMIUM — 5 pages)
// Gaya: nuansa Islami hangat, gold + deep green, ornamental
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style
// ✓ Tidak ada: position fixed/sticky, backdrop-filter
// ✓ Flexbox / explicit sizing
// ✓ Font: Inter (body) dan Amiri (Arabic)
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

// ── Design Tokens ────────────────────────────────────────────
const C = {
  bg:       '#FFFCF5',
  green900: '#1B4332',
  green800: '#2D6A4F',
  green700: '#40916C',
  green600: '#52B788',
  green100: '#D8F3DC',
  green50:  '#F0FFF4',
  gold700:  '#B8860B',
  gold600:  '#C9A84C',
  gold500:  '#D4A843',
  gold400:  '#E8C872',
  gold100:  '#F5EDD6',
  gold50:   '#FEFBF0',
  text:     '#1A1A2E',
  textMid:  '#4A4A5A',
  textSoft: '#7A7A8A',
  textMuted:'#AAAABC',
  white:    '#FFFFFF',
  gray100:  '#F5F5F0',
  gray200:  '#E5E5E0',
  gray50:   '#FAFAF8',
}

const PAGE_W = 794
const PAGE_H = 1123
const PAD = 44

// ── Shared label maps ────────────────────────────────────────
const shalatLabel: Record<string, string> = {
  selalu_berjamaah: 'Alhamdulillah, selalu berjamaah',
  sering_berjamaah: 'Sering berjamaah',
  sering_sendiri: 'Sering, tapi sendiri',
  kadang: 'Kadang-kadang',
  masih_berjuang: 'Masih berjuang 🤲',
}

const tipeLabel: Record<string, string> = {
  introvert: '🤫 Introvert',
  ekstrovert: '🗣️ Ekstrovert',
  ambivert: '⚖️ Ambivert',
}

const statusLabel: Record<string, string> = {
  lajang: 'Lajang / Belum Pernah Menikah',
  duda: 'Duda',
  janda: 'Janda',
  cerai_mati: 'Cerai Mati',
  cerai_hidup: 'Cerai Hidup',
}

// ── Page wrapper ─────────────────────────────────────────────
function Page({ children, isLast = false }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: C.bg,
        position: 'relative',
        overflow: 'hidden',
        pageBreakAfter: isLast ? 'auto' : 'always',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: C.text,
        boxSizing: 'border-box',
      }}
    >
      {/* Corner ornaments */}
      <CornerOrnament top left />
      <CornerOrnament top right />
      <CornerOrnament bottom left />
      <CornerOrnament bottom right />
      {children}
    </div>
  )
}

// ── Corner ornament ──────────────────────────────────────────
function CornerOrnament({ top, right, bottom, left }: { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean }) {
  const s = 36
  return (
    <div style={{
      position: 'absolute',
      top: top ? 14 : undefined,
      bottom: bottom ? 14 : undefined,
      left: left ? 14 : undefined,
      right: right ? 14 : undefined,
      width: s,
      height: s,
      borderTop: top ? `2px solid ${C.gold600}50` : 'none',
      borderBottom: bottom ? `2px solid ${C.gold600}50` : 'none',
      borderLeft: left ? `2px solid ${C.gold600}50` : 'none',
      borderRight: right ? `2px solid ${C.gold600}50` : 'none',
      pointerEvents: 'none',
    }} />
  )
}

// ── Section heading ──────────────────────────────────────────
function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: C.gold600, fontSize: 7 }}>◆</span>
        <h2 style={{
          fontSize: 12, fontWeight: 700, color: C.green900,
          letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0,
        }}>
          {title}
        </h2>
        <div style={{
          flex: 1, height: 1,
          background: `linear-gradient(90deg, ${C.gold600}30, transparent)`,
        }} />
      </div>
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '12px 0' }}>
      <div style={{ flex: 1, maxWidth: 80, height: 1, backgroundColor: C.gold600, opacity: 0.3 }} />
      <span style={{ fontSize: 7, color: C.gold600 }}>✦</span>
      <div style={{ flex: 1, maxWidth: 80, height: 1, backgroundColor: C.gold600, opacity: 0.3 }} />
    </div>
  )
}

// ── Info row ─────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null | number }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ marginBottom: 5 }}>
      <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: C.text, fontWeight: 500, display: 'block', marginTop: 1 }}>
        {value}
      </span>
    </div>
  )
}

// ── Tag chip ─────────────────────────────────────────────────
function Tag({ text, color = 'green' }: { text: string; color?: 'green' | 'gold' | 'gray' }) {
  const styles = {
    green: { bg: C.green100, border: `${C.green600}30`, text: C.green900 },
    gold:  { bg: C.gold100, border: `${C.gold600}30`, text: C.gold700 },
    gray:  { bg: C.gray100, border: `${C.gray200}`, text: C.textMid },
  }[color]

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        fontSize: 10,
        color: styles.text,
        fontWeight: 500,
        margin: '0 4px 4px 0',
      }}
    >
      {text}
    </span>
  )
}

// ── Timeline item ────────────────────────────────────────────
function TimelineItem({
  year,
  isLast,
  dotColor,
  lineColor,
  children,
}: {
  year?: string
  isLast?: boolean
  dotColor?: string
  lineColor?: string
  children: React.ReactNode
}) {
  const dc = dotColor || C.green700
  const lc = lineColor || C.green100
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 50, flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
          {year ?? ''}
        </span>
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: dc, marginTop: 2, flexShrink: 0 }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, backgroundColor: lc, marginTop: 3 }} />
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ── Financial progress bar ───────────────────────────────────
function FinancialBar({ label, persen, color }: { label: string; persen: number; color: string }) {
  const safePercent = Math.min(100, Math.max(0, persen))
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: C.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{safePercent}%</span>
      </div>
      <div style={{ height: 6, backgroundColor: C.gray100, borderRadius: 999 }}>
        <div style={{ height: 6, width: `${safePercent}%`, backgroundColor: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

// ── Page footer ──────────────────────────────────────────────
function PageFooter({ pageNum, nama }: { pageNum: number; nama: string }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 26, backgroundColor: C.green900,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingLeft: PAD, paddingRight: PAD,
    }}>
      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
        LEMBAR TAARUF — DOKUMEN RAHASIA
      </span>
      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
        {nama} · Hal. {pageNum}
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 1 — Cover + Biodata + Keluarga + Sosial Media
// ═══════════════════════════════════════════════════════════════
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const nama = p.nama_lengkap || 'Nama Lengkap'

  const usia = p.tanggal_lahir
    ? Math.floor((Date.now() - new Date(p.tanggal_lahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const visibleSosmed = state.sosialMedia.filter((s) => s.tampil_di_pdf)

  return (
    <Page>
      <div style={{ padding: `36px ${PAD}px 36px` }}>

        {/* Bismillah */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <p style={{
            fontFamily: "'Amiri', Georgia, serif", fontSize: 22,
            color: C.green900, direction: 'rtl', margin: 0, lineHeight: 1.8,
          }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>

        <Divider />

        {/* Nama + Foto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          {state.fotoTemplate.foto_pribadi_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={state.fotoTemplate.foto_pribadi_url} alt={nama} style={{
              width: 90, height: 110, objectFit: 'cover', borderRadius: 8,
              border: `3px solid ${C.gold600}`, flexShrink: 0,
            }} crossOrigin="anonymous" />
          ) : (
            <div style={{
              width: 90, height: 110, borderRadius: 8,
              backgroundColor: C.gold100, border: `2px dashed ${C.gold600}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, flexShrink: 0,
            }}>
              <span style={{ fontSize: 22 }}>👤</span>
              <span style={{ fontSize: 8, color: C.textMuted }}>Foto</span>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.green900, margin: 0, lineHeight: 1.2 }}>
              {nama}
            </h1>
            {p.nama_panggilan && (
              <p style={{ fontSize: 11, color: C.textSoft, marginTop: 2, fontStyle: 'italic' }}>
                &lsquo;{p.nama_panggilan}&rsquo;
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {usia && (
                <span style={{ padding: '3px 10px', borderRadius: 999, backgroundColor: C.green100, fontSize: 10, color: C.green900, fontWeight: 500 }}>
                  {usia} tahun
                </span>
              )}
              {p.domisili_kota && (
                <span style={{ padding: '3px 10px', borderRadius: 999, backgroundColor: C.green100, fontSize: 10, color: C.green900, fontWeight: 500 }}>
                  📍 {p.domisili_kota}
                </span>
              )}
              {p.status_pernikahan && (
                <span style={{ padding: '3px 10px', borderRadius: 999, backgroundColor: C.gold600, fontSize: 10, color: C.white, fontWeight: 600 }}>
                  {statusLabel[p.status_pernikahan] ?? p.status_pernikahan}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tentang Saya */}
        {state.karakter.karakter_diri && (
          <>
            <SectionTitle title="Tentang Saya" />
            <p style={{ fontSize: 11, lineHeight: 1.7, color: C.textMid, margin: '0 0 14px', textAlign: 'justify' }}>
              {state.karakter.karakter_diri}
            </p>
          </>
        )}

        {/* 2-Column: Data Pribadi + Keislaman */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <SectionTitle title="Data Pribadi" />
            <InfoRow label="Tempat, Tanggal Lahir" value={
              p.tempat_lahir && p.tanggal_lahir
                ? `${p.tempat_lahir}, ${new Date(p.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : undefined
            } />
            <InfoRow label="Kewarganegaraan" value={p.kewarganegaraan} />
            <InfoRow label="Suku Bangsa" value={p.suku_bangsa} />
            <InfoRow label="Tinggi / Berat" value={
              state.fisikKesehatan.tinggi_badan && state.fisikKesehatan.berat_badan
                ? `${state.fisikKesehatan.tinggi_badan} cm / ${state.fisikKesehatan.berat_badan} kg`
                : undefined
            } />
          </div>
          <div style={{ flex: 1 }}>
            <SectionTitle title="Keislaman" />
            <InfoRow label="Mazhab" value={state.ibadah.mazhab} />
            <InfoRow label="Shalat Fardhu" value={shalatLabel[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu} />
            <InfoRow label="Hafalan Qur'an" value={state.ibadah.hafalan_quran} />
            <InfoRow label="Cara Berpakaian" value={state.ibadah.cara_berpakaian} />
          </div>
        </div>

        {/* Sosial Media */}
        {visibleSosmed.length > 0 && (
          <>
            <Divider />
            <SectionTitle title="Sosial Media" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginBottom: 4 }}>
              {visibleSosmed.map((s) => (
                <span key={s.id} style={{ fontSize: 10, color: C.textMid }}>
                  <strong style={{ color: C.text }}>{s.platform}</strong>: {s.username}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Anggota Keluarga */}
        {state.anggotaKeluarga.length > 0 && (
          <>
            <Divider />
            <SectionTitle title="Anggota Keluarga" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              {state.anggotaKeluarga.map((anggota: AnggotaKeluargaItem) => (
                <div key={anggota.id} style={{ minWidth: 150 }}>
                  <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
                    {anggota.hubungan}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{anggota.nama}</span>
                  {anggota.pekerjaan && (
                    <span style={{ fontSize: 10, color: C.textMid, display: 'block' }}>{anggota.pekerjaan}</span>
                  )}
                  {anggota.pendidikan && (
                    <span style={{ fontSize: 10, color: C.textSoft }}>{anggota.pendidikan}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

      </div>
      <PageFooter pageNum={1} nama={nama} />
    </Page>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2 — Pendidikan + Pekerjaan + Organisasi
// ═══════════════════════════════════════════════════════════════
function Page2({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <Page>
      <div style={{ padding: `${PAD}px ${PAD}px 36px` }}>

        {/* Pendidikan */}
        {state.riwayatPendidikan.length > 0 && (
          <>
            <SectionTitle title="Riwayat Pendidikan" />
            <div style={{ marginBottom: 20 }}>
              {state.riwayatPendidikan.map((edu: RiwayatPendidikanItem, i: number) => (
                <TimelineItem
                  key={edu.id}
                  year={edu.tahun_selesai ? String(edu.tahun_selesai) : edu.tahun_mulai ? `${edu.tahun_mulai}–` : undefined}
                  isLast={i === state.riwayatPendidikan.length - 1}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                    {edu.jenjang}{edu.jurusan ? ` — ${edu.jurusan}` : ''}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                    {edu.nama_institusi} · {edu.tahun_mulai}–{edu.tahun_selesai}
                  </p>
                  {edu.prestasi && (
                    <p style={{ fontSize: 10, color: C.green800, marginTop: 3, fontStyle: 'italic' }}>🏆 {edu.prestasi}</p>
                  )}
                </TimelineItem>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {state.riwayatPendidikan.length > 0 && state.riwayatPekerjaan.length > 0 && (
          <Divider />
        )}

        {/* Pekerjaan */}
        {state.riwayatPekerjaan.length > 0 && (
          <>
            <SectionTitle title="Riwayat Pekerjaan" />
            <div style={{ marginBottom: 20 }}>
              {state.riwayatPekerjaan.map((job: RiwayatPekerjaanItem, i: number) => (
                <TimelineItem
                  key={job.id}
                  year={job.is_masih_aktif ? 'Kini' : job.tahun_selesai ? String(job.tahun_selesai) : undefined}
                  isLast={i === state.riwayatPekerjaan.length - 1}
                  dotColor={C.gold600}
                  lineColor={C.gold100}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                    {job.posisi_jabatan}
                    {job.is_masih_aktif && (
                      <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 999, backgroundColor: C.green100, color: C.green900, fontSize: 9, fontWeight: 600 }}>Aktif</span>
                    )}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                    {job.nama_perusahaan} · {job.tahun_mulai}–{job.is_masih_aktif ? 'sekarang' : job.tahun_selesai}
                  </p>
                  {job.deskripsi_pekerjaan && (
                    <p style={{ fontSize: 10, color: C.textMid, marginTop: 4, lineHeight: 1.5 }}>
                      {job.deskripsi_pekerjaan}
                    </p>
                  )}
                </TimelineItem>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {(state.riwayatPendidikan.length > 0 || state.riwayatPekerjaan.length > 0) && state.riwayatOrganisasi.length > 0 && (
          <Divider />
        )}

        {/* Organisasi */}
        {state.riwayatOrganisasi.length > 0 && (
          <>
            <SectionTitle title="Riwayat Organisasi" />
            <div>
              {state.riwayatOrganisasi.map((org: RiwayatOrganisasiItem, i: number) => (
                <TimelineItem
                  key={org.id}
                  year={org.tahun_selesai ? String(org.tahun_selesai) : undefined}
                  isLast={i === state.riwayatOrganisasi.length - 1}
                  dotColor={C.green800}
                  lineColor={C.gray200}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                    {org.jabatan || org.nama_organisasi}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                    {org.nama_organisasi}
                    {org.tahun_mulai && ` · ${org.tahun_mulai}${org.tahun_selesai ? `–${org.tahun_selesai}` : ''}`}
                  </p>
                  {org.deskripsi && (
                    <p style={{ fontSize: 10, color: C.textMid, marginTop: 3, lineHeight: 1.5 }}>{org.deskripsi}</p>
                  )}
                </TimelineItem>
              ))}
            </div>
          </>
        )}

      </div>
      <PageFooter pageNum={2} nama={nama} />
    </Page>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 3 — Perjalanan Hidup
// ═══════════════════════════════════════════════════════════════
function Page3({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  const faseColor: Record<string, string> = {
    masa_kecil:  '#3B82F6',
    remaja:      '#8B5CF6',
    dewasa_awal: C.green700,
    saat_ini:    C.gold600,
  }

  const faseEmoji: Record<string, string> = {
    masa_kecil:  '🌱',
    remaja:      '📚',
    dewasa_awal: '🚀',
    saat_ini:    '⭐',
  }

  return (
    <Page>
      <div style={{ padding: `${PAD}px ${PAD}px 36px` }}>

        {/* Ayat pembuka */}
        <div style={{
          backgroundColor: C.green50,
          border: `1px solid ${C.green100}`,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 14, color: C.gold600, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
            وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
          </p>
          <p style={{ fontSize: 9, color: C.textSoft, marginTop: 4, fontStyle: 'italic' }}>
            &ldquo;Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu&rdquo; — QS Al-Baqarah: 216
          </p>
        </div>

        <SectionTitle title="Perjalanan Hidup" />

        <div>
          {state.perjalananHidup.map((item: PerjalananHidupItem, i: number) => {
            const color = faseColor[item.fase] ?? C.green700
            const emoji = faseEmoji[item.fase] ?? '📍'

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  paddingBottom: i === state.perjalananHidup.length - 1 ? 0 : 20,
                }}
              >
                {/* Phase indicator column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56, flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    backgroundColor: color, color: C.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0,
                  }}>
                    {emoji}
                  </div>
                  {i < state.perjalananHidup.length - 1 && (
                    <div style={{ width: 2, flex: 1, backgroundColor: C.gray100, marginTop: 4 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: 4 }}>
                  {/* Judul + tahun */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>
                      {item.judul}
                    </h3>
                    {(item.tahun_mulai || item.tahun_selesai) && (
                      <span style={{ fontSize: 9, color: C.textSoft, flexShrink: 0, marginLeft: 8 }}>
                        {item.tahun_mulai}{item.tahun_selesai ? `–${item.tahun_selesai}` : ''}
                      </span>
                    )}
                  </div>

                  {/* Cerita */}
                  {item.cerita && (
                    <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.6, margin: 0, marginBottom: 6 }}>
                      {item.cerita}
                    </p>
                  )}

                  {/* Pelajaran */}
                  {item.pelajaran && (
                    <div style={{
                      backgroundColor: C.gold50,
                      border: `1px solid ${C.gold600}30`,
                      borderRadius: 6, padding: '5px 10px',
                    }}>
                      <span style={{ fontSize: 9, color: C.gold700, fontWeight: 700, display: 'block', marginBottom: 2 }}>
                        💡 Hikmah & Pelajaran
                      </span>
                      <p style={{ fontSize: 10, color: C.gold700, margin: 0, lineHeight: 1.5 }}>
                        {item.pelajaran}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
      <PageFooter pageNum={3} nama={nama} />
    </Page>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 4 — Karakter + Ibadah + Gaya Hidup
// ═══════════════════════════════════════════════════════════════
function Page4({ state }: { state: FormState }) {
  const nama   = state.dataPribadi.nama_lengkap || 'Nama'
  const k      = state.karakter
  const ibadah = state.ibadah
  const gl     = state.gayaHidup

  return (
    <Page>
      <div style={{ padding: `${PAD}px ${PAD}px 36px` }}>

        {/* ── Karakter & Kepribadian ──────────────────────── */}
        <SectionTitle title="Karakter & Kepribadian" />

        {k.karakter_diri && (
          <p style={{ fontSize: 11, color: C.textMid, lineHeight: 1.6, marginBottom: 14 }}>
            {k.karakter_diri}
          </p>
        )}

        {/* Kelebihan + Kekurangan */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
          {k.kelebihan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Kelebihan
              </p>
              <div>{k.kelebihan.map((tag) => <Tag key={tag} text={tag} color="green" />)}</div>
            </div>
          )}
          {k.kekurangan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Kekurangan
              </p>
              <div>{k.kekurangan.map((tag) => <Tag key={tag} text={tag} color="gray" />)}</div>
            </div>
          )}
        </div>

        {/* Hobi + MBTI + Bahasa Cinta + Tipe */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 6 }}>
          {k.hobi.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Hobi & Minat
              </p>
              <div>{k.hobi.map((tag) => <Tag key={tag} text={tag} color="gold" />)}</div>
            </div>
          )}
          <div style={{ width: 170, flexShrink: 0 }}>
            {k.mbti_type && <InfoRow label="Tipe MBTI" value={k.mbti_type} />}
            {k.bahasa_cinta && <InfoRow label="Bahasa Cinta" value={k.bahasa_cinta.replace(/_/g, ' ')} />}
            {gl.tipe_kepribadian && <InfoRow label="Tipe Kepribadian" value={tipeLabel[gl.tipe_kepribadian] ?? ''} />}
          </div>
        </div>

        {/* Divider */}
        <Divider />

        {/* ── Ibadah & Keislaman (detailed) ────────────────── */}
        <SectionTitle title="Ibadah & Keislaman" />

        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <InfoRow label="Mazhab" value={ibadah.mazhab} />
            <InfoRow label="Cara Berpakaian" value={ibadah.cara_berpakaian} />
            <InfoRow label="Shalat Fardhu" value={shalatLabel[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
            <InfoRow label="Shalat Sunnah" value={ibadah.shalat_sunnah} />
          </div>
          <div style={{ flex: 1 }}>
            <InfoRow label="Hafalan Qur'an" value={ibadah.hafalan_quran} />
            <InfoRow label="Tilawah Rutin" value={ibadah.tilawah_rutin ? '✓ Ya' : '✗ Belum rutin'} />
            <InfoRow label="Kajian Rutin" value={ibadah.kajian_rutin ? '✓ Ya' : '✗ Belum rutin'} />
          </div>
        </div>

        {ibadah.deskripsi_ibadah && (
          <div style={{
            backgroundColor: C.green50,
            border: `1px solid ${C.green100}`,
            borderRadius: 6, padding: '8px 12px', marginBottom: 6,
          }}>
            <p style={{ fontSize: 10, color: C.green900, lineHeight: 1.6, margin: 0 }}>
              {ibadah.deskripsi_ibadah}
            </p>
          </div>
        )}

        {/* Divider */}
        <Divider />

        {/* ── Gaya Hidup ──────────────────────────────────── */}
        <SectionTitle title="Gaya Hidup" />

        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            {gl.gaya_hidup && <InfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
            {gl.pola_makan && <InfoRow label="Pola Makan" value={gl.pola_makan} />}
            <InfoRow label="Olahraga Rutin" value={gl.olahraga_rutin ? '✓ Ya' : '✗ Belum rutin'} />
          </div>
          <div style={{ flex: 1 }}>
            {gl.kebiasaan_positif && <InfoRow label="Kebiasaan Positif" value={gl.kebiasaan_positif} />}
            {gl.hal_tidak_disukai && <InfoRow label="Hal yang Tidak Disukai" value={gl.hal_tidak_disukai} />}
          </div>
        </div>

      </div>
      <PageFooter pageNum={4} nama={nama} />
    </Page>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 5 — Visi + Kriteria + Financial + Rencana + Pandangan + Closing
// ═══════════════════════════════════════════════════════════════
function Page5({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'
  const vm   = state.visiMisi
  const kr   = state.kriteria
  const fp   = state.financialPlanning
  const pi   = state.pandanganIsu

  return (
    <Page isLast>
      <div style={{ padding: `${PAD}px ${PAD}px 36px` }}>

        {/* ── Visi & Misi Pernikahan ──────────────────────── */}
        {(vm.visi || vm.misi_suami || vm.misi_istri) && (
          <>
            <SectionTitle title="Visi & Misi Pernikahan" />

            {vm.visi && (
              <div style={{
                backgroundColor: C.green900,
                borderRadius: 8, padding: '10px 14px', marginBottom: 12,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>
                  VISI
                </p>
                <p style={{ fontSize: 11, color: C.white, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  &lsquo;{vm.visi}&rsquo;
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              {vm.misi_suami && (
                <div style={{ flex: 1, backgroundColor: C.gold50, border: `1px solid ${C.gold600}30`, borderRadius: 6, padding: '8px 10px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.gold700, textTransform: 'uppercase', marginBottom: 3 }}>Peran Suami</p>
                  <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_suami}</p>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ flex: 1, backgroundColor: C.green50, border: `1px solid ${C.green600}30`, borderRadius: 6, padding: '8px 10px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.green800, textTransform: 'uppercase', marginBottom: 3 }}>Peran Istri</p>
                  <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_istri}</p>
                </div>
              )}
            </div>

            {vm.tujuan_pernikahan.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                  Tujuan Pernikahan
                </p>
                <div>{vm.tujuan_pernikahan.map((t) => <Tag key={t} text={t} color="green" />)}</div>
              </div>
            )}

            <Divider />
          </>
        )}

        {/* ── Kriteria Pasangan + Financial (2 kolom) ──────── */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>

          {/* Kriteria */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionTitle title="Kriteria Pasangan" />
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <InfoRow
                label="Usia"
                value={`${kr.kriteria_usia_min || '?'} – ${kr.kriteria_usia_max || '?'} tahun`}
              />
            )}
            <InfoRow label="Domisili" value={kr.kriteria_domisili} />
            <InfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
            <InfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
            <InfoRow label="Karakter" value={kr.kriteria_karakter} />
            <InfoRow label="Ibadah" value={kr.kriteria_ibadah} />
            {kr.bersedia_poligami !== null && (
              <InfoRow label="Bersedia Poligami" value={kr.bersedia_poligami ? 'Ya' : 'Tidak'} />
            )}
            {kr.bersedia_pindah_domisili !== null && (
              <InfoRow label="Bersedia Pindah Domisili" value={kr.bersedia_pindah_domisili ? 'Ya' : 'Tidak'} />
            )}
            {kr.kriteria_lainnya && (
              <InfoRow label="Lainnya" value={kr.kriteria_lainnya} />
            )}
          </div>

          {/* Financial Planning */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionTitle title="Financial Planning" />

            {fp.penghasilan_range && (
              <div style={{
                backgroundColor: C.green50, border: `1px solid ${C.green100}`,
                borderRadius: 6, padding: '6px 10px', marginBottom: 12,
              }}>
                <span style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>
                  Rentang Penghasilan
                </span>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.green900, margin: '2px 0 0' }}>
                  {fp.penghasilan_range}
                </p>
              </div>
            )}

            <p style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Alokasi Keuangan
            </p>

            <FinancialBar label="Kebutuhan Pokok" persen={fp.kebutuhan_pokok_persen} color={C.green700} />
            <FinancialBar label="Tabungan"        persen={fp.tabungan_persen}         color="#3B82F6" />
            <FinancialBar label="Investasi"       persen={fp.investasi_persen}        color="#8B5CF6" />
            <FinancialBar label="Sedekah / Zakat" persen={fp.sedekah_persen}          color={C.gold600} />
            <FinancialBar label="Lainnya"         persen={fp.lainnya_persen}          color={C.textSoft} />

            {fp.deskripsi && (
              <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.5, marginTop: 8, fontStyle: 'italic' }}>
                {fp.deskripsi}
              </p>
            )}
          </div>
        </div>

        {/* ── Rencana Masa Depan ───────────────────────────── */}
        {state.rencanaMasaDepan.length > 0 && (
          <>
            <Divider />
            <SectionTitle title="Rencana Masa Depan" />
            <div>
              {state.rencanaMasaDepan.map((item, i: number) => (
                <div key={item.id} style={{
                  display: 'flex', gap: 12,
                  paddingBottom: i === state.rencanaMasaDepan.length - 1 ? 0 : 14,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 50, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 8, padding: '2px 6px', borderRadius: 4,
                      backgroundColor: item.tipe === 'pendek' ? C.gold100 : C.green100,
                      color: item.tipe === 'pendek' ? C.gold700 : C.green900,
                      fontWeight: 700, textTransform: 'uppercase',
                    }}>
                      {item.tipe === 'pendek' ? 'J. Pendek' : 'J. Panjang'}
                    </span>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: item.tipe === 'pendek' ? C.gold600 : C.green700, marginTop: 4 }} />
                    {i < state.rencanaMasaDepan.length - 1 && (
                      <div style={{ width: 1, flex: 1, backgroundColor: C.gray100, marginTop: 3 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>{item.rencana}</p>
                      {item.waktu && (
                        <span style={{ fontSize: 9, color: C.textSoft, flexShrink: 0, marginLeft: 8 }}>{item.waktu}</span>
                      )}
                    </div>
                    {item.target && (
                      <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0', lineHeight: 1.5 }}>
                        🎯 {item.target}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Pandangan Isu ───────────────────────────────── */}
        {pi.pandangan_isu && (
          <>
            <Divider />
            <SectionTitle title="Pandangan tentang Pernikahan" />
            <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.6, marginBottom: 4 }}>
              {pi.pandangan_isu}
            </p>
          </>
        )}

        {/* ── Penutup doa ────────────────────────────────── */}
        <div style={{
          marginTop: 24, backgroundColor: C.green900, borderRadius: 8,
          padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 16, color: C.gold400, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontStyle: 'italic' }}>
            &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami istri-istri dan keturunan kami sebagai penyenang hati&rdquo; — QS Al-Furqan: 74
          </p>
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 10, letterSpacing: '0.05em' }}>
            DIBUAT DENGAN TAARUFCV · DOKUMEN RAHASIA
          </p>
        </div>

      </div>
      <PageFooter pageNum={5} nama={nama} />
    </Page>
  )
}

// ── Main Export ──────────────────────────────────────────────
export function TemplateElegantIslamic({ state }: { state: FormState }) {
  return (
    <div
      id="taaruf-template"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        width: 794,
        backgroundColor: '#E5E7EB',
        gap: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Page1 state={state} />
      <Page2 state={state} />
      <Page3 state={state} />
      <Page4 state={state} />
      <Page5 state={state} />
    </div>
  )
}