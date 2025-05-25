

// client/src/pages/skateparks/components/HybridRating.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

export type RatingType = 'heart' | 'cleanliness' | 'maintenance' | 'difficulty';

interface RatingProps {
  type: RatingType;
  rating: number;
  totalVotes: number;
  onRate: (rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
}

// Helper function to determine icon based on rating type
const getRatingIcon = (type: RatingType) => {
  switch(type) {
    case 'heart':
      return { name: 'heart', category: 'ui' as const };
    case 'cleanliness':
      return { name: 'cleanliness', category: 'rating' as const };
    case 'maintenance':
      return { name: 'maintenance', category: 'rating' as const };
    case 'difficulty':
      return { name: 'difficulty', category: 'rating' as const };
    default:
      return { name: 'heart', category: 'ui' as const };
  }
};

// Helper function to get color based on rating type
const getRatingColor = (type: RatingType, isRated: boolean) => {
  if (!isRated) return "text-text-secondary";
  
  switch(type) {
    case 'heart':
      return "text-red-500 fill-red-500";
    case 'cleanliness':
      return "text-green-500";
    case 'maintenance':
      return "text-blue-500";
    case 'difficulty':
      return "text-orange-500";
    default:
      return "text-text-secondary";
  }
};

const HybridRating = ({
  type,
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete
}: RatingProps) => {
  const [isRating, setIsRating] = useState(false);
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const iconInfo = getRatingIcon(type);
  const iconColor = getRatingColor(type, !!userRating);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect if device is touch-capable on mount
  useEffect(() => {
    const isTouchCapable = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          (navigator as any).msMaxTouchPoints > 0;
    setIsTouchDevice(isTouchCapable);
  }, []);
  
  // Function to handle rating selection
  const handleRating = async (value: number) => {
    if (readonly || isRating) return;
    
    setIsRating(true);
    try {
      await onRate(value);
      setIsDialogOpen(false);
      setIsHoverCardOpen(false);
      toast({
        title: t("common.success"),
        description: userRating 
          ? t(`skatepark.specialtyRating.${type}.updated`) 
          : t(`skatepark.specialtyRating.${type}.success`),
        variant: "success"
      });
      if (onVoteComplete) {
        onVoteComplete();
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: (error as Error)?.message || t(`skatepark.specialtyRating.${type}.error`),
        variant: "destructive"
      });
    } finally {
      setIsRating(false);
    }
  };

  // Get translated rating type name
  const getRatingTypeName = () => {
    switch(type) {
      case 'heart':
        return t('skatepark.rating.overall');
      case 'cleanliness':
        return t('skatepark.rating.cleanliness');
      case 'maintenance':
        return t('skatepark.rating.maintenance');
      case 'difficulty':
        return t('skatepark.rating.difficulty');
      default:
        return t('skatepark.rating.overall');
    }
  };

  // Handle click on the rating trigger
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isTouchDevice) {
      // For touch devices, open the dialog
      setIsDialogOpen(true);
    } else {
      // For non-touch devices, toggle the hover card
      setIsHoverCardOpen(!isHoverCardOpen);
    }
  };

  // Rating Stars Component shared by both dialog and hover card
  const RatingStars = ({ value: _value, onSelect }: { value: number, onSelect: (rating: number) => void }) => {
    const [hoverValue, setHoverValue] = useState(0);
    
    return (
      <div className="flex items-center gap-2" onMouseLeave={() => setHoverValue(0)}>
        <div className="flex gap-2 items-center">
          {isRating ? (
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-brand-400 border-t-transparent"></div>
          ) : (
            [1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={cn(
                  "p-1 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full",
                  isTouchDevice ? "p-2" : "p-1" // Larger touch targets for mobile
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(value);
                }}
                onMouseEnter={() => !readonly && setHoverValue(value)}
                disabled={readonly || isRating}
              >
                <Icon
                  {...iconInfo}
                  className={cn(
                    "transition-transform",
                    isTouchDevice ? "w-6 h-6" : "w-5 h-5", // Larger for touch
                    value <= (hoverValue || userRating || 0) ? iconColor : "text-text-secondary",
                    !readonly && "hover:scale-110"
                  )}
                />
              </button>
            ))
          )}
        </div>
        
        {/* Display total votes count */}
        <span className="text-xs text-gray-500">
          ({totalVotes > 0 ? `${totalVotes}` : '0'})
        </span>
      </div>
    );
  };
  
  // For touch devices - Dialog version
  if (isTouchDevice) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div 
            className="flex items-center gap-1 cursor-pointer rating-component" 
            onClick={handleTriggerClick}
          >
            <span className="text-sm font-medium">
              {rating.toFixed(1)}
            </span>
            <Icon 
              {...iconInfo}
              className={cn(
                "w-5 h-5",
                iconColor
              )} 
            />
          </div>
        </DialogTrigger>
        <DialogContent className="w-80 p-5">
          <div className="space-y-4">
            <h3 className="text-center font-medium text-lg">{getRatingTypeName()}</h3>
            
            {userRating && (
              <div className="flex items-center justify-center gap-1 mb-2 text-center">
                <Icon 
                  {...iconInfo}
                  className={cn(
                    "w-4 h-4",
                    iconColor
                  )} 
                />
                <span className="text-sm font-medium">
                  {t('skatepark.rating.alreadyVoted')}
                </span>
              </div>
            )}
            
            <div className="flex justify-center items-center gap-2 py-2">
              <RatingStars value={userRating || 0} onSelect={handleRating} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // For non-touch devices - HoverCard version
  return (
    <div ref={containerRef} className="rating-component">
      <HoverCard
        open={isHoverCardOpen}
        onOpenChange={setIsHoverCardOpen}
      >
        <HoverCardTrigger asChild>
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            onClick={handleTriggerClick}
          >
            <span className="text-sm font-medium">
              {rating.toFixed(1)}
            </span>
            <Icon 
              {...iconInfo}
              className={cn(
                "w-5 h-5",
                iconColor
              )} 
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-fit" 
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHoverCardOpen(true)}
          onMouseLeave={() => setIsHoverCardOpen(false)}
        >
          <div className="space-y-2">
            {userRating && (
              <div className="flex items-center gap-1 mb-2">
                <Icon 
                  {...iconInfo}
                  className={cn(
                    "w-4 h-4",
                    iconColor
                  )} 
                />
                <span className="text-xs font-medium">
                  {t('skatepark.rating.alreadyVoted')}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <RatingStars value={userRating || 0} onSelect={handleRating} />
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default HybridRating;