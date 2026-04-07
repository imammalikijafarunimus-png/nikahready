// ============================================================
// vitest.config.ts
// Fase 5.3 — Vitest configuration
//
// Install: npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
// ============================================================

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment untuk testing React components
    environment: 'jsdom',

    // Global setup
    globals: true,

    // Setup file untuk @testing-library/jest-dom matchers
    setupFiles: ['./__tests__/setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/context/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/types/**',
        'src/lib/generatePdf.ts', // Browser-specific, hard to unit test
      ],
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },

    // File patterns
    include: ['__tests__/**/*.test.{ts,tsx}'],

    // Timeout untuk async tests
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
