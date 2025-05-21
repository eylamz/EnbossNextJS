export const languages = ['he', 'en']
export const defaultLanguage = 'he'

export const getOptions = (lng = defaultLanguage, ns = 'common') => {
  return {
    // debug: true,
    supportedLngs: languages,
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    lng,
    ns
  }
}