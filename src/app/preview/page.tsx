// ============================================================
// src/app/preview/page.tsx
// Server Component — metadata only, logic di PreviewClient
// ============================================================

import type { Metadata } from 'next'
import { PreviewClient } from './PreviewClient'

export const metadata: Metadata = {
  title: 'Preview CV NikahReady',
  description: 'Preview dan download CV NikahReady Islami kamu dalam format PDF.',
}

export default function PreviewPage() {
  return <PreviewClient />
}
