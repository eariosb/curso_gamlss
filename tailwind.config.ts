import type { Config } from 'tailwindcss';

/**
 * Sistema de diseño heredado del curso MLM (paleta `ink` de grises,
 * tipografía Inter, radios 0.5rem, animaciones sutiles), con el acento
 * migrado del verde azulado biomédico al azul corporativo #1e3a5f del
 * curso GAMLSS (accent-700 = color base). El verde #2e7d32 se reserva
 * como color de éxito (`positive`).
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/content/**/*.{ts,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f0f5fa',
          100: '#dbe7f2',
          200: '#b7cfe4',
          300: '#8fb2d3',
          400: '#6795c2',
          500: '#3f78b0',
          600: '#2d5a88',
          700: '#1e3a5f',
          800: '#152a45',
          900: '#0c1a2b',
        },
        ink: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        positive: {
          50: '#e8f5e9',
          500: '#2e7d32',
          700: '#1b5e20',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in': {
          from: { transform: 'translateX(-8px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
