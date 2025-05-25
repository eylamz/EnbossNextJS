// client/src/pages/skateparks/components/RatingSortButton.tsx
import { Button } from '@/components/ui/button';
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
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
            className={`${isActive ? 'rounded-full' : ''}  active:scale-95 transition-transform duration-100 ${className || ''}`}
          >
            <Icon 
              name="heart" 
              category="ui" 
              className={`w-5 h-5 ${isActive ? ' text-[#f41f57]' : ''}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-center">
          {t('skateparks.sort.byRating')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RatingSortButton;