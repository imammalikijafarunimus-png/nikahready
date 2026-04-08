// ============================================================
// src/components/templates/TemplateSederhana.tsx
//
// Template CV Taaruf -- Gaya Sederhana (FREE -- 2 Halaman)
// Theme: Sage Green + Navy + Gold (THEME_SAGE from pdf-tokens)
//
// PDF-SAFE RULES:
// - Every page: width 794px, min-height 1123px, overflow hidden
// - Colors: hex literals in inline styles only
// - No CSS vars, no Tailwind, no position fixed/sticky
// - Font: Inter (body), Amiri (Arabic)
// - No emojis -- shapes and text only
// - Root div id="taaruf-template"
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
  THEME_SAGE,
  SHALAT_LABELS,
  TIPE_LABELS,
  STATUS_LABELS,
  hitungUsia,
  formatTTL,
} from '@/lib/pdf-tokens'

import {
  PdfPage,
  PdfSectionHeading,
  PdfInfoRow,
  PdfTag,
  PdfPhotoPlaceholder,
  PdfPageFooter,
  PdfDivider,
  PdfTimelineItem,
} from '@/lib/pdf-shared-components'

// ── Shorthand for theme colors ───────────────────────────────
const T = THEME_SAGE

// ═══════════════════════════════════════════════════════════════
// PAGE 1: Cover + Biodata + Pendidikan + Pekerjaan
// ═══════════════════════════════════════════════════════════════
function Page1({ state }: { state: FormState }) {
  const p = state.dataPribadi
  const f = state.fisikKesehatan
  const nama = p.nama_lengkap || 'Nama Lengkap'
  const usia = hitungUsia(p.tanggal_lahir)

  const pad = SPACING.pagePad

  return (
    <PdfPage bg={T.bg} pad={0}>
      {/* ── Cover Section (sage-900 bg) ────────────────────── */}
      <div
        style={{
          backgroundColor: T.primary,
          padding: `${pad}px ${pad}px 28px`,
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
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

        {/* Bismillah */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p
            style={{
              fontFamily: "'Amiri', Georgia, serif",
              fontSize: 20,
              color: T.accentGoldAlt,
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

        {/* Foto + Nama + Chips */}
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
                  border: `3px solid ${T.accentGold}`,
                  display: 'block',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <PdfPhotoPlaceholder
                width={100}
                height={120}
                borderRadius={8}
                borderColor={T.accentGold}
                bg="rgba(255,255,255,0.08)"
                label="Foto Profil"
              />
            )}
          </div>

          {/* Nama + info utama */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#FFFFFF',
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

            {/* Chips: usia, domisili, status */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {usia && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 10, color: '#FFFFFF', fontWeight: 500,
                }}>
                  {usia} tahun
                </span>
              )}
              {p.domisili_kota && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  fontSize: 10, color: '#FFFFFF', fontWeight: 500,
                }}>
                  {p.domisili_kota}{p.domisili_provinsi ? `, ${p.domisili_provinsi}` : ''}
                </span>
              )}
              {p.status_pernikahan && (
                <span style={{
                  padding: '3px 10px', borderRadius: 999,
                  backgroundColor: T.accentGold,
                  fontSize: 10, color: '#FFFFFF', fontWeight: 600,
                }}>
                  {STATUS_LABELS[p.status_pernikahan] ?? p.status_pernikahan}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body (white) ────────────────────────────────────── */}
      <div style={{ padding: `20px ${pad}px 40px` }}>

        {/* Data Pribadi + Fisik & Kesehatan (2 kolom) */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Kolom kiri: Data Pribadi */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <PdfSectionHeading
              title="Data Pribadi"
              color={T.primary}
              accentColor={T.accentGold}
            />
            <PdfInfoRow label="Nama Lengkap" value={p.nama_lengkap} />
            <PdfInfoRow
              label="Tempat, Tanggal Lahir"
              value={formatTTL(p.tempat_lahir, p.tanggal_lahir)}
            />
            <PdfInfoRow label="Kewarganegaraan" value={p.kewarganegaraan} />
            <PdfInfoRow label="Suku Bangsa" value={p.suku_bangsa} />
            <PdfInfoRow label="Domisili" value={[p.domisili_kota, p.domisili_provinsi].filter(Boolean).join(', ')} />
            <PdfInfoRow label="Status Pernikahan" value={STATUS_LABELS[p.status_pernikahan ?? ''] ?? ''} />
            {p.jumlah_anak > 0 && (
              <PdfInfoRow label="Jumlah Anak" value={`${p.jumlah_anak} anak`} />
            )}
          </div>

          {/* Kolom kanan: Fisik & Kesehatan */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <PdfSectionHeading
              title="Fisik & Kesehatan"
              color={T.primary}
              accentColor={T.accentGold}
            />
            {f.tinggi_badan && f.berat_badan && (
              <PdfInfoRow label="Tinggi / Berat" value={`${f.tinggi_badan} cm / ${f.berat_badan} kg`} />
            )}
            <PdfInfoRow label="Golongan Darah" value={f.golongan_darah || null} />
            <PdfInfoRow label="Warna Kulit" value={f.warna_kulit} />
            {f.kondisi_kesehatan && (
              <PdfInfoRow label="Kondisi Kesehatan" value={f.kondisi_kesehatan} />
            )}
            {f.riwayat_penyakit && (
              <PdfInfoRow label="Riwayat Penyakit" value={f.riwayat_penyakit} />
            )}
            {f.kebutuhan_khusus && (
              <PdfInfoRow label="Kebutuhan Khusus" value={f.kebutuhan_khusus} />
            )}
          </div>
        </div>

        <PdfDivider color={T.divider} />

        {/* Riwayat Pendidikan (timeline) */}
        {state.riwayatPendidikan.length > 0 && (
          <>
            <PdfSectionHeading
              title="Riwayat Pendidikan"
              color={T.primary}
              accentColor={T.accentGold}
            />
            <div style={{ marginBottom: SPACING.sectionGap }}>
              {state.riwayatPendidikan.map((item: RiwayatPendidikanItem, i: number) => (
                <PdfTimelineItem
                  key={item.id}
                  year={
                    item.tahun_selesai
                      ? String(item.tahun_selesai)
                      : item.tahun_mulai
                        ? `${item.tahun_mulai}\u2013`
                        : undefined
                  }
                  dotColor={T.accent}
                  lineColor="#D1FAE5"
                  isLast={i === state.riwayatPendidikan.length - 1}
                >
                  <p style={{ fontSize: FONT.body + 2, fontWeight: 700, color: T.text, margin: 0 }}>
                    {item.jenjang} {item.jurusan ? `\u2014 ${item.jurusan}` : ''}
                  </p>
                  <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                    {item.nama_institusi}
                    {item.tahun_mulai && item.tahun_selesai
                      ? ` \u00b7 ${item.tahun_mulai}\u2013${item.tahun_selesai}`
                      : ''}
                  </p>
                  {item.prestasi && (
                    <p style={{ fontSize: FONT.body, color: T.secondary, marginTop: 3, fontStyle: 'italic' }}>
                      {item.prestasi}
                    </p>
                  )}
                </PdfTimelineItem>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        {state.riwayatPendidikan.length > 0 && state.riwayatPekerjaan.length > 0 && (
          <PdfDivider color={T.divider} margin="0 0 16px" />
        )}

        {/* Riwayat Pekerjaan (timeline) */}
        {state.riwayatPekerjaan.length > 0 && (
          <>
            <PdfSectionHeading
              title="Riwayat Pekerjaan"
              color={T.primary}
              accentColor={T.accentGold}
            />
            <div>
              {state.riwayatPekerjaan.map((item: RiwayatPekerjaanItem, i: number) => (
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
                  lineColor="#D1FAE5"
                  isLast={i === state.riwayatPekerjaan.length - 1}
                >
                  <p style={{ fontSize: FONT.body + 2, fontWeight: 700, color: T.text, margin: 0 }}>
                    {item.posisi_jabatan}
                    {item.is_masih_aktif && (
                      <span style={{
                        marginLeft: 6, padding: '1px 6px', borderRadius: 999,
                        backgroundColor: '#D1FAE5', color: T.secondary,
                        fontSize: FONT.micro + 1, fontWeight: 600,
                      }}>
                        Aktif
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: FONT.body, color: T.textMid, margin: '2px 0 0' }}>
                    {item.nama_perusahaan}
                    {item.tahun_mulai
                      ? ` \u00b7 ${item.tahun_mulai}${item.is_masih_aktif ? ' \u2013 sekarang' : item.tahun_selesai ? ` \u2013 ${item.tahun_selesai}` : ''}`
                      : ''}
                  </p>
                  {item.deskripsi_pekerjaan && (
                    <p style={{ fontSize: FONT.body, color: T.textMid, marginTop: 4, lineHeight: 1.5 }}>
                      {item.deskripsi_pekerjaan}
                    </p>
                  )}
                </PdfTimelineItem>
              ))}
            </div>
          </>
        )}
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={1}
        totalPages={2}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF -- DOKUMEN RAHASIA"
        pad={pad}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2: Karakter + Ibadah + Gaya Hidup + Visi + Kriteria + Doa
// ═══════════════════════════════════════════════════════════════
function Page2({ state }: { state: FormState }) {
  const nama   = state.dataPribadi.nama_lengkap || 'Nama'
  const k      = state.karakter
  const ibadah = state.ibadah
  const gl     = state.gayaHidup
  const vm     = state.visiMisi
  const kr     = state.kriteria

  return (
    <PdfPage bg={T.bg} isLast pad={SPACING.pagePad}>

      {/* ── Karakter & Kepribadian ────────────────────────── */}
      <PdfSectionHeading
        title="Karakter & Kepribadian"
        color={T.primary}
        accentColor={T.accentGold}
      />

      {k.karakter_diri && (
        <p style={{ fontSize: FONT.body + 1, color: T.textMid, lineHeight: 1.6, marginBottom: 12 }}>
          {k.karakter_diri}
        </p>
      )}

      {/* Kelebihan + Kekurangan (2 tag groups) */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        {k.kelebihan.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: FONT.micro + 1, fontWeight: 700, color: T.textSoft,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
            }}>
              Kelebihan
            </p>
            <div>
              {k.kelebihan.map((tag) => (
                <PdfTag key={tag} text={tag} variant="muted" />
              ))}
            </div>
          </div>
        )}
        {k.kekurangan.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: FONT.micro + 1, fontWeight: 700, color: T.textSoft,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
            }}>
              Kekurangan
            </p>
            <div>
              {k.kekurangan.map((tag) => (
                <PdfTag key={tag} text={tag} variant="primary" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hobi + MBTI row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
        {k.hobi.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: FONT.micro + 1, fontWeight: 700, color: T.textSoft,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
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
        <div style={{ width: 160, flexShrink: 0 }}>
          {k.mbti_type && <PdfInfoRow label="Tipe MBTI" value={k.mbti_type} />}
          {gl.tipe_kepribadian && (
            <PdfInfoRow
              label="Tipe Kepribadian"
              value={TIPE_LABELS[gl.tipe_kepribadian] ?? gl.tipe_kepribadian}
            />
          )}
        </div>
      </div>

      <PdfDivider color={T.divider} margin="14px 0" />

      {/* ── Ibadah & Keislaman (2 kolom) ─────────────────── */}
      <PdfSectionHeading
        title="Ibadah & Keislaman"
        color={T.primary}
        accentColor={T.accentGold}
      />

      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <PdfInfoRow label="Mazhab" value={ibadah.mazhab} />
          <PdfInfoRow label="Cara Berpakaian" value={ibadah.cara_berpakaian} />
          <PdfInfoRow label="Shalat Fardhu" value={SHALAT_LABELS[ibadah.shalat_fardhu] ?? ibadah.shalat_fardhu} />
          <PdfInfoRow label="Shalat Sunnah" value={ibadah.shalat_sunnah} />
        </div>
        <div style={{ flex: 1 }}>
          <PdfInfoRow label="Hafalan Qur'an" value={ibadah.hafalan_quran} />
          <PdfInfoRow label="Tilawah Rutin" value={ibadah.tilawah_rutin ? 'Ya' : 'Belum rutin'} />
          <PdfInfoRow label="Kajian Rutin" value={ibadah.kajian_rutin ? 'Ya' : 'Belum rutin'} />
        </div>
      </div>

      <PdfDivider color={T.divider} margin="8px 0 14px" />

      {/* ── Gaya Hidup ───────────────────────────────────── */}
      <PdfSectionHeading
        title="Gaya Hidup"
        color={T.primary}
        accentColor={T.accentGold}
      />

      <div style={{ display: 'flex', gap: 24, marginBottom: 4 }}>
        <div style={{ flex: 1 }}>
          {gl.gaya_hidup && <PdfInfoRow label="Gaya Hidup" value={gl.gaya_hidup} />}
          {gl.pola_makan && <PdfInfoRow label="Pola Makan" value={gl.pola_makan} />}
          <PdfInfoRow label="Olahraga Rutin" value={gl.olahraga_rutin ? 'Ya' : 'Belum rutin'} />
        </div>
        <div style={{ flex: 1 }}>
          {gl.kebiasaan_positif && <PdfInfoRow label="Kebiasaan Positif" value={gl.kebiasaan_positif} />}
          {gl.hal_tidak_disukai && <PdfInfoRow label="Hal yang Tidak Disukai" value={gl.hal_tidak_disukai} />}
        </div>
      </div>

      <PdfDivider color={T.divider} margin="14px 0" />

      {/* ── Visi Pernikahan (card) ───────────────────────── */}
      {(vm.visi || vm.misi_suami || vm.misi_istri) && (
        <>
          <PdfSectionHeading
            title="Visi & Misi Pernikahan"
            color={T.primary}
            accentColor={T.accentGold}
          />

          {vm.visi && (
            <div style={{
              backgroundColor: T.primary,
              borderRadius: 8, padding: '10px 14px', marginBottom: 10,
            }}>
              <p style={{ fontSize: FONT.micro + 1, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>
                VISI
              </p>
              <p style={{ fontSize: FONT.body + 1, color: '#FFFFFF', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                &lsquo;{vm.visi}&rsquo;
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            {vm.misi_suami && (
              <div style={{ flex: 1, backgroundColor: T.bgAlt, borderRadius: 6, padding: '8px 10px' }}>
                <p style={{ fontSize: FONT.micro + 1, fontWeight: 700, color: T.navyMid, textTransform: 'uppercase', marginBottom: 3 }}>Peran Suami</p>
                <p style={{ fontSize: FONT.body, color: T.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_suami}</p>
              </div>
            )}
            {vm.misi_istri && (
              <div style={{ flex: 1, backgroundColor: T.bgAltGold, borderRadius: 6, padding: '8px 10px' }}>
                <p style={{ fontSize: FONT.micro + 1, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', marginBottom: 3 }}>Peran Istri</p>
                <p style={{ fontSize: FONT.body, color: T.text, lineHeight: 1.5, margin: 0 }}>{vm.misi_istri}</p>
              </div>
            )}
          </div>

          {vm.tujuan_pernikahan.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <p style={{ fontSize: FONT.micro + 1, fontWeight: 600, color: T.textSoft, textTransform: 'uppercase', marginBottom: 4 }}>
                Tujuan Pernikahan
              </p>
              <div>
                {vm.tujuan_pernikahan.map((t) => (
                  <PdfTag key={t} text={t} variant="muted" />
                ))}
              </div>
            </div>
          )}

          <PdfDivider color={T.divider} margin="12px 0" />
        </>
      )}

      {/* ── Kriteria Pasangan ─────────────────────────────── */}
      <PdfSectionHeading
        title="Kriteria Pasangan"
        color={T.primary}
        accentColor={T.accentGold}
      />

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          {(kr.kriteria_usia_min || kr.kriteria_usia_max) && (
            <PdfInfoRow
              label="Usia"
              value={`${kr.kriteria_usia_min || '?'} \u2013 ${kr.kriteria_usia_max || '?'} tahun`}
            />
          )}
          <PdfInfoRow label="Domisili" value={kr.kriteria_domisili} />
          <PdfInfoRow label="Pendidikan" value={kr.kriteria_pendidikan} />
        </div>
        <div style={{ flex: 1 }}>
          <PdfInfoRow label="Pekerjaan" value={kr.kriteria_pekerjaan} />
          <PdfInfoRow label="Karakter" value={kr.kriteria_karakter} />
          <PdfInfoRow label="Ibadah" value={kr.kriteria_ibadah} />
          {kr.kriteria_lainnya && (
            <PdfInfoRow label="Lainnya" value={kr.kriteria_lainnya} />
          )}
        </div>
      </div>

      {/* ── Arabic Closing Doa ────────────────────────────── */}
      <div style={{
        marginTop: 20,
        backgroundColor: T.primary,
        borderRadius: 8,
        padding: '14px 20px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'Amiri', Georgia, serif", fontSize: 16, color: T.accentGoldAlt, direction: 'rtl', margin: 0, lineHeight: 1.8 }}>
          رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
        </p>
        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontStyle: 'italic' }}>
          &ldquo;Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan yang menjadi penyejuk mata, dan jadikanlah kami imam bagi orang-orang yang bertakwa.&rdquo; &mdash; QS Al-Furqan: 74
        </p>
      </div>

      <PdfPageFooter
        nama={nama}
        pageNum={2}
        totalPages={2}
        footerBg={T.footerBg}
        footerText={T.footerText}
        footerTextStrong={T.footerTextStrong}
        brandText="CV TAARUF -- DOKUMEN RAHASIA"
        pad={SPACING.pagePad}
      />
    </PdfPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT -- TemplateSederhana
// ═══════════════════════════════════════════════════════════════
export function TemplateSederhana({ state }: { state: FormState }) {
  return (
    <div id="taaruf-template" style={{ lineHeight: 1 }}>
      <Page1 state={state} />
      <Page2 state={state} />
    </div>
  )
}