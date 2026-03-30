'use client'

// ============================================================
// src/context/FormContext.tsx
//
// Arsitektur: Split Context (State + Dispatch terpisah)
// Alasan: Komponen yang hanya men-dispatch tidak re-render
//         ketika state berubah — performa lebih baik.
//
// Anti-pattern yang dihindari:
// ✗ Load localStorage di useReducer initializer (SSR hydration mismatch)
// ✗ Single context untuk state + dispatch
// ✗ Pakai index array sebagai key (gunakan id: string)
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react'

import {
  FORM_DRAFT_KEY,
  FORM_DRAFT_VERSION,
  INITIAL_FORM_STATE,
} from '@/lib/constants'

import type {
  AnyArrayItem,
  ArraySection,
  ArraySectionItemMap,
  FormAction,
  FormState,
  ScalarSection,
} from '@/types'

// ── Util: safe UUID generator (client-side only) ─────────────
// Hanya dipanggil di event handler (onClick), bukan saat render
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback untuk env lama
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ── Context Declarations ─────────────────────────────────────
const FormStateContext = createContext<FormState | null>(null)
const FormDispatchContext = createContext<React.Dispatch<FormAction> | null>(null)

// ── Reducer ──────────────────────────────────────────────────
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {

    // -- Navigation -------------------------------------------
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }

        // -- Scalar field update ----------------------------------
    case 'UPDATE_FIELD': {
      const currentSection = state[action.section as keyof FormState]
      
      // Guard: hanya spread object (bukan array/primitive/null)
      const currentObj = 
        typeof currentSection === 'object' && 
        currentSection !== null && 
        !Array.isArray(currentSection)
          ? (currentSection as unknown as Record<string, unknown>)
          : {}

      return {
        ...state,
        isDirty: true,
        [action.section]: {
          ...currentObj,
          [action.field]: action.value,
        },
      }
    }

    // -- Array: tambah item baru ------------------------------
    case 'ADD_ITEM': {
      const currentArray = state[action.section] as AnyArrayItem[]
      return {
        ...state,
        isDirty: true,
        [action.section]: [...currentArray, action.item],
      }
    }

    // -- Array: hapus item berdasarkan id ---------------------
    case 'REMOVE_ITEM': {
      const currentArray = state[action.section] as AnyArrayItem[]
      return {
        ...state,
        isDirty: true,
        [action.section]: currentArray.filter((item) => item.id !== action.id),
      }
    }

    // -- Array: update satu field dalam satu item -------------
    case 'UPDATE_ITEM': {
      const currentArray = state[action.section] as AnyArrayItem[]
      return {
        ...state,
        isDirty: true,
        [action.section]: currentArray.map((item) =>
          item.id === action.id
            ? { ...item, [action.field]: action.value }
            : item
        ),
      }
    }

    // -- Array: reorder (drag & drop) -------------------------
    case 'REORDER_ITEMS':
      return {
        ...state,
        isDirty: true,
        [action.section]: action.items,
      }

    // -- Persistence ------------------------------------------
    case 'LOAD_PROFILE':
      return {
        ...state,
        ...action.payload,
        isDirty: false,
      }

    case 'SET_PROFILE_ID':
      return { ...state, profileId: action.profileId }

    case 'SET_SAVING':
      return { ...state, isSaving: action.isSaving }

    case 'SET_SAVED':
      return {
        ...state,
        isSaving: false,
        isDirty: false,
        lastSavedAt: action.timestamp,
      }

    case 'SET_DIRTY':
      return { ...state, isDirty: action.isDirty }

    // -- Reset ------------------------------------------------
    case 'RESET_FORM':
      return { ...INITIAL_FORM_STATE }

    default:
      return state
  }
}

// ── Serialization helpers ────────────────────────────────────
interface DraftData {
  version: string
  state: Partial<FormState>
  savedAt: string
}

function serializeDraft(state: FormState): string {
  const draft: DraftData = {
    version: FORM_DRAFT_VERSION,
    state,
    savedAt: new Date().toISOString(),
  }
  return JSON.stringify(draft)
}

function deserializeDraft(raw: string): Partial<FormState> | null {
  try {
    const draft = JSON.parse(raw) as DraftData
    // Cek versi — jika berbeda, draft lama diabaikan
    if (draft.version !== FORM_DRAFT_VERSION) {
      console.info('[NikahReady] Draft version mismatch, resetting draft.')
      return null
    }
    return draft.state
  } catch {
    return null
  }
}

// ── Provider ─────────────────────────────────────────────────
interface FormProviderProps {
  children: React.ReactNode
}

export function FormProvider({ children }: FormProviderProps) {
  // Init selalu dengan INITIAL_FORM_STATE (sama antara server & client)
  // Load dari localStorage hanya via useEffect untuk menghindari
  // SSR hydration mismatch
  const [state, dispatch] = useReducer(formReducer, INITIAL_FORM_STATE)

  // Flag: apakah sudah hydrated (localStorage sudah di-load)
  const isHydratedRef = useRef(false)

  // ── Load draft dari localStorage setelah hydration ─────────
  useEffect(() => {
    if (isHydratedRef.current) return
    isHydratedRef.current = true

    try {
      const raw = localStorage.getItem(FORM_DRAFT_KEY)
      if (raw) {
        const saved = deserializeDraft(raw)
        if (saved) {
          dispatch({ type: 'LOAD_PROFILE', payload: saved })
        }
      }
    } catch (e) {
      // localStorage bisa gagal di private mode / storage penuh
      console.warn('[NikahReady] Could not load draft from localStorage:', e)
    }
  }, [])

  // ── Auto-save draft ke localStorage (debounced 800ms) ──────
  // Hanya berjalan jika ada perubahan (isDirty)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!state.isDirty) return

    // Clear timer sebelumnya (debounce)
    clearTimeout(saveTimerRef.current)

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(FORM_DRAFT_KEY, serializeDraft(state))
      } catch (e) {
        console.warn('[NikahReady] Could not save draft to localStorage:', e)
      }
    }, 800)

    return () => clearTimeout(saveTimerRef.current)
  }, [state])

  // ── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => clearTimeout(saveTimerRef.current)
  }, [])

  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        {children}
      </FormDispatchContext.Provider>
    </FormStateContext.Provider>
  )
}

// ── Base Hooks ────────────────────────────────────────────────

/**
 * Hook untuk membaca seluruh form state.
 * Gunakan ini jika komponen membutuhkan banyak section.
 */
export function useFormState(): FormState {
  const ctx = useContext(FormStateContext)
  if (ctx === null) {
    throw new Error(
      '[NikahReady] useFormState harus digunakan di dalam <FormProvider>. ' +
      'Pastikan FormProvider ada di root layout.'
    )
  }
  return ctx
}

/**
 * Hook untuk mendapatkan dispatch function.
 * Komponen yang hanya men-dispatch tidak perlu subscribe ke state.
 */
export function useFormDispatch(): React.Dispatch<FormAction> {
  const ctx = useContext(FormDispatchContext)
  if (ctx === null) {
    throw new Error(
      '[NikahReady] useFormDispatch harus digunakan di dalam <FormProvider>.'
    )
  }
  return ctx
}

// ── Convenience Hooks ────────────────────────────────────────

/**
 * Hook type-safe untuk mengakses satu field dari scalar section.
 *
 * Contoh penggunaan:
 * const [namaLengkap, setNamaLengkap] = useSectionField('dataPribadi', 'nama_lengkap')
 *
 * TypeScript akan:
 * - Memvalidasi bahwa 'nama_lengkap' adalah key yang valid di DataPribadi
 * - Menginfer tipe return sebagai string (sesuai definisi di interface)
 */
export function useSectionField<
  S extends ScalarSection,
  F extends keyof FormState[S]
>(
  section: S,
  field: F
): [FormState[S][F], (value: FormState[S][F]) => void] {
  const state = useFormState()
  const dispatch = useFormDispatch()

  const value = (state[section] as FormState[S])[field]

  const setValue = useCallback(
    (newValue: FormState[S][F]) => {
      dispatch({
        type: 'UPDATE_FIELD',
        section,
        field: field as string,
        value: newValue,
      })
    },
    [dispatch, section, field]
  )

  return [value, setValue]
}

/**
 * Hook untuk mengakses dan memanipulasi array section.
 *
 * Contoh penggunaan:
 * const { items, addItem, removeItem, updateItem } =
 *   useArraySection<RiwayatPekerjaanItem>('riwayatPekerjaan')
 *
 * Generic T secara otomatis diinfer dari ArraySectionItemMap
 */
export function useArraySection<S extends ArraySection>(section: S) {
  const state = useFormState()
  const dispatch = useFormDispatch()

  type T = ArraySectionItemMap[S]

  const items = state[section] as T[]

  const addItem = useCallback(
    (item: T) => {
      dispatch({ type: 'ADD_ITEM', section, item: item as AnyArrayItem })
    },
    [dispatch, section]
  )

  const removeItem = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_ITEM', section, id })
    },
    [dispatch, section]
  )

  const updateItem = useCallback(
    (id: string, field: keyof T, value: T[keyof T]) => {
      dispatch({
        type: 'UPDATE_ITEM',
        section,
        id,
        field: field as string,
        value,
      })
    },
    [dispatch, section]
  )

  const reorderItems = useCallback(
    (newItems: T[]) => {
      dispatch({
        type: 'REORDER_ITEMS',
        section,
        items: newItems as AnyArrayItem[],
      })
    },
    [dispatch, section]
  )

  return { items, addItem, removeItem, updateItem, reorderItems }
}

/**
 * Hook untuk navigasi antar step dengan boundary checking.
 */
export function useStepNavigation() {
  const { currentStep, totalSteps, isDirty } = useFormState()
  const dispatch = useFormDispatch()

  const goToStep = useCallback(
    (step: number) => {
      const bounded = Math.max(1, Math.min(step, totalSteps))
      dispatch({ type: 'SET_STEP', payload: bounded })
      // Scroll to top saat ganti step
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [dispatch, totalSteps]
  )

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1)
  }, [goToStep, currentStep])

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1)
  }, [goToStep, currentStep])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  return {
    currentStep,
    totalSteps,
    isDirty,
    isFirstStep,
    isLastStep,
    progressPercent,
    goToStep,
    nextStep,
    prevStep,
  }
}

/**
 * Hook untuk mendapatkan status penyimpanan.
 */
export function useSaveStatus() {
  const { isSaving, isDirty, lastSavedAt } = useFormState()

  const lastSavedLabel = lastSavedAt
    ? new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(lastSavedAt))
    : null

  return { isSaving, isDirty, lastSavedAt, lastSavedLabel }
}

/**
 * Hook untuk reset form dengan konfirmasi.
 */
export function useResetForm() {
  const dispatch = useFormDispatch()

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
    // Hapus draft dari localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(FORM_DRAFT_KEY)
      } catch {
        // silent fail
      }
    }
  }, [dispatch])

  return { resetForm }
}
