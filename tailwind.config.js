/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strategy: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#92400e',
        },
        management: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#064e3b',
        },
        technology: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
