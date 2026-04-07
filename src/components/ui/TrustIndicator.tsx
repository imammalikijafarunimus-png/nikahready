// ============================================================
// src/components/ui/TrustIndicator.tsx
// Shared trust indicator bar component
// Extracted from login, signup, and update-password pages
// ============================================================

import { ShieldCheck, Lock, EyeOff } from 'lucide-react'

export interface TrustItem {
  icon: React.ReactNode
  text: string
}

export const DEFAULT_AUTH_TRUST_ITEMS: TrustItem[] = [
  { icon: <ShieldCheck size={14} />, text: 'Data Terenkripsi' },
  { icon: <Lock size={14} />, text: 'Server Aman' },
  { icon: <EyeOff size={14} />, text: 'Tanpa Profil Publik' },
]

interface TrustIndicatorProps {
  items?: TrustItem[]
  className?: string
}

/**
 * TrustIndicator — horizontal row of trust/security indicators.
 * Used on login, signup, and update-password pages.
 */
export function TrustIndicator({ items = DEFAULT_AUTH_TRUST_ITEMS, className = '' }: TrustIndicatorProps) {
  if (items.length === 0) return null

  return (
    <div
      className={`auth-trust ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.25rem',
        flexWrap: 'wrap',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(100,116,139,0.15)',
      }}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          className="auth-trust-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            color: '#6EE7B7',
            fontWeight: 500,
          }}
        >
          <span style={{ color: '#10B981', flexShrink: 0 }} aria-hidden="true">
            {item.icon}
          </span>
          {item.text}
        </span>
      ))}
    </div>
  )
}