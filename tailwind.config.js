/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'citadel-bg': '#020202',
        'sentinel-blue': '#2f81f7',
        'invariant-green': '#3fb950',
        'breach-red': '#f85149',
        'glass-citadel': 'rgba(13, 17, 23, 0.85)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        'citadel': '20px',
      },
    },
  },
  plugins: [],
}
