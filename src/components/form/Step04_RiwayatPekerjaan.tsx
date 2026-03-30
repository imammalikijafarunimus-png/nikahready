'use client'

// ============================================================
// src/components/form/Step04_RiwayatPekerjaan.tsx
// Step 4 (form step): Riwayat Pekerjaan — DynamicList
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  TextArea,
  NumberInput,
  ToggleSwitch,
} from '@/components/ui/FormFields'
import type { RiwayatPekerjaanItem } from '@/types'

// ── Default item factory ──────────────────────────────────────
function createDefaultPekerjaan(): Omit<RiwayatPekerjaanItem, 'id' | 'urutan'> {
  return {
    nama_perusahaan:     '',
    posisi_jabatan:      '',
    deskripsi_pekerjaan: '',
    is_masih_aktif:      false,
    tahun_mulai:         '',
    tahun_selesai:       '',
  }
}

// ── Summary renderer (collapsed state) ───────────────────────
function renderSummary(item: RiwayatPekerjaanItem, _index: number) {
  const yearRange = item.is_masih_aktif
    ? `${item.tahun_mulai || '?'} – sekarang`
    : item.tahun_mulai
    ? `${item.tahun_mulai}${item.tahun_selesai ? ` – ${item.tahun_selesai}` : ''}`
    : null

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.posisi_jabatan || item.nama_perusahaan || (
          <span className="text-navy-500 italic">Belum diisi</span>
        )}
      </span>
      <span className="text-xs text-navy-400 truncate">
        {item.nama_perusahaan && (
          <span className="text-sage-400">{item.nama_perusahaan}</span>
        )}
        {item.nama_perusahaan && yearRange && (
          <span className="mx-1 text-navy-600">·</span>
        )}
        {yearRange && <span>{yearRange}</span>}
      </span>
    </div>
  )
}

// ── Form renderer (expanded state) ───────────────────────────
function renderForm(
  item: RiwayatPekerjaanItem,
  onChange: (field: keyof RiwayatPekerjaanItem, value: RiwayatPekerjaanItem[keyof RiwayatPekerjaanItem]) => void
) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          label="Nama Perusahaan / Instansi"
          value={item.nama_perusahaan}
          onChange={(v) => onChange('nama_perusahaan', v)}
          placeholder="PT. Contoh Maju, Kemenag, dll"
          required
        />
        <TextInput
          label="Posisi / Jabatan"
          value={item.posisi_jabatan}
          onChange={(v) => onChange('posisi_jabatan', v)}
          placeholder="Software Engineer, Guru, dll"
          required
        />
      </div>

      <TextArea
        label="Deskripsi Pekerjaan"
        value={item.deskripsi_pekerjaan}
        onChange={(v) => onChange('deskripsi_pekerjaan', v)}
        placeholder="Jelaskan tanggung jawab, pencapaian, atau hal yang kamu kerjakan…"
        rows={3}
        maxLength={500}
        showCount
      />

      {/* Toggle: masih aktif */}
      <ToggleSwitch
        label="Masih bekerja di sini"
        description="Aktifkan jika ini adalah pekerjaan saat ini"
        checked={item.is_masih_aktif}
        onChange={(v) => onChange('is_masih_aktif', v)}
      />

      {/* Tahun masuk & keluar */}
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Tahun Mulai"
          value={item.tahun_mulai}
          onChange={(v) => onChange('tahun_mulai', v)}
          placeholder="2020"
          min={1990}
          max={new Date().getFullYear()}
        />
        {!item.is_masih_aktif && (
          <NumberInput
            label="Tahun Selesai"
            value={item.tahun_selesai}
            onChange={(v) => onChange('tahun_selesai', v)}
            placeholder="2023"
            min={1990}
            max={new Date().getFullYear()}
          />
        )}
        {item.is_masih_aktif && (
          <div className="flex items-end pb-3">
            <span className="text-sm text-sage-400 font-medium">— Sekarang ✓</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function Step04_RiwayatPekerjaan() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('riwayatPekerjaan')

  return (
    <div className="space-y-4">
      {/* Intro card */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💼</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Ceritakan perjalanan karirmu — dari pengalaman pertama hingga
          pekerjaan saat ini. Urutkan dari yang <strong className="text-white">terbaru</strong>.
          Kamu bisa menambahkan sebanyak yang diperlukan.
        </p>
      </div>

      <DynamicList<RiwayatPekerjaanItem>
        items={items}
        sectionTitle="Pengalaman Pekerjaan"
        itemLabel="Pengalaman"
        emptyIcon="💼"
        emptyMessage="Belum ada riwayat pekerjaan. Tambahkan pengalaman kerja pertamamu."
        maxItems={15}
        createDefaultItem={createDefaultPekerjaan}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Tips untuk fresh graduate */}
      {items.length === 0 && (
        <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
          <span className="text-lg flex-shrink-0">🎓</span>
          <p className="text-xs text-gold-400/80 leading-relaxed">
            <strong className="text-gold-400">Fresh graduate?</strong>{' '}
            Kamu bisa menambahkan magang, freelance, atau
            pekerjaan sambilan yang pernah dilakukan.
          </p>
        </div>
      )}
    </div>
  )
}
