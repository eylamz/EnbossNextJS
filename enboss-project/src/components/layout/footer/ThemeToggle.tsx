'use client'

import { useTheme } from '@/context/ThemeProvider'
import { useTranslation } from '@/lib/i18n/client'
import { Icon } from '@/assets/icons'
import { useState, useEffect } from 'react'

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'error';
  isError?: boolean;
}

export default function ThemeToggle({ lng, className = '', variant = 'default', isError = false }: ThemeToggleProps & { lng: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation(lng, 'common')
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setIsAnimating(true)
    toggleTheme()
    setTimeout(() => setIsAnimating(false), 300) // Match animation duration
  }

  const getVariantClasses = () => {
    if (variant === 'error' || isError) {
      return 'text-[#3c0101] bg-[#ad2626]/35 hover:bg-[#ad2626]/45'
    }
    return 'text-header-text bg-header-dark/40 hover:bg-header-dark/25'
  }

  // Don't render anything until after hydration
  if (!mounted) {
    return (
      <button
        className={`flex px-2 w-full items-center font-semibold rtl:font-ltr ltr:font-rtl flex-row rtl:flex-row-reverse justify-center p-2 rounded-xl transition-colors duration-200 ease-in-out ${getVariantClasses()} ${className}`}
        aria-label="Toggle theme"
      >
        <div className="flex items-center gap-2">
          <Icon 
            name={theme === 'light' ? 'sunBold' : 'moonBold'} 
            category="ui" 
            className="w-5 h-5" 
          />
          <p className="w-12"></p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex px-2 w-full items-center font-semibold rtl:font-ltr ltr:font-rtl flex-row rtl:flex-row-reverse justify-center p-2 rounded-xl transition-colors duration-200 ease-in-out ${isAnimating ? 'animate-pop' : ''} ${getVariantClasses()} ${className}`}
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-2">
        <Icon 
          name={theme === 'light' ? 'sunBold' : 'moonBold'} 
          category="ui" 
          className="w-5 h-5" 
        />
        <p>{theme === 'light' ? t('theme.light') : t('theme.dark')}</p>
      </div>
    </button>
  )
}