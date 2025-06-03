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
        const formData = new FormData()
        formData.append('skateparkId', parkId)
        formData.append('rating', rating.toString())
        await updateRating(formData)
      }}
      locale={locale}
      isLocationSortActive={isLocationSortActive}
    />
  )
} 