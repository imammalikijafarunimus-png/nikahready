// ============================================================
// Template Modern Premium (4 pages)
// Gaya: sidebar gelap, accent indigo, personal branding
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style
// ✓ Tidak ada: position fixed/sticky, backdrop-filter, CSS vars, Tailwind
// ✓ Flexbox / explicit sizing
// ✓ Font: Inter (body only — no Arabic text in this template)
// ✓ Images: crossOrigin="anonymous"
// ✓ NO emojis — hanya teks dan bentuk (SVG)
// ✓ Uses shared tokens from @/lib/pdf-tokens
// ✓ Uses shared components from @/lib/pdf-shared-components
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

// ── Shared Design Tokens ──────────────────────────────────────
import {
  THEME_MODERN,
  SPACING,
  FONT,
  PAGE_W,
  PAGE_H,
  FINANCIAL_COLORS,
  FASE_COLORS,
  STATUS_LABELS,
  SHALAT_LABELS,
  TIPE_LABELS,
  hitungUsia,
  formatTTL,
} from '@/lib/pdf-tokens'

// ── Shared Components ─────────────────────────────────────────
import {
  PdfPage,
  PdfInfoRow,
  PdfPhotoPlaceholder,
  PdfPageFooter,
  PdfDivider,
  PdfTag,
  PdfTimelineItem,
  PdfFinancialBar,
  PdfFamilyCard,
} from '@/lib/pdf-shared-components'

// ── Theme alias ───────────────────────────────────────────────
const T = THEME_MODERN
const TOTAL_PAGES = 4

// ── Penghasilan label map ─────────────────────────────────────
const PENGHASILAN_LABELS: Record<string, string> = {
  '<3jt': 'Di bawah Rp 3 Juta',
  '3-5jt': 'Rp 3 – 5 Juta',
  '5-10jt': 'Rp 5 – 10 Juta',
  '10-20jt': 'Rp 10 – 20 Juta',
  '20-30jt': 'Rp 20 – 30 Juta',
  '>30jt': 'Di atas Rp 30 Juta',
}

// ═══════════════════════════════════════════════════════════════
// Template-specific helpers (sidebar layout unique to Modern)
// ═══════════════════════════════════════════════════════════════

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: T.textMuted,
        marginBottom: 8, paddingBottom: 4,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function SidebarRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div style={{ marginBottom: 5 }}>
      <span style={{ fontSize: 9, color: T.textMuted, display: 'block' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#FFFFFF', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontSize: 13, fontWeight: 700, color: T.text,
        margin: '0 0 10px', paddingBottom: 4,
        borderBottom: `2px solid ${T.accent}25`,
        display: 'inline-block',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, color: T.text,
        margin: 0, paddingBottom: 4,
        borderBottom: `2px solid ${T.accent}40`,
        display: 'inline-block',
      }}>
        {title}
      </h2>
    </div>
  )
}

function MpdBadge({ text, variant = 'accent' }: { text: string; variant?: 'accent' | 'gray' | 'white' }) {
  const styles = {
    accent: { bg: `${T.accent}18`, color: T.accent },
    gray:   { bg: T.bgAlt, color: T.textMid },
    white:  { bg: 'rgba(255,255,255,0.08)', color: T.textMuted },
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

function TimelineDot({ children, isLast }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 10, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: T.accent, flexShrink: 0 }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, backgroundColor: T.divider, marginTop: 3 }} />
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 0 }}>{children}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 1 — Cover + Sidebar (enhanced)
// ═══════════════════════════════════════════════════════════════
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const usia = hitungUsia(p.tanggal_lahir)
  const ttl = formatTTL(p.tempat_lahir, p.tanggal_lahir)

  const sosmedVisible = state.sosialMedia.filter((s) => s.tampil_di_pdf)

  return (
    <PdfPage bg={T.bg} pad={0}>
      {/* ===== SIDEBAR (30%) ===== */}
      <div style={{
        width: '30%', backgroundColor: T.primary, color: '#FFFFFF',
        padding: 32, boxSizing: 'border-box', flexShrink: 0,
      }}>
        {/* Foto */}
        {state.fotoTemplate.foto_pribadi_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={state.fotoTemplate.foto_pribadi_url} alt="" style={{
            width: '100%', height: 155, objectFit: 'cover', borderRadius: 10, marginBottom: 16,
          }} crossOrigin="anonymous" />
        ) : (
          <PdfPhotoPlaceholder
            width={160}
            height={155}
            borderRadius={10}
            borderColor={T.textMuted}
            bg={T.secondary}
            label="Foto"
          />
        )}

        {/* Nama */}
        <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.02em' }}>
          {p.nama_lengkap || 'Nama'}
        </h2>
        {p.nama_panggilan && (
          <p style={{ fontSize: 10, color: T.textMuted, margin: '0 0 4px', fontStyle: 'italic' }}>
            &lsquo;{p.nama_panggilan}&rsquo;
          </p>
        )}
        <p style={{ fontSize: 10, color: T.textMuted, margin: '0 0 20px' }}>
          {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
        </p>

        {/* Info Cepat */}
        <SidebarSection title="Info Cepat">
          <SidebarRow label="Usia" value={usia ? `${usia} tahun` : undefined} />
          <SidebarRow label="Status" value={STATUS_LABELS[p.status_pernikahan] ?? undefined} />
          <SidebarRow label="TTL" value={ttl} />
          <SidebarRow label="Tinggi" value={
            state.fisikKesehatan.tinggi_badan ? `${state.fisikKesehatan.tinggi_badan} cm` : undefined
          } />
          <SidebarRow label="Suku" value={p.suku_bangsa} />
        </SidebarSection>

        {/* Keislaman */}
        <SidebarSection title="Keislaman">
          <SidebarRow label="Shalat" value={
            state.ibadah.shalat_fardhu
              ? (SHALAT_LABELS[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu)
              : undefined
          } />
          <SidebarRow label="Mazhab" value={state.ibadah.mazhab} />
          <SidebarRow label="Qur'an" value={state.ibadah.hafalan_quran} />
          <SidebarRow label="Berpakaian" value={state.ibadah.cara_berpakaian} />
        </SidebarSection>

        {/* Karakter badges */}
        {state.karakter.kelebihan.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 }}>
              Karakter
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {state.karakter.kelebihan.map((k) => <MpdBadge key={k} text={k} variant="accent" />)}
            </div>
          </div>
        )}

        {/* Hobi */}
        {state.karakter.hobi.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 }}>
              Hobi
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {state.karakter.hobi.map((h) => <MpdBadge key={h} text={h} variant="white" />)}
            </div>
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT (70%) ===== */}
      <div style={{ flex: 1, padding: '32px 36px', boxSizing: 'border-box' }}>
        {/* Tentang Saya */}
        {state.karakter.karakter_diri && (
          <MainSection title="Tentang Saya">
            <p style={{ fontSize: 11, lineHeight: 1.75, color: T.textSoft, margin: 0 }}>
              {state.karakter.karakter_diri}
            </p>
          </MainSection>
        )}

        {/* Pendidikan */}
        {state.riwayatPendidikan.length > 0 && (
          <MainSection title="Pendidikan">
            {state.riwayatPendidikan.map((edu: RiwayatPendidikanItem) => (
              <div key={edu.id} style={{ marginBottom: 10, paddingLeft: 14, borderLeft: `2px solid ${T.accent}30` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
                  {edu.jenjang} — {edu.nama_institusi}
                </div>
                <div style={{ fontSize: 10, color: T.textSoft, marginTop: 2 }}>
                  {edu.jurusan} · {edu.tahun_mulai} – {edu.tahun_selesai}
                </div>
                {edu.prestasi && (
                  <div style={{ fontSize: 9, color: T.accent, marginTop: 3, fontWeight: 500 }}>Prestasi: {edu.prestasi}</div>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Pekerjaan */}
        {state.riwayatPekerjaan.length > 0 && (
          <MainSection title="Pekerjaan">
            {state.riwayatPekerjaan.map((job: RiwayatPekerjaanItem) => (
              <div key={job.id} style={{ marginBottom: 10, paddingLeft: 14, borderLeft: `2px solid ${T.accent}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{job.posisi_jabatan}</span>
                  {job.is_masih_aktif && (
                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 999, backgroundColor: T.accentSoft, color: T.accent, fontWeight: 600 }}>Aktif</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: T.textSoft, marginTop: 2 }}>
                  {job.nama_perusahaan} · {job.tahun_mulai} – {job.is_masih_aktif ? 'sekarang' : job.tahun_selesai}
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {/* Sosial Media chips */}
        {sosmedVisible.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textSoft, marginBottom: 8 }}>
              Sosial Media
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sosmedVisible.map((s) => (
                <span key={s.id} style={{
                  fontSize: 9, padding: '3px 10px', borderRadius: 999,
                  backgroundColor: T.accentSoft, color: T.accent, fontWeight: 500,
                }}>
                  {s.platform}: {s.username}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <PdfPageFooter
        nama={p.nama_lengkap || 'Nama'}
        pageNum={1}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="TAARUFCV · DOKUMEN RAHASIA"
        pad={0}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2 — Organisasi + Perjalanan Hidup
// ═══════════════════════════════════════════════════════════════
function Page2({ state }: { state: FormState }) {
  const k = state.karakter
  const gl = state.gayaHidup
  const p = state.dataPribadi

  return (
    <PdfPage bg={T.bg} pad={0}>
      {/* ===== CONDENSED SIDEBAR (30%) ===== */}
      <div style={{
        width: '30%', backgroundColor: T.primary, color: '#FFFFFF',
        padding: 32, boxSizing: 'border-box', flexShrink: 0,
      }}>
        {/* Photo thumbnail */}
        {state.fotoTemplate.foto_pribadi_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={state.fotoTemplate.foto_pribadi_url} alt="" style={{
            width: 80, height: 80, objectFit: 'cover', borderRadius: 10, marginBottom: 16,
          }} crossOrigin="anonymous" />
        ) : (
          <PdfPhotoPlaceholder
            width={80}
            height={80}
            borderRadius={10}
            borderColor={T.textMuted}
            bg={T.secondary}
            label="Foto"
          />
        )}

        {/* Nama */}
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          {p.nama_lengkap || 'Nama'}
        </h2>
        {p.nama_panggilan && (
          <p style={{ fontSize: 10, color: T.textMuted, margin: '0 0 16px', fontStyle: 'italic' }}>
            &lsquo;{p.nama_panggilan}&rsquo;
          </p>
        )}

        {/* Page indicator */}
        <div style={{
          fontSize: 9, fontWeight: 600, color: T.accentMid,
          padding: '4px 10px', borderRadius: 999,
          backgroundColor: `${T.accent}1F`, display: 'inline-block',
          marginBottom: 24,
        }}>
          Hal. 2 dari {TOTAL_PAGES}
        </div>

        {/* MBTI */}
        {k.mbti_type && (
          <SidebarSection title="MBTI">
            <div style={{
              padding: '8px 12px', borderRadius: 8,
              backgroundColor: T.secondary, border: `1px solid ${T.accent}33`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.accentMid }}>{k.mbti_type}</span>
            </div>
          </SidebarSection>
        )}

        {/* Bahasa Cinta */}
        {k.bahasa_cinta && (
          <SidebarSection title="Bahasa Cinta">
            <p style={{ fontSize: 11, color: '#FFFFFF', fontWeight: 500, margin: 0 }}>
              {k.bahasa_cinta.replace(/_/g, ' ')}
            </p>
          </SidebarSection>
        )}

        {/* Tipe Kepribadian */}
        {gl.tipe_kepribadian && (
          <SidebarSection title="Tipe Kepribadian">
            <p style={{ fontSize: 11, color: '#FFFFFF', fontWeight: 500, margin: 0 }}>
              {TIPE_LABELS[gl.tipe_kepribadian] ?? gl.tipe_kepribadian}
            </p>
          </SidebarSection>
        )}

        {/* Quick stats */}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: T.secondary,
          }}>
            <div style={{ fontSize: 9, color: T.textMuted, marginBottom: 4 }}>Organisasi</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.accentMid }}>
              {state.riwayatOrganisasi.length}
            </div>
          </div>
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: T.secondary, marginTop: 8,
          }}>
            <div style={{ fontSize: 9, color: T.textMuted, marginBottom: 4 }}>Cerita Hidup</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.accentMid }}>
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
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
                  {org.jabatan || org.nama_organisasi}
                </div>
                <div style={{ fontSize: 10, color: T.textSoft, marginTop: 2 }}>
                  {org.nama_organisasi} · {org.tahun_mulai}{org.tahun_selesai ? ` – ${org.tahun_selesai}` : ''}
                </div>
                {org.deskripsi && (
                  <div style={{ fontSize: 10, color: T.textMid, marginTop: 4, lineHeight: 1.5 }}>
                    {org.deskripsi}
                  </div>
                )}
              </TimelineDot>
            ))}
          </MainSection>
        )}

        {/* Divider */}
        {state.riwayatOrganisasi.length > 0 && state.perjalananHidup.length > 0 && <PdfDivider color={T.divider} />}

        {/* Perjalanan Hidup — NO emojis, uses text label circles */}
        {state.perjalananHidup.length > 0 && (
          <MainSection title="Perjalanan Hidup">
            {state.perjalananHidup.map((item: PerjalananHidupItem, i: number) => {
              const faseConfig = FASE_COLORS[item.fase]
              const color = faseConfig?.color ?? T.accent
              const label = faseConfig?.label ?? item.fase
              const shortLabel = label.length > 4 ? label.slice(0, 3) : label

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', gap: 14,
                    paddingBottom: i === state.perjalananHidup.length - 1 ? 0 : 18,
                  }}
                >
                  {/* Phase indicator — text circle instead of emoji */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      backgroundColor: color, color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 7, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.02em', flexShrink: 0, lineHeight: 1,
                    }}>
                      {shortLabel}
                    </div>
                    {i < state.perjalananHidup.length - 1 && (
                      <div style={{ width: 2, flex: 1, backgroundColor: T.divider, marginTop: 4 }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                        {item.judul}
                      </h4>
                      {(item.tahun_mulai || item.tahun_selesai) && (
                        <span style={{ fontSize: 9, color: T.textSoft, flexShrink: 0, marginLeft: 8 }}>
                          {item.tahun_mulai}{item.tahun_selesai ? `–${item.tahun_selesai}` : ''}
                        </span>
                      )}
                    </div>

                    {item.cerita && (
                      <p style={{ fontSize: 10, color: T.textMid, lineHeight: 1.6, margin: 0, marginBottom: 6 }}>
                        {item.cerita}
                      </p>
                    )}

                    {item.pelajaran && (
                      <div style={{
                        backgroundColor: T.accentSoft, border: `1px solid #C7D2FE`,
                        borderRadius: 6, padding: '5px 10px',
                      }}>
                        <span style={{ fontSize: 9, color: T.accent, fontWeight: 700, display: 'block', marginBottom: 2 }}>
                          Hikmah & Pelajaran
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

      <PdfPageFooter
        nama={p.nama_lengkap || 'Nama'}
        pageNum={2}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="TAARUFCV · DOKUMEN RAHASIA"
        pad={0}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 3 — Karakter + Ibadah + Gaya Hidup + Keluarga
// ═══════════════════════════════════════════════════════════════
function Page3({ state }: { state: FormState }) {
  const k = state.karakter
  const ibadah = state.ibadah
  const gl = state.gayaHidup

  return (
    <PdfPage bg={T.bg} pad={SPACING.pagePad}>
      {/* Indigo accent strip */}
      <div style={{ height: 4, backgroundColor: T.accent, margin: `-${SPACING.pagePad}px -${SPACING.pagePad}px 0 -${SPACING.pagePad}px` }} />

      <div style={{ padding: '0 0 40px' }}>
        {/* ── Karakter & Kepribadian ─────────────────────── */}
        <SectionHeading title="Karakter & Kepribadian" />

        {k.karakter_diri && (
          <p style={{ fontSize: 11, color: T.textMid, lineHeight: 1.65, marginBottom: 14, margin: '0 0 14px' }}>
            {k.karakter_diri}
          </p>
        )}

        {/* Kelebihan + Kekurangan (2-col) */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {k.kelebihan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kelebihan
              </p>
              <div>{k.kelebihan.map((tag) => <MpdBadge key={tag} text={tag} variant="accent" />)}</div>
            </div>
          )}
          {k.kekurangan.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Kekurangan
              </p>
              <div>{k.kekurangan.map((tag) => <MpdBadge key={tag} text={tag} variant="gray" />)}</div>
            </div>
          )}
        </div>

        {/* Hobi + MBTI + Bahasa Cinta + Tipe Kepribadian */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 4 }}>
          {k.hobi.length > 0 && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Hobi & Minat
              </p>
              <div>{k.hobi.map((tag) => <MpdBadge key={tag} text={tag} variant="accent" />)}</div>
            </div>
          )}
          <div style={{ width: 170, flexShrink: 0 }}>
            {k.mbti_type && <PdfInfoRow label="Tipe MBTI" value={k.mbti_type} />}
            {k.bahasa_cinta && <PdfInfoRow label="Bahasa Cinta" value={k.bahasa_cinta.replace(/_/g, ' ')} />}
            {gl.tipe_kepribadian && <PdfInfoRow label="Tipe Kepribadian" value={TIPE_LABELS[gl.tipe_kepribadian] ?? gl.tipe_kepribadian} />}
          </div>
        </div>

        <PdfDivider color={T.divider} />

        {/* ── Ibadah & Keislaman (detailed) ──────────────── */}
        <SectionHeading title="Ibadah & Keislaman" />

        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <PdfInfoRow label="Mazhab" value={ibadah.mazhab} />
            <PdfInfoRow label="Cara Berpakaian" value={ibadah.cara_berpakaian} />
            <PdfInfoRow label="Shalat Fardhu" value={SHALAT_LABELS[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
            <PdfInfoRow label="Shalat Sunnah" value={ibadah.shalat_sunnah} />
          </div>
          <div style={{ flex: 1 }}>
            <PdfInfoRow label="Hafalan Qur'an" value={ibadah.hafalan_quran} />
            <PdfInfoRow label="Tilawah Rutin" value={ibadah.tilawah_rutin ? 'Ya, rutin' : 'Belum rutin'} />
            <PdfInfoRow label="Kajian Rutin" value={ibadah.kajian_rutin ? 'Ya, rutin' : 'Belum rutin'} />
          </div>
        </div>

        {ibadah.deskripsi_ibadah && (
          <div style={{
            backgroundColor: T.accentSoft, border: '1px solid #C7D2FE',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 10, color: '#4338CA', lineHeight: 1.6, margin: 0 }}>
              {ibadah.deskripsi_ibadah}
            </p>
          </div>
        )}

        <PdfDivider color={T.divider} />

        {/* ── Gaya Hidup ────────────────────────────────── */}
        <SectionHeading title="Gaya Hidup" />

        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            {gl.gaya_hidup && <PdfInfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
            {gl.pola_makan && <PdfInfoRow label="Pola Makan" value={gl.pola_makan} />}
            <PdfInfoRow label="Olahraga Rutin" value={gl.olahraga_rutin ? 'Ya, rutin' : 'Belum rutin'} />
          </div>
          <div style={{ flex: 1 }}>
            {gl.kebiasaan_positif && <PdfInfoRow label="Kebiasaan Positif" value={gl.kebiasaan_positif} />}
            {gl.hal_tidak_disukai && <PdfInfoRow label="Hal Tidak Disukai" value={gl.hal_tidak_disukai} />}
          </div>
        </div>

        {/* ── Keluarga ──────────────────────────────────── */}
        {state.anggotaKeluarga.length > 0 && (
          <>
            <PdfDivider color={T.divider} />
            <SectionHeading title="Anggota Keluarga" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              {state.anggotaKeluarga.map((anggota: AnggotaKeluargaItem) => (
                <PdfFamilyCard
                  key={anggota.id}
                  hubungan={anggota.hubungan}
                  nama={anggota.nama}
                  pekerjaan={anggota.pekerjaan}
                  accentColor={T.accent}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <PdfPageFooter
        nama={state.dataPribadi.nama_lengkap || 'Nama'}
        pageNum={3}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="TAARUFCV · DOKUMEN RAHASIA"
        pad={SPACING.pagePad}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 4 — Visi + Kriteria + Financial + Pandangan + Rencana
// ═══════════════════════════════════════════════════════════════
function Page4({ state }: { state: FormState }) {
  const vm = state.visiMisi
  const kr = state.kriteria
  const fp = state.financialPlanning
  const pi = state.pandanganIsu

  return (
    <PdfPage bg={T.bg} pad={SPACING.pagePad} isLast>
      {/* Indigo accent strip */}
      <div style={{ height: 4, backgroundColor: T.accent, margin: `-${SPACING.pagePad}px -${SPACING.pagePad}px 0 -${SPACING.pagePad}px` }} />

      <div style={{ padding: '0 0 40px' }}>
        {/* ── Visi & Misi Pernikahan ─────────────────────── */}
        {(vm.visi || vm.misi_suami || vm.misi_istri) && (
          <>
            <SectionHeading title="Visi & Misi Pernikahan" />

            {vm.visi && (
              <div style={{
                padding: '12px 16px', backgroundColor: T.accentSoft,
                borderRadius: 8, borderLeft: `3px solid ${T.accent}`,
                marginBottom: 12,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>
                  VISI
                </p>
                <p style={{ fontSize: 11, lineHeight: 1.7, color: T.text, margin: 0, fontStyle: 'italic' }}>
                  &ldquo;{vm.visi}&rdquo;
                </p>
              </div>
            )}

            {/* Peran Suami + Peran Istri */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              {vm.misi_suami && (
                <div style={{ flex: 1, padding: '8px 10px', borderRadius: 6, backgroundColor: T.bgAlt, border: `1px solid ${T.divider}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: 'uppercase', marginBottom: 3, letterSpacing: '0.04em' }}>
                    Peran Suami
                  </p>
                  <p style={{ fontSize: 10, color: T.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_suami}</p>
                </div>
              )}
              {vm.misi_istri && (
                <div style={{ flex: 1, padding: '8px 10px', borderRadius: 6, backgroundColor: T.bgAlt, border: `1px solid ${T.divider}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: 'uppercase', marginBottom: 3, letterSpacing: '0.04em' }}>
                    Peran Istri
                  </p>
                  <p style={{ fontSize: 10, color: T.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_istri}</p>
                </div>
              )}
            </div>

            {/* Tujuan Pernikahan */}
            {vm.tujuan_pernikahan.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  Tujuan Pernikahan
                </p>
                <div>{vm.tujuan_pernikahan.map((t) => <MpdBadge key={t} text={t} variant="accent" />)}</div>
              </div>
            )}

            <PdfDivider color={T.divider} />
          </>
        )}

        {/* ── Kriteria Pasangan + Financial (2-col) ─────── */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {/* Kriteria */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Kriteria Pasangan" />
            {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
              <PdfInfoRow label="Usia" value={`${kr.kriteria_usia_min || '?'} – ${kr.kriteria_usia_max || '?'} tahun`} />
            )}
            <PdfInfoRow label="Domisili" value={kr.kriteria_domisili} />
            <PdfInfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
            <PdfInfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
            <PdfInfoRow label="Karakter" value={kr.kriteria_karakter} />
            <PdfInfoRow label="Ibadah" value={kr.kriteria_ibadah} />
            {kr.bersedia_poligami !== null && (
              <PdfInfoRow label="Bersedia Poligami" value={kr.bersedia_poligami ? 'Ya' : 'Tidak'} />
            )}
            {kr.bersedia_pindah_domisili !== null && (
              <PdfInfoRow label="Bersedia Pindah" value={kr.bersedia_pindah_domisili ? 'Ya' : 'Tidak'} />
            )}
            {kr.kriteria_lainnya && <PdfInfoRow label="Lainnya" value={kr.kriteria_lainnya} />}
          </div>

          {/* Financial Planning */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionHeading title="Financial Planning" />

            {fp.penghasilan_range && (
              <div style={{
                padding: '6px 10px', borderRadius: 6, marginBottom: 12,
                backgroundColor: T.accentSoft, border: '1px solid #C7D2FE',
              }}>
                <span style={{ fontSize: 9, color: T.textSoft, textTransform: 'uppercase', fontWeight: 600 }}>
                  Rentang Penghasilan
                </span>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.accent, margin: '2px 0 0' }}>
                  {PENGHASILAN_LABELS[fp.penghasilan_range] ?? fp.penghasilan_range}
                </p>
              </div>
            )}

            <p style={{ fontSize: 9, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Alokasi Keuangan
            </p>

            <PdfFinancialBar label="Kebutuhan Pokok" persen={fp.kebutuhan_pokok_persen} color={FINANCIAL_COLORS.pokok} />
            <PdfFinancialBar label="Tabungan" persen={fp.tabungan_persen} color={FINANCIAL_COLORS.tabungan} />
            <PdfFinancialBar label="Investasi" persen={fp.investasi_persen} color={FINANCIAL_COLORS.investasi} />
            <PdfFinancialBar label="Sedekah / Zakat" persen={fp.sedekah_persen} color={FINANCIAL_COLORS.sedekah} />
            <PdfFinancialBar label="Lainnya" persen={fp.lainnya_persen} color={FINANCIAL_COLORS.lainnya} />

            {fp.deskripsi && (
              <p style={{ fontSize: 10, color: T.textMid, lineHeight: 1.5, marginTop: 8, fontStyle: 'italic' }}>
                {fp.deskripsi}
              </p>
            )}
          </div>
        </div>

        <PdfDivider color={T.divider} />

        {/* ── Rencana Masa Depan ────────────────────────── */}
        {state.rencanaMasaDepan.length > 0 && (
          <>
            <SectionHeading title="Rencana Masa Depan" />
            <div style={{ marginBottom: 4 }}>
              {state.rencanaMasaDepan.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', gap: 10, paddingBottom: i === state.rencanaMasaDepan.length - 1 ? 0 : 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 10, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: T.accent, flexShrink: 0 }} />
                    {i < state.rencanaMasaDepan.length - 1 && (
                      <div style={{ width: 1, flex: 1, backgroundColor: T.divider, marginTop: 3 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{r.rencana}</span>
                      <span style={{
                        fontSize: 8, padding: '1px 6px', borderRadius: 999, fontWeight: 600,
                        backgroundColor: r.tipe === 'pendek' ? '#DBEAFE' : T.goldSoft,
                        color: r.tipe === 'pendek' ? '#2563EB' : T.gold,
                      }}>
                        {r.tipe === 'pendek' ? 'Jangka Pendek' : 'Jangka Panjang'}
                      </span>
                    </div>
                    <div style={{ fontSize: 9, color: T.textSoft }}>
                      {r.waktu}{r.target ? ` · ${r.target}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <PdfDivider color={T.divider} />
          </>
        )}

        {/* ── Pandangan Isu ─────────────────────────────── */}
        {pi.pandangan_isu && (
          <>
            <SectionHeading title="Pandangan tentang Pernikahan" />
            <p style={{ fontSize: 10, color: T.textMid, lineHeight: 1.65, marginBottom: 4 }}>
              {pi.pandangan_isu}
            </p>

            <PdfDivider color={T.divider} />
          </>
        )}

        {/* ── Additional Pandangan fields ───────────────── */}
        {(pi.pandangan_istri_bekerja || pi.pandangan_kb || pi.pandangan_parenting || pi.pandangan_mertua) && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
              {pi.pandangan_istri_bekerja && (
                <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: T.bgAlt }}>
                  <p style={{ fontSize: 8, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Istri Bekerja</p>
                  <p style={{ fontSize: 9, color: T.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_istri_bekerja}</p>
                </div>
              )}
              {pi.pandangan_kb && (
                <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: T.bgAlt }}>
                  <p style={{ fontSize: 8, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Keluarga Berencana</p>
                  <p style={{ fontSize: 9, color: T.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_kb}</p>
                </div>
              )}
            </div>
            {(pi.pandangan_parenting || pi.pandangan_mertua) && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
                {pi.pandangan_parenting && (
                  <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: T.bgAlt }}>
                    <p style={{ fontSize: 8, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Parenting</p>
                    <p style={{ fontSize: 9, color: T.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_parenting}</p>
                  </div>
                )}
                {pi.pandangan_mertua && (
                  <div style={{ flex: 1, padding: '6px 10px', borderRadius: 6, backgroundColor: T.bgAlt }}>
                    <p style={{ fontSize: 8, fontWeight: 700, color: T.textSoft, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Hub. dengan Mertua</p>
                    <p style={{ fontSize: 9, color: T.textMid, lineHeight: 1.5, margin: 0 }}>{pi.pandangan_mertua}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Closing ───────────────────────────────────── */}
        <div style={{
          marginTop: 20, backgroundColor: T.primary,
          borderRadius: 8, padding: '14px 20px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '0.05em' }}>
            Lembar Taaruf — dibuat dengan TaarufCV
          </p>
        </div>
      </div>

      <PdfPageFooter
        nama={state.dataPribadi.nama_lengkap || 'Nama'}
        pageNum={4}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="TAARUFCV · DOKUMEN RAHASIA"
        pad={SPACING.pagePad}
      />
    </PdfPage>
  )
}

// ── Main Export ──────────────────────────────────────────────
export function TemplateModernPremium({ state }: { state: FormState }) {
  return (
    <div
      id="taaruf-template"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        width: PAGE_W,
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