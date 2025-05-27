'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/client';
import { Icon } from '@/assets/icons/index';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { MouseEvent } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AmenitiesGridProps {
  amenities: Record<string, boolean>;
  closingYear?: number;
  amenityOrder: string[];
  locale: string;
  preloadedTranslations?: Record<string, { name: string; description: string }>;
}

export const AmenitiesGrid = ({ 
  amenities, 
  closingYear, 
  amenityOrder, 
  locale,
  preloadedTranslations 
}: AmenitiesGridProps) => {
  const { t, i18n } = useTranslation(locale, 'skateparks');
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(!preloadedTranslations);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Update translations when locale changes
  useEffect(() => {
    const updateTranslations = async () => {
      if (preloadedTranslations) {
        const newTranslations: Record<string, string> = {};
        for (const [key, value] of Object.entries(preloadedTranslations)) {
          newTranslations[key] = value.name;
          newTranslations[`${key}.description`] = value.description;
        }
        setTranslations(newTranslations);
        setIsLoading(false);
        setPageLoaded(true);
        return;
      }

      setIsLoading(true);
      const newTranslations: Record<string, string> = {};
      const validAmenityKeys = [
        'entryFee',
        'parking',
        'shade',
        'bathroom',
        'helmetRequired',
        'guard',
        'seating',
        'bombShelter',
        'scootersAllowed',
        'bikesAllowed',
        'noWax'
      ];

      for (const key of validAmenityKeys) {
        if (key in amenities) {
          newTranslations[key] = t(`amenities.${key}`);
          newTranslations[`${key}.description`] = t(`amenities.${key}.description`);
        }
      }

      setTranslations(newTranslations);
      setIsLoading(false);
      setPageLoaded(true);
    };

    updateTranslations();
  }, [locale, t, amenities, preloadedTranslations]);

  // Define valid amenity keys
  const validAmenityKeys = [
    'entryFee',
    'parking',
    'shade',
    'bathroom',
    'helmetRequired',
    'guard',
    'seating',
    'bombShelter',
    'scootersAllowed',
    'bikesAllowed',
    'noWax'
  ];

  // Filter and sort amenities based on validAmenityKeys
  const orderedAmenities = validAmenityKeys.filter(key => key in amenities);

  if (isLoading) {
    return (
      <div className="flex flex-wrap -mx-1">
        {validAmenityKeys.map((key) => (
          <div key={key} className="w-1/4 px-1 mb-2">
            <div className="rounded-lg p-2 h-full bg-black/[3%] dark:bg-black/[5%] dark:shadow-inner">
              <div className="text-center">
                <div className="mb-1.5">
                  <Icon 
                    name={key} 
                    category="amenity" 
                    className="w-5 h-5 mx-auto text-text-secondary dark:text-[#40535e]"
                  />
                </div>
                <div className="text-sm text-gray-400 dark:text-text-secondary line-through">
                  {preloadedTranslations?.[key]?.name || t(`amenities.${key}`)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap -mx-1">
      {orderedAmenities.map(key => {
        const value = amenities[key];
        const isAvailable = Boolean(value);
        const isParkClosed = Boolean(closingYear);
        
        return (
          <div key={key} className="w-1/4 px-1 mb-2">
            {isAvailable ? (
              <TooltipProvider>
                <Tooltip 
                  open={openTooltip === key}
                  onOpenChange={(open: boolean) => setOpenTooltip(open ? key : null)}
                >
                  <TooltipTrigger asChild>
                    <motion.div 
                      className={`rounded-lg p-2 h-full cursor-pointer ${
                        isParkClosed
                          ? 'bg-error/[8%] dark:bg-error-bg-dark/[15%]' 
                          : `transition-all duration-300 ${pageLoaded ? 'animate-fadeIn bg-brand-main/[8%] dark:bg-white/[2%]' : 'bg-black/[3%] dark:bg-black/[5%]'}` 
                      }`}
                      onClick={(e: MouseEvent) => setOpenTooltip(openTooltip === key ? null : key)}
                      whileTap={{ scale: 0.95 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 17 
                      }}
                    >
                      <div className="text-center">
                        <div className="mb-1.5">
                          <Icon 
                            name={key} 
                            category="amenity" 
                            className={`w-5 h-5 mx-auto ${
                              isParkClosed
                                ? 'text-error dark:text-error/80' 
                                : `transition-all duration-300 ${pageLoaded ? 'text-brand-700 dark:text-brand-main/80' : 'text-text-secondary dark:text-[#40535e]'}` 
                            }`} 
                          />
                        </div>
                        <div className={`text-sm font-normal ${
                          isParkClosed
                            ? 'text-text dark:text-text-dark' 
                            : `transition-all duration-300 ${pageLoaded ? 'text-text dark:text-text-dark' : 'text-gray-400 dark:text-text-secondary line-through'}` 
                        }`}>
                          {translations[key] || preloadedTranslations?.[key]?.name || t(`amenities.${key}`)}
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-[200px] text-center p-3 relative"
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        setOpenTooltip(null);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Close tooltip"
                    >
                      <Icon 
                        name="close" 
                        category="navigation" 
                        className="w-3 h-3 text-gray-500 dark:text-gray-400"
                      />
                    </button>
                    <p className="text-sm pr-4">
                      {translations[`${key}.description`] || preloadedTranslations?.[key]?.description || t(`amenities.${key}.description`)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="rounded-lg p-2 h-full bg-black/[3%] dark:bg-black/[5%] dark:shadow-inner">
                <div className="text-center">
                  <div className="mb-1.5">
                    <Icon 
                      name={key} 
                      category="amenity" 
                      className="w-5 h-5 mx-auto text-text-secondary dark:text-[#40535e]"
                    />
                  </div>
                  <div className="text-sm text-gray-400 dark:text-text-secondary line-through">
                    {translations[key] || preloadedTranslations?.[key]?.name || t(`amenities.${key}`)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 