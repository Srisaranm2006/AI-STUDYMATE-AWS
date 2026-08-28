/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        700: '700',
        800: '800',
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcdfff',
          300: '#8ecbff',
          400: '#59adff',
          500: '#338cff',
          600: '#1c6df0',
          700: '#1556dc',
          800: '#1746b2',
          900: '#193e8c',
          950: '#142755',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b1b8c8',
          400: '#8690a8',
          500: '#67718c',
          600: '#525a72',
          700: '#43495d',
          800: '#3a3f4f',
          900: '#1f2330',
          950: '#13161f',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16,24,40,0.08), 0 4px 16px -4px rgba(16,24,40,0.06)',
        card: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -8px rgba(16,24,40,0.12)',
        glow: '0 0 0 1px rgba(51,140,255,0.18), 0 8px 30px -6px rgba(51,140,255,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pop': { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'dot': { '0%,80%,100%': { transform: 'scale(0.6)', opacity: '0.4' }, '40%': { transform: 'scale(1)', opacity: '1' } },
        'shimmer': { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'pop': 'pop 0.25s ease-out both',
        'dot': 'dot 1.2s infinite ease-in-out',
        'shimmer': 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
