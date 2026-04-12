import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'
const THEME_KEY = 'coru_theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_KEY) as Theme) || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#131F24' : '#F7F7F7')
    }
  }, [theme])

  const toggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return { theme, toggle }
}
