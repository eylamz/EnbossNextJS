// client/src/pages/skateparks/components/AmenitiesButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/config/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const amenityOptions = [
  { key: 'parking', label: 'Parking' },
  { key: 'entryFee', label: 'Entry Fee' },

  { key: 'bathroom', label: 'Bathroom' },
  { key: 'shade', label: 'Shade' },
  { key: 'seating', label: 'Seating' },
  { key: 'noWax', label: 'No Wax Allowed' },

  { key: 'guard', label: 'Guard' },
  { key: 'helmetRequired', label: 'Helmet Required' },
  { key: 'scootersAllowed', label: 'Scooters Allowed' },
  { key: 'bikesAllowed', label: 'Bikes Allowed' },
  { key: 'bombShelter', label: 'Bomb Shelter' },

];

interface AmenitiesButtonProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  className?: string;
}

const AmenitiesButton = ({ selectedAmenities, onAmenitiesChange, className }: AmenitiesButtonProps) => {
  const { t } = useTranslation('skateparks');
  const [isOpen, setIsOpen] = useState(false);

  const isActive = selectedAmenities.length > 0;

  const toggleAmenity = (amenityKey: string) => {
    if (selectedAmenities.includes(amenityKey)) {
      onAmenitiesChange(selectedAmenities.filter(key => key !== amenityKey));
    } else {
      onAmenitiesChange([...selectedAmenities, amenityKey]);
    }
  };

  const clearAll = () => {
    onAmenitiesChange([]);
    setIsOpen(false);
  };

  // For AmenitiesButton, we need to be careful with the Tooltip + Popover combination
  // We'll only show the tooltip when the popover is closed
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant={isActive ? "info" : "outline"}
                size="xl"
                className={`relative ${isActive ? '' : ''} active:scale-95 transition-transform duration-100 ${className || ''}`}
              >
                <Icon 
                  name="filter" 
                  category="navigation" 
                  className="w-5 h-5"
                />
                {isActive && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] p-0 flex items-center justify-center text-[10px]"
                  >
                    {selectedAmenities.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-center">
            {t('skateparks.sort.byAmenities')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-full max-w-sm p-2 ">
        <div className="space-y-2 ">
          <div className="flex items-center justify-between h-[32px]">
            <h4 className="font-medium">{t('skateparks.sort.byAmenities')}</h4>
            {selectedAmenities.length > 0 && (
              <Button
                variant="error"
                size="sm"
                onClick={clearAll}
                className="h-8 px-2 text-xs flex flex-row-reverse gap-1 items-center"
              >
                {t('common:common.clear')}
                <Icon 
                  name="trash" 
                  category="action" 
                  className="h-3 w-3"
                />
              </Button>
            )}
          </div>
          <Separator className="bg-text-secondary" />
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map((amenity) => (
              <Button
                key={amenity.key}
                variant={selectedAmenities.includes(amenity.key) ? "info" : "ghost2"}
                size="sm"
                className={`min-w-[100px] justify-start text-nowrap ${selectedAmenities.includes(amenity.key) ? '' : 'text-text-secondary'}`}
                onClick={() => toggleAmenity(amenity.key)}
              >
                <Icon 
                  name={amenity.key}
                  category="amenity"
                  className={`w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 transition-all duration-300 ${selectedAmenities.includes(amenity.key) ? 'text-info dark:text-info-dark' : 'text-text-secondary dark:text-text-secondary-dark'}`}
                />
                {t(`skateparks.amenities.${amenity.key}`)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AmenitiesButton;