// ============================================================
// src/components/ui/Input.tsx
//
// Canonical Input wrapper component.
// Uses design-system.ts components.inputs.* as single source of truth.
//
// Supports: text, email, tel, url, password, number, date, textarea, select
//
// Usage:
//   <Input label="Nama" placeholder="Masukkan nama" />
//   <Input label="Email" type="email" error="Email tidak valid" />
//   <Input label="Bio" as="textarea" rows={4} />
//   <Input label="Negara" as="select" options={[{value:'id',label:'Indonesia'}]} />
// ============================================================

import React, { useId } from 'react'
import { components } from '@/lib/design-system'

// ── Shared Props ─────────────────────────────────────────────
interface InputBaseProps {
  /** Label text displayed above the input */
  label: string
  /** Hint text below the input (hidden when error is present) */
  hint?: string
  /** Error message — when set, input shows error styling */
  error?: string
  /** Shows required asterisk on label */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional CSS classes on the wrapper div */
  className?: string
}

type InputType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'date'

// ── Text-like Input ──────────────────────────────────────────
interface TextInputProps extends InputBaseProps {
  /** Render as specific input type or textarea/select */
  as?: 'input'
  type?: InputType
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  autoComplete?: string
  /** Suffix text shown inside input (e.g., "cm", "kg") */
  suffix?: string
}

// ── Textarea ─────────────────────────────────────────────────
interface TextAreaProps extends InputBaseProps {
  as: 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  /** Show character count */
  showCount?: boolean
}

// ── Select ───────────────────────────────────────────────────
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends InputBaseProps {
  as: 'select'
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

type InputProps = TextInputProps | TextAreaProps | SelectProps

// ── Helper: Label Component ──────────────────────────────────
function InputLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string
  label: string
  required?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={components.inputs.label}
    >
      {label}
      {required && (
        <span className="ml-1 text-gold-500" aria-hidden="true">*</span>
      )}
    </label>
  )
}

// ── Helper: Error Component ──────────────────────────────────
function InputError({ error }: { error: string }) {
  return (
    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1" role="alert">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      {error}
    </p>
  )
}

// ── Helper: Hint Component ───────────────────────────────────
function InputHint({ hint }: { hint: string }) {
  return <p className={components.inputs.hint}>{hint}</p>
}

// ── Helper: Build input classes from design-system ───────────
function inputClasses(hasError: boolean) {
  return [
    components.inputs.base,
    hasError ? components.inputs.error : '',
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Canonical Input component.
 *
 * Renders a labeled form input (text, textarea, or select) using
 * design-system tokens for consistent styling across the app.
 *
 * @example
 * ```tsx
 * <Input label="Nama Lengkap" value={name} onChange={setName} />
 * <Input label="Email" type="email" value={email} onChange={setEmail} error={emailError} />
 * <Input label="Bio" as="textarea" value={bio} onChange={setBio} rows={3} />
 * <Input label="Kota" as="select" value={city} onChange={setCity} options={cityOptions} />
 * ```
 */
export function Input(props: InputProps) {
  const id = useId()
  const {
    label,
    hint,
    error,
    required,
    disabled,
    className = '',
  } = props

  const hasError = !!error
  const classes = inputClasses(hasError)
  const ariaDescribedBy = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined

  // ── Textarea ───────────────────────────────────────────────
  if (props.as === 'textarea') {
    const { as: _, value, onChange, placeholder, rows = 4, maxLength, showCount = false, ...rest } = props
    return (
      <div className={className}>
        <InputLabel htmlFor={id} label={label} required={required} />
        <textarea
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className={`${classes} resize-none leading-relaxed`}
        />
        <div className="flex items-start justify-between mt-1.5">
          <div>
            {hint && !error && <InputHint hint={hint} />}
            {error && <InputError error={error} />}
          </div>
          {showCount && maxLength && (
            <span className="text-xs text-navy-500 ml-2 flex-shrink-0">
              {(value ?? '').length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }

  // ── Select ─────────────────────────────────────────────────
  if (props.as === 'select') {
    const { as: _, value, onChange, options, placeholder = 'Pilih salah satu…', ...rest } = props
    return (
      <div className={className}>
        <InputLabel htmlFor={id} label={label} required={required} />
        <div className="relative">
          <select
            id={id}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={ariaDescribedBy}
            className={[
              classes,
              !value ? 'text-navy-500' : 'text-navy-900 dark:text-white',
              'appearance-none pr-10 cursor-pointer',
            ].join(' ')}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-white dark:bg-navy-800 text-navy-900 dark:text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom arrow icon */}
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-500 dark:text-navy-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        {hint && !error && <InputHint hint={hint} />}
        {error && <InputError error={error} />}
      </div>
    )
  }

  // ── Default: text-like input ────────────────────────────────
  const {
    as: _as,
    type = 'text',
    value,
    onChange,
    placeholder,
    maxLength,
    autoComplete,
    suffix,
    ...rest
  } = props

  return (
    <div className={className}>
      <InputLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className={[classes, suffix ? 'pr-12' : ''].join(' ')}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-navy-500 dark:text-navy-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && <InputHint hint={hint} />}
      {error && <InputError error={error} />}
    </div>
  )
}