// ============================================================
// src/app/create/page.tsx
// Server Component — hanya untuk metadata.
// Logika form ada di CreateFormClient (Client Component).
// ============================================================

import type { Metadata } from 'next'
import { CreateFormClient } from './CreateFormClient'

export const metadata: Metadata = {
  title: 'Buat CV Taaruf',
  description:
    'Isi profil taaruf lengkap kamu — dari data pribadi, karakter, ibadah, hingga visi misi pernikahan.',
}

export default function CreatePage() {
  return <CreateFormClient />
}
