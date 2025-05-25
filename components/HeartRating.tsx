// client/src/pages/skateparks/components/HeartRating.tsx
import { useState } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

interface HeartRatingProps {
  rating: number;
  totalVotes: number;
  onRate?: (rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
}

const HeartRating = ({
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete
 }: HeartRatingProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isRating, setIsRating] = useState(false);
  
    const RatingHearts = ({ value, onSelect }: { value: number, onSelect?: (rating: number) => void }) => {
        const [hoverValue, setHoverValue] = useState(0);
    
        return (
            <div className="flex items-center gap-2"
                 onMouseLeave={() => setHoverValue(0)}>
              <div className="flex gap-1 items-center">
                {isRating ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                ) : (
                  [1, 2, 3, 4, 5].map((heart) => (
                    <Icon
                      key={heart}
                      name="heart"
                      category="ui"
                      className={cn(
                        "w-4 h-4 transition-colors duration-150",
                        heart <= (hoverValue || value) ? "fill-red-500 text-red-500" : "text-text-secondary",
                        !readonly && "cursor-pointer"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) {
                          setIsRating(true);
                          onSelect(heart);
                        }
                      }}
                      onMouseEnter={() => !readonly && setHoverValue(heart)}
                    />
                  ))
                )}
              </div>
              
              {/* Display total votes count next to the heart icons */}
              <span className="text-xs text-gray-500">
                ({totalVotes > 0 ? `${totalVotes}` : '0'})
              </span>
            </div>
          );
        };
      
        return (
          <HoverCard
            openDelay={100}
            closeDelay={300}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer heart-rating-component " 
                   onClick={(e) => e.stopPropagation()}>
                {/* Rating value on the left */}
                <span className="text-sm font-medium">
                  {rating.toFixed(1)}
                </span>
                
                {/* Heart icon in the middle */}
                <Icon 
                  name="heart"
                  category="ui"
                  className={cn(
                    "w-5 h-5",
                    rating > 0 ? " text-red-500" : "text-transparent stroke-gray-300 dark:stroke-gray-700"
                  )} 
                />
                
                {/* No votes display here anymore, moved to the rating hearts section */}
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-fit" 
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="">
                {userRating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Icon 
                      name="heartLiked" 
                      category="rating" 
                      className="w-4 h-4 text-brand-700 dark:text-brand-600" 
                    />
                    <span className="text-xs font-medium text-brand-700 dark:text-brand-600">
                      {t('skatepark.rating.alreadyVoted')}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between group">
                  <RatingHearts 
                    value={userRating || 0} 
                    onSelect={
                      !readonly ? (rating) => {
                        if (onRate) {
                          onRate(rating)
                            .then(() => {
                              setIsRating(false);
                              toast({
                                title: t("common.success"),
                                description: userRating 
                                  ? t("skatepark.heartRating.updated") 
                                  : t("skatepark.heartRating.success"),
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
                                description: error.message || t("skatepark.rating.errorRating"),
                                variant: "destructive"
                              });
                            });
                        }
                      } : undefined
                    }
                  />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      };
      

export default HeartRating;