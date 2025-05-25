'use client';

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { calculateDistance, getCoordinates } from '@/utils/coordinates';
import { useTranslation } from '@/lib/i18n/client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/Tooltip";
import { Icon } from '@/assets/icons';
import HeartRating from './HeartRating';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface ParkCardProps { 
  park: any, 
  userLocation: UserLocation | null, 
  t: (key: string) => string,
  refetchData: () => void,
  animationDelay?: number,
  onHeartRatePark?: (parkId: string, rating: number) => Promise<void>,
  locale: string,
}

// Utility function to optimize image URLs
const getOptimizedImageUrl = (originalUrl: string): string => {
  if (originalUrl?.includes('cloudinary.com')) {
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/w_600,c_fill,q_auto:good,f_auto/${urlParts[1]}`;
    }
  }
  return originalUrl || '';
};

// Memoized thumbnail component
const SkateparkThumbnail = memo(({ 
  photoUrl, 
  parkName, 
  isTransitioning,
  onLoad
}: { 
  photoUrl: string, 
  parkName: string,
  isTransitioning: boolean,
  onLoad?: () => void
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(false);
  }, [photoUrl]);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    // Handle error case
  };
  
  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-background/20 dark:bg-background-dark/20 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {photoUrl ? (
        <Image
          src={getOptimizedImageUrl(photoUrl)}
          alt={parkName}
          fill
          className={`object-cover transition-all duration-200 saturate-[1.75] select-none ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Icon name="map" category="ui" className="w-6 h-6 opacity-40" />
        </div>
      )}
    </>
  );
});

// Memoized amenities component
const ParkAmenities = memo(({ 
  amenities, 
  t 
}: { 
  amenities: any, 
  t: (key: string) => string 
}) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 max-w-[calc(100%-1rem)]">
      {Object.entries(amenities)
        .filter(([key, value]) => value && key !== 'amenities_id' && key !== '_id')
        .map(([key]) => (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-black/45 backdrop-blur-sm p-1.5 rounded-lg">
                  <Icon 
                    name={key}
                    category="amenity"
                    className="w-4 h-4 text-white"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t(`amenities.${key}`)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
    </div>
  );
});

// Add a static ID generator for unique card IDs
const getUniqueCarouselId = (() => {
  let id = 0;
  return () => `park-carousel-${id++}`;
})();

// Store currently active carousel ID globally
let activeCarouselId: string | null = null;

// Add function to check if park is new (created in last 2 months)
const isNewPark = (createdAt: Date): boolean => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return new Date(createdAt) > twoMonthsAgo;
};

// Main ParkCard component
const ParkCard = memo(({ 
  park, 
  userLocation, 
  t, 
  refetchData,
  animationDelay = 0,
  onHeartRatePark,
  locale,
}: ParkCardProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const isNavigatingRef = useRef(false);
  const [parkName, setParkName] = useState(park.nameEn);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselIdRef = useRef<string>(getUniqueCarouselId());
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set the appropriate park name based on language
  useEffect(() => {
    setParkName(locale === 'he' ? park.nameHe : park.nameEn);
  }, [park.nameHe, park.nameEn, locale]);

  // Get the featured image index
  const getFeaturedPhotoIndex = useCallback(() => {
    if (!park.images || park.images.length === 0) return 0;
    const featuredIndex = park.images.findIndex((img: any) => img.isFeatured);
    return featuredIndex >= 0 ? featuredIndex : 0;
  }, [park.images]);

  // Initialize with featured image
  useEffect(() => {
    setCurrentPhotoIndex(getFeaturedPhotoIndex());
  }, [getFeaturedPhotoIndex]);

  const resetToFeaturedImage = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPhotoIndex(getFeaturedPhotoIndex());
      setIsTransitioning(false);
    }, 300);
  }, [getFeaturedPhotoIndex]);

  const startCarouselInterval = useCallback(() => {
    if (!park.images || park.images.length <= 1) return;

    // Clear any existing intervals/timeouts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    const transitionToNextImage = () => {
      setIsTransitioning(true);
      
      // Wait for fade out
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentPhotoIndex(current => (current + 1) % park.images!.length);
        setIsTransitioning(false);
      }, 300); // Duration matches CSS transition
    };

    // Start the interval
    intervalRef.current = setInterval(() => {
      transitionToNextImage();
    }, 1500); // Total time each image is shown
  }, [park.images]);

  // Handle carousel deactivation
  const deactivateCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    if (activeCarouselId === carouselIdRef.current) {
      activeCarouselId = null;
    }
    setIsCarouselActive(false);
    resetToFeaturedImage();
  }, [resetToFeaturedImage]);

  const handleToggleCarousel = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newCarouselState = !isCarouselActive;
    
    if (newCarouselState) {
      // First, stop all other carousels
      const currentActiveCarousel = document.querySelector(`[data-park-id="${activeCarouselId}"]`);
      if (currentActiveCarousel && activeCarouselId !== carouselIdRef.current) {
        const stopEvent = new CustomEvent('stopCarousel', { 
          detail: { activatedId: carouselIdRef.current } 
        });
        currentActiveCarousel.dispatchEvent(stopEvent);
      }
      
      // Then activate this carousel
      activeCarouselId = carouselIdRef.current;
      setIsCarouselActive(true);
      startCarouselInterval();
    } else {
      deactivateCarousel();
    }
  }, [isCarouselActive, startCarouselInterval, deactivateCarousel]);

  // Add event listener for carousel deactivation
  useEffect(() => {
    const handleStopCarousel = (e: CustomEvent) => {
      const activatedId = e.detail?.activatedId;
      
      if (activatedId !== carouselIdRef.current) {
        deactivateCarousel();
      }
    };

    if (cardRef.current) {
      cardRef.current.classList.add('park-carousel');
      cardRef.current.setAttribute('data-park-id', carouselIdRef.current);
      cardRef.current.addEventListener('stopCarousel', handleStopCarousel as EventListener);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('stopCarousel', handleStopCarousel as EventListener);
      }
    };
  }, [deactivateCarousel]);

  const handleHeartRatingClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRatePark = useCallback(async (rating: number) => {
    try {
      if (!park._id) return;
      console.log('=== PARK CARD RATING DEBUG ===');
      console.log('Current park data:', {
        id: park._id,
        currentRating: park.rating,
        currentVotes: park.ratingCount
      });
      console.log('Attempting to rate with:', rating);

      if (onHeartRatePark) {
        await onHeartRatePark(park._id, rating);
        console.log('Rating update completed');
        
        // Force a hard refresh to ensure we get the latest data
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        
        toast({
          title: t('common:common.success'),
          description: t('common:common.ratingSuccess'),
          variant: "success",
        });
      }
      
      if (refetchData) {
        console.log('Calling refetchData');
        await refetchData();
      }
    } catch (error) {
      console.error('Error rating park:', error);
      toast({
        title: t('common:common.error'),
        description: t('common:common.ratingError'),
        variant: "error",
      });
      throw error;
    }
  }, [park._id, onHeartRatePark, refetchData, t, toast]);

  const distanceText = useMemo(() => {
    if (!userLocation || !park.coordinates) return null;
    
    const coords = getCoordinates(park.coordinates);
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      coords[1],
      coords[0]
    ).toFixed(1);
    
    return `(${distance}${' ' + String(t('common:common.kilometer'))})`;
  }, [userLocation, park.coordinates, t]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;

    setIsNavigating(true);
    isNavigatingRef.current = true;
    
    // Clean up any existing timeouts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    // Deactivate carousel without state updates
    if (activeCarouselId === carouselIdRef.current) {
      activeCarouselId = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Use a timeout to ensure state updates are processed before navigation
    navigationTimeoutRef.current = setTimeout(() => {
      if (park.slug) {
        router.push(`/${locale}/skateparks/${park.slug}`);
        // Reset navigation state after a delay to ensure the shimmer effect is visible during page load
        setTimeout(() => {
          setIsNavigating(false);
          isNavigatingRef.current = false;
        }, 10000);
      }
    }, 100);
  }, [park.slug, router, locale, isNavigating]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      if (activeCarouselId === carouselIdRef.current) {
        activeCarouselId = null;
      }
      isNavigatingRef.current = false;
    };
  }, []);

  // Add debug logging for park data
  useEffect(() => {
    console.log('ParkCard Debug - Park Data:', {
      id: park._id,
      heartRating: park.heartRating,
      rating: park.heartRating?.average || 0,
      totalVotes: park.heartRating?.count || 0
    });
  }, [park]);

  return (
    <Card 
      ref={cardRef}
      as={Link}
      href={park.slug ? `/${locale}/skateparks/${park.slug}` : '#'}
      onClick={handleCardClick}
      className={`h-fit hover:shadow-lg dark:hover:!scale-[1.02] bg-card dark:bg-card-dark rounded-3xl overflow-hidden cursor-pointer relative group select-none transform-gpu transition-all duration-200 opacity-0 animate-popFadeIn before:content-[''] before:absolute before:top-0 before:right-[-150%] before:w-[150%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:z-[1] before:pointer-events-none before:opacity-0 before:transition-opacity before:duration-300 ${isNavigating ? 'before:opacity-100 before:animate-shimmerInfinite' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      aria-label={park.nameEn}
    >
      {park.amenities && Object.values(park.amenities).some(Boolean) && (
        <ParkAmenities amenities={park.amenities} t={t} />
      )}

      {/* Add carousel toggle button in the top right corner */}
      {park.images && park.images.length > 1 && (
        <div 
          className={`absolute top-2 right-2 z-10 md:group-hover:opacity-100 transition-opacity duration-200
          ${isCarouselActive ? 'md:opacity-100' : 'md:opacity-0'}`}
          >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  tabIndex={-1}
                  className={`h-8 w-8 rounded-lg ${
                    isCarouselActive 
                      ? "bg-brand-main/45 text-header hover:bg-brand-main/45 hover:text-header dark:bg-brand-main/45 dark:text-header dark:hover:bg-brand-main/45 dark:hover:text-header" 
                      : "bg-black/45 text-text-dark hover:bg-black/25 hover:text-text-dark dark:bg-black/45 dark:text-text-dark dark:hover:bg-black/35 dark:hover:text-text-dark"
                  } backdrop-blur-sm`}
                  onClick={handleToggleCarousel}
                >
                  <Icon name='bulkImage' category="ui" className="w-4 h-4 navShadow" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCarouselActive ? t('common:common.pauseSlideshow') : t('common:common.startSlideshow')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <div 
        ref={imageContainerRef}
        className="relative bg-black/25 h-[10.5rem] overflow-hidden"
      >
        {/* Add year badge for parks opened in the last 3 years */}
        {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear) && (
          <div className="absolute bottom-2 left-0 z-10">
            <div className="flex ltr:flex-row-reverse gap-1 justify-center items-center bg-header-dark text-black text-xs md:text-sm font-semibold px-2 py-1 rounded-r-full shadow-badge md:shadow-badgeMd">
              {park.openingYear}
              <Icon name='sparks' category="ui" className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Add closed badge for parks with closingYear */}
        {park.closingYear && (
          <div className={`absolute bottom-2 z-10 ${
            [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear) 
              ? 'right-0' 
              : 'left-0'
          }`}>
            <div className={`flex gap-1 justify-center items-center bg-error dark:bg-error-dark text-white text-xs px-2 py-1 shadow-badge ${
              [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear)
                ? 'rounded-l-3xl'
                : 'rounded-r-3xl'
            }`}>
              {t('closedPark')}
              <Icon name='closedPark' category="ui" className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Add new badge for parks created in the last 2 months */}
        {park.createdAt && isNewPark(park.createdAt) && (
          <div className={`absolute bottom-2 z-10 ${
            [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear) 
              ? 'right-0' 
              : 'left-0'
          }`}>
            <div className={`flex gap-1 justify-center items-center bg-info text-white text-xs md:text-sm px-2 py-1 shadow-badge ${
              [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear)
                ? 'rounded-l-3xl'
                : 'rounded-r-3xl'
            }`}>
              {t('newParkCard')}
              <Icon name='new' category="ui" className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Add featured badge */}
        {park.isFeatured && (
          <div className={`absolute bottom-2 z-10 ${
            ([new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear) || 
            (park.createdAt && isNewPark(park.createdAt))) 
              ? 'right-0' 
              : 'left-0'
          }`}>
            <div className={`flex justify-center items-center bg-yellow-400 text-black text-xs font-bold px-2 py-1 shadow-badge ${
              ([new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].includes(park.openingYear) ||
              (park.createdAt && isNewPark(park.createdAt)))
                ? 'rounded-l-3xl'
                : 'rounded-r-3xl'
            }`}>
              {t('featuredParkCard')}
              <Icon name='featured' category="ui" className="w-3 h-3" />
            </div>
          </div>
        )}

        {park.images && park.images.length > 0 && (
          <SkateparkThumbnail
            photoUrl={park.images[currentPhotoIndex]?.url}
            parkName={parkName}
            isTransitioning={isTransitioning}
          />
        )}
        
        {park.images && park.images.length > 1 && isCarouselActive && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {park.images.map((_: any, index: number) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentPhotoIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <CardContent className="px-4 py-3 space-y-1">
        <h3 className="text-lg font-semibold truncate">
          {parkName}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Icon 
              name="location" 
              category="navigation" 
              className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0 flex-shrink-0"
            />
            <span className="text-sm truncate">
              {distanceText || t(`area.${park.area}`)}
            </span>
          </div>
          
          <div onClick={handleHeartRatingClick} className="rating-component">
            <HeartRating
              rating={park.rating || 0}
              totalVotes={park.ratingCount || 0}
              hideVotesCount={true}
              onRate={handleRatePark}
              userRating={park._id ? park.userRating : null}
              onVoteComplete={refetchData}
              skateparkId={park._id || ''}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ParkCard; 