// ============================================================
// Template 3 — Modern Premium
// Gaya: sidebar gelap, accent indigo, personal branding
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style
// ✓ Tidak ada: position fixed/sticky, backdrop-filter
// ✓ Flexbox / explicit sizing
// ============================================================

import React from 'react'
import type { FormState } from '@/types'

// ── Design Tokens ────────────────────────────────────────────
const C = {
  dark:      '#0F172A',
  darkSoft:  '#1E293B',
  darkMid:   '#334155',
  accent:    '#6366F1',
  accentSoft:'#EEF2FF',
  accentMid: '#818CF8',
  text:      '#1E293B',
  textMid:   '#475569',
  textSoft:  '#64748B',
  textMuted: '#94A3B8',
  white:     '#FFFFFF',
  gray50:    '#F8FAFC',
  gray100:   '#F1F5F9',
  gray200:   '#E2E8F0',
  gold:      '#D97706',
  goldSoft:  '#FEF3C7',
}

const PAGE_W = 794
const PAGE_H = 1123

// ── Page wrapper ─────────────────────────────────────────────
function Page({ children, isLast = false }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: C.white,
        display: 'flex',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: C.text,
        overflow: 'hidden',
        pageBreakAfter: isLast ? 'auto' : 'always',
      }}
    >
      {children}
    </div>
  )
}

// ── Sidebar section ──────────────────────────────────────────
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: C.textMuted,
        marginBottom: 8, paddingBottom: 4,
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

// ── Sidebar row ──────────────────────────────────────────────
function SidebarRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div style={{ marginBottom: 5 }}>
      <span style={{ fontSize: 9, color: C.textMuted, display: 'block' }}>{label}</span>
      <span style={{ fontSize: 11, color: C.white, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────
function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontSize: 13, fontWeight: 700, color: C.text,
        margin: '0 0 10px', paddingBottom: 4,
        borderBottom: `2px solid ${C.accent}25`,
        display: 'inline-block',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ── Timeline item ────────────────────────────────────────────
function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10, paddingLeft: 14, borderLeft: `2px solid ${C.gray200}` }}>
      {children}
    </div>
  )
}

// ── Badge ────────────────────────────────────────────────────
function Badge({ text }: { text: string }) {
  return (
    <span style={{
      fontSize: 9, padding: '3px 8px', borderRadius: 999,
      backgroundColor: `${C.accent}18`, color: C.accent,
      fontWeight: 500, margin: '0 4px 4px 0', display: 'inline-block',
    }}>
      {text}
    </span>
  )
}

// ── PAGE 1 ───────────────────────────────────────────────────
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const usia = p.tanggal_lahir
    ? Math.floor((Date.now() - new Date(p.tanggal_lahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const statusLabel: Record<string, string> = {
    lajang: 'Lajang', duda: 'Duda', janda: 'Janda',
    cerai_mati: 'Cerai Mati', cerai_hidup: 'Cerai Hidup',
  }

  return (
    <Page>
      {/* ===== SIDEBAR ===== */}
      <div style={{
        width: '30%', backgroundColor: C.dark, color: C.white,
        padding: 32, boxSizing: 'border-box', flexShrink: 0,
      }}>
        {/* Foto */}
        {state.fotoTemplate.foto_pribadi_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={state.fotoTemplate.foto_pribadi_url} alt="" style={{
            width: '100%', height: 155, objectFit: 'cover', borderRadius: 10, marginBottom: 16,
          }} crossOrigin="anonymous" />
        ) : (
          <div style={{
            width: '100%', height: 155, borderRadius: 10,
            backgroundColor: C.darkSoft, border: `1px dashed ${C.textMuted}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 4, marginBottom: 16,
          }}>
            <span style={{ fontSize: 22 }}>👤</span>
            <span style={{ fontSize: 9, color: C.textMuted }}>Foto</span>
          </div>
        )}

        {/* Nama */}
        <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.02em' }}>
          {p.nama_lengkap || 'Nama'}
        </h2>
        {p.nama_panggilan && (
          <p style={{ fontSize: 10, color: C.textMuted, margin: '0 0 4px', fontStyle: 'italic' }}>
            &lsquo;{p.nama_panggilan}&rsquo;
          </p>
        )}
        <p style={{ fontSize: 10, color: C.textMuted, margin: '0 0 20px' }}>
          {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
        </p>

        {/* Info Cepat */}
        <SidebarSection title="Info Cepat">
          <SidebarRow label="Usia" value={usia ? `${usia} tahun` : undefined} />
          <SidebarRow label="Status" value={statusLabel[p.status_pernikahan] ?? undefined} />
          <SidebarRow label="TTL" value={
            p.tempat_lahir && p.tanggal_lahir
              ? `${p.tempat_lahir}, ${new Date(p.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : undefined
          } />
          <SidebarRow label="Tinggi" value={
            state.fisikKesehatan.tinggi_badan ? `${state.fisikKesehatan.tinggi_badan} cm` : undefined
          } />
          <SidebarRow label="Suku" value={p.suku_bangsa} />
        </SidebarSection>

        {/* Keislaman */}
        <SidebarSection title="Keislaman">
          <SidebarRow label="Shalat" value={
            state.ibadah.shalat_fardhu === ''
              ? ''
              : ({ selalu_berjamaah: 'Selalu berjamaah', sering_berjamaah: 'Sering berjamaah', sering_sendiri: 'Sering sendiri', kadang: 'Kadang-kadang', masih_berjuang: 'Masih berjuang' }[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu)
          } />
          <SidebarRow label="Mazhab" value={state.ibadah.mazhab} />
          <SidebarRow label="Qur'an" value={state.ibadah.hafalan_quran} />
        </SidebarSection>

        {/* Karakter badges */}
        {state.karakter.kelebihan.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8 }}>
              Karakter
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {state.karakter.kelebihan.map((k) => <Badge key={k} text={k} />)}
            </div>
          </div>
        )}

        {/* Hobi */}
        {state.karakter.hobi.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8 }}>
              Hobi
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {state.karakter.hobi.map((h) => (
                <span key={h} style={{
                  fontSize: 9, padding: '3px 8px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.08)', color: C.textMuted,
                  fontWeight: 500, display: 'inline-block',
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, padding: '32px 36px', boxSizing: 'border-box' }}>

        {/* Tentang */}
        {state.karakter.karakter_diri && (
          <MainSection title="Tentang Saya">
            <p style={{ fontSize: 11, lineHeight: 1.75, color: C.textSoft, margin: 0 }}>
              {state.karakter.karakter_diri}
            </p>
          </MainSection>
        )}

        {/* Pendidikan */}
        {state.riwayatPendidikan.length > 0 && (
          <MainSection title="Pendidikan">
            {state.riwayatPendidikan.map((edu) => (
              <TimelineItem key={edu.id}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                  {edu.jenjang} — {edu.nama_institusi}
                </div>
                <div style={{ fontSize: 10, color: C.textSoft, marginTop: 2 }}>
                  {edu.jurusan} · {edu.tahun_mulai} – {edu.tahun_selesai}
                </div>
                {edu.prestasi && (
                  <div style={{ fontSize: 9, color: C.accent, marginTop: 3, fontWeight: 500 }}>🏆 {edu.prestasi}</div>
                )}
              </TimelineItem>
            ))}
          </MainSection>
        )}

        {/* Pekerjaan */}
        {state.riwayatPekerjaan.length > 0 && (
          <MainSection title="Pekerjaan">
            {state.riwayatPekerjaan.map((job) => (
              <TimelineItem key={job.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{job.posisi_jabatan}</span>
                  {job.is_masih_aktif && (
                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 999, backgroundColor: C.accentSoft, color: C.accent, fontWeight: 600 }}>Aktif</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: C.textSoft, marginTop: 2 }}>
                  {job.nama_perusahaan} · {job.tahun_mulai} – {job.is_masih_aktif ? 'sekarang' : job.tahun_selesai}
                </div>
              </TimelineItem>
            ))}
          </MainSection>
        )}

        {/* Visi */}
        {state.visiMisi.visi && (
          <MainSection title="Visi Pernikahan">
            <div style={{
              padding: '14px 16px', backgroundColor: C.accentSoft,
              borderRadius: 8, borderLeft: `3px solid ${C.accent}`,
            }}>
              <p style={{ fontSize: 11, lineHeight: 1.7, color: C.text, margin: 0, fontStyle: 'italic' }}>
                &ldquo;{state.visiMisi.visi}&rdquo;
              </p>
              {(state.visiMisi.misi_suami || state.visiMisi.misi_istri) && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {state.visiMisi.misi_suami && (
                    <div style={{ flex: 1, fontSize: 9, color: C.textSoft, lineHeight: 1.5 }}>
                      <strong style={{ color: C.accent }}>Suami:</strong> {state.visiMisi.misi_suami}
                    </div>
                  )}
                  {state.visiMisi.misi_istri && (
                    <div style={{ flex: 1, fontSize: 9, color: C.textSoft, lineHeight: 1.5 }}>
                      <strong style={{ color: C.accent }}>Istri:</strong> {state.visiMisi.misi_istri}
                    </div>
                  )}
                </div>
              )}
            </div>
          </MainSection>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 28, paddingTop: 10, borderTop: `1px solid ${C.gray200}`,
          fontSize: 8, color: C.textMuted,
        }}>
          Lembar Taaruf — dibuat dengan TaarufCV
        </div>
      </div>
    </Page>
  )
}

// ── Main Export ──────────────────────────────────────────────
export function TemplateModernPremium({ state }: { state: FormState }) {
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
    </div>
  )
}