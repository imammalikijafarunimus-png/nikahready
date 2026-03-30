'use client'

// ============================================================
// src/components/form/Step02_FisikKesehatan.tsx
// Step 2: Fisik & Kesehatan — semua field scalar
// Data fisik dan riwayat kesehatan untuk CV Taaruf
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  NumberInput,
  SelectInput,
  TextInput,
  TextArea,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_GOLONGAN_DARAH } from '@/lib/constants'
import type { FisikKesehatan } from '@/types'

export function Step02_FisikKesehatan() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.fisikKesehatan

  // Type-safe field updater
  function update<K extends keyof FisikKesehatan>(
    field: K,
    value: FisikKesehatan[K]
  ) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'fisikKesehatan',
      field,
      value,
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Islamic guidance ──────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          إِنَّ جِسْمَكُمْ عَلَيْكُمْ مَسْؤُولٌ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &ldquo;Sesungguhnya tubuhmu adalah amanah atas dirimu&rdquo;
        </p>
      </div>

      {/* ── 1. Data Fisik ─────────────────────────────────────── */}
      <SectionCard title="Data Fisik" icon="💪">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Tinggi Badan"
            value={data.tinggi_badan}
            onChange={(v) => update('tinggi_badan', v)}
            placeholder="170"
            suffix="cm"
            min={100}
            max={250}
            className="col-span-2 sm:col-span-1"
          />
          <NumberInput
            label="Berat Badan"
            value={data.berat_badan}
            onChange={(v) => update('berat_badan', v)}
            placeholder="65"
            suffix="kg"
            min={30}
            max={200}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <SelectInput
          label="Golongan Darah"
          value={data.golongan_darah}
          onChange={(v) => update('golongan_darah', v as FisikKesehatan['golongan_darah'])}
          options={OPTIONS_GOLONGAN_DARAH}
          placeholder="Pilih golongan darah…"
        />

        <TextInput
          label="Warna Kulit"
          value={data.warna_kulit}
          onChange={(v) => update('warna_kulit', v)}
          placeholder="Sawo matang, kuning langsat, putih, cokelat, dll"
          hint="Deskripsikan warna kulit secara umum"
          maxLength={50}
        />
      </SectionCard>

      {/* ── 2. Kesehatan ──────────────────────────────────────── */}
      <SectionCard title="Kesehatan" icon="🏥">
        <TextArea
          label="Kondisi Kesehatan Saat Ini"
          value={data.kondisi_kesehatan}
          onChange={(v) => update('kondisi_kesehatan', v)}
          placeholder="Contoh: Alhamdulillah sehat, tidak punya riwayat penyakit serius…"
          rows={3}
          maxLength={500}
          showCount
          hint="Ceritakan kondisi kesehatan secara umum saat ini"
        />

        <TextArea
          label="Riwayat Penyakit (jika ada)"
          value={data.riwayat_penyakit}
          onChange={(v) => update('riwayat_penyakit', v)}
          placeholder="Contoh: Pernah operasi usus buntu tahun 2020, asma ringan saat kecil…"
          rows={3}
          maxLength={500}
          showCount
          hint="Boleh kosongkan jika tidak ada riwayat penyakit"
        />

        <TextArea
          label="Kebutuhan Khusus (jika ada)"
          value={data.kebutuhan_khusus}
          onChange={(v) => update('kebutuhan_khusus', v)}
          placeholder="Contoh: Menggunakan kacamata, alergi makanan tertentu, dll"
          rows={3}
          maxLength={500}
          showCount
          hint="Informasi yang perlu diketahui pasangan terkait kebutuhan khusus"
        />
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          <strong className="text-gold-400">Tidak apa-apa jika ada field yang kosong.</strong>{' '}
          Kejujuran tentang kondisi fisik dan kesehatan adalah bentuk tanggung jawab
          dalam ta&apos;aruf. Allah SWT mencintai hamba-Nya yang jujur.
        </p>
      </div>
    </div>
  )
}