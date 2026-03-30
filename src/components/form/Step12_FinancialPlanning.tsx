'use client'

// ============================================================
// src/components/form/Step12_FinancialPlanning.tsx
// Step 12 (form step): Financial Planning — scalar
// Rencana keuangan keluarga dengan alokasi persentase
// ============================================================

import { useMemo } from 'react'
import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  NumberInput,
  SelectInput,
  TextArea,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_PENGHASILAN_RANGE } from '@/lib/constants'
import type { FinancialPlanning } from '@/types'

// ── Percentage field config ───────────────────────────────────
const PERCENTAGE_FIELDS: Array<{
  key: keyof FinancialPlanning
  label: string
  icon: string
}> = [
  { key: 'kebutuhan_pokok_persen', label: 'Kebutuhan Pokok', icon: '🏠' },
  { key: 'tabungan_persen', label: 'Tabungan', icon: '🏦' },
  { key: 'investasi_persen', label: 'Investasi', icon: '📈' },
  { key: 'sedekah_persen', label: 'Sedekah', icon: '🤲' },
  { key: 'lainnya_persen', label: 'Lainnya', icon: '📦' },
]

// ── Main Component ────────────────────────────────────────────
export function Step12_FinancialPlanning() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.financialPlanning

  // Type-safe field updater
  function update<K extends keyof FinancialPlanning>(field: K, value: FinancialPlanning[K]) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'financialPlanning',
      field,
      value,
    })
  }

  // Hitung total alokasi persentase
  const total = useMemo(() => {
    return (
      (data.kebutuhan_pokok_persen || 0) +
      (data.tabungan_persen || 0) +
      (data.investasi_persen || 0) +
      (data.sedekah_persen || 0) +
      (data.lainnya_persen || 0)
    )
  }, [
    data.kebutuhan_pokok_persen,
    data.tabungan_persen,
    data.investasi_persen,
    data.sedekah_persen,
    data.lainnya_persen,
  ])

  const exceedsLimit = total > 100
  const barPercent = Math.min(total, 100)

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَلَا تَجْعَلُوا يَدَكُمْ إِلَى خُصُومٍ بِالنَّاسِ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Dan janganlah kamu menjadikan tanganmu terbelenggu pada lehermu&quot;
          <br />
          <span className="text-navy-600">— QS Al-Isra: 29</span>
        </p>
      </div>

      {/* ── 1. Penghasilan ────────────────────────────────── */}
      <SectionCard title="Penghasilan" icon="💰">
        <SelectInput
          label="Range Penghasilan Bulanan"
          value={data.penghasilan_range}
          onChange={(v) => update('penghasilan_range', v as FinancialPlanning['penghasilan_range'])}
          options={OPTIONS_PENGHASILAN_RANGE}
          placeholder="Pilih range penghasilan…"
          hint="Ini bersifat rahasia dan hanya muncul di CV untuk calon pasangan"
        />
      </SectionCard>

      {/* ── 2. Alokasi Bulanan (%) ────────────────────────── */}
      <SectionCard title="Alokasi Bulanan (%)" icon="📊">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PERCENTAGE_FIELDS.map(({ key, label, icon }) => (
            <NumberInput
              key={key}
              label={`${icon} ${label}`}
              value={data[key] as number}
              onChange={(v) => update(key, v === '' ? 0 : v)}
              placeholder="0"
              min={0}
              max={100}
              suffix="%"
            />
          ))}
        </div>

        {/* Total bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-navy-400">Total Alokasi</span>
            <span className={`text-sm font-semibold ${exceedsLimit ? 'text-red-400' : total === 100 ? 'text-sage-400' : 'text-navy-200'}`}>
              {total}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-navy-800 rounded-full overflow-hidden">
            <div
              className={[
                'h-full rounded-full transition-all duration-500',
                exceedsLimit ? 'bg-red-500' : total === 100 ? 'bg-sage-600' : 'bg-sage-700',
              ].join(' ')}
              style={{ width: `${barPercent}%` }}
            />
          </div>
          {exceedsLimit && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Total melebihi 100% — sesuaikan alokasi agar realistis
            </p>
          )}
          {!exceedsLimit && total === 100 && (
            <p className="text-xs text-sage-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Alokasi sudah 100% — sempurna!
            </p>
          )}
        </div>
      </SectionCard>

      {/* ── 3. Rencana Keuangan ───────────────────────────── */}
      <SectionCard title="Rencana Keuangan" icon="📝">
        <TextArea
          label="Deskripsi Rencana Keuangan"
          value={data.deskripsi}
          onChange={(v) => update('deskripsi', v)}
          placeholder="Ceritakan rencana keuangan keluargamu…"
          rows={5}
          maxLength={500}
          showCount
          hint="Bagaimana kamu mengelola keuangan saat ini dan rencana setelah menikah"
        />
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Alokasi ini hanya gambaran umum — tidak perlu sempurna.
          Yang penting ada <strong className="text-white">kesadaran finansial</strong> dan
          komitmen untuk mengelola keuangan bersama dengan transparan.
        </p>
      </div>
    </div>
  )
}
