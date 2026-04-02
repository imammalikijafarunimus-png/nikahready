/**
 * @file design-system.ts
 * @description Canonical Design System & UI Audit for NikahReady (Wedding Profile Builder).
 * This file serves as the single source of truth for all UI tokens, standardizing 
 * the fragmented CSS and inline styles found across the application.
 */

/**
 * ==========================================
 * A. COLOR TOKENS
 * ==========================================
 * Canonical color palette using Tailwind mappings.
 * Replaces all hardcoded hex values in legacy CSS files.
 */
export const colors = {
  brand: {
    primary: { DEFAULT: '#064E3B', tailwind: 'sage-900', description: 'Primary brand, main buttons, active states' },
    primaryHover: { DEFAULT: '#047857', tailwind: 'sage-700', description: 'Primary button hover states' },
    secondary: { DEFAULT: '#6EE7B7', tailwind: 'sage-300', description: 'Secondary highlights, progress tracks' },
    accent: { DEFAULT: '#D97706', tailwind: 'gold-600', description: 'Last-step button, premium indicators, warnings' },
    accentHover: { DEFAULT: '#F59E0B', tailwind: 'gold-500', description: 'Accent hover, required asterisks' },
  },
  surface: {
    background: { DEFAULT: '#020617', tailwind: 'navy-950', description: 'Main application body background' },
    paper: { DEFAULT: '#0F172A', tailwind: 'navy-900', description: 'Surface/cards, header bars, sidebar, auth cards' },
    elevated: { DEFAULT: '#1E293B', tailwind: 'navy-800', description: 'Input field backgrounds, elevated surfaces' },
    soft: { DEFAULT: '#FEF3C7', tailwind: 'cream-100', description: 'Soft background (rare usage)' },
  },
  border: {
    default: { DEFAULT: '#334155', tailwind: 'navy-700', description: 'Standard borders, dividers, inactive states' },
    disabled: { DEFAULT: '#475569', tailwind: 'navy-600', description: 'Disabled borders, secondary UI elements' },
  },
  text: {
    primary: { DEFAULT: '#FFFFFF', tailwind: 'white', description: 'Primary headings and body text on dark' },
    secondary: { DEFAULT: '#CBD5E1', tailwind: 'navy-300', description: 'Labels, secondary light text' },
    tertiary: { DEFAULT: '#94A3B8', tailwind: 'navy-400', description: 'Descriptions, captions' },
    muted: { DEFAULT: '#64748B', tailwind: 'navy-500', description: 'Placeholder text, hints' },
  },
  semantic: {
    success: { DEFAULT: '#34D399', tailwind: 'sage-400', description: 'Success states, saved indicators' },
    error: { DEFAULT: '#F87171', tailwind: 'red-400', description: 'Error text, invalid input borders' },
    warning: { DEFAULT: '#FBBF24', tailwind: 'gold-400', description: 'Warning states, dirty/unsaved indicators' },
  }
} as const;

/**
 * ==========================================
 * B. TYPOGRAPHY SCALE
 * ==========================================
 * Standardized typography scale using Inter and Amiri.
 */
export const typography = {
  family: {
    sans: 'var(--font-inter), system-ui, sans-serif',
    arabic: 'var(--font-amiri), Georgia, serif',
    serif: 'Georgia, serif',
  },
  size: {
    xs: { tailwind: 'text-xs', size: '0.75rem', lineHeight: '1rem', usage: 'Hints, captions, badges, error text' },
    sm: { tailwind: 'text-sm', size: '0.875rem', lineHeight: '1.25rem', usage: 'Body text, labels, button text, card titles' },
    base: { tailwind: 'text-base', size: '1rem', lineHeight: '1.5rem', usage: 'Section titles (h2)' },
    lg: { tailwind: 'text-lg', size: '1.125rem', lineHeight: '1.75rem', usage: 'Feature titles (Landing)' },
    xl: { tailwind: 'text-xl', size: '1.25rem', lineHeight: '1.75rem', usage: 'Page titles (h1)' },
    '4xl': { tailwind: 'text-4xl', size: '2.25rem', lineHeight: '2.5rem', usage: 'Hero titles (responsive up to 4rem)' },
  },
  weight: {
    regular: { tailwind: 'font-normal', value: 400, usage: 'Standard body text, hints' },
    medium: { tailwind: 'font-medium', value: 500, usage: 'Labels, secondary buttons' },
    semibold: { tailwind: 'font-semibold', value: 600, usage: 'Card titles, primary buttons' },
    bold: { tailwind: 'font-bold', value: 700, usage: 'Page titles, section titles' },
  }
} as const;

/**
 * ==========================================
 * C. SPACING & LAYOUT
 * ==========================================
 */
export const layout = {
  spacing: {
    base: '4px', // 1 unit = 0.25rem
    scale: {
      1: '0.25rem', '1.5': '0.375rem', 2: '0.5rem', 3: '0.75rem', 
      4: '1rem', 5: '1.25rem', 6: '1.5rem', 18: '4.5rem',
      88: '22rem', 112: '28rem', 128: '32rem'
    }
  },
  radius: {
    sm: { tailwind: 'rounded', value: '4px' },
    md: { tailwind: 'rounded-lg', value: '8px' },
    lg: { tailwind: 'rounded-xl', value: '12px', usage: 'Inputs, standard buttons' },
    xl: { tailwind: 'rounded-2xl', value: '16px', usage: 'Cards, elevated surfaces' },
    full: { tailwind: 'rounded-full', value: '9999px', usage: 'Avatars, toggle switches, step dots' },
    '4xl': { tailwind: 'rounded-4xl', value: '2rem', usage: 'Large marketing elements' },
  },
  shadows: {
    soft: 'shadow-soft',
    card: 'shadow-card',
    gold: 'shadow-gold', // Used for premium/last step
    innerSm: 'shadow-inner-sm',
  },
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const;

/**
 * ==========================================
 * D. COMPONENT SPECIFICATIONS
 * ==========================================
 * Canonical class mappings for UI components to ensure consistency.
 */
export const components = {
  buttons: {
    primary: 'px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-sage-700 to-sage-600 text-white active:scale-95 transition-all',
    secondary: 'px-4 py-2.5 rounded-xl text-sm font-medium border border-navy-600 text-navy-300 hover:border-sage-600 hover:text-sage-400 active:scale-95 transition-all',
    premium: 'px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold active:scale-95 transition-all',
    ghost: 'px-4 py-2.5 rounded-xl text-sm font-medium text-navy-300 hover:text-white transition-all',
    disabled: 'opacity-50 cursor-not-allowed grayscale-[50%]',
  },
  inputs: {
    base: 'w-full rounded-xl border border-navy-700 bg-navy-800/80 px-4 py-3 text-sm text-white placeholder:text-navy-500 transition-all duration-200 outline-none hover:border-navy-500 focus:ring-2 focus:ring-sage-600/50 focus:border-sage-600 disabled:opacity-50 disabled:cursor-not-allowed',
    error: 'border-red-500/70 focus:ring-red-500/50 focus:border-red-500',
    label: 'text-sm font-medium text-navy-200 mb-1.5',
    hint: 'text-xs text-navy-500 mt-1.5',
  },
  cards: {
    default: 'rounded-2xl border border-navy-800 bg-navy-900/50 p-4',
    glass: 'rounded-2xl border border-navy-800 bg-navy-900/80 backdrop-blur-sm p-4',
    highlight: 'rounded-2xl border border-sage-700/50 bg-sage-900/20 p-4',
  },
  navigation: {
    header: 'sticky top-0 z-30 bg-navy-900/95 backdrop-blur-sm border-b border-navy-800',
    bottomNav: 'sticky bottom-0 z-30 bg-navy-900/95 backdrop-blur-sm border-t border-navy-800 pb-safe',
    sidebar: 'fixed right-0 z-50 w-80 bg-navy-900 border-l border-navy-700',
  },
  status: {
    toast: {
      success: 'fixed bottom-24 bg-sage-800 border-sage-600 text-white',
      error: 'fixed bottom-24 bg-red-900 border-red-700 text-white',
    }
  }
} as const;

/**
 * ==========================================
 * E. AUDIT FINDINGS
 * ==========================================
 * Strict mapping of current UI inconsistencies that require refactoring
 * to align with the canonical design system defined above.
 */
export const auditFindings = [
  {
    severity: 'critical',
    file: 'dashboard/page.tsx',
    issue: 'Uses 100% inline style={} objects with hardcoded hex values instead of Tailwind classes.',
    recommendation: 'Refactor all inline styles to use canonical Tailwind utility classes defined in this design system.'
  },
  {
    severity: 'critical',
    file: 'landing.css, auth.css',
    issue: 'Contains hardcoded hex values (#064E3B, #0F172A, etc.) instead of utilizing Tailwind theme tokens.',
    recommendation: 'Remove plain CSS color declarations and replace with @apply directives using Tailwind color tokens, or refactor to use inline Tailwind classes in the respective TSX files.'
  },
  {
    severity: 'critical',
    file: 'globals.css, auth.css',
    issue: 'Duplicate animation definitions (e.g., authSpin defined in both files, fade-in defined in tailwind.config.ts and landing.css).',
    recommendation: 'Consolidate all animation keyframes into tailwind.config.ts and remove from plain CSS files.'
  },
  {
    severity: 'critical',
    file: 'globals.css',
    issue: 'CSS custom properties (:root) only define 4 variables, completely missing the rest of the brand palette.',
    recommendation: 'If CSS variables are strictly needed, map the entire Tailwind scale to :root. Otherwise, rely solely on Tailwind config.'
  },
  {
    severity: 'high',
    file: 'Multiple (StepWrapper vs auth.css vs landing.css)',
    issue: 'Button styling is heavily fragmented (3 different button systems).',
    recommendation: 'Standardize all buttons to use `components.buttons` definitions. Drop custom CSS gradients in auth/landing in favor of Tailwind `bg-gradient-to-r`.'
  },
  {
    severity: 'high',
    file: 'FormFields.tsx vs auth.css',
    issue: 'Input field styling differs. .auth-input uses hardcoded bg/border while FormFields uses Tailwind.',
    recommendation: 'Apply `components.inputs.base` canonical classes to auth inputs and delete .auth-input from auth.css.'
  },
  {
    severity: 'high',
    file: 'Multiple (globals.css vs landing vs dashboard)',
    issue: 'Card styling is fragmented. .glass-card exists but landing/dashboard redefine cards inline.',
    recommendation: 'Standardize all cards to use `components.cards.glass` or `components.cards.default`.'
  },
  {
    severity: 'low',
    file: 'auth.css, globals.css',
    issue: 'Duplicate definition of `.pb-safe` utility.',
    recommendation: 'Keep `.pb-safe` in globals.css as a utility class and remove from auth.css.'
  },
  {
    severity: 'low',
    file: 'tailwind.config.ts vs landing.css',
    issue: 'Box shadow values differ (Tailwind config shadow-card vs inline box-shadow).',
    recommendation: 'Migrate inline box-shadow in landing.css to use Tailwind `shadow-card`.'
  },
  {
    severity: 'low',
    file: 'FormFields.tsx vs globals.css',
    issue: 'Focus ring opacity mismatch (ring-sage-600/50 vs ring-sage-500/60).',
    recommendation: 'Standardize all focus rings to `focus:ring-sage-600/50 focus:border-sage-600`.'
  },
  {
    severity: 'low',
    file: 'FormFields.tsx vs auth.css',
    issue: 'Error color mismatch (text-red-400 vs #F87171). Same hex value, but one is hardcoded.',
    recommendation: 'Use Tailwind `text-red-400` globally.'
  },
  {
    severity: 'low',
    file: 'globals.css / layout.tsx',
    issue: 'color-scheme: dark is only applied to DateInput.',
    recommendation: 'Apply `color-scheme: dark` globally to the <body> or <html> tag to improve native element styling.'
  },
];