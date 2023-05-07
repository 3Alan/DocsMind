/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'card-blue': '#e6f4ff'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
