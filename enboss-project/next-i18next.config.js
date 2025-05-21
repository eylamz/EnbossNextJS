/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
      defaultLocale: 'he',
      locales: ['he', 'en'],
      localeDetection: true,
    },
    defaultNS: 'common',
    localePath: './public/locales',
  }