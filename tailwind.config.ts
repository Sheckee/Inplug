import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#0D1117',
        panel: '#161B22',
        accent: '#6EE7B7',
        danger: '#FF5F56',
        warning: '#FBBF24',
        info: '#60A5FA',
      },
    },
  },
  plugins: [],
};
export default config;
