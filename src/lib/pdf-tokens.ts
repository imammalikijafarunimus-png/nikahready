// ============================================================
// src/lib/pdf-tokens.ts
//
// Shared design tokens for ALL PDF templates.
// Centralized: colors, spacing, label maps, financial bar colors.
// Every template MUST import from here — no local color constants.
//
// PDF-SAFE RULES:
// ✓ All values are hex literals or rgba() strings
// ✓ No CSS variables, no Tailwind classes
// ============================================================

// ── Page Dimensions (A4 @96dpi) ───────────────────────────────
export const PAGE_W = 794
export const PAGE_H = 1123

// ── Spacing Scale ─────────────────────────────────────────────
export const SPACING = {
  /** Free templates (compact) */
  pagePadFree: 32,
  /** Standard templates */
  pagePad: 40,
  /** Premium templates with ornamental corners */
  pagePadPremium: 44,
  /** Bottom padding to leave room for footer */
  pageBottom: 36,
  /** Section margin bottom */
  sectionGap: 16,
  /** Divider margin */
  dividerMargin: '16px 0',
} as const

// ── Font Sizes ────────────────────────────────────────────────
export const FONT = {
  /** Section title (uppercase) */
  heading: 12,
  /** Sub-section label */
  subheading: 11,
  /** Body text */
  body: 10,
  /** Small label */
  label: 9,
  /** Micro text (footnotes, chips) */
  micro: 8,
  /** Name / hero */
  name: 26,
  /** Arabic text */
  arabic: 18,
} as const

// ── Color Palettes (per template theme) ───────────────────────

/** Navy + Gold — used by TemplateRingkas */
export const THEME_NAVY = {
  name: 'navy' as const,
  primary:    '#0F172A',
  secondary:  '#1E293B',
  tertiary:   '#334155',
  accent:     '#D97706',
  accentAlt:  '#F59E0B',
  bg:         '#FFFFFF',
  bgAlt:      '#F8FAFC',
  text:       '#1E293B',
  textMid:    '#475569',
  textSoft:   '#94A3B8',
  divider:    '#F1F5F9',
  footerBg:   '#0F172A',
  footerText: 'rgba(255,255,255,0.45)',
  footerTextStrong: 'rgba(255,255,255,0.55)',
} as const

/** Sage Green + Navy + Gold — used by TemplateSederhana & TemplateAkademik */
export const THEME_SAGE = {
  name: 'sage' as const,
  primary:    '#064E3B',
  secondary:  '#065F46',
  tertiary:   '#047857',
  accent:     '#059669',
  accentGold: '#D97706',
  accentGoldAlt: '#F59E0B',
  navy:       '#0F172A',
  navyMid:    '#334155',
  navySoft:   '#64748B',
  bg:         '#FFFFFF',
  bgAlt:      '#ECFDF5',
  bgAltGold:  '#FEF3C7',
  text:       '#1E293B',
  textMid:    '#475569',
  textSoft:   '#94A3B8',
  divider:    '#F1F5F9',
  footerBg:   '#064E3B',
  footerText: 'rgba(255,255,255,0.5)',
  footerTextStrong: 'rgba(255,255,255,0.6)',
} as const

/** Deep Green + Gold (Islamic ornamental) — used by TemplateMinimalIslami & TemplateElegantIslamic */
export const THEME_ISLAMIC = {
  name: 'islamic' as const,
  primary:    '#1B4332',
  secondary:  '#2D6A4F',
  tertiary:   '#40916C',
  accent:     '#52B788',
  gold:       '#C9A84C',
  goldAlt:    '#D4A843',
  goldLight:  '#E8C872',
  goldDark:   '#B8860B',
  bg:         '#FFFCF5',
  bgGreen:    '#F0FFF4',
  bgGold:     '#FEFBF0',
  text:       '#1A1A2E',
  textMid:    '#4A4A5A',
  textSoft:   '#7A7A8A',
  textMuted:  '#AAAABC',
  divider:    '#E5E5E0',
  dividerAlt: '#F5F5F0',
  footerBg:   '#1B4332',
  footerText: 'rgba(255,255,255,0.4)',
  footerTextStrong: 'rgba(255,255,255,0.5)',
} as const

/** Dark + Indigo — used by TemplateModernPremium */
export const THEME_MODERN = {
  name: 'modern' as const,
  primary:    '#0F172A',
  secondary:  '#1E293B',
  tertiary:   '#334155',
  accent:     '#6366F1',
  accentSoft: '#EEF2FF',
  accentMid:  '#818CF8',
  gold:       '#D97706',
  goldSoft:   '#FEF3C7',
  bg:         '#FFFFFF',
  bgAlt:      '#F8FAFC',
  text:       '#1E293B',
  textMid:    '#475569',
  textSoft:   '#64748B',
  textMuted:  '#94A3B8',
  divider:    '#E2E8F0',
  footerBg:   '#0F172A',
  footerText: 'rgba(255,255,255,0.4)',
  footerTextStrong: 'rgba(255,255,255,0.5)',
} as const

// ── Financial Bar Colors (shared across all templates) ────────
export const FINANCIAL_COLORS = {
  pokok:   '#059669',  // sage green
  tabungan:'#3B82F6',  // blue
  investasi:'#8B5CF6',  // purple
  sedekah: '#D97706',  // gold
  lainnya: '#94A3B8',  // gray
} as const

// ── Phase Colors for Perjalanan Hidup ─────────────────────────
export const FASE_COLORS: Record<string, { color: string; label: string }> = {
  masa_kecil:  { color: '#3B82F6', label: 'Masa Kecil' },
  remaja:      { color: '#8B5CF6', label: 'Remaja' },
  dewasa_awal: { color: '#059669', label: 'Dewasa Awal' },
  saat_ini:    { color: '#D97706', label: 'Fase Sekarang' },
} as const

// ── Shared Label Maps (no emojis — text only) ─────────────────
export const STATUS_LABELS: Record<string, string> = {
  lajang:      'Lajang / Belum Pernah Menikah',
  duda:        'Duda',
  janda:       'Janda',
  cerai_mati:  'Cerai Mati',
  cerai_hidup: 'Cerai Hidup',
}

export const SHALAT_LABELS: Record<string, string> = {
  selalu_berjamaah: 'Alhamdulillah, selalu berjamaah',
  sering_berjamaah: 'Sering berjamaah',
  sering_sendiri:   'Sering, tapi sendiri',
  kadang:           'Kadang-kadang',
  masih_berjuang:   'Masih berjuang',
}

export const TIPE_LABELS: Record<string, string> = {
  introvert:  'Introvert',
  ekstrovert: 'Ekstrovert',
  ambivert:   'Ambivert',
}

// ── Photo Placeholder ─────────────────────────────────────────
/** Shape-only photo placeholder (no emoji) */
export const PHOTO_PLACEHOLDER = {
  width: 100,
  height: 120,
  borderRadius: 8,
  border: '2px dashed',
  borderColor: '#94A3B8',
  bg: '#F1F5F9',
  label: 'Foto',
  labelColor: '#94A3B8',
  labelSize: 9,
} as const

// ── Utility: Hitung usia ──────────────────────────────────────
export function hitungUsia(tanggalLahir?: string): number | null {
  if (!tanggalLahir) return null
  return Math.floor(
    (Date.now() - new Date(tanggalLahir).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  )
}

// ── Utility: Format TTL ───────────────────────────────────────
export function formatTTL(
  tempat?: string,
  tanggal?: string
): string | undefined {
  if (!tempat || !tanggal) return undefined
  return `${tempat}, ${new Date(tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`
}

// ── Type for theme colors (union of all themes) ───────────────
export type PdfTheme =
  | typeof THEME_NAVY
  | typeof THEME_SAGE
  | typeof THEME_ISLAMIC
  | typeof THEME_MODERN