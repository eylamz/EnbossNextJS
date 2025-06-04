'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/lib/i18n/client';
import { Icon } from '@/assets/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

const amenityOptions = [
  { key: 'parking', label: 'amenities.parking' },
  { key: 'entryFee', label: 'amenities.entryFee' },
  { key: 'bathroom', label: 'amenities.bathroom' },
  { key: 'shade', label: 'amenities.shade' },
  { key: 'seating', label: 'amenities.seating' },
  { key: 'noWax', label: 'amenities.noWax' },
  { key: 'nearbyRestaurants', label: 'amenities.nearbyRestaurants' },
  { key: 'guard', label: 'amenities.guard' },
  { key: 'helmetRequired', label: 'amenities.helmetRequired' },
  { key: 'scootersAllowed', label: 'amenities.scootersAllowed' },
  { key: 'bikesAllowed', label: 'amenities.bikesAllowed' },
  { key: 'bombShelter', label: 'amenities.bombShelter' },
];

interface AmenitiesButtonProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
  locale: string;
}

const AmenitiesButton = ({ selectedAmenities, onAmenitiesChange, className, style, locale }: AmenitiesButtonProps) => {
  const { t: tSkateparks } = useTranslation(locale, 'skateparks');
  const { t: tCommon } = useTranslation(locale, 'common');
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant={isActive ? "info" : "outline"}
                size="xl"
                className={`relative ${isActive ? '' : ''} active:scale-95 transition-all duration-200 ${className || ''}`}
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
            {tSkateparks('amenities.filterBy')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-full max-w-sm p-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between h-[32px]">
            <h4 className="font-medium">{tSkateparks('amenities.filterBy')}</h4>
            {selectedAmenities.length > 0 && (
              <Button
                variant="error"
                size="sm"
                onClick={clearAll}
                className="h-8 px-2 text-xs flex flex-row-reverse gap-1 items-center"
              >
                {tCommon('clear')}
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
                {tSkateparks(amenity.label)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AmenitiesButton; 