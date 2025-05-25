// client/src/pages/skateparks/SkateparksList.tsx
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from '@/components/ui/tooltip';
import { skateparkService } from '@/api/services/skatepark.service';
import { skateparkCache, SKATEPARK_DATA_VERSION, CACHE_EXPIRY_DAYS } from '@/utils/skateparkCache';
import SkateparkGrid from './components/SkateparkGrid';
import AmenitiesButton from './components/AmenitiesButton';
import RatingSortButton from './components/RatingSortButton';
import LocationSortButton from './components/LocationSortButton';
import DifficultySortButton from './components/DifficultySortButton';
import { calculateDistance } from '@/utils/coordinates';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Icon } from '@/config/icons';
import type { Skatepark, Amenities, Coordinates, GeoJSONPoint } from '@/api/types/skatepark';
import { SearchInput } from '@/components/common/SearchInput';
import { Helmet } from 'react-helmet-async';

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Updated to include 'difficulty' as a sort option
type SortType = 'none' | 'rating' | 'distance' | 'difficulty';

interface ScoredPark {
  park: Skatepark;
  score: number;
  name: string;
}

interface SkateparkResponse {
  data: {
    skateparks: Skatepark[];
  };
}

interface StructuredDataItem {
  "@type": string;
  position: number;
  item: {
    "@type": string;
    name: string;
    description: string;
    address: {
      "@type": string;
      addressRegion: string;
    };
    image?: string;
    rating?: {
      "@type": string;
      ratingValue?: number;
      ratingCount?: number;
    };
  };
}

interface StructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  mainEntity: {
    "@type": string;
    itemListElement: StructuredDataItem[];
  };
}

const SkateparksList = () => {
  const { t, i18n } = useTranslation(['skateparks', 'common']);
  const isHebrew = i18n.language === 'he';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortType>('none');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);
  const showCacheUI = import.meta.env.VITE_SHOW_CACHE_UI === 'true';
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Use queryClient for refetching
  const queryClient = useQueryClient();
  
  // Create a ref to track if component is mounted
  const isMounted = useRef(true);

  // Check cache status for the status indicator
  useEffect(() => {
    const checkCacheStatus = () => {
      if (skateparkCache.isCacheValid()) {
        const ageInSeconds = skateparkCache.getCacheAge() || 0;
        
        if (ageInSeconds < 60) {
          setCacheStatus(`${t('cache.updatedSecondsAgo', { seconds: Math.floor(ageInSeconds) })}`);
        } else if (ageInSeconds < 3600) {
          setCacheStatus(`${t('cache.updatedAgo', { minutes: Math.floor(ageInSeconds / 60) })}`);
        } else if (ageInSeconds < 86400) {
          setCacheStatus(`${t('cache.updatedAgo', { hours: Math.floor(ageInSeconds / 3600) })}`);
        } else {
          const days = Math.floor(ageInSeconds / 86400);
          setCacheStatus(`${t('cache.updatedDaysAgo', { days })}`);
        }
      } else {
        setCacheStatus(null);
      }
    };
    
    checkCacheStatus();
    const interval = setInterval(checkCacheStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [t]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Function to refresh data from server and update cache
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await skateparkService.refreshCache();
      queryClient.invalidateQueries({ queryKey: ['skateparks-all'] });
      toast({
        title: t('common:common.success'),
        description: t('cache.refreshSuccess'),
        variant: "success"
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: t('common:common.error'),
        description: t('cache.refreshError'),
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, toast, t]);
  
  const refetchData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['skateparks-all'] });
  }, [queryClient]);

  useEffect(() => {
    // Only do version check, don't call refreshData() directly
    if (skateparkCache.needsVersionRefresh()) {
      console.debug(`Cache version changed to ${SKATEPARK_DATA_VERSION}, triggering refetch...`);
      // Just invalidate the query - React Query will handle the fetch
      queryClient.invalidateQueries({ queryKey: ['skateparks-all'] });
    }
  }, [queryClient]);
  
  // Then make your useQuery control ALL fetching
  const { data: allParks, isLoading } = useQuery<SkateparkResponse>({
    queryKey: ['skateparks-all'],
    queryFn: () => skateparkService.getSkateparks({ limit: 100 }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    // No automatic refetch on mount
    refetchOnMount: false
  });
  
// Filter and sort parks based on search criteria
const filteredParks = useMemo(() => {
  if (!allParks?.data?.skateparks) {
    return [];
  }

  let filtered = [...allParks.data.skateparks];

  // Apply area filter
  if (filterArea !== 'all') {
    filtered = filtered.filter((park) => park.area === filterArea);
  }

  // Apply amenities filter
  if (selectedAmenities.length > 0) {
    filtered = filtered.filter((park) => {
      return selectedAmenities.every(amenity => 
        amenity in park.amenities && park.amenities[amenity as keyof Amenities] === true
      );
    });
  }

  // Search filter with relevance-based sorting
  if (searchQuery) {
    const searchTerm = searchQuery.toLowerCase();
    const isHebrewInput = /[\u0590-\u05FF]/.test(searchTerm);
    
    // Find matching parks and calculate relevance scores
    const scoredParks = filtered
      .map(park => {
        try {
          const nameKey = park.nameKey;
          const name = isHebrewInput 
            ? t(`skateparks.${nameKey}.name`, { lng: 'he' })
            : t(`skateparks.${nameKey}.name`, { lng: 'en' });
          
          if (!name || !name.toLowerCase().includes(searchTerm)) {
            return null;
          }
          
          // Calculate relevance score
          let score = 0;
          const lowerName = name.toLowerCase();
          
          if (lowerName === searchTerm) {
            score = 100; // Exact match
          } else if (lowerName.startsWith(searchTerm)) {
            score = 90;  // Starts with search term
          } else {
            const matchIndex = lowerName.indexOf(searchTerm);
            score = 80 - Math.min(matchIndex, 79); // Earlier matches score higher
          }
          
          return { park, score, name } as ScoredPark;
        } catch (error) {
          return null;
        }
      })
      .filter((item): item is ScoredPark => item !== null)
      .sort((a, b) => {
        // First sort by score (highest first)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        
        // If scores are the same, sort alphabetically
        return a.name.localeCompare(b.name, isHebrewInput ? 'he' : 'en');
      });
    
    return scoredParks.map(item => item.park);
  }
  
  // Apply other sorting options
  if (sortBy === 'rating') {
    filtered.sort((a, b) => {
      const ratingA = a.heartRating?.average || 0;
      const ratingB = b.heartRating?.average || 0;
      const votesA = a.heartRating?.count || 0;
      const votesB = b.heartRating?.count || 0;

      // First compare by rating
      if (ratingA !== ratingB) {
        return ratingB - ratingA; // Higher rating first
      }
      
      // If ratings are equal, compare by number of votes
      return votesB - votesA; // More votes first
    });
  } else if (sortBy === 'distance' && userLocation) {
    filtered.sort((a, b) => {
      const getCoords = (coords: Coordinates | GeoJSONPoint): [number, number] => {
        if ('coordinates' in coords) {
          return coords.coordinates;
        } else {
          return [coords.longitude, coords.latitude];
        }
      };

      const coordsA = getCoords(a.coordinates);
      const coordsB = getCoords(b.coordinates);
      
      const distanceA = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        coordsA[1], coordsA[0] // Note: coordinates are [longitude, latitude]
      );
      
      const distanceB = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        coordsB[1], coordsB[0] // Note: coordinates are [longitude, latitude]
      );
      
      return distanceA - distanceB;
    });
  } else if (sortBy === 'difficulty') {
    filtered.sort((a, b) => (a.difficultyRating?.average || 0) - (b.difficultyRating?.average || 0));
  }
  
  return filtered;
}, [allParks?.data?.skateparks, searchQuery, filterArea, selectedAmenities, sortBy, userLocation, t]);

// Optimize handler functions with useCallback
  const handleRatingSortClick = useCallback(() => {
    setSortBy(prev => prev === 'rating' ? 'none' : 'rating');
  }, []);

  const handleLocationClick = useCallback(() => {
    if (sortBy === 'distance') {
      setSortBy('none');
      setUserLocation(null);
    } else {
      if (!navigator.geolocation) {
        toast({
          title: t('common:common.error'),
          description: t('skateparks.location.unsupported'),
          variant: "destructive"
        });
        return;
      }
  
      toast({
        title: t('common:common.info'),
        description: t('skateparks.location.detecting'),
        variant: "default"
      });
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Set location first, then update sort type
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          setUserLocation(newLocation);
          setSortBy('distance');
          
          try {
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.latitude}&lon=${newLocation.longitude}&accept-language=${i18n.language}`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || t('skateparks.location.unknown');
            
            toast({
              title: t('common:common.success'),
              description: t('skateparks.location.detected', { city }),
              variant: "success"
            });
          } catch (error) {
            console.error('Geocoding error:', error);
            toast({
              title: t('common:common.success'),
              description: t('skateparks.location.detected', { city: t('skateparks.location.unknown') }),
              variant: "success"
            });
          }
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: t('common:common.error'),
            description: t('skateparks.location.error'),
            variant: "destructive"
          });
        }
      );
    }
  }, [sortBy, t, toast, i18n.language]);

  const handleDifficultySortClick = useCallback(() => {
    setSortBy(prev => prev === 'difficulty' ? 'none' : 'difficulty');
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, [i18n.language]);

  const handleAreaChange = useCallback((value: string) => {
    setFilterArea(value);
  }, []);

  const handleAmenitiesChange = useCallback((amenities: string[]) => {
    setSelectedAmenities(amenities);
  }, []);

  // Add structured data for SEO
  useEffect(() => {
    if (!allParks?.data?.skateparks) return;

    const structuredData: StructuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": t('skateparks.title'),
      "description": t('skateparks.description'),
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": allParks.data.skateparks.map((park: Skatepark, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "SportsActivityLocation",
            "name": t(`skateparks.${park.nameKey}.name`),
            "description": t(`skateparks.${park.nameKey}.description`),
            "address": {
              "@type": "PostalAddress",
              "addressRegion": t(`skateparks.area.${park.area}`)
            },
            "image": park.photos?.[0]?.url,
            "rating": {
              "@type": "AggregateRating",
              "ratingValue": park.heartRating?.average,
              "ratingCount": park.heartRating?.count
            }
          }
        }))
      }
    };

    // Add structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [allParks?.data?.skateparks, t]);

  // Generate meta description based on filters
  const getMetaDescription = useMemo(() => {
    let description = t('skateparks.meta.description');
    
    if (filterArea !== 'all') {
      description += ` ${t('skateparks.meta.inArea', { area: t(`skateparks.area.${filterArea}`) })}`;
    }
    
    if (selectedAmenities.length > 0) {
      const amenitiesList = selectedAmenities
        .map(amenity => t(`skateparks.amenities.${amenity}`))
        .join(', ');
      description += ` ${t('skateparks.meta.withAmenities', { amenities: amenitiesList })}`;
    }
    
    return description;
  }, [filterArea, selectedAmenities, t]);

  // Generate keywords based on filters and content
  const getMetaKeywords = useMemo(() => {
    const baseKeywords = [
      'enboss',
      'אנבוס',
      'skateparks',
      'skateboarding',
      'israel',
      'סקייטפארקים',
      'סקייטבורד'
    ];

    const areaKeywords = filterArea !== 'all' 
      ? [t(`skateparks.area.${filterArea}`)]
      : ['north', 'center', 'south', 'צפון', 'מרכז', 'דרום'];

    return [...baseKeywords, ...areaKeywords];
  }, [filterArea]);

  // Generate canonical URL
  const canonicalUrl = window.location.href;

  // Generate meta description
  const metaDescription = getMetaDescription;

  return (
    <>
      <Helmet>
        {/* Primary meta tags */}
        <title>{`${t('common:common.enboss')} | ${t('skateparks.meta.title')}${filterArea !== 'all' ? ` ${t(`skateparks.area.${filterArea}`)}` : ''}`}</title>
        <meta name="description" content={getMetaDescription} />
        <meta name="keywords" content={getMetaKeywords.join(', ')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={t('skateparks.title')} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={import.meta.env.VITE_DEFAULT_META_IMAGE_HTTP} />
        <meta property="og:image:secure_url" content={import.meta.env.VITE_DEFAULT_META_IMAGE_HTTPS} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ENBOSS - Unite & Ride" />


        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={t('skateparks.title')} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={import.meta.env.VITE_DEFAULT_META_IMAGE_HTTP} />
        <meta property="twitter:image:secure_url" content={import.meta.env.VITE_DEFAULT_META_IMAGE_HTTPS} />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Localization */}
        <meta property="og:locale" content={isHebrew ? 'he_IL' : 'en_US'} />
        <link rel="alternate" href={window.location.href} hrefLang={isHebrew ? 'he-IL' : 'en-US'} />
        <link rel="alternate" href={window.location.href} hrefLang="x-default" />
      </Helmet>

      <TooltipProvider>
        <main 
          ref={mainContentRef}
          className="page container mx-auto max-w-6xl px-4"
          role="main"
          aria-label={t('skateparks.title')}
        >
          <h1 className="sr-only">{t('skateparks.title')}</h1>
          
          <div 
            className="flex flex-col justify-between sm:flex-row gap-4 mb-8 will-change-transform"
            role="search"
            aria-label={t('skateparks.search.title')}
          >
            <div className="relative flex-1 content-center group sm:max-w-[250px] opacity-0 animate-scaleFadeUp  md:[animation-delay:500ms]">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={() => setSearchQuery('')}
                placeholder={t('skateparks.search.placeholder')}
                maxWidth="250px"
                aria-label={t('skateparks.search.placeholder')}
              />
            </div>
            
            <div 
              className="flex items-center justify-between last:gap-2"
              role="group"
              aria-label={t('skateparks.filters.title')}
            >
              <Select 
                value={filterArea} 
                onValueChange={handleAreaChange}
                aria-label={t('skateparks.area.filter')}
              >
                <SelectTrigger 
                  className="w-full !min-w-[110px] max-w-[120px] py-[2px] rounded-2xl bord transition-color duration-200 bg-transparent dark:bg-black/5 hover:bg-black/[2.5%] dark:hover:bg-white/[2.5%] opacity-0 animate-slideIn sm:animate-slideRight"
                  style={{ animationDelay: '700ms' }}
                  >
                  <SelectValue placeholder={t('skateparks.area.all')} />
                </SelectTrigger>
                <SelectContent className="max-w-[120px] bg-card/85 dark:bg-card-dark/75 backdrop-blur-[6px] navShadow">
                  <SelectItem value="all">{t('skateparks.area.all')}</SelectItem>
                  <SelectItem value="north">{t('skateparks.area.north')}</SelectItem>
                  <SelectItem value="center">{t('skateparks.area.center')}</SelectItem>
                  <SelectItem value="south">{t('skateparks.area.south')}</SelectItem>
                </SelectContent>
              </Select>

              <div 
                className="flex justify-end w-full gap-2"
                role="group"
                aria-label={t('skateparks.sort.title')}
              >
                <AmenitiesButton
                  selectedAmenities={selectedAmenities}
                  onAmenitiesChange={handleAmenitiesChange}
                  aria-label={t('skateparks.amenities.filter')}
                  className="opacity-0 animate-slideRight [animation-delay:400ms]"
                />

                <RatingSortButton 
                  isActive={sortBy === 'rating'}
                  onClick={handleRatingSortClick}
                  aria-label={t('skateparks.sort.byRating')}
                  className="opacity-0 animate-slideRight [animation-delay:300ms]"
                />

                <DifficultySortButton
                  isActive={sortBy === 'difficulty'}
                  onClick={handleDifficultySortClick}
                  aria-label={t('skateparks.sort.byDifficulty')}
                  className="opacity-0 animate-slideRight [animation-delay:200ms]"
                />

                <LocationSortButton
                  isActive={sortBy === 'distance'}
                  onClick={handleLocationClick}
                  aria-label={t('skateparks.sort.byDistance')}
                  className="opacity-0 animate-slideRight [animation-delay:100ms]"
                />
                
                {showCacheUI && (
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="opacity-0 animate-scaleFadeUp [animation-delay:100ms]"
                    aria-label={t('cache.refresh')}
                    title={`${t('cache.refresh')} (v${SKATEPARK_DATA_VERSION}, ${t('cache.expiresAfter', { days: CACHE_EXPIRY_DAYS }) || `expires in ${CACHE_EXPIRY_DAYS}d`})`}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing && (
                      <span className="sr-only">{t('common:common.loading')}</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {showCacheUI && cacheStatus && (
            <div 
              className="text-xs text-text-secondary dark:text-text-secondary-dark mb-2 flex items-center"
              role="status"
              aria-live="polite"
            >
              <div className="w-2 h-2 rounded-full bg-success mr-1.5" aria-hidden="true"></div>
              {cacheStatus} 
              <span className="ml-1 text-text-secondary/70 dark:text-text-secondary-dark/70">
                (v{skateparkCache.getCachedVersion() || '?'})
              </span>
              <span className="ml-1 text-text-secondary/60 dark:text-text-secondary-dark/60">
                {t('cache.expiresIn', { days: CACHE_EXPIRY_DAYS }) || `expires in ${CACHE_EXPIRY_DAYS}d`}
              </span>
            </div>
          )}
          
          {/* Add filter status text */}
          {(sortBy !== 'none' || selectedAmenities.length > 0) && (
            <div 
              className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2 -mt-7 animate-fadeIn"
              role="status"
              aria-live="polite"
            >
              {/* Count active sorting methods */}
              {(() => {
                const activeSorts = [
                  sortBy === 'rating',
                  sortBy === 'distance',
                  sortBy === 'difficulty',
                  selectedAmenities.length > 0
                ].filter(Boolean).length;

                const totalParks = allParks?.data?.skateparks?.length || 0;

                // If only one sort is active, show inline
                if (activeSorts === 1) {
                  return (
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-1">
                      {selectedAmenities.length > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span>{t('skateparks.search.filterStatus.showing', { 
                              filtered: filteredParks.length,
                              total: totalParks
                            })}</span>
                            <Icon name="park" category="ui" className="w-4 h-4 text-success dark:text-success-dark" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{t('skateparks.search.filterStatus.sortedByAmenities')}</span>
                            <div className="flex items-center gap-2">
                              {selectedAmenities.map((amenity) => (
                                <Icon 
                                  key={amenity}
                                  name={amenity}
                                  category="amenity"
                                  className="w-4 h-4 text-info dark:text-info-dark"
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {sortBy === 'rating' && (
                        <span className="flex items-center gap-2">
                          {t('skateparks.search.filterStatus.sortedByRating')}
                          <Icon name="heartBold" category="ui" className="w-4 h-4 text-error dark:text-error-dark" />
                        </span>
                      )}
                      {sortBy === 'distance' && (
                        <span className="flex items-center gap-2">
                          {t('skateparks.search.filterStatus.sortedByDistance')}
                          <Icon name="locationBold" category="navigation" className="w-4 h-4 text-brand-main" />
                        </span>
                      )}
                      {sortBy === 'difficulty' && (
                        <span className="flex items-center gap-2">
                          {t('skateparks.search.filterStatus.sortedByDifficulty')}
                          <Icon name="difficultyBold" category="rating" className="w-4 h-4 text-warning" />
                        </span>
                      )}
                    </div>
                  );
                }

                // If multiple sorts are active, show stacked
                return (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span>{t('skateparks.search.filterStatus.showing', { 
                          filtered: filteredParks.length,
                          total: totalParks
                        })}</span>
                        <Icon name="park" category="ui" className="w-4 h-4 text-success dark:text-success-dark" />
                      </div>
                      {selectedAmenities.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span>{t('skateparks.search.filterStatus.sortedByAmenities')}</span>
                          <div className="flex items-center gap-2">
                            {selectedAmenities.map((amenity) => (
                              <Icon 
                                key={amenity}
                                name={amenity}
                                category="amenity"
                                className="w-4 h-4 text-info dark:text-info-dark"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {sortBy === 'rating' && (
                        <span className="flex items-center gap-2">
                          {t('skateparks.search.filterStatus.sortedByRating')}
                          <Icon name="heartBold" category="ui" className="w-4 h-4 text-error dark:text-error-dark" />
                        </span>
                      )}
                      {sortBy === 'distance' && (
                        <span className="flex items-center gap-2">
                          {t('skateparks.search.filterStatus.sortedByDistance')}
                          <Icon name="locationBold" category="navigation" className="w-4 h-4 text-brand-main" />
                        </span>
                      )}
                      {sortBy === 'difficulty' && (
                        <span className="flex items-center gap-2">
                          {t('skateparks.search.filterStatus.sortedByDifficulty')}
                          <Icon name="difficultyBold" category="rating" className="w-4 h-4 text-warning" />
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
          
          {isLoading ? (
            <div 
              className="flex justify-center items-center py-12 min-h-96"
              role="status"
              aria-live="polite"
            >
              <LoadingSpinner />
              <span className="sr-only">{t('common:common.loading')}</span>
            </div>
          ) : (
            <>
              <div 
                className="contain-layout"
                role="region"
                aria-label={t('skateparks.list.title')}
              >
                <SkateparkGrid
                  skateparks={filteredParks}
                  isLoading={isLoading}
                  userLocation={userLocation}
                  t={t}
                  onHeartRatePark={(parkId, rating) =>
                    skateparkService.heartRateSkatepark(parkId, rating)
                  }
                  refetchData={refetchData}
                  sortByDistance={sortBy === 'distance'}
                  preserveOrder={!!searchQuery}
                  sortByRating={sortBy === 'rating'}
                  sortByDifficulty={sortBy === 'difficulty'}
                />
              </div>

              {filteredParks.length === 0 && (
                <div 
                  className="text-center py-12"
                  role="status"
                  aria-live="polite"
                >
                  <Icon name="searchQuest" category="navigation" className="mx-auto h-12 w-12 text-brand-main" aria-hidden="true" />
                  <h2 className="mt-2 text-sm font-medium">
                    {searchQuery || filterArea !== 'all' || selectedAmenities.length > 0
                      ? t('skateparks.search.noResults')
                      : t('skateparks.search.noSkateparks')}
                  </h2>
                </div>
              )}
            </>
          )}
        </main>
      </TooltipProvider>
    </>
  );
};

export default SkateparksList;