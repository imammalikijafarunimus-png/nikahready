'use client'

// ============================================================
// src/components/form/Step15_RencanaMasaDepan.tsx
// Step 15 (form step): Rencana Masa Depan — DynamicList
// Rencana jangka pendek dan panjang untuk 1-10 tahun ke depan
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  TextArea,
  SelectInput,
} from '@/components/ui/FormFields'
import type { RencanaMasaDepanItem } from '@/types'

// ── Select options untuk tipe rencana ────────────────────────
const OPTIONS_TIPE_RENCANA = [
  { value: 'pendek', label: 'Pendek (1-2 tahun)' },
  { value: 'panjang', label: 'Panjang (5-10 tahun)' },
]

// ── Default item factory ──────────────────────────────────────
function createDefaultRencanaMasaDepan(): Omit<RencanaMasaDepanItem, 'id' | 'urutan'> {
  return {
    tipe: 'pendek',
    waktu: '',
    rencana: '',
    target: '',
  }
}

// ── Summary renderer (collapsed state) ───────────────────────
function renderSummary(item: RencanaMasaDepanItem, _index: number) {
  const tipeLabel = item.tipe === 'pendek' ? 'Pendek' : 'Panjang'

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.rencana || (
          <span className="text-navy-500 italic">Belum diisi</span>
        )}
      </span>
      <span className="text-xs text-navy-400 truncate">
        <span className="text-sage-400">{tipeLabel}</span>
        {item.waktu && (
          <>
            <span className="mx-1 text-navy-600">·</span>
            <span>{item.waktu}</span>
          </>
        )}
      </span>
    </div>
  )
}

// ── Form renderer (expanded state) ───────────────────────────
function renderForm(
  item: RencanaMasaDepanItem,
  onChange: (field: keyof RencanaMasaDepanItem, value: RencanaMasaDepanItem[keyof RencanaMasaDepanItem]) => void
) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectInput
          label="Jangka Waktu"
          value={item.tipe}
          onChange={(v) => onChange('tipe', v)}
          options={OPTIONS_TIPE_RENCANA}
          placeholder="Pilih jangka waktu…"
        />
        <TextInput
          label="Waktu Target"
          value={item.waktu}
          onChange={(v) => onChange('waktu', v)}
          placeholder="2026, 1 Tahun, dll"
        />
      </div>

      <TextArea
        label="Rencana"
        value={item.rencana}
        onChange={(v) => onChange('rencana', v)}
        placeholder="Tuliskan rencanamu secara detail — apa yang ingin kamu capai dan bagaimana caranya…"
        rows={4}
        maxLength={500}
        showCount
        required
      />

      <TextInput
        label="Target / Tujuan"
        value={item.target}
        onChange={(v) => onChange('target', v)}
        placeholder="Contoh: Menikah, Beli rumah, Naik haji, dll"
      />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function Step15_RencanaMasaDepan() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('rencanaMasaDepan')

  return (
    <div className="space-y-4">
      {/* Intro card */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">🗓️</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Rencana masa depan menunjukkan <strong className="text-white">visi dan ambisimu</strong> untuk
          1-10 tahun ke depan. Bagikan rencana yang realistis — ini membantu calon pasangan
          memahami arah hidupmu.
        </p>
      </div>

      <DynamicList<RencanaMasaDepanItem>
        items={items}
        sectionTitle="Rencana Masa Depan"
        itemLabel="Rencana"
        emptyIcon="🗓️"
        emptyMessage="Belum ada rencana masa depan. Tambahkan rencana pertamamu."
        maxItems={10}
        createDefaultItem={createDefaultRencanaMasaDepan}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Tips */}
      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          Tuliskan rencana yang <strong className="text-gold-400">realistis dan terukur</strong> —
          ini menunjukkan bahwa kamu serius mempersiapkan masa depan. Rencana bisa berubah,
          tapi punya arah itu penting.
        </p>
      </div>
    </div>
  )
}
