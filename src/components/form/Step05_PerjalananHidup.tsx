'use client'

// ============================================================
// src/components/form/Step05_PerjalananHidup.tsx
// Step 5 (form step): Perjalanan Hidup — DynamicList
// Step paling emosional: user menceritakan fase hidupnya
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  TextArea,
  SelectInput,
  NumberInput,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_FASE_HIDUP } from '@/lib/constants'
import type { PerjalananHidupItem, FaseHidup } from '@/types'

// Label + warna per fase
const FASE_CONFIG: Record<
  Exclude<FaseHidup, ''>,
  { label: string; color: string; emoji: string }
> = {
  masa_kecil:   { label: 'Masa Kecil',    color: 'text-blue-400',   emoji: '🌱' },
  remaja:       { label: 'Remaja',         color: 'text-purple-400', emoji: '📚' },
  dewasa_awal:  { label: 'Dewasa Awal',    color: 'text-sage-400',   emoji: '🚀' },
  saat_ini:     { label: 'Fase Sekarang',  color: 'text-gold-400',   emoji: '⭐' },
}

// ── Default item factory ──────────────────────────────────────
function createDefaultPerjalanan(): Omit<PerjalananHidupItem, 'id' | 'urutan'> {
  return {
    fase:          '',
    judul:         '',
    cerita:        '',
    pelajaran:     '',
    tahun_mulai:   '',
    tahun_selesai: '',
  }
}

// ── Summary renderer ──────────────────────────────────────────
function renderSummary(item: PerjalananHidupItem, _index: number) {
  const faseConfig = item.fase ? FASE_CONFIG[item.fase as Exclude<FaseHidup, ''>] : null

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {faseConfig && (
          <span className="mr-1.5">{faseConfig.emoji}</span>
        )}
        {item.judul || (
          <span className="text-navy-500 italic">Fase belum diisi</span>
        )}
      </span>
      <span className="text-xs truncate">
        {faseConfig ? (
          <span className={faseConfig.color}>{faseConfig.label}</span>
        ) : (
          <span className="text-navy-500">Pilih fase hidup</span>
        )}
        {item.tahun_mulai && (
          <span className="text-navy-500 ml-1.5">
            · {item.tahun_mulai}
            {item.tahun_selesai ? ` – ${item.tahun_selesai}` : ''}
          </span>
        )}
      </span>
    </div>
  )
}

// ── Form renderer ─────────────────────────────────────────────
function renderForm(
  item: PerjalananHidupItem,
  onChange: (
    field: keyof PerjalananHidupItem,
    value: PerjalananHidupItem[keyof PerjalananHidupItem]
  ) => void
) {
  return (
    <div className="space-y-3">
      {/* Fase + Judul */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectInput
          label="Fase Kehidupan"
          value={item.fase}
          onChange={(v) => onChange('fase', v as FaseHidup)}
          options={OPTIONS_FASE_HIDUP}
          placeholder="Pilih fase…"
          required
        />
        <TextInput
          label="Judul / Tema Fase Ini"
          value={item.judul}
          onChange={(v) => onChange('judul', v)}
          placeholder='Contoh: "Bangkit dari Keterpurukan"'
          maxLength={80}
          required
        />
      </div>

      {/* Tahun */}
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Tahun Mulai"
          value={item.tahun_mulai}
          onChange={(v) => onChange('tahun_mulai', v)}
          placeholder="2010"
          min={1980}
          max={new Date().getFullYear()}
        />
        <NumberInput
          label="Tahun Selesai"
          value={item.tahun_selesai}
          onChange={(v) => onChange('tahun_selesai', v)}
          placeholder="2015 (kosongkan jika berlanjut)"
          min={1980}
          max={new Date().getFullYear()}
        />
      </div>

      {/* Cerita */}
      <TextArea
        label="Cerita Fase Ini"
        value={item.cerita}
        onChange={(v) => onChange('cerita', v)}
        placeholder="Apa yang terjadi di fase ini? Siapa yang berpengaruh? Apa tantangan terbesarmu? Ceritakan dengan jujur dan dari hati…"
        rows={5}
        maxLength={1000}
        showCount
        hint="Semakin personal dan jujur, semakin bermakna untuk pasanganmu membaca"
      />

      {/* Pelajaran */}
      <TextArea
        label="Pelajaran & Hikmah"
        value={item.pelajaran}
        onChange={(v) => onChange('pelajaran', v)}
        placeholder="Apa yang kamu pelajari dari fase ini? Bagaimana ini membentukmu menjadi siapa kamu sekarang?"
        rows={3}
        maxLength={500}
        showCount
      />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function Step05_PerjalananHidup() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('perjalananHidup')

  return (
    <div className="space-y-5">
      {/* Intro dengan nuansa Islami */}
      <SectionCard variant="highlight">
        <div className="space-y-2 text-center py-1">
          <p className="font-arabic text-xl text-gold-400">
            وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ
          </p>
          <p className="text-xs text-navy-400 italic">
            &ldquo;Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu&rdquo;
            <br />
            <span className="text-navy-500">— QS Al-Baqarah: 216</span>
          </p>
        </div>
      </SectionCard>

      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">🛤️</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Setiap fase hidupmu membentuk siapa kamu sekarang. Bagian ini
          memberi pasanganmu gambaran <strong className="text-white">perjalanan dan pertumbuhan</strong> dirimu —
          bukan hanya pencapaian, tapi juga proses dan hikmahnya.
        </p>
      </div>

      <DynamicList<PerjalananHidupItem>
        items={items}
        sectionTitle="Fase-Fase Perjalanan Hidup"
        itemLabel="Fase"
        emptyIcon="🛤️"
        emptyMessage="Mulai ceritakan perjalanan hidupmu. Tidak perlu sempurna — cerita autentikmu jauh lebih berharga."
        maxItems={8}
        createDefaultItem={createDefaultPerjalanan}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Panduan pengisian */}
      {items.length === 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-navy-400 text-center">
            Saran fase yang bisa kamu ceritakan:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(FASE_CONFIG).map(([key, config]) => (
              <div
                key={key}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-navy-800 bg-navy-900/40"
              >
                <span className="text-base">{config.emoji}</span>
                <span className={`text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}