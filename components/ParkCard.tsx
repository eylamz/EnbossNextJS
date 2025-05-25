// client/src/pages/Skateparks/components/ParkCard.tsx
import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Skatepark, Amenities } from '@/api/types/skatepark';
import { skateparkService } from '@/api/services/skatepark.service';
import { calculateDistance, getCoordinates } from '@/utils/coordinates';
import type { TFunction } from 'i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from '@/config/icons';
import AnimatedHybridHeartRating from './AnimatedHybridHeartRating';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface ParkCardProps { 
  park: Skatepark, 
  userLocation: UserLocation | null, 
  t: TFunction,
  refetchData: () => void,
  animationDelay?: number,
  onHeartRatePark?: (parkId: string, rating: number) => Promise<void>,
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
        <img
          src={getOptimizedImageUrl(photoUrl)}
          alt={parkName}
          className={`w-full h-full rounded-t-3xl object-cover transition-all duration-200 saturate-[1.75] select-none ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img
            src="/api/placeholder/400/225"
            alt="placeholder"
            className="w-16 h-16 opacity-50"
          />
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
  amenities: Amenities, 
  t: TFunction 
}) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 max-w-[calc(100%-1rem)]">
      {Object.entries(amenities)
        .filter(([_, value]) => value)
        .map(([key]) => (
          <Tooltip key={key}>
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
              <p>{t(`skateparks.amenities.${key}`)}</p>
            </TooltipContent>
          </Tooltip>
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
}: ParkCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselIdRef = useRef<string>(getUniqueCarouselId());

  // Get the featured image index
  const getFeaturedPhotoIndex = useCallback(() => {
    if (!park.photos || park.photos.length === 0) return 0;
    const featuredIndex = park.photos.findIndex(photo => photo.isFeatured);
    return featuredIndex >= 0 ? featuredIndex : 0;
  }, [park.photos]);

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
    if (!park.photos || park.photos.length <= 1) return;

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
        setCurrentPhotoIndex(current => (current + 1) % park.photos!.length);
        setIsTransitioning(false);
      }, 300); // Duration matches CSS transition
    };

    // Start the interval
    intervalRef.current = setInterval(() => {
      transitionToNextImage();
    }, 1500); // Total time each image is shown
  }, [park.photos]);

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
      if (activeCarouselId === carouselIdRef.current) {
        activeCarouselId = null;
      }
    };
  }, []);

  const handleHeartRatingClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

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
    setIsClicked(true);
    setTimeout(() => {
      if (park.url) {
        window.location.href = `/skateparks/${park.url}`;
      }
    }, 300);
  }, [park.url]);

  return (
    <Card 
      ref={cardRef}
      as="a"
      href={park.url ? `/skateparks/${park.url}` : '#'}
      onClick={handleCardClick}
      className={`h-fit hover:shadow-lg dark:hover:!scale-[1.02] bg-card dark:bg-card-dark rounded-3xl overflow-hidden cursor-pointer relative group select-none transform-gpu transition-all duration-200 opacity-0 animate-popFadeIn before:content-[''] before:absolute before:top-0 before:right-[-150%] before:w-[150%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:z-[1] before:pointer-events-none ${isClicked ? 'before:animate-shimmerInfinite' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      aria-label={t(`skateparks.${park.nameKey}.name`)}
    >
      {park.amenities && Object.values(park.amenities).some(Boolean) && (
        <ParkAmenities amenities={park.amenities} t={t} />
      )}

      {/* Add carousel toggle button in the top right corner */}
      {park.photos && park.photos.length > 1 && (
        <div 
          className={`absolute top-2 right-2 z-10 md:group-hover:opacity-100 transition-opacity duration-200
          ${isCarouselActive ? 'md:opacity-100' : 'md:opacity-0'}`}
          >
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
              {t('skateparks:skateparks.closedPark')}
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
              {t('skateparks:skateparks.newParkCard')}
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
              {t('skateparks:skateparks.featuredParkCard')}
              <Icon name='featured' category="ui" className="w-3 h-3" />
            </div>
          </div>
        )}

        {park.photos && park.photos.length > 0 && (
          <SkateparkThumbnail
            photoUrl={park.photos[currentPhotoIndex]?.url}
            parkName={park.nameKey}
            isTransitioning={isTransitioning}
          />
        )}
        
        {park.photos && park.photos.length > 1 && isCarouselActive && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {park.photos.map((_, index) => (
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
          {String(t(`skateparks:skateparks.${park.nameKey}.name`))}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Icon 
              name="location" 
              category="navigation" 
              className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0 flex-shrink-0"
            />
            <span className="text-sm truncate">
              {distanceText || t(`skateparks:skateparks.area.${park.area}`)}
            </span>
          </div>
          
          <div onClick={handleHeartRatingClick} className="rating-component">
            <AnimatedHybridHeartRating
              rating={park.heartRating?.average || 0}
              totalVotes={park.heartRating?.count || 0}
              hideVotesCount={true}
              onRate={async (rating) => {
                try {
                  if (!park._id) return;
                  if (onHeartRatePark) {
                    await onHeartRatePark(park._id, rating);
                  } else {
                    // Fallback to the original implementation
                    await skateparkService.heartRateSkatepark(park._id, rating);
                  }
                  if (refetchData) {
              
                    refetchData();
                  }
                } catch (error) {
                  console.error('Error rating park:', error);
                  throw error;
                }
              }}
              userRating={park._id ? skateparkService.getHeartRatingValue(park._id) : null}
              onVoteComplete={refetchData}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ParkCard;