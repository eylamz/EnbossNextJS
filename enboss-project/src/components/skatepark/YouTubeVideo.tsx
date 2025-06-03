'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/client'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'

interface YouTubeVideoProps {
  youtubeUrl: string;
  parkName: string;
}

export function YouTubeVideo({ youtubeUrl, parkName }: YouTubeVideoProps) {
  const params = useParams()
  const { t } = useTranslation(params.locale as string, 'common')

  return (
    <section aria-labelledby="video-heading" className="w-full mt-8 max-w-6xl mx-auto bord rounded-3xl">
      <h2 id="video-heading" className="sr-only">{parkName} {t('common.video')}</h2>
      <Card className="backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70">
        <div className="w-full aspect-video  relative">

          <iframe
            src={`${youtubeUrl.replace('watch?v=', 'embed/')}?autoplay=0&mute=0`}
            title={`${parkName} ${t('common.video')}`}
            className="w-full h-full rounded-lg"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen={true}
            referrerPolicy="no-referrer"
          />
        </div>
      </Card>
    </section>
  )
} 