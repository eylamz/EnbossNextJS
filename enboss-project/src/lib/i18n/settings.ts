export const languages = ['he', 'en']
export const defaultLanguage = 'he'

export const getOptions = (lng = defaultLanguage, ns = 'common') => {
  return {
    // debug: true,
    supportedLngs: languages,
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    lng,
    ns,
    interpolation: {
      escapeValue: false
    },
    dir: lng === 'en' ? 'ltr' : 'rtl',
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    }
  }
}