'use client'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/assets/icons'
import { useTranslation } from '@/lib/i18n/client'

interface ShareButtonProps {
  parkName: string
  area: string
  closingYear?: number
  locale: string
}

export function ShareButton({ parkName, area, closingYear, locale }: ShareButtonProps) {
  const { t } = useTranslation(locale, 'skateparks')

  return (
    <Button
      variant={closingYear ? "error" : "info"}
      size="lg"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: parkName,
            text: `${parkName} - ${t('skatepark')} ${t('in')} ${t(area)}`,
            url: window.location.href
          }).catch(console.error);
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className={`p-2 h-[35px] flex items-center justify-center rounded-lg ${
        closingYear 
          ? 'text-error dark:text-error shadow-md active:shadow-none border border-b-[4px] border-error dark:border-error/20 active:border-b-[1px] active:translate-y-[2px] transition-all duration-200'
          : 'text-info dark:text-info-dark shadow-md active:shadow-none border border-b-[4px] border-info dark:border-info-dark/20 active:border-b-[1px] active:translate-y-[2px] transition-all duration-200'
      }`}
      aria-label={t('share')}
    >
      <Icon name="shareArrowBold" category="action" className="w-5 h-5" />
    </Button>
  )
} 