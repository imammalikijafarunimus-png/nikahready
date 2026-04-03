'use client'

// ============================================================
// src/components/form/Step18_FotoTemplate.tsx
// Step 18 (form step): Foto & Template Pilihan — scalar section
// Pilih foto utama (upload/pribadi/formal), dan template desain CV Taaruf
//
// Fitur:
// - Upload foto langsung dari perangkat (auto-compress 500KB)
// - Preview foto sebelum simpan
// - Pilihan template CV (free & premium)
// ============================================================

import React, { useRef, useState, useCallback } from 'react'
import { useFormState, useFormDispatch } from '@/context/FormContext'
import { useRequireAuth } from '@/context/AuthContext'
import {
  TextInput,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_TEMPLATE } from '@/lib/constants'
import { uploadPhoto } from '@/lib/supabase/uploadPhoto'
import type { FotoTemplate, TemplatePilihan } from '@/types'

// ── Sub-component: Photo Uploader ──────────────────────────
interface PhotoUploaderProps {
  label: string
  hint: string
  value: string           // URL foto saat ini
  onUploaded: (url: string) => void
  optional?: boolean
}

function PhotoUploader({ label, hint, value, onUploaded, optional }: PhotoUploaderProps) {
  const { userId } = useRequireAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!userId) {
        setUploadError('Kamu harus login untuk mengupload foto.')
        return
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')
        return
      }

      setUploadError(null)
      setIsUploading(true)

      try {
        const result = await uploadPhoto(file, userId, 'profile-photos')

        if (result.success && result.publicUrl) {
          onUploaded(result.publicUrl)
        } else {
          setUploadError(result.error ?? 'Upload gagal. Coba lagi.')
        }
      } catch {
        setUploadError('Terjadi kesalahan saat upload. Coba lagi.')
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [userId, onUploaded]
  )

  const handleRemove = useCallback(() => {
    onUploaded('')
  }, [onUploaded])

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-navy-300">
        {label}
        {optional && <span className="text-navy-600 ml-1">(Opsional)</span>}
      </label>

      {value ? (
        /* Preview mode */
        <div className="space-y-2">
          <div className="relative group rounded-xl overflow-hidden border border-navy-700 bg-navy-800/50">
            <img
              src={value}
              alt={label}
              className="w-full h-56 object-cover"
            />
            {/* Overlay ganti/hapus */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-2 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors backdrop-blur-sm disabled:opacity-50"
              >
                {isUploading ? 'Mengupload…' : 'Ganti Foto'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 rounded-lg bg-red-500/30 text-white text-xs font-medium hover:bg-red-500/50 transition-colors backdrop-blur-sm"
              >
                Hapus
              </button>
            </div>
          </div>
          <p className="text-[10px] text-navy-600 truncate">{value}</p>
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
                <span className="text-xs text-sage-400">Mengompres & mengupload…</span>
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
            aria-label={`Upload ${label}`}
          />
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {uploadError}
        </p>
      )}

      {/* Hint */}
      {!value && !uploadError && (
        <p className="text-[10px] text-navy-600">{hint}</p>
      )}

      {/* URL Manual (opsional toggle) */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-[10px] text-navy-600 hover:text-navy-400 transition-colors flex items-center gap-1 mt-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showUrlInput ? 'M4.5 15.75l7.5-7.5 7.5 7.5' : 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13L3 21l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z'} />
          </svg>
          {showUrlInput ? 'Tutup input URL' : 'Atau tempel URL manual'}
        </button>

        {showUrlInput && (
          <div className="mt-1.5">
            <TextInput
              label=""
              value={value}
              onChange={(v) => onUploaded(v)}
              type="url"
              placeholder="https://link-foto.jpg"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Step Component ────────────────────────────────────
export function Step18_FotoTemplate() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const { plan } = useRequireAuth()
  const data     = state.fotoTemplate

  function update<K extends keyof FotoTemplate>(
    field: K,
    value: FotoTemplate[K]
  ) {
    dispatch({
      type: 'UPDATE_FIELD',
      section: 'fotoTemplate',
      field,
      value,
    })
  }

  return (
    <div className="space-y-5">
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          إِنَّمَا أُنْزِلَ مِنَ الْقُرْآنِ فَهُو هُدًى وَرَحْمَة
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &ldquo;Al-Qur&apos;an diturunkan sebagai petunjuk dan rahmat&rdquo; — QS Al-A&apos;raf: 52
        </p>
      </div>

      <SectionCard title="Foto Utama" icon="🖼️">
        <PhotoUploader
          label="Foto Pribadi (Profil)"
          hint="Foto utama yang akan tampil di halaman pertama CV"
          value={data.foto_pribadi_url}
          onUploaded={(url) => update('foto_pribadi_url', url)}
        />

        <div className="h-px bg-navy-700/50 my-4" />

        <PhotoUploader
          label="Foto Formal"
          hint="Foto formal opsional, tampil di halaman terakhir CV"
          value={data.foto_formal_url}
          onUploaded={(url) => update('foto_formal_url', url)}
          optional
        />
      </SectionCard>

      <SectionCard title="Pilih Template CV" icon="🎨">
        <div className="space-y-3">
          {OPTIONS_TEMPLATE.map((tmpl) => {
            const isSelected = data.template_pilihan === tmpl.value
            const isLocked = tmpl.isPremiumOnly && plan !== 'premium'
            const isCurrent = isSelected && !isLocked

            return (
              <button
                key={tmpl.value}
                type="button"
                disabled={isLocked}
                onClick={() => !isLocked && update('template_pilihan', tmpl.value as TemplatePilihan)}
                className={[
                  'w-full text-left p-4 rounded-2xl border-2 transition-all',
                  isCurrent
                    ? 'border-sage-500 bg-sage-900/30 shadow-card'
                    : isLocked
                      ? 'border-navy-700 bg-navy-900/40 opacity-50 cursor-not-allowed'
                      : 'border-navy-700 bg-navy-800/50 hover:border-sage-700',
                ].join(' ')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {isCurrent && <span className="text-sage-400">✓</span>}
                      <span className="text-sm font-semibold text-white">{tmpl.label}</span>
                      {isLocked && (
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-gold-900/30 border border-gold-700/40 text-gold-400 ml-2">
                          PRO
                        </span>
                      )}
                      {!tmpl.isPremiumOnly && !isSelected && (
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-sage-900/30 border border-sage-700/40 text-sage-400 ml-2">
                          Free
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-400 mt-1">{tmpl.description}</p>
                  </div>
                  {isLocked && (
                    <svg className="w-4 h-4 text-navy-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a2.25 2.25 0 00-2.25-2.25h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </SectionCard>

      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          <strong className="text-gold-400">Template gratis tersedia untuk semua pengguna.</strong>{' '}
          Template premium memerlukan NikahReady Pro. Pastikan foto yang kamu upload
          berkualitas baik, sopan, dan sesuai adab Islami. Foto otomatis dikompres ke maks 500KB.
        </p>
      </div>
    </div>
  )
}