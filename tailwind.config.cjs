/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fern: {
          50: '#eff5f0',
          100: '#e0ebe2',
          200: '#c0d8c4',
          300: '#a1c4a7',
          400: '#82b089',
          500: '#629d6c',
          600: '#4f7d56',
          700: '#3b5e41',
          800: '#273f2b',
          900: '#141f16',
          950: '#0e160f',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        beVietnam: ['Be Vietnam Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
