import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Warna Tema NikahReady ──────────────────────────────
      colors: {
        sage: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',  // ← Primary brand color
          950: '#022C22',
        },
        navy: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',  // ← Dark background
          950: '#020617',
        },
        cream: {
          50:  '#FFFBEB',
          100: '#FEF3C7',  // ← Soft background / card
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
        },
        gold: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',  // ← Accent / highlight
          700: '#B45309',
          800: '#92400E',
        },
      },

      // ── Font Family ──────────────────────────────────────
      fontFamily: {
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        serif:  ['Georgia', 'serif'],
      },

      // ── Font Size Extensions ─────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // ── Spacing & Sizing ─────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ── Border Radius ────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },

      // ── Box Shadow ───────────────────────────────────────
      boxShadow: {
        'soft':      '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card':      '0 4px 24px -2px rgba(6, 78, 59, 0.08)',
        'gold':      '0 4px 14px 0 rgba(217, 119, 6, 0.3)',
        'inner-sm':  'inset 0 1px 3px 0 rgba(0, 0, 0, 0.08)',
      },

      // ── Background Gradient ──────────────────────────────
      backgroundImage: {
        'islamic-pattern':     "url('/images/pattern-islamic.svg')",
        'gradient-sage':       'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)',
        'gradient-navy-sage':  'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)',
        'gradient-cream':      'linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)',
        'gradient-gold':       'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      },

      // ── Animation ────────────────────────────────────────
      // Canonical: all animations consolidated here.
      // Duplicates removed from globals.css, auth.css, landing.css.
      keyframes: {
        'slide-up': {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'progress': {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // ── Step transition (from globals.css animate-step-in) ──
        'step-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // ── Sidebar slide-in (from globals.css animate-slide-in-right) ──
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        // ── Spinner (from globals.css .auth-spinner + auth.css duplicate) ──
        'spin': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'slide-up':        'slide-up 0.3s ease-out',
        'fade-in':         'fade-in 0.4s ease-out',
        'progress':        'progress 0.6s ease-out forwards',
        'shimmer':         'shimmer 1.5s infinite linear',
        'step-in':         'step-in 0.25s ease-out forwards',
        'slide-in-right':  'slide-in-right 0.25s ease-out forwards',
        'spin':            'spin 0.6s linear infinite',
      },

      // ── Screen Breakpoints ───────────────────────────────
      screens: {
        'xs': '375px',
        // Default Tailwind: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
        'print': { 'raw': 'print' },
      },

      // ── Typography / Prose ───────────────────────────────
      typography: {
        DEFAULT: {
          css: {
            color: '#0F172A',
            a: {
              color:          '#064E3B',
              '&:hover': {
                color: '#D97706',
              },
            },
            h1: { color: '#0F172A', fontWeight: '700' },
            h2: { color: '#064E3B', fontWeight: '600' },
            h3: { color: '#064E3B', fontWeight: '600' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config