'use client'

// ============================================================
// src/components/form/Step11_KriteriaPasangan.tsx
// Step 11 (form step): Kriteria Pasangan — scalar
// Kriteria yang diharapkan dari calon pasangan
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  NumberInput,
  TextInput,
  TextArea,
  ToggleSwitch,
  SectionCard,
} from '@/components/ui/FormFields'
import type { Kriteria } from '@/types'

// ── Main Component ────────────────────────────────────────────
export function Step11_KriteriaPasangan() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.kriteria

  // Type-safe field updater
  function update<K extends keyof Kriteria>(field: K, value: Kriteria[K]) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'kriteria',
      field,
      value,
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَأَنكُمْ لَتَرْحَمُوا بِكُمْ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Dan sesungguhnya kamu semua saling mendekatkan diri&quot;
        </p>
      </div>

      {/* ── 1. Rentang Usia ───────────────────────────────── */}
      <SectionCard title="Rentang Usia" icon="🎂">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Usia Minimum"
            value={data.kriteria_usia_min}
            onChange={(v) => update('kriteria_usia_min', v)}
            placeholder="Contoh: 22"
            min={18}
            max={60}
          />
          <NumberInput
            label="Usia Maksimum"
            value={data.kriteria_usia_max}
            onChange={(v) => update('kriteria_usia_max', v)}
            placeholder="Contoh: 30"
            min={18}
            max={80}
          />
        </div>
      </SectionCard>

      {/* ── 2. Lokasi & Pendidikan ────────────────────────── */}
      <SectionCard title="Lokasi & Pendidikan" icon="📍">
        <TextInput
          label="Domisili yang Diharapkan"
          value={data.kriteria_domisili}
          onChange={(v) => update('kriteria_domisili', v)}
          placeholder="Jakarta, Bandung, atau fleksibel"
        />
        <TextInput
          label="Pendidikan Minimum"
          value={data.kriteria_pendidikan}
          onChange={(v) => update('kriteria_pendidikan', v)}
          placeholder="Minimal S1, atau setara"
        />
        <TextInput
          label="Pekerjaan yang Diharapkan"
          value={data.kriteria_pekerjaan}
          onChange={(v) => update('kriteria_pekerjaan', v)}
          placeholder="Bekerja mapan, freelancer, dll"
        />
      </SectionCard>

      {/* ── 3. Karakter & Ibadah ──────────────────────────── */}
      <SectionCard title="Karakter & Ibadah" icon="✨">
        <TextArea
          label="Karakter yang Diharapkan"
          value={data.kriteria_karakter}
          onChange={(v) => update('kriteria_karakter', v)}
          placeholder="Sifat karakter yang kamu harapkan dari calon pasangan…"
          rows={4}
          maxLength={500}
          showCount
        />
        <TextArea
          label="Level Ibadah yang Diharapkan"
          value={data.kriteria_ibadah}
          onChange={(v) => update('kriteria_ibadah', v)}
          placeholder="Level ibadah yang kamu harapkan dari calon pasangan…"
          rows={4}
          maxLength={500}
          showCount
        />
      </SectionCard>

      {/* ── 4. Lainnya ────────────────────────────────────── */}
      <SectionCard title="Lainnya" icon="📝">
        <TextArea
          label="Kriteria Lainnya"
          value={data.kriteria_lainnya}
          onChange={(v) => update('kriteria_lainnya', v)}
          placeholder="Kriteria lainnya yang penting bagimu…"
          rows={3}
          maxLength={300}
          showCount
        />
      </SectionCard>

      {/* ── 5. Kesediaan ──────────────────────────────────── */}
      <SectionCard title="Kesediaan" icon="🤝">
        <ToggleSwitch
          label="Bersedia poligami"
          description="Centang jika kamu terbuka. Biarkan null jika belum menentukan"
          checked={data.bersedia_poligami ?? false}
          onChange={(v) => update('bersedia_poligami', v)}
        />
        <ToggleSwitch
          label="Bersedia pindah domisili"
          description="Apakah kamu bersedia pindah jika pasangan tinggal di kota berbeda"
          checked={data.bersedia_pindah_domisili ?? false}
          onChange={(v) => update('bersedia_pindah_domisili', v)}
        />
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Kriteria yang realistis akan membantu proses ta&apos;aruf berjalan lebih lancar.
          Tetap terbuka — terkadang <strong className="text-white">jodoh terbaik datang dari
          yang tidak pernah kamu sangka</strong>.
        </p>
      </div>
    </div>
  )
}
