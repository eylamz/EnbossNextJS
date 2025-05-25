// client/src/pages/skateparks/components/MobileFriendlyRating.tsx
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const MobileFriendlyRating = ({
  type,
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete
}: RatingProps) => {
  const [isRating, setIsRating] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const iconInfo = getRatingIcon(type);
  const iconColor = getRatingColor(type, !!userRating);
  
  // Function to handle rating selection
  const handleRating = async (value: number) => {
    if (readonly || isRating) return;
    
    setIsRating(true);
    try {
      await onRate(value);
      setOpen(false);
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
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
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
          
          <div className="flex justify-center items-center gap-3 py-3">
            {isRating ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-brand-400 border-t-transparent"></div>
              </div>
            ) : (
              [1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className="p-2 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full"
                  onClick={() => handleRating(value)}
                  disabled={readonly}
                >
                  <Icon
                    {...iconInfo}
                    className={cn(
                      "w-7 h-7 transition-transform hover:scale-110",
                      value <= (userRating || 0) ? iconColor : "text-text-secondary",
                    )}
                  />
                </button>
              ))
            )}
          </div>
          
          <div className="text-center text-sm text-text-secondary">
            {t('common.totalVotes')}: {totalVotes}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileFriendlyRating;