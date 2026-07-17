import antfu from '@antfu/eslint-config'
import nextPlugin from '@next/eslint-plugin-next'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    react: true,
    ignores: ['.next/**', 'public/**', 'next-env.d.ts', '.vscode/**'],
  },
  nextPlugin.configs.recommended,
  nextPlugin.configs['core-web-vitals'],
  tailwind.configs.recommended,
  {
    settings: {
      tailwindcss: {
        cssConfigPath: 'styles/globals.css',
      },
    },
  },
  {
    rules: {
      // Next.js pages must export data-fetching functions alongside the
      // component, and ui/map.tsx exports the useMap hook by design.
      'react-refresh/only-export-components': 'off',
    },
  },
)
