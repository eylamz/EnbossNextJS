'use client'

import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '@/components/common/SearchInput'
import { ParkCardWrapper } from '@/components/skatepark/ParkCardWrapper'
import AmenitiesButton from './AmenitiesButton'

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

interface SearchableParksProps {
  skateparks: SkateparkData[];
  locale: string;
}

export function SearchableParks({ skateparks, locale }: SearchableParksProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const { t } = useTranslation(['common', 'skateparks'])

  const filteredParks = skateparks.filter((park) => {
    const searchLower = searchQuery.toLowerCase()
    const nameMatch = park.nameEn.toLowerCase().includes(searchLower) ||
      park.nameHe.toLowerCase().includes(searchLower)

    // Filter by amenities if any are selected
    const amenitiesMatch = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => park.amenities[amenity])

    return nameMatch && amenitiesMatch
  })

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleAmenitiesChange = useCallback((amenities: string[]) => {
    setSelectedAmenities(amenities)
  }, [])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-text-dark">
          {t('skateparks:title')}
        </h1>
        <p className="text-center text-text-secondary mt-2">
          {t('skateparks:description')}
        </p>
      </div>

      {/* Search Input and Amenities Button */}
      <div className="max-w-md mx-auto mb-8 flex items-center gap-2">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder={t('skateparks:searchPlaceholder', 'Search skateparks...')}
            maxWidth="md"
          />
        </div>
        <AmenitiesButton
          selectedAmenities={selectedAmenities}
          onAmenitiesChange={handleAmenitiesChange}
          locale={locale}
        />
      </div>

      {/* Parks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredParks.map((park: SkateparkData, index: number) => (
          <ParkCardWrapper
            key={park._id}
            park={park}
            animationDelay={index * 100}
            locale={locale}
          />
        ))}
      </div>
    </>
  )
} 