// ============================================================
// src/app/preview/page.tsx
// Server Component — metadata only, logic di PreviewClient
// ============================================================

import type { Metadata } from 'next'
import { PreviewClient } from './PreviewClient'

export const metadata: Metadata = {
  title: 'Preview CV Taaruf',
  description: 'Preview dan download CV Taaruf Islami kamu dalam format PDF.',
}

export default function PreviewPage() {
  return <PreviewClient />
}
