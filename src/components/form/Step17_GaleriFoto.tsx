'use client'

// ============================================================
// src/components/form/Step17_GaleriFoto.tsx
// Step 17 (form step): Galeri Foto — DynamicList + File Upload
//
// Fitur:
// - Upload foto langsung dari perangkat (max 500KB, auto-compress)
// - Preview thumbnail sebelum simpan
// - Pilihan kategori & keterangan per foto
// - Tetap bisa input URL manual (opsional)
// ============================================================

/* eslint-disable @next/next/no-img-element */

import React, { useRef, useState, useCallback } from 'react'
import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  SelectInput,
  TextInput,
} from '@/components/ui/FormFields'
import { OPTIONS_KATEGORI_GALERI, getMaxItemsForSection } from '@/lib/constants'
import { uploadPhoto } from '@/lib/supabase/uploadPhoto'
import { useRequireAuth } from '@/context/AuthContext'
import type { GaleriFotoItem } from '@/types'

function createDefaultGaleri(): Omit<GaleriFotoItem, 'id' | 'urutan'> {
  return {
    kategori: 'formal',
    url: '',
    keterangan: '',
  }
}

// ── Summary (collapsed mode) ───────────────────────────────
function renderSummary(item: GaleriFotoItem, _index: number) {
  const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max)}…` : text

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Thumbnail */}
      {item.url ? (
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-navy-700">
          <img
            src={item.url}
            alt="Thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-navy-700 flex items-center justify-center">
          <svg className="w-4 h-4 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </div>
      )}

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
    </div>
  )
}

// ── Form (expanded mode) with File Upload ───────────────────
function renderForm(
  item: GaleriFotoItem,
  onChange: (field: keyof GaleriFotoItem, value: GaleriFotoItem[keyof GaleriFotoItem]) => void
) {
  return <GaleriFotoForm item={item} onChange={onChange} />
}

// ── Sub-component: Form dengan Upload ───────────────────────
interface GaleriFotoFormProps {
  item: GaleriFotoItem
  onChange: (field: keyof GaleriFotoItem, value: GaleriFotoItem[keyof GaleriFotoItem]) => void
}

function GaleriFotoForm({ item, onChange }: GaleriFotoFormProps) {
  const { userId } = useRequireAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!userId) {
        setUploadError('Kamu harus login untuk mengupload foto.')
        return
      }

      // Validasi client-side cepat
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')
        return
      }

      // Reset state
      setUploadError(null)
      setIsUploading(true)
      setUploadProgress('Mengompres gambar…')

      try {
        const result = await uploadPhoto(file, userId, 'gallery-photos')

        if (result.success && result.publicUrl) {
          onChange('url', result.publicUrl)
          setUploadProgress('')
        } else {
          setUploadError(result.error ?? 'Upload gagal. Coba lagi.')
        }
      } catch {
        setUploadError('Terjadi kesalahan saat upload. Coba lagi.')
      } finally {
        setIsUploading(false)
        // Reset file input agar bisa upload file yang sama
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [userId, onChange]
  )

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div>
        <label className="block text-xs font-medium text-navy-300 mb-1.5">
          Foto
        </label>

        {item.url ? (
          /* Preview mode — tampilkan gambar + tombol ganti */
          <div className="space-y-2">
            <div className="relative group rounded-xl overflow-hidden border border-navy-700">
              <img
                src={item.url}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              {/* Overlay ganti/hapus */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={() => onChange('url', '')}
                  className="px-3 py-2 rounded-lg bg-red-500/30 text-white text-xs font-medium hover:bg-red-500/50 transition-colors backdrop-blur-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
            <p className="text-xs text-navy-500 truncate">
              {item.url}
            </p>
          </div>
        ) : (
          /* Upload area kosong */
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={[
                'w-full py-8 rounded-xl border-2 border-dashed transition-all',
                'flex flex-col items-center justify-center gap-2',
                isUploading
                  ? 'border-sage-700 bg-sage-900/20 cursor-wait'
                  : 'border-navy-600 bg-navy-800/30 hover:border-sage-600 hover:bg-sage-900/10 cursor-pointer',
              ].join(' ')}
            >
              {isUploading ? (
                <>
                  <div className="auth-spinner" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '2px' }} />
                  <span className="text-xs text-sage-400">{uploadProgress}</span>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs text-navy-400">Klik untuk pilih foto</span>
                  <span className="text-[10px] text-navy-600">JPG, PNG, WebP — Maks 500KB (auto-compress)</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload foto"
            />
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {uploadError}
          </p>
        )}
      </div>

      {/* Kategori */}
      <SelectInput
        label="Kategori Foto"
        value={item.kategori}
        onChange={(v) => onChange('kategori', v)}
        options={OPTIONS_KATEGORI_GALERI}
        placeholder="Pilih kategori…"
      />

      {/* Keterangan */}
      <TextInput
        label="Keterangan"
        value={item.keterangan}
        onChange={(v) => onChange('keterangan', v)}
        placeholder="Foto saat wisuda, bersama keluarga, dll"
        maxLength={200}
      />

      {/* URL Manual (opsional — toggle) */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-xs text-navy-500 hover:text-navy-300 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showUrlInput ? 'M4.5 15.75l7.5-7.5 7.5 7.5' : 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13L3 21l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z'} />
          </svg>
          {showUrlInput ? 'Tutup input URL' : 'Atau tempel URL manual'}
        </button>

        {showUrlInput && (
          <div className="mt-2">
            <TextInput
              label="Link Foto (Manual)"
              value={item.url}
              onChange={(v) => onChange('url', v)}
              type="url"
              placeholder="https://link-gambar.com/foto.jpg"
              hint="Gunakan jika ingin memasukkan link dari eksternal"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Step Component ────────────────────────────────────
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
        maxItems={getMaxItemsForSection('galeriFoto', 'pro')}
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
          <strong className="text-gold-400">Pastikan foto yang kamu upload sopan</strong>{' '}
          dan sesuai adab Islami. Gunakan foto formal untuk kesan pertama yang baik.
          Foto akan otomatis dikompres ke maks 500KB. Maksimal 12 foto.
        </p>
      </div>
    </div>
  )
}