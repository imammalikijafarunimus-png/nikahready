// ============================================================
// src/components/ui/index.ts
// Barrel export untuk semua komponen UI
// ============================================================

// ── Wrapper Components (design-system.ts backed) ──────────
export { Button } from './Button'
export { Input } from './Input'
export { Card } from './Card'
export { Badge } from './Badge'

// ── Layout ────────────────────────────────────────────────
export { StepWrapper } from './StepWrapper'

// ── Dynamic array list ────────────────────────────────────
export { DynamicList } from './DynamicList'

// ── Form fields ───────────────────────────────────────────
export {
  TextInput,
  TextArea,
  SelectInput,
  NumberInput,
  ToggleSwitch,
  RadioGroup,
  TagInput,
  DateInput,
  SectionCard,
} from './FormFields'

// ── Shared components ─────────────────────────────────────
export { EyeIcon } from './EyeIcon'
export { ScaleWrapper, PDF_WIDTH_PX, PDF_PAGE_HEIGHT_PX } from './ScaleWrapper'
export { TrustIndicator, DEFAULT_AUTH_TRUST_ITEMS } from './TrustIndicator'
export type { TrustItem } from './TrustIndicator'

// ── Accessibility components (WCAG 2.1) ──────────────────
export { FocusTrap } from './FocusTrap'
export { AriaLive } from './AriaLive'