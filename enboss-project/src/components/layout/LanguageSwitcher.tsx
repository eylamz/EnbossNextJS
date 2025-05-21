'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { languages } from '@/lib/i18n/settings'

export default function LanguageSwitcher({ lng }: { lng: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation(lng, 'common')
  
  const handleLanguageChange = (newLng: string) => {
    const currentPathname = pathname
    const segments = currentPathname.split('/')
    segments[1] = newLng
    router.push(segments.join('/'))
  }
  
  // Get the opposite language
  const oppositeLanguage = lng === 'he' ? 'en' : 'he'
  
  return (
    <div className="flex gap-2">
      <button
        className="font-semibold"
        onClick={() => handleLanguageChange(oppositeLanguage)}
      >
        {oppositeLanguage === 'he' ? 'עב' : 'EN'}
      </button>
    </div>
  )
}