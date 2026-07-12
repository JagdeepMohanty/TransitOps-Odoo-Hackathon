/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        sidebar: {
          bg:     '#0f172a',
          hover:  '#1e293b',
          text:   '#94a3b8',
          muted:  '#475569',
          border: 'rgba(255,255,255,0.06)',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft:    '#f8fafc',
          muted:   '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'xs':      '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.05)',
        'card-lg': '0 10px 30px -4px rgb(0 0 0 / 0.10), 0 4px 12px -4px rgb(0 0 0 / 0.06)',
        'navbar':  '0 1px 0 0 #e2e8f0',
        'sidebar': '4px 0 32px 0 rgb(0 0 0 / 0.18)',
        'dropdown':'0 12px 40px -4px rgb(0 0 0 / 0.14), 0 4px 16px -4px rgb(0 0 0 / 0.08)',
        'btn':     '0 1px 3px 0 rgb(37 99 235 / 0.30)',
        'btn-sm':  '0 1px 2px 0 rgb(37 99 235 / 0.20)',
        'inner':   'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow':    '0 0 0 3px rgb(37 99 235 / 0.15)',
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'gradient-surface': 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #0f172a 0%, #0c1322 100%)',
        'shimmer':          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '0',   transform: 'scale(1.8)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.2s ease-out both',
        'slide-up':   'slide-up 0.25s ease-out both',
        'scale-in':   'scale-in 0.15s ease-out both',
        'shimmer':    'shimmer 1.8s infinite linear',
        'spin-slow':  'spin-slow 1.2s linear infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-in-out infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      width: {
        'sidebar':           '260px',
        'sidebar-collapsed': '68px',
      },
    },
  },
  plugins: [],
}
