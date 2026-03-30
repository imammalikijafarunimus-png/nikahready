'use client'

// ============================================================
// src/components/form/Step06_RiwayatOrganisasi.tsx
// Step 6 (form step): Riwayat Organisasi — DynamicList
// Menampilkan pengalaman berorganisasi, komunitas, dan kepemimpinan
// ============================================================

import { useArraySection } from '@/context/FormContext'
import { DynamicList } from '@/components/ui/DynamicList'
import {
  TextInput,
  TextArea,
  NumberInput,
} from '@/components/ui/FormFields'
import type { RiwayatOrganisasiItem } from '@/types'

// ── Default item factory ──────────────────────────────────────
function createDefaultOrganisasi(): Omit<RiwayatOrganisasiItem, 'id' | 'urutan'> {
  return {
    nama_organisasi: '',
    jabatan:         '',
    deskripsi:       '',
    tahun_mulai:     '',
    tahun_selesai:   '',
  }
}

// ── Summary renderer (collapsed state) ───────────────────────
function renderSummary(item: RiwayatOrganisasiItem, _index: number) {
  const yearRange = item.tahun_mulai
    ? `${item.tahun_mulai}${item.tahun_selesai ? ` – ${item.tahun_selesai}` : ''}`
    : null

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-medium text-white truncate">
        {item.jabatan && item.nama_organisasi
          ? `${item.jabatan} at ${item.nama_organisasi}`
          : item.nama_organisasi || item.jabatan || (
              <span className="text-navy-500 italic">Belum diisi</span>
            )}
      </span>
      <span className="text-xs text-navy-400 truncate">
        {yearRange && <span>{yearRange}</span>}
      </span>
    </div>
  )
}

// ── Form renderer (expanded state) ───────────────────────────
function renderForm(
  item: RiwayatOrganisasiItem,
  onChange: (field: keyof RiwayatOrganisasiItem, value: RiwayatOrganisasiItem[keyof RiwayatOrganisasiItem]) => void
) {
  return (
    <div className="space-y-3">
      {/* Nama organisasi + Jabatan */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          label="Nama Organisasi"
          value={item.nama_organisasi}
          onChange={(v) => onChange('nama_organisasi', v)}
          placeholder="Masjid Al-Hikmah, Karang Taruna, dll"
          required
        />
        <TextInput
          label="Jabatan / Peran"
          value={item.jabatan}
          onChange={(v) => onChange('jabatan', v)}
          placeholder="Ketua, Sekretaris, Anggota, dll"
        />
      </div>

      {/* Deskripsi */}
      <TextArea
        label="Deskripsi Kegiatan"
        value={item.deskripsi}
        onChange={(v) => onChange('deskripsi', v)}
        placeholder="Jelaskan peran, tanggung jawab, atau pencapaianmu di organisasi ini…"
        rows={3}
        maxLength={500}
        showCount
      />

      {/* Tahun masuk & keluar */}
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Tahun Mulai"
          value={item.tahun_mulai}
          onChange={(v) => onChange('tahun_mulai', v)}
          placeholder="2018"
          min={1990}
          max={new Date().getFullYear()}
        />
        <NumberInput
          label="Tahun Selesai"
          value={item.tahun_selesai}
          onChange={(v) => onChange('tahun_selesai', v)}
          placeholder="2022 (kosongkan jika masih aktif)"
          min={1990}
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function Step06_RiwayatOrganisasi() {
  const { items, addItem, removeItem, updateItem } =
    useArraySection('riwayatOrganisasi')

  return (
    <div className="space-y-4">
      {/* ── Pembuka Arabic ─────────────────────────────────── */}
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Dan tolong-menolonglah dalam kebaikan dan taqwa&quot;
          <br />
          <span className="text-navy-600">— QS Al-Maidah: 2</span>
        </p>
      </div>

      {/* Intro card */}
      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">🤝</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Pengalaman berorganisasi menunjukkan <strong className="text-white">sifat kepemimpinan dan kemampuan bekerja sama</strong>.
          Organisasi keagamaan, karang taruna, komunitas volunteer, atau organisasi kampus — semua dihitung di sini.
        </p>
      </div>

      <DynamicList<RiwayatOrganisasiItem>
        items={items}
        sectionTitle="Pengalaman Organisasi"
        itemLabel="Organisasi"
        emptyIcon="🤝"
        emptyMessage="Belum ada riwayat organisasi. Tambahkan pengalaman berorganisasimu."
        maxItems={10}
        createDefaultItem={createDefaultOrganisasi}
        renderSummary={renderSummary}
        renderForm={renderForm}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      {/* Tips */}
      {items.length === 0 && (
        <div className="flex gap-3 p-3 rounded-xl bg-gold-900/20 border border-gold-800/30">
          <span className="text-lg flex-shrink-0">💡</span>
          <p className="text-xs text-gold-400/80 leading-relaxed">
            <strong className="text-gold-400">Belum pernah berorganisasi?</strong>{' '}
            Tidak apa-apa! Kamu bisa menambahkan keikutsertaan di panitia acara,
            kegiatan sosial, atau komunitas online yang kamu kelola.
          </p>
        </div>
      )}
    </div>
  )
}
