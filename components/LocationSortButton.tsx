// client/src/pages/skateparks/components/LocationSortButton.tsx
import { Button } from '@/components/ui/button';
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationSortButtonProps {
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const LocationSortButton = ({ isActive, onClick, className }: LocationSortButtonProps) => {
  const { t } = useTranslation('skateparks');
  
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
          {t('skateparks.sort.byDistance')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LocationSortButton;