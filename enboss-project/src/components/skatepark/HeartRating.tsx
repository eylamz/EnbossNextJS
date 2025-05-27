'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { Icon } from '@/assets/icons';
import { useTranslation } from '@/lib/i18n/client';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface HeartRatingProps {
  rating: number;
  totalVotes: number;
  onRate: (rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
  hideVotesCount?: boolean;
  skateparkId: string;
}

let activeDialogId: string | null = null;

// A unique ID generator for each rating component instance
const getUniqueDialogId = (() => {
  let id = 0;
  return () => `rating-dialog-${id++}`;
})();

// Animation variants for the dialog
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

// Animation variants for the icons
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

// Animation for hearts when rating is submitted
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

const HeartRating = ({
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete,
  hideVotesCount = false,
  skateparkId
}: HeartRatingProps) => {
  const dialogIdRef = useRef<string>(getUniqueDialogId());
  const [isRating, setIsRating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [hoverValue, setHoverValue] = useState(0);
  const { t } = useTranslation('skateparks', 'common');
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect if device is touch-capable on mount
  useEffect(() => {
    const touchCapable = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        (navigator as any).msMaxTouchPoints > 0;
                        
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    setIsTouchDevice(touchCapable && isMobileDevice);
    
    const handleMouseMove = () => {
      setIsTouchDevice(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Function to get user's previous rating from localStorage
  const getPreviousRating = useCallback(() => {
    if (typeof window === 'undefined' || !skateparkId) return null;
    try {
      const ratings = JSON.parse(localStorage.getItem('skateparkRatings') || '{}');
      return ratings[skateparkId] || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }, [skateparkId]);

  // Function to save user's rating to localStorage
  const saveRating = useCallback((rating: number) => {
    if (typeof window === 'undefined' || !skateparkId) return;
    try {
      const ratings = JSON.parse(localStorage.getItem('skateparkRatings') || '{}');
      ratings[skateparkId] = rating;
      localStorage.setItem('skateparkRatings', JSON.stringify(ratings));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [skateparkId]);

  // Initialize selectedValue from localStorage on mount
  useEffect(() => {
    if (!skateparkId) return;
    const storedRating = getPreviousRating();
    setSelectedValue(storedRating);
  }, [getPreviousRating, skateparkId]);

  // Function to handle rating selection
  const handleRating = useCallback(async (value: number) => {
    if (readonly || isRating || !skateparkId) return;
    
    try {
      setIsRating(true);
      
      // Ensure value is a valid number
      if (typeof value !== 'number' || isNaN(value) || value < 1 || value > 5) {
        throw new Error('Invalid rating value');
      }

      // Get previous rating if any
      const previousRating = getPreviousRating();

      // Call the server action with the rating value
      await onRate(value);
      
      // Save the new rating to localStorage
      saveRating(value);
      
      // Update UI
      setSelectedValue(value);
      setAnimateSuccess(true);
      
      setTimeout(() => {
        setAnimateSuccess(false);
        setIsDialogOpen(false);
      }, 400);

      toast({
        title: t('rating.successTitle'),
        description: previousRating !== null 
          ? t('rating.updated')
          : t('rating.success'),
        variant: "success"
      });
      
      if (onVoteComplete) {
        onVoteComplete();
      }
    } catch (error) {
      console.error('Rating error:', error);
      toast({
        title: t('common:common.error'),
        description: t('rating.error'),
        variant: "destructive"
      });
    } finally {
      setIsRating(false);
    }
  }, [readonly, isRating, onRate, onVoteComplete, t, toast, getPreviousRating, saveRating, skateparkId]);

  const handleMouseEnter = useCallback((value: number) => {
    if (!readonly) {
      setHoverValue(value);
    }
  }, [readonly]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(0);
  }, []);

  const getIconSize = useCallback((value: number) => {
    const sizes = {
      1: "w-5 h-5",
      2: "w-6 h-6",
      3: "w-7 h-7",
      4: "w-8 h-8",
      5: "w-9 h-9"
    };
    return sizes[value as keyof typeof sizes];
  }, []);

  const renderHearts = useCallback(() => {
    if (isRating) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full border-3 border-t-transparent border-brand-400"
          style={{ borderWidth: '3px' }}
        />
      );
    }

    return [1, 2, 3, 4, 5].map((heartValue) => {
      const isActive = hoverValue >= heartValue || (!hoverValue && selectedValue && selectedValue >= heartValue);
      return (
        <motion.div
          key={heartValue}
          variants={iconVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={
            animateSuccess && heartValue <= rating 
              ? successAnimation.success(heartValue) 
              : heartValue <= (selectedValue || 0) 
                ? "selected" 
                : "initial"
          }
          custom={heartValue}
          onHoverStart={() => handleMouseEnter(heartValue)}
          onHoverEnd={handleMouseLeave}
        >
          <button
            className={cn(
              "p-1 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full",
              isTouchDevice ? "p-2" : "p-1"
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleRating(heartValue);
            }}
            disabled={readonly || isRating}
            tabIndex={-1}
          >
            <Icon
              name="heartBold"
              category="ui"
              className={cn(
                getIconSize(heartValue),
                isActive ? "text-error fill-error dark:text-error-dark dark:fill-error-dark" : "text-text-secondary/30 dark:text-text-secondary-dark/80",
                "transition-colors duration-200",
              )}
            />
          </button>
        </motion.div>
      );
    });
  }, [isRating, hoverValue, selectedValue, animateSuccess, rating, isTouchDevice, readonly, handleRating, handleMouseEnter, handleMouseLeave, getIconSize]);

  // For touch devices - Dialog version
  if (isTouchDevice) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div 
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
            className="flex items-center gap-1 cursor-pointer rating-component p-2 -m-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsDialogOpen(true);
            }}
            style={{ touchAction: 'manipulation' }}
            tabIndex={-1}
          >
            <span className="text-sm font-medium">
              {rating.toFixed(1)}
            </span>
            <Icon 
              name="heartBold"
              category="ui"
              className={cn(
                "w-5 h-5",
                selectedValue ? "text-error fill-error dark:text-error-dark dark:fill-error-dark" : "text-text-secondary/30 dark:text-text-secondary-dark/80"
              )} 
            />
            {!hideVotesCount && (
              <span className="text-sm text-text-secondary dark:text-text-secondary-dark/90">
                ({totalVotes})
              </span>
            )}
          </motion.div>
        </DialogTrigger>
        <DialogContent>
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
                {t('rating.overall')}
              </motion.h3>
              
              {selectedValue && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  className="flex items-center justify-center gap-1 mb-2 text-center"
                >
                  <Icon 
                    name="heartBold"
                    category="ui"
                    className={cn(
                      "w-4 h-4",
                      "text-error fill-error dark:text-error-dark dark:fill-error-dark"
                    )} 
                  />
                  <span className="text-sm font-medium">
                    {t('rating.alreadyVoted')}
                  </span>
                </motion.div>
              )}
              

              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.15 } }}
                className="flex justify-center items-center gap-2 py-2"
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex gap-2 items-center justify-center">
                  {renderHearts()}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                className="flex items-center justify-center gap-1 mb-2 text-center"
              >
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark/90">
                  {totalVotes} {t('rating.totalVotes')}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // For non-touch devices - HoverCard version
  return (
    <div ref={containerRef} className="rating-component">
      <HoverCard>
        <HoverCardTrigger asChild>
          <motion.div 
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
            className="flex items-center gap-1 cursor-pointer px-4 -m-1" 
            tabIndex={-1}
          >
            <span className="text-sm font-medium">
              {rating.toFixed(1)}
            </span>
            <Icon 
              name="heartBold"
              category="ui"
              className={cn(
                "w-5 h-5",
                selectedValue ? "text-error fill-error dark:text-error-dark dark:fill-error-dark" : "text-text-secondary/30 dark:text-text-secondary-dark/80"
              )} 
            />
            {!hideVotesCount && (
              <span className="text-sm text-text-secondary dark:text-text-secondary-dark/90">
                ({totalVotes})
              </span>
            )}
          </motion.div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-fit p-3" 
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
            className="space-y-2"
          >
            {selectedValue && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.1 } }}
                className="flex items-center justify-center gap-1 mb-2 -ml-5 rtl:ml-0 rtl:-mr-6"
              >
                <Icon 
                  name="heartBold"
                  category="ui"
                  className={cn(
                    "w-4 h-4",
                    "text-error fill-error dark:text-error-dark dark:fill-error-dark"
                  )} 
                />
                <span className="text-xs font-medium">
                  {t('rating.alreadyVoted')}
                </span>
              </motion.div>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1 } }}
              className="flex items-center justify-center gap-1 mb-2 -ml-5 rtl:ml-0 rtl:-mr-6"
            >
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark/90">
                {totalVotes} {t('rating.votes')}
              </span>
            </motion.div>
            
            <div className="flex items-center justify-center">
              <div className="flex gap-2 items-center justify-center">
                {renderHearts()}
              </div>
            </div>
          </motion.div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default HeartRating; 