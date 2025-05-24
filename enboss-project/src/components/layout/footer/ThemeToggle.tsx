'use client'

import { useTheme } from '@/context/ThemeProvider'
import { useTranslation } from '@/lib/i18n/client'
import { Icon } from '@/assets/icons'
import { useState } from 'react'

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'error';
  isError?: boolean;
}

export default function ThemeToggle({ lng, className = '', variant = 'default', isError = false }: ThemeToggleProps & { lng: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation(lng, 'common')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleTheme()
    setTimeout(() => setIsAnimating(false), 300) // Match animation duration
  }

  const getVariantClasses = () => {
    if (variant === 'error' || isError) {
      return 'text-[#3c0101] bg-[#ad2626]/30 hover:bg-[#ad2626]/20'
    }
    return 'text-header-text bg-header-dark/40 hover:bg-header-dark/25'
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex px-2 w-full items-center font-semibold rtl:font-ltr ltr:font-rtl flex-row rtl:flex-row-reverse justify-center p-2 rounded-xl transition-colors duration-200 ease-in-out ${isAnimating ? 'animate-pop' : ''} ${getVariantClasses()} ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <div className="flex items-center gap-2">
          <Icon 
            name="sunBold" 
            category="ui" 
            className="w-5 h-5" 
          />
          <p>{t('theme.light')}</p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Icon 
            name="moonBold" 
            category="ui" 
            className="w-5 h-5" 
          />
          <p>{t('theme.dark')}</p>
        </div>
      )}
    </button>
  )
}