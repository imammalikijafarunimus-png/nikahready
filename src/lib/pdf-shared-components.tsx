// ============================================================
// src/lib/pdf-shared-components.tsx
//
// Shared React components for ALL PDF templates.
// No emojis — only text and shapes.
// All styling via inline styles with hex literals.
//
// PDF-SAFE RULES:
// ✓ No CSS vars, no Tailwind, no position fixed/sticky
// ✓ Flexbox / explicit sizing only
// ✓ Font: Inter (body), Amiri (Arabic)
// ============================================================

import React from 'react'
import {
  PAGE_W,
  PAGE_H,
  SPACING,
  FONT,
  FINANCIAL_COLORS,
  FASE_COLORS,
} from './pdf-tokens'
import type { PdfTheme } from './pdf-tokens'

// ── Reusable Styles Helpers ───────────────────────────────────

export const S = {
  /** Flex row */
  row: (gap = 12, alignItems: 'center'): { display: 'flex'; gap: number; alignItems: string } => ({
    display: 'flex',
    gap,
    alignItems,
  }),
  /** Flex column */
  col: (gap = 0) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap,
  }),
  /** Horizontal divider */
  divider: (color = '#F1F5F9', margin = '16px 0') => ({
    height: 1,
    backgroundColor: color,
    margin,
  }),
  /** Card container */
  card: (bg: string, border: string, radius = 8, pad: '10px 14px') => ({
    backgroundColor: bg,
    border: `1px solid ${border}`,
    borderRadius: radius,
    padding: pad,
  }),
} as const

// ── Page Wrapper ──────────────────────────────────────────────
export function PdfPage({
  children,
  isLast = false,
  bg = '#FFFFFF',
  pad = SPACING.pagePad,
}: {
  children: React.ReactNode
  isLast?: boolean
  bg?: string
  pad?: number
}) {
  return (
    <div
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        backgroundColor: bg,
        position: 'relative',
        overflow: 'hidden',
        pageBreakAfter: isLast ? 'auto' : 'always',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#1E293B',
      }}
    >
      <div style={{ padding: `${pad}px ${pad}px ${SPACING.pageBottom}px` }}>
        {children}
      </div>
    </div>
  )
}

// ── Section Heading (NO emoji — shape accent only) ────────────
export function PdfSectionHeading({
  title,
  color = '#064E3B',
  accentColor = '#D97706',
  size = FONT.heading,
  marginBottom = 12,
}: {
  title: string
  color?: string
  accentColor?: string
  size?: number
  marginBottom?: number
}) {
  return (
    <div style={{ marginBottom }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Diamond shape accent instead of emoji */}
        <span
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            backgroundColor: accentColor,
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontSize: size,
            fontWeight: 700,
            color,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {/* Underline decoration */}
      <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
        <div style={{ height: 2, width: 36, backgroundColor: color, borderRadius: 2 }} />
        <div style={{ height: 2, width: 12, backgroundColor: accentColor, borderRadius: 2 }} />
        <div style={{ height: 2, width: 6, backgroundColor: `${accentColor}40`, borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── Compact Section Heading (for single-page templates) ───────
export function PdfSectionTitle({
  title,
  color = '#064E3B',
  accentColor = '#D97706',
}: {
  title: string
  color?: string
  accentColor?: string
}) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Small diamond */}
        <span
          style={{
            display: 'inline-block',
            width: 5,
            height: 5,
            backgroundColor: accentColor,
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }}
        />
        <h2 style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {title}
        </h2>
        {/* Fade-out line */}
        <div style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${accentColor}25, transparent)`,
        }} />
      </div>
    </div>
  )
}

// ── Info Row (label + value) ──────────────────────────────────
export function PdfInfoRow({
  label,
  value,
  fullWidth = false,
  labelSize = FONT.micro,
  valueSize = FONT.body,
}: {
  label: string
  value: string | number | undefined | null
  fullWidth?: boolean
  labelSize?: number
  valueSize?: number
}) {
  if (!value && value !== 0) return null
  return (
    <div style={{ marginBottom: 5, width: fullWidth ? '100%' : undefined }}>
      <span style={{
        fontSize: labelSize,
        color: '#94A3B8',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        display: 'block',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: valueSize,
        color: '#1E293B',
        fontWeight: 500,
        display: 'block',
        marginTop: 1,
        lineHeight: 1.4,
      }}>
        {value}
      </span>
    </div>
  )
}

// ── Tag Chip ──────────────────────────────────────────────────
export function PdfTag({
  text,
  variant = 'primary',
}: {
  text: string
  variant?: 'primary' | 'accent' | 'muted'
}) {
  const styles = {
    primary: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
    accent:  { bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    muted:   { bg: '#F1F5F9', border: '#CBD5E1', color: '#334155' },
  }[variant]

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        fontSize: FONT.micro + 1,
        color: styles.color,
        fontWeight: 500,
        margin: '0 4px 4px 0',
        lineHeight: 1.5,
      }}
    >
      {text}
    </span>
  )
}

// ── Timeline Item ─────────────────────────────────────────────
export function PdfTimelineItem({
  year,
  isLast = false,
  dotColor = '#059669',
  lineColor = '#D1FAE5',
  children,
}: {
  year?: string
  isLast?: boolean
  dotColor?: string
  lineColor?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: isLast ? 0 : 14 }}>
      {/* Year + dot + line column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 50,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 9,
          color: '#94A3B8',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          letterSpacing: '0.03em',
        }}>
          {year ?? ''}
        </span>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: dotColor,
          marginTop: 2,
          flexShrink: 0,
        }} />
        {!isLast && (
          <div style={{
            width: 1,
            flex: 1,
            backgroundColor: lineColor,
            marginTop: 3,
          }} />
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingTop: 1 }}>
        {children}
      </div>
    </div>
  )
}

// ── Phase Timeline Item (for Perjalanan Hidup) ────────────────
export function PdfPhaseItem({
  fase,
  judul,
  cerita,
  pelajaran,
  tahunMulai,
  tahunSelesai,
  isLast = false,
}: {
  fase: string
  judul: string
  cerita?: string
  pelajaran?: string
  tahunMulai?: string
  tahunSelesai?: string
  isLast?: boolean
}) {
  const faseConfig = FASE_COLORS[fase]
  const color = faseConfig?.color ?? '#059669'
  const label = faseConfig?.label ?? fase

  return (
    <div style={{ display: 'flex', gap: 14, paddingBottom: isLast ? 0 : 20 }}>
      {/* Phase indicator column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 56,
        flexShrink: 0,
      }}>
        {/* Circle with fase label text instead of emoji */}
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: color,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 7,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          flexShrink: 0,
          textAlign: 'center',
          lineHeight: 1,
          padding: 2,
        }}>
          {label.length > 6 ? label.slice(0, 4) : label}
        </div>
        {!isLast && (
          <div style={{ width: 2, flex: 1, backgroundColor: '#F1F5F9', marginTop: 4 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingTop: 4 }}>
        {/* Judul + tahun */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', margin: 0 }}>
            {judul}
          </h3>
          {(tahunMulai || tahunSelesai) && (
            <span style={{ fontSize: 9, color: '#94A3B8', flexShrink: 0, marginLeft: 8 }}>
              {tahunMulai}{tahunSelesai ? `–${tahunSelesai}` : ''}
            </span>
          )}
        </div>

        {/* Fase label badge */}
        <span style={{
          display: 'inline-block',
          fontSize: 8,
          fontWeight: 700,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 4,
        }}>
          {label}
        </span>

        {/* Cerita */}
        {cerita && (
          <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.6, margin: 0, marginBottom: 6 }}>
            {cerita}
          </p>
        )}

        {/* Pelajaran */}
        {pelajaran && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 6,
            padding: '5px 10px',
          }}>
            <span style={{
              fontSize: 9,
              color: '#B45309',
              fontWeight: 700,
              display: 'block',
              marginBottom: 2,
            }}>
              Hikmah & Pelajaran
            </span>
            <p style={{ fontSize: 10, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
              {pelajaran}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Financial Progress Bar ────────────────────────────────────
export function PdfFinancialBar({
  label,
  persen,
  color,
}: {
  label: string
  persen: number
  color: string
}) {
  const safePercent = Math.min(100, Math.max(0, persen))
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 10, color: '#1E293B', fontWeight: 700 }}>{safePercent}%</span>
      </div>
      {/* Track */}
      <div style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 999 }}>
        {/* Fill */}
        <div style={{ height: 6, width: `${safePercent}%`, backgroundColor: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

// ── Page Footer (with branding) ───────────────────────────────
export function PdfPageFooter({
  nama,
  pageNum,
  totalPages,
  footerBg = '#064E3B',
  footerText = 'rgba(255,255,255,0.5)',
  footerTextStrong = 'rgba(255,255,255,0.6)',
  brandText = 'CV TAARUF — DOKUMEN RAHASIA',
  pad = SPACING.pagePad,
}: {
  nama: string
  pageNum?: number
  totalPages?: number
  footerBg?: string
  footerText?: string
  footerTextStrong?: string
  brandText?: string
  pad?: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        backgroundColor: footerBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: pad,
        paddingRight: pad,
      }}
    >
      <span style={{ fontSize: 8, color: footerText, letterSpacing: '0.05em' }}>
        {brandText}
      </span>
      <span style={{ fontSize: 8, color: footerTextStrong, fontWeight: 600 }}>
        {nama || 'Nama'}{pageNum && totalPages
          ? ` · Hal. ${pageNum}/${totalPages}`
          : pageNum
            ? ` · Hal. ${pageNum}`
            : ''
        }
      </span>
    </div>
  )
}

// ── Inline Divider ────────────────────────────────────────────
export function PdfDivider({
  color = '#F1F5F9',
  margin = '16px 0',
}: {
  color?: string
  margin?: string
}) {
  return <div style={{ height: 1, backgroundColor: color, margin }} />
}

// ── Photo Placeholder (shape only, no emoji) ──────────────────
export function PdfPhotoPlaceholder({
  width = 100,
  height = 120,
  borderRadius = 8,
  borderColor = '#94A3B8',
  bg = '#F1F5F9',
  label = 'Foto',
}: {
  width?: number
  height?: number
  borderRadius?: number
  borderColor?: string
  bg?: string
  label?: string
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: bg,
        border: `2px dashed ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      {/* User icon shape (circle + shoulders) */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={borderColor} strokeWidth="1.5" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke={borderColor} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 9, color: borderColor }}>{label}</span>
    </div>
  )
}

// ── Islamic Ornamental Divider ────────────────────────────────
export function PdfOrnDivider({
  color = '#C9A84C',
  margin = '12px 0',
}: {
  color?: string
  margin?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin }}>
      <div style={{ flex: 1, maxWidth: 120, height: 1, backgroundColor: color, opacity: 0.25 }} />
      <span style={{ fontSize: 6, color, opacity: 0.5, transform: 'rotate(45deg)', display: 'inline-block' }}>◆</span>
      <div style={{ flex: 1, maxWidth: 120, height: 1, backgroundColor: color, opacity: 0.25 }} />
    </div>
  )
}

// ── Islamic Corner Ornament ───────────────────────────────────
export function PdfCornerOrnament({
  position,
  color = '#C9A84C',
  offset = 14,
  size = 36,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color?: string
  offset?: number
  size?: number
}) {
  const isTop = position.startsWith('top')
  const isLeft = position.endsWith('left')

  return (
    <div style={{
      position: 'absolute',
      top: isTop ? offset : undefined,
      bottom: isTop ? undefined : offset,
      left: isLeft ? offset : undefined,
      right: isLeft ? undefined : offset,
      width: size,
      height: size,
      borderTop: isTop ? `2px solid ${color}50` : 'none',
      borderBottom: isTop ? 'none' : `2px solid ${color}50`,
      borderLeft: isLeft ? `2px solid ${color}50` : 'none',
      borderRight: isLeft ? 'none' : `2px solid ${color}50`,
      pointerEvents: 'none',
    }}>
      {/* Inner L-shape accent */}
      <div style={{
        position: 'absolute',
        top: isTop ? 4 : undefined,
        bottom: isTop ? undefined : 4,
        left: isLeft ? 4 : undefined,
        right: isLeft ? undefined : 4,
        width: 14,
        height: 14,
        borderTop: isTop ? `1.5px solid ${color}80` : 'none',
        borderBottom: isTop ? 'none' : `1.5px solid ${color}80`,
        borderLeft: isLeft ? `1.5px solid ${color}80` : 'none',
        borderRight: isLeft ? 'none' : `1.5px solid ${color}80`,
      }} />
    </div>
  )
}

// ── Family Member Card ────────────────────────────────────────
export function PdfFamilyCard({
  hubungan,
  nama,
  pekerjaan,
  pendidikan,
  accentColor = '#6366F1',
}: {
  hubungan: string
  nama: string
  pekerjaan?: string
  pendidikan?: string
  accentColor?: string
}) {
  return (
    <div style={{ minWidth: 150 }}>
      <span style={{
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: 600,
        textTransform: 'uppercase',
        display: 'block',
      }}>
        {hubungan}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{nama}</span>
      {pekerjaan && (
        <span style={{ fontSize: 10, color: '#475569', display: 'block' }}>{pekerjaan}</span>
      )}
      {pendidikan && (
        <span style={{ fontSize: 10, color: '#94A3B8' }}>{pendidikan}</span>
      )}
    </div>
  )
}