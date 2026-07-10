/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // Make sure yeh path aapke project ke hisaab se theek ho
  ],
  theme: {
    extend: {
      colors: {
        'muted-teal': '#6E9D9E',
        'dark-charcoal': '#2D3748',
        'medium-charcoal': '#4A5568',
        'card-white': '#FFFFFF',
        'corrtal-gray': '#F7FAFC',
        'coral-red': '#F56565',
        'subtle-gray': '#A0AEC0',
      },
    },
  },
  plugins: [],
}