'use client'

import { useTheme } from '@/context/ThemeProvider'
import { useTranslation } from '@/lib/i18n/client'
import { Icon } from '@/assets/icons'

export default function ThemeToggle({ lng }: { lng: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation(lng, 'common')
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center"
      aria-label={theme === 'dark' ? t('light_mode') : t('dark_mode')}
    >
      {theme === 'dark' ? (
        <>
          <Icon name="sun" category="ui" size={20} className="light:navShadow" />
        </>
      ) : (
        <>
          <Icon name="moon" category="ui" size={20} className="light:navShadow" />
        </>
      )}
    </button>
  )
}