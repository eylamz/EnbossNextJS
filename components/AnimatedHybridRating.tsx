// client/src/pages/skateparks/components/AnimatedHybridRating.tsx (Updated)
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
import { motion } from 'framer-motion';

export type RatingType = 'heart' | 'cleanliness' | 'maintenance' | 'difficulty';

interface RatingProps {
  type: RatingType;
  rating: number;
  totalVotes: number;
  onRate: (rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
  hideVotesCount?: boolean;
}

let activeDialogId: string | null = null;

// A unique ID generator for each rating component instance
const getUniqueDialogId = (() => {
  let id = 0;
  return () => `rating-dialog-${id++}`;
})();


// Helper function to determine icon based on rating type
const getRatingIcon = (type: RatingType) => {
  switch(type) {
    case 'heart':
      return { name: 'heartBold', category: 'ui' as const };
    case 'cleanliness':
      return { name: 'cleanliness', category: 'rating' as const };
    case 'maintenance':
      return { name: 'maintenance', category: 'rating' as const };
    case 'difficulty':
      return { name: 'difficultyBold', category: 'rating' as const };
    default:
      return { name: 'heart', category: 'ui' as const };
  }
};

// Helper function to get color based on rating type
const getRatingColor = (type: RatingType, isRated: boolean) => {
  if (!isRated) return "text-card-icon dark:text-card-icon-dark";
  
  switch(type) {
    case 'heart':
      return "text-error fill-error dark:text-error-dark dark:fill-error-dark";
    case 'cleanliness':
      return "text-success fill-success dark:text-success-dark dark:fill-success-dark";
    case 'maintenance':
      return "text-info fill-info dark:text-info-dark dark:fill-info-dark";
    case 'difficulty':
      return "text-warning-bg fill-warning-bg dark:text-warning-bg-dark dark:fill-warning-bg-dark";
    default:
      return "text-text-secondary/30 dark:text-text-secondary-dark/70";
  }
};

// Animation variants for the dialog - FASTER NOW
const dialogVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 400,
      damping: 20,
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { 
      duration: 0.15,
      ease: "easeOut" 
    }
  }
};

// Animation variants for the icons - FASTER NOW
const iconVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.15,
    transition: { 
      type: "spring", 
      stiffness: 500,
      damping: 8,
      duration: 0.15
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.08
    }
  },
  selected: { 
    scale: 1.1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 12,
      duration: 0.15
    }
  }
};

// Animation for stars when rating is submitted - FASTER NOW
const successAnimation = {
  initial: { scale: 1, y: 0 },
  success: (i: number) => ({
    scale: [1, 1.3, 1],
    y: [0, -10, 0],
    transition: { 
      delay: i * 0.05,
      duration: 0.25
    }
  })
}

const AnimatedHybridRating = ({
  type,
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete,
  hideVotesCount = false
}: RatingProps) => {
  const dialogIdRef = useRef<string>(getUniqueDialogId());
  const [isRating, setIsRating] = useState(false);
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(userRating);
  const { t } = useTranslation(['skateparks', 'common']);
  const { toast } = useToast();
  const iconInfo = getRatingIcon(type);
  const iconColor = getRatingColor(type, !!userRating);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect if device is touch-capable on mount
  useEffect(() => {
    // Check if the device has touch capability
    const touchCapable = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        (navigator as any).msMaxTouchPoints > 0;
                        
    // Check if we're on a mobile device using userAgent
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Only set as touch device if both touch capable AND on a mobile device
    setIsTouchDevice(touchCapable && isMobileDevice);
    
    // Add mouse movement listener to detect mouse usage
    const handleMouseMove = () => {
      setIsTouchDevice(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  


    // Add an effect to handle dialog coordination
    useEffect(() => {
      // When this dialog opens, set it as the active dialog and close others
      if (isDialogOpen) {
        // If there's already an active dialog and it's not this one, close it using a custom event
        if (activeDialogId && activeDialogId !== dialogIdRef.current) {
          // Dispatch a custom event to close other dialogs
          const closeEvent = new CustomEvent('close-rating-dialog', { 
            detail: { activatedId: dialogIdRef.current } 
          });
          document.dispatchEvent(closeEvent);
        }
        
        // Set this as the active dialog
        activeDialogId = dialogIdRef.current;
      } else if (activeDialogId === dialogIdRef.current) {
        // If this dialog is closing and it was the active one, clear the active dialog
        activeDialogId = null;
      }
      
      // Listen for close events from other dialogs
      const handleCloseDialog = (e: Event) => {
        const customEvent = e as CustomEvent;
        const activatedId = customEvent.detail?.activatedId;
        
        // Only close if we're not the one being activated
        if (activatedId !== dialogIdRef.current) {
          setIsDialogOpen(false);
        }
      };
      
      // Add event listener
      document.addEventListener('close-rating-dialog', handleCloseDialog);
      
      // Cleanup
      return () => {
        document.removeEventListener('close-rating-dialog', handleCloseDialog);
        
        // If this component is unmounting and it was the active dialog, clear active dialog
        if (activeDialogId === dialogIdRef.current) {
          activeDialogId = null;
        }
      };
    }, [isDialogOpen]);

    

  // Reset selected value when user rating changes
  useEffect(() => {
    setSelectedValue(userRating);
  }, [userRating]);
  
  // Function to handle rating selection
  const handleRating = async (value: number) => {
    if (readonly || isRating) return;
    
    setSelectedValue(value);
    setIsRating(true);
    
    try {
      await onRate(value);
      // Trigger success animation
      setAnimateSuccess(true);
      
      setTimeout(() => {
        setAnimateSuccess(false);
        setIsDialogOpen(false);
        setIsHoverCardOpen(false);
      }, 400);

      toast({
        title: t(`skateparks.rating.successTitle`),
        description: userRating 
          ? t(`skateparks.rating.updated`)
          : t(`skateparks.rating.success`),
        variant: "success"
      });
      
      if (onVoteComplete) {
        onVoteComplete();
      }
    } catch (error) {
      toast({
        title: t("common:common.error"),
        description: (error as Error)?.message || t(`skateparks.specialtyRating.${type}.error`),
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
        return t('skateparks.rating.overall');
      case 'cleanliness':
        return t('skateparks.rating.cleanliness');
      case 'maintenance':
        return t('skateparks.rating.maintenance');
      case 'difficulty':
        return t('skateparks.rating.difficulty');
      default:
        return t('skateparks.rating.overall');
    }
  };

  // Handle click on the rating trigger
const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Add this to ensure all clicks are captured
    
    if (isTouchDevice) {
      // For touch devices, close any other dialogs first via custom event
      if (activeDialogId && activeDialogId !== dialogIdRef.current) {
        const closeEvent = new CustomEvent('close-rating-dialog', { 
          detail: { activatedId: dialogIdRef.current } 
        });
        document.dispatchEvent(closeEvent);
      }
      
      // Then open this dialog after a brief delay to allow the others to close
      setTimeout(() => {
        setIsDialogOpen(true);
      }, 10);
    } else {
      // For non-touch devices, toggle the hover card
      setIsHoverCardOpen(!isHoverCardOpen);
    }
  };

  // Calculate size for progressive sizing of icons (1=smallest, 5=largest)
  const getIconSize = (starValue: number) => {
    // Base sizes (in pixels) converted to Tailwind classes
    const sizes = {
      1: "w-5 h-5", // Smallest
      2: "w-6 h-6",
      3: "w-7 h-7",
      4: "w-8 h-8",
      5: "w-9 h-9"  // Largest
    };
    
    return sizes[starValue as keyof typeof sizes];
  };

  // Rating Stars Component shared by both dialog and hover card
  const RatingStars = ({ 
    value, 
    onSelect,
    readonly: isReadonly = false
  }: { 
    value: number, 
    onSelect: (rating: number) => void,
    readonly?: boolean
  }) => {
    const [hoverValue, setHoverValue] = useState(0);
    
    // Reset hover value when mouse leaves the rating container
    const handleMouseLeave = () => {
      setHoverValue(0);
    };
    
    // Set hover value when mouse enters a rating button
    const handleMouseEnter = (starValue: number) => {
      if (!isReadonly) {
        setHoverValue(starValue);
      }
    };
    
    return (
      <div className="flex flex-col items-center gap-3" onMouseLeave={handleMouseLeave}>
        <div className="flex gap-2 items-center justify-center">
          {isRating ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6 rounded-full border-3 border-t-transparent border-brand-400"
              style={{ borderWidth: '3px' }}
            />
          ) : (
            [1, 2, 3, 4, 5].map((starValue) => {
              // Determine if this icon should be colored (based on hover state or selected state)
              const isActive = hoverValue >= starValue || (!hoverValue && selectedValue && selectedValue >= starValue);
              const color = getRatingColor(type, true); // Get the active color for the rating type
              return (
                <motion.div
                  key={starValue}
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  animate={
                    animateSuccess && starValue <= value 
                      ? successAnimation.success(starValue) 
                      : starValue <= (selectedValue || 0) 
                        ? "selected" 
                        : "initial"
                  }
                  custom={starValue}
                >
                  <button
                    className={cn(
                      "p-1 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full",
                      isTouchDevice ? "p-2" : "p-1"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(starValue);
                    }}
                    onMouseEnter={() => handleMouseEnter(starValue)}
                    disabled={isReadonly || isRating}
                    tabIndex={-1}
                  >
                    <Icon
                      {...iconInfo}
                      className={cn(
                        getIconSize(starValue), // Progressive sizing based on value
                        isActive ? color : "text-text-secondary/30 dark:text-text-secondary-dark/80",
                        "transition-colors duration-200",
                      )}
                    />
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
        
        {/* Display total votes count - moved below the icons */}
        <span className="text-xs text-text/70 dark:text-text-dark/80 mt-1">
          {totalVotes > 0 
            ? t('skateparks.rating.totalVotes', { count: totalVotes }) 
            : t('skateparks.rating.noVotes')}
        </span>
      </div>
    );
  };
  
  // For touch devices - Dialog version
  if (isTouchDevice) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div 
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
            className="flex items-center gap-1 cursor-pointer rating-component p-2 -m-2"
            onClick={handleTriggerClick}
            style={{ touchAction: 'manipulation' }}
            tabIndex={-1}
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
             {/* Display totalVotes in parentheses only if not hidden */}
              {!hideVotesCount && (
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark/90">
                  ({totalVotes})
                </span>
              )}
            </motion.div>

        </DialogTrigger>
        <DialogContent className="p-0 border-none bg-transparent shadow-none">
          <motion.div 
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-background/95 dark:bg-background-dark/95 backdrop-blur-xl p-5 rounded-xl bord shadow-lg"
          >
            <div className="space-y-3">
              <motion.h3 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.15 } }}
                className="text-center font-medium text-lg"
              >
                {getRatingTypeName()}
              </motion.h3>
              
              {userRating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  className="flex items-center justify-center gap-1 mb-2 text-center"
                >
                  <Icon 
                    {...iconInfo}
                    className={cn(
                      "w-4 h-4",
                      iconColor
                    )} 
                  />
                  <span className="text-sm font-medium">
                    {t('skateparks.rating.alreadyVoted')}
                  </span>
                </motion.div>
              )}
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.15 } }}
                className="flex justify-center items-center gap-2 py-2"
              >
                <RatingStars 
                  value={selectedValue || 0} 
                  onSelect={handleRating}
                  readonly={readonly} 
                />
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // For non-touch devices - HoverCard version with INSTANT activation
  return (
    <div ref={containerRef} className="rating-component">
      <HoverCard
        open={isHoverCardOpen}
        onOpenChange={setIsHoverCardOpen}
        openDelay={10}
        closeDelay={100}
      >
        <HoverCardTrigger asChild>
          <motion.div 
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
            className="flex items-center gap-1 cursor-pointer p1 -m-1" 
            onClick={handleTriggerClick}
            tabIndex={-1}
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
  {/* Display totalVotes in parentheses only if not hidden */}
  {!hideVotesCount && (
    <span className="text-sm text-text-secondary dark:text-text-secondary-dark/90">
      ({totalVotes})
    </span>
  )}
</motion.div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-fit p-3" 
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHoverCardOpen(true)}
          onMouseLeave={() => setIsHoverCardOpen(false)}
        >
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
            className="space-y-2"
          >
            {userRating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.1 } }}
                className="flex items-center justify-center gap-1 mb-2 -ml-5 rtl:ml-0 rtl:-mr-6"
              >
                <Icon 
                  {...iconInfo}
                  className={cn(
                    "w-4 h-4",
                    iconColor
                  )} 
                />
                <span className="text-xs font-medium">
                  {t('skateparks.rating.alreadyVoted')}
                </span>
              </motion.div>
            )}
            
            <div className="flex items-center justify-center">
              <RatingStars 
                value={selectedValue || 0} 
                onSelect={handleRating}
                readonly={readonly} 
              />
            </div>
          </motion.div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default AnimatedHybridRating;