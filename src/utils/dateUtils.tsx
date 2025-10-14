import { startOfWeek, endOfWeek, format, eachDayOfInterval, addDays, addHours, add } from "date-fns";

export const getCurrentWeekStartEndDates = () => {
  const currentDate = new Date();
  // Que la semana inicie en lunes
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  return {
    startDate: weekStart.getTime(),
    endDate: weekEnd.getTime(),
    startDateString: format(weekStart, 'yyyy-MM-dd'),
    endDateString: format(weekEnd, 'yyyy-MM-dd'),
  }
};

export const getCurrentWeekDates = () => {
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const currentWeekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekDates = currentWeekDates.map(date => format(date, 'yyyy-MM-dd'));
  return weekDates;
};

export const getCurrentWeekDatesFormatted = () => {
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const currentWeekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekDates = currentWeekDates.map(date => format(date, 'MMM dd'));
  return weekDates;
};

export const getHoursByTurns = () => {
  const generateHoursArray = (start: number, end: number) => {
    const hours = [];
    for (let i = start; i < end; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      hours.push(hour);
    }
    return hours;
  };

  const nightShift = [
    ...generateHoursArray(18, 24),
    ...generateHoursArray(0, 6),
  ];

  const dayShift = generateHoursArray(6, 18);
  return {
    nightShift,
    dayShift,
  };
};

export const getCurrentDay = () => {
  let currentShift = "dia";
  const currentDate = new Date();
  const isAfter6PM = currentDate.getHours() >= 18;

  if (currentDate.getHours() < 18 && currentDate.getHours() >= 6) {
    currentShift = "dia";
  } else {
    currentShift = "noche";
  }

  return {
    shift: currentShift,
    startDate: isAfter6PM ? addDays(currentDate, 1) : currentDate,
    endDate: isAfter6PM ? addDays(currentDate, 1) : currentDate,
    startDateString: format(isAfter6PM ? addDays(currentDate, 1) : currentDate, "yyyy-MM-dd"),
    endDateString: format(isAfter6PM ? addDays(currentDate, 1) : currentDate, "yyyy-MM-dd"),
  };
}

export const planDayDateParser = ( e : string) => {
  return format(addHours(new Date(e), 5), 'yyyy-MM-dd');
}

/**
 * Filtra camiones que han estado offline por más de X minutos
 * @param data Array de camiones con propiedad lastDate
 * @param maxMinutesOffline Número máximo de minutos offline (por defecto 30)
 * @returns Array filtrado de camiones activos
 */
export const filterActiveTrucks = <T extends { lastDate?: string | null }>(
  data: T[],
  maxMinutesOffline: number = 30
): T[] => {
  return data.filter((truck) => {
    if (!truck.lastDate) return false;
    const lastUpdate = new Date(truck.lastDate);
    const diffMinutes = (Date.now() - lastUpdate.getTime()) / 1000 / 60;
    return diffMinutes <= maxMinutesOffline;
  });
};