'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { languages } from '@/lib/i18n/settings'
import { Icon } from '@/assets/icons'
import { useState } from 'react'

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'error';
  isError?: boolean;
}

export default function LanguageSwitcher({ lng, className = '', variant = 'default', isError = false }: LanguageSwitcherProps & { lng: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation(lng, 'common')
  const [isAnimating, setIsAnimating] = useState(false)
  
  const handleLanguageChange = (newLng: string) => {
    setIsAnimating(true)
    const currentPathname = pathname
    const segments = currentPathname.split('/')
    segments[1] = newLng
    router.push(segments.join('/'))
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = newLng === 'he' ? 'rtl' : 'ltr'
    setTimeout(() => setIsAnimating(false), 300) // Match animation duration
  }
  
  const getVariantClasses = () => {
    if (variant === 'error' || isError) {
      return 'text-[#3c0101] bg-[#ad2626]/35 hover:bg-[#ad2626]/45'
    }
    return 'text-header-text bg-header-dark/40 hover:bg-header-dark/25'
  }
  
  // Get the opposite language
  const oppositeLanguage = lng === 'he' ? 'en' : 'he'
  
  return (
    <button
      onClick={() => handleLanguageChange(oppositeLanguage)}
      className={`flex items-center w-full font-semibold justify-center px-3 py-1.5 rounded-xl transition-colors duration-200 ease-in-out ${isAnimating ? 'animate-pop' : ''} ${getVariantClasses()} ${className}`}
      aria-label="Toggle language"
    >
      {lng === 'en' ? (
        <div className="flex items-center gap-2">
          <Icon name="israelFlag" category="ui" className="w-6 h-6" />
          <p className="font-rtl">עברית</p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Icon name="usaFlag" category="ui" className="w-6 h-6" />
          <p className="font-ltr">English</p>
        </div>
      )}
    </button>
  )
}