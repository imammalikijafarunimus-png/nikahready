'use client'

// ============================================================
// src/components/form/Step16_SosialMedia.tsx
// Step 16 (form step): Sosial Media — DynamicList
// Akun media sosial yang relevan untuk Lembar Taaruf CV
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  SelectInput,
  ToggleSwitch,
} from '@/components/ui/FormFields'
import { OPTIONS_PLATFORM_SOSMED } from '@/lib/constants'
import type { SosialMediaItem } from '@/types'

// ── Default item factory ──────────────────────────────────────
function createDefaultSosmed(): Omit<SosialMediaItem, 'id' | 'urutan'> {
  return {
    platform: '',
    username: '',
    url: '',
    is_primary: false,
    tampil_di_pdf: true,
  }
}

// ── Summary renderer (collapsed state) ───────────────────────
function renderSummary(item: SosialMediaItem, _index: number) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-medium text-white truncate">
          {item.platform || (
            <span className="text-navy-500 italic">Belum diisi</span>
          )}
        </span>
        {item.username && (
          <span className="text-navy-400 truncate">· @{item.username}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {item.is_primary && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sage-900/50 border border-sage-700/50 text-[10px] text-sage-400 font-medium">
            ★ Utama
          </span>
        )}
        {item.tampil_di_pdf && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-navy-800 text-[10px] text-navy-400">
            PDF ✓
          </span>
        )}
        {!item.is_primary && !item.tampil_di_pdf && (
          <span className="text-[10px] text-navy-600 italic">Sembunyikan</span>
        )}
      </div>
    </div>
  )
}

// ── Form renderer (expanded state) ───────────────────────────
function renderForm(
  item: SosialMediaItem,
  onChange: (field: keyof SosialMediaItem, value: SosialMediaItem[keyof SosialMediaItem]) => void
) {
  return (
    <div className="space-y-3">
      <SelectInput
        label="Platform"
        value={item.platform}
        onChange={(v) => onChange('platform', v)}
        options={OPTIONS_PLATFORM_SOSMED}
        placeholder="Pilih platform…"
        required
      />

      <TextInput
        label="Username"
        value={item.username}
        onChange={(v) => onChange('username', v)}
        placeholder="@username or username"
        required
      />

      <TextInput
        label="Link Profil"
        value={item.url}
        onChange={(v) => onChange('url', v)}
        type="url"
        placeholder="https://instagram.com/username"
        hint="Link lengkap ke profil sosial media"
      />

      <ToggleSwitch
        label="Kontak utama"
        description="Centang jika ini adalah kontak utama (biasanya WhatsApp)"
        checked={item.is_primary}
        onChange={(v) => onChange('is_primary', v)}
      />

      <ToggleSwitch
        label="Tampil di CV"
        description="Apakah akun ini ditampilkan di Lembar Taaruf PDF"
        checked={item.tampil_di_pdf}
        onChange={(v) => onChange('tampil_di_pdf', v)}
      />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function Step16_SosialMedia() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('sosialMedia')

  return (
    <div className="space-y-4">
      {/* Intro card */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">📱</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Sosial media memberikan gambaran tentang keseharianmu. Hanya tambahkan yang
          <strong className="text-white"> relevan</strong>. Kamu bisa mengatur mana yang
          ditampilkan di CV dan mana yang menjadi kontak utama.
        </p>
      </div>

      <DynamicList<SosialMediaItem>
        items={items}
        sectionTitle="Akun Sosial Media"
        itemLabel="Akun Sosmed"
        emptyIcon="📱"
        emptyMessage="Belum ada akun sosial media. Tambahkan akun sosmed pertamamu."
        maxItems={10}
        createDefaultItem={createDefaultSosmed}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Tips */}
      <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-gold-400/80 leading-relaxed">
          <strong className="text-gold-400">WhatsApp biasanya menjadi kontak utama.</strong>{' '}
          Instagram bisa menunjukkan keseharianmu. Tambahkan hanya akun yang aktif dan
          merepresentasikan dirimu dengan baik.
        </p>
      </div>
    </div>
  )
}
