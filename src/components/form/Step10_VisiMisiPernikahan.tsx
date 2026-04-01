'use client'

// ============================================================
// src/components/form/Step10_VisiMisiPernikahan.tsx
// Refactored: space-y-5 root
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  TextArea,
  TagInput,
  SectionCard,
} from '@/components/ui/FormFields'
import type { VisiMisi } from '@/types'

const SUGGESTIONS_TUJUAN = [
  'Membangun rumah tangga sakinah',
  'Mengamalkan sunnah Rasulullah',
  'Menjaga silaturahmi',
  'Mendidik anak-anak saleh',
  'Saling menasihati dalam kebaikan',
  'Berkontribusi untuk umat',
  'Mencari ridha Allah SWT',
  'Hidup berkecukupan',
  'Saling menghargai',
  'Membangun keluarga sakinah mawaddah',
]

export function Step10_VisiMisiPernikahan() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.visiMisi

  function update<K extends keyof VisiMisi>(field: K, value: VisiMisi[K]) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'visiMisi',
      field,
      value,
    })
  }

  return (
    <div className="space-y-5">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya&quot;
          <br />
          <span className="text-navy-600">— QS Ar-Rum: 21</span>
        </p>
      </div>

      {/* ── 1. Visi Pernikahan ──────────────────────────── */}
      <SectionCard title="Visi Pernikahan" icon="🌟" variant="highlight">
        <TextArea
          label="Visi Besar Pernikahan"
          value={data.visi}
          onChange={(v) => update('visi', v)}
          placeholder="Apa visi besar tentang pernikahan yang kamu impikan? Seperti apa rumah tangga idamanmu 10-20 tahun ke depan?"
          rows={5}
          maxLength={600}
          showCount
          hint="Visi yang jelas akan menjadi kompas dalam perjalanan rumah tangga"
        />
      </SectionCard>

      {/* ── 2. Peran & Harapan ───────────────────────────── */}
      <SectionCard title="Peran & Harapan" icon="👫">
        <div className="space-y-3">
          <TextArea
            label="Misi sebagai Suami / Pendamping"
            value={data.misi_suami}
            onChange={(v) => update('misi_suami', v)}
            placeholder="Apa yang kamu ingin wujudkan sebagai suami atau pendamping? Bagaimana kamu akan menjadi pemimpin yang adil, pelindung, dan penyayang?"
            rows={4}
            maxLength={600}
            showCount
            hint="Tuliskan konkrit — bukan hanya cita-cita, tapi juga langkah nyata yang akan kamu ambil"
          />
          <TextArea
            label="Harapan dari Pasangan (Istri / Pendamping)"
            value={data.misi_istri}
            onChange={(v) => update('misi_istri', v)}
            placeholder="Apa yang kamu harapkan dari pasangan? Seperti apa istri atau pendamping yang akan melengkapi hidupmu?"
            rows={4}
            maxLength={600}
            showCount
            hint="Harapan yang realistis dan komunikatif membangun fondasi yang kuat"
          />
        </div>
      </SectionCard>

      {/* ── 3. Tujuan Pernikahan ────────────────────────── */}
      <SectionCard title="Tujuan Pernikahan" icon="🎯">
        <TagInput
          label="Tujuan & Nilai Pernikahan"
          tags={data.tujuan_pernikahan}
          onChange={(v) => update('tujuan_pernikahan', v)}
          placeholder="Ketik tujuan pernikahanmu lalu Enter…"
          maxTags={10}
          suggestions={SUGGESTIONS_TUJUAN}
          hint="Pilih atau ketik tujuan-tujuan utama yang ingin kamu capai dalam pernikahan"
        />
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Visi misi yang jelas menunjukkan <strong className="text-white">kedewasaan dan kesiapanmu</strong> untuk
          berumah tangga. Diskusikan hal ini dengan orang tua atau mentor terlebih dahulu.
        </p>
      </div>
    </div>
  )
}