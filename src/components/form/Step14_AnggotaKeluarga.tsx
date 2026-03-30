'use client'

// ============================================================
// src/components/form/Step14_AnggotaKeluarga.tsx
// Step 14 (form step): Anggota Keluarga — DynamicList
// Struktur keluarga dan latar belakang anggota keluarga
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  TextArea,
  SelectInput,
} from '@/components/ui/FormFields'
import { OPTIONS_HUBUNGAN_KELUARGA } from '@/lib/constants'
import type { AnggotaKeluargaItem } from '@/types'

// ── Default item factory ──────────────────────────────────────
function createDefaultAnggotaKeluarga(): Omit<AnggotaKeluargaItem, 'id' | 'urutan'> {
  return {
    hubungan: '',
    nama: '',
    pekerjaan: '',
    pendidikan: '',
    keterangan: '',
  }
}

// ── Summary renderer (collapsed state) ───────────────────────
function renderSummary(item: AnggotaKeluargaItem, _index: number) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.nama || (
          <span className="text-navy-500 italic">Belum diisi</span>
        )}
      </span>
      <span className="text-xs text-navy-400 truncate">
        {item.hubungan && (
          <span className="text-sage-400">{item.hubungan}</span>
        )}
        {item.hubungan && item.nama && (
          <span className="mx-1 text-navy-600">·</span>
        )}
        {item.pekerjaan && <span>{item.pekerjaan}</span>}
      </span>
    </div>
  )
}

// ── Form renderer (expanded state) ───────────────────────────
function renderForm(
  item: AnggotaKeluargaItem,
  onChange: (field: keyof AnggotaKeluargaItem, value: AnggotaKeluargaItem[keyof AnggotaKeluargaItem]) => void
) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectInput
          label="Hubungan"
          value={item.hubungan}
          onChange={(v) => onChange('hubungan', v)}
          options={OPTIONS_HUBUNGAN_KELUARGA}
          placeholder="Pilih hubungan…"
          required
        />
        <TextInput
          label="Nama Lengkap"
          value={item.nama}
          onChange={(v) => onChange('nama', v)}
          placeholder="Nama anggota keluarga"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          label="Pekerjaan"
          value={item.pekerjaan}
          onChange={(v) => onChange('pekerjaan', v)}
          placeholder="PNS, Wiraswasta, IRT, dll"
        />
        <TextInput
          label="Pendidikan Terakhir"
          value={item.pendidikan}
          onChange={(v) => onChange('pendidikan', v)}
          placeholder="SMA, S1, S2, dll"
        />
      </div>

      <TextArea
        label="Keterangan Tambahan"
        value={item.keterangan}
        onChange={(v) => onChange('keterangan', v)}
        placeholder="Informasi tambahan (opsional) — status kesehatan, tempat tinggal, dll"
        rows={3}
        maxLength={300}
        showCount
      />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function Step14_AnggotaKeluarga() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('anggotaKeluarga')

  return (
    <div className="space-y-4">
      {/* Intro card */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">👨‍👩‍👧‍👦</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Struktur keluarga penting untuk mengetahui <strong className="text-white">latar belakang seseorang</strong>.
          Sertakan orang tua, saudara kandung, dan wali jika berbeda dengan ayah/ibu kandung.
        </p>
      </div>

      <DynamicList<AnggotaKeluargaItem>
        items={items}
        sectionTitle="Anggota Keluarga"
        itemLabel="Anggota Keluarga"
        emptyIcon="👨‍👩‍👧‍👦"
        emptyMessage="Belum ada data anggota keluarga. Tambahkan anggota keluargamu."
        maxItems={15}
        createDefaultItem={createDefaultAnggotaKeluarga}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Tips tentang wali */}
      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          <strong className="text-gold-400">Sertakan wali</strong> jika berbeda dengan ayah/ibu kandung — wali adalah
          pihak yang bertanggung jawab dalam proses ta&apos;aruf. Ini penting menurut syariat Islam.
        </p>
      </div>
    </div>
  )
}
