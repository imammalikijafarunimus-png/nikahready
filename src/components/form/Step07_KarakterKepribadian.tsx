'use client'

// ============================================================
// src/components/form/Step07_KarakterKepribadian.tsx
// Step 7 (form step): Karakter & Kepribadian — scalar
// Step paling kaya: karakter diri, kelebihan/kekurangan, hobi, MBTI, bahasa cinta
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  TextArea,
  SelectInput,
  RadioGroup,
  TagInput,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_MBTI, OPTIONS_BAHASA_CINTA } from '@/lib/constants'
import type { Karakter } from '@/types'

// ── Suggestions untuk TagInput ────────────────────────────────
const SUGGESTIONS_KELEBIHAN = [
  'Sabar', 'Jujur', 'Pendengar yang baik', 'Pemaaf', 'Tanggung jawab',
  'Disiplin', 'Humoris', 'Rajin', 'Setia', 'Penyayang',
  'Mudah bergaul', 'Tegas', 'Adaptif', 'Cerdas', 'Kreatif',
  'Rendah hati', 'Suka menolong',
]

const SUGGESTIONS_KEKURANGAN = [
  'Suka menunda', 'Lupa waktu', 'Mudah tersinggung', 'Keras kepala',
  'Boros', 'Pemarah', 'Pemalu berlebihan', 'Suka cemburu',
  'Kurang komunikatif',
]

const SUGGESTIONS_HOBI = [
  'Membaca', 'Menulis', 'Olahraga', 'Memasak', 'Fotografi',
  'Traveling', 'Berkebun', 'Bermain musik', 'Desain', 'Coding',
  'Mengaji', 'Panahan', 'Berenang',
]

// ── Main Component ────────────────────────────────────────────
export function Step07_KarakterKepribadian() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.karakter

  // Type-safe field updater
  function update<K extends keyof Karakter>(field: K, value: Karakter[K]) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'karakter',
      field,
      value,
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          خَيْرُكُمْ مِنْ أَخْلَاقِكُمْ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Sebaik-baik kalian adalah yang paling baik akhlaknya&quot;
          <br />
          <span className="text-navy-600">— HR. Bukhari & Muslim</span>
        </p>
      </div>

      {/* ── 1. Deskripsi Karakter ─────────────────────────── */}
      <SectionCard title="Deskripsi Karakter" icon="✍️">
        <TextArea
          label="Karakter Dirimu"
          value={data.karakter_diri}
          onChange={(v) => update('karakter_diri', v)}
          placeholder="Ceritakan karakter dirimu secara mendalam — bagaimana caramu menghadapi masalah, berinteraksi dengan orang lain, dan hal-hal yang membedakanmu dari orang lain…"
          rows={6}
          maxLength={1000}
          showCount
          hint="Tulisan yang jujur dan reflektif lebih bernilai dari tulisan yang sempurna"
        />
      </SectionCard>

      {/* ── 2. Kelebihan & Kekurangan ────────────────────── */}
      <SectionCard title="Kelebihan & Kekurangan" icon="⚖️">
        <TagInput
          label="Kelebihanmu"
          tags={data.kelebihan}
          onChange={(v) => update('kelebihan', v)}
          placeholder="Ketik kelebihanmu lalu Enter…"
          maxTags={10}
          suggestions={SUGGESTIONS_KELEBIHAN}
          hint="Pilih atau ketik kelebihan yang paling mencerminkan dirimu"
        />
        <TagInput
          label="Kekuranganmu"
          tags={data.kekurangan}
          onChange={(v) => update('kekurangan', v)}
          placeholder="Ketik kekuranganmu lalu Enter…"
          maxTags={10}
          suggestions={SUGGESTIONS_KEKURANGAN}
          hint="Jujur tentang kekurangan menunjukkan kedewasaan — bukan kelemahan"
        />
      </SectionCard>

      {/* ── 3. Minat & Hobi ───────────────────────────────── */}
      <SectionCard title="Minat & Hobi" icon="🎨">
        <TagInput
          label="Hobi & Minat"
          tags={data.hobi}
          onChange={(v) => update('hobi', v)}
          placeholder="Ketik hobimu lalu Enter…"
          maxTags={10}
          suggestions={SUGGESTIONS_HOBI}
          hint="Hobi menunjukkan sisi personal dan passion-mu"
        />
      </SectionCard>

      {/* ── 4. Kepribadian ───────────────────────────────── */}
      <SectionCard title="Kepribadian" icon="🧠">
        <SelectInput
          label="Tipe MBTI"
          value={data.mbti_type}
          onChange={(v) => update('mbti_type', v)}
          options={OPTIONS_MBTI}
          placeholder="Pilih tipe MBTI…"
          hint="Opsional — bisa diisi nanti di 16personalities.com"
        />
        <RadioGroup
          label="Bahasa Cinta"
          value={data.bahasa_cinta}
          onChange={(v) => update('bahasa_cinta', v)}
          options={OPTIONS_BAHASA_CINTA}
          layout="grid"
          hint="Cara kamu merasa dicintai dan mencintai — ini membantu pasangan memahamimu"
        />
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Karakter yang jujur dan transparan adalah <strong className="text-white">fondasi ta&apos;aruf yang baik</strong>.
          Tidak perlu sempurna — justru kejujuran tentang kekuranganmu yang akan
          membuat calon pasangan merasa nyaman dan menghargaimu.
        </p>
      </div>
    </div>
  )
}