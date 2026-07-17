import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ToggleTheme() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const handleSetTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return null

  return (
    <button type="button" onClick={handleSetTheme} className="size-5 transition-colors">
      {theme === 'light'
        ? (
            <span className="i-ri-moon-line size-full text-gray-400 hover:text-gray-700" />
          )
        : (
            <span className="i-ri-sun-line size-full text-white/40 hover:text-white/80" />
          )}
    </button>
  )
}
