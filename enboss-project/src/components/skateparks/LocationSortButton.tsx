'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/assets/icons/index';
import { useTranslation } from '@/lib/i18n/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

interface LocationSortButtonProps {
  isActive: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  locale: string;
}

const LocationSortButton = ({ isActive, onClick, className, style, locale }: LocationSortButtonProps) => {
  const { t } = useTranslation(locale, 'skateparks');
  
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "brand" : "outline"}
            size="xl"
            onClick={onClick}
            className={`${isActive ? 'rounded-full' : ''} ${className || ''}`}
          >
            <Icon 
              name={isActive ? "location" : "locationOff"}
              category="navigation" 
              className="w-5 h-5"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-center">
          {t('sort.byDistance')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LocationSortButton; 