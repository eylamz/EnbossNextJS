'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '@/components/common/SearchInput'
import { ParkCardWrapper } from '@/components/skatepark/ParkCardWrapper'
import AmenitiesButton from './AmenitiesButton'
import RatingSortButton from './RatingSortButton'

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

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function SearchableParks({ skateparks, locale }: SearchableParksProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortByRating, setSortByRating] = useState(false)
  const [shuffledParks, setShuffledParks] = useState<SkateparkData[]>([])
  const { t } = useTranslation(['common', 'skateparks'])

  // Shuffle parks on initial load
  useEffect(() => {
    setShuffledParks(shuffleArray(skateparks))
  }, [skateparks])

  const filteredAndSortedParks = React.useMemo(() => {
    let filtered = shuffledParks.filter((park) => {
      const searchLower = searchQuery.toLowerCase()
      const nameMatch = park.nameEn.toLowerCase().includes(searchLower) ||
        park.nameHe.toLowerCase().includes(searchLower)

      // Filter by amenities if any are selected
      const amenitiesMatch = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => park.amenities[amenity])

      return nameMatch && amenitiesMatch
    })

    // Sort by rating if enabled
    if (sortByRating) {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return filtered
  }, [shuffledParks, searchQuery, selectedAmenities, sortByRating])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleAmenitiesChange = useCallback((amenities: string[]) => {
    setSelectedAmenities(amenities)
  }, [])

  const handleRatingSort = useCallback(() => {
    setSortByRating(prev => !prev)
  }, [])

  return (
    <>


      {/* Search Input and Filter Buttons */}
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
        <div className="flex gap-2">
          <RatingSortButton
            isActive={sortByRating}
            onClick={handleRatingSort}
            locale={locale}
          />
          <AmenitiesButton
            selectedAmenities={selectedAmenities}
            onAmenitiesChange={handleAmenitiesChange}
            locale={locale}
          />
        </div>
      </div>

      {/* Parks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredAndSortedParks.map((park: SkateparkData, index: number) => (
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