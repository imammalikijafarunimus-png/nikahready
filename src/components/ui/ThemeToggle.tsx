// ============================================================
// src/components/ui/ThemeToggle.tsx
// Theme Overhaul — Toggle button for light/dark mode
//
// Ditampilkan di navbar/header aplikasi.
// Ikon: Sun (light) / Moon (dark) dari lucide-react.
// ============================================================

'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface ThemeToggleProps {
  className?: string
  size?: number
}

export function ThemeToggle({ className = '', size = 18 }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className}
      aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      title={isDark ? 'Mode Terang' : 'Mode Gelap'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '8px',
        border: '1px solid rgba(100,116,139,0.2)',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: isDark ? '#FBBF24' : '#334155',
      }}
    >
      {isDark ? (
        <Sun size={size} />
      ) : (
        <Moon size={size} />
      )}
    </button>
  )
}