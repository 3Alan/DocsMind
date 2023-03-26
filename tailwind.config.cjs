/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5 ease-in-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': {
            visibility: 'visible'
          },
          '100%': {
            visibility: 'hidden'
          }
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
