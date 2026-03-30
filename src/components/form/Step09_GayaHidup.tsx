'use client'

// ============================================================
// src/components/form/Step09_GayaHidup.tsx
// Step 9 (form step): Gaya Hidup — scalar
// Menampilkan kebiasaan sehari-hari, pola makan, olahraga, dan kepribadian
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  TextInput,
  TextArea,
  RadioGroup,
  ToggleSwitch,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_TIPE_KEPRIBADIAN } from '@/lib/constants'
import type { GayaHidup } from '@/types'

// ── Main Component ────────────────────────────────────────────
export function Step09_GayaHidup() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.gayaHidup

  // Type-safe field updater
  function update<K extends keyof GayaHidup>(field: K, value: GayaHidup[K]) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'gayaHidup',
      field,
      value,
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَكُلُوا مِن رِّزْقِهِ وَابْتَغُوا
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Dan makanlah dari rezeki (yang diberikan Allah) dan carilah keridhaan-Nya&quot;
          <br />
          <span className="text-navy-600">— QS Al-Jumu&apos;ah: 10</span>
        </p>
      </div>

      {/* ── 1. Gaya Hidup ────────────────────────────────── */}
      <SectionCard title="Gaya Hidup" icon="🌱">
        <TextArea
          label="Gaya Hidup Sehari-hari"
          value={data.gaya_hidup}
          onChange={(v) => update('gaya_hidup', v)}
          placeholder="Ceritakan bagaimana aktivitas harianmu — dari bangun pagi hingga tidur malam, apa yang kamu lakukan di waktu senggang, bagaimana kamu mengatur hidup…"
          rows={4}
          maxLength={500}
          showCount
          hint="Deskripsikan secara umum — ini membantu calon pasangan membayangkan kehidupan bersamamu"
        />
        <TextInput
          label="Pola Makan"
          value={data.pola_makan}
          onChange={(v) => update('pola_makan', v)}
          placeholder="Rumahan, restoran sering, suka masakan Padang, dll"
          maxLength={200}
          hint="Preferensi makananmu — penting untuk keharmonisan di rumah tangga"
        />
      </SectionCard>

      {/* ── 2. Kebiasaan ─────────────────────────────────── */}
      <SectionCard title="Kebiasaan" icon="🏃">
        <ToggleSwitch
          label="Berolahraga secara rutin"
          description="Aktifkan jika kamu memiliki rutinitas olahraga yang konsisten"
          checked={data.olahraga_rutin}
          onChange={(v) => update('olahraga_rutin', v)}
        />
        <TextArea
          label="Kebiasaan Positif"
          value={data.kebiasaan_positif}
          onChange={(v) => update('kebiasaan_positif', v)}
          placeholder="Contoh: bangun pagi sebelum subuh, menabung rutin, membaca buku sebelum tidur, menjaga kebersihan, dll"
          rows={3}
          maxLength={500}
          showCount
          hint="Sebutkan kebiasaan baik yang sudah menjadi bagian dari hidupmu"
        />
        <TextArea
          label="Hal yang Tidak Disukai"
          value={data.hal_tidak_disukai}
          onChange={(v) => update('hal_tidak_disukai', v)}
          placeholder="Contoh: suka menunda pekerjaan, tempat berantakan, terlambat, dll — agar calon pasangan bisa memahami dan beradaptasi"
          rows={3}
          maxLength={500}
          showCount
          hint="Jujur tentang ini membantu pasangan memahami batasan dan preferensimu"
        />
      </SectionCard>

      {/* ── 3. Kepribadian ───────────────────────────────── */}
      <SectionCard title="Kepribadian" icon="🎭">
        <RadioGroup
          label="Tipe Kepribadian"
          value={data.tipe_kepribadian}
          onChange={(v) => update('tipe_kepribadian', v as typeof data.tipe_kepribadian)}
          options={OPTIONS_TIPE_KEPRIBADIAN}
          layout="grid"
          hint="Ini membantu pasangan memahami cara kamu mengisi energi dan bersosialisasi"
        />
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Sebutkan <strong className="text-white">kebiasaan positif</strong> — ini menunjukkan
          keseriusanmu dalam menjalani kehidupan. Hal yang tidak kamu suka juga penting,
          agar calon pasangan bisa memahami dan beradaptasi sejak awal.
        </p>
      </div>
    </div>
  )
}