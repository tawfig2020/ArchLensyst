import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        citadel: {
          bg: '#020202',
          surface: '#0d1117',
          elevated: '#161b22',
          border: '#30363d',
          'border-hover': '#484f58',
        },
        sentinel: {
          blue: '#2f81f7',
          'blue-hover': '#388bfd',
          'blue-glow': 'rgba(47,129,247,0.15)',
        },
        invariant: {
          green: '#3fb950',
          'green-glow': 'rgba(63,185,80,0.15)',
        },
        breach: {
          red: '#f85149',
          'red-glow': 'rgba(248,81,73,0.15)',
        },
        caution: {
          amber: '#d29922',
          'amber-glow': 'rgba(210,153,34,0.15)',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(22,27,34,0.8) 0%, rgba(13,17,23,0.95) 100%)',
        'blue-purple': 'linear-gradient(135deg, #2f81f7 0%, #8b5cf6 100%)',
        'blue-purple-hover': 'linear-gradient(135deg, #388bfd 0%, #a78bfa 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'mesh-move': 'meshMove 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        meshMove: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(-5px, 15px)' },
          '75%': { transform: 'translate(-15px, -5px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      boxShadow: {
        'sentinel': '0 0 30px rgba(47,129,247,0.2)',
        'sentinel-lg': '0 0 60px rgba(47,129,247,0.3)',
        'citadel': '0 4px 30px rgba(0,0,0,0.5)',
        'glow-blue': '0 0 40px rgba(47,129,247,0.25)',
        'glow-purple': '0 0 40px rgba(139,92,246,0.25)',
        'glow-green': '0 0 40px rgba(63,185,80,0.25)',
      },
      backdropBlur: {
        'citadel': '12px',
        'sentinel': '20px',
      },
      borderRadius: {
        'citadel': '12px',
      },
    },
  },
  plugins: [],
};

export default config;
