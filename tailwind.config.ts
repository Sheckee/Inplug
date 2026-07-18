import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Baloo 2"', 'sans-serif'],
        display: ['"Baloo 2"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#DCEFD9',
        panel: '#F5EFE0',
        accent: '#E8B84B',
        danger: '#C9673F',
        warning: '#E8B84B',
        info: '#6FB8C9',
        forest: '#3F6C4C',
        forestDark: '#2E4A2F',
        brown: '#8B5E3C',
        brownDark: '#6B4226',
        cream: '#F5EFE0',
        beige: '#E8DCC4',
        river: '#6FB8C9',
        gold: '#E8B84B',
        stone: '#A6A29B',
      },
    },
  },
  plugins: [],
};
export default config;
