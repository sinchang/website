import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const handleSetTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a onClick={handleSetTheme} className="w-5 h-5">
      {theme === 'light'
        ? (
          <span className="i-ri-sun-line w-full h-full"></span>
        )
        : (
          <span className="i-ri-moon-fill w-full h-full"></span>
        )}
    </a>
  )
}
