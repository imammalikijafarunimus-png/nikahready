// ============================================================
// src/components/templates/TemplateAkademik.tsx
//
// Template CV Taaruf — Gaya Akademik Islami
// Warna: Sage Green (#064E3B), Navy (#0F172A), Gold (#D97706)
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style (bukan CSS var / Tailwind color)
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, box-shadow spread
// ✓ Flexbox / explicit grid — tidak ada auto row height pada grid
// ✓ Font: Inter (body) dan Amiri (Arabic) — sudah di-preload di layout.tsx
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

// ── Design Tokens (hex — bukan CSS var) ──────────────────────
const C = {
  sage900:  '#064E3B',
  sage800:  '#065F46',
  sage700:  '#047857',
  sage600:  '#059669',
  sage100:  '#D1FAE5',
  sage50:   '#ECFDF5',
  navy900:  '#0F172A',
  navy800:  '#1E293B',
  navy700:  '#334155',
  navy500:  '#64748B',
  navy300:  '#CBD5E1',
  navy100:  '#F1F5F9',
  gold600:  '#D97706',
  gold500:  '#F59E0B',
  gold100:  '#FEF3C7',
  white:    '#FFFFFF',
  text:     '#1E293B',
  textMid:  '#475569',
  textSoft: '#94A3B8',
}

// ── Ukuran A4 @96dpi ─────────────────────────────────────────
const PAGE_W = 794
const PAGE_H = 1123
const PAGE_PAD = 40
const CONTENT_W = PAGE_W - PAGE_PAD * 2

// ── Shared page wrapper ───────────────────────────────────────
function Page({
  children,
  isLast = false,
}: {
  children: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: C.white,
        position: 'relative',
        overflow: 'hidden',
        pageBreakAfter: isLast ? 'auto' : 'always',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: C.text,
      }}
    >
      {children}
    </div>
  )
}

// ── Section heading ───────────────────────────────────────────
function SectionHeading({
  title,
  icon,
}: {
  title: string
  icon?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && (
          <span style={{ fontSize: 14 }}>{icon}</span>
        )}
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.sage900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {/* Dekorasi garis */}
      <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
        <div style={{ height: 2, width: 36, backgroundColor: C.sage700, borderRadius: 2 }} />
        <div style={{ height: 2, width: 12, backgroundColor: C.gold600, borderRadius: 2 }} />
        <div style={{ height: 2, width: 6, backgroundColor: C.sage100, borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── Info row (label + value) ──────────────────────────────────
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
    <div style={{ marginBottom: 6, width: fullWidth ? '100%' : undefined }}>
      <span style={{ fontSize: 9, color: C.textSoft, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: C.text, fontWeight: 500, display: 'block', marginTop: 1, lineHeight: 1.4 }}>
        {value}
      </span>
    </div>
  )
}

// ── Tag chip ──────────────────────────────────────────────────
function Tag({ text, color = 'sage' }: { text: string; color?: 'sage' | 'gold' | 'navy' }) {
  const styles = {
    sage:  { bg: C.sage50,  border: C.sage100, text: C.sage900 },
    gold:  { bg: C.gold100, border: '#FDE68A', text: C.gold600 },
    navy:  { bg: C.navy100, border: C.navy300, text: C.navy800 },
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

// ── Timeline item ─────────────────────────────────────────────
function TimelineItem({
  year,
  isLast,
  children,
}: {
  year?: string
  isLast?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 14 }}>
      {/* Year + dot + line column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 50, flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: C.textSoft, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
          {year ?? ''}
        </span>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.sage600, marginTop: 2, flexShrink: 0 }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, backgroundColor: C.sage100, marginTop: 3 }} />
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingTop: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ── Financial progress bar ────────────────────────────────────
function FinancialBar({
  label,
  persen,
  color,
}: {
  label: string
  persen: number
  color: string
}) {
  const safePercent = Math.min(100, Math.max(0, persen))
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: C.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{safePercent}%</span>
      </div>
      {/* Track */}
      <div style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 999 }}>
        {/* Fill */}
        <div style={{ height: 6, width: `${safePercent}%`, backgroundColor: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

// ── Page footer ───────────────────────────────────────────────
function PageFooter({
  pageNum,
  nama,
}: {
  pageNum: number
  nama: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        backgroundColor: C.sage900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: PAGE_PAD,
        paddingRight: PAGE_PAD,
      }}
    >
      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
        CV TAARUF — DOKUMEN RAHASIA
      </span>
      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
        {nama || 'Nama'} · Hal. {pageNum}
      </span>
    </div>
  )
}

// ── PAGE 1: Cover + Biodata ───────────────────────────────────
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const f = state.fisikKesehatan
  const nama = p.nama_lengkap || 'Nama Lengkap'
  const kontakWA = state.sosialMedia.find(
    (s) => s.platform === 'WhatsApp' && s.tampil_di_pdf
  )

  // Hitung usia dari tanggal lahir
  const usia = p.tanggal_lahir
    ? Math.floor(
        (Date.now() - new Date(p.tanggal_lahir).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : null

  const statusLabel: Record<string, string> = {
    lajang: 'Lajang / Belum Pernah Menikah',
    duda: 'Duda',
    janda: 'Janda',
    cerai_mati: 'Cerai Mati',
    cerai_hidup: 'Cerai Hidup',
  }

  return (
    <Page>
      {/* ── Header Banner ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: C.sage900,
          padding: `${PAGE_PAD}px ${PAGE_PAD}px 28px`,
          position: 'relative',
        }}
      >
        {/* Ornamen lingkaran dekoratif kanan atas */}
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

        {/* Ayat pembuka */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p
            style={{
              fontFamily: "'Amiri', Georgia, serif",
              fontSize: 18,
              color: C.gold500,
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
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
                  border: `3px solid ${C.gold600}`,
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              /* Placeholder foto */
              <div
                style={{
                  width: 100,
                  height: 120,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: `2px dashed ${C.gold600}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 24 }}>👤</span>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Foto Profil</span>
              </div>
            )}
          </div>

          {/* Nama + info utama */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: C.white,
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {nama}
            </h1>
            {p.nama_panggilan && (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontStyle: 'italic' }}>
                &lsquo;{p.nama_panggilan}&rsquo;
              </p>
            )}

            {/* Chips info ringkas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {usia && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 10, color: C.white, fontWeight: 500,
                }}>
                  {usia} tahun
                </span>
              )}
              {p.domisili_kota && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 10, color: C.white, fontWeight: 500,
                }}>
                  📍 {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
                </span>
              )}
              {p.status_pernikahan && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: C.gold600,
                  fontSize: 10, color: C.white, fontWeight: 600,
                }}>
                  {statusLabel[p.status_pernikahan] ?? p.status_pernikahan}
                </span>
              )}
            </div>

            {/* Kontak WA */}
            {kontakWA && (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                📱 WhatsApp: {kontakWA.username}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Body Content ─────────────────────────────────────── */}
      <div style={{ padding: `24px ${PAGE_PAD}px 40px` }}>
        {/* Data Pribadi + Fisik (2 kolom) */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Kolom kiri: Data Pribadi */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Data Pribadi" icon="👤" />
            <InfoRow label="Nama Lengkap" value={p.nama_lengkap} />
            {p.tempat_lahir && p.tanggal_lahir && (
              <InfoRow
                label="Tempat, Tanggal Lahir"
                value={`${p.tempat_lahir}, ${new Date(p.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              />
            )}
            <InfoRow label="Kewarganegaraan" value={p.kewarganegaraan} />
            <InfoRow label="Suku Bangsa" value={p.suku_bangsa} />
            <InfoRow label="Domisili" value={[p.domisili_kota, p.domisili_provinsi].filter(Boolean).join(', ')} />
            <InfoRow label="Status Pernikahan" value={statusLabel[p.status_pernikahan ?? ''] ?? ''} />
            {p.jumlah_anak > 0 && (
              <InfoRow label="Jumlah Anak" value={`${p.jumlah_anak} anak`} />
            )}
          </div>

          {/* Kolom kanan: Fisik & Kesehatan */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Fisik & Kesehatan" icon="💪" />
            {f.tinggi_badan && f.berat_badan && (
              <InfoRow label="Tinggi / Berat" value={`${f.tinggi_badan} cm / ${f.berat_badan} kg`} />
            )}
            <InfoRow label="Golongan Darah" value={f.golongan_darah || null} />
            <InfoRow label="Warna Kulit" value={f.warna_kulit} />
            {f.kondisi_kesehatan && (
              <InfoRow label="Kondisi Kesehatan" value={f.kondisi_kesehatan} />
            )}
            {f.riwayat_penyakit && (
              <InfoRow label="Riwayat Penyakit" value={f.riwayat_penyakit} />
            )}
            {f.kebutuhan_khusus && (
              <InfoRow label="Kebutuhan Khusus" value={f.kebutuhan_khusus} />
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '20px 0' }} />

        {/* Keluarga */}
        {state.anggotaKeluarga.length > 0 && (
          <>
            <SectionHeading title="Latar Belakang Keluarga" icon="👨‍👩‍👧‍👦" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              {state.anggotaKeluarga.map((anggota: AnggotaKeluargaItem) => (
                <div key={anggota.id} style={{ minWidth: 160 }}>
                  <span style={{ fontSize: 9, color: C.textSoft, fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
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
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '20px 0' }} />
          </>
        )}

        {/* Sosial media yang tampil di PDF */}
        {state.sosialMedia.filter((s) => s.tampil_di_pdf).length > 1 && (
          <>
            <SectionHeading title="Sosial Media & Kontak" icon="📱" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
              {state.sosialMedia
                .filter((s) => s.tampil_di_pdf)
                .map((s) => (
                  <span key={s.id} style={{ fontSize: 10, color: C.textMid }}>
                    <strong style={{ color: C.text }}>{s.platform}</strong>: {s.username}
                  </span>
                ))}
            </div>
          </>
        )}
      </div>

      <PageFooter pageNum={1} nama={nama} />
    </Page>
  )
}

// ── PAGE 2: Pendidikan + Pekerjaan + Organisasi ───────────────
function Page2({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <Page>
      <div style={{ padding: `${PAGE_PAD}px ${PAGE_PAD}px 40px` }}>
        {/* ── Riwayat Pendidikan ─────────────────────────── */}
        {state.riwayatPendidikan.length > 0 && (
          <>
            <SectionHeading title="Riwayat Pendidikan" icon="🎓" />
            <div style={{ marginBottom: 24 }}>
              {state.riwayatPendidikan.map((item: RiwayatPendidikanItem, i: number) => (
                <TimelineItem
                  key={item.id}
                  year={item.tahun_selesai ? String(item.tahun_selesai) : item.tahun_mulai ? `${item.tahun_mulai}–` : undefined}
                  isLast={i === state.riwayatPendidikan.length - 1}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                    {item.jenjang} {item.jurusan ? `— ${item.jurusan}` : ''}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                    {item.nama_institusi}
                    {item.tahun_mulai && item.tahun_selesai
                      ? ` · ${item.tahun_mulai}–${item.tahun_selesai}`
                      : ''}
                  </p>
                  {item.prestasi && (
                    <p style={{ fontSize: 10, color: C.sage700, marginTop: 3, fontStyle: 'italic' }}>
                      🏆 {item.prestasi}
                    </p>
                  )}
                </TimelineItem>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {state.riwayatPendidikan.length > 0 && state.riwayatPekerjaan.length > 0 && (
          <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '4px 0 20px' }} />
        )}

        {/* ── Riwayat Pekerjaan ──────────────────────────── */}
        {state.riwayatPekerjaan.length > 0 && (
          <>
            <SectionHeading title="Riwayat Pekerjaan" icon="💼" />
            <div style={{ marginBottom: 24 }}>
              {state.riwayatPekerjaan.map((item: RiwayatPekerjaanItem, i: number) => (
                <TimelineItem
                  key={item.id}
                  year={item.is_masih_aktif ? 'Kini' : item.tahun_selesai ? String(item.tahun_selesai) : undefined}
                  isLast={i === state.riwayatPekerjaan.length - 1}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                    {item.posisi_jabatan}
                    {item.is_masih_aktif && (
                      <span style={{
                        marginLeft: 6, padding: '1px 6px', borderRadius: 999,
                        backgroundColor: C.sage100, color: C.sage800,
                        fontSize: 9, fontWeight: 600,
                      }}>
                        Aktif
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                    {item.nama_perusahaan}
                    {item.tahun_mulai
                      ? ` · ${item.tahun_mulai}${item.is_masih_aktif ? ' – sekarang' : item.tahun_selesai ? ` – ${item.tahun_selesai}` : ''}`
                      : ''}
                  </p>
                  {item.deskripsi_pekerjaan && (
                    <p style={{ fontSize: 10, color: C.textMid, marginTop: 4, lineHeight: 1.5 }}>
                      {item.deskripsi_pekerjaan}
                    </p>
                  )}
                </TimelineItem>
              ))}
            </div>
          </>
        )}

        {/* ── Riwayat Organisasi ─────────────────────────── */}
        {state.riwayatOrganisasi.length > 0 && (
          <>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '4px 0 20px' }} />
            <SectionHeading title="Riwayat Organisasi" icon="🤝" />
            <div>
              {state.riwayatOrganisasi.map((item: RiwayatOrganisasiItem, i: number) => (
                <TimelineItem
                  key={item.id}
                  year={item.tahun_selesai ? String(item.tahun_selesai) : undefined}
                  isLast={i === state.riwayatOrganisasi.length - 1}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                    {item.jabatan || item.nama_organisasi}
                  </p>
                  <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                    {item.nama_organisasi}
                    {item.tahun_mulai && ` · ${item.tahun_mulai}${item.tahun_selesai ? `–${item.tahun_selesai}` : ''}`}
                  </p>
                  {item.deskripsi && (
                    <p style={{ fontSize: 10, color: C.textMid, marginTop: 3 }}>{item.deskripsi}</p>
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

// ── PAGE 3: Perjalanan Hidup ──────────────────────────────────
function Page3({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  const faseColor: Record<string, string> = {
    masa_kecil:  '#3B82F6',
    remaja:      '#8B5CF6',
    dewasa_awal: C.sage600,
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
      <div style={{ padding: `${PAGE_PAD}px ${PAGE_PAD}px 40px` }}>
        {/* Ayat pembuka halaman 3 */}
        <div
          style={{
            backgroundColor: C.sage50,
            border: `1px solid ${C.sage100}`,
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 14, color: C.gold600, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
            وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
          </p>
          <p style={{ fontSize: 9, color: C.textSoft, marginTop: 4, fontStyle: 'italic' }}>
            &ldquo;Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu&rdquo; — QS Al-Baqarah: 216
          </p>
        </div>

        <SectionHeading title="Perjalanan Hidup" icon="🛤️" />

        <div>
          {state.perjalananHidup.map((item: PerjalananHidupItem, i: number) => {
            const color = faseColor[item.fase] ?? C.sage600
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
                    <div style={{ width: 2, flex: 1, backgroundColor: '#F1F5F9', marginTop: 4 }} />
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
                      backgroundColor: C.gold100,
                      border: `1px solid #FDE68A`,
                      borderRadius: 6, padding: '5px 10px',
                    }}>
                      <span style={{ fontSize: 9, color: C.gold600, fontWeight: 700, display: 'block', marginBottom: 2 }}>
                        💡 Hikmah & Pelajaran
                      </span>
                      <p style={{ fontSize: 10, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
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

// ── PAGE 4: Karakter + Ibadah + Gaya Hidup ───────────────────
function Page4({ state }: { state: FormState }) {
  const nama   = state.dataPribadi.nama_lengkap || 'Nama'
  const k      = state.karakter
  const ibadah = state.ibadah
  const gl     = state.gayaHidup

  const shalatLabel: Record<string, string> = {
    selalu_berjamaah: 'Alhamdulillah, selalu berjamaah',
    sering_berjamaah: 'Sering berjamaah',
    sering_sendiri:   'Sering, tapi sendiri',
    kadang:           'Kadang-kadang',
    masih_berjuang:   'Masih berjuang 🤲',
  }

  const tipeLabel: Record<string, string> = {
    introvert:  '🤫 Introvert',
    ekstrovert: '🗣️ Ekstrovert',
    ambivert:   '⚖️ Ambivert',
  }

  return (
    <Page>
      <div style={{ padding: `${PAGE_PAD}px ${PAGE_PAD}px 40px` }}>

        {/* ── Karakter & Kepribadian ────────────────────── */}
        <SectionHeading title="Karakter & Kepribadian" icon="✨" />

        {k.karakter_diri && (
          <p style={{ fontSize: 11, color: C.textMid, lineHeight: 1.6, marginBottom: 14 }}>
            {k.karakter_diri}
          </p>
        )}

        <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
          {/* Kelebihan */}
          {k.kelebihan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kelebihan
              </p>
              <div>{k.kelebihan.map((tag) => <Tag key={tag} text={tag} color="sage" />)}</div>
            </div>
          )}

          {/* Kekurangan */}
          {k.kekurangan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kekurangan
              </p>
              <div>{k.kekurangan.map((tag) => <Tag key={tag} text={tag} color="navy" />)}</div>
            </div>
          )}
        </div>

        {/* Hobi + MBTI */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 6 }}>
          {k.hobi.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Hobi & Minat
              </p>
              <div>{k.hobi.map((tag) => <Tag key={tag} text={tag} color="gold" />)}</div>
            </div>
          )}
          <div style={{ width: 160, flexShrink: 0 }}>
            {k.mbti_type && <InfoRow label="Tipe MBTI" value={k.mbti_type} />}
            {k.bahasa_cinta && <InfoRow label="Bahasa Cinta" value={k.bahasa_cinta.replace(/_/g, ' ')} />}
            {gl.tipe_kepribadian && <InfoRow label="Tipe Kepribadian" value={tipeLabel[gl.tipe_kepribadian] ?? ''} />}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '16px 0' }} />

        {/* ── Ibadah & Keislaman ────────────────────────── */}
        <SectionHeading title="Ibadah & Keislaman" icon="🕌" />

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
            backgroundColor: C.sage50,
            border: `1px solid ${C.sage100}`,
            borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 10, color: C.sage900, lineHeight: 1.6, margin: 0 }}>
              {ibadah.deskripsi_ibadah}
            </p>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '4px 0 16px' }} />

        {/* ── Gaya Hidup ────────────────────────────────── */}
        <SectionHeading title="Gaya Hidup" icon="🌱" />

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

// ── PAGE 5: Visi Misi + Kriteria + Financial + Pandangan ──────
function Page5({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'
  const vm   = state.visiMisi
  const kr   = state.kriteria
  const fp   = state.financialPlanning
  const pi   = state.pandanganIsu

  return (
    <Page isLast>
      <div style={{ padding: `${PAGE_PAD}px ${PAGE_PAD}px 40px` }}>

        {/* ── Visi & Misi Pernikahan ─────────────────────── */}
        {(vm.visi || vm.misi_suami || vm.misi_istri) && (
          <>
            <SectionHeading title="Visi & Misi Pernikahan" icon="🌟" />

            {vm.visi && (
              <div style={{
                backgroundColor: C.sage900,
                borderRadius: 8, padding: '10px 14px', marginBottom: 12,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>
                  VISI
                </p>
                <p style={{ fontSize: 11, color: C.white, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                      &lsquo;{vm.visi}&rsquo;
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              {vm.misi_suami && (
                <div style={{ flex: 1, backgroundColor: C.navy100, borderRadius: 6, padding: '8px 10px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.navy700, textTransform: 'uppercase', marginBottom: 3 }}>Peran Suami</p>
                  <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_suami}</p>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ flex: 1, backgroundColor: C.gold100, borderRadius: 6, padding: '8px 10px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.gold600, textTransform: 'uppercase', marginBottom: 3 }}>Peran Istri</p>
                  <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_istri}</p>
                </div>
              )}
            </div>

            {vm.tujuan_pernikahan.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: C.textSoft, textTransform: 'uppercase', marginBottom: 4 }}>
                  Tujuan Pernikahan
                </p>
                <div>{vm.tujuan_pernikahan.map((t) => <Tag key={t} text={t} color="sage" />)}</div>
              </div>
            )}

            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '14px 0' }} />
          </>
        )}

        {/* ── Kriteria Pasangan + Financial (2 kolom) ─────── */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>

          {/* Kriteria */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Kriteria Pasangan" icon="💍" />
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
              <InfoRow
                label="Bersedia Poligami"
                value={kr.bersedia_poligami ? 'Ya' : 'Tidak'}
              />
            )}
            {kr.bersedia_pindah_domisili !== null && (
              <InfoRow
                label="Bersedia Pindah"
                value={kr.bersedia_pindah_domisili ? 'Ya' : 'Tidak'}
              />
            )}
            {kr.kriteria_lainnya && (
              <InfoRow label="Lainnya" value={kr.kriteria_lainnya} />
            )}
          </div>

          {/* Financial Planning */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Financial Planning" icon="💰" />

            {fp.penghasilan_range && (
              <div style={{
                backgroundColor: C.sage50, border: `1px solid ${C.sage100}`,
                borderRadius: 6, padding: '6px 10px', marginBottom: 12,
              }}>
                <span style={{ fontSize: 9, color: C.textSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Rentang Penghasilan
                </span>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.sage900, margin: '2px 0 0' }}>
                  {fp.penghasilan_range}
                </p>
              </div>
            )}

            <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Alokasi Keuangan
            </p>

            <FinancialBar label="Kebutuhan Pokok" persen={fp.kebutuhan_pokok_persen} color={C.sage600} />
            <FinancialBar label="Tabungan"        persen={fp.tabungan_persen}         color="#3B82F6" />
            <FinancialBar label="Investasi"       persen={fp.investasi_persen}        color="#8B5CF6" />
            <FinancialBar label="Sedekah / Zakat" persen={fp.sedekah_persen}          color={C.gold600} />
            <FinancialBar label="Lainnya"         persen={fp.lainnya_persen}          color={C.navy500} />

            {fp.deskripsi && (
              <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.5, marginTop: 8, fontStyle: 'italic' }}>
                {fp.deskripsi}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        {pi.pandangan_isu && (
          <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '4px 0 16px' }} />
        )}

        {/* ── Pandangan Isu (ringkasan) ─────────────────── */}
        {pi.pandangan_isu && (
          <>
            <SectionHeading title="Pandangan tentang Pernikahan" icon="💬" />
            <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.6 }}>
              {pi.pandangan_isu}
            </p>
          </>
        )}

        {/* ── Penutup ───────────────────────────────────── */}
        <div style={{
          marginTop: 24,
          backgroundColor: C.sage900,
          borderRadius: 8,
          padding: '14px 20px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 16, color: C.gold500, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontStyle: 'italic' }}>
            &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami istri-istri dan keturunan kami
            sebagai penyenang hati kami&rdquo; — QS Al-Furqan: 74
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 10, letterSpacing: '0.05em' }}>
            CV INI DIBUAT DENGAN TAARUFCV · DOKUMEN BERSIFAT RAHASIA
          </p>
        </div>
      </div>

      <PageFooter pageNum={5} nama={nama} />
    </Page>
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
    state.karakter.karakter_diri.length > 0 ||
    state.karakter.kelebihan.length > 0 ||
    state.ibadah.mazhab.length > 0 ||
    state.ibadah.shalat_fardhu.length > 0 ||
    state.gayaHidup.gaya_hidup.length > 0

  const showPage5 =
    state.visiMisi.visi.length > 0 ||
    state.kriteria.kriteria_karakter.length > 0 ||
    state.financialPlanning.kebutuhan_pokok_persen > 0 ||
    state.pandanganIsu.pandangan_isu.length > 0

  return (
    <div
      id="taaruf-template"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        width: 794,
        // Background abu-abu antar halaman (hanya terlihat di preview)
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