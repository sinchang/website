/** @type {import('tailwindcss').Config} */

const { iconsPlugin, getIconCollections } = require('@egoist/tailwindcss-icons')

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sys: {
          bg: {
            base: 'hsl(255.48deg 30.099999999999998% 20.200000000000003% / <alpha-value>)',
          },
        },
      },
    },
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
