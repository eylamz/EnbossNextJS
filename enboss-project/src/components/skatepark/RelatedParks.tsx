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
  locale: string;
}

const RelatedParks = ({ 
  currentParkId, 
  area, 
  relatedParks,
  userLocation = null,
  refetchData = () => {},
  onHeartRatePark,
  locale
}: RelatedParksProps) => {
  const { t } = useTranslation(locale, 'skateparks');
  
  // Don't render anything if there are no related parks
  if (!relatedParks || relatedParks.length === 0) return null;

  // Shuffle the related parks array
  const shuffledParks = React.useMemo(() => {
    const parks = [...relatedParks];
    for (let i = parks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [parks[i], parks[j]] = [parks[j], parks[i]];
    }
    return parks;
  }, [relatedParks]);
  
  return (
    <div className="rounded-3xl overflow-hidden border border-background-dark/10 dark:border-background/10 shadow-container text-text dark:text-[#7991a0] p-4 backdrop-blur-custom bg-background/70 dark:bg-background-secondary-dark/60">
      <h2 className="text-xl font-semibold mb-6 text-text dark:text-[#7991a0]">
        {t('relatedParks')}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shuffledParks.slice(0, 2).map((park, index) => (
          <ParkCard
            key={park._id}
            park={park}
            userLocation={userLocation}
            t={t}
            refetchData={refetchData}
            animationDelay={index * 100}
            onHeartRatePark={onHeartRatePark}
            locale={locale}
            currentParkArea={area}
          />
        ))}
        {shuffledParks.length > 2 && (
          <div className="hidden md:block bg-card dark:bg-card-dark !rounded-3xl overflow-hidden shadow-container">
            {shuffledParks.slice(2, 3).map((park, index) => (
              <ParkCard
                key={park._id}
                park={park}
                userLocation={userLocation}
                t={t}
                refetchData={refetchData}
                animationDelay={(index + 2) * 100}
                onHeartRatePark={onHeartRatePark}
                locale={locale}
                currentParkArea={area}
              />
            ))}
          </div>
        )}
        {shuffledParks.length > 3 && (
          <div className="hidden lg:block bg-card dark:bg-card-dark rounded-3xl overflow-hidden shadow-container">
            {shuffledParks.slice(3, 4).map((park, index) => (
              <ParkCard
                key={park._id}
                park={park}
                userLocation={userLocation}
                t={t}
                refetchData={refetchData}
                animationDelay={(index + 3) * 100}
                onHeartRatePark={onHeartRatePark}
                locale={locale}
                currentParkArea={area}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RelatedParks); 