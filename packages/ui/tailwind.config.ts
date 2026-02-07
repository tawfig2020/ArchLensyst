import type { Config } from 'tailwindcss';
import archlensPreset from '@archlens/config/tailwind';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [archlensPreset as Config],
  plugins: [],
};

export default config;
