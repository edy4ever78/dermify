/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Include all files in the app directory
    './components/**/*.{js,ts,jsx,tsx}', // Include all files in the components directory
    './context/**/*.{js,ts,jsx,tsx}', // Include all files in the context directory
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
};
