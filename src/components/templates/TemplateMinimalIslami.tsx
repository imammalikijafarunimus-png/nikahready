// ============================================================
// Template Minimal Islami — FREE template
// Gaya: 1 halaman padat, ornamental Islamic, cream + gold
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Page div: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style (BUKAN CSS var / Tailwind)
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, box-shadow spread
// ✓ Flexbox / explicit grid
// ✓ Font: Inter (body) dan Amiri (Arabic)
// ✓ Root div MUST have id="taaruf-template"
// ✓ All images: crossOrigin="anonymous"
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
  gold300:  '#F0D98A',
  gold100:  '#F5EDD6',
  gold50:   '#FEFBF0',
  text:     '#1A1A2E',
  textMid:  '#4A4A5A',
  textSoft: '#7A7A8A',
  textMuted:'#AAAABC',
  white:    '#FFFFFF',
}

const PAGE_W = 794
const PAGE_H = 1123
const PAD = 48

// ── Corner ornament (ornamental Islamic frame) ───────────────
function CornerOrnament({ top, right, bottom, left }: {
  top?: boolean; right?: boolean; bottom?: boolean; left?: boolean
}) {
  const s = 40
  return (
    <div style={{
      position: 'absolute',
      top: top ? 10 : undefined,
      bottom: bottom ? 10 : undefined,
      left: left ? 10 : undefined,
      right: right ? 10 : undefined,
      width: s,
      height: s,
      borderTop: top ? `2px solid ${C.gold600}40` : 'none',
      borderBottom: bottom ? `2px solid ${C.gold600}40` : 'none',
      borderLeft: left ? `2px solid ${C.gold600}40` : 'none',
      borderRight: right ? `2px solid ${C.gold600}40` : 'none',
      pointerEvents: 'none',
    }}>
      {/* Inner L-shape accent */}
      {top && left && (
        <div style={{
          position: 'absolute', top: 4, left: 4,
          width: 14, height: 14,
          borderTop: `1.5px solid ${C.gold600}80`,
          borderLeft: `1.5px solid ${C.gold600}80`,
        }} />
      )}
      {top && right && (
        <div style={{
          position: 'absolute', top: 4, right: 4,
          width: 14, height: 14,
          borderTop: `1.5px solid ${C.gold600}80`,
          borderRight: `1.5px solid ${C.gold600}80`,
        }} />
      )}
      {bottom && left && (
        <div style={{
          position: 'absolute', bottom: 4, left: 4,
          width: 14, height: 14,
          borderBottom: `1.5px solid ${C.gold600}80`,
          borderLeft: `1.5px solid ${C.gold600}80`,
        }} />
      )}
      {bottom && right && (
        <div style={{
          position: 'absolute', bottom: 4, right: 4,
          width: 14, height: 14,
          borderBottom: `1.5px solid ${C.gold600}80`,
          borderRight: `1.5px solid ${C.gold600}80`,
        }} />
      )}
    </div>
  )
}

// ── Ornamental divider ───────────────────────────────────────
function OrnDivider({ margin = '10px 0' }: { margin?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin }}>
      <div style={{ flex: 1, maxWidth: 120, height: 1, backgroundColor: C.gold600, opacity: 0.25 }} />
      <span style={{ fontSize: 8, color: C.gold600, opacity: 0.6 }}>◆</span>
      <span style={{ fontSize: 6, color: C.gold600, opacity: 0.45 }}>✦</span>
      <span style={{ fontSize: 8, color: C.gold600, opacity: 0.6 }}>◆</span>
      <div style={{ flex: 1, maxWidth: 120, height: 1, backgroundColor: C.gold600, opacity: 0.25 }} />
    </div>
  )
}

// ── Small section heading ────────────────────────────────────
function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: C.gold600, fontSize: 6 }}>◆</span>
        <h2 style={{
          fontSize: 10, fontWeight: 700, color: C.green900,
          letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0,
        }}>
          {title}
        </h2>
        <div style={{
          flex: 1, height: 1,
          background: `linear-gradient(90deg, ${C.gold600}25, transparent)`,
        }} />
      </div>
    </div>
  )
}

// ── Compact info row ─────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div style={{ marginBottom: 3 }}>
      <span style={{ fontSize: 8, color: C.textMuted, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
      <span style={{ fontSize: 10, color: C.text, fontWeight: 500, display: 'block', marginTop: 1 }}>
        {value}
      </span>
    </div>
  )
}

// ── Main Export ──────────────────────────────────────────────
export function TemplateMinimalIslami({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const nama = p.nama_lengkap || 'Nama Lengkap'

  const statusLabel: Record<string, string> = {
    lajang: 'Lajang / Belum Pernah Menikah',
    duda: 'Duda', janda: 'Janda',
    cerai_mati: 'Cerai Mati', cerai_hidup: 'Cerai Hidup',
  }

  const shalatLabel: Record<string, string> = {
    '': '',
    selalu_berjamaah: 'Selalu berjamaah',
    sering_berjamaah: 'Sering berjamaah',
    sering_sendiri: 'Sering sendiri',
    kadang: 'Kadang-kadang',
    masih_berjuang: 'Masih berjuang',
  }

  const usia = p.tanggal_lahir
    ? Math.floor((Date.now() - new Date(p.tanggal_lahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const ttl = p.tempat_lahir && p.tanggal_lahir
    ? `${p.tempat_lahir}, ${new Date(p.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : undefined

  const tinggiBerat =
    state.fisikKesehatan.tinggi_badan && state.fisikKesehatan.berat_badan
      ? `${state.fisikKesehatan.tinggi_badan} cm / ${state.fisikKesehatan.berat_badan} kg`
      : undefined

  // Last 2 pendidikan only
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
      <div
        style={{
          width: PAGE_W,
          minHeight: PAGE_H,
          backgroundColor: C.bg,
          position: 'relative',
          overflow: 'hidden',
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

        <div style={{ padding: `28px ${PAD}px 20px` }}>

          {/* ─── 1. BISMILLAH ─── */}
          <div style={{ textAlign: 'center', marginBottom: 2 }}>
            <p style={{
              fontFamily: "'Amiri', Georgia, serif", fontSize: 26,
              color: C.green900, direction: 'rtl', margin: 0, lineHeight: 1.8,
            }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
          <OrnDivider margin="4px 0 10px" />

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
                  border: `2.5px solid ${C.gold600}`, flexShrink: 0,
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{
                width: 80, height: 100, borderRadius: 8,
                backgroundColor: C.gold100, border: `2px dashed ${C.gold600}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, flexShrink: 0,
              }}>
                <span style={{ fontSize: 20 }}>👤</span>
                <span style={{ fontSize: 7, color: C.textMuted }}>Foto</span>
              </div>
            )}

            {/* Name & chips */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: C.green900, margin: 0, lineHeight: 1.2 }}>
                {nama}
              </h1>
              {p.nama_panggilan && (
                <p style={{ fontSize: 10, color: C.textSoft, marginTop: 1, fontStyle: 'italic' }}>
                  &lsquo;{p.nama_panggilan}&rsquo;
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
                {usia && (
                  <span style={{ padding: '2px 8px', borderRadius: 999, backgroundColor: C.green100, fontSize: 9, color: C.green900, fontWeight: 500 }}>
                    {usia} tahun
                  </span>
                )}
                {p.domisili_kota && (
                  <span style={{ padding: '2px 8px', borderRadius: 999, backgroundColor: C.green100, fontSize: 9, color: C.green900, fontWeight: 500 }}>
                    📍 {p.domisili_kota}
                  </span>
                )}
                {p.suku_bangsa && (
                  <span style={{ padding: '2px 8px', borderRadius: 999, backgroundColor: C.green100, fontSize: 9, color: C.green900, fontWeight: 500 }}>
                    {p.suku_bangsa}
                  </span>
                )}
                {p.status_pernikahan && (
                  <span style={{ padding: '2px 8px', borderRadius: 999, backgroundColor: C.gold600, fontSize: 9, color: C.white, fontWeight: 600 }}>
                    {statusLabel[p.status_pernikahan] ?? p.status_pernikahan}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ─── Karakter diri (about me) ─── */}
          {state.karakter.karakter_diri && (
            <p style={{
              fontSize: 10, lineHeight: 1.6, color: C.textMid,
              margin: '0 0 8px', textAlign: 'center', fontStyle: 'italic',
              maxWidth: 580, marginLeft: 'auto', marginRight: 'auto',
            }}>
              &ldquo;{state.karakter.karakter_diri}&rdquo;
            </p>
          )}

          <OrnDivider margin="6px 0 10px" />

          {/* ─── 3. TWO-COLUMN BODY ─── */}
          <div style={{ display: 'flex', gap: 20 }}>

            {/* LEFT COLUMN: Data Pribadi + Ibadah */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <SectionTitle title="Data Pribadi" />
              <InfoRow label="Tempat, Tanggal Lahir" value={ttl} />
              <InfoRow label="Domisili" value={
                p.domisili_kota && p.domisili_provinsi
                  ? `${p.domisili_kota}, ${p.domisili_provinsi}`
                  : p.domisili_kota || p.domisili_provinsi || undefined
              } />
              <InfoRow label="Tinggi / Berat" value={tinggiBerat} />
              <InfoRow label="Gol. Darah" value={state.fisikKesehatan.golongan_darah} />
              <InfoRow label="Kondisi Kesehatan" value={state.fisikKesehatan.kondisi_kesehatan} />

              <div style={{ marginTop: 10 }}>
                <SectionTitle title="Ibadah & Keislaman" />
                <InfoRow label="Mazhab" value={state.ibadah.mazhab} />
                <InfoRow label="Shalat Fardhu" value={shalatLabel[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu} />
                <InfoRow label="Shalat Sunnah" value={state.ibadah.shalat_sunnah} />
                <InfoRow label="Hafalan Qur'an" value={state.ibadah.hafalan_quran} />
                <InfoRow label="Tilawah Rutin" value={state.ibadah.tilawah_rutin ? 'Ya' : undefined} />
                <InfoRow label="Kajian Rutin" value={state.ibadah.kajian_rutin ? 'Ya' : undefined} />
              </div>

              {/* Gaya Hidup compact */}
              {(state.gayaHidup.gaya_hidup || state.gayaHidup.tipe_kepribadian) && (
                <div style={{ marginTop: 10 }}>
                  <SectionTitle title="Gaya Hidup" />
                  <InfoRow label="Gaya Hidup" value={state.gayaHidup.gaya_hidup} />
                  <InfoRow label="Tipe Kepribadian" value={
                    ({ introvert: 'Introvert', ekstrovert: 'Ekstrovert', ambivert: 'Ambivert', '': '' } as Record<string, string>)[state.gayaHidup.tipe_kepribadian]
                    || state.gayaHidup.tipe_kepribadian || undefined
                  } />
                  <InfoRow label="Kebiasaan Positif" value={state.gayaHidup.kebiasaan_positif} />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Pendidikan + Karakter + Kriteria */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Pendidikan (last 2) */}
              {eduLast2.length > 0 && (
                <>
                  <SectionTitle title="Pendidikan" />
                  <div style={{ marginBottom: 10 }}>
                    {eduLast2.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${C.green600}40` }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: C.text, margin: 0 }}>
                          {edu.jenjang}{edu.jurusan ? ` — ${edu.jurusan}` : ''}
                        </p>
                        <p style={{ fontSize: 9, color: C.textMid, margin: '1px 0 0' }}>
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
                  <SectionTitle title="Pekerjaan" />
                  <div style={{ marginBottom: 10 }}>
                    {(() => {
                      const lastJob = state.riwayatPekerjaan[0]
                      return (
                        <div style={{ paddingLeft: 10, borderLeft: `2px solid ${C.gold600}40` }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: C.text, margin: 0 }}>
                            {lastJob.posisi_jabatan}
                            {lastJob.is_masih_aktif && (
                              <span style={{ marginLeft: 5, padding: '1px 5px', borderRadius: 999, backgroundColor: C.green100, color: C.green900, fontSize: 8, fontWeight: 600 }}>Aktif</span>
                            )}
                          </p>
                          <p style={{ fontSize: 9, color: C.textMid, margin: '1px 0 0' }}>
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
                  <SectionTitle title="Karakter" />
                  {state.karakter.mbti_type && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: C.green900, color: C.white, fontSize: 9, fontWeight: 700 }}>
                        {state.karakter.mbti_type}
                      </span>
                    </div>
                  )}
                  {state.karakter.kelebihan.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', marginRight: 4 }}>Kelebihan</span>
                      {state.karakter.kelebihan.map((t) => (
                        <span key={t} style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: 999,
                          backgroundColor: C.green100, border: `1px solid ${C.green600}25`,
                          fontSize: 9, color: C.green900, fontWeight: 500, margin: '0 2px 3px 0',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {state.karakter.kekurangan.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', marginRight: 4 }}>Kekurangan</span>
                      {state.karakter.kekurangan.map((t) => (
                        <span key={t} style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: 999,
                          backgroundColor: C.gold100, border: `1px solid ${C.gold600}25`,
                          fontSize: 9, color: C.gold700, fontWeight: 500, margin: '0 2px 3px 0',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {state.karakter.hobi.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', marginRight: 4 }}>Hobi</span>
                      {state.karakter.hobi.map((t) => (
                        <span key={t} style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: 999,
                          backgroundColor: C.gold50, border: `1px solid ${C.gold600}20`,
                          fontSize: 9, color: C.gold700, fontWeight: 500, margin: '0 2px 3px 0',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Kriteria Pasangan (compact) */}
              {(state.kriteria.kriteria_usia_min || state.kriteria.kriteria_usia_max || state.kriteria.kriteria_karakter || state.kriteria.kriteria_ibadah || state.kriteria.kriteria_pendidikan || state.kriteria.kriteria_domisili) && (
                <>
                  <div style={{ marginTop: 10 }}>
                    <SectionTitle title="Kriteria Pasangan" />
                    <InfoRow
                      label="Usia"
                      value={
                        state.kriteria.kriteria_usia_min || state.kriteria.kriteria_usia_max
                          ? `${state.kriteria.kriteria_usia_min || '?'} – ${state.kriteria.kriteria_usia_max || '?'} tahun`
                          : undefined
                      }
                    />
                    <InfoRow label="Domisili" value={state.kriteria.kriteria_domisili} />
                    <InfoRow label="Pendidikan" value={state.kriteria.kriteria_pendidikan} />
                    <InfoRow label="Karakter" value={state.kriteria.kriteria_karakter} />
                    <InfoRow label="Ibadah" value={state.kriteria.kriteria_ibadah} />
                    <InfoRow label="Lainnya" value={state.kriteria.kriteria_lainnya} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ─── 4. BOTTOM: VISI + DOA ─── */}
          <OrnDivider margin="12px 0 10px" />

          {/* Visi card with gold border */}
          {state.visiMisi.visi && (
            <div style={{
              border: `2px solid ${C.gold600}60`,
              borderRadius: 8,
              padding: '10px 16px',
              marginBottom: 10,
              backgroundColor: C.gold50,
            }}>
              <p style={{ fontSize: 8, fontWeight: 700, color: C.gold700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                ◆ Visi Pernikahan
              </p>
              <p style={{ fontSize: 11, color: C.green900, lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
                &ldquo;{state.visiMisi.visi}&rdquo;
              </p>
              {(state.visiMisi.misi_suami || state.visiMisi.misi_istri) && (
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {state.visiMisi.misi_suami && (
                    <div style={{ flex: 1, padding: '6px 10px', backgroundColor: C.white, borderRadius: 4, border: `1px solid ${C.green600}20` }}>
                      <p style={{ fontSize: 8, fontWeight: 700, color: C.green800, textTransform: 'uppercase', marginBottom: 2 }}>Peran Suami</p>
                      <p style={{ fontSize: 9, color: C.text, lineHeight: 1.4, margin: 0 }}>{state.visiMisi.misi_suami}</p>
                    </div>
                  )}
                  {state.visiMisi.misi_istri && (
                    <div style={{ flex: 1, padding: '6px 10px', backgroundColor: C.white, borderRadius: 4, border: `1px solid ${C.gold600}20` }}>
                      <p style={{ fontSize: 8, fontWeight: 700, color: C.gold700, textTransform: 'uppercase', marginBottom: 2 }}>Peran Istri</p>
                      <p style={{ fontSize: 9, color: C.text, lineHeight: 1.4, margin: 0 }}>{state.visiMisi.misi_istri}</p>
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
                  backgroundColor: C.white, border: `1px solid ${C.gold600}30`,
                  fontSize: 9, color: C.textMid, fontWeight: 500,
                }}>
                  {s.platform}: {s.username}
                </span>
              ))}
            </div>
          )}

          {/* ─── Closing doa (QS Al-Furqan:74) ─── */}
          <div style={{
            backgroundColor: C.green900,
            borderRadius: 8,
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Amiri', Georgia, serif",
              fontSize: 15,
              color: C.gold400,
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.8,
            }}>
              رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
            </p>
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 5, fontStyle: 'italic' }}>
              &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami istri-istri dan keturunan kami sebagai penyenang hati&rdquo; — QS Al-Furqan: 74
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, marginTop: 8,
            }}>
              <div style={{ width: 40, height: 1, backgroundColor: C.gold600, opacity: 0.25 }} />
              <span style={{ fontSize: 6, color: C.gold600, opacity: 0.5 }}>✦</span>
              <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
                TAARUFCV · DOKUMEN RAHASIA
              </span>
              <span style={{ fontSize: 6, color: C.gold600, opacity: 0.5 }}>✦</span>
              <div style={{ width: 40, height: 1, backgroundColor: C.gold600, opacity: 0.25 }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}