'use client'

// ============================================================
// src/components/form/Step20_Referensi.tsx
// Step 20 (form step): Referensi — Kontak referensi dari
// ustadz/ustadzah, keluarga, atau sahabat yang bisa dihubungi.
// Local state (belum tersimpan ke Supabase, hanya di browser).
// ============================================================

import { useState } from 'react'
import { generateId } from '@/context/FormContext'
import { TextInput, TextArea, SectionCard } from '@/components/ui/FormFields'

interface ReferensiItem {
  id: string
  nama: string
  hubungan: string
  kontak: string
  catatan: string
}

const MAX_ITEMS = 5

export function Step20_Referensi() {
  const [referensiList, setReferensiList] = useState<ReferensiItem[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleAdd() {
    if (referensiList.length >= MAX_ITEMS) return
    setReferensiList((prev) => [
      ...prev,
      { id: generateId(), nama: '', hubungan: '', kontak: '', catatan: '' },
    ])
  }

  function handleRemove(id: string) {
    if (confirmDelete === id) {
      setReferensiList((prev) => prev.filter((r) => r.id !== id))
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  function updateField(
    id: string,
    field: keyof ReferensiItem,
    value: string
  ) {
    setReferensiList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Bertolong-menolonglah kamu dalam (urusan) kebaikan dan takwa&quot;
          <br />
          <span className="text-navy-600">— QS Al-Maidah: 2</span>
        </p>
      </div>

      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">📋</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Referensi dari <strong className="text-white">ustadz/ustadzah atau guru ngaji</strong> sangat
          penting dalam proses ta&apos;aruf. Mereka bisa menjadi jembatan komunikasi
          yang lebih amanah dan adab-adabnya terjaga.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-navy-800 rounded-full">
          <div
            className="h-1 bg-sage-600 rounded-full transition-all duration-500"
            style={{
              width: `${Math.round((referensiList.length / MAX_ITEMS) * 100)}%`,
            }}
          />
        </div>
        <span className="text-xs text-navy-500 flex-shrink-0">
          {referensiList.length}/{MAX_ITEMS}
        </span>
      </div>

      {referensiList.map((ref, index) => (
        <SectionCard
          key={ref.id}
          title={`Referensi ${index + 1}`}
          icon={index === 0 ? '⭐' : '👤'}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextInput
                label="Nama"
                value={ref.nama}
                onChange={(v) => updateField(ref.id, 'nama', v)}
                placeholder="Nama lengkap"
                maxLength={100}
              />
              <TextInput
                label="Hubungan"
                value={ref.hubungan}
                onChange={(v) => updateField(ref.id, 'hubungan', v)}
                placeholder="Ustadz, Kakak, Sahabat, dll"
                maxLength={50}
              />
            </div>

            <TextInput
              label="Kontak"
              value={ref.kontak}
              onChange={(v) => updateField(ref.id, 'kontak', v)}
              placeholder="08xxxxxxxxxx atau @username"
              maxLength={100}
              hint="Nomor WhatsApp atau akun media sosial yang bisa dihubungi"
            />

            <TextArea
              label="Catatan (opsional)"
              value={ref.catatan}
              onChange={(v) => updateField(ref.id, 'catatan', v)}
              placeholder="Contoh: Ustadz di masjid tempat saya mengaji selama 5 tahun"
              rows={2}
              maxLength={200}
              showCount
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleRemove(ref.id)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  confirmDelete === ref.id
                    ? 'bg-red-900/60 border border-red-700 text-red-300'
                    : 'text-navy-500 hover:text-red-400 hover:bg-red-900/20',
                ].join(' ')}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                {confirmDelete === ref.id ? 'Klik lagi untuk hapus' : 'Hapus'}
              </button>
            </div>
          </div>
        </SectionCard>
      ))}

      {referensiList.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-navy-600 text-sm text-navy-400 hover:border-sage-600 hover:text-sage-400 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Referensi
        </button>
      )}

      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Idealnya referensi adalah orang yang <strong className="text-white">mengenalmu dengan baik</strong> secara
          keagamaan dan kepribadian. Minta izin kepada mereka sebelum menambahkan
          sebagai referensi. Konsultasi dengan wali juga sangat dianjurkan.
        </p>
      </div>
    </div>
  )
}