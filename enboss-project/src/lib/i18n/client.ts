'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { getOptions } from './settings'
import { useEffect } from 'react'

// Initialize i18next only once
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => 
      import(`../../../public/locales/${language}/${namespace}.json`)
    ))
    .init(getOptions())
}

export function useTranslation(lng: string, ns: string, options = {}) {
  const ret = useTranslationOrg(ns, {
    ...options,
    lng, // Explicitly set the language
  })
  const { i18n } = ret
  
  // Ensure language is set correctly and update document direction
  useEffect(() => {
    const changeLanguage = async () => {
      if (i18n.language !== lng) {
        await i18n.changeLanguage(lng)
        // Set document direction based on language
        if (typeof window !== 'undefined' && document.documentElement) {
          document.documentElement.dir = lng === 'en' ? 'ltr' : 'rtl'
        }
      }
    }
    
    changeLanguage()
  }, [i18n, lng])
  
  return ret
}