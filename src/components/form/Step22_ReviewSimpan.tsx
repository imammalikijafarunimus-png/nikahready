'use client'

// ============================================================
// src/components/form/Step22_ReviewSimpan.tsx
// Step 22 (form step): Review & Simpan
// Langkah terakhir — menampilkan ringkasan seluruh data form
// dengan indikator kelengkapan, dan tombol simpan final.
// Phase 5 Polish: premium visual upgrade
// ============================================================

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useFormState } from '@/context/FormContext'
import { OPTIONS_TEMPLATE } from '@/lib/constants'
import { SectionCard } from '@/components/ui/FormFields'
import { FileText, ChevronRight } from 'lucide-react'

function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every((v) =>
    v === '' ||
    v === null ||
    v === undefined ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'number' && v === 0)
  )
}

function truncate(str: string, max: number = 50): string {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

interface ReviewStep {
  step: number
  title: string
  icon: string
  filled: boolean
  summary: string
}

export function Step22_ReviewSimpan() {
  const state = useFormState()
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

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

  const selectedTemplate = state.fotoTemplate.template_pilihan

  return (
    <div className="space-y-5">
      {/* ── Header Section ── */}
      <div className="text-center py-4">
        <div
          className={
            isMostlyComplete
              ? 'w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-sage-700/30 to-sage-900/20 border border-sage-700/30 flex items-center justify-center'
              : 'w-16 h-16 mx-auto mb-3 rounded-2xl bg-navy-800/60 border border-navy-700/50 flex items-center justify-center'
          }
        >
          <span className="text-3xl">{isMostlyComplete ? '🎉' : '📝'}</span>
        </div>
        <p className="font-arabic text-lg text-gold-500 mb-1">وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ</p>
        <p className="text-[10px] text-navy-600 mb-2">&ldquo;Dan di atas setiap orang yang berilmu ada yang lebih mengetahui&rdquo; — QS Yusuf: 76</p>
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

      {/* ── Progress Bar ── */}
      <SectionCard>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-200">Kelengkapan Profil</span>
            <span className="text-lg font-bold text-sage-400">{filledCount}/{totalCount}</span>
          </div>

          <div className="w-full bg-navy-800 rounded-full h-3 relative overflow-hidden">
            <div
              className={[
                'h-3 rounded-full transition-all duration-700 ease-out',
                isMostlyComplete
                  ? 'bg-gradient-to-r from-sage-600 to-sage-400'
                  : 'bg-gradient-to-r from-gold-600 to-gold-500',
              ].join(' ')}
              style={{ width: `${percentComplete}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
          </div>

          <p className="text-xs text-navy-500 text-center">
            {isMostlyComplete
              ? `Masyaallah! ${percentComplete}% langkah sudah diisi. Kamu siap menyimpan! 🌟`
              : `${percentComplete}% langkah sudah diisi. Lengkapi untuk profil yang lebih optimal.`}
          </p>
        </div>
      </SectionCard>

      {/* ── Template Card ── */}
      <SectionCard title="Template CV Pilihan" icon="🎨">
        <div className="p-4 rounded-xl bg-navy-800/60 border border-navy-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-700 to-sage-900 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sage-900/20">
            <FileText className="w-5 h-5 text-sage-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              {OPTIONS_TEMPLATE.find(t => t.value === selectedTemplate)?.label ?? selectedTemplate.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-navy-500 mt-0.5">
              {selectedTemplate === 'ringkas'
                ? 'Template gratis — 1 halaman padat · Clean'
                : selectedTemplate === 'sederhana'
                ? 'Template gratis — 2 halaman data inti · Simple'
                : selectedTemplate === 'minimal_islami'
                ? 'Template gratis — 1 halaman ornamental · Soft'
                : selectedTemplate === 'akademik'
                ? 'Template premium — 5 halaman komprehensif · Pro'
                : selectedTemplate === 'elegant_islamic'
                ? "Template premium — 4 halaman ornamental · Elegant"
                : selectedTemplate === 'modern_dark'
                ? 'Template premium — 4 halaman modern · Bold'
                : 'Template premium — tersedia untuk NikahReady Pro'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-navy-600 flex-shrink-0" />
        </div>
      </SectionCard>

      {/* ── Review Step Cards ── */}
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
                  ? 'border-navy-700 bg-navy-800/40 hover:border-sage-700 border-l-2 border-l-sage-600'
                  : 'border-navy-800/50 bg-navy-900/30 hover:border-navy-600',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
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

      {/* ── Completion Highlight / Warning ── */}
      {isMostlyComplete ? (
        <SectionCard variant="highlight">
          <div className="text-center space-y-2 py-2">
            <p className="font-arabic text-xl text-gold-400">
              بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ
            </p>
            <div className="w-12 h-px bg-gold-700/40 mx-auto" />
            <p className="text-xs text-navy-300 leading-relaxed">
              &quot;Semoga Allah memberkahi kamu dan memberkahi pernikahanmu.&quot;
            </p>
            <p className="text-xs text-sage-400 mt-2 font-medium">
              Klik <strong>Simpan</strong> di bawah untuk menyimpan profilmu dan melihat preview CV Taaruf.
            </p>
          </div>
        </SectionCard>
      ) : (
        <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/50 backdrop-blur-sm">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-xs text-gold-300 leading-relaxed">
            Ada <strong>{totalCount - filledCount} langkah</strong> yang belum diisi.
            Kamu tetap bisa menyimpan sekarang dan melengkapi nanti melalui dashboard.
            Namun, profil yang lengkap akan lebih menarik untuk calon pasangan.
          </p>
        </div>
      )}

      {/* ── Info Hint Card ── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800 backdrop-blur-sm">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Setelah menyimpan, kamu bisa <strong className="text-white">kembali melengkapi profil</strong> melalui dashboard.
          Data yang sudah tersimpan akan otomatis dimuat kembali saat kamu membuka form ini.
          Pastikan data yang kamu isi sudah benar sebelum menyimpan.
        </p>
      </div>
      
      {/* ── Bottom Action Links ── */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-sage-800 text-sage-400 hover:border-sage-600 hover:text-sage-300 hover:bg-sage-900/20 text-sm font-semibold transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Edit Profil
        </Link>
        <Link
          href="/preview"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gold-700/50 text-gold-400 hover:border-gold-600 hover:text-gold-300 hover:bg-gold-900/15 text-sm font-semibold transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Preview CV
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white text-sm font-medium transition-all duration-200 border border-navy-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Dashboard
        </Link>
      </div>
    </div>
  )
}