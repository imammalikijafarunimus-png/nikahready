'use client'

// ============================================================
// src/components/form/Step17_GaleriFoto.tsx
// Step 17 (form step): Galeri Foto — DynamicList
// Foto-foto pilihan untuk CV Taaruf (URL input only)
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  SelectInput,
} from '@/components/ui/FormFields'
import { OPTIONS_KATEGORI_GALERI } from '@/lib/constants'
import type { GaleriFotoItem } from '@/types'

function createDefaultGaleri(): Omit<GaleriFotoItem, 'id' | 'urutan'> {
  return {
    kategori: 'formal',
    url: '',
    keterangan: '',
  }
}

function renderSummary(item: GaleriFotoItem, _index: number) {
  const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max)}…` : text

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.kategori || (
          <span className="text-navy-500 italic">Belum diisi</span>
        )}
      </span>
      {item.keterangan && (
        <span className="text-xs text-navy-400 truncate">
          {truncate(item.keterangan, 60)}
        </span>
      )}
    </div>
  )
}

function renderForm(
  item: GaleriFotoItem,
  onChange: (field: keyof GaleriFotoItem, value: GaleriFotoItem[keyof GaleriFotoItem]) => void
) {
  return (
    <div className="space-y-3">
      <SelectInput
        label="Kategori Foto"
        value={item.kategori}
        onChange={(v) => onChange('kategori', v)}
        options={OPTIONS_KATEGORI_GALERI}
        placeholder="Pilih kategori…"
      />

      <TextInput
        label="Link Foto"
        value={item.url}
        onChange={(v) => onChange('url', v)}
        type="url"
        placeholder="https://link-gambar.com/foto.jpg"
        hint="Tempel link gambar dari Google Drive, Imgur, dll"
        required
      />

      <TextInput
        label="Keterangan"
        value={item.keterangan}
        onChange={(v) => onChange('keterangan', v)}
        placeholder="Foto saat wisuda, bersama keluarga, dll"
        maxLength={200}
      />
    </div>
  )
}

export function Step17_GaleriFoto() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('galeriFoto')

  return (
    <div className="space-y-5">
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">📸</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Foto memberikan gambaran tentang penampilan dan kehidupanmu.
          Tambahkan foto yang <strong className="text-white">representatif</strong> dan
          sopan sesuai adab Islami.
        </p>
      </div>

      <DynamicList<GaleriFotoItem>
        items={items}
        sectionTitle="Galeri Foto"
        itemLabel="Foto"
        emptyIcon="📸"
        emptyMessage="Belum ada foto. Tambahkan foto pertamamu."
        maxItems={12}
        createDefaultItem={createDefaultGaleri}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          <strong className="text-gold-400">Pastikan foto yang kamu tambahkan sopan</strong>{' '}
          dan sesuai adab Islami. Gunakan foto formal untuk kesan pertama yang baik.
          Upload langsung dari perangkat akan tersedia di pembaruan mendatang — untuk
          saat ini, gunakan link URL gambar.
        </p>
      </div>
    </div>
  )
}