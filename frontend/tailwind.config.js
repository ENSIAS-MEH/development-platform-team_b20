/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#ea580c',
          500: '#f97316',
        },
        dark: {
          950: '#0f172a',
          900: '#1e293b',
          800: '#334155',
        },
        orangeAdmin: "#ea580c"
      },
    },
  },
  plugins: [],
}