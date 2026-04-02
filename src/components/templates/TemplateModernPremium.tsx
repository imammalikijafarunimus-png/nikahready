// ============================================================
// Template 3 — Modern Premium (4 pages)
// Gaya: sidebar gelap, accent indigo, personal branding
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, CSS vars, Tailwind
// ✓ Flexbox / explicit sizing
// ✓ Font: Inter (body only — no Arabic text in this template)
// ✓ Images: crossOrigin="anonymous"
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
  dark:       '#0F172A',
  darkSoft:   '#1E293B',
  darkMid:    '#334155',
  accent:     '#6366F1',
  accentSoft: '#EEF2FF',
  accentMid:  '#818CF8',
  text:       '#1E293B',
  textMid:    '#475569',
  textSoft:   '#64748B',
  textMuted:  '#94A3B8',
  white:      '#FFFFFF',
  gray50:     '#F8FAFC',
  gray100:    '#F1F5F9',
  gray200:    '#E2E8F0',
  gold:       '#D97706',
  goldSoft:   '#FEF3C7',
}

const PAGE_W = 794
const PAGE_H = 1123

// ── Mappings ─────────────────────────────────────────────────
const statusLabel: Record<string, string> = {
  lajang: 'Lajang', duda: 'Duda', janda: 'Janda',
  cerai_mati: 'Cerai Mati', cerai_hidup: 'Cerai Hidup',
}

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

const faseColor: Record<string, string> = {
  masa_kecil:  '#6366F1',
  remaja:      '#8B5CF6',
  dewasa_awal: '#3B82F6',
  saat_ini:    '#D97706',
}

const faseEmoji: Record<string, string> = {
  masa_kecil:  '🌱',
  remaja:      '📚',
  dewasa_awal: '🚀',
  saat_ini:    '⭐',
}

// ── Page wrapper ─────────────────────────────────────────────
function Page({ children, isLast = false }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
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
        borderBottom: '1px solid rgba(255,255,255,0.08)',
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

// ── Main section heading ─────────────────────────────────────
function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontSize: 13, fontWeight: 700, color: C.text,
        margin: '0 0 10px', paddingBottom: 4,
        borderBottom: '2px solid #6366F125',
        display: 'inline-block',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ── Full-width section heading (for pages 3-4) ───────────────
function SectionHeading({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, color: C.text,
        margin: 0, paddingBottom: 4,
        borderBottom: '2px solid #6366F140',
        display: 'inline-block',
      }}>
        {title}
      </h2>
    </div>
  )
}

// ── Timeline item (indigo accent) ────────────────────────────
function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10, paddingLeft: 14, borderLeft: '2px solid #6366F130' }}>
      {children}
    </div>
  )
}

// ── Timeline item with dot (for sidebar content) ─────────────
function TimelineDot({ children, isLast }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 10, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.accent, flexShrink: 0 }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, backgroundColor: C.gray200, marginTop: 3 }} />
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 0 }}>{children}</div>
    </div>
  )
}

// ── Badge (indigo tint) ──────────────────────────────────────
function Badge({ text, variant = 'accent' }: { text: string; variant?: 'accent' | 'gray' | 'white' }) {
  const styles = {
    accent: { bg: '#6366F118', color: C.accent },
    gray:   { bg: '#F1F5F9', color: C.textMid },
    white:  { bg: 'rgba(255,255,255,0.08)', color: C.textMuted },
  }[variant]
  return (
    <span style={{
      fontSize: 9, padding: '3px 8px', borderRadius: 999,
      backgroundColor: styles.bg, color: styles.color,
      fontWeight: 500, margin: '0 4px 4px 0', display: 'inline-block',
    }}>
      {text}
    </span>
  )
}

// ── Info row (for pages 3-4) ─────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontSize: 9, color: C.textSoft, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: C.text, fontWeight: 500, display: 'block', marginTop: 1, lineHeight: 1.4 }}>
        {value}
      </span>
    </div>
  )
}

// ── Financial progress bar ───────────────────────────────────
function FinancialBar({ label, persen, color }: { label: string; persen: number; color: string }) {
  const safePercent = Math.min(100, Math.max(0, persen))
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: C.textSoft, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 10, color: C.text, fontWeight: 700 }}>{safePercent}%</span>
      </div>
      <div style={{ height: 6, backgroundColor: C.gray100, borderRadius: 999 }}>
        <div style={{ height: 6, width: `${safePercent}%`, backgroundColor: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, backgroundColor: C.gray200, margin: '16px 0' }} />
}

// ── PAGE 1: Cover + Sidebar (enhanced) ───────────────────────
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const usia = p.tanggal_lahir
    ? Math.floor((Date.now() - new Date(p.tanggal_lahir).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const sosmedVisible = state.sosialMedia.filter((s) => s.tampil_di_pdf)

  return (
    <Page>
      {/* ===== SIDEBAR (30%) ===== */}
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
            state.ibadah.shalat_fardhu
              ? (shalatLabel[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu)
              : undefined
          } />
          <SidebarRow label="Mazhab" value={state.ibadah.mazhab} />
          <SidebarRow label="Qur'an" value={state.ibadah.hafalan_quran} />
          <SidebarRow label="Berpakaian" value={state.ibadah.cara_berpakaian} />
        </SidebarSection>

        {/* Karakter badges */}
        {state.karakter.kelebihan.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 8 }}>
              Karakter
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {state.karakter.kelebihan.map((k) => <Badge key={k} text={k} variant="accent" />)}
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
              {state.karakter.hobi.map((h) => <Badge key={h} text={h} variant="white" />)}
            </div>
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT (70%) ===== */}
      <div style={{ flex: 1, padding: '32px 36px', boxSizing: 'border-box' }}>
        {/* Tentang Saya */}
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
            {state.riwayatPendidikan.map((edu: RiwayatPendidikanItem) => (
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
            {state.riwayatPekerjaan.map((job: RiwayatPekerjaanItem) => (
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

        {/* Sosial Media chips */}
        {sosmedVisible.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textSoft, marginBottom: 8 }}>
              Sosial Media
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sosmedVisible.map((s) => (
                <span key={s.id} style={{
                  fontSize: 9, padding: '3px 10px', borderRadius: 999,
                  backgroundColor: C.accentSoft, color: C.accent, fontWeight: 500,
                }}>
                  {s.platform}: {s.username}
                </span>
              ))}
            </div>
          </div>
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

// ── PAGE 2: Organisasi + Perjalanan Hidup ────────────────────
function Page2({ state }: { state: FormState }) {
  const k = state.karakter
  const gl = state.gayaHidup
  const p = state.dataPribadi

  return (
    <Page>
      {/* ===== CONDENSED SIDEBAR (30%) ===== */}
      <div style={{
        width: '30%', backgroundColor: C.dark, color: C.white,
        padding: 32, boxSizing: 'border-box', flexShrink: 0,
      }}>
        {/* Photo thumbnail */}
        {state.fotoTemplate.foto_pribadi_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={state.fotoTemplate.foto_pribadi_url} alt="" style={{
            width: 80, height: 80, objectFit: 'cover', borderRadius: 10, marginBottom: 16,
          }} crossOrigin="anonymous" />
        ) : (
          <div style={{
            width: 80, height: 80, borderRadius: 10,
            backgroundColor: C.darkSoft, border: `1px dashed ${C.textMuted}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 18 }}>👤</span>
          </div>
        )}

        {/* Nama */}
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          {p.nama_lengkap || 'Nama'}
        </h2>
        {p.nama_panggilan && (
          <p style={{ fontSize: 10, color: C.textMuted, margin: '0 0 16px', fontStyle: 'italic' }}>
            &lsquo;{p.nama_panggilan}&rsquo;
          </p>
        )}

        {/* Page indicator */}
        <div style={{
          fontSize: 9, fontWeight: 600, color: C.accentMid,
          padding: '4px 10px', borderRadius: 999,
          backgroundColor: 'rgba(99,102,241,0.12)', display: 'inline-block',
          marginBottom: 24,
        }}>
          Hal. 2 dari 4
        </div>

        {/* MBTI */}
        {k.mbti_type && (
          <SidebarSection title="MBTI">
            <div style={{
              padding: '8px 12px', borderRadius: 8,
              backgroundColor: C.darkSoft, border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.accentMid }}>{k.mbti_type}</span>
            </div>
          </SidebarSection>
        )}

        {/* Bahasa Cinta */}
        {k.bahasa_cinta && (
          <SidebarSection title="Bahasa Cinta">
            <p style={{ fontSize: 11, color: C.white, fontWeight: 500, margin: 0 }}>
              {k.bahasa_cinta.replace(/_/g, ' ')}
            </p>
          </SidebarSection>
        )}

        {/* Tipe Kepribadian */}
        {gl.tipe_kepribadian && (
          <SidebarSection title="Tipe Kepribadian">
            <p style={{ fontSize: 11, color: C.white, fontWeight: 500, margin: 0 }}>
              {tipeLabel[gl.tipe_kepribadian] ?? gl.tipe_kepribadian}
            </p>
          </SidebarSection>
        )}

        {/* Quick stats */}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: C.darkSoft,
          }}>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>Organisasi</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.accentMid }}>
              {state.riwayatOrganisasi.length}
            </div>
          </div>
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: C.darkSoft, marginTop: 8,
          }}>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>Cerita Hidup</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.accentMid }}>
              {state.perjalananHidup.length}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT (70%) ===== */}
      <div style={{ flex: 1, padding: '32px 36px', boxSizing: 'border-box' }}>
        {/* Riwayat Organisasi */}
        {state.riwayatOrganisasi.length > 0 && (
          <MainSection title="Riwayat Organisasi">
            {state.riwayatOrganisasi.map((org: RiwayatOrganisasiItem, i: number) => (
              <TimelineDot key={org.id} isLast={i === state.riwayatOrganisasi.length - 1}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                  {org.jabatan || org.nama_organisasi}
                </div>
                <div style={{ fontSize: 10, color: C.textSoft, marginTop: 2 }}>
                  {org.nama_organisasi} · {org.tahun_mulai}{org.tahun_selesai ? ` – ${org.tahun_selesai}` : ''}
                </div>
                {org.deskripsi && (
                  <div style={{ fontSize: 10, color: C.textMid, marginTop: 4, lineHeight: 1.5 }}>
                    {org.deskripsi}
                  </div>
                )}
              </TimelineDot>
            ))}
          </MainSection>
        )}

        {/* Divider */}
        {state.riwayatOrganisasi.length > 0 && state.perjalananHidup.length > 0 && <Divider />}

        {/* Perjalanan Hidup */}
        {state.perjalananHidup.length > 0 && (
          <MainSection title="Perjalanan Hidup">
            {state.perjalananHidup.map((item: PerjalananHidupItem, i: number) => {
              const color = faseColor[item.fase] ?? C.accent
              const emoji = faseEmoji[item.fase] ?? '📍'

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', gap: 14,
                    paddingBottom: i === state.perjalananHidup.length - 1 ? 0 : 18,
                  }}
                >
                  {/* Phase indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      backgroundColor: color, color: C.white,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, flexShrink: 0,
                    }}>
                      {emoji}
                    </div>
                    {i < state.perjalananHidup.length - 1 && (
                      <div style={{ width: 2, flex: 1, backgroundColor: C.gray200, marginTop: 4 }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0 }}>
                        {item.judul}
                      </h4>
                      {(item.tahun_mulai || item.tahun_selesai) && (
                        <span style={{ fontSize: 9, color: C.textSoft, flexShrink: 0, marginLeft: 8 }}>
                          {item.tahun_mulai}{item.tahun_selesai ? `–${item.tahun_selesai}` : ''}
                        </span>
                      )}
                    </div>

                    {item.cerita && (
                      <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.6, margin: 0, marginBottom: 6 }}>
                        {item.cerita}
                      </p>
                    )}

                    {item.pelajaran && (
                      <div style={{
                        backgroundColor: C.accentSoft, border: `1px solid #C7D2FE`,
                        borderRadius: 6, padding: '5px 10px',
                      }}>
                        <span style={{ fontSize: 9, color: C.accent, fontWeight: 700, display: 'block', marginBottom: 2 }}>
                          💡 Hikmah & Pelajaran
                        </span>
                        <p style={{ fontSize: 10, color: '#4338CA', margin: 0, lineHeight: 1.5 }}>
                          {item.pelajaran}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </MainSection>
        )}
      </div>
    </Page>
  )
}

// ── PAGE 3: Karakter + Ibadah + Gaya Hidup + Keluarga ────────
function Page3({ state }: { state: FormState }) {
  const k = state.karakter
  const ibadah = state.ibadah
  const gl = state.gayaHidup

  return (
    <Page>
      {/* Indigo accent strip */}
      <div style={{ height: 4, backgroundColor: C.accent }} />

      <div style={{ padding: '28px 36px 40px' }}>
        {/* ── Karakter & Kepribadian ─────────────────────── */}
        <SectionHeading title="Karakter & Kepribadian" />

        {k.karakter_diri && (
          <p style={{ fontSize: 11, color: C.textMid, lineHeight: 1.65, marginBottom: 14, margin: '0 0 14px' }}>
            {k.karakter_diri}
          </p>
        )}

        {/* Kelebihan + Kekurangan (2-col) */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {k.kelebihan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kelebihan
              </p>
              <div>{k.kelebihan.map((tag) => <Badge key={tag} text={tag} variant="accent" />)}</div>
            </div>
          )}
          {k.kekurangan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kekurangan
              </p>
              <div>{k.kekurangan.map((tag) => <Badge key={tag} text={tag} variant="gray" />)}</div>
            </div>
          )}
        </div>

        {/* Hobi + MBTI + Bahasa Cinta + Tipe Kepribadian */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 4 }}>
          {k.hobi.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Hobi & Minat
              </p>
              <div>{k.hobi.map((tag) => <Badge key={tag} text={tag} variant="accent" />)}</div>
            </div>
          )}
          <div style={{ width: 170, flexShrink: 0 }}>
            {k.mbti_type && <InfoRow label="Tipe MBTI" value={k.mbti_type} />}
            {k.bahasa_cinta && <InfoRow label="Bahasa Cinta" value={k.bahasa_cinta.replace(/_/g, ' ')} />}
            {gl.tipe_kepribadian && <InfoRow label="Tipe Kepribadian" value={tipeLabel[gl.tipe_kepribadian] ?? ''} />}
          </div>
        </div>

        <Divider />

        {/* ── Ibadah & Keislaman (detailed) ──────────────── */}
        <SectionHeading title="Ibadah & Keislaman" />

        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <InfoRow label="Mazhab" value={ibadah.mazhab} />
            <InfoRow label="Cara Berpakaian" value={ibadah.cara_berpakaian} />
            <InfoRow label="Shalat Fardhu" value={shalatLabel[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
            <InfoRow label="Shalat Sunnah" value={ibadah.shalat_sunnah} />
          </div>
          <div style={{ flex: 1 }}>
            <InfoRow label="Hafalan Qur'an" value={ibadah.hafalan_quran} />
            <InfoRow label="Tilawah Rutin" value={ibadah.tilawah_rutin ? 'Ya, rutin' : 'Belum rutin'} />
            <InfoRow label="Kajian Rutin" value={ibadah.kajian_rutin ? 'Ya, rutin' : 'Belum rutin'} />
          </div>
        </div>

        {ibadah.deskripsi_ibadah && (
          <div style={{
            backgroundColor: C.accentSoft, border: '1px solid #C7D2FE',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 10, color: '#4338CA', lineHeight: 1.6, margin: 0 }}>
              {ibadah.deskripsi_ibadah}
            </p>
          </div>
        )}

        <Divider />

        {/* ── Gaya Hidup ────────────────────────────────── */}
        <SectionHeading title="Gaya Hidup" />

        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            {gl.gaya_hidup && <InfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
            {gl.pola_makan && <InfoRow label="Pola Makan" value={gl.pola_makan} />}
            <InfoRow label="Olahraga Rutin" value={gl.olahraga_rutin ? 'Ya, rutin' : 'Belum rutin'} />
          </div>
          <div style={{ flex: 1 }}>
            {gl.kebiasaan_positif && <InfoRow label="Kebiasaan Positif" value={gl.kebiasaan_positif} />}
            {gl.hal_tidak_disukai && <InfoRow label="Hal Tidak Disukai" value={gl.hal_tidak_disukai} />}
          </div>
        </div>

        {/* ── Keluarga ──────────────────────────────────── */}
        {state.anggotaKeluarga.length > 0 && (
          <>
            <Divider />
            <SectionHeading title="Anggota Keluarga" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              {state.anggotaKeluarga.map((anggota: AnggotaKeluargaItem) => (
                <div key={anggota.id} style={{
                  minWidth: 150, padding: '8px 12px', borderRadius: 6,
                  backgroundColor: C.gray50, border: `1px solid ${C.gray200}`,
                }}>
                  <span style={{
                    fontSize: 8, color: C.accent, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block',
                  }}>
                    {anggota.hubungan}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.text, display: 'block', marginTop: 2 }}>
                    {anggota.nama}
                  </span>
                  {anggota.pekerjaan && (
                    <span style={{ fontSize: 9, color: C.textMid, display: 'block', marginTop: 1 }}>
                      {anggota.pekerjaan}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Page>
  )
}

// ── PAGE 4: Visi + Kriteria + Financial + Pandangan + Rencana + Closing ──
function Page4({ state }: { state: FormState }) {
  const vm = state.visiMisi
  const kr = state.kriteria
  const fp = state.financialPlanning
  const pi = state.pandanganIsu

  const penghasilanLabel: Record<string, string> = {
    '<3jt': 'Di bawah Rp 3 Juta',
    '3-5jt': 'Rp 3 – 5 Juta',
    '5-10jt': 'Rp 5 – 10 Juta',
    '10-20jt': 'Rp 10 – 20 Juta',
    '20-30jt': 'Rp 20 – 30 Juta',
    '>30jt': 'Di atas Rp 30 Juta',
  }

  return (
    <Page isLast>
      {/* Indigo accent strip */}
      <div style={{ height: 4, backgroundColor: C.accent }} />

      <div style={{ padding: '28px 36px 40px' }}>
        {/* ── Visi & Misi Pernikahan ─────────────────────── */}
        {(vm.visi || vm.misi_suami || vm.misi_istri) && (
          <>
            <SectionHeading title="Visi & Misi Pernikahan" />

            {vm.visi && (
              <div style={{
                padding: '12px 16px', backgroundColor: C.accentSoft,
                borderRadius: 8, borderLeft: `3px solid ${C.accent}`,
                marginBottom: 12,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: C.accent, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>
                  VISI
                </p>
                <p style={{ fontSize: 11, lineHeight: 1.7, color: C.text, margin: 0, fontStyle: 'italic' }}>
                  &ldquo;{vm.visi}&rdquo;
                </p>
              </div>
            )}

            {/* Peran Suami + Peran Istri */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              {vm.misi_suami && (
                <div style={{ flex: 1, padding: '8px 10px', borderRadius: 6, backgroundColor: C.gray50, border: `1px solid ${C.gray200}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.accent, textTransform: 'uppercase', marginBottom: 3, letterSpacing: '0.04em' }}>
                    Peran Suami
                  </p>
                  <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_suami}</p>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ flex: 1, padding: '8px 10px', borderRadius: 6, backgroundColor: C.gray50, border: `1px solid ${C.gray200}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.accent, textTransform: 'uppercase', marginBottom: 3, letterSpacing: '0.04em' }}>
                    Peran Istri
                  </p>
                  <p style={{ fontSize: 10, color: C.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_istri}</p>
                </div>
              )}
            </div>

            {/* Tujuan Pernikahan */}
            {vm.tujuan_pernikahan.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  Tujuan Pernikahan
                </p>
                <div>{vm.tujuan_pernikahan.map((t) => <Badge key={t} text={t} variant="accent" />)}</div>
              </div>
            )}

            <Divider />
          </>
        )}

        {/* ── Kriteria Pasangan + Financial (2-col) ─────── */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {/* Kriteria */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Kriteria Pasangan" />
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <InfoRow label="Usia" value={`${kr.kriteria_usia_min || '?'} – ${kr.kriteria_usia_max || '?'} tahun`} />
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
              <InfoRow label="Bersedia Pindah" value={kr.bersedia_pindah_domisili ? 'Ya' : 'Tidak'} />
            )}
            {kr.kriteria_lainnya && <InfoRow label="Lainnya" value={kr.kriteria_lainnya} />}
          </div>

          {/* Financial Planning */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Financial Planning" />

            {fp.penghasilan_range && (
              <div style={{
                padding: '6px 10px', borderRadius: 6, marginBottom: 12,
                backgroundColor: C.accentSoft, border: '1px solid #C7D2FE',
              }}>
                <span style={{ fontSize: 9, color: C.textSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Rentang Penghasilan
                </span>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, margin: '2px 0 0' }}>
                  {penghasilanLabel[fp.penghasilan_range] ?? fp.penghasilan_range}
                </p>
              </div>
            )}

            <p style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Alokasi Keuangan
            </p>

            <FinancialBar label="Kebutuhan Pokok" persen={fp.kebutuhan_pokok_persen} color="#6366F1" />
            <FinancialBar label="Tabungan" persen={fp.tabungan_persen} color="#3B82F6" />
            <FinancialBar label="Investasi" persen={fp.investasi_persen} color="#8B5CF6" />
            <FinancialBar label="Sedekah / Zakat" persen={fp.sedekah_persen} color="#D97706" />
            <FinancialBar label="Lainnya" persen={fp.lainnya_persen} color="#94A3B8" />

            {fp.deskripsi && (
              <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.5, marginTop: 8, fontStyle: 'italic' }}>
                {fp.deskripsi}
              </p>
            )}
          </div>
        </div>

        <Divider />

        {/* ── Rencana Masa Depan ────────────────────────── */}
        {state.rencanaMasaDepan.length > 0 && (
          <>
            <SectionHeading title="Rencana Masa Depan" />
            <div style={{ marginBottom: 4 }}>
              {state.rencanaMasaDepan.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', gap: 10, paddingBottom: i === state.rencanaMasaDepan.length - 1 ? 0 : 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 10, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.accent, flexShrink: 0 }} />
                    {i < state.rencanaMasaDepan.length - 1 && (
                      <div style={{ width: 1, flex: 1, backgroundColor: C.gray200, marginTop: 3 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{r.rencana}</span>
                      <span style={{
                        fontSize: 8, padding: '1px 6px', borderRadius: 999, fontWeight: 600,
                        backgroundColor: r.tipe === 'pendek' ? '#DBEAFE' : '#FEF3C7',
                        color: r.tipe === 'pendek' ? '#2563EB' : '#D97706',
                      }}>
                        {r.tipe === 'pendek' ? 'Jangka Pendek' : 'Jangka Panjang'}
                      </span>
                    </div>
                    <div style={{ fontSize: 9, color: C.textSoft }}>
                      {r.waktu}{r.target ? ` · ${r.target}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Divider />
          </>
        )}

        {/* ── Pandangan Isu ─────────────────────────────── */}
        {pi.pandangan_isu && (
          <>
            <SectionHeading title="Pandangan tentang Pernikahan" />
            <p style={{ fontSize: 10, color: C.textMid, lineHeight: 1.65, marginBottom: 4 }}>
              {pi.pandangan_isu}
            </p>

            <Divider />
          </>
        )}

        {/* ── Additional Pandangan fields ───────────────── */}
        {(pi.pandangan_istri_bekerja || pi.pandangan_kb || pi.pandangan_parenting || pi.pandangan_mertua) && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            {pi.pandangan_istri_bekerja && (
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: C.gray50 }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Istri Bekerja</p>
                <p style={{ fontSize: 9, color: C.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_istri_bekerja}</p>
              </div>
            )}
            {pi.pandangan_kb && (
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: C.gray50 }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Keluarga Berencana</p>
                <p style={{ fontSize: 9, color: C.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_kb}</p>
              </div>
            )}
          </div>
        )}
        {(pi.pandangan_parenting || pi.pandangan_mertua) && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            {pi.pandangan_parenting && (
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: C.gray50 }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Parenting</p>
                <p style={{ fontSize: 9, color: C.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_parenting}</p>
              </div>
            )}
            {pi.pandangan_mertua && (
              <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: C.gray50 }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Hub. dengan Mertua</p>
                <p style={{ fontSize: 9, color: C.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_mertua}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Closing ───────────────────────────────────── */}
        <div style={{
          marginTop: 20, backgroundColor: C.dark,
          borderRadius: 8, padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '0.05em' }}>
            Lembar Taaruf — dibuat dengan TaarufCV
          </p>
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
      <Page2 state={state} />
      <Page3 state={state} />
      <Page4 state={state} />
    </div>
  )
}