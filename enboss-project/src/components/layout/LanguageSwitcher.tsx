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
  
  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <button
          key={language}
          className={`px-3 py-1 rounded ${lng === language ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleLanguageChange(language)}
        >
          {language === 'he' ? 'עברית' : 'English'}
        </button>
      ))}
    </div>
  )
}