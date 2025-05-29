'use client'

import React, { useEffect } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface MapSectionProps {
  googleMapsFrame?: string
  parkName: string
  locationText: string
  mapText: string
  mapNotAvailableText: string
}

export function MapSection({ 
  googleMapsFrame, 
  parkName, 
  locationText,
  mapText,
  mapNotAvailableText
}: MapSectionProps) {
  const [isMapLoading, setIsMapLoading] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsMapLoading(true)
  }, [])

  if (!isMounted) {
    return (
      <section aria-labelledby="location-heading" className="w-full max-w-6xl mx-auto">
        <h2 id="location-heading" className="sr-only">{parkName} {locationText}</h2>
        <div className="backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70 h-32 sm:h-60 rounded-3xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="location-heading" className="w-full max-w-6xl mx-auto">
      <h2 id="location-heading" className="sr-only">{parkName} {locationText}</h2>
      <div className="backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70 h-32 sm:h-60 rounded-3xl mb-8 overflow-hidden relative">
        {/* Shadow Overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-lg shadow-container z-10 dark:bg-background-dark/15"></div>
        
        {/* Border */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl bord"></div>
        
        {googleMapsFrame ? (
          <>
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
                <LoadingSpinner />
              </div>
            )}
            <iframe
              src={googleMapsFrame}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${parkName} ${locationText} ${mapText}`}
              className="rounded-lg"
              onLoad={() => setIsMapLoading(false)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              {mapNotAvailableText}
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 