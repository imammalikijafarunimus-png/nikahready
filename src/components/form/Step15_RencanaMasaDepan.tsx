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
import { getMaxItemsForSection } from '@/lib/constants'
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
  const isPendek = item.tipe === 'pendek'

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.rencana || (
          <span className="text-navy-500 italic font-normal">Rencana belum diisi</span>
        )}
      </span>
      <div className="flex items-center gap-1.5 text-xs text-navy-400">
        <span 
          className={[
            'px-1.5 py-0.5 rounded border text-xs font-medium',
            isPendek 
              ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' 
              : 'bg-purple-900/40 text-purple-400 border-purple-800/50'
          ].join(' ')}
        >
          {isPendek ? 'Jangka Pendek' : 'Jangka Panjang'}
        </span>
        {item.waktu && (
          <>
            <span className="text-navy-600">•</span>
            <span className="truncate">{item.waktu}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ── Form renderer (expanded state) ───────────────────────────
function renderForm(
  item: RencanaMasaDepanItem,
  onChange: (field: keyof RencanaMasaDepanItem, value: RencanaMasaDepanItem[keyof RencanaMasaDepanItem]) => void
) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectInput
          label="Jangka Waktu"
          value={item.tipe}
          // Type casting ke tipe spesifik untuk menghindari error TS string assignment
          onChange={(v) => onChange('tipe', v as 'pendek' | 'panjang')}
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
        label="Target / Tujuan Utama"
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
    <div className="space-y-6">
      {/* Intro card */}
      <div className="flex gap-3 p-4 rounded-2xl bg-navy-900/40 border border-navy-800/60">
        <span className="text-xl flex-shrink-0">🗓️</span>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Visi & Rencana Masa Depan</p>
          <p className="text-xs text-navy-400 leading-relaxed">
            Bagikan rencana yang realistis untuk 1-10 tahun ke depan. Ini membantu calon pasangan
            memahami apakah arah dan ritme hidup kalian berdua sejalan.
          </p>
        </div>
      </div>

      <DynamicList<RencanaMasaDepanItem>
        items={items as RencanaMasaDepanItem[]}
        sectionTitle="Rencana Masa Depan"
        itemLabel="Rencana"
        emptyIcon="🗓️"
        emptyMessage="Belum ada rencana masa depan. Tambahkan rencana pertamamu."
        maxItems={getMaxItemsForSection('rencanaMasaDepan', 'pro')}
        createDefaultItem={createDefaultRencanaMasaDepan}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Tips */}
      <div className="flex gap-3 p-4 rounded-2xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-xl flex-shrink-0">💡</span>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-gold-400">Tips Mengisi</p>
          <p className="text-xs text-gold-400/80 leading-relaxed">
            Tuliskan rencana yang <strong className="text-gold-300">realistis dan terukur</strong>. Rencana bisa berubah seiring waktu, tetapi memiliki peta hidup yang jelas menunjukkan kesiapanmu dalam memimpin atau membangun rumah tangga.
          </p>
        </div>
      </div>
    </div>
  )
}