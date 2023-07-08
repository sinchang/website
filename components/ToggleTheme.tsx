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
    <a onClick={handleSetTheme} className="h-5 w-5">
      {theme === 'light'
        ? (
          <span className="i-ri-sun-line h-full w-full"></span>
          )
        : (
          <span className="i-ri-moon-fill h-full w-full"></span>
          )}
    </a>
  )
}
