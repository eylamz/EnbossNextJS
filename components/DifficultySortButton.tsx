// client/src/pages/skateparks/components/DifficultySortButton.tsx
import { Button } from '@/components/ui/button';
import { Icon } from '@/config/icons';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DifficultySortButtonProps {
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const DifficultySortButton = ({ isActive, onClick, className }: DifficultySortButtonProps) => {
  const { t } = useTranslation('skateparks');
  
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "warning" : "outline"}
            size="xl"
            onClick={onClick}
            className={`${isActive ? 'rounded-full' : ''} active:scale-95 transition-transform duration-100 ${className || ''}`}
          >
            <Icon 
              name="difficulty" 
              category="rating" 
              className={`w-5 h-5 ${isActive ? 'text-warning' : ''}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-center">
          {t('skateparks.sort.byDifficulty')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DifficultySortButton;