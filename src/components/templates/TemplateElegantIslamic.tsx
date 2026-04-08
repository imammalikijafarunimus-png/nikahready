// ============================================================
// Template 2 — Elegant Islamic (PREMIUM — 5 pages)
// Gaya: nuansa Islami hangat, gold + deep green, ornamental
//
// PDF-SAFE RULES (WAJIB DIPATUHI):
// ✓ Setiap page: width 794px, min-height 1123px, overflow hidden
// ✓ Warna: hex literal di inline style — NO CSS vars, NO Tailwind
// ✓ Tidak ada: position fixed/sticky, backdrop-filter
// ✓ Flexbox / explicit sizing only
// ✓ Font: Inter (body), Amiri (Arabic)
// ✓ All images: crossOrigin="anonymous"
// ✓ No emojis — text and shapes only
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
} from '@/types'

// ── Shared Tokens ─────────────────────────────────────────────
import {
  THEME_ISLAMIC,
  SPACING,
  FONT,
  PAGE_W,
  PAGE_H,
  SHALAT_LABELS,
  TIPE_LABELS,
  STATUS_LABELS,
  FINANCIAL_COLORS,
  FASE_COLORS,
  hitungUsia,
  formatTTL,
} from '@/lib/pdf-tokens'

// ── Shared Components ─────────────────────────────────────────
import {
  PdfPage,
  PdfSectionTitle,
  PdfInfoRow,
  PdfTag,
  PdfTimelineItem,
  PdfPhaseItem,
  PdfFinancialBar,
  PdfPhotoPlaceholder,
  PdfPageFooter,
  PdfDivider,
  PdfOrnDivider,
  PdfCornerOrnament,
  PdfFamilyCard,
} from '@/lib/pdf-shared-components'

// ── Theme alias for readability ───────────────────────────────
const T = THEME_ISLAMIC
const TOTAL_PAGES = 5

// ═══════════════════════════════════════════════════════════════
// PAGE 1 — Bismillah + Foto + Nama + Tentang Saya
//           + Data Pribadi + Keislaman + Sosial Media + Keluarga
// ═══════════════════════════════════════════════════════════════
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const nama = p.nama_lengkap || 'Nama Lengkap'
  const usia = hitungUsia(p.tanggal_lahir)
  const visibleSosmed = state.sosialMedia.filter((s) => s.tampil_di_pdf)

  return (
    <PdfPage bg={T.bg} pad={SPACING.pagePadPremium}>
      {/* Corner ornaments */}
      <PdfCornerOrnament position="top-left" color={T.gold} />
      <PdfCornerOrnament position="top-right" color={T.gold} />
      <PdfCornerOrnament position="bottom-left" color={T.gold} />
      <PdfCornerOrnament position="bottom-right" color={T.gold} />

      {/* Bismillah */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <p style={{
          fontFamily: "'Amiri', Georgia, serif",
          fontSize: FONT.arabic + 4,
          color: T.primary,
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.8,
        }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
      </div>

      <PdfOrnDivider color={T.gold} />

      {/* Nama + Foto */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        {state.fotoTemplate.foto_pribadi_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={state.fotoTemplate.foto_pribadi_url}
            alt={nama}
            style={{
              width: 90,
              height: 110,
              objectFit: 'cover',
              borderRadius: 8,
              border: `3px solid ${T.gold}`,
              flexShrink: 0,
            }}
            crossOrigin="anonymous"
          />
        ) : (
          <PdfPhotoPlaceholder
            width={90}
            height={110}
            borderRadius={8}
            borderColor={T.gold}
            bg={T.bgGold}
            label="Foto"
          />
        )}

        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: FONT.name,
            fontWeight: 800,
            color: T.primary,
            margin: 0,
            lineHeight: 1.2,
          }}>
            {nama}
          </h1>
          {p.nama_panggilan && (
            <p style={{
              fontSize: FONT.body + 1,
              color: T.textSoft,
              marginTop: 2,
              fontStyle: 'italic',
            }}>
              &lsquo;{p.nama_panggilan}&rsquo;
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {usia && (
              <span style={{
                padding: '3px 10px',
                borderRadius: 999,
                backgroundColor: T.bgGreen,
                fontSize: FONT.body,
                color: T.primary,
                fontWeight: 500,
              }}>
                {usia} tahun
              </span>
            )}
            {p.domisili_kota && (
              <span style={{
                padding: '3px 10px',
                borderRadius: 999,
                backgroundColor: T.bgGreen,
                fontSize: FONT.body,
                color: T.primary,
                fontWeight: 500,
              }}>
                {p.domisili_kota}
              </span>
            )}
            {p.status_pernikahan && (
              <span style={{
                padding: '3px 10px',
                borderRadius: 999,
                backgroundColor: T.gold,
                fontSize: FONT.body,
                color: '#FFFFFF',
                fontWeight: 600,
              }}>
                {STATUS_LABELS[p.status_pernikahan] ?? p.status_pernikahan}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tentang Saya */}
      {state.karakter.karakter_diri && (
        <>
          <PdfSectionTitle title="Tentang Saya" color={T.primary} accentColor={T.gold} />
          <p style={{
            fontSize: FONT.body + 1,
            lineHeight: 1.7,
            color: T.textMid,
            margin: '0 0 14px',
            textAlign: 'justify',
          }}>
            {state.karakter.karakter_diri}
          </p>
        </>
      )}

      {/* 2-Column: Data Pribadi + Keislaman */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <PdfSectionTitle title="Data Pribadi" color={T.primary} accentColor={T.gold} />
          <PdfInfoRow
            label="Tempat, Tanggal Lahir"
            value={formatTTL(p.tempat_lahir, p.tanggal_lahir)}
          />
          <PdfInfoRow label="Kewarganegaraan" value={p.kewarganegaraan} />
          <PdfInfoRow label="Suku Bangsa" value={p.suku_bangsa} />
          <PdfInfoRow label="Tinggi / Berat" value={
            state.fisikKesehatan.tinggi_badan && state.fisikKesehatan.berat_badan
              ? `${state.fisikKesehatan.tinggi_badan} cm / ${state.fisikKesehatan.berat_badan} kg`
              : undefined
          } />
        </div>
        <div style={{ flex: 1 }}>
          <PdfSectionTitle title="Keislaman" color={T.primary} accentColor={T.gold} />
          <PdfInfoRow label="Mazhab" value={state.ibadah.mazhab} />
          <PdfInfoRow
            label="Shalat Fardhu"
            value={SHALAT_LABELS[state.ibadah.shalat_fardhu] ?? state.ibadah.shalat_fardhu}
          />
          <PdfInfoRow label="Hafalan Qur'an" value={state.ibadah.hafalan_quran} />
          <PdfInfoRow label="Cara Berpakaian" value={state.ibadah.cara_berpakaian} />
        </div>
      </div>

      {/* Sosial Media */}
      {visibleSosmed.length > 0 && (
        <>
          <PdfOrnDivider color={T.gold} />
          <PdfSectionTitle title="Sosial Media" color={T.primary} accentColor={T.gold} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginBottom: 4 }}>
            {visibleSosmed.map((s) => (
              <span key={s.id} style={{ fontSize: FONT.body, color: T.textMid }}>
                <strong style={{ color: T.text }}>{s.platform}</strong>: {s.username}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Anggota Keluarga */}
      {state.anggotaKeluarga.length > 0 && (
        <>
          <PdfOrnDivider color={T.gold} />
          <PdfSectionTitle title="Anggota Keluarga" color={T.primary} accentColor={T.gold} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
            {state.anggotaKeluarga.map((anggota) => (
              <PdfFamilyCard
                key={anggota.id}
                hubungan={anggota.hubungan}
                nama={anggota.nama}
                pekerjaan={anggota.pekerjaan}
                pendidikan={anggota.pendidikan}
                accentColor={T.tertiary}
              />
            ))}
          </div>
        </>
      )}

      {/* Page Footer */}
      <PdfPageFooter
        nama={nama}
        pageNum={1}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF — DOKUMEN RAHASIA"
        pad={SPACING.pagePadPremium}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2 — Pendidikan + Pekerjaan + Organisasi (all with timeline)
// ═══════════════════════════════════════════════════════════════
function Page2({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <PdfPage bg={T.bg} pad={SPACING.pagePadPremium}>
      {/* Corner ornaments */}
      <PdfCornerOrnament position="top-left" color={T.gold} />
      <PdfCornerOrnament position="top-right" color={T.gold} />
      <PdfCornerOrnament position="bottom-left" color={T.gold} />
      <PdfCornerOrnament position="bottom-right" color={T.gold} />

      {/* Pendidikan */}
      {state.riwayatPendidikan.length > 0 && (
        <>
          <PdfSectionTitle title="Riwayat Pendidikan" color={T.primary} accentColor={T.gold} />
          <div style={{ marginBottom: 20 }}>
            {state.riwayatPendidikan.map((edu: RiwayatPendidikanItem, i: number) => (
              <PdfTimelineItem
                key={edu.id}
                year={
                  edu.tahun_selesai
                    ? String(edu.tahun_selesai)
                    : edu.tahun_mulai
                      ? `${edu.tahun_mulai}–`
                      : undefined
                }
                isLast={i === state.riwayatPendidikan.length - 1}
                dotColor={T.tertiary}
                lineColor={T.bgGreen}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                  {edu.jenjang}{edu.jurusan ? ` — ${edu.jurusan}` : ''}
                </p>
                <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                  {edu.nama_institusi} · {edu.tahun_mulai}–{edu.tahun_selesai}
                </p>
                {edu.prestasi && (
                  <p style={{ fontSize: FONT.body, color: T.secondary, marginTop: 3, fontStyle: 'italic' }}>
                    Prestasi: {edu.prestasi}
                  </p>
                )}
              </PdfTimelineItem>
            ))}
          </div>
        </>
      )}

      {/* Divider between Pendidikan & Pekerjaan */}
      {state.riwayatPendidikan.length > 0 && state.riwayatPekerjaan.length > 0 && (
        <PdfOrnDivider color={T.gold} />
      )}

      {/* Pekerjaan */}
      {state.riwayatPekerjaan.length > 0 && (
        <>
          <PdfSectionTitle title="Riwayat Pekerjaan" color={T.primary} accentColor={T.gold} />
          <div style={{ marginBottom: 20 }}>
            {state.riwayatPekerjaan.map((job: RiwayatPekerjaanItem, i: number) => (
              <PdfTimelineItem
                key={job.id}
                year={
                  job.is_masih_aktif
                    ? 'Kini'
                    : job.tahun_selesai
                      ? String(job.tahun_selesai)
                      : undefined
                }
                isLast={i === state.riwayatPekerjaan.length - 1}
                dotColor={T.gold}
                lineColor={T.bgGold}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                  {job.posisi_jabatan}
                  {job.is_masih_aktif && (
                    <span style={{
                      marginLeft: 6,
                      padding: '1px 6px',
                      borderRadius: 999,
                      backgroundColor: T.bgGreen,
                      color: T.primary,
                      fontSize: FONT.micro + 1,
                      fontWeight: 600,
                    }}>
                      Aktif
                    </span>
                  )}
                </p>
                <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                  {job.nama_perusahaan} · {job.tahun_mulai}–{job.is_masih_aktif ? 'sekarang' : job.tahun_selesai}
                </p>
                {job.deskripsi_pekerjaan && (
                  <p style={{ fontSize: FONT.body, color: T.textMid, marginTop: 4, lineHeight: 1.5 }}>
                    {job.deskripsi_pekerjaan}
                  </p>
                )}
              </PdfTimelineItem>
            ))}
          </div>
        </>
      )}

      {/* Divider between Pekerjaan & Organisasi */}
      {(state.riwayatPendidikan.length > 0 || state.riwayatPekerjaan.length > 0) &&
        state.riwayatOrganisasi.length > 0 && (
        <PdfOrnDivider color={T.gold} />
      )}

      {/* Organisasi */}
      {state.riwayatOrganisasi.length > 0 && (
        <>
          <PdfSectionTitle title="Riwayat Organisasi" color={T.primary} accentColor={T.gold} />
          <div>
            {state.riwayatOrganisasi.map((org: RiwayatOrganisasiItem, i: number) => (
              <PdfTimelineItem
                key={org.id}
                year={org.tahun_selesai ? String(org.tahun_selesai) : undefined}
                isLast={i === state.riwayatOrganisasi.length - 1}
                dotColor={T.secondary}
                lineColor={T.divider}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                  {org.jabatan || org.nama_organisasi}
                </p>
                <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                  {org.nama_organisasi}
                  {org.tahun_mulai && ` · ${org.tahun_mulai}${org.tahun_selesai ? `–${org.tahun_selesai}` : ''}`}
                </p>
                {org.deskripsi && (
                  <p style={{ fontSize: FONT.body, color: T.textMid, marginTop: 3, lineHeight: 1.5 }}>
                    {org.deskripsi}
                  </p>
                )}
              </PdfTimelineItem>
            ))}
          </div>
        </>
      )}

      {/* Page Footer */}
      <PdfPageFooter
        nama={nama}
        pageNum={2}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF — DOKUMEN RAHASIA"
        pad={SPACING.pagePadPremium}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 3 — Perjalanan Hidup (with PdfPhaseItem using FASE_COLORS)
// ═══════════════════════════════════════════════════════════════
function Page3({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'

  return (
    <PdfPage bg={T.bg} pad={SPACING.pagePadPremium}>
      {/* Corner ornaments */}
      <PdfCornerOrnament position="top-left" color={T.gold} />
      <PdfCornerOrnament position="top-right" color={T.gold} />
      <PdfCornerOrnament position="bottom-left" color={T.gold} />
      <PdfCornerOrnament position="bottom-right" color={T.gold} />

      {/* Ayat pembuka */}
      <div style={{
        backgroundColor: T.bgGreen,
        border: `1px solid ${T.accent}30`,
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 24,
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Amiri', Georgia, serif",
          fontSize: 14,
          color: T.gold,
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.8,
        }}>
          وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
        </p>
        <p style={{ fontSize: FONT.micro + 1, color: T.textSoft, marginTop: 4, fontStyle: 'italic' }}>
          &ldquo;Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu&rdquo; — QS Al-Baqarah: 216
        </p>
      </div>

      <PdfSectionTitle title="Perjalanan Hidup" color={T.primary} accentColor={T.gold} />

      <div>
        {state.perjalananHidup.map((item: PerjalananHidupItem, i: number) => (
          <PdfPhaseItem
            key={item.id}
            fase={item.fase}
            judul={item.judul}
            cerita={item.cerita}
            pelajaran={item.pelajaran}
            tahunMulai={item.tahun_mulai != null && item.tahun_mulai !== '' ? String(item.tahun_mulai) : undefined}
            tahunSelesai={item.tahun_selesai != null && item.tahun_selesai !== '' ? String(item.tahun_selesai) : undefined}
            isLast={i === state.perjalananHidup.length - 1}
          />
        ))}
      </div>

      {/* Page Footer */}
      <PdfPageFooter
        nama={nama}
        pageNum={3}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF — DOKUMEN RAHASIA"
        pad={SPACING.pagePadPremium}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 4 — Karakter + Ibadah (detailed) + Gaya Hidup
// ═══════════════════════════════════════════════════════════════
function Page4({ state }: { state: FormState }) {
  const nama   = state.dataPribadi.nama_lengkap || 'Nama'
  const k      = state.karakter
  const ibadah = state.ibadah
  const gl     = state.gayaHidup

  return (
    <PdfPage bg={T.bg} pad={SPACING.pagePadPremium}>
      {/* Corner ornaments */}
      <PdfCornerOrnament position="top-left" color={T.gold} />
      <PdfCornerOrnament position="top-right" color={T.gold} />
      <PdfCornerOrnament position="bottom-left" color={T.gold} />
      <PdfCornerOrnament position="bottom-right" color={T.gold} />

      {/* ── Karakter & Kepribadian ──────────────────────── */}
      <PdfSectionTitle title="Karakter & Kepribadian" color={T.primary} accentColor={T.gold} />

      {k.karakter_diri && (
        <p style={{ fontSize: FONT.body + 1, color: T.textMid, lineHeight: 1.6, marginBottom: 14 }}>
          {k.karakter_diri}
        </p>
      )}

      {/* Kelebihan + Kekurangan */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        {k.kelebihan.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: FONT.micro,
              fontWeight: 700,
              color: T.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}>
              Kelebihan
            </p>
            <div>
              {k.kelebihan.map((tag) => (
                <PdfTag key={tag} text={tag} variant="primary" />
              ))}
            </div>
          </div>
        )}
        {k.kekurangan.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: FONT.micro,
              fontWeight: 700,
              color: T.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}>
              Kekurangan
            </p>
            <div>
              {k.kekurangan.map((tag) => (
                <PdfTag key={tag} text={tag} variant="muted" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hobi + MBTI + Bahasa Cinta + Tipe */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 6 }}>
        {k.hobi.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: FONT.micro,
              fontWeight: 700,
              color: T.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}>
              Hobi & Minat
            </p>
            <div>
              {k.hobi.map((tag) => (
                <PdfTag key={tag} text={tag} variant="accent" />
              ))}
            </div>
          </div>
        )}
        <div style={{ width: 170, flexShrink: 0 }}>
          {k.mbti_type && <PdfInfoRow label="Tipe MBTI" value={k.mbti_type} />}
          {k.bahasa_cinta && (
            <PdfInfoRow
              label="Bahasa Cinta"
              value={k.bahasa_cinta.replace(/_/g, ' ')}
            />
          )}
          {gl.tipe_kepribadian && (
            <PdfInfoRow
              label="Tipe Kepribadian"
              value={TIPE_LABELS[gl.tipe_kepribadian] ?? gl.tipe_kepribadian}
            />
          )}
        </div>
      </div>

      <PdfOrnDivider color={T.gold} />

      {/* ── Ibadah & Keislaman (detailed) ────────────────── */}
      <PdfSectionTitle title="Ibadah & Keislaman" color={T.primary} accentColor={T.gold} />

      <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <PdfInfoRow label="Mazhab" value={ibadah.mazhab} />
          <PdfInfoRow label="Cara Berpakaian" value={ibadah.cara_berpakaian} />
          <PdfInfoRow
            label="Shalat Fardhu"
            value={SHALAT_LABELS[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu}
          />
          <PdfInfoRow label="Shalat Sunnah" value={ibadah.shalat_sunnah} />
        </div>
        <div style={{ flex: 1 }}>
          <PdfInfoRow label="Hafalan Qur'an" value={ibadah.hafalan_quran} />
          <PdfInfoRow
            label="Tilawah Rutin"
            value={ibadah.tilawah_rutin ? 'Ya' : 'Belum rutin'}
          />
          <PdfInfoRow
            label="Kajian Rutin"
            value={ibadah.kajian_rutin ? 'Ya' : 'Belum rutin'}
          />
        </div>
      </div>

      {ibadah.deskripsi_ibadah && (
        <div style={{
          backgroundColor: T.bgGreen,
          border: `1px solid ${T.accent}30`,
          borderRadius: 6,
          padding: '8px 12px',
          marginBottom: 6,
        }}>
          <p style={{ fontSize: FONT.body, color: T.primary, lineHeight: 1.6, margin: 0 }}>
            {ibadah.deskripsi_ibadah}
          </p>
        </div>
      )}

      <PdfOrnDivider color={T.gold} />

      {/* ── Gaya Hidup ──────────────────────────────────── */}
      <PdfSectionTitle title="Gaya Hidup" color={T.primary} accentColor={T.gold} />

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          {gl.gaya_hidup && <PdfInfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
          {gl.pola_makan && <PdfInfoRow label="Pola Makan" value={gl.pola_makan} />}
          <PdfInfoRow
            label="Olahraga Rutin"
            value={gl.olahraga_rutin ? 'Ya' : 'Belum rutin'}
          />
        </div>
        <div style={{ flex: 1 }}>
          {gl.kebiasaan_positif && (
            <PdfInfoRow label="Kebiasaan Positif" value={gl.kebiasaan_positif} />
          )}
          {gl.hal_tidak_disukai && (
            <PdfInfoRow label="Hal yang Tidak Disukai" value={gl.hal_tidak_disukai} />
          )}
        </div>
      </div>

      {/* Page Footer */}
      <PdfPageFooter
        nama={nama}
        pageNum={4}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF — DOKUMEN RAHASIA"
        pad={SPACING.pagePadPremium}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 5 — Visi & Misi + Kriteria + Financial
//           + Rencana Masa Depan + Pandangan Isu + Closing doa
// ═══════════════════════════════════════════════════════════════
function Page5({ state }: { state: FormState }) {
  const nama = state.dataPribadi.nama_lengkap || 'Nama'
  const vm   = state.visiMisi
  const kr   = state.kriteria
  const fp   = state.financialPlanning
  const pi   = state.pandanganIsu

  return (
    <PdfPage bg={T.bg} isLast pad={SPACING.pagePadPremium}>
      {/* Corner ornaments */}
      <PdfCornerOrnament position="top-left" color={T.gold} />
      <PdfCornerOrnament position="top-right" color={T.gold} />
      <PdfCornerOrnament position="bottom-left" color={T.gold} />
      <PdfCornerOrnament position="bottom-right" color={T.gold} />

      {/* ── Visi & Misi Pernikahan ──────────────────────── */}
      {(vm.visi || vm.misi_suami || vm.misi_istri) && (
        <>
          <PdfSectionTitle title="Visi & Misi Pernikahan" color={T.primary} accentColor={T.gold} />

          {vm.visi && (
            <div style={{
              backgroundColor: T.primary,
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 12,
            }}>
              <p style={{
                fontSize: FONT.micro,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                VISI
              </p>
              <p style={{
                fontSize: FONT.body + 1,
                color: '#FFFFFF',
                lineHeight: 1.7,
                margin: 0,
                fontStyle: 'italic',
              }}>
                &lsquo;{vm.visi}&rsquo;
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            {vm.misi_suami && (
              <div style={{
                flex: 1,
                backgroundColor: T.bgGold,
                border: `1px solid ${T.gold}30`,
                borderRadius: 6,
                padding: '8px 10px',
              }}>
                <p style={{
                  fontSize: FONT.micro,
                  fontWeight: 700,
                  color: T.goldDark,
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}>
                  Peran Suami
                </p>
                <p style={{ fontSize: FONT.body, color: T.text, lineHeight: 1.5, margin: 0 }}>
                  {vm.misi_suami}
                </p>
              </div>
            )}
            {vm.misi_istri && (
              <div style={{
                flex: 1,
                backgroundColor: T.bgGreen,
                border: `1px solid ${T.accent}30`,
                borderRadius: 6,
                padding: '8px 10px',
              }}>
                <p style={{
                  fontSize: FONT.micro,
                  fontWeight: 700,
                  color: T.secondary,
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}>
                  Peran Istri
                </p>
                <p style={{ fontSize: FONT.body, color: T.text, lineHeight: 1.5, margin: 0 }}>
                  {vm.misi_istri}
                </p>
              </div>
            )}
          </div>

          {vm.tujuan_pernikahan.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <p style={{
                fontSize: FONT.micro,
                fontWeight: 600,
                color: T.textMuted,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                Tujuan Pernikahan
              </p>
              <div>
                {vm.tujuan_pernikahan.map((t) => (
                  <PdfTag key={t} text={t} variant="primary" />
                ))}
              </div>
            </div>
          )}

          <PdfOrnDivider color={T.gold} />
        </>
      )}

      {/* ── Kriteria Pasangan + Financial (2 kolom) ──────── */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>

        {/* Kriteria */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PdfSectionTitle title="Kriteria Pasangan" color={T.primary} accentColor={T.gold} />
          {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
            <PdfInfoRow
              label="Usia"
              value={`${kr.kriteria_usia_min || '?'} – ${kr.kriteria_usia_max || '?'} tahun`}
            />
          )}
          <PdfInfoRow label="Domisili" value={kr.kriteria_domisili} />
          <PdfInfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
          <PdfInfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
          <PdfInfoRow label="Karakter" value={kr.kriteria_karakter} />
          <PdfInfoRow label="Ibadah" value={kr.kriteria_ibadah} />
          {kr.bersedia_poligami !== null && (
            <PdfInfoRow
              label="Bersedia Poligami"
              value={kr.bersedia_poligami ? 'Ya' : 'Tidak'}
            />
          )}
          {kr.bersedia_pindah_domisili !== null && (
            <PdfInfoRow
              label="Bersedia Pindah Domisili"
              value={kr.bersedia_pindah_domisili ? 'Ya' : 'Tidak'}
            />
          )}
          {kr.kriteria_lainnya && (
            <PdfInfoRow label="Lainnya" value={kr.kriteria_lainnya} />
          )}
        </div>

        {/* Financial Planning */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PdfSectionTitle title="Financial Planning" color={T.primary} accentColor={T.gold} />

          {fp.penghasilan_range && (
            <div style={{
              backgroundColor: T.bgGreen,
              border: `1px solid ${T.accent}30`,
              borderRadius: 6,
              padding: '6px 10px',
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: FONT.micro,
                color: T.textMuted,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                Rentang Penghasilan
              </span>
              <p style={{
                fontSize: FONT.subheading + 1,
                fontWeight: 700,
                color: T.primary,
                margin: '2px 0 0',
              }}>
                {fp.penghasilan_range}
              </p>
            </div>
          )}

          <p style={{
            fontSize: FONT.micro,
            fontWeight: 700,
            color: T.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}>
            Alokasi Keuangan
          </p>

          <PdfFinancialBar label="Kebutuhan Pokok" persen={fp.kebutuhan_pokok_persen} color={FINANCIAL_COLORS.pokok} />
          <PdfFinancialBar label="Tabungan"        persen={fp.tabungan_persen}         color={FINANCIAL_COLORS.tabungan} />
          <PdfFinancialBar label="Investasi"       persen={fp.investasi_persen}        color={FINANCIAL_COLORS.investasi} />
          <PdfFinancialBar label="Sedekah / Zakat" persen={fp.sedekah_persen}          color={FINANCIAL_COLORS.sedekah} />
          <PdfFinancialBar label="Lainnya"         persen={fp.lainnya_persen}          color={FINANCIAL_COLORS.lainnya} />

          {fp.deskripsi && (
            <p style={{ fontSize: FONT.body, color: T.textMid, lineHeight: 1.5, marginTop: 8, fontStyle: 'italic' }}>
              {fp.deskripsi}
            </p>
          )}
        </div>
      </div>

      {/* ── Rencana Masa Depan ───────────────────────────── */}
      {state.rencanaMasaDepan.length > 0 && (
        <>
          <PdfOrnDivider color={T.gold} />
          <PdfSectionTitle title="Rencana Masa Depan" color={T.primary} accentColor={T.gold} />
          <div>
            {state.rencanaMasaDepan.map((item, i: number) => (
              <div key={item.id} style={{
                display: 'flex',
                gap: 12,
                paddingBottom: i === state.rencanaMasaDepan.length - 1 ? 0 : 14,
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 50,
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: 8,
                    padding: '2px 6px',
                    borderRadius: 4,
                    backgroundColor: item.tipe === 'pendek' ? T.bgGold : T.bgGreen,
                    color: item.tipe === 'pendek' ? T.goldDark : T.primary,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {item.tipe === 'pendek' ? 'J. Pendek' : 'J. Panjang'}
                  </span>
                  <div style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: item.tipe === 'pendek' ? T.gold : T.tertiary,
                    marginTop: 4,
                  }} />
                  {i < state.rencanaMasaDepan.length - 1 && (
                    <div style={{ width: 1, flex: 1, backgroundColor: T.dividerAlt, marginTop: 3 }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>
                      {item.rencana}
                    </p>
                    {item.waktu && (
                      <span style={{ fontSize: FONT.micro, color: T.textSoft, flexShrink: 0, marginLeft: 8 }}>
                        {item.waktu}
                      </span>
                    )}
                  </div>
                  {item.target && (
                    <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0', lineHeight: 1.5 }}>
                      Target: {item.target}
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
          <PdfOrnDivider color={T.gold} />
          <PdfSectionTitle title="Pandangan tentang Pernikahan" color={T.primary} accentColor={T.gold} />
          <p style={{ fontSize: FONT.body, color: T.textMid, lineHeight: 1.6, marginBottom: 4 }}>
            {pi.pandangan_isu}
          </p>
        </>
      )}

      {/* ── Penutup doa ────────────────────────────────── */}
      <div style={{
        marginTop: 24,
        backgroundColor: T.primary,
        borderRadius: 8,
        padding: '14px 20px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Amiri', Georgia, serif",
          fontSize: 16,
          color: T.goldLight,
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.8,
        }}>
          رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
        </p>
        <p style={{
          fontSize: FONT.micro + 1,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 6,
          fontStyle: 'italic',
        }}>
          &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami istri-istri dan keturunan kami sebagai penyenang hati&rdquo; — QS Al-Furqan: 74
        </p>
        <p style={{
          fontSize: FONT.micro,
          color: 'rgba(255,255,255,0.25)',
          marginTop: 10,
          letterSpacing: '0.05em',
        }}>
          DIBUAT DENGAN TAARUFCV · DOKUMEN RAHASIA
        </p>
      </div>

      {/* Page Footer */}
      <PdfPageFooter
        nama={nama}
        pageNum={5}
        totalPages={TOTAL_PAGES}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF — DOKUMEN RAHASIA"
        pad={SPACING.pagePadPremium}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// Main Export
// ═══════════════════════════════════════════════════════════════
export function TemplateElegantIslamic({ state }: { state: FormState }) {
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
      <Page5 state={state} />
    </div>
  )
}