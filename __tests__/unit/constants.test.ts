// ============================================================
// __tests__/unit/constants.test.ts
//
// Unit tests for src/lib/constants.ts
// Ensures OPTIONS_TEMPLATE, SELECT OPTIONS, and helpers
// are correctly defined and exported.
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  OPTIONS_TEMPLATE,
  OPTIONS_STATUS_PERNIKAHAN,
  OPTIONS_GOLONGAN_DARAH,
  OPTIONS_JENJANG_PENDIDIKAN,
  OPTIONS_FASE_HIDUP,
  OPTIONS_SHALAT_FARDHU,
  OPTIONS_TIPE_KEPRIBADIAN,
  OPTIONS_PLATFORM_SOSMED,
  OPTIONS_HUBUNGAN_KELUARGA,
  OPTIONS_KATEGORI_GALERI,
  OPTIONS_PENGHASILAN_RANGE,
  OPTIONS_MBTI,
  OPTIONS_BAHASA_CINTA,
  PROVINSI_INDONESIA,
  MAX_ITEMS_PER_SECTION,
  MAX_TAGS,
  getMaxItemsForSection,
  getMaxTags,
  INITIAL_FORM_STATE,
  STEP_DEFINITIONS,
  FILLABLE_FREE_STEPS,
  PREMIUM_ONLY_STEPS,
  CURRENT_YEAR,
} from '@/lib/constants'

describe('OPTIONS_TEMPLATE', () => {
  it('should have 6 templates defined', () => {
    expect(OPTIONS_TEMPLATE.length).toBe(6)
  })

  it('should have 3 free and 3 premium templates', () => {
    const free = OPTIONS_TEMPLATE.filter(t => !t.isPremiumOnly)
    const premium = OPTIONS_TEMPLATE.filter(t => t.isPremiumOnly)
    expect(free.length).toBe(3)
    expect(premium.length).toBe(3)
  })

  it('free templates should have correct values and labels', () => {
    const free = OPTIONS_TEMPLATE.filter(t => !t.isPremiumOnly)

    expect(free[0].value).toBe('ringkas')
    expect(free[0].label).toBe('Ringkas Clean')
    expect(free[0].subtitle).toBe('Clean')

    expect(free[1].value).toBe('sederhana')
    expect(free[1].label).toBe('Qonaah Simple')
    expect(free[1].subtitle).toBe('Simple')

    expect(free[2].value).toBe('minimal_islami')
    expect(free[2].label).toBe('Sakinah Soft')
    expect(free[2].subtitle).toBe('Soft')
  })

  it('premium templates should have correct values and labels', () => {
    const premium = OPTIONS_TEMPLATE.filter(t => t.isPremiumOnly)

    expect(premium[0].value).toBe('akademik')
    expect(premium[0].label).toBe('Amanah Pro')
    expect(premium[0].subtitle).toBe('Pro')

    expect(premium[1].value).toBe('elegant_islamic')
    expect(premium[1].label).toBe("Syar'i Elegant")
    expect(premium[1].subtitle).toBe('Elegant')

    expect(premium[2].value).toBe('modern_dark')
    expect(premium[2].label).toBe('Modern Dark Bold')
    expect(premium[2].subtitle).toBe('Bold')
  })

  it('all templates should have value, label, description, subtitle, and isPremiumOnly', () => {
    for (const t of OPTIONS_TEMPLATE) {
      expect(t.value).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.description).toBeTruthy()
      expect(t.subtitle).toBeTruthy()
      expect(typeof t.isPremiumOnly).toBe('boolean')
    }
  })
})

describe('Select Options', () => {
  it('OPTIONS_STATUS_PERNIKAHAN should have expected values', () => {
    const values = OPTIONS_STATUS_PERNIKAHAN.map(o => o.value)
    expect(values).toContain('lajang')
    expect(values).toContain('duda')
    expect(values).toContain('janda')
    expect(values).toContain('cerai_mati')
    expect(values).toContain('cerai_hidup')
  })

  it('OPTIONS_GOLONGAN_DARAH should have 5 options', () => {
    expect(OPTIONS_GOLONGAN_DARAH.length).toBe(5)
  })

  it('OPTIONS_JENJANG_PENDIDIKAN should include SD, SMP, SMA, S1, S2, S3', () => {
    const values = OPTIONS_JENJANG_PENDIDIKAN.map(o => o.value)
    expect(values).toContain('SD')
    expect(values).toContain('SMP')
    expect(values).toContain('SMA')
    expect(values).toContain('S1')
    expect(values).toContain('S2')
    expect(values).toContain('S3')
  })

  it('OPTIONS_SHALAT_FARDHU should have 5 options', () => {
    expect(OPTIONS_SHALAT_FARDHU.length).toBe(5)
  })

  it('OPTIONS_MBTI should have 16 personality types', () => {
    expect(OPTIONS_MBTI.length).toBe(16)
  })

  it('OPTIONS_BAHASA_CINTA should have 5 love languages', () => {
    expect(OPTIONS_BAHASA_CINTA.length).toBe(5)
  })

  it('PROVINSI_INDONESIA should have 38 provinces', () => {
    expect(PROVINSI_INDONESIA.length).toBe(38)
  })

  it('OPTIONS_PENGHASILAN_RANGE should cover all income brackets', () => {
    expect(OPTIONS_PENGHASILAN_RANGE.length).toBe(6)
    const values = OPTIONS_PENGHASILAN_RANGE.map(o => o.value)
    expect(values).toContain('<3jt')
    expect(values).toContain('>30jt')
  })
})

describe('STEP_DEFINITIONS', () => {
  it('should have 22 steps', () => {
    expect(STEP_DEFINITIONS.length).toBe(22)
  })

  it('each step should have step, title, subtitle, icon, section, isPremiumOnly', () => {
    for (const s of STEP_DEFINITIONS) {
      expect(typeof s.step).toBe('number')
      expect(s.title).toBeTruthy()
      expect(s.subtitle).toBeTruthy()
      expect(s.icon).toBeTruthy()
      expect(s.section).toBeTruthy()
      expect(typeof s.isPremiumOnly).toBe('boolean')
    }
  })

  it('FILLABLE_FREE_STEPS should not include premium-only steps', () => {
    for (const stepNum of FILLABLE_FREE_STEPS) {
      const def = STEP_DEFINITIONS.find(s => s.step === stepNum)
      expect(def?.isPremiumOnly).toBe(false)
    }
  })

  it('PREMIUM_ONLY_STEPS should only include premium steps', () => {
    for (const stepNum of PREMIUM_ONLY_STEPS) {
      const def = STEP_DEFINITIONS.find(s => s.step === stepNum)
      expect(def?.isPremiumOnly).toBe(true)
    }
  })
})

describe('MAX_ITEMS_PER_SECTION', () => {
  it('should have limits for all array sections', () => {
    const expectedKeys = [
      'riwayatPendidikan', 'riwayatPekerjaan', 'perjalananHidup',
      'riwayatOrganisasi', 'anggotaKeluarga', 'rencanaMasaDepan',
      'sosialMedia', 'galeriFoto',
    ]
    for (const key of expectedKeys) {
      expect(MAX_ITEMS_PER_SECTION[key]).toBeDefined()
      expect(MAX_ITEMS_PER_SECTION[key].free).toBeGreaterThanOrEqual(0)
      expect(MAX_ITEMS_PER_SECTION[key].pro).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('MAX_TAGS', () => {
  it('should have limits for kelebihan, kekurangan, hobi', () => {
    expect(MAX_TAGS.kelebihan).toBeDefined()
    expect(MAX_TAGS.kekurangan).toBeDefined()
    expect(MAX_TAGS.hobi).toBeDefined()
    expect(MAX_TAGS.kelebihan.free).toBeLessThanOrEqual(MAX_TAGS.kelebihan.pro)
  })
})

describe('getMaxItemsForSection', () => {
  it('should return pro limit for premium plan', () => {
    const result = getMaxItemsForSection('riwayatPendidikan', 'premium')
    expect(result).toBe(MAX_ITEMS_PER_SECTION.riwayatPendidikan.pro)
  })

  it('should return free limit for free plan', () => {
    const result = getMaxItemsForSection('riwayatPendidikan', 'free')
    expect(result).toBe(MAX_ITEMS_PER_SECTION.riwayatPendidikan.free)
  })

  it('should return pro limit for pro plan', () => {
    const result = getMaxItemsForSection('riwayatPekerjaan', 'pro')
    expect(result).toBe(MAX_ITEMS_PER_SECTION.riwayatPekerjaan.pro)
  })

  it('should return defaultMax for unknown section', () => {
    expect(getMaxItemsForSection('unknown_section', 'free', 50)).toBe(50)
  })
})

describe('getMaxTags', () => {
  it('should return free tag limit for free plan', () => {
    expect(getMaxTags('kelebihan', 'free')).toBe(MAX_TAGS.kelebihan.free)
  })

  it('should return pro tag limit for premium plan', () => {
    expect(getMaxTags('kelebihan', 'premium')).toBe(MAX_TAGS.kelebihan.pro)
  })

  it('should return defaultMax for unknown tag key', () => {
    expect(getMaxTags('unknown_tag', 'free', 99)).toBe(99)
  })
})

describe('INITIAL_FORM_STATE', () => {
  it('should have all required sections', () => {
    expect(INITIAL_FORM_STATE.dataPribadi).toBeDefined()
    expect(INITIAL_FORM_STATE.fisikKesehatan).toBeDefined()
    expect(INITIAL_FORM_STATE.karakter).toBeDefined()
    expect(INITIAL_FORM_STATE.ibadah).toBeDefined()
    expect(INITIAL_FORM_STATE.gayaHidup).toBeDefined()
    expect(INITIAL_FORM_STATE.visiMisi).toBeDefined()
    expect(INITIAL_FORM_STATE.kriteria).toBeDefined()
    expect(INITIAL_FORM_STATE.financialPlanning).toBeDefined()
    expect(INITIAL_FORM_STATE.pandanganIsu).toBeDefined()
    expect(INITIAL_FORM_STATE.fotoTemplate).toBeDefined()
  })

  it('should default template to ringkas', () => {
    expect(INITIAL_FORM_STATE.fotoTemplate.template_pilihan).toBe('ringkas')
  })

  it('should default plan to free', () => {
    expect(INITIAL_FORM_STATE.plan).toBe('free')
  })

  it('should have 22 total steps', () => {
    expect(INITIAL_FORM_STATE.totalSteps).toBe(22)
  })
})

describe('CURRENT_YEAR', () => {
  it('should be the current year', () => {
    expect(CURRENT_YEAR).toBeGreaterThanOrEqual(2025)
    expect(CURRENT_YEAR).toBeLessThanOrEqual(2030)
  })
})