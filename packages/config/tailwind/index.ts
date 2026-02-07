import type { Config } from 'tailwindcss';

const archlensPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // Core palette
        'citadel-bg': '#020202',
        'citadel-surface': '#0d1117',
        'citadel-elevated': '#161b22',
        'citadel-border': '#30363d',
        'citadel-border-hover': '#484f58',

        // Semantic
        'sentinel-blue': '#2f81f7',
        'sentinel-blue-hover': '#388bfd',
        'invariant-green': '#3fb950',
        'invariant-green-hover': '#56d364',
        'breach-red': '#f85149',
        'breach-red-hover': '#ff7b72',
        'caution-amber': '#d29922',
        'caution-amber-hover': '#e3b341',

        // Glass
        'glass-citadel': 'rgba(13, 17, 23, 0.85)',
        'glass-surface': 'rgba(22, 27, 34, 0.75)',
        'glass-elevated': 'rgba(48, 54, 61, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      backdropBlur: {
        citadel: '20px',
        sentinel: '40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(47, 129, 247, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(47, 129, 247, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'citadel': '0 0 0 1px rgba(48, 54, 61, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)',
        'citadel-lg': '0 0 0 1px rgba(48, 54, 61, 0.5), 0 8px 32px rgba(0, 0, 0, 0.6)',
        'sentinel': '0 0 0 2px rgba(47, 129, 247, 0.3), 0 4px 16px rgba(47, 129, 247, 0.1)',
      },
      borderRadius: {
        'citadel': '0.5rem',
      },
    },
  },
  plugins: [],
};

export default archlensPreset;
