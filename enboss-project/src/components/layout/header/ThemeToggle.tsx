'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { Icon } from '@/assets/icons'
import { useTranslation } from '@/lib/i18n/client'

interface ThemeToggleProps {
  className?: string
  lng: string
}

export default function ThemeToggle({ className = '', lng }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation(lng, 'common')
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const handleThemeToggle = () => {
    setShouldAnimate(true)
    toggleTheme()
  }

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false)
      }, 300) // Match the animation duration
      return () => clearTimeout(timer)
    }
  }, [shouldAnimate])

  return (
    <button
      onClick={handleThemeToggle}
      className={`group relative py-2 px-1 transition-all duration-200 ${className}`}
      aria-label={theme === 'dark' ? t('light_mode') : t('dark_mode')}
    >
      {theme === 'light' ? (
        <Icon
          key="sun"
          name="sun"
          category="ui"
          className={`h-6 w-6 light:navShadow ${shouldAnimate ? 'animate-[pop_0.3s_ease-in-out]' : ''}`}
        />
      ) : (
        <Icon
          key="moon"
          name="moon"
          category="ui"
          className={`h-6 w-6 light:navShadow ${shouldAnimate ? 'animate-[pop_0.3s_ease-in-out]' : ''}`}
        />
      )}
      <span 
        className="rounded-full absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-header-text/70 dark:bg-header-text-dark/70 transition-all duration-200 ease-out w-0 group-hover:w-2/5" 
        aria-hidden="true"
      />
    </button>
  )
} 