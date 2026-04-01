// ============================================================
// Template 2 — Elegant Islamic
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
import type { FormState } from '@/types'

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
}

const PAGE_W = 794
const PAGE_H = 1123
const PAD = 44

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
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
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

// ── PAGE 1 ───────────────────────────────────────────────────
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const nama = p.nama_lengkap || 'Nama Lengkap'

  const statusLabel: Record<string, string> = {
    lajang: 'Lajang / Belum Pernah Menikah',
    duda: 'Duda', janda: 'Janda',
    cerai_mati: 'Cerai Mati', cerai_hidup: 'Cerai Hidup',
  }

  const usia = p.tanggal_lahir
    ? Math.floor((Date.now() - new Date(p.tanggal_lahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

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
            <p style={{ fontSize: 11, lineHeight: 1.7, color: C.textMid, margin: '0 0 16px', textAlign: 'justify' }}>
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
            <InfoRow label="Shalat Fardhu" value={
              { '': '', selalu_berjamaah: 'Selalu berjamaah', sering_berjamaah: 'Sering berjamaah', sering_sendiri: 'Sering sendiri', kadang: 'Kadang-kadang', masih_berjuang: 'Masih berjuang' }[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu
            } />
            <InfoRow label="Hafalan Qur'an" value={state.ibadah.hafalan_quran} />
            <InfoRow label="Cara Berpakaian" value={state.ibadah.cara_berpakaian} />
          </div>
        </div>

        {/* Karakter tags */}
        {(state.karakter.kelebihan.length > 0 || state.karakter.hobi.length > 0) && (
          <>
            <Divider />
            <div style={{ display: 'flex', gap: 20 }}>
              {state.karakter.kelebihan.length > 0 && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Kelebihan</p>
                  <div>{state.karakter.kelebihan.map((t) => (
                    <span key={t} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, backgroundColor: C.green100, border: `1px solid ${C.green600}30`, fontSize: 10, color: C.green900, fontWeight: 500, margin: '0 4px 4px 0' }}>{t}</span>
                  ))}</div>
                </div>
              )}
              {state.karakter.hobi.length > 0 && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Hobi</p>
                  <div>{state.karakter.hobi.map((t) => (
                    <span key={t} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, backgroundColor: C.gold100, border: `1px solid ${C.gold600}30`, fontSize: 10, color: C.gold700, fontWeight: 500, margin: '0 4px 4px 0' }}>{t}</span>
                  ))}</div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
      <PageFooter pageNum={1} nama={nama} />
    </Page>
  )
}

// ── PAGE 2 ───────────────────────────────────────────────────
function Page2({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <Page isLast>
      <div style={{ padding: `${PAD}px ${PAD}px 36px` }}>

        {/* Pendidikan */}
        {state.riwayatPendidikan.length > 0 && (
          <>
            <SectionTitle title="Pendidikan" />
            <div style={{ marginBottom: 20 }}>
              {state.riwayatPendidikan.map((edu, i) => (
                <div key={edu.id} style={{
                  display: 'flex', gap: 12, paddingBottom: i === state.riwayatPendidikan.length - 1 ? 0 : 12,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 50, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>{edu.tahun_selesai}</span>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.green700, marginTop: 2 }} />
                    {i < state.riwayatPendidikan.length - 1 && (
                      <div style={{ width: 1, flex: 1, backgroundColor: C.green100, marginTop: 3 }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                      {edu.jenjang}{edu.jurusan ? ` — ${edu.jurusan}` : ''}
                    </p>
                    <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                      {edu.nama_institusi} · {edu.tahun_mulai}–{edu.tahun_selesai}
                    </p>
                    {edu.prestasi && (
                      <p style={{ fontSize: 10, color: C.green800, marginTop: 3, fontStyle: 'italic' }}>🏆 {edu.prestasi}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pekerjaan */}
        {state.riwayatPekerjaan.length > 0 && (
          <>
            <SectionTitle title="Pekerjaan" />
            <div style={{ marginBottom: 20 }}>
              {state.riwayatPekerjaan.map((job, i) => (
                <div key={job.id} style={{
                  display: 'flex', gap: 12, paddingBottom: i === state.riwayatPekerjaan.length - 1 ? 0 : 12,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 50, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>
                      {job.is_masih_aktif ? 'Kini' : job.tahun_selesai}
                    </span>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.gold600, marginTop: 2 }} />
                    {i < state.riwayatPekerjaan.length - 1 && (
                      <div style={{ width: 1, flex: 1, backgroundColor: C.gold100, marginTop: 3 }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                      {job.posisi_jabatan}
                      {job.is_masih_aktif && (
                        <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 999, backgroundColor: C.green100, color: C.green900, fontSize: 9, fontWeight: 600 }}>Aktif</span>
                      )}
                    </p>
                    <p style={{ fontSize: 10, color: C.textMid, margin: '2px 0 0' }}>
                      {job.nama_perusahaan} · {job.tahun_mulai}–{job.is_masih_aktif ? 'sekarang' : job.tahun_selesai}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Visi Pernikahan */}
        {state.visiMisi.visi && (
          <>
            <Divider />
            <SectionTitle title="Visi Pernikahan" />
            <div style={{
              backgroundColor: C.green900, borderRadius: 8, padding: '12px 16px', marginBottom: 12,
            }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>VISI</p>
              <p style={{ fontSize: 11, color: C.white, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                &lsquo;{state.visiMisi.visi}&rsquo;
              </p>
            </div>
            {(state.visiMisi.misi_suami || state.visiMisi.misi_istri) && (
              <div style={{ display: 'flex', gap: 10 }}>
                {state.visiMisi.misi_suami && (
                  <div style={{ flex: 1, backgroundColor: C.gold50, border: `1px solid ${C.gold600}30`, borderRadius: 6, padding: '8px 10px' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: C.gold700, textTransform: 'uppercase', marginBottom: 3 }}>Peran Suami</p>
                    <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{state.visiMisi.misi_suami}</p>
                  </div>
                )}
                {state.visiMisi.misi_istri && (
                  <div style={{ flex: 1, backgroundColor: C.green50, border: `1px solid ${C.green600}30`, borderRadius: 6, padding: '8px 10px' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: C.green800, textTransform: 'uppercase', marginBottom: 3 }}>Peran Istri</p>
                    <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{state.visiMisi.misi_istri}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Penutup doa */}
        <div style={{
          marginTop: 28, backgroundColor: C.green900, borderRadius: 8,
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
      <PageFooter pageNum={2} nama={nama} />
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
    </div>
  )
}