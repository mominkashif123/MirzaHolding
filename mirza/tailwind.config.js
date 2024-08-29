/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alata: ['"Alata"', 'sans-serif'],
        baskervville: ['"Baskervville SC"', 'serif'],
      },
    },
  },
  plugins: [],
}
