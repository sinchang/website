/** @type {import('tailwindcss').Config} */

const { iconsPlugin, getIconCollections } = require('@egoist/tailwindcss-icons')

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['var(--font-space-grotesk)'],
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['ri']),
    }),
  ],
}
