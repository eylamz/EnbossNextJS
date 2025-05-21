'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { getOptions } from './settings'

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
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  
  // Ensure language is set correctly
  if (i18n.language !== lng) {
    i18n.changeLanguage(lng)
  }
  
  return ret
}