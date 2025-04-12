// tailwind.config.cjs
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./index.html",                      // добавляем корневой HTML
    "./src/**/*.{js,jsx,ts,tsx}",        // ваши компоненты
    "./node_modules/flowbite-react/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none'
        }
      });
    })
  ],
};
