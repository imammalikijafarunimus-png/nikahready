'use client'

// ============================================================
// src/components/form/Step04_PandanganIsu.tsx
// Step 4 (form step): Pandangan tentang Isu Pernikahan
// Semua field scalar menggunakan TextArea
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import { TextArea, SectionCard } from '@/components/ui/FormFields'
import type { PandanganIsu } from '@/types'

// ── Config tiap field pandangan ───────────────────────────────
const PANDANGAN_FIELDS: Array<{
  key: keyof PandanganIsu
  label: string
  icon: string
  placeholder: string
  hint: string
}> = [
  {
    key: 'pandangan_isu',
    label: 'Pandangan Umum tentang Pernikahan',
    icon: '💬',
    placeholder:
      'Apa arti pernikahan bagimu? Apa yang kamu pahami tentang tujuan berumah tangga dalam Islam?',
    hint: 'Ceritakan perspektif dan nilai yang kamu pegang tentang pernikahan',
  },
  {
    key: 'pandangan_istri_bekerja',
    label: 'Pandangan tentang Istri Bekerja',
    icon: '👩‍💼',
    placeholder:
      'Bagaimana pandanganmu jika istri ingin berkarir? Apa batasan dan pertimbanganmu? Bagaimana membagi peran?',
    hint: 'Tidak ada jawaban benar atau salah — yang penting jujur dan konsisten',
  },
  {
    key: 'pandangan_kb',
    label: 'Pandangan tentang Keluarga Berencana (KB)',
    icon: '👶',
    placeholder:
      'Berapa jumlah anak yang ideal menurutmu? Bagaimana pandanganmu tentang KB?',
    hint: 'Menyamakan visi tentang anak penting sejak awal ta\'aruf',
  },
  {
    key: 'pandangan_parenting',
    label: 'Pandangan tentang Parenting & Pendidikan Anak',
    icon: '🧒',
    placeholder:
      'Bagaimana cara mendidik anak yang kamu yakini? Sekolah formal, pesantren, atau homeschooling? Bagaimana peran ayah dan ibu?',
    hint: 'Parenting adalah salah satu topik paling penting untuk diselaraskan sebelum menikah',
  },
  {
    key: 'pandangan_mertua',
    label: 'Pandangan tentang Hubungan dengan Mertua',
    icon: '🏠',
    placeholder:
      'Setelah menikah, bagaimana rencanamu soal tempat tinggal? Bagaimana mengelola hubungan dengan keluarga besar kedua belah pihak?',
    hint: 'Keterbukaan tentang ekspektasi keluarga besar menghindari konflik di kemudian hari',
  },
]

// ── Main Component ────────────────────────────────────────────
export function Step04_PandanganIsu() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.pandanganIsu

  function update<K extends keyof PandanganIsu>(
    field: K,
    value: PandanganIsu[K]
  ) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'pandanganIsu',
      field,
      value,
    })
  }

  // Hitung progress pengisian
  const filledCount = PANDANGAN_FIELDS.filter(
    (f) => data[f.key] && data[f.key].length > 20
  ).length

  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💬</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Bagian ini membahas isu-isu yang sering menjadi sumber
          <strong className="text-white"> gesekan dalam rumah tangga</strong>.
          Kejujuran di sini lebih baik daripada kejutan setelah menikah.
        </p>
      </div>

      {/* Progress mini */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-navy-800 rounded-full">
          <div
            className="h-1 bg-sage-600 rounded-full transition-all duration-500"
            style={{
              width: `${Math.round((filledCount / PANDANGAN_FIELDS.length) * 100)}%`,
            }}
          />
        </div>
        <span className="text-xs text-navy-500 flex-shrink-0">
          {filledCount}/{PANDANGAN_FIELDS.length} diisi
        </span>
      </div>

      {/* Field cards */}
      {PANDANGAN_FIELDS.map((fieldConfig, index) => {
        const value = data[fieldConfig.key]
        const isLongEnough = value && value.length > 20

        return (
          <SectionCard
            key={fieldConfig.key}
            title={`${index + 1}. ${fieldConfig.label}`}
            icon={fieldConfig.icon}
            variant={isLongEnough ? 'highlight' : 'default'}
          >
            <TextArea
              label=""
              value={value}
              onChange={(v) => update(fieldConfig.key, v)}
              placeholder={fieldConfig.placeholder}
              rows={4}
              maxLength={800}
              showCount
              hint={fieldConfig.hint}
            />
          </SectionCard>
        )
      })}

      {/* Penutup */}
      <SectionCard variant="highlight">
        <div className="text-center space-y-1">
          <p className="font-arabic text-base text-gold-400">
            وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا
          </p>
          <p className="text-xs text-navy-400 italic">
            "Dan orang-orang yang berkata: Ya Tuhan kami, anugerahkanlah
            kepada kami pasangan kami…"
            <br />
            <span className="text-navy-500">— QS Al-Furqan: 74</span>
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
