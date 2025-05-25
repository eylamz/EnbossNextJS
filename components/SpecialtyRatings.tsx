// client/src/pages/skateparks/components/SpecialtyRatings.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

export type RatingType = 'cleanliness' | 'maintenance' | 'difficulty';

interface SpecialtyRatingProps {
  type: RatingType;
  rating: number;
  totalVotes: number;
  onRate?: (type: RatingType, rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
}

const SpecialtyRating = ({
  type,
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete
}: SpecialtyRatingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isRating, setIsRating] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get the correct icon based on rating type
  const getRatingIcon = () => {
    switch(type) {
      case 'cleanliness':
        return { name: 'cleanliness', category: 'rating' as const };
      case 'maintenance':
        return { name: 'maintenance', category: 'rating' as const };
      case 'difficulty':
        return { name: 'difficulty', category: 'rating' as const };
      default:
        return { name: 'star', category: 'rating' as const };
    }
  };

  // Detect if device is touch-capable on mount
  useEffect(() => {
    const isTouchCapable = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          (navigator as any).msMaxTouchPoints > 0;
    setIsTouchDevice(isTouchCapable);
  }, []);

  // Handle click outside for all devices
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if the click was outside our component
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle click/tap on icon - for touch devices
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // For all devices, toggle the rating card
    // This ensures it works on both touch and non-touch
    setIsOpen(!isOpen);
  };

  const RatingStars = ({ value, onSelect }: { value: number, onSelect?: (rating: number) => void }) => {
    const [hoverValue, setHoverValue] = useState(0);
    const { name, category } = getRatingIcon();

    return (
      <div className="flex items-center gap-2"
           onMouseLeave={() => setHoverValue(0)}>
                      <div className="flex gap-2 items-center"> {/* Increased gap for better touch targets */}
          {isRating ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent"></div>
          ) : (
            [1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={name}
                category={category}
                className={cn(
                  "w-5 h-5 transition-colors duration-150", // Increased size for better touch targets
                  star <= (hoverValue || value) 
                    ? type === 'cleanliness' 
                      ? "text-green-500" 
                      : type === 'maintenance' 
                        ? "text-blue-500" 
                        : "text-orange-500" 
                    : "text-text-secondary",
                  !readonly && "cursor-pointer"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (onSelect) {
                    setIsRating(true);
                    // Small delay to ensure click registers on touch devices
                    setTimeout(() => {
                      onSelect(star);
                    }, 50);
                  }
                }}
                onMouseEnter={() => !readonly && setHoverValue(star)}
              />
            ))
          )}
        </div>
        
        {/* Display total votes count next to the icons */}
        <span className="text-xs text-gray-500">
          ({totalVotes > 0 ? `${totalVotes}` : '0'})
        </span>
      </div>
    );
  };

  // Get color for each rating type
  const getRatingColor = () => {
    switch(type) {
      case 'cleanliness': return userRating ? "text-green-500" : "text-text-secondary";
      case 'maintenance': return userRating ? "text-blue-500" : "text-text-secondary";
      case 'difficulty': return userRating ? "text-orange-500" : "text-text-secondary";
      default: return "text-text-secondary";
    }
  };

  return (
    <div ref={containerRef} className="rating-component">
                  <HoverCard
        openDelay={0} // Removed delay for touch devices
        closeDelay={300}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <HoverCardTrigger asChild>
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            onClick={handleIconClick}
          >
            {/* Rating value on the left */}
            <span className="text-sm font-medium">
              {rating.toFixed(1)}
            </span>
            
            {/* Icon in the middle */}
            <Icon 
              {...getRatingIcon()}
              className={cn(
                "w-5 h-5",
                getRatingColor()
              )} 
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-fit" 
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => !isTouchDevice && setIsOpen(true)}
          onMouseLeave={() => !isTouchDevice && setIsOpen(false)}
        >
          <div className="">
            {userRating && (
              <div className="flex items-center gap-1 mb-2">
                <Icon 
                  {...getRatingIcon()}
                  className={cn(
                    "w-4 h-4",
                    type === 'cleanliness' ? "text-green-500" : 
                    type === 'maintenance' ? "text-blue-500" : "text-orange-500"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium",
                  type === 'cleanliness' ? "text-green-500" : 
                  type === 'maintenance' ? "text-blue-500" : "text-orange-500"
                )}>
                  {t('skatepark.rating.alreadyVoted')}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between group">
              <RatingStars 
                value={userRating || 0} 
                onSelect={
                  !readonly ? (rating) => {
                    if (onRate) {
                      setIsRating(true);
                      // Add a small delay to ensure the click is registered before UI updates
                      setTimeout(() => {
                        onRate(type, rating)
                          .then(() => {
                            setIsRating(false);
                            setIsOpen(false); // Close popup after successful rating
                            toast({
                              title: t("common.success"),
                              description: userRating 
                                ? t(`skatepark.specialtyRating.${type}.updated`) 
                                : t(`skatepark.specialtyRating.${type}.success`),
                              variant: "success"
                            });
                            // Call the callback to trigger data refetch
                            if (onVoteComplete) {
                              onVoteComplete();
                            }
                          })
                          .catch((error: Error) => {
                            setIsRating(false);
                            toast({
                              title: t("common.error"),
                              description: error.message || t(`skatepark.specialtyRating.${type}.error`),
                              variant: "destructive"
                            });
                          });
                      }, 50);
                    }
                  } : undefined
                }
              />
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default SpecialtyRating;