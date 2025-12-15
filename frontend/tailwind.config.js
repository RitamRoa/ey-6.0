/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          card: '#111111',
          border: '#333333',
          text: '#EDEDED',
          muted: '#A1A1AA'
        },
        brand: {
          primary: '#3B82F6', // Blue
          secondary: '#8B5CF6', // Violet
          accent: '#10B981', // Emerald
        }
      }
    },
  },
  plugins: [],
}
