/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'db-red': '#EC0016',
        'db-red-dark': '#C40012',
        'db-navy': '#14181F',
        'db-navy-light': '#5C6670',
        'db-gray-50': '#F7F7F8',
        'db-gray-100': '#EEF0F2',
        'db-gray-200': '#E0E3E7',
        'db-gray-400': '#9AA2AB',
        'db-green': '#1E8A3C',
        'db-amber': '#D98600',
      },
    },
  },
  plugins: [],
}
