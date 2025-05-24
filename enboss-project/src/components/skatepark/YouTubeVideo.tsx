'use client'

import { useState } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useTranslation } from '@/lib/i18n/client'
import { useParams } from 'next/navigation'

interface YouTubeVideoProps {
  youtubeUrl: string;
  parkName: string;
}

export function YouTubeVideo({ youtubeUrl, parkName }: YouTubeVideoProps) {
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const params = useParams()
  const { t } = useTranslation(params.locale as string, 'common')

  return (
    <section aria-labelledby="video-heading" className="mt-6 pt-4 border-t border-border-dark/20 dark:border-text-secondary-dark/70">
      <h2 id="video-heading" className="sr-only">{parkName} {t('common.video')}</h2>
      <div className="w-full aspect-video relative">
        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 rounded-lg">
            <LoadingSpinner />
          </div>
        )}
        <iframe
          src={`${youtubeUrl.replace('watch?v=', 'embed/')}?autoplay=0&mute=0`}
          title={`${parkName} ${t('common.video')}`}
          className="w-full h-full rounded-lg"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen={true}
          referrerPolicy="no-referrer"
          onLoad={() => setIsVideoLoading(false)}
        />
      </div>
    </section>
  )
} 