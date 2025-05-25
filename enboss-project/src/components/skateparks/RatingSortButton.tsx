'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/assets/icons';
import { useTranslation } from '@/lib/i18n/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RatingSortButtonProps {
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const RatingSortButton = ({ isActive, onClick, className }: RatingSortButtonProps) => {
  const { t } = useTranslation('skateparks');
  
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "error" : "outline"}
            size="xl"
            onClick={onClick}
            className={`${isActive ? 'rounded-full' : ''} active:scale-95 transition-transform duration-100 ${className || ''}`}
          >
            <Icon 
              name="heart" 
              category="ui" 
              className={`w-5 h-5 ${isActive ? 'text-[#f41f57]' : ''}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-center">
          {t('sort.byRating')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RatingSortButton; 