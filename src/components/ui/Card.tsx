// ============================================================
// src/components/ui/Card.tsx
//
// Canonical Card wrapper component.
// All variants sourced from design-system.ts components.cards.
//
// Usage:
//   <Card variant="glass">Content here</Card>
//   <Card variant="highlight" title="Title" icon="📋">Content</Card>
//   <Card variant="auth" className="max-w-md">Form content</Card>
// ============================================================

import React from 'react'
import { components } from '@/lib/design-system'

type CardVariant = 'default' | 'glass' | 'highlight' | 'auth'

interface CardProps {
  /** Visual variant — maps to design-system.ts components.cards.* */
  variant?: CardVariant
  /** Card title shown at the top with a divider */
  title?: string
  /** Icon/emoji shown before the title */
  icon?: string
  /** Card body content */
  children: React.ReactNode
  /** Additional CSS classes merged after base variant classes */
  className?: string
  /** HTML element type — defaults to 'div' */
  as?: React.ElementType
  /** Padding override — set to false for no padding */
  padding?: boolean | string
}

const VARIANT_MAP: Record<CardVariant, string> = {
  default: components.cards.default,
  glass: components.cards.glass,
  highlight: components.cards.highlight,
  auth: components.cards.auth,
}

/**
 * Canonical Card component.
 *
 * Renders a styled card container using design-system tokens.
 * Supports 4 variants, optional title with icon, and padding control.
 *
 * @example
 * ```tsx
 * <Card variant="glass">
 *   <p>Card content with glass morphism effect.</p>
 * </Card>
 *
 * <Card variant="default" title="Profil" icon="👤">
 *   <Input label="Nama" value={name} onChange={setName} />
 * </Card>
 *
 * <Card variant="auth" className="max-w-sm mx-auto">
 *   <LoginForm />
 * </Card>
 * ```
 */
export function Card({
  variant = 'default',
  title,
  icon,
  children,
  className = '',
  as: Element = 'div',
  padding = true,
}: CardProps) {
  const variantClasses = VARIANT_MAP[variant] ?? VARIANT_MAP.default

  // Remove p-4/p-8/sm:p-10 from variant and apply our own if needed
  const paddingClass = padding === false
    ? ' p-0'
    : typeof padding === 'string'
      ? ` ${padding}`
      : '' // keep default padding from variant

  const classes = [
    variantClasses,
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Element className={classes}>
      {title && (
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-navy-800 mb-1">
          {icon && <span className="text-base">{icon}</span>}
          <h3 className="text-sm font-semibold text-navy-700 dark:text-navy-200">
            {title}
          </h3>
        </div>
      )}
      {children}
    </Element>
  )
}