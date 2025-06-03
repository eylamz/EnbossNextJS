'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/client'
import ThemeToggle from './footer/ThemeToggle'
import LanguageSwitcher from './footer/LanguageSwitcher'
import { Icon } from '@/assets/icons'
import { usePathname } from 'next/navigation'
import { useError } from '@/context/ErrorContext'
import { useEffect, useState } from 'react'

export default function Footer({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'common')
  const pathname = usePathname()
  const { isError } = useError()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // a function to determine if we're on a skatepark page
  const isSkatepark = () => {
    return pathname?.startsWith(`/${lng}/skateparks/`)
  }

  // Only show error variant if we're on a skatepark page and isError is true
  const shouldShowError = isSkatepark() && isError

  // Determine the background color class based on the park's status
  const getFooterBgClass = () => {
    if (shouldShowError) {
      return 'bg-error dark:bg-error !border-[#ad2626] text-[#3c0101]'
    }
    return 'bg-header-dark text-text dark:text-text-dark'
  }

  const footerBgClass = getFooterBgClass()

  return (
    <footer className={footerBgClass}>
      <div className="container mx-auto px-4 py-12">
        {/* Social Links & Settings */}
        <div className="flex flex-col items-center justify-center gap-8">
          <div className='flex flex-col items-center justify-center gap-3'>
            <Icon
              name='logo'
              category="ui"
              className={`max-w-[9.75rem] md:max-w-[12rem] w-full h-[1.8rem] ${shouldShowError ? 'text-[#3c0101]/80' : 'text-header-text/80'}`}
            />
            <h3 className={`text-lg font-semibold ${shouldShowError ? 'text-[#3c0101]/80' : 'text-header-text/80'}`}>
              {isClient ? t('follow_us') : ''}
            </h3>
            <div className={`flex justify-center items-center gap-3 ${shouldShowError ? 'text-[#3c0101]/80' : 'text-header-text/80'}`}>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={shouldShowError ? 'hover:text-[#3c0101]' : 'hover:text-header-text'}
              >
                <Icon name='youtube' category="action" className="h-7 w-7" />
              </a>
              <Link
                href={`/${lng}/contact`}
                className={shouldShowError ? 'hover:text-[#3c0101]' : 'hover:text-header-text'}
              >
                <Icon name='messages' category="action" className="h-7 w-7" />
              </Link>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={shouldShowError ? 'hover:text-[#3c0101]' : 'hover:text-header-text'}
              >
                <Icon name='tiktok' category="action" className="h-7 w-7" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={shouldShowError ? 'hover:text-[#3c0101]' : 'hover:text-header-text'}
              >
                <Icon name='instagram' category="action" className="h-7 w-7" />
              </a>
            </div>
          </div>
          <div className="flex flex-row items-right gap-5 xsm:hidden">
            <ThemeToggle lng={lng} variant={shouldShowError ? 'error' : 'default'} isError={shouldShowError} />
            <LanguageSwitcher lng={lng} variant={shouldShowError ? 'error' : 'default'} isError={shouldShowError} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-8 relative">
          <div className={`text-center px-6 pt-8 border-t ${shouldShowError ? 'border-[#3c0101]/60' : 'border-header-text/60'}`}>
            <p className={`font-medium ${shouldShowError ? 'text-[#3c0101]' : 'text-header-text'}`}>
              {isClient ? t('footer.copyright', { year: new Date().getFullYear() }) : ''}
            </p>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <Link 
                href={`/${lng}/terms`} 
                className={shouldShowError ? 'text-[#3c0101]/60 hover:text-[#3c0101] hover:underline' : 'text-header-text/60 hover:text-header-text hover:underline'}
              >
                {isClient ? t('footer.terms') : ''}
              </Link>
              <Link 
                href={`/${lng}/accessibility`} 
                className={shouldShowError ? 'text-[#3c0101]/60 hover:text-[#3c0101] hover:underline' : 'text-header-text/60 hover:text-header-text hover:underline'}
              >
                {isClient ? t('footer.accessibility') : ''}
              </Link>
            </div>
          </div>
          {/* Theme and Language Controls */}
          <div className="hidden xsm:flex absolute right-4 top-4 flex-col items-right space-y-2">
            <ThemeToggle lng={lng} variant={shouldShowError ? 'error' : 'default'} isError={shouldShowError} />
            <LanguageSwitcher lng={lng} variant={shouldShowError ? 'error' : 'default'} isError={shouldShowError} />
          </div>
        </div>
      </div>
    </footer>
  )
}