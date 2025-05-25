// client/src/pages/skateparks/components/SkateparkGrid.tsx
import { useRef, memo, useMemo } from 'react';
import type { Skatepark } from '@/api/types/skatepark';
import { calculateDistance, getCoordinates, isGeoJSONPoint } from '@/utils/coordinates';
import type { TFunction } from 'i18next';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import ParkCard from './ParkCard';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface SkateparkGridProps {
  skateparks: Skatepark[];
  isLoading: boolean;
  userLocation: UserLocation | null;
  t: TFunction;
  onHeartRatePark: (parkId: string, rating: number) => Promise<void>;
  refetchData: () => void;
  sortByDistance?: boolean;
  preserveOrder?: boolean;
  sortByRating?: boolean;
  sortByDifficulty?: boolean;
}

// Utility function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Enhanced SkateparkGrid with centered viewport hint management and distance sorting
const SkateparkGrid = ({ 
  skateparks, 
  isLoading,
  userLocation,
  t,
  onHeartRatePark,
  refetchData,
  sortByDistance = false,
  preserveOrder = false,
  sortByRating = false,
  sortByDifficulty = false
}: SkateparkGridProps) => {
  // State to track which card should show the hint
  
  // Ref to store visibility info for all cards with their intersection ratio
  
  // Detect if device supports touch
  
  // Grid container ref to calculate center position
  const gridContainerRef = useRef<HTMLDivElement>(null);




  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Updated to use sortByDistance prop instead of shuffling when sorting is needed
  const displaySkateparks = useMemo(() => {
    // If we need to preserve order (when searching, rating sort, or difficulty sort is active), return the array as-is
    if (preserveOrder || sortByRating || sortByDifficulty) {
      return [...skateparks];  // Return copy without shuffling
    }
    
    // Skip sorting if not needed
    if (!sortByDistance || !userLocation) {
      // Return shuffled copy of the array when not sorting by distance
      return shuffleArray([...skateparks]);
    }
    
    // Sort by distance if requested and user location is available
    return [...skateparks].sort((parkA, parkB) => {
      // Skip calculation if coordinates aren't available
      if (!parkA.coordinates || !parkB.coordinates) {
        return 0;
      }
      
      try {
        // Handle both GeoJSONPoint and LegacyCoordinates types
        const coordsA = isGeoJSONPoint(parkA.coordinates)
          ? parkA.coordinates.coordinates
          : getCoordinates(parkA.coordinates);
        const coordsB = isGeoJSONPoint(parkB.coordinates)
          ? parkB.coordinates.coordinates
          : getCoordinates(parkB.coordinates);
        
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordsA[1], // latitude
          coordsA[0]  // longitude
        );
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordsB[1], // latitude
          coordsB[0]  // longitude
        );
        
        return distA - distB; // Sort from nearest to farthest
      } catch (error) {
        console.error('Error in distance calculation:', error);
        return 0;
      }
    });
  }, [skateparks, userLocation, sortByDistance, preserveOrder, sortByRating, sortByDifficulty]);

  return (
    <div 
      ref={gridContainerRef}
      className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {displaySkateparks.map((park, index) => (
        <ParkCard
          key={park._id}
          park={park}
          userLocation={userLocation}
          t={t}
          onHeartRatePark={onHeartRatePark}
          refetchData={refetchData}
          animationDelay={150 + (index * 125)} // Add staggered delay
        />
      ))}
    </div>
  );
};

export default memo(SkateparkGrid);