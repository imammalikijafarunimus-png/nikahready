'use client'

// ============================================================
// src/components/form/Step01_DataPribadi.tsx
// Step 1: Data Pribadi — semua field scalar
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import {
  TextInput,
  SelectInput,
  DateInput,
  NumberInput,
  SectionCard,
} from '@/components/ui/FormFields'
import {
  OPTIONS_STATUS_PERNIKAHAN,
  PROVINSI_INDONESIA,
} from '@/lib/constants'
import type { DataPribadi } from '@/types'

// Daftar suku bangsa umum di Indonesia
const OPTIONS_SUKU = [
  'Jawa', 'Sunda', 'Batak', 'Madura', 'Melayu', 'Minangkabau',
  'Bugis', 'Makassar', 'Betawi', 'Dayak', 'Sasak', 'Bali',
  'Aceh', 'Banjar', 'Flores', 'Manado', 'Ambon', 'Papua', 'Lainnya',
].map((v) => ({ value: v, label: v }))

export function Step01_DataPribadi() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const data     = state.dataPribadi

  // Type-safe field updater
  function update<K extends keyof DataPribadi>(
    field: K,
    value: DataPribadi[K]
  ) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'dataPribadi',
      field,
      value,
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
        <p className="text-xs text-navy-500 mt-1">
          Bismillah, mulai dengan yang baik
        </p>
      </div>

      {/* ── 1. Nama & Identitas ────────────────────────────── */}
      <SectionCard title="Nama & Identitas" icon="👤">
        <TextInput
          label="Nama Lengkap"
          value={data.nama_lengkap}
          onChange={(v) => update('nama_lengkap', v)}
          placeholder="Nama sesuai KTP"
          required
          maxLength={100}
          hint="Nama yang akan tampil di CV Taaruf"
          autoComplete="name"
        />
        <TextInput
          label="Nama Panggilan"
          value={data.nama_panggilan}
          onChange={(v) => update('nama_panggilan', v)}
          placeholder="Contoh: Umar, Fatimah"
          maxLength={30}
        />
      </SectionCard>

      {/* ── 2. Tanggal Lahir & Asal ────────────────────────── */}
      <SectionCard title="Kelahiran & Asal Daerah" icon="🗓️">
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Tempat Lahir"
            value={data.tempat_lahir}
            onChange={(v) => update('tempat_lahir', v)}
            placeholder="Kota kelahiran"
            className="col-span-2 sm:col-span-1"
          />
          <DateInput
            label="Tanggal Lahir"
            value={data.tanggal_lahir}
            onChange={(v) => update('tanggal_lahir', v)}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <SelectInput
          label="Suku Bangsa"
          value={data.suku_bangsa}
          onChange={(v) => update('suku_bangsa', v)}
          options={OPTIONS_SUKU}
          placeholder="Pilih suku bangsa…"
        />

        <TextInput
          label="Kewarganegaraan"
          value={data.kewarganegaraan}
          onChange={(v) => update('kewarganegaraan', v)}
          placeholder="Indonesia"
        />
      </SectionCard>

      {/* ── 3. Domisili ────────────────────────────────────── */}
      <SectionCard title="Domisili Saat Ini" icon="📍">
        <TextInput
          label="Kota Domisili"
          value={data.domisili_kota}
          onChange={(v) => update('domisili_kota', v)}
          placeholder="Kota tempat tinggal sekarang"
          hint="Bisa berbeda dengan kota asal / KTP"
        />
        <SelectInput
          label="Provinsi"
          value={data.domisili_provinsi}
          onChange={(v) => update('domisili_provinsi', v)}
          options={PROVINSI_INDONESIA}
          placeholder="Pilih provinsi…"
        />
      </SectionCard>

      {/* ── 4. Status Pernikahan ──────────────────────────── */}
      <SectionCard title="Status Pernikahan" icon="💍">
        <SelectInput
          label="Status Pernikahan"
          value={data.status_pernikahan}
          onChange={(v) =>
            update('status_pernikahan', v as DataPribadi['status_pernikahan'])
          }
          options={OPTIONS_STATUS_PERNIKAHAN}
          placeholder="Pilih status…"
          required
        />

        {/* Tampilkan jumlah anak hanya jika bukan lajang */}
        {data.status_pernikahan !== '' &&
          data.status_pernikahan !== 'lajang' && (
            <NumberInput
              label="Jumlah Anak"
              value={data.jumlah_anak}
              onChange={(v) => update('jumlah_anak', typeof v === 'number' ? v : 0)}
              min={0}
              max={20}
              placeholder="0"
              hint="Isi 0 jika tidak memiliki anak"
            />
          )}
      </SectionCard>

      {/* ── Tips ──────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Data ini akan ditampilkan di halaman pertama CV Taarufmu.
          Isi dengan jujur dan apa adanya — kejujuran adalah pondasi
          ta'aruf yang baik.
        </p>
      </div>
    </div>
  )
}
