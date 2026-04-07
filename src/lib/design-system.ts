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
    primary: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-sage-700 to-sage-600 text-white no-underline border-0 cursor-pointer active:scale-95 transition-all hover:-translate-y-px hover:shadow-card disabled:opacity-60 disabled:cursor-not-allowed dark:from-sage-900 dark:to-sage-700',
    secondary: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-transparent border border-navy-200 text-navy-700 no-underline cursor-pointer active:scale-95 transition-all hover:border-navy-400 hover:bg-navy-100/10 dark:border-navy-600/50 dark:text-navy-300 dark:hover:border-navy-400 dark:hover:bg-navy-100/5',
    premium: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold no-underline border-0 cursor-pointer active:scale-95 transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed',
    ghost: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-transparent text-navy-700 no-underline border-0 cursor-pointer transition-all hover:text-sage-600 dark:text-navy-300 dark:hover:text-sage-300',
    outline: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-transparent text-sage-600 border border-sage-500 no-underline cursor-pointer transition-all hover:bg-sage-500/10 dark:text-sage-300 dark:border-sage-800 dark:hover:bg-sage-900/10',
    danger: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-transparent border border-red-200 text-red-600 no-underline cursor-pointer transition-all hover:bg-red-50 active:scale-95 dark:border-red-800/30 dark:text-red-300 dark:hover:bg-red-900/15',
    dangerSolid: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white no-underline border-0 cursor-pointer active:scale-95 transition-all hover:bg-red-500 dark:bg-red-900 dark:text-red-200',
    iconOnly: 'inline-flex items-center justify-center w-8 h-8 rounded-lg bg-transparent border border-navy-200 text-navy-500 cursor-pointer transition-all hover:bg-navy-100 hover:text-navy-700 dark:border-navy-700 dark:text-navy-400 dark:hover:bg-navy-800 dark:hover:text-white',
    disabled: 'opacity-50 cursor-not-allowed grayscale-[50%]',
    sizeLg: 'py-3.5 px-8 text-base rounded-2xl',
    sizeSm: 'py-1.5 px-3 text-xs rounded-lg',
    fullWidth: 'w-full',
  },
  inputs: {
    base: 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 transition-all duration-200 outline-none hover:border-gray-300 focus:ring-2 focus:ring-sage-600/50 focus:ring-offset-2 focus:ring-offset-white focus:border-sage-600 disabled:opacity-50 disabled:cursor-not-allowed dark:border-navy-700 dark:bg-navy-800/80 dark:text-white dark:placeholder:text-navy-500 dark:hover:border-navy-500 dark:focus:ring-offset-navy-900',
    error: 'border-red-500/70 focus:ring-red-500/50 focus:border-red-500',
    label: 'text-sm font-medium text-navy-700 dark:text-navy-200 mb-1.5',
    hint: 'text-xs text-navy-500 mt-1.5',
  },
  cards: {
    default: 'rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-navy-800/50 dark:bg-navy-900/50',
    glass: 'rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-4 dark:border-navy-800 dark:bg-navy-900/80',
    highlight: 'rounded-2xl border border-sage-200 bg-sage-50/50 p-4 dark:border-sage-700/50 dark:bg-sage-900/20',
    auth: 'rounded-3xl border border-navy-200 bg-white/90 backdrop-blur-xl p-8 sm:p-10 dark:border-navy-800/60 dark:bg-navy-900/70',
  },
  navigation: {
    header: 'sticky top-0 z-30 bg-navy-900/95 backdrop-blur-sm border-b border-navy-800',
    bottomNav: 'sticky bottom-0 z-30 bg-navy-900/95 backdrop-blur-sm border-t border-navy-800 pb-safe',
    sidebar: 'fixed right-0 z-50 w-80 bg-navy-900 border-l border-navy-700',
  },
  badges: {
    default: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300',
    pro: 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gold-900/30 border border-gold-700/40 text-gold-500',
    premium: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-900/30 border border-gold-700/40 text-gold-400 text-[10px] font-bold uppercase tracking-wider',
    statusActive: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-sage-500/10 border border-sage-500/20 text-sage-700 dark:bg-sage-900/15 dark:border-sage-900/30 dark:text-sage-300',
    statusExpired: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/10 dark:border-red-800/30 dark:text-red-300',
    statusCancelled: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-navy-50 border border-navy-200 text-navy-400 dark:bg-navy-900/30 dark:border-navy-700 dark:text-navy-500',
    statusTrial: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-900/10 dark:border-blue-800/30 dark:text-blue-300',
    statusFree: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-navy-50 border border-navy-200 text-navy-500 dark:bg-navy-900/30 dark:border-navy-700 dark:text-navy-400',
    statusAdmin: 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 border border-gold-300 text-gold-700 dark:bg-gold-900/20 dark:border-gold-700/40 dark:text-gold-400',
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
    severity: 'high',
    file: 'cv/[shareId]/page.tsx',
    issue: 'Uses emerald-600/500 for primary CTA instead of brand sage color.',
    recommendation: 'Replace from-emerald-600/500 with from-sage-700/600 to match brand palette.'
  },
  {
    severity: 'high',
    file: 'ThemeToggle.tsx',
    issue: 'Uses raw style={{}} object for button styling instead of Tailwind.',
    recommendation: 'Replace inline style with Tailwind className using design-system tokens.'
  },
  {
    severity: 'high',
    file: 'admin-layout.css',
    issue: 'Button system uses hardcoded hex with no Tailwind, no dark mode, no design system alignment.',
    recommendation: 'Migrate admin buttons to use Tailwind classes aligned with components.buttons tokens.'
  },
  {
    severity: 'medium',
    file: 'create.css',
    issue: 'form-btn-prev/next/submit use raw CSS gradients instead of @apply Tailwind tokens.',
    recommendation: 'Migrate to @apply using components.buttons.secondary/primary/premium tokens.'
  },
  {
    severity: 'medium',
    file: 'preview.css',
    issue: 'Multiple button classes (download, print, edit, success) use hardcoded rgba values.',
    recommendation: 'Migrate to @apply using Tailwind tokens aligned with design system.'
  },
  {
    severity: 'medium',
    file: 'dashboard.css',
    issue: 'dash-card hover uses hardcoded rgba border-color instead of Tailwind tokens.',
    recommendation: 'Replace with Tailwind hover:border-gray-300 dark:hover:border-navy-600.'
  },
  {
    severity: 'low',
    file: 'Multiple TSX files',
    issue: 'Inline button className strings duplicate design-system tokens (e.g., PremiumOverlay, PWAInstallPrompt, DynamicList).',
    recommendation: 'Import and use components.buttons.* tokens from design-system.ts.'
  },
  {
    severity: 'low',
    file: 'share-menu.css',
    issue: 'Button classes prefixed with .preview-btn-* causing naming collision with preview.css.',
    recommendation: 'Rename to .share-btn-* prefix.'
  },
  // ── Resolved in Fase 1 (kept for reference) ──
  // ✅ pb-safe duplication — cleaned
  // ✅ Focus ring opacity — standardized to ring-sage-600/50
  // ✅ Hardcoded hex in auth.css — migrated to CSS custom properties
  // ✅ color-scheme: dark global — now toggles dynamically via ThemeContext
];