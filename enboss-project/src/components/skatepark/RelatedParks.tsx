'use client';

import React, { memo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import ParkCard from './ParkCard';

interface RelatedParksProps {
  currentParkId: string;
  area: string;
  relatedParks: any[];
  userLocation?: { latitude: number; longitude: number } | null;
  refetchData?: () => void;
  onHeartRatePark?: (parkId: string, rating: number) => Promise<void>;
}

const RelatedParks = ({ 
  currentParkId, 
  area, 
  relatedParks,
  userLocation = null,
  refetchData = () => {},
  onHeartRatePark
}: RelatedParksProps) => {
  const { t } = useTranslation('skateparks');
  
  // Don't render anything if there are no related parks
  if (!relatedParks || relatedParks.length === 0) return null;
  
  return (
    <div className="rounded-3xl overflow-hidden border border-background-dark/10 dark:border-background/10 shadow-container text-text dark:text-[#7991a0] p-4 backdrop-blur-custom bg-background/70 dark:bg-background-secondary-dark/60">
      <h2 className="text-xl font-semibold mb-6 text-text dark:text-[#7991a0]">
        {t('relatedParks')}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Always show first 2 cards on mobile */}
        {relatedParks.slice(0, 2).map((park, index) => (
          <ParkCard
            key={park._id}
            park={park}
            userLocation={userLocation}
            t={t}
            refetchData={refetchData}
            animationDelay={index * 100}
            onHeartRatePark={onHeartRatePark}
          />
        ))}
        
        {/* Show 3rd card on tablet and up */}
        {relatedParks.length > 2 && (
          <div className="hidden md:block">
            <ParkCard
              park={relatedParks[2]}
              userLocation={userLocation}
              t={t}
              refetchData={refetchData}
              animationDelay={200}
              onHeartRatePark={onHeartRatePark}
            />
          </div>
        )}
        
        {/* Show 4th card on desktop only */}
        {relatedParks.length > 3 && (
          <div className="hidden lg:block">
            <ParkCard
              park={relatedParks[3]}
              userLocation={userLocation}
              t={t}
              refetchData={refetchData}
              animationDelay={300}
              onHeartRatePark={onHeartRatePark}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RelatedParks); 