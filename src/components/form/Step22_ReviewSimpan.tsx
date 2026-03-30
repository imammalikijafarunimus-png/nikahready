'use client'

// ============================================================
// src/components/form/Step22_ReviewSimpan.tsx
// Step 22 (form step): Review & Simpan
// Langkah terakhir — menampilkan ringkasan seluruh data form
// dengan indikator kelengkapan, dan tombol simpan final.
// ============================================================

import { useMemo, useState } from 'react'
import { useFormState } from '@/context/FormContext'
import { SectionCard } from '@/components/ui/FormFields'

// ── Helper: cek apakah object punya data bermakna ────────────
function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every((v) =>
    v === '' ||
    v === null ||
    v === undefined ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'number' && v === 0)
  )
}

// ── Helper: truncasi string ──────────────────────────────────
function truncate(str: string, max: number = 50): string {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

// ── Definisi langkah review ──────────────────────────────────
interface ReviewStep {
  step: number
  title: string
  icon: string
  filled: boolean
  summary: string
}

// ── Main Component ────────────────────────────────────────────
export function Step22_ReviewSimpan() {
  const state = useFormState()
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  // Hitung ringkasan tiap langkah
  const reviewSteps = useMemo<ReviewStep[]>(() => {
    const s = state

    return [
      {
        step: 1,
        title: 'Data Pribadi',
        icon: '👤',
        filled: !isEmpty(s.dataPribadi as unknown as Record<string, unknown>),
        summary: s.dataPribadi.nama_lengkap
          ? `${s.dataPribadi.nama_lengkap}${s.dataPribadi.domisili_kota ? ' — ' + s.dataPribadi.domisili_kota : ''}`
          : '—',
      },
      {
        step: 2,
        title: 'Fisik & Kesehatan',
        icon: '💪',
        filled: !isEmpty(s.fisikKesehatan as unknown as Record<string, unknown>),
        summary: s.fisikKesehatan.tinggi_badan
          ? `Tinggi: ${s.fisikKesehatan.tinggi_badan} cm${s.fisikKesehatan.golongan_darah ? ', Gol. Darah: ' + s.fisikKesehatan.golongan_darah : ''}`
          : '—',
      },
      {
        step: 3,
        title: 'Riwayat Pendidikan',
        icon: '🎓',
        filled: s.riwayatPendidikan.length > 0,
        summary: s.riwayatPendidikan.length > 0
          ? `${s.riwayatPendidikan.length} pendidikan — ${truncate(s.riwayatPendidikan.map((r) => `${r.jenjang} ${r.nama_institusi}`).join(', '), 60)}`
          : '—',
      },
      {
        step: 4,
        title: 'Riwayat Pekerjaan',
        icon: '💼',
        filled: s.riwayatPekerjaan.length > 0,
        summary: s.riwayatPekerjaan.length > 0
          ? `${s.riwayatPekerjaan.length} pekerjaan — ${truncate(s.riwayatPekerjaan.map((r) => `${r.posisi_jabatan} at ${r.nama_perusahaan}`).join(', '), 60)}`
          : '—',
      },
      {
        step: 5,
        title: 'Perjalanan Hidup',
        icon: '🛤️',
        filled: s.perjalananHidup.length > 0,
        summary: s.perjalananHidup.length > 0
          ? `${s.perjalananHidup.length} cerita`
          : '—',
      },
      {
        step: 6,
        title: 'Riwayat Organisasi',
        icon: '🤝',
        filled: s.riwayatOrganisasi.length > 0,
        summary: s.riwayatOrganisasi.length > 0
          ? `${s.riwayatOrganisasi.length} organisasi`
          : '—',
      },
      {
        step: 7,
        title: 'Karakter & Kepribadian',
        icon: '✨',
        filled: !isEmpty(s.karakter as unknown as Record<string, unknown>),
        summary: s.karakter.mbti_type
          ? `MBTI: ${s.karakter.mbti_type}${s.karakter.hobi.length > 0 ? ', Hobi: ' + s.karakter.hobi.slice(0, 3).join(', ') : ''}`
          : '—',
      },
      {
        step: 8,
        title: 'Ibadah & Keislaman',
        icon: '🕌',
        filled: !isEmpty(s.ibadah as unknown as Record<string, unknown>),
        summary: s.ibadah.mazhab
          ? `Mazhab: ${s.ibadah.mazhab}${s.ibadah.shalat_fardhu ? ', Shalat: ' + s.ibadah.shalat_fardhu.replace(/_/g, ' ') : ''}`
          : '—',
      },
      {
        step: 9,
        title: 'Gaya Hidup',
        icon: '🌱',
        filled: !isEmpty(s.gayaHidup as unknown as Record<string, unknown>),
        summary: s.gayaHidup.tipe_kepribadian
          ? `Tipe: ${s.gayaHidup.tipe_kepribadian}`
          : '—',
      },
      {
        step: 10,
        title: 'Visi & Misi Pernikahan',
        icon: '🌟',
        filled: !isEmpty(s.visiMisi as unknown as Record<string, unknown>),
        summary: s.visiMisi.visi
          ? truncate(s.visiMisi.visi, 80)
          : '—',
      },
      {
        step: 11,
        title: 'Kriteria Pasangan',
        icon: '💍',
        filled: !isEmpty(s.kriteria as unknown as Record<string, unknown>),
        summary: s.kriteria.kriteria_usia_min
          ? `Usia: ${s.kriteria.kriteria_usia_min}${s.kriteria.kriteria_usia_max ? ' - ' + s.kriteria.kriteria_usia_max : '+'} tahun`
          : '—',
      },
      {
        step: 12,
        title: 'Financial Planning',
        icon: '💰',
        filled: !isEmpty(s.financialPlanning as unknown as Record<string, unknown>),
        summary: s.financialPlanning.penghasilan_range
          ? `Penghasilan: ${s.financialPlanning.penghasilan_range}`
          : '—',
      },
      {
        step: 13,
        title: 'Pandangan Isu',
        icon: '💬',
        filled: !isEmpty(s.pandanganIsu as unknown as Record<string, unknown>),
        summary: s.pandanganIsu.pandangan_isu
          ? truncate(s.pandanganIsu.pandangan_isu, 80)
          : '—',
      },
      {
        step: 14,
        title: 'Anggota Keluarga',
        icon: '👨‍👩‍👧‍👦',
        filled: s.anggotaKeluarga.length > 0,
        summary: s.anggotaKeluarga.length > 0
          ? `${s.anggotaKeluarga.length} anggota`
          : '—',
      },
      {
        step: 15,
        title: 'Rencana Masa Depan',
        icon: '🗓️',
        filled: s.rencanaMasaDepan.length > 0,
        summary: s.rencanaMasaDepan.length > 0
          ? `${s.rencanaMasaDepan.length} rencana`
          : '—',
      },
      {
        step: 16,
        title: 'Sosial Media',
        icon: '📱',
        filled: s.sosialMedia.length > 0,
        summary: s.sosialMedia.length > 0
          ? `${s.sosialMedia.length} akun — ${truncate(s.sosialMedia.map((sm) => `${sm.platform}: ${sm.username}`).join(', '), 60)}`
          : '—',
      },
      {
        step: 17,
        title: 'Galeri Foto',
        icon: '📸',
        filled: s.galeriFoto.length > 0,
        summary: s.galeriFoto.length > 0
          ? `${s.galeriFoto.length} foto`
          : '—',
      },
      {
        step: 18,
        title: 'Foto & Template',
        icon: '🎨',
        filled: !!(s.fotoTemplate.foto_pribadi_url || s.fotoTemplate.template_pilihan),
        summary: s.fotoTemplate.template_pilihan
          ? `Template: ${s.fotoTemplate.template_pilihan.replace(/_/g, ' ')}${s.fotoTemplate.foto_pribadi_url ? ' (foto diunggah)' : ''}`
          : '—',
      },
    ]
  }, [state])

  const filledCount = reviewSteps.filter((r) => r.filled).length
  const totalCount = reviewSteps.length
  const percentComplete = Math.round((filledCount / totalCount) * 100)
  const isMostlyComplete = filledCount >= Math.ceil(totalCount * 0.7)

  // Template yang dipilih
  const selectedTemplate = state.fotoTemplate.template_pilihan

  return (
    <div className="space-y-4">
      {/* ── Pembuka: Completion Ceremony ──────────────────── */}
      <div className="text-center py-4">
        <div className="text-5xl mb-3" role="img" aria-hidden="true">
          {isMostlyComplete ? '🎉' : '📝'}
        </div>
        <h2 className="text-lg font-bold text-white">
          {isMostlyComplete
            ? 'Lembar Taarufmu Sudah Hampir Siap!'
            : 'Periksa Kembali Datamu'}
        </h2>
        <p className="text-sm text-navy-400 mt-1">
          {isMostlyComplete
            ? 'Alhamdulillah, kamu sudah mengisi sebagian besar langkah. Review sekilas sebelum menyimpan.'
            : 'Beberapa langkah masih kosong. Kamu tetap bisa menyimpan dan melengkapi nanti.'}
        </p>
      </div>

      {/* ── Progress Bar Besar ─────────────────────────────── */}
      <SectionCard>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-200">Kelengkapan Profil</span>
            <span className="text-lg font-bold text-sage-400">{filledCount}/{totalCount}</span>
          </div>

          <div className="w-full bg-navy-800 rounded-full h-3">
            <div
              className={[
                'h-3 rounded-full transition-all duration-700 ease-out',
                isMostlyComplete
                  ? 'bg-gradient-to-r from-sage-600 to-sage-400'
                  : 'bg-gradient-to-r from-gold-600 to-gold-500',
              ].join(' ')}
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <p className="text-xs text-navy-500 text-center">
            {isMostlyComplete
              ? `Masyaallah! ${percentComplete}% langkah sudah diisi. Kamu siap menyimpan! 🌟`
              : `${percentComplete}% langkah sudah diisi. Lengkapi untuk profil yang lebih optimal.`}
          </p>
        </div>
      </SectionCard>

      {/* ── Template Info ──────────────────────────────────── */}
      <SectionCard title="Template CV Pilihan" icon="🎨">
        <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📄</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white capitalize">
              {selectedTemplate.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-navy-500">
              {selectedTemplate === 'akademik'
                ? 'Template gratis — formal dan clean'
                : 'Template premium — tersedia untuk NikahReady Pro'}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ── Daftar Review Step ─────────────────────────────── */}
      <SectionCard title="Ringkasan Per Langkah" icon="📋">
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {reviewSteps.map((rs) => (
            <button
              key={rs.step}
              type="button"
              onClick={() => setExpandedStep(expandedStep === rs.step ? null : rs.step)}
              className={[
                'w-full text-left p-3 rounded-xl border transition-all duration-200',
                rs.filled
                  ? 'border-navy-700 bg-navy-800/40 hover:border-sage-700'
                  : 'border-navy-800/50 bg-navy-900/30 hover:border-navy-600',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                {/* Status indicator */}
                <span
                  className={[
                    'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    rs.filled
                      ? 'bg-sage-900/60 border border-sage-600 text-sage-400'
                      : 'bg-navy-800 border border-navy-700 text-navy-500',
                  ].join(' ')}
                >
                  {rs.filled ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    rs.step
                  )}
                </span>

                {/* Icon + Title */}
                <span className="text-base flex-shrink-0">{rs.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${rs.filled ? 'text-white' : 'text-navy-400'}`}>
                    {rs.title}
                  </p>
                  {expandedStep === rs.step && (
                    <p className="text-xs text-navy-400 mt-1 leading-relaxed">
                      {rs.summary}
                    </p>
                  )}
                </div>

                {/* Expand indicator */}
                <svg
                  className={[
                    'w-4 h-4 flex-shrink-0 text-navy-500 transition-transform duration-200',
                    expandedStep === rs.step ? 'rotate-180' : '',
                  ].join(' ')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Warning / Success Message ──────────────────────── */}
      {isMostlyComplete ? (
        <SectionCard variant="highlight">
          <div className="text-center space-y-2 py-2">
            <p className="font-arabic text-lg text-gold-400">
              بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ
            </p>
            <p className="text-xs text-navy-300 leading-relaxed">
              &quot;Semoga Allah memberkahi kamu dan memberkahi pernikahanmu.&quot;
            </p>
            <p className="text-xs text-sage-400 mt-2 font-medium">
              Klik <strong>Simpan</strong> di bawah untuk menyimpan profilmu dan melihat preview CV Taaruf.
            </p>
          </div>
        </SectionCard>
      ) : (
        <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/50">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-xs text-gold-300 leading-relaxed">
            Ada <strong>{totalCount - filledCount} langkah</strong> yang belum diisi.
            Kamu tetap bisa menyimpan sekarang dan melengkapi nanti melalui dashboard.
            Namun, profil yang lengkap akan lebih menarik untuk calon pasangan.
          </p>
        </div>
      )}

      {/* ── CTA: Instruksi ─────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Setelah menyimpan, kamu bisa <strong className="text-white">kembali melengkapi profil</strong> melalui dashboard.
          Data yang sudah tersimpan akan otomatis dimuat kembali saat kamu membuka form ini.
          Pastikan data yang kamu isi sudah benar sebelum menyimpan.
        </p>
      </div>
    </div>
  )
}
