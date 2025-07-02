/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mukta': ['Mukta', 'sans-serif'],
      },
      colors: {
        saffron: '#FF9933',
        forest: '#138808',
      },
      screens: {
        'xs': '420px',
      },
    },
  },
  plugins: [],
};