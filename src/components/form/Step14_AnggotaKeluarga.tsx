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
import type { AnggotaKeluargaItem, HubunganKeluarga } from '@/types'

/**
 * Helper untuk merender ringkasan (collapsed state)
 */
const renderSummary = (item: AnggotaKeluargaItem) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-medium text-white truncate">
      {item.nama || <span className="text-navy-500 italic font-normal">Nama belum diisi</span>}
    </span>
    <div className="flex items-center gap-1.5 text-xs text-navy-400">
      <span className="px-1.5 py-0.5 rounded bg-sage-900/40 text-sage-400 border border-sage-800/50">
        {item.hubungan}
      </span>
      {item.pekerjaan && (
        <>
          <span className="text-navy-600">•</span>
          <span className="truncate">{item.pekerjaan}</span>
        </>
      )}
    </div>
  </div>
)

/**
 * Helper untuk merender form input (expanded state)
 */
const renderForm = (
  item: AnggotaKeluargaItem,
  onChange: (field: keyof AnggotaKeluargaItem, value: any) => void
) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <SelectInput
      label="Hubungan Keluarga"
      value={item.hubungan}
      onChange={(val) => onChange('hubungan', val as HubunganKeluarga)}
      options={OPTIONS_HUBUNGAN_KELUARGA}
      placeholder="Pilih hubungan..."
    />
    <TextInput
      label="Nama Lengkap"
      value={item.nama}
      onChange={(val) => onChange('nama', val)}
      placeholder="Contoh: Budi Santoso"
    />
    <TextInput
      label="Pendidikan Terakhir"
      value={item.pendidikan || ''}
      onChange={(val) => onChange('pendidikan', val)}
      placeholder="Contoh: S1 Hukum"
    />
    <TextInput
      label="Pekerjaan"
      value={item.pekerjaan || ''}
      onChange={(val) => onChange('pekerjaan', val)}
      placeholder="Contoh: Karyawan Swasta"
    />
    <div className="sm:col-span-2">
      <TextArea
        label="Keterangan (Opsional)"
        value={item.keterangan || ''}
        onChange={(val) => onChange('keterangan', val)}
        placeholder="Informasi tambahan (domisili, hobi, atau status khusus)"
        rows={2}
      />
    </div>
  </div>
)

export function Step14_AnggotaKeluarga() {
  const { items, addItem, removeItem, updateItem } = useArraySection('anggotaKeluarga')

  return (
    <div className="space-y-6">
      {/* Edu Info Box */}
      <div className="p-4 rounded-2xl bg-navy-900/40 border border-navy-800/60 flex gap-3">
        <span className="text-xl">👨‍👩‍👧‍👦</span>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Informasi Keluarga</p>
          <p className="text-xs text-navy-400 leading-relaxed">
            Berikan gambaran singkat mengenai keluarga inti Anda (Ayah, Ibu, dan Saudara). 
            Ini membantu calon pasangan memahami lingkungan tempat Anda tumbuh.
          </p>
        </div>
      </div>

      <DynamicList<AnggotaKeluargaItem>
        sectionTitle="Daftar Keluarga Inti"
        itemLabel="Anggota Keluarga"
        items={items as AnggotaKeluargaItem[]}
        emptyIcon="👪"
        emptyMessage="Anda belum menambahkan daftar keluarga. Mulai dengan menambahkan Ayah atau Ibu."
        
        // Sesuai dengan prop createDefaultItem di DynamicList.tsx
        createDefaultItem={() => ({
          hubungan: 'Lainnya',
          nama: '',
          pekerjaan: '',
          pendidikan: '',
          keterangan: '',
        })}

        renderSummary={renderSummary}
        renderForm={renderForm}
        
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />
    </div>
  )
}