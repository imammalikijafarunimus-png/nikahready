// ============================================================
// src/components/ui/Button.tsx
//
// Canonical Button wrapper component.
// All variants sourced from design-system.ts components.buttons.
//
// Usage:
//   <Button variant="primary">Simpan</Button>
//   <Button variant="premium" size="lg" fullWidth>Upgrade</Button>
//   <Button variant="ghost" size="sm"><Icon /> Label</Button>
// ============================================================

import React from 'react'
import { components } from '@/lib/design-system'

/**
 * Button variant mapping to design-system tokens.
 * Each variant maps to a canonical class string from design-system.ts.
 */
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'premium'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'dangerSolid'
  | 'iconOnly'

type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  /** Visual variant — maps to design-system.ts components.buttons.* */
  variant?: ButtonVariant
  /** Size preset — sm | md (default) | lg */
  size?: ButtonSize
  /** Stretch to full width */
  fullWidth?: boolean
  /** Additional CSS classes merged after base variant classes */
  className?: string
  /** HTML element type — defaults to 'button' */
  as?: React.ElementType
  /** Disabled state */
  disabled?: boolean
  /** Icon placed before children */
  leftIcon?: React.ReactNode
  /** Icon placed after children */
  rightIcon?: React.ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | 'as'> & {
    as?: 'button'
  }

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | 'as'> & {
    as: 'a'
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary: components.buttons.primary,
  secondary: components.buttons.secondary,
  premium: components.buttons.premium,
  ghost: components.buttons.ghost,
  outline: components.buttons.outline,
  danger: components.buttons.danger,
  dangerSolid: components.buttons.dangerSolid,
  iconOnly: components.buttons.iconOnly,
}

const SIZE_MAP: Record<ButtonSize, string> = {
  sm: components.buttons.sizeSm,
  md: '',
  lg: components.buttons.sizeLg,
}

/**
 * Canonical Button component.
 *
 * Renders a styled button (or anchor) using design-system tokens.
 * Supports all 8 variants, 3 sizes, fullWidth, icons, and className override.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleSave}>Simpan</Button>
 * <Button variant="premium" as="a" href="/upgrade" fullWidth>Upgrade</Button>
 * <Button variant="iconOnly" onClick={toggleSidebar}><MenuIcon /></Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  as,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: ButtonProps) {
  const variantClasses = VARIANT_MAP[variant] ?? VARIANT_MAP.primary
  const sizeClasses = SIZE_MAP[size] ?? ''
  const widthClass = fullWidth ? ` ${components.buttons.fullWidth}` : ''
  const disabledClass = disabled ? ` ${components.buttons.disabled}` : ''

  const classes = [
    variantClasses,
    sizeClasses,
    widthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  const content = (
    <>
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </>
  )

  if (as === 'a') {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const { type = 'button', ...buttonRest } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      {...buttonRest}
    >
      {content}
    </button>
  )
}