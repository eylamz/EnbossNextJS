'use client';

import React, { memo, useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Dynamically import ParkCard with no SSR
const ParkCard = dynamic(() => import('./ParkCard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-card dark:bg-card-dark rounded-3xl animate-pulse" />
  ),
});

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
  const [mounted, setMounted] = useState(false);
  
  // Shuffle the related parks array
  const shuffledParks = useMemo(() => {
    if (!relatedParks || relatedParks.length === 0) return [];
    const parks = [...relatedParks];
    for (let i = parks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [parks[i], parks[j]] = [parks[j], parks[i]];
    }
    return parks;
  }, [relatedParks]);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything if there are no related parks
  if (!relatedParks || relatedParks.length === 0) return null;

  // Show loading state during server-side rendering
  if (!mounted) {
    return (
      <div className="rounded-3xl overflow-hidden bord shadow-container text-text dark:text-[#b3b3b3] p-4 backdrop-blur-custom bg-background/70 dark:bg-background-secondary-dark/60">
        <div className="w-full h-32 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-3xl overflow-hidden bord shadow-container text-text dark:text-[#b3b3b3] p-4 backdrop-blur-custom bg-background/70 dark:bg-background-secondary-dark/60">
      <h2 className="text-xl font-semibold mb-6 text-text dark:text-[#f2f2f2]">
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
          <div className="hidden md:block bg-card dark:bg-card-dark !rounded-3xl overflow-hidden shadow-container transition-all duration-200">
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
          <div className="hidden lg:block bg-card dark:bg-card-dark rounded-3xl overflow-hidden shadow-container transition-all duration-200">
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