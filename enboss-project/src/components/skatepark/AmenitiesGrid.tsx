'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Icon } from '@/assets/icons/index';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { MouseEvent } from 'react';

interface AmenitiesGridProps {
  amenities: Record<string, boolean>;
  closingYear?: number;
  amenityOrder: string[];
}

export const AmenitiesGrid = ({ amenities, closingYear, amenityOrder }: AmenitiesGridProps) => {
  const { t } = useTranslation();
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap -mx-1">
      {amenityOrder
        .filter(key => key in amenities)
        .map(key => {
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
                            : 'bg-brand-main/[8%] dark:bg-white/[2%]' 
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
                                  : 'text-brand-700 dark:text-brand-main/80' 
                              }`} 
                            />
                          </div>
                          <div className={`text-xs font-thin ${
                            isParkClosed
                              ? 'text-text dark:text-text-dark' 
                              : 'text-text dark:text-text-dark' 
                          }`}>
                            {t(`skateparks.amenities.${key}`)}
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
                      <p className="text-sm pr-4">{t(`skateparks.amenities.${key}.description`)}</p>
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
                        className="w-5 h-5 mx-auto text-gray-400 dark:text-[#40535e]"
                      />
                    </div>
                    <div className="text-xs font-thin text-gray-400 dark:text-text-dark/50 line-through">
                      {t(`skateparks.amenities.${key}`)}
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