'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'

interface LanguageToggleProps {
  className?: string
  lng: string
}

export default function LanguageToggle({ className = '', lng }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation(lng, 'common')

  const toggleLanguage = () => {
    const newLang = lng === 'en' ? 'he' : 'en'
    const currentPathname = pathname
    const segments = currentPathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`group relative py-2 px-1 transition-all duration-200 ${className}`}
      aria-label={t('toggle_language')}
    >
      <span className="text-lg font-medium light:navShadow ltr:font-rtl rtl:font-ltr">
        {lng === 'en' ? 'עב' : 'EN'}
      </span>
      <span 
        className="rounded-full absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-header-text/30 dark:bg-header-text-dark/50 transition-all duration-200 ease-out w-0 group-hover:w-1/5" 
        aria-hidden="true"
      />
    </button>
  )
} 