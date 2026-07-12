/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  safelist: ['dark'],
  theme: {
    extend: {
      colors: {
        // ── Brand / Action ──────────────────────────────────────
        primary: {
          DEFAULT: '#3B82F6',
          hover:   '#2563EB',
          active:  '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#10B981',
        },
        accent: {
          DEFAULT: '#8B5CF6',
        },

        // ── Semantic Status ──────────────────────────────────────
        success: {
          DEFAULT: '#22C55E',
          muted:   '#14532D',
          text:    '#86EFAC',
        },
        warning: {
          DEFAULT: '#F59E0B',
          muted:   '#78350F',
          text:    '#FDE68A',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover:   '#DC2626',
          muted:   '#7F1D1D',
          text:    '#FCA5A5',
        },
        info: {
          DEFAULT: '#38BDF8',
          muted:   '#0C4A6E',
          text:    '#BAE6FD',
        },

        // ── Backgrounds ──────────────────────────────────────────
        bg: {
          base:      '#0F172A',
          secondary: '#111827',
          sidebar:   '#1E293B',
          navbar:    '#1F2937',
          card:      '#1E293B',
          modal:     '#111827',
          dropdown:  '#1F2937',
          hover:     '#1E293B',
          active:    '#273549',
          overlay:   'rgba(0, 0, 0, 0.6)',
        },

        // ── Text ─────────────────────────────────────────────────
        content: {
          primary:   '#F8FAFC',
          secondary: '#CBD5E1',
          muted:     '#94A3B8',
          disabled:  '#64748B',
          inverse:   '#0F172A',
          link:      '#3B82F6',
          'link-hover': '#2563EB',
        },

        // ── Borders ───────────────────────────────────────────────
        border: {
          DEFAULT: '#334155',
          card:    '#475569',
          input:   '#475569',
          focus:   '#3B82F6',
          strong:  '#64748B',
        },
      },

      // ── Typography ────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // ── Shadows (dark-optimised) ──────────────────────────────
      boxShadow: {
        card:     '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
        'card-md':'0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4)',
        'card-lg':'0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -4px rgba(0,0,0,0.4)',
        modal:    '0 25px 50px -12px rgba(0,0,0,0.8)',
        sidebar:  '4px 0 24px rgba(0,0,0,0.4)',
        glow:     '0 0 20px rgba(59,130,246,0.3)',
        'glow-sm':'0 0 10px rgba(59,130,246,0.2)',
        input:    '0 0 0 3px rgba(59,130,246,0.2)',
      },

      // ── Layout ────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },
      screens: {
        xs: '475px',
      },

      // ── Spacing / Sizing ──────────────────────────────────────
      spacing: {
        sidebar: '256px',
        navbar:  '64px',
      },

      // ── Z-Index ───────────────────────────────────────────────
      zIndex: {
        sidebar: '40',
        navbar:  '50',
        modal:   '60',
        toast:   '70',
        tooltip: '80',
      },

      // ── Transitions ───────────────────────────────────────────
      transitionDuration: {
        250: '250ms',
      },

      // ── Animations ────────────────────────────────────────────
      animation: {
        'fade-in':   'fadeIn 0.2s ease-in-out',
        'fade-up':   'fadeUp 0.25s ease-out',
        'slide-in':  'slideIn 0.25s ease-out',
        'slide-out': 'slideOut 0.2s ease-in',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
