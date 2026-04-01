'use client'

// ============================================================
// src/components/ui/FormFields.tsx
//
// Semua base form field: TextInput, TextArea, SelectInput,
// NumberInput, ToggleSwitch, TagInput, RadioGroup.
//
// Desain: dark theme (navy-900 bg), sage-green accent,
// fully accessible (label + aria attributes).
// ============================================================

import React, { useId } from 'react'

// ── Shared Types ─────────────────────────────────────────────
interface BaseFieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

// ── Shared label + error render ──────────────────────────────
function FieldLabel({
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
      className="block text-sm font-medium text-navy-200 mb-1.5"
    >
      {label}
      {required && (
        <span className="ml-1 text-gold-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

function FieldHint({ hint }: { hint: string }) {
  return <p className="mt-1.5 text-xs text-navy-500 leading-relaxed">{hint}</p>
}

function FieldError({ error }: { error: string }) {
  return (
    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1" role="alert">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      {error}
    </p>
  )
}

// Kelas CSS base yang konsisten untuk semua text input
const BASE_INPUT_CLASS = [
  'w-full rounded-xl border bg-navy-800/80 px-4 py-3',
  'text-sm text-white placeholder:text-navy-500',
  'transition-all duration-200 outline-none',
  'focus:ring-2 focus:ring-sage-600/50 focus:ring-offset-2 focus:ring-offset-navy-900 focus:border-sage-600',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

function inputBorderClass(hasError?: boolean) {
  return hasError
    ? 'border-red-500/70 focus:ring-red-500/50 focus:border-red-500 focus:ring-offset-navy-900'
    : 'border-navy-700 hover:border-navy-500'
}

// ── TextInput ────────────────────────────────────────────────
interface TextInputProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url'
  maxLength?: number
  autoComplete?: string
  leadingIcon?: React.ReactNode
}

export function TextInput({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  autoComplete,
  leadingIcon,
}: TextInputProps) {
  const id = useId()

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        {leadingIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none">
            {leadingIcon}
          </div>
        )}
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
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={[
            BASE_INPUT_CLASS,
            inputBorderClass(!!error),
            leadingIcon ? 'pl-10' : '',
          ].join(' ')}
        />
        {maxLength && value && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-navy-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {hint && !error && <FieldHint hint={hint} />}
      {error && <FieldError error={error} />}
    </div>
  )
}

// ── NumberInput ──────────────────────────────────────────────
interface NumberInputProps extends BaseFieldProps {
  value: number | ''
  onChange: (value: number | '') => void
  placeholder?: string
  min?: number
  max?: number
  suffix?: string   // contoh: "cm", "kg", "%"
}

export function NumberInput({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
  placeholder,
  min,
  max,
  suffix,
}: NumberInputProps) {
  const id = useId()

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value === '' ? '' : value}
          onChange={(e) => {
            const raw = e.target.value
            onChange(raw === '' ? '' : Number(raw))
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          aria-invalid={!!error}
          className={[
            BASE_INPUT_CLASS,
            inputBorderClass(!!error),
            suffix ? 'pr-12' : '',
            // Sembunyikan spinner browser default
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none',
          ].join(' ')}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-navy-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && <FieldHint hint={hint} />}
      {error && <FieldError error={error} />}
    </div>
  )
}

// ── TextArea ─────────────────────────────────────────────────
interface TextAreaProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  showCount?: boolean
}

export function TextArea({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  showCount = false,
}: TextAreaProps) {
  const id = useId()

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <textarea
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={[
          BASE_INPUT_CLASS,
          inputBorderClass(!!error),
          'resize-none leading-relaxed',
        ].join(' ')}
      />
      <div className="flex items-start justify-between mt-1.5">
        <div>
          {hint && !error && <FieldHint hint={hint} />}
          {error && <FieldError error={error} />}
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

// ── SelectInput ──────────────────────────────────────────────
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectInputProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

export function SelectInput({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
  options,
  placeholder = 'Pilih salah satu…',
}: SelectInputProps) {
  const id = useId()

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          className={[
            BASE_INPUT_CLASS,
            inputBorderClass(!!error),
            // Warna teks berbeda untuk placeholder
            !value ? 'text-navy-500' : 'text-white',
            // Custom arrow
            'appearance-none pr-10 cursor-pointer',
          ].join(' ')}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-navy-800 text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      {hint && !error && <FieldHint hint={hint} />}
      {error && <FieldError error={error} />}
    </div>
  )
}

// ── ToggleSwitch ─────────────────────────────────────────────
interface ToggleSwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
}: ToggleSwitchProps) {
  const id = useId()

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Toggle button */}
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 mt-0.5',
          'focus:outline-none focus:ring-2 focus:ring-sage-600/50 focus:ring-offset-2 focus:ring-offset-navy-900',
          checked ? 'bg-sage-600' : 'bg-navy-700',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>

      {/* Label + description */}
      <div className="flex-1 min-w-0" onClick={() => !disabled && onChange(!checked)}>
        <label
          htmlFor={id}
          className={[
            'text-sm font-medium leading-snug cursor-pointer select-none',
            checked ? 'text-white' : 'text-navy-300',
          ].join(' ')}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

// ── RadioGroup ───────────────────────────────────────────────
interface RadioGroupProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  layout?: 'vertical' | 'horizontal' | 'grid'
}

export function RadioGroup({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
  options,
  layout = 'vertical',
}: RadioGroupProps) {
  const groupId = useId()

  const layoutClass = {
    vertical: 'flex flex-col gap-2',
    horizontal: 'flex flex-wrap gap-2',
    grid: 'grid grid-cols-2 gap-2',
  }[layout]

  return (
    <fieldset className={className} aria-required={required}>
      <legend className="block text-sm font-medium text-navy-200 mb-2">
        {label}
        {required && (
          <span className="ml-1 text-gold-500" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className={layoutClass}>
        {options.map((opt) => {
          const optId = `${groupId}-${opt.value}`
          const isSelected = value === opt.value

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer',
                'text-sm transition-all duration-200 select-none',
                isSelected
                  ? 'border-sage-600 bg-sage-900/40 text-white'
                  : 'border-navy-700 bg-navy-800/60 text-navy-300 hover:border-navy-500',
                disabled || opt.disabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              <input
                type="radio"
                id={optId}
                name={groupId}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                disabled={disabled || opt.disabled}
                className="sr-only"
              />
              {/* Custom radio indicator */}
              <span
                className={[
                  'flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-200',
                  'flex items-center justify-center',
                  isSelected
                    ? 'border-sage-500 bg-sage-500'
                    : 'border-navy-500 bg-transparent',
                ].join(' ')}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="leading-snug">{opt.label}</span>
            </label>
          )
        })}
      </div>

      {hint && !error && <FieldHint hint={hint} />}
      {error && <FieldError error={error} />}
    </fieldset>
  )
}

// ── TagInput ─────────────────────────────────────────────────
// Untuk input kelebihan / kekurangan / hobi / tujuan_pernikahan
interface TagInputProps extends BaseFieldProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  suggestions?: string[]  // opsional: suggestion chips
}

export function TagInput({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  tags,
  onChange,
  placeholder = 'Ketik lalu Enter…',
  maxTags = 10,
  suggestions,
}: TagInputProps) {
  const id = useId()
  const [inputVal, setInputVal] = React.useState('')

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    if (tags.includes(tag)) return
    if (tags.length >= maxTags) return
    onChange([...tags, tag])
    setInputVal('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputVal)
    }
    if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const canAdd = tags.length < maxTags && !disabled

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />

      {/* Tags + input box */}
      <div
        className={[
          'min-h-[3rem] w-full rounded-xl border px-3 py-2',
          'bg-navy-800/80 flex flex-wrap gap-1.5 items-center',
          'transition-all duration-200',
          error ? 'border-red-500/70' : 'border-navy-700 focus-within:border-sage-600 focus-within:ring-2 focus-within:ring-sage-600/30',
        ].join(' ')}
        onClick={() => {
          document.getElementById(id)?.focus()
        }}
      >
        {/* Rendered tags */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sage-900/60 border border-sage-700/50 text-xs text-sage-300"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                aria-label={`Hapus tag ${tag}`}
                className="ml-0.5 text-sage-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </span>
        ))}

        {/* Text input */}
        {canAdd && (
          <input
            id={id}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(inputVal)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[8rem] bg-transparent text-sm text-white placeholder:text-navy-500 outline-none py-0.5"
            aria-label={label}
          />
        )}
      </div>

      {/* Count & hint */}
      <div className="flex items-start justify-between mt-1.5">
        <div>
          {hint && !error && <FieldHint hint={hint} />}
          {error && <FieldError error={error} />}
        </div>
        <span className="text-xs text-navy-500 ml-2 flex-shrink-0">
          {tags.length}/{maxTags}
        </span>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && !disabled && (
        <div className="mt-2">
          <p className="text-xs text-navy-500 mb-1.5">Saran cepat:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions
              .filter((s) => !tags.includes(s))
              .slice(0, 8)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTag(s)}
                  className="px-2.5 py-1 rounded-lg border border-dashed border-navy-600 text-xs text-navy-400 hover:border-sage-600 hover:text-sage-400 transition-colors"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── DateInput ─────────────────────────────────────────────────
interface DateInputProps extends BaseFieldProps {
  value: string       // ISO date string "YYYY-MM-DD"
  onChange: (value: string) => void
}

export function DateInput({
  label,
  hint,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
}: DateInputProps) {
  const id = useId()

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <input
          id={id}
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          className={[
            BASE_INPUT_CLASS,
            inputBorderClass(!!error),
            // Native date picker styling
            '[color-scheme:dark]',
          ].join(' ')}
        />
      </div>
      {hint && !error && <FieldHint hint={hint} />}
      {error && <FieldError error={error} />}
    </div>
  )
}

// ── SectionCard ───────────────────────────────────────────────
// Wrapper card untuk mengelompokkan field-field dalam satu tema
interface SectionCardProps {
  title?: string
  icon?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'highlight'
}

export function SectionCard({
  title,
  icon,
  children,
  className = '',
  variant = 'default',
}: SectionCardProps) {
  return (
    <div
      className={[
        'rounded-2xl border p-4 space-y-5',
        variant === 'highlight'
          ? 'border-sage-700/50 bg-sage-900/20'
          : 'border-navy-800 bg-navy-900/50',
        className,
      ].join(' ')}
    >
      {title && (
        <div className="flex items-center gap-2 pb-2 border-b border-navy-800">
          {icon && <span className="text-base">{icon}</span>}
          <h3 className="text-sm font-semibold text-navy-200">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}