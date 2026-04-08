// ============================================================
// src/components/ui/Badge.tsx
//
// Canonical Badge wrapper component.
// All variants sourced from design-system.ts components.badges.
//
// Usage:
//   <Badge variant="pro">PRO</Badge>
//   <Badge variant="premium">Premium</Badge>
//   <Badge variant="status" status="active">Aktif</Badge>
// ============================================================

import React from 'react'
import { components } from '@/lib/design-system'

type BadgeVariant = 'default' | 'pro' | 'premium' | 'status'

type BadgeStatus = 'active' | 'expired' | 'cancelled' | 'trial' | 'free' | 'admin'

interface BadgeBaseProps {
  /** Visual variant — maps to design-system.ts components.badges.* */
  variant?: BadgeVariant
  /** Badge content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** HTML element type — defaults to 'span' */
  as?: React.ElementType
}

interface BadgeStatusProps extends BadgeBaseProps {
  variant: 'status'
  /** Status type — determines color */
  status: BadgeStatus
}

type BadgeProps = BadgeBaseProps | BadgeStatusProps

/**
 * Canonical Badge component.
 *
 * Renders a small label/badge for status indicators, plan labels,
 * and feature tags. Tokens sourced from design-system.ts.
 *
 * @example
 * ```tsx
 * <Badge variant="pro">PRO</Badge>
 * <Badge variant="premium">Premium</Badge>
 * <Badge variant="status" status="active">Aktif</Badge>
 * <Badge variant="status" status="expired">Kedaluwarsa</Badge>
 * <Badge variant="default">v1.0</Badge>
 * ```
 */
export function Badge({
  variant = 'default',
  children,
  className = '',
  as: Element = 'span',
  ...rest
}: BadgeProps) {
  let baseClasses: string

  if (variant === 'status') {
    const { status = 'active' } = rest as BadgeStatusProps
    const key = `status${status.charAt(0).toUpperCase()}${status.slice(1)}` as keyof typeof components.badges
    baseClasses = (components.badges[key] as string) ?? components.badges.statusActive
  } else {
    baseClasses = (components.badges[variant as keyof typeof components.badges] as string) ?? components.badges.default
  }

  const classes = [baseClasses, className]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return <Element className={classes}>{children}</Element>
}