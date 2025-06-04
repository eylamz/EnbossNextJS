'use client';

// client/src/pages/skateparks/components/FormattedHours.tsx

import * as React from 'react';
import { Icon } from '@/assets/icons/index';
import { IOperatingHours, ILightingHours } from '@/models/Skatepark';
import { 
  is24HourSchedule, 
  groupDaysWithSameHours, 
  formatDayRanges
} from '@/utils/hoursFormatter';
import { TextBadge } from '@/components/ui/TextVariants';

interface FormattedHoursProps {
  operatingHours: IOperatingHours;
  lightingHours?: ILightingHours;
  className?: string;
  closingYear?: number | null;
  locale: string;
  preloadedTranslations: {
    openingHours: string;
    lightingHours: string;
    is24Hours: string;
    isPermanentlyClosed: string;
    notApplicable: string;
    allWeek: string;
    openAllDay: string;
    satAndHolidays: string;
    holidays: string;
    closed: string;
    noLighting: string;
    fromSunsetTill: string;
    days: string;
    to: string;
    dayNames: Record<string, string>;
    shortDayNames: Record<string, string>;
  };
}

// Helper function to format lighting hours
function formatLightingHours(lightingHours: ILightingHours | undefined, t: FormattedHoursProps['preloadedTranslations']): string {
  if (!lightingHours) {
    return t.noLighting;
  }

  // Special case for "almost 24 hours" (00:02-23:58) - treat as no lighting
  if (lightingHours.startTime === '00:02' && lightingHours.endTime === '23:58') {
    return t.noLighting;
  }

  // Special case for sunset - either the literal string 'sunset' or the encoded value '00:01'
  if (lightingHours.startTime === '00:01' || lightingHours.startTime === 'sunset') {
    return `${t.fromSunsetTill} ${lightingHours.endTime}.`;
  }

  // Normal hours format
  return `${lightingHours.startTime} - ${lightingHours.endTime}`;
}

const FormattedHours: React.FC<FormattedHoursProps> = ({ 
  operatingHours, 
  lightingHours,
  className = '',
  closingYear,
  locale,
  preloadedTranslations: t
}) => {
  // Check if the park is permanently closed based on closingYear
  const isPermanentlyClosed = Boolean(closingYear);
  
  // If the park is closed (has a closing year), always show the closed badge
  // regardless of operating hours
  if (isPermanentlyClosed) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Header with closed badge */}
        <div className="flex items-center gap-2 text-text dark:text-[#f2f2f2] transition-all duration-200">
          <Icon name="clock" category="ui" className="w-5 h-5 " />
          <span className="font-semibold text-lg">{t.openingHours}  :</span>
          <TextBadge 
            variant='error'
            className="font-semibold text-sm border border-b-[3px] bg-error-bg dark:bg-error-bg-dark/50 border-error dark:border-error-dark/60 text-error"
          >
            {t.isPermanentlyClosed}
          </TextBadge>
        </div>
        
        {/* Still show lighting hours for historical reference */}
        <div className="flex items-star gap-2">
          <div className="flex items-center gap-2">
            <Icon name="sunset" category="ui" className="w-5 h-5 text-gray-500" />
            <span className="font-semibold">{t.lightingHours}: </span>
          </div>
         
          <div className="">
            <span className="text-gray-500 min-w-[180px] sm:min-w-auto">
              {t.notApplicable}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if it's a 24/7 operation
  const is24Hours = is24HourSchedule(operatingHours);
  
  if (is24Hours) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* 24/7 Header */}
        <div className="flex items-center gap-2">
          <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-[#f2f2f2] transition-all duration-200" />
          <span className="font-semibold text-lg">{t.openingHours}: </span>
          <TextBadge 
            variant='brand'
            className="font-semibold text-sm border border-b-[3px] border-brand-color text-brand-color"
          >
            {t.is24Hours}
          </TextBadge>
        </div>
        
        {/* ALWAYS show lighting hours for 24/7 parks */}
        <div className="flex items-star gap-2">
          <div className="flex items-center gap-2">
            <Icon name="sunset" category="ui" className={`w-5 h-5 ${lightingHours ? 'text-yellow-600/90' : 'text-gray-500'}`} />
            <span className="font-semibold">{t.lightingHours}: </span>
          </div>
       
          <div className="">
            <span className={!lightingHours ? 'text-gray-500' : 'min-w-[180px] sm:min-w-auto'}>
              {lightingHours 
                ? formatLightingHours(lightingHours, t)
                : t.notApplicable}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // Group days with the same opening hours
  const { groupedDays, hoursByGroup, allDaysIdentical, allNonHolidayDaysIdentical } = groupDaysWithSameHours(operatingHours);
  
  // Sort scheduleKeys to ensure Friday and Saturday/Holidays are displayed last
  const sortScheduleKeys = (keys: string[]): string[] => {
    // Helper function to get display order
    const getDisplayOrder = (key: string): number => {
      if (key.startsWith('friday-')) return 90;
      if (key.startsWith('saturday-') || key.startsWith('weekend-')) return 95;
      if (key.startsWith('holiday-')) return 99;
      return 0; // Default for weekdays
    };
    
    return [...keys].sort((a, b) => getDisplayOrder(a) - getDisplayOrder(b));
  };

  // If all days have identical hours, show a simplified display
  if (allDaysIdentical) {
    const scheduleKey = Object.keys(groupedDays)[0];
    const schedule = hoursByGroup[scheduleKey];
    
    // If it's a 24/7 park, show the 24/7 badge
    if (scheduleKey === '24hours') {
      return (
        <div className={`space-y-2 ${className}`}>
          {/* 24/7 Header */}
          <div className="flex items-center gap-2">
            <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-[#f2f2f2] transition-all duration-200" />
            <span className="font-semibold text-lg">{t.openingHours}: </span>
            <TextBadge 
              variant='brand'
              className="font-semibold text-sm border border-b-[3px] border-brand-text text-brand-text dark:border-brand-main dark:text-brand-main"
            >
              {t.is24Hours}
            </TextBadge>
          </div>
          
          {/* ALWAYS show lighting hours for 24/7 parks */}
          <div className="flex items-star gap-2">
            <div className="flex items-center gap-2">
              <Icon name="sunset" category="ui" className={`w-5 h-5 ${lightingHours ? 'text-yellow-600/90' : 'text-gray-500'}`} />
              <span className="font-semibold">{t.lightingHours}: </span>
            </div>
           
            <div className="">
              <span className={!lightingHours ? 'text-gray-500' : 'min-w-[180px] sm:min-w-auto'}>
                {lightingHours 
                  ? formatLightingHours(lightingHours, t)
                  : t.notApplicable}
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-text-secondary-dark transition-all duration-200" />
          <span className="font-semibold text-lg">{t.openingHours}</span>
        </div>
        
        {/* All week hours */}
        <div className="flex items-start gap-1">
          <span className="font-semibold dark:text-[#f2f2f2] mr-2">
            {t.allWeek} :
          </span>
          
          <span className={schedule.isOpen ? 'text-text dark:text-text-dark/80' : 'text-error dark:text-error-dark'}>
            {schedule.isOpen 
              ? scheduleKey === 'openAllDay'
                ? t.openAllDay
                : `${schedule.openingTime} - ${schedule.closingTime}`
              : t.closed}
          </span>
        </div>
      </div>
    );
  }
  
  // If all days except holidays have identical hours, show "All week" and holidays separately
  if (allNonHolidayDaysIdentical && !allDaysIdentical) {
    const weekScheduleKey = 'all-week';
    const holidayScheduleKey = 'holiday-only';
    const weekSchedule = hoursByGroup[weekScheduleKey];
    const holidaySchedule = hoursByGroup[holidayScheduleKey];
    
    return (
      <div className={`space-y-3 min-w-[240px] ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2 text-text dark:text-[#f2f2f2] transition-all duration-200">
          <Icon name="clock" category="ui" className="w-5 h-5 " />
          <span className="font-semibold text-lg">{t.openingHours}</span>
        </div>
        
        {/* All week hours */}
        <div className="ml-6 space-y-2">
          <div className="flex items-start gap-1">
            <span className="font-semibold dark:text-[#f2f2f2] mr-2">
              {t.allWeek} :
            </span>
            
            <span className={weekSchedule.isOpen ? 'text-text dark:text-text-dark/80' : 'text-error dark:text-error-dark'}>
              {weekSchedule.isOpen 
                ? `${weekSchedule.openingTime} - ${weekSchedule.closingTime}`
                : t.closed}
            </span>
          </div>
          
          {/* Holidays hours */}
          <div className="flex items-start gap-1">
            <span className="font-semibold dark:text-[#f2f2f2] mr-2">
              {t.holidays} :
            </span>
            
            <span className={holidaySchedule.isOpen ? 'text-text dark:text-text-dark/80' : 'font-semibold text-error dark:text-error-dark'}>
              {holidaySchedule.isOpen 
                ? `${holidaySchedule.openingTime} - ${holidaySchedule.closingTime}`
                : t.closed}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 min-w-[290px] ${locale === 'he' ? 'ml-[-60px]' : 'mr-[-60px]'} ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 text-text dark:text-[#f2f2f2] transition-all duration-200">
        <Icon name="clock" category="ui" className="w-5 h-5 " />
        <span className="font-semibold text-lg">{t.openingHours}</span>
      </div>
      
      {/* Hours by group */}
      <div className="ml-6 space-y-2">
        {sortScheduleKeys(Object.keys(groupedDays)).map(scheduleKey => {
          const days = groupedDays[scheduleKey];
          const schedule = hoursByGroup[scheduleKey];
          
          // Format the days string based on special cases
          let daysDisplay = formatDayRanges(days, t);
          
          // Special cases for formatting display
          if (days.includes('saturday') && days.includes('holidays')) {
            daysDisplay = t.satAndHolidays+' ';
          }
          
          return (
            <div key={scheduleKey} className="flex items-start gap-1">
              <span className="font-semibold dark:text-[#b3b3b3] mr-2">
                {daysDisplay} :
              </span>
              
              <span className={schedule.isOpen ? 'text-text dark:text-text-dark/80' : 'font-semibold text-error dark:text-error-dark'}>
                {schedule.isOpen 
                  ? scheduleKey === 'openAllDay' || (schedule.openingTime === '00:00' && schedule.closingTime === '00:00')
                    ? t.openAllDay
                    : `${schedule.openingTime} - ${schedule.closingTime}`
                  : t.closed}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormattedHours;