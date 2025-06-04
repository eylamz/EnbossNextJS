'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface LanguageToggleProps {
  className?: string
  lng: string
}

export default function LanguageToggle({ className = '', lng }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation(lng, 'common')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleLanguage = async () => {
    setIsLoading(true)
    const newLang = lng === 'en' ? 'he' : 'en'
    const currentPathname = pathname
    const segments = currentPathname.split('/')
    segments[1] = newLang
    await router.push(segments.join('/'))
    // Note: We don't set isLoading to false here as the component will unmount
    // when the route changes
  }

  // Return a placeholder during SSR
  if (!isMounted) {
    return (
      <button
        className={`group relative py-2 px-1 transition-all duration-200 ${className}`}
        aria-label="Toggle language"
      >
        <span className="text-lg font-medium light:navShadow ltr:font-rtl rtl:font-ltr">
          {lng === 'en' ? 'עב' : 'EN'}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`group relative py-2 px-1 transition-all duration-200 ${className}`}
      aria-label={t('toggle_language')}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner size={24} variant="header" />
      ) : (
        <>
          <span className="text-lg font-medium light:navShadow ltr:font-rtl rtl:font-ltr">
            {lng === 'en' ? 'עב' : 'EN'}
          </span>
          <span 
            className="rounded-full absolute left-1/2 -translate-x-1/2 bottom-0.5  h-0.5 bg-header-text/70 dark:bg-header-text-dark/70 transition-all duration-200 ease-out w-0 group-hover:w-2/5" 
            aria-hidden="true"
          />
        </>
      )}
    </button>
  )
} 