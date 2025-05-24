'use client'

import { useTranslation } from '@/lib/i18n/client'
import Link from 'next/link'

interface BreadCrumbsProps {
  previousPage: {
    path: string
    label: string
  }
  currentPage: {
    label: string
  }
  locale: string
}

export const BreadCrumbs = ({ previousPage, currentPage, locale }: BreadCrumbsProps) => {
  const { t } = useTranslation(locale, 'common')

  return (
    <nav aria-label="Breadcrumb" className="select-none mx-auto w-full max-w-6xl absolute top-20 left-4 right-4 z-20"> 
    
      <ol className="flex items-center text-sm text-text-dark/80 dark:text-text-dark/90 transition-color duration-300">
        <li>
          <Link 
            href={`/${locale}${previousPage.path}`} 
            className="navMdShadow hover:text-text-dark dark:hover:text-text-dark"
          >
            {t(previousPage.label)}
          </Link>
        </li>
        <li className='navMdShadow px-1'>
          <span> » </span>
        </li>
        <li className="navMdShadow truncate max-w-[150px]">
          <span className="text-text-dark/90 dark:text-text-dark font-medium">
            {currentPage.label}
          </span>
        </li>
      </ol>
    </nav>
  )
} 