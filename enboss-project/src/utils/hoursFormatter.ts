// client/src/utils/hoursFormatter.ts

import { IOperatingHours, IDaySchedule, ILightingHours } from '@/models/Skatepark';

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'holidays';

const dayOrder: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holidays'];

// Check if a day's schedule represents a "closed" day
export const isDayClosed = (schedule: IDaySchedule): boolean => {
  if (!schedule.isOpen) return true;
  // Special case where openingTime=00:02 and closingTime=23:58 - this indicates 24/7 operation, not closed
  if (schedule.openingTime === '00:02' && schedule.closingTime === '23:58') return false;
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

  return allDaysOpen;
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
  // If it's the special "24/7" pattern (00:02-23:58)
  if (schedule.openingTime === '00:02' && schedule.closingTime === '23:58') return '24hours';
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
  if (allDaysIdentical) {
    const schedule = hours['sunday'];
    const scheduleKey = getScheduleKey(schedule);
    
    scheduleGroups[scheduleKey] = [...dayOrder];
    hoursByGroup[scheduleKey] = {
      openingTime: schedule.openingTime || '00:00',
      closingTime: schedule.closingTime || '00:00',
      isOpen: schedule.isOpen
    };
    
    return { groupedDays: scheduleGroups, hoursByGroup, allDaysIdentical, allNonHolidayDaysIdentical };
  }
  
  // Special case: if all days except holidays have identical hours
  if (allNonHolidayDaysIdentical && !allDaysIdentical) {
    const nonHolidayDays: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const holidaySchedule = hours.holidays;
    
    // Group all non-holiday days together
    const schedule = hours['sunday']; // Use Sunday as reference
    const scheduleKey = 'all-week';
    
    scheduleGroups[scheduleKey] = [...nonHolidayDays];
    hoursByGroup[scheduleKey] = {
      openingTime: schedule.openingTime || '00:00',
      closingTime: schedule.closingTime || '00:00',
      isOpen: schedule.isOpen
    };
    
    // Add holidays separately
    const holidayKey = 'holiday-only';
    scheduleGroups[holidayKey] = ['holidays'];
    hoursByGroup[holidayKey] = {
      openingTime: holidaySchedule.openingTime || '00:00',
      closingTime: holidaySchedule.closingTime || '00:00',
      isOpen: holidaySchedule.isOpen
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
      isOpen: schedule.isOpen
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
          isOpen: daySchedule.isOpen
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
    isOpen: fridaySchedule.isOpen
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
      isOpen: satSchedule.isOpen
    };
  } else {
    // Handle them separately
    scheduleGroups[`saturday-${satKey}`] = ['saturday'];
    hoursByGroup[`saturday-${satKey}`] = {
      openingTime: satSchedule.openingTime || '00:00',
      closingTime: satSchedule.closingTime || '00:00',
      isOpen: satSchedule.isOpen
    };
    
    scheduleGroups[`holiday-${holidayKey}`] = ['holidays'];
    hoursByGroup[`holiday-${holidayKey}`] = {
      openingTime: holidaySchedule.openingTime || '00:00',
      closingTime: holidaySchedule.closingTime || '00:00',
      isOpen: holidaySchedule.isOpen
    };
  }

  return { groupedDays: scheduleGroups, hoursByGroup, allDaysIdentical, allNonHolidayDaysIdentical };
};

// Format a group of days for display
export function formatDayRanges(
  days: string[],
  t: {
    satAndHolidays: string;
    holidays: string;
    days: string;
    to: string;
    dayNames: Record<string, string>;
    shortDayNames: Record<string, string>;
  }
): string {
  // Check if all days of the week including holidays are in the array
  if (days.length === 7) {
    return t.days;
  }
  
  // Special case for Saturday and Holidays
  if (days.length === 2 && days.includes('saturday') && days.includes('holidays')) {
    return t.satAndHolidays;
  }
  
  // Sort days according to the day order
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const sortedDays = days.sort((a, b) => 
    dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  // If it's just one day
  if (sortedDays.length === 1) {
    // Use short version for Friday
    if (sortedDays[0] === 'friday') {
      return `${t.days} ${t.shortDayNames.friday}`;
    }
    return `${t.days} ${t.dayNames[sortedDays[0]]}`;
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
      ? t.shortDayNames.friday 
      : t.shortDayNames[sortedDays[0]];
    
    const lastDay = sortedDays[sortedDays.length-1] === 'friday' 
      ? t.shortDayNames.friday 
      : t.shortDayNames[sortedDays[sortedDays.length-1]];
    
    return `${t.days} ${firstDay} ${t.to} ${lastDay}`;
  }

  // Not consecutive, list them all with special handling for Friday
  const formattedDays = sortedDays.map(day => {
    if (day === 'friday') {
      return t.shortDayNames.friday;
    }
    return t.dayNames[day];
  }).join(', ');
  
  return `${t.days} ${formattedDays}`;
}

// Format lighting hours with special handling for sunset
export function formatLightingHours(
  lightingHours: ILightingHours,
  t: {
    notApplicable: string;
  }
): string {
  if (!lightingHours) {
    return t.notApplicable;
  }

  const { startTime, endTime } = lightingHours;
  return `${startTime} - ${endTime}`;
}

  