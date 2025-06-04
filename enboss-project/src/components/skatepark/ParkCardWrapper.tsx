'use client'

import React from 'react'
import ParkCard from './ParkCard'
import { updateRating } from '@/app/actions/rating'
import { useTranslation } from '@/lib/i18n/client'

interface SkateparkData {
  _id: string;
  nameEn: string;
  nameHe: string;
  slug: string;
  area: string;
  rating: number;
  ratingCount: number;
  images: Array<{ url: string; isFeatured?: boolean }>;
  amenities: Record<string, boolean>;
  openingYear: number;
  closingYear?: number;
  createdAt: Date;
  isFeatured: boolean;
  coordinates?: string;
}

interface ParkCardWrapperProps {
  park: SkateparkData;
  animationDelay: number;
  locale: string;
  userLocation: { latitude: number; longitude: number } | null;
  isLocationSortActive?: boolean;
}

export function ParkCardWrapper({ 
  park, 
  animationDelay,
  locale,
  userLocation,
  isLocationSortActive = false
}: ParkCardWrapperProps) {
  const { t } = useTranslation(locale, 'skateparks')

  return (
    <ParkCard
      park={park}
      userLocation={userLocation}
      t={t}
      refetchData={async () => {
        // Client-side refetch logic
        window.location.reload();
      }}
      animationDelay={animationDelay}
      onHeartRatePark={async (parkId: string, rating: number) => {
        console.log('=== PARK CARD WRAPPER DEBUG ===')
        // Get previous rating from localStorage
        let previousRating = null;
        if (typeof window !== 'undefined') {
          try {
            const ratings = JSON.parse(localStorage.getItem('skateparkRatings') || '{}');
            previousRating = ratings[parkId] || null;
            console.log('Previous rating from localStorage:', previousRating)
          } catch (error) {
            console.error('Error reading from localStorage:', error);
          }
        }

        const formData = new FormData()
        formData.append('skateparkId', parkId)
        formData.append('rating', rating.toString())
        if (previousRating !== null) {
          console.log('Appending previousRating to formData:', previousRating)
          formData.append('previousRating', previousRating.toString())
        }
        
        console.log('FormData contents:')
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`)
        }
        
        await updateRating(formData)
        window.location.reload();
        console.log('=== END PARK CARD WRAPPER DEBUG ===')
      }}
      locale={locale}
      isLocationSortActive={isLocationSortActive}
    />
  )
} 