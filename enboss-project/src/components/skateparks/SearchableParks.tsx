'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '@/components/common/SearchInput'
import { ParkCardWrapper } from '@/components/skatepark/ParkCardWrapper'
import AmenitiesButton from './AmenitiesButton'
import RatingSortButton from './RatingSortButton'
import LocationSortButton from './LocationSortButton'
import { calculateDistance, getCoordinates } from '@/utils/coordinates' // Assuming getCoordinates might be used elsewhere or planned
import { Icon } from '@/assets/icons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ParkCardSkeleton from './ParkCardSkeleton'

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
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface SearchableParksProps {
  skateparks: SkateparkData[];
  locale: string;
}

// Assuming these interfaces are defined correctly elsewhere or here if needed
interface AmenitiesButtonProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  locale: string;
  className?: string;
  style?: React.CSSProperties;
}

interface RatingSortButtonProps {
  isActive: boolean;
  onClick: () => void;
  locale: string;
  className?: string;
  style?: React.CSSProperties;
}

interface LocationSortButtonProps {
  isActive: boolean;
  onClick: () => void;
  locale: string;
  className?: string;
  style?: React.CSSProperties;
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
  const [sortByLocation, setSortByLocation] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [shuffledParks, setShuffledParks] = useState<SkateparkData[]>([])
  const [filterArea, setFilterArea] = useState('all')
  const [isFilterVisible, setIsFilterVisible] = useState(false) // For the whole filter status block
  const [shouldRender, setShouldRender] = useState(false)       // For the whole filter status block
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation(['common', 'skateparks'])

  // --- State for individual filter/sort status display and fade-out ---
  // Amenities
  const [persistedAmenitiesForDisplay, setPersistedAmenitiesForDisplay] = useState<string[]>([]);
  const [isAmenitiesStatusFadingOut, setIsAmenitiesStatusFadingOut] = useState(false);
  // Area Filter
  const [persistedFilterArea, setPersistedFilterArea] = useState('all');
  const [isAreaStatusFadingOut, setIsAreaStatusFadingOut] = useState(false);
  // Rating Sort
  const [persistedSortByRating, setPersistedSortByRating] = useState(false);
  const [isRatingStatusFadingOut, setIsRatingStatusFadingOut] = useState(false);
  // Location Sort
  const [persistedSortByLocation, setPersistedSortByLocation] = useState(false);
  const [isLocationStatusFadingOut, setIsLocationStatusFadingOut] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle overall filter status block visibility
  useEffect(() => {
    const hasActiveFilters = sortByRating || sortByLocation || selectedAmenities.length > 0 || filterArea !== 'all';
    if (hasActiveFilters) {
      setShouldRender(true);
      setTimeout(() => setIsFilterVisible(true), 0); // Ensure element is rendered before fadeIn
    } else {
      setIsFilterVisible(false); // Start fadeOut for the entire block
      const timer = setTimeout(() => setShouldRender(false), 300); // Remove from DOM after fadeOut
      return () => clearTimeout(timer);
    }
  }, [sortByRating, sortByLocation, selectedAmenities.length, filterArea]);

  // --- useEffects for individual filter/sort status fade-out ---
  // Amenities Status
  useEffect(() => {
    if (selectedAmenities.length > 0) {
      setPersistedAmenitiesForDisplay(selectedAmenities);
      setIsAmenitiesStatusFadingOut(false);
    } else { // selectedAmenities.length is 0
      if (persistedAmenitiesForDisplay.length > 0) { // Only if there was something to show
        setIsAmenitiesStatusFadingOut(true);
        const timer = setTimeout(() => {
          setPersistedAmenitiesForDisplay([]); // Clear after fade-out duration
          setIsAmenitiesStatusFadingOut(false); // Reset fading state
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setIsAmenitiesStatusFadingOut(false); // Ensure reset if already empty
      }
    }
  }, [selectedAmenities, persistedAmenitiesForDisplay.length]);

  // Area Filter Status
  useEffect(() => {
    if (filterArea !== 'all') {
      setPersistedFilterArea(filterArea);
      setIsAreaStatusFadingOut(false);
    } else { // filterArea is 'all'
      if (persistedFilterArea !== 'all') { // Only if it was previously active
        setIsAreaStatusFadingOut(true);
        const timer = setTimeout(() => {
          setPersistedFilterArea('all');
          setIsAreaStatusFadingOut(false);
        }, 300);
        return () => clearTimeout(timer);
      } else {
         setIsAreaStatusFadingOut(false);
      }
    }
  }, [filterArea, persistedFilterArea]);

  // Rating Sort Status
  useEffect(() => {
    if (sortByRating) {
      setPersistedSortByRating(true);
      setIsRatingStatusFadingOut(false);
    } else { // sortByRating is false
      if (persistedSortByRating) { // Only if it was previously active
        setIsRatingStatusFadingOut(true);
        const timer = setTimeout(() => {
          setPersistedSortByRating(false);
          setIsRatingStatusFadingOut(false);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setIsRatingStatusFadingOut(false);
      }
    }
  }, [sortByRating, persistedSortByRating]);

  // Location Sort Status
  useEffect(() => {
    if (sortByLocation) {
      setPersistedSortByLocation(true);
      setIsLocationStatusFadingOut(false);
    } else { // sortByLocation is false
      if (persistedSortByLocation) { // Only if it was previously active
        setIsLocationStatusFadingOut(true);
        const timer = setTimeout(() => {
          setPersistedSortByLocation(false);
          setIsLocationStatusFadingOut(false);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setIsLocationStatusFadingOut(false);
      }
    }
  }, [sortByLocation, persistedSortByLocation]);

  // Get user location when location sorting is enabled
  useEffect(() => {
    if (sortByLocation && !userLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            setSortByLocation(false);
          }
        );
      } else {
        console.error("Geolocation is not supported");
        setSortByLocation(false);
      }
    }
  }, [sortByLocation, userLocation]);

  // Shuffle parks on initial load
  useEffect(() => {
    setShuffledParks(shuffleArray(skateparks))
  }, [skateparks])

  // Filtered and Sorted Parks Memo
  const filteredAndSortedParks = React.useMemo(() => {
    let filtered = shuffledParks.filter((park) => {
      const searchLower = searchQuery.toLowerCase()
      const nameMatch = park.nameEn.toLowerCase().includes(searchLower) ||
        park.nameHe.toLowerCase().includes(searchLower)
      const amenitiesMatch = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => park.amenities[amenity])
      const areaMatch = filterArea === 'all' || park.area === filterArea
      return nameMatch && amenitiesMatch && areaMatch
    })
    if (sortByRating) {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }
    if (sortByLocation && userLocation) {
      filtered.sort((a, b) => {
        if (!a.location || !b.location) return 0;
        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.location.latitude, a.location.longitude);
        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.location.latitude, b.location.longitude);
        return distanceA - distanceB;
      });
    }
    return filtered
  }, [shuffledParks, searchQuery, selectedAmenities, sortByRating, sortByLocation, userLocation, filterArea])

  // Callbacks
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), [])
  const handleClearSearch = useCallback(() => setSearchQuery(''), [])
  const handleAmenitiesChange = useCallback((amenities: string[]) => setSelectedAmenities(amenities), [])
  const handleRatingSort = useCallback(() => { setSortByRating(prev => !prev); if (!sortByRating) setSortByLocation(false); }, [sortByRating]); // !sortByRating ensures setSortByLocation(false) runs when turning ON rating sort
  const handleLocationSort = useCallback(() => { setSortByLocation(prev => !prev); if (!sortByLocation) setSortByRating(false); }, [sortByLocation]); // !sortByLocation ensures setSortByRating(false) runs when turning ON location sort
  const handleAreaChange = useCallback((value: string) => setFilterArea(value), [])

  return (
    <>
      {/* Search Input and Filter Buttons */}
      <div className="w-full mb-8 flex flex-col xsm:flex-row justify-between items-center gap-4">
      <div className="relative flex-1 content-center  w-full sm:max-w-[250px] opacity-0 animate-scaleFadeUp  [animation-delay:100ms] md:[animation-delay:200ms]">
      <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder={t('skateparks:searchPlaceholder')}
          />
        </div>
        <div className="w-full xsm:w-auto flex items-center justify-between last:gap-2" role="group" aria-label={t('skateparks.filters.title')}>
          <Select 
            value={filterArea} 
            onValueChange={handleAreaChange}
            aria-label={t('skateparks:filter_by_area')}
          >
            <SelectTrigger 
              className="w-full h-10 !min-w-[110px] max-w-[120px] py-[2px] rounded-2xl bord transition-color duration-200 bg-transparent dark:bg-black/5 hover:bg-black/[2.5%] dark:hover:bg-white/[2.5%] opacity-0 animate-slideIn sm:animate-slideRight [animation-delay:500ms]"
            >
              <SelectValue placeholder={t('skateparks:all_areas')} />
            </SelectTrigger>
            <SelectContent className="max-w-[120px] bg-card/85 dark:bg-card-dark/75 backdrop-blur-[6px] navShadow">
              <SelectItem value="all">{t('skateparks:all_areas')}</SelectItem>
              <SelectItem value="north">{t('skateparks:area.north')}</SelectItem>
              <SelectItem value="center">{t('skateparks:area.center')}</SelectItem>
              <SelectItem value="south">{t('skateparks:area.south')}</SelectItem>
            </SelectContent>
          </Select>
          <div className='flex items-center gap-2'>
            <AmenitiesButton
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={handleAmenitiesChange}
              locale={locale}
              className="opacity-0 animate-slideRight [animation-delay:300ms]"
            />
            <RatingSortButton
              isActive={sortByRating}
              onClick={handleRatingSort}
              locale={locale}
              className="opacity-0 animate-slideRight [animation-delay:200ms]"
              />
            <LocationSortButton
              isActive={sortByLocation}
              onClick={handleLocationSort}
              locale={locale}
              className="opacity-0 animate-slideRight [animation-delay:100ms]"
            />
          </div>
        </div>
      </div>

      {/* Filter status text */}
      {shouldRender && (
        <div 
          className={`text-sm text-text-secondary dark:text-text-secondary-dark mb-2 -mt-7 transition-opacity duration-300 ${
            isFilterVisible ? 'opacity-100' : 'opacity-0' // Overall block fade
          }`}
          role="status"
          aria-live="polite"
        >
          {(() => {
            const totalParks = skateparks.length;
            // Determine layout based on how many status items will be visible (including those fading out)
            const visibleStatusItemsCount = [
              persistedFilterArea !== 'all',
              persistedAmenitiesForDisplay.length > 0,
              persistedSortByRating,
              persistedSortByLocation
            ].filter(Boolean).length;
            
            // Condition for showing the "X of Y" count line
            const showParkCountIndicator = persistedFilterArea !== 'all' || persistedAmenitiesForDisplay.length > 0;

            return (
              <div className={`flex ${visibleStatusItemsCount > 1 ? 'flex-col' : 'flex-col sm:flex-row'} gap-2 md:gap-1`}>
                {/* Showing X of Y parks */}
                {showParkCountIndicator && (
                     <div className="flex items-center gap-2">
                       <span>{t('skateparks:search.filterStatus.showing', { 
                         filtered: filteredAndSortedParks.length,
                         total: totalParks
                       })}</span>
                       <Icon name="park" category="ui" className="w-4 h-4 text-success dark:text-success-dark" />
                     </div>
                )}
                
                {/* Filtered by Area Status */}
                {persistedFilterArea !== 'all' && (
                  <div className={`flex items-center gap-1 transition-opacity duration-300 ${
                    isAreaStatusFadingOut ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <span>{t('skateparks:search.filterStatus.filteredByArea')}</span>
                    <span className='font-semibold'>
                      {t(`skateparks:area.${persistedFilterArea}`)}
                    </span>
                  </div>
                )}

                {/* Sorted by Amenities Status */}
                {persistedAmenitiesForDisplay.length > 0 && (
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${
                    isAmenitiesStatusFadingOut ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <span>{t('skateparks:search.filterStatus.sortedByAmenities')}</span>
                    <div className="flex items-center gap-2">
                      {persistedAmenitiesForDisplay.map((amenity) => (
                        <Icon 
                          key={amenity}
                          name={amenity}
                          category="amenity"
                          className="w-4 h-4 text-info dark:text-info-dark animate-fadeIn"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sorted by Rating Status */}
                {persistedSortByRating && (
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${
                    isRatingStatusFadingOut ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <span>{t('skateparks:search.filterStatus.sortedByRating')}</span>
                    <Icon name="heartBold" category="ui" className="w-4 h-4 text-error dark:text-error-dark" />
                  </div>
                )}

                {/* Sorted by Location Status */}
                {persistedSortByLocation && (
                  <div className={`flex items-center gap-2 transition-opacity duration-300 ${
                    isLocationStatusFadingOut ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <span>{t('skateparks:search.filterStatus.sortedByDistance')}</span>
                    <Icon name="locationBold" category="navigation" className="w-4 h-4 text-brand-main" />
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Parks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          [...Array(8)].map((_, index) => (
            <ParkCardSkeleton key={index} />
          ))
        ) : filteredAndSortedParks.length > 0 ? (
          filteredAndSortedParks.map((park: SkateparkData, index: number) => (
            <ParkCardWrapper
              key={park._id}
              park={park}
              animationDelay={index * 100}
              locale={locale}
              userLocation={userLocation}
              isLocationSortActive={sortByLocation} // Pass the actual sort state for ParkCardWrapper logic
            />
          ))
        ) : (
          <div 
            className="text-center py-12 col-span-full"
            role="status"
            aria-live="polite"
          >
            <Icon name="searchQuest" category="navigation" className="mx-auto h-12 w-12 text-brand-main" aria-hidden="true" />
            <h2 className="mt-2 text-sm font-medium">
              {searchQuery && filterArea === 'all' && selectedAmenities.length === 0 && !sortByRating && !sortByLocation
                ? t('skateparks:search.noResults') // Only search query, no active filters/sorts
                : (filterArea !== 'all' || selectedAmenities.length > 0 || sortByRating || sortByLocation) // Any actual filter/sort is active
                  ? t('skateparks:search.noFilteredResults') // Generic for "filters applied, 0 results"
                  : t('skateparks:search.noSkateparks')} 
            </h2>
          </div>
        )}
      </div>
    </>
  )
}