'use client'

// ============================================================
// src/components/form/Step18_FotoTemplate.tsx
// Step 18 (form step): Foto & Template Pilihan — scalar section
// Pilih foto utama, foto formal, dan template desain CV Taaruf
// ============================================================

import { useFormState, useFormDispatch } from '@/context/FormContext'
import { useRequireAuth } from '@/context/AuthContext'
import {
  TextInput,
  SectionCard,
} from '@/components/ui/FormFields'
import { OPTIONS_TEMPLATE } from '@/lib/constants'
import type { FotoTemplate, TemplatePilihan } from '@/types'

// ── Main Component ────────────────────────────────────────────
export function Step18_FotoTemplate() {
  const state    = useFormState()
  const dispatch = useFormDispatch()
  const { plan } = useRequireAuth()
  const data     = state.fotoTemplate

  // Type-safe field updater
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
    <div className="space-y-4">
      {/* ── Islamic guidance ──────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          إِنَّمَا أُنْزِلَ مِنَ الْقُرْآنِ فَهُو هُدًى وَرَحْمَة
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &ldquo;Al-Qur&apos;an diturunkan sebagai petunjuk dan rahmat&rdquo; — QS Al-A&apos;raf: 52
        </p>
      </div>

      {/* ── 1. Foto Utama ─────────────────────────────────────── */}
      <SectionCard title="Foto Utama" icon="🖼️">
        <TextInput
          label="Foto Pribadi (Profil)"
          value={data.foto_pribadi_url}
          onChange={(v) => update('foto_pribadi_url', v)}
          type="url"
          placeholder="https://link-foto-profil.jpg"
          hint="URL foto utama yang akan tampil di halaman pertama CV"
        />

        <TextInput
          label="Foto Formal (Opsional)"
          value={data.foto_formal_url}
          onChange={(v) => update('foto_formal_url', v)}
          type="url"
          placeholder="https://link-foto-formal.jpg"
          hint="URL foto formal (opsional, tampil di halaman terakhir)"
        />
      </SectionCard>

      {/* ── 2. Pilih Template CV ─────────────────────────────── */}
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

      {/* ── Tips ──────────────────────────────────────────────── */}
      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          <strong className="text-gold-400">Template Akademik tersedia gratis.</strong>{' '}
          Template lainnya memerlukan NikahReady Pro. Pastikan foto yang kamu gunakan
          berkualitas baik dan menampilkan diri dengan sopan.
        </p>
      </div>
    </div>
  )
}
