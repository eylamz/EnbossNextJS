'use client'

import React from 'react'
import ParkCard from './ParkCard'
import { updateRating } from '@/app/actions/rating'

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
}

interface ParkCardWrapperProps {
  park: SkateparkData;
  animationDelay: number;
  locale: string;
}

export function ParkCardWrapper({ 
  park, 
  animationDelay,
  locale 
}: ParkCardWrapperProps) {
  return (
    <ParkCard
      park={park}
      userLocation={null}
      t={(key: string) => key} // This will be replaced by the actual translation in the client
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
    />
  )
} 