'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { 
  Icon
} from '@/assets/icons'
import LanguageToggle from './header/LanguageToggle'
import ThemeToggle from './header/ThemeToggle'
import { useError } from '@/context/ErrorContext'
import LoadingSpinner from '../common/LoadingSpinner'

// Define the IconProps type if your icons need it
interface IconProps {
  size?: number;
  className?: string;
}

export default function Header({ lng }: { lng: string }) {
  const { t, i18n } = useTranslation(lng, 'common')
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { isError } = useError()

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === `/${lng}`) {
      return pathname === `/${lng}` || pathname === `/${lng}/`
    }
    return pathname.startsWith(path)
  }

  // Check if we're on a skatepark page
  const isSkatepark = () => {
    return pathname?.startsWith(`/${lng}/skateparks/`)
  }

  // Only show error variant if we're on a skatepark page and isError is true
  const shouldShowError = isSkatepark() && isError

  const navLinkClasses = (path: string) => 
    `group relative py-1 px-2 transition-all duration-200 ${shouldShowError ? 'text-[#3c0101] dark:text-[#3c0101] hover:text-opacity-80' : 'text-header-text dark:text-header-text-dark hover:text-opacity-80 dark:hover:text-opacity-80'}`
  
  const activeLinkIndicatorClasses = (path: string) =>
    `rounded-full absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 ${shouldShowError ? 'bg-[#3c0101]/70' : 'bg-header-text/70 dark:bg-header-text-dark/70'} transition-all duration-200 ease-out ${isActive(path) ? 'w-3/5 md:w-2/5' : 'w-0 group-hover:w-3/5 md:group-hover:w-2/5'}`

  const mobileNavLinkClasses = (path: string) =>
    `block py-2 text-lg opacity-0 ${isActive(path) ? 'font-semibold' : 'font-medium'} ${isMenuOpen ? 'animate-fadeIn' : ' '}`

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [pathname])

  // Wait for client-side hydration before rendering translated content
  if (!isClient) {
    return (
      <header className="fixed top-0 w-full z-[50] px-3 select-none">
        <nav className="flex justify-center pt-3" aria-label="Main Navigation">
          <div className={`w-full max-w-7xl ${shouldShowError ? 'bg-error dark:bg-error' : 'bg-header-dark'} ${shouldShowError ? 'text-[#3c0101]' : 'text-header-text dark:text-header-text-dark'} shadow-container backdrop-blur-custom rounded-custom px-7 overflow-visible`}>
            <div className={`flex ${lng === 'en' ? 'flex-row-reverse' : 'flex-row-reverse'} justify-between items-center h-14`}>
              <div className="min-[880px]:hidden flex items-center">
                <LoadingSpinner className='w-[2rem]'/>
              </div>
              <span className='hidden sm:block w-[124px] sm:w-[128px]'></span>

              <Link 
                href={`/${lng}`} 
                className="text-xl sm:text-2xl font-bold group" 
                aria-label="Enboss Home"
              >
                <span className="light:navShadow transition-opacity duration-200 group-hover:opacity-80">
                  <Icon name="logoHostage3" category="ui" className="-mb-1 w-[124px] h-[39px] sm:w-[128px] sm:h-[24px]" />
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    )
  }
  
  return (
    <>
      <header className="fixed top-0 w-full z-[50] px-3 select-none">
        <nav className="flex justify-center pt-3" aria-label="Main Navigation">
          <div className={`w-full max-w-7xl ${shouldShowError ? 'bg-error dark:bg-error' : 'bg-header-dark'} ${shouldShowError ? 'text-[#3c0101]' : 'text-header-text dark:text-header-text-dark'} shadow-container backdrop-blur-custom rounded-custom px-7 overflow-visible`}>
            <div className="flex justify-between items-center h-14">
              {/* Logo */}
              <Link 
                href={`/${lng}`} 
                className="text-xl sm:text-2xl font-bold group" 
                aria-label="Enboss Home"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* ENBOSS Logo */}
                <span className="light:navShadow transition-opacity duration-200 group-hover:opacity-80">
                  <Icon name="logoHostage3" category="ui" className="-mb-1 w-[124px] h-[39px] sm:w-[128px] sm:h-[24px]" />
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden min-[880px]:flex gap-3 lg:gap-5 items-center font-medium" role="menubar">
                <Link href={`/${lng}/skateparks`} className={navLinkClasses(`/${lng}/skateparks`)} role="menuitem">
                  <span className="flex items-center gap-1 light:navShadow">
                    {t('skateparks')}
                  </span>
                  <span className={activeLinkIndicatorClasses(`/${lng}/skateparks`)} aria-hidden="true"></span>
                </Link>
                <Link href={`/${lng}/guides`} className={navLinkClasses(`/${lng}/guides`)} role="menuitem">
                  <span className="flex items-center gap-1 light:navShadow">
                    {t('guides')}
                  </span>
                  <span className={activeLinkIndicatorClasses(`/${lng}/guides`)} aria-hidden="true"></span>
                </Link>
                <Link href={`/${lng}/events`} className={navLinkClasses(`/${lng}/events`)} role="menuitem">
                  <span className="flex items-center gap-1 light:navShadow">
                    {t('events')}
                  </span>
                  <span className={activeLinkIndicatorClasses(`/${lng}/events`)} aria-hidden="true"></span>
                </Link>
                <Link href={`/${lng}/shop`} className={navLinkClasses(`/${lng}/shop`)} role="menuitem">
                  <span className="flex items-center gap-1 light:navShadow">
                    {t('shop')}
                  </span>
                  <span className={activeLinkIndicatorClasses(`/${lng}/shop`)} aria-hidden="true"></span>
                </Link>
                <Link href={`/${lng}/contact`} className={navLinkClasses(`/${lng}/shop`)} role="menuitem">
                  <span className="flex items-center gap-1 light:navShadow">
                    {t('contact')}
                  </span>
                  <span className={activeLinkIndicatorClasses(`/${lng}/shop`)} aria-hidden="true"></span>
                </Link>
                <Link href={`/${lng}/about`} className={navLinkClasses(`/${lng}/about`)} role="menuitem">
                  <span className="flex items-center gap-1 light:navShadow">
                    {t('about')}
                  </span>
                  <span className={activeLinkIndicatorClasses(`/${lng}/shop`)} aria-hidden="true"></span>
                </Link>
              </div>

              {/* Desktop Action Icons */}
              <div className="hidden min-[880px]:flex ${lng === 'en' ? 'flex-row-reverse' : 'flex-row-reverse'} items-center gap-2 lg:gap-3">
                <Link href={`/${lng}/login`} className={`${navLinkClasses(`/${lng}/login`)} !px-1`} aria-label={t('login')}>
                   <Icon name="user" category="ui" size={20} className="light:navShadow" />
                   <span className="sr-only">{t('login')}</span>
                   <span className={activeLinkIndicatorClasses(`/${lng}/login`)} aria-hidden="true"></span>
                </Link>
                <ThemeToggle lng={lng} className="!px-1" />
                <LanguageToggle lng={lng} className="!px-1" />
              </div>

              {/* Mobile menu button */}
              <div className="min-[880px]:hidden flex items-center">
                <button
                  className="p-2 -m-2 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-header-text/50 dark:focus:ring-header-text-dark/50 rounded-md"
                  onClick={() => {
                    setShouldAnimate(true)
                    setIsMenuOpen(!isMenuOpen)
                  }}
                  onAnimationEnd={() => setShouldAnimate(false)}
                  aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? (
                    <Icon name="close" category="navigation" size={28} className={`light:navShadow ${shouldAnimate ? 'animate-pop' : ''}`} />
                  ) : (
                    <Icon name="menu" category="navigation" size={28} className={`light:navShadow ${shouldAnimate ? 'animate-pop' : ''}`} />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div 
              id="mobile-menu"
              className={`
                min-[880px]:hidden 
                overflow-hidden 
                transition-[max-height,opacity]
                duration-350 
                ease-in-out
                ${isMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'}
              `}
              role={isMenuOpen ? "menu" : undefined}
              aria-hidden={!isMenuOpen}
            >
              <nav className="pb-4" aria-label="Mobile Navigation">
                <div className="flex justify-between">
                  {/* Left column - Navigation Links */}
                  <div className="flex flex-col">
                    <Link href={`/${lng}/skateparks`} className={`${mobileNavLinkClasses(`/${lng}/skateparks`)} animate-fadeIn`} style={{ animationDelay: '100ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                      <span>{t('skateparks')}</span>
                    </Link>
                    <Link href={`/${lng}/guides`} className={`${mobileNavLinkClasses(`/${lng}/guides`)} animate-fadeIn`} style={{ animationDelay: '150ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                      <span>{t('guides')}</span>
                    </Link>
                    <Link href={`/${lng}/events`} className={`${mobileNavLinkClasses(`/${lng}/events`)} animate-fadeIn`} style={{ animationDelay: '175ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                      <span>{t('events')}</span>
                    </Link>
                    <Link href={`/${lng}/shop`} className={`${mobileNavLinkClasses(`/${lng}/shop`)} animate-fadeIn`} style={{ animationDelay: '200ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                      <span>{t('shop')}</span>
                    </Link>
                      <Link href={`/${lng}/contact`} className={`${mobileNavLinkClasses(`/${lng}/contact`)} animate-fadeIn`} style={{ animationDelay: '250ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                        <span>{t('contact')}</span>
                      </Link>
                      <Link href={`/${lng}/about`} className={`${mobileNavLinkClasses(`/${lng}/about`)} animate-fadeIn`} style={{ animationDelay: '250ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                        <span>{t('about')}</span>
                      </Link>
                  </div>

                  {/* Right column - Action Icons */}
                  <div className="flex flex-col items-end gap-4 pt-2">
                    <Link href={`/${lng}/login`} className={`${mobileNavLinkClasses(`/${lng}/login`)} animate-fadeIn`} style={{ animationDelay: '100ms' }} onClick={() => setIsMenuOpen(false)} role="menuitem">
                      <Icon name="user" category="ui" size={24} className="light:navShadow" />
                    </Link>
                    <div className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
                      <ThemeToggle lng={lng} />
                    </div>
                    <div className="animate-fadeIn" style={{ animationDelay: '175ms' }}>
                      <LanguageToggle lng={lng} />
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </nav>

        {/* Backdrop for mobile menu */}
        <div 
          className={`fixed inset-0 backdrop-blur-[1.2px]  bg-black/30 dark:bg-black/50 min-[880px]:hidden -z-10 transition-opacity duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      </header>
    </>
  )
}
