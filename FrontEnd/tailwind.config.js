/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueNew : "#161d29",
        primary: '#3490dc',
        secondary: '#2ecc71',
        tertiary: '#e74c3c',
        quaternary: '#f1c40f',
        quinary: '#9b59b6',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

