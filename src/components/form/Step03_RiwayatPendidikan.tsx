'use client'

// ============================================================
// src/components/form/Step03_RiwayatPendidikan.tsx
// Step 3 (form step): Riwayat Pendidikan — DynamicList
// Perjalanan akademik: SD hingga S3, termasuk pesantren
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  TextArea,
  NumberInput,
  SelectInput,
} from '@/components/ui/FormFields'
import { OPTIONS_JENJANG_PENDIDIKAN, getMaxItemsForSection, CURRENT_YEAR } from '@/lib/constants'
import { useFormState } from '@/context/FormContext'
import type { RiwayatPendidikanItem } from '@/types'

function createDefaultPendidikan(): Omit<RiwayatPendidikanItem, 'id' | 'urutan'> {
  return {
    jenjang:          '',
    nama_institusi:   '',
    jurusan:          '',
    tahun_mulai:      '',
    tahun_selesai:    '',
    prestasi:         '',
  }
}

function renderSummary(item: RiwayatPendidikanItem, _index: number) {
  const yearRange =
    item.tahun_mulai
      ? item.tahun_selesai
        ? `${item.tahun_mulai} – ${item.tahun_selesai}`
        : `${item.tahun_mulai} – sekarang`
      : null

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.jenjang || item.nama_institusi || (
          <span className="text-navy-500 italic">Belum diisi</span>
        )}
      </span>
      <span className="text-xs text-navy-400 truncate">
        {item.nama_institusi && (
          <span className="text-sage-400">{item.nama_institusi}</span>
        )}
        {item.nama_institusi && yearRange && (
          <span className="mx-1 text-navy-600">·</span>
        )}
        {yearRange && <span>{yearRange}</span>}
      </span>
    </div>
  )
}

function renderForm(
  item: RiwayatPendidikanItem,
  onChange: (field: keyof RiwayatPendidikanItem, value: RiwayatPendidikanItem[keyof RiwayatPendidikanItem]) => void
) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectInput
          label="Jenjang Pendidikan"
          value={item.jenjang}
          onChange={(v) => onChange('jenjang', v)}
          options={OPTIONS_JENJANG_PENDIDIKAN}
          placeholder="Pilih jenjang…"
          required
        />
        <TextInput
          label="Nama Institusi"
          value={item.nama_institusi}
          onChange={(v) => onChange('nama_institusi', v)}
          placeholder="Contoh: SDN 1 Sukamaju, Pondok Pesantren Al-Hikmah"
          required
        />
      </div>

      <TextInput
        label="Jurusan / Program Studi"
        value={item.jurusan}
        onChange={(v) => onChange('jurusan', v)}
        placeholder="Contoh: Teknik Informatika, Agama Islam, IPA"
        hint="Bisa dikosongkan untuk jenjang SD/SMP"
      />

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Tahun Mulai"
          value={item.tahun_mulai}
          onChange={(v) => onChange('tahun_mulai', v)}
          placeholder="2010"
          min={1980}
          max={CURRENT_YEAR}
        />
        <NumberInput
          label="Tahun Selesai"
          value={item.tahun_selesai}
          onChange={(v) => onChange('tahun_selesai', v)}
          placeholder="2016 (kosongkan jika masih berlangsung)"
          min={1980}
          max={CURRENT_YEAR + 5}
        />
      </div>

      <TextArea
        label="Prestasi (opsional)"
        value={item.prestasi}
        onChange={(v) => onChange('prestasi', v)}
        placeholder="Contoh: Juara 2 Olimpiade Matematika, Lulus cum laude, Penghargaan santri teladan…"
        rows={3}
        maxLength={300}
        showCount
        hint="Prestasi akademik maupun non-akademik yang relevan"
      />
    </div>
  )
}

export function Step03_RiwayatPendidikan() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('riwayatPendidikan')
  const { plan } = useFormState()
  const maxItems = getMaxItemsForSection('riwayatPendidikan', plan as 'free' | 'pro')

  return (
    <div className="space-y-5"> {/* ← was space-y-4 */}
      {/* Intro card */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">🎓</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Ceritakan perjalanan pendidikanmu — dari sekolah dasar hingga
          pendidikan terakhir. Jangan lupa sertakan{' '}
          <strong className="text-white">riwayat pesantren</strong> jika ada,
          karena ini sangat penting dalam CV Taaruf.
        </p>
      </div>

      <DynamicList<RiwayatPendidikanItem>
        items={items}
        sectionTitle="Riwayat Pendidikan"
        itemLabel="Pendidikan"
        emptyIcon="🎓"
        emptyMessage="Belum ada riwayat pendidikan. Tambahkan pendidikan pertamamu."
        maxItems={maxItems}
        createDefaultItem={createDefaultPendidikan}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {items.length === 0 && (
        <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
          <span className="text-lg flex-shrink-0">💡</span>
          <p className="text-xs text-gold-400/80 leading-relaxed">
            <strong className="text-gold-400">Saran:</strong> Sertakan semua
            jenjang pendidikan mulai dari SD, SMP, SMA/SMK, hingga pendidikan
            terakhir. Jika pernah belajar di{' '}
            <strong className="text-gold-400">pesantren</strong>, tambahkan juga
            sebagai item terpisah — ini sangat diperhatikan oleh calon pasangan.
          </p>
        </div>
      )}
    </div>
  )
}