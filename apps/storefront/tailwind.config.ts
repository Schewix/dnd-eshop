import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['app/**/*.{js,ts,jsx,tsx}', 'components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#c7702a',
          dark: '#8f4a1a',
          light: '#e19a55',
        },
      },
    },
  },
  plugins: [],
};

export default config;
