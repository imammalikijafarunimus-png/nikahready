'use client'

// ============================================================
// src/components/form/Step08_IbadahKeislaman.tsx
// Step 8 (form step): Ibadah & Keislaman — scalar
// Menampilkan kondisi dan perjalanan ibadah sehari-hari
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  TextInput,
  TextArea,
  SelectInput,
  RadioGroup,
  ToggleSwitch,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_SHALAT_FARDHU } from '@/lib/constants'
import type { Ibadah } from '@/types'

// ── Opsi Mazhab ──────────────────────────────────────────────
const OPTIONS_MAZHAB = [
  { value: 'Hanafi', label: 'Hanafi' },
  { value: 'Maliki', label: 'Maliki' },
  { value: "Syafii", label: "Syafii" },
  { value: 'Hanbali', label: 'Hanbali' },
]

// ── Main Component ────────────────────────────────────────────
export function Step08_IbadahKeislaman() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.ibadah

  // Type-safe field updater
  function update<K extends keyof Ibadah>(field: K, value: Ibadah[K]) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'ibadah',
      field,
      value,
    })
  }

  return (
    <div className="space-y-5">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Sesungguhnya shalat itu mencegah dari (perbuatan-perbuatan) keji dan mungkar&quot;
          <br />
          <span className="text-navy-600">— QS Al-Ankabut: 45</span>
        </p>
      </div>

      {/* ── 1. Amalan Ibadah ─────────────────────────────── */}
      <SectionCard title="Amalan Ibadah" icon="🕌">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SelectInput
              label="Mazhab"
              value={data.mazhab}
              onChange={(v) => update('mazhab', v)}
              options={OPTIONS_MAZHAB}
              placeholder="Pilih mazhab…"
              hint="Mayoritas umat Islam Indonesia mengikuti mazhab Syafii"
            />
            <TextInput
              label="Cara Berpakaian"
              value={data.cara_berpakaian}
              onChange={(v) => update('cara_berpakaian', v)}
              placeholder="Menutup aurat, longgar, tidak ketat, dll"
              maxLength={200}
              hint="Deskripsikan cara kamu berpakaian sehari-hari"
            />
          </div>
          
          <RadioGroup
            label="Kualitas Shalat Fardhu"
            value={data.shalat_fardhu}
            onChange={(v) => update('shalat_fardhu', v as typeof data.shalat_fardhu)}
            options={OPTIONS_SHALAT_FARDHU}
            layout="vertical"
          />
          
          <TextInput
            label="Shalat Sunnah"
            value={data.shalat_sunnah}
            onChange={(v) => update('shalat_sunnah', v)}
            placeholder="Tahajud, Dhuha, Rawatib, dll"
            maxLength={200}
            hint="Sebutkan shalat sunnah yang rutin kamu kerjakan"
          />
        </div>
      </SectionCard>

      {/* ── 2. Al-Quran & Kajian ─────────────────────────── */}
      <SectionCard title="Al-Quran & Kajian" icon="📖">
        <div className="space-y-5">
          <ToggleSwitch
            label="Membaca Al-Quran secara rutin"
            description="Aktifkan jika kamu memiliki kebiasaan membaca Al-Quran setiap hari"
            checked={data.tilawah_rutin}
            onChange={(v) => update('tilawah_rutin', v)}
          />
          <TextInput
            label="Hafalan Al-Quran"
            value={data.hafalan_quran}
            onChange={(v) => update('hafalan_quran', v)}
            placeholder="Contoh: Juz 30, 5 Juz, Surat Al-Baqarah, dll"
            maxLength={200}
            hint="Jujur tentang hafalan — yang penting konsistensi, bukan jumlah"
          />
          <ToggleSwitch
            label="Mengikuti kajian rutin"
            description="Aktifkan jika kamu rutin menghadiri kajian (online/offline)"
            checked={data.kajian_rutin}
            onChange={(v) => update('kajian_rutin', v)}
          />
        </div>
      </SectionCard>

      {/* ── 3. Cerita Ibadah ─────────────────────────────── */}
      <SectionCard title="Cerita Ibadah" icon="🤲" variant="highlight">
        <TextArea
          label="Perjalanan Ibadahmu"
          value={data.deskripsi_ibadah}
          onChange={(v) => update('deskripsi_ibadah', v)}
          placeholder="Ceritakan perjalanan ibadahmu secara pribadi — kapan mulai istiqomah, siapa yang menginspirasi, apa tantangan dan cita-cita ibadahmu…"
          rows={5}
          maxLength={800}
          showCount
          hint="Bagian ini sangat bermakna — jujur tentang kondisi ibadah saat ini, bukan yang ideal"
        />
      </SectionCard>

      {/* Tips */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Ini bagian yang <strong className="text-white">sangat diperhatikan oleh calon pasangan</strong>.
          Jujur tentang kondisi ibadah saat ini — Allah SWT melihat niat dan usahamu,
          bukan hanya hasilnya. &quot;Sedang berjuang&quot; pun sudah merupakan kejujuran yang mulia.
        </p>
      </div>
    </div>
  )
}