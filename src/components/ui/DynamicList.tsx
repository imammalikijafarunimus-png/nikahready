'use client'

// ============================================================
// src/components/ui/DynamicList.tsx
//
// Generic component untuk menampilkan + mengelola array items.
// Dipakai oleh: Riwayat Pekerjaan, Pendidikan, Perjalanan Hidup,
//               Organisasi, Keluarga, Rencana Masa Depan, dll.
//
// Pattern: renderItem + renderForm (render props) untuk
// fleksibilitas total tanpa kehilangan type safety.
// ============================================================

import React, { useState } from 'react'
import { generateId } from '@/context/FormContext'

// ── Types ─────────────────────────────────────────────────────

// Setiap item array minimal punya `id` dan `urutan`
interface BaseItem {
  id: string
  urutan: number
}

interface DynamicListProps<T extends BaseItem> {
  // Data
  items: T[]
  sectionTitle: string          // "Riwayat Pekerjaan", dll
  itemLabel: string             // "Pengalaman Kerja", untuk tombol tambah
  emptyIcon?: string            // emoji untuk empty state
  emptyMessage?: string
  maxItems?: number

  // Default value untuk item baru — fungsi agar generateId() dipanggil fresh
  createDefaultItem: () => Omit<T, 'id' | 'urutan'>

  // Render props
  /**
   * Render ringkasan item saat mode list (collapsed).
   * Contoh: nama perusahaan + tahun
   */
  renderSummary: (item: T, index: number) => React.ReactNode

  /**
   * Render form fields untuk satu item saat mode edit (expanded).
   * item: data item saat ini
   * onChange: fungsi untuk update satu field
   */
  renderForm: (
    item: T,
    onChange: (field: keyof T, value: T[keyof T]) => void
  ) => React.ReactNode

  // Callbacks
  onAdd: (item: T) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, field: keyof T, value: T[keyof T]) => void
}

// ── Item Card (collapsed mode) ────────────────────────────────
interface ItemCardProps<T extends BaseItem> {
  item: T
  index: number
  isExpanded: boolean
  renderSummary: (item: T, index: number) => React.ReactNode
  renderForm: (
    item: T,
    onChange: (field: keyof T, value: T[keyof T]) => void
  ) => React.ReactNode
  onToggle: () => void
  onUpdate: (field: keyof T, value: T[keyof T]) => void
  onRemove: () => void
}

function ItemCard<T extends BaseItem>({
  item,
  index,
  isExpanded,
  renderSummary,
  renderForm,
  onToggle,
  onUpdate,
  onRemove,
}: ItemCardProps<T>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div
      className={[
        'rounded-2xl border transition-all duration-200',
        isExpanded
          ? 'border-sage-700/60 bg-sage-900/20 shadow-card'
          : 'border-navy-700 bg-navy-800/50 hover:border-navy-600',
      ].join(' ')}
    >
      {/* ── Item Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Nomor urut */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center">
          <span className="text-xs font-semibold text-navy-300">{index + 1}</span>
        </div>

        {/* Summary (collapsed) */}
        <div className="flex-1 min-w-0">
          {!isExpanded && (
            <div className="text-sm text-white truncate">
              {renderSummary(item, index)}
            </div>
          )}
          {isExpanded && (
            <span className="text-xs font-semibold text-sage-400 uppercase tracking-wide">
              Sedang diedit
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Edit / collapse toggle */}
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? 'Tutup form' : 'Edit item ini'}
            className={[
              'p-1.5 rounded-lg transition-colors',
              isExpanded
                ? 'text-sage-400 bg-sage-900/40 hover:bg-sage-900/60'
                : 'text-navy-400 hover:text-white hover:bg-navy-700',
            ].join(' ')}
          >
            {isExpanded ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            )}
          </button>

          {/* Delete */}
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Hapus item ini"
              className="p-1.5 rounded-lg text-navy-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          ) : (
            /* Konfirmasi hapus */
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onRemove()
                  setShowDeleteConfirm(false)
                }}
                className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-colors"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-navy-700 text-navy-300 text-xs font-medium hover:bg-navy-600 transition-colors"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded Form ────────────────────────────────── */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-navy-700/50 space-y-3">
          {renderForm(item, (field, value) => onUpdate(field, value))}
        </div>
      )}
    </div>
  )
}

// ── Main DynamicList Component ────────────────────────────────
export function DynamicList<T extends BaseItem>({
  items,
  sectionTitle,
  itemLabel,
  emptyIcon = '📋',
  emptyMessage,
  maxItems = 20,
  createDefaultItem,
  renderSummary,
  renderForm,
  onAdd,
  onRemove,
  onUpdate,
}: DynamicListProps<T>) {
  // Track which item is currently expanded for editing
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleAdd() {
    if (items.length >= maxItems) return
    const newItem: T = {
      id: generateId(),
      urutan: items.length,
      ...createDefaultItem(),
    } as T
    onAdd(newItem)
    // Auto-expand yang baru ditambahkan
    setExpandedId(newItem.id)
  }

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function handleRemove(id: string) {
    onRemove(id)
    if (expandedId === id) setExpandedId(null)
  }

  const canAdd = items.length < maxItems

  return (
    <div className="space-y-3">
      {/* ── Section Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-navy-200">{sectionTitle}</h3>
          {items.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-sage-900/50 border border-sage-800 text-xs text-sage-400">
              {items.length}
            </span>
          )}
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
              'text-xs font-medium transition-all duration-200 active:scale-95',
              'bg-sage-900/50 border border-sage-700/50 text-sage-400',
              'hover:bg-sage-800/50 hover:border-sage-600 hover:text-sage-300',
            ].join(' ')}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah {itemLabel}
          </button>
        )}
      </div>

      {/* ── Empty State ────────────────────────────────── */}
      {items.length === 0 && (
        <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-navy-700 rounded-2xl">
          <span className="text-4xl mb-3" role="img" aria-hidden="true">
            {emptyIcon}
          </span>
          <p className="text-sm text-navy-500 text-center max-w-xs leading-relaxed">
            {emptyMessage ?? `Belum ada ${itemLabel.toLowerCase()}. Klik "Tambah ${itemLabel}" untuk mulai.`}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className={[
              'mt-4 flex items-center gap-2 px-4 py-2 rounded-xl',
              'bg-sage-900/60 border border-sage-700/50 text-sage-400',
              'text-sm font-medium hover:border-sage-600 hover:text-sage-300',
              'transition-all duration-200 active:scale-95',
            ].join(' ')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah {itemLabel} Pertama
          </button>
        </div>
      )}

      {/* ── Items List ─────────────────────────────────── */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <ItemCard<T>
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedId === item.id}
            renderSummary={renderSummary}
            renderForm={renderForm}
            onToggle={() => handleToggle(item.id)}
            onUpdate={(field, value) => onUpdate(item.id, field, value)}
            onRemove={() => handleRemove(item.id)}
          />
        ))}
      </div>

      {/* ── Bottom Add Button (jika sudah ada item) ────── */}
      {items.length > 0 && canAdd && (
        <button
          type="button"
          onClick={handleAdd}
          className={[
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl',
            'border border-dashed border-navy-700 text-sm text-navy-500',
            'hover:border-sage-700 hover:text-sage-500',
            'transition-all duration-200 active:scale-98',
          ].join(' ')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah {itemLabel} Lagi
        </button>
      )}

      {/* ── Max items reached ───────────────────────────── */}
      {!canAdd && (
        <p className="text-xs text-center text-navy-600">
          Maksimal {maxItems} {itemLabel.toLowerCase()}
        </p>
      )}
    </div>
  )
}