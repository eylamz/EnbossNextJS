// client/src/pages/skateparks/components/FormattedHours.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/config/icons';
import { OperatingHours, LightingHours } from '@/api/types/skatepark';
import { 
  is24HourSchedule, 
  groupDaysWithSameHours, 
  formatDayRanges,
  formatLightingHours
} from '@/utils/hoursFormatter';
import { TextBadge } from '@/components/ui/textVariants';

interface FormattedHoursProps {
  operatingHours: OperatingHours;
  lightingHours?: LightingHours;
  className?: string;
  closingYear?: number | null; // Add closing year prop
}

const FormattedHours: React.FC<FormattedHoursProps> = ({ 
  operatingHours, 
  lightingHours,
  className = '',
  closingYear
}) => {
  const { t } = useTranslation(['skateparks', 'common']);
  
  // Check if the park is permanently closed based on closingYear
  const isPermanentlyClosed = Boolean(closingYear);
  
  // If the park is closed (has a closing year), always show the closed badge
  // regardless of operating hours
  if (isPermanentlyClosed) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Header with closed badge */}
        <div className="flex items-center gap-2">
          <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-text-secondary-dark" />
          <span className="font-semibold">{t('skateparks.openingHours')}: </span>
          <TextBadge 
            variant='error'
            className="font-semibold text-sm border border-b-[3px] bg-error-bg dark:bg-error-bg-dark/50 border-error dark:border-error-dark/60 text-error"
          >
            {t('skateparks.isPermanentlyClosed')}
          </TextBadge>
        </div>
        
        {/* Still show lighting hours for historical reference */}
        <div className="flex items-star gap-2">
          <div className="flex items-center gap-2">
            <Icon name="sunset" category="ui" className="w-5 h-5 text-gray-500" />
            <span className="font-semibold">{t('skateparks.lightingHours')}: </span>
          </div>
         
          <div className="">
            <span className="text-gray-500 min-w-[180px] sm:min-w-auto">
              {t('skateparks.notApplicable')}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // Below is the original implementation for parks that are not closed
  
  // Check if it's a 24/7 operation
  const is24Hours = is24HourSchedule(operatingHours);
  
  if (is24Hours) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* 24/7 Header */}
        <div className="flex items-center gap-2">
          <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-text-secondary-dark" />
          <span className="font-semibold">{t('skateparks.openingHours')}: </span>
          <TextBadge 
            variant='brand'
            className="font-semibold text-sm border border-b-[3px] border-brand-700 text-brand-700"
          >
            {t('skateparks.is24Hours')}
          </TextBadge>
        </div>
        
        {/* ALWAYS show lighting hours for 24/7 parks */}
        <div className="flex items-star gap-2">
          <div className="flex items-center gap-2">
            <Icon name="sunset" category="ui" className={`w-5 h-5 ${lightingHours ? 'text-yellow-600/90' : 'text-gray-500'}`} />
            <span className="font-semibold">{t('skateparks.lightingHours')}: </span>
          </div>
       
          <div className="">
            <span className={!lightingHours ? 'text-gray-500' : 'min-w-[180px] sm:min-w-auto'}>
              {lightingHours 
                ? formatLightingHours(lightingHours, t)
                : t('skateparks.noLighting')}
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
    
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-text-secondary-dark" />
          <span className="font-semibold">{t('skateparks.openingHours')}</span>
        </div>
        
        {/* All week hours */}
        <div className="ml-6 flex items-start gap-1">
          <span className="font-semibold dark:text-[#7991a0] mr-2">
            {t('skateparks.allWeek')} :
          </span>
          
          <span className={schedule.isOpen ? 'text-text dark:text-text-dark/80' : 'text-error dark:text-error-dark'}>
            {schedule.isOpen 
              ? scheduleKey === 'openAllDay'
                ? t('skateparks.openAllDay')
                : `${schedule.openTime} - ${schedule.closeTime}`
              : t('common:common.closed')}
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
      <div className={`space-y-3 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-text-secondary-dark" />
          <span className="font-semibold">{t('skateparks.openingHours')}</span>
        </div>
        
        {/* All week hours */}
        <div className="ml-6 space-y-2">
          <div className="flex items-start gap-1">
            <span className="font-semibold dark:text-[#7991a0] mr-2">
              {t('skateparks.allWeek')} :
            </span>
            
            <span className={weekSchedule.isOpen ? 'text-text dark:text-text-dark/80' : 'text-error dark:text-error-dark'}>
              {weekSchedule.isOpen 
                ? `${weekSchedule.openTime} - ${weekSchedule.closeTime}`
                : t('common:common.closed')}
            </span>
          </div>
          
          {/* Holidays hours */}
          <div className="flex items-start gap-1">
            <span className="font-semibold dark:text-[#7991a0] mr-2">
              {t('common:time.days.holidays')} :
            </span>
            
            <span className={holidaySchedule.isOpen ? 'text-text dark:text-text-dark/80' : 'font-semibold text-error dark:text-error-dark'}>
              {holidaySchedule.isOpen 
                ? `${holidaySchedule.openTime} - ${holidaySchedule.closeTime}`
                : t('common:common.closed')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Icon name="clock" category="ui" className="w-5 h-5 text-text dark:text-text-secondary-dark" />
        <span className="font-semibold">{t('skateparks.openingHours')}</span>
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
            daysDisplay = t('common:time.satAndHolidays')+' ';
          }
          
          return (
            <div key={scheduleKey} className="flex items-start gap-1">
              <span className="font-semibold dark:text-[#7991a0] mr-2">
                {daysDisplay} :
              </span>
              
              <span className={schedule.isOpen ? 'text-text dark:text-text-dark/80' : 'font-semibold text-error dark:text-error-dark'}>
                {schedule.isOpen 
                  ? scheduleKey === 'openAllDay' || (schedule.openTime === '00:00' && schedule.closeTime === '00:00')
                    ? t('skateparks.openAllDay')
                    : `${schedule.openTime} - ${schedule.closeTime}`
                  : t('common:common.closed')}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Lighting Hours are not shown for non-24-hour parks */}
    </div>
  );
};

export default FormattedHours;