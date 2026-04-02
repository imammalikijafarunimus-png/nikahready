'use client'

// ============================================================
// src/components/form/Step19_SuratTaaruf.tsx
// Step 19 (form step): Surat Taaruf — Perkenalan Diri
// Local state (belum tersimpan ke Supabase, hanya di browser).
// Menggunakan useFormState hanya untuk membaca nama pengguna.
// ============================================================

import { useState } from 'react'
import { useFormState } from '@/context/FormContext'
import { TextArea, RadioGroup, SectionCard } from '@/components/ui/FormFields'

const OPTIONS_GENDER = [
  { value: 'pria', label: '👨 Laki-laki' },
  { value: 'wanita', label: '👩 Perempuan' },
]

export function Step19_SuratTaaruf() {
  const state = useFormState()

  const namaLengkap = state.dataPribadi.nama_lengkap || ''

  const [gender, setGender] = useState('pria')
  const [surat, setSurat] = useState('')

  return (
    <div className="space-y-5">
      <div className="text-center py-3">
        <p className="font-arabic text-xl text-gold-500">
          فَاذْكُرُوا بِالْمَعْرُوفِ
        </p>
        <p className="text-xs text-navy-500 mt-1">
          &quot;Sebutlah kebaikan-kebaikan (tentang mereka)&quot;
          <br />
          <span className="text-navy-600">— QS An-Nisa: 86</span>
        </p>
      </div>

      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">✉️</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Surat taaruf ini bisa dikirim langsung ke calon pasangan atau
          melalui wali. Tulis dengan <strong className="text-white">bahasa yang hangat namun sopan</strong>.
          Surat ini opsional — kamu bisa melewatinya jika belum siap.
        </p>
      </div>

      <SectionCard title="Identitas Pengirim" icon="👤">
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700">
            <p className="text-xs text-navy-500 mb-1">Nama Lengkap</p>
            <p className="text-sm text-white font-medium">
              {namaLengkap || '— belum diisi (Langkah 1) —'}
            </p>
          </div>

          <RadioGroup
            label="Jenis Kelamin"
            value={gender}
            onChange={setGender}
            options={OPTIONS_GENDER}
            layout="horizontal"
          />
        </div>
      </SectionCard>

      <SectionCard title="Surat Perkenalan" icon="💌" variant="highlight">
        <TextArea
          label="Tuliskan Surat Taarufmu"
          value={surat}
          onChange={setSurat}
          placeholder={"Assalamu'alaikum, perkenalkan dirimu secara singkat...\n\nCeritakan tentang latar belakangmu, motivasi menikah, dan hal-hal yang ingin diketahui calon pasangan tentang dirimu."}
          rows={12}
          maxLength={2000}
          showCount
          hint="Surat ini bersifat pribadi. Gunakan bahasa yang jujur, hangat, dan sesuai adab Islam."
        />
      </SectionCard>

      <SectionCard title="Contoh Surat Taaruf" icon="📝">
        <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700">
          <p className="text-xs text-navy-300 leading-relaxed italic">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,
            <br /><br />
            Perkenalkan, saya [Nama]. Domisili di [Kota]. Alhamdulillah,
            saya bekerja sebagai [Pekerjaan]. Saya memiliki visi untuk
            membangun keluarga sakinah yang taat beribadah. Semoga melalui
            ta&apos;aruf ini, Allah SWT mempertemukan kami dengan jodoh terbaik.
            <br /><br />
            Wa alaikum salam warahmatullahi wabarakatuh.
          </p>
        </div>
      </SectionCard>

      <div className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-navy-400 leading-relaxed">
          Surat taaruf yang baik mencakup: <strong className="text-white">perkenalan singkat</strong>,
          motivasi menikah, nilai-nilai yang dipegang, dan harapan terhadap
          calon pasangan. Hindari menyebutkan hal-hal terlalu pribadi di surat pertama.
        </p>
      </div>
    </div>
  )
}