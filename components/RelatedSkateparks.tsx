// client/src/pages/skateparks/components/RelatedSkateparks.tsx
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { skateparkService } from '@/api/services/skatepark.service';
import { Skatepark } from '@/api/types/skatepark';
import { Icon } from '@/config/icons';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import AnimatedHybridHeartRating from './AnimatedHybridHeartRating';

interface RelatedSkateparksProps {
  currentParkId: string;
  area: string;
  refetchData: () => void;
}

// Utility function to get optimized thumbnail images
const getOptimizedThumbnail = (originalUrl: string, width: number = 300): string => {
  if (originalUrl?.includes('cloudinary.com')) {
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/w_${width},c_fill,q_auto:good,f_auto/${urlParts[1]}`;
    }
  }
  return originalUrl || '';
};

// Single skatepark card component (memoized for performance)
const RelatedParkCard = memo(({ 
  park, 
  t, 
  refetchData,
  currentArea
}: { 
  park: Skatepark; 
  t: (key: string) => string; 
  refetchData: () => void;
  currentArea: string;
}) => {
  // Label for area if it's different from current page's park
  const showAreaHighlight = useMemo(() => park.area !== currentArea, [park.area, currentArea]);
  // Get featured image
  const featuredImage = useMemo(() => {
    if (!park.photos || park.photos.length === 0) return '';
    const featured = park.photos.find(photo => photo.isFeatured);
    return featured ? featured.url : park.photos[0].url;
  }, [park.photos]);

  // Handle rating click without navigation
  const handleRatingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <a 
      href={park.url ? `/skateparks/${park.url}` : '#'}
      className="block card-link rounded-3xl transform-gpu"
      aria-label={t(`skateparks.${park.nameKey}.name`)}
    >
      <div className="shadow-container h-fit bg-card dark:bg-card-dark  cursor-pointer relative group select-none rounded-3xl overflow-hidden">
        <div className="relative h-24 sm:h-36 overflow-hidden">
          {featuredImage ? (
            <img
              src={getOptimizedThumbnail(featuredImage)}
              alt={t(`skateparks.${park.nameKey}.name`)}
              className="w-full h-full object-cover saturate-[1.75]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="map" category="ui" className="w-6 h-6 opacity-40" />
            </div>
          )}
        </div>
        
        <div className="px-3 py-2">
          <h3 className="text-medium font-semibold truncate text-text dark:text-text-dark">
            {t(`skateparks.${park.nameKey}.name`)}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Icon 
                name="location" 
                category="navigation" 
                className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0"
              />
              <span className={`text-sm ${showAreaHighlight ? 'font-medium text-brand-main dark:text-brand-main' : ''}`}>
                {t(`skateparks.area.${park.area}`)}
              </span>
            </div>
            <div 
              className="scale-95 origin-right"
              onClick={handleRatingClick}
            >
              <AnimatedHybridHeartRating
                rating={park.heartRating?.average || 0}
                totalVotes={park.heartRating?.count || 0}
                hideVotesCount={true}
                onRate={async (rating) => {
                  if (!park._id) return;
                  try {
                    await skateparkService.heartRateSkatepark(park._id, rating);
                    refetchData();
                  } catch (error) {
                    console.error('Error rating park:', error);
                  }
                }}
                userRating={park._id ? skateparkService.getHeartRatingValue(park._id) : null}
                onVoteComplete={refetchData}
              />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
});

const RelatedSkateparks = ({ currentParkId, area, refetchData }: RelatedSkateparksProps) => {
  const { t } = useTranslation('skateparks');
  
  // Fetch all parks (we'll filter them client-side)
  const { data: allParks, isLoading } = useQuery({
    queryKey: ['skateparks-all'],
    queryFn: () => skateparkService.getSkateparks({ limit: 100 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Get related parks (prioritizing same area, then other areas if needed)
  const relatedParks = useMemo(() => {
    if (!allParks?.data.skateparks) return [];
    
    // All parks excluding current park
    const allOtherParks = allParks.data.skateparks.filter(
      (park: Skatepark) => park._id !== currentParkId
    );
    
    // First, filter parks by area
    const sameAreaParks = allOtherParks.filter(
      (park: Skatepark) => park.area === area
    );
    
    // If we have 4 or more parks in the same area, we're good
    if (sameAreaParks.length >= 4) {
      // Shuffle the array (Fisher-Yates algorithm)
      const shuffled = [...sameAreaParks];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Return 4 random parks from the same area
      return shuffled.slice(0, 4);
    }
    
    // If we need more parks to reach 4, get parks from other areas
    const otherAreaParks = allOtherParks.filter(
      (park: Skatepark) => park.area !== area
    );
    
    // Shuffle other area parks
    const shuffledOtherParks = [...otherAreaParks];
    for (let i = shuffledOtherParks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOtherParks[i], shuffledOtherParks[j]] = [shuffledOtherParks[j], shuffledOtherParks[i]];
    }
    
    // Combine same area parks with other area parks to get 4 total
    const combinedParks = [
      ...sameAreaParks,
      ...shuffledOtherParks.slice(0, 4 - sameAreaParks.length)
    ];
    
    // Shuffle the combined parks
    const shuffledCombined = [...combinedParks];
    for (let i = shuffledCombined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCombined[i], shuffledCombined[j]] = [shuffledCombined[j], shuffledCombined[i]];
    }
    
    return shuffledCombined.slice(0, 4);
  }, [allParks, area, currentParkId]);
  
  // Don't render anything if there are no related parks
  if (relatedParks.length === 0) return null;
  
  return (
    <div className="rounded-3xl overflow-hidden border border-background-dark/10 dark:border-background/10 shadow-container text-text dark:text-[#7991a0] p-4 backdrop-blur-custom bg-background/70 dark:bg-background-secondary-dark/60">
      <h2 className="text-xl font-semibold mb-6 text-text dark:text-[#7991a0]">
      {t('skateparks.relatedParks')}
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Always show first 2 cards on mobile */}
          {relatedParks.slice(0, 2).map(park => (
            <RelatedParkCard
              key={park._id}
              park={park}
              t={t}
              refetchData={refetchData}
              currentArea={area}
            />
          ))}
          
          {/* Show 3rd card on tablet and up */}
          {relatedParks.length > 2 && (
            <div className="hidden md:block">
              <RelatedParkCard
                park={relatedParks[2]}
                t={t}
                refetchData={refetchData}
                currentArea={area}
              />
            </div>
          )}
          
          {/* Show 4th card on desktop only */}
          {relatedParks.length > 3 && (
            <div className="hidden lg:block">
              <RelatedParkCard
                park={relatedParks[3]}
                t={t}
                refetchData={refetchData}
                currentArea={area}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(RelatedSkateparks);