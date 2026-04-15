/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pokemon: ['"Press Start 2P"', 'sans-serif'], // Fuente estilo retro/Pokemon
      }
    },
  },
  plugins: [],
}