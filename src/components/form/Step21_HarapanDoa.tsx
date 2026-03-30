'use client'

// ============================================================
// src/components/form/Step21_HarapanDoa.tsx
// Step 21 (form step): Harapan & Doa untuk pernikahan
// Local state (belum tersimpan ke Supabase, hanya di browser).
// ============================================================

import { useState } from 'react'
import { TextArea, SectionCard } from '@/components/ui/FormFields'

// ── Main Component ────────────────────────────────────────────
export function Step21_HarapanDoa() {
  const [harapan, setHarapan] = useState('')
  const [doa, setDoa] = useState('')

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَقُل رَّبِّ ارْزُقْنِي مِنْ لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Dan katakanlah: Ya Tuhanku, anugerahkanlah kepadaku keturunan yang baik&quot;
          <br />
          <span className="text-navy-600">— QS Ali Imran: 38</span>
        </p>
      </div>

      {/* ── Info Box ────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">🤲</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Tulis doa dengan ikhlas. <strong className="text-white">Allah SWT mendengunkan setiap doa</strong> hamba-Nya.
          Bagian ini bersifat pribadi dan bisa menjadi pengingat yang indah
          di masa mendatang.
        </p>
      </div>

      {/* ── 1. Harapan Pernikahan ──────────────────────────── */}
      <SectionCard title="Harapan untuk Pernikahan" icon="🌟" variant="highlight">
        <TextArea
          label="Harapanmu"
          value={harapan}
          onChange={setHarapan}
          placeholder={"Harapanmu untuk pernikahan ini…\n\nContoh: Saya berharap bisa membangun keluarga yang saling mendukung dalam kebaikan, rumah yang dipenuhi cinta dan kasih sayang, serta menjadi keluarga yang bermanfaat bagi sesama."}
          rows={8}
          maxLength={1500}
          showCount
          hint="Tuliskan harapan-harapan yang ingin kamu capai dalam pernikahan"
        />
      </SectionCard>

      {/* ── 2. Doa ─────────────────────────────────────────── */}
      <SectionCard title="Doa untuk Proses Ta'aruf & Pernikahan" icon="🤲">
        <TextArea
          label="Doamu"
          value={doa}
          onChange={setDoa}
          placeholder={"Doa untuk kelancaran proses ta'aruf…\n\nContoh: Ya Allah, mudahkanlah jodohku, jadikanlah ia orang yang terbaik untukku dalam agama dan akhlaknya. Berikanlah keikhlasan untuk menerima takdir-Mu."}
          rows={8}
          maxLength={1500}
          showCount
          hint="Doa dengan penuh pengharapan — Allah tidak pernah menolak doa hamba-Nya yang berdoa"
        />
      </SectionCard>

      {/* ── Doa Pilihan ────────────────────────────────────── */}
      <SectionCard title="Doa-Doa Pilihan" icon="📖">
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700">
            <p className="text-xs text-navy-400 mb-2 font-medium">Doa untuk Memudahkan Jodoh</p>
            <p className="font-arabic text-sm text-gold-500 leading-loose">
              رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ
            </p>
            <p className="text-xs text-navy-400 mt-2 italic">
              &quot;Ya Tuhanku, sesungguhnya aku sangat membutuhkan kebaikan yang Engkau turunkan kepadaku.&quot;
              <br />
              <span className="text-navy-600">— QS Al-Qashash: 24</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700">
            <p className="text-xs text-navy-400 mb-2 font-medium">Doa Keluarga Sakinah</p>
            <p className="font-arabic text-sm text-gold-500 leading-loose">
              رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
            </p>
            <p className="text-xs text-navy-400 mt-2 italic">
              &quot;Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan yang menjadi penyejuk hati (kami), dan jadikanlah kami imam bagi orang-orang yang bertakwa.&quot;
              <br />
              <span className="text-navy-600">— QS Al-Furqan: 74</span>
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Menulis doa dan harapan bisa menjadi <strong className="text-white">terapi spiritual</strong> yang menenangkan
          di tengah proses ta&apos;aruf. Ketika suatu hari nanti kamu membaca kembali tulisan ini,
          kamu akan merasakan betapa besar kasih sayang Allah SWT.
        </p>
      </div>
    </div>
  )
}
