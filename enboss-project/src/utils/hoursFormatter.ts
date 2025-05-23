// client/src/utils/hoursFormatter.ts

import { IOperatingHours, IDaySchedule, ILightingHours } from '@/models/Skatepark';

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'holidays';

const dayOrder: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holidays'];

// Check if a day's schedule represents a "closed" day
export const isDayClosed = (schedule: IDaySchedule): boolean => {
  if (!schedule.isOpen) return true;
  // Check for special case where openingTime=00:02 and closingTime=23:58 - this indicates closed
  if (schedule.openingTime === '00:02' && schedule.closingTime === '23:58') return true;
  return false;
};

// Check if hours represent 24/7 operation
export const is24HourSchedule = (hours: IOperatingHours): boolean => {
  // Check if all days are using the special pattern of 00:02-23:58 which indicates 24/7
  const allDaysHaveSpecialClosedPattern = Object.values(hours).every(day => 
    day.isOpen && day.openingTime === '00:02' && day.closingTime === '23:58'
  );

  if (allDaysHaveSpecialClosedPattern) return true;

  // Also consider 24/7 if all days are open with hours 00:00-00:00 or similar pattern indicating all day
  const allDaysOpen = Object.values(hours).every(day => 
    day.isOpen && 
    ((day.openingTime === '00:00' && day.closingTime === '00:00') || 
     (day.openingTime === '00:00' && day.closingTime === '23:59') || 
     (day.openingTime === '00:00' && day.closingTime === '24:00'))
  );

  return allDaysOpen || allDaysHaveSpecialClosedPattern;
};

// Function to check if all days have identical schedules
export const areAllDaysIdentical = (hours: IOperatingHours): boolean => {
  const scheduleKey = getScheduleKey(hours['sunday']);
  return dayOrder.every(day => getScheduleKey(hours[day]) === scheduleKey);
};

// Function to check if all days except holidays have identical schedules
export const areAllNonHolidayDaysIdentical = (hours: IOperatingHours): boolean => {
  const nonHolidayDays: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const scheduleKey = getScheduleKey(hours[nonHolidayDays[0]]);
  return nonHolidayDays.every(day => getScheduleKey(hours[day]) === scheduleKey);
};

// Helper function to create a unique key for each schedule type
export const getScheduleKey = (schedule: IDaySchedule): string => {
  if (!schedule.isOpen) return 'closed';
  // If it's the special "closed" pattern (00:02-23:58)
  if (schedule.openingTime === '00:02' && schedule.closingTime === '23:58') return 'closed';
  // If it's the special "open all day" pattern (00:00-00:00)
  if (schedule.openingTime === '00:00' && schedule.closingTime === '00:00') return 'openAllDay';
  return `${schedule.openingTime || '00:00'}-${schedule.closingTime || '00:00'}`;
};

// Group days with identical schedules
export const groupDaysWithSameHours = (hours: IOperatingHours): { 
  groupedDays: Record<string, DayOfWeek[]>,
  hoursByGroup: Record<string, { openingTime: string, closingTime: string, isOpen: boolean }>,
  allDaysIdentical: boolean,
  allNonHolidayDaysIdentical: boolean
} => {
  const scheduleGroups: Record<string, DayOfWeek[]> = {};
  const hoursByGroup: Record<string, { openingTime: string, closingTime: string, isOpen: boolean }> = {};
  
  // Check if all days (including weekends and holidays) have identical schedules
  const allDaysIdentical = areAllDaysIdentical(hours);
  
  // Check if all days except holidays have identical schedules
  const allNonHolidayDaysIdentical = areAllNonHolidayDaysIdentical(hours);

  // Special case: if all days have identical hours, group them all together
  if (allDaysIdentical && !is24HourSchedule(hours)) {
    const schedule = hours['sunday'];
    const scheduleKey = getScheduleKey(schedule);
    
    scheduleGroups[scheduleKey] = [...dayOrder];
    hoursByGroup[scheduleKey] = {
      openingTime: schedule.openingTime || '00:00',
      closingTime: schedule.closingTime || '00:00',
      isOpen: schedule.isOpen && !(schedule.openingTime === '00:02' && schedule.closingTime === '23:58')
    };
    
    return { groupedDays: scheduleGroups, hoursByGroup, allDaysIdentical, allNonHolidayDaysIdentical };
  }
  
  // Special case: if all days except holidays have identical hours
  if (allNonHolidayDaysIdentical && !allDaysIdentical && !is24HourSchedule(hours)) {
    const nonHolidayDays: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const holidaySchedule = hours.holidays;
    
    // Group all non-holiday days together
    const schedule = hours['sunday']; // Use Sunday as reference
    const scheduleKey = 'all-week';
    
    scheduleGroups[scheduleKey] = [...nonHolidayDays];
    hoursByGroup[scheduleKey] = {
      openingTime: schedule.openingTime || '00:00',
      closingTime: schedule.closingTime || '00:00',
      isOpen: schedule.isOpen && !(schedule.openingTime === '00:02' && schedule.closingTime === '23:58')
    };
    
    // Add holidays separately
    const holidayKey = 'holiday-only';
    scheduleGroups[holidayKey] = ['holidays'];
    hoursByGroup[holidayKey] = {
      openingTime: holidaySchedule.openingTime || '00:00',
      closingTime: holidaySchedule.closingTime || '00:00',
      isOpen: holidaySchedule.isOpen && !(holidaySchedule.openingTime === '00:02' && holidaySchedule.closingTime === '23:58')
    };
    
    return { groupedDays: scheduleGroups, hoursByGroup, allDaysIdentical, allNonHolidayDaysIdentical };
  }

  // Handle weekdays (Sunday-Thursday)
  const weekdays: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
  
  // Check if all weekdays have identical schedule
  const areAllWeekdaysIdentical = () => {
    const firstDayScheduleKey = getScheduleKey(hours[weekdays[0]]);
    return weekdays.every(day => getScheduleKey(hours[day]) === firstDayScheduleKey);
  };
  
  // Group weekdays if they all have identical schedules
  if (areAllWeekdaysIdentical()) {
    const schedule = hours[weekdays[0]];
    const scheduleKey = getScheduleKey(schedule);
    
    scheduleGroups[scheduleKey] = [...weekdays];
    hoursByGroup[scheduleKey] = {
      openingTime: schedule.openingTime || '00:00',
      closingTime: schedule.closingTime || '00:00',
      isOpen: schedule.isOpen && !(schedule.openingTime === '00:02' && schedule.closingTime === '23:58')
    };
  } else {
    // Otherwise, group days individually
    weekdays.forEach(day => {
      const daySchedule = hours[day];
      const scheduleKey = getScheduleKey(daySchedule);
      
      if (!scheduleGroups[scheduleKey]) {
        scheduleGroups[scheduleKey] = [];
        hoursByGroup[scheduleKey] = {
          openingTime: daySchedule.openingTime || '00:00',
          closingTime: daySchedule.closingTime || '00:00',
          isOpen: daySchedule.isOpen && !(daySchedule.openingTime === '00:02' && daySchedule.closingTime === '23:58')
        };
      }
      
      scheduleGroups[scheduleKey].push(day);
    });
  }

  // Always handle Friday separately from Sun-Thu
  const fridaySchedule = hours.friday;
  const fridayKey = getScheduleKey(fridaySchedule);
  
  scheduleGroups[`friday-${fridayKey}`] = ['friday'];
  hoursByGroup[`friday-${fridayKey}`] = {
    openingTime: fridaySchedule.openingTime || '00:00',
    closingTime: fridaySchedule.closingTime || '00:00',
    isOpen: fridaySchedule.isOpen && !(fridaySchedule.openingTime === '00:02' && fridaySchedule.closingTime === '23:58')
  };

  // Handle Saturday and holidays together
  const satSchedule = hours.saturday;
  const holidaySchedule = hours.holidays;
  const satKey = getScheduleKey(satSchedule);
  const holidayKey = getScheduleKey(holidaySchedule);
  
  // Check if Saturday and holidays have the same schedule
  if (satKey === holidayKey) {
    scheduleGroups[`weekend-${satKey}`] = ['saturday', 'holidays'];
    hoursByGroup[`weekend-${satKey}`] = {
      openingTime: satSchedule.openingTime || '00:00',
      closingTime: satSchedule.closingTime || '00:00',
      isOpen: satSchedule.isOpen && !(satSchedule.openingTime === '00:02' && satSchedule.closingTime === '23:58')
    };
  } else {
    // Handle them separately
    scheduleGroups[`saturday-${satKey}`] = ['saturday'];
    hoursByGroup[`saturday-${satKey}`] = {
      openingTime: satSchedule.openingTime || '00:00',
      closingTime: satSchedule.closingTime || '00:00',
      isOpen: satSchedule.isOpen && !(satSchedule.openingTime === '00:02' && satSchedule.closingTime === '23:58')
    };
    
    scheduleGroups[`holiday-${holidayKey}`] = ['holidays'];
    hoursByGroup[`holiday-${holidayKey}`] = {
      openingTime: holidaySchedule.openingTime || '00:00',
      closingTime: holidaySchedule.closingTime || '00:00',
      isOpen: holidaySchedule.isOpen && !(holidaySchedule.openingTime === '00:02' && holidaySchedule.closingTime === '23:58')
    };
  }

  return { groupedDays: scheduleGroups, hoursByGroup, allDaysIdentical, allNonHolidayDaysIdentical };
};

// Format a group of days for display
export const formatDayRanges = (days: DayOfWeek[], t: Function): string => {
    // Check if all days of the week including holidays are in the array
    if (days.length === dayOrder.length) {
      return t('skatepark.allWeek');
    }
  
    // Special case for Saturday and Holidays
    if (days.length === 2 && days.includes('saturday') && days.includes('holidays')) {
      return t('common:time.satAndHolidays');
    }
  
    // Sort days according to the day order
    const sortedDays = days.sort((a, b) => 
      dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );
  
    // If it's just one day
    if (sortedDays.length === 1) {
      // Use short version for Friday
      if (sortedDays[0] === 'friday') {
        return `${t('common:time.days.days')} ${t(`common:time.days.short.friday`)}`;
      }
      return `${t('common:time.days.days')} ${t(`common:time.days.${sortedDays[0]}`)}`;
    }
  
    // Check if days are consecutive
    const isConsecutive = sortedDays.every((day, index, array) => {
      if (index === 0) return true;
      const prevDayIndex = dayOrder.indexOf(array[index-1]);
      const currentDayIndex = dayOrder.indexOf(day);
      return currentDayIndex - prevDayIndex === 1;
    });
  
    if (isConsecutive) {
      // Get first and last day with special handling for Friday
      const firstDay = sortedDays[0] === 'friday' 
        ? t(`common:time.days.short.friday`) 
        : t(`common:time.days.short.${sortedDays[0]}`);
      
      const lastDay = sortedDays[sortedDays.length-1] === 'friday' 
        ? t(`common:time.days.short.friday`) 
        : t(`common:time.days.short.${sortedDays[sortedDays.length-1]}`);
      
      return `${t('common:time.days.days')} ${firstDay} ${t('common:time.to')} ${lastDay}`;
    }
  
    // Not consecutive, list them all with special handling for Friday
    const formattedDays = sortedDays.map(day => {
      if (day === 'friday') {
        return t(`common:time.days.short.friday`);
      }
      return t(`common:time.days.${day}`);
    }).join(', ');
    
    return `${t('common:time.days.days')} ${formattedDays}`;
  };

// Format lighting hours with special handling for sunset
export const formatLightingHours = (lightingHours: ILightingHours | undefined, t: Function): string => {
    if (!lightingHours) return t('skateparks.noLighting');
    
    // Special case for "almost 24 hours" (00:02-23:58) - treat as no lighting
    if (lightingHours.startTime === '00:02' && lightingHours.endTime === '23:58') {
      return t('skateparks.noLighting');
    }
    
    // Always prioritize the sunset rule, even if is24Hours is set to true
    // Special case for sunset - either the literal string 'sunset' or the encoded value '00:01'
    if (lightingHours.startTime === '00:01' || lightingHours.startTime === 'sunset') {
      return `${t('skateparks.fromSunsetTill')} ${lightingHours.endTime}` + '.';
    }
    
    // Normal hours format
    return `${lightingHours.startTime} - ${lightingHours.endTime}`;
  };

  