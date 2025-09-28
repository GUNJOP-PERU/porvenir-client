import { startOfWeek, endOfWeek, format, eachDayOfInterval, addDays } from "date-fns";

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
  const currentDate = new Date();
  const isAfter6PM = currentDate.getHours() >= 18;

  return {
    startDate: isAfter6PM ? addDays(currentDate, 1) : currentDate,
    endDate: isAfter6PM ? addDays(currentDate, 1) : currentDate,
    startDateString: format(isAfter6PM ? addDays(currentDate, 1) : currentDate, "yyyy-MM-dd"),
    endDateString: format(isAfter6PM ? addDays(currentDate, 1) : currentDate, "yyyy-MM-dd"),
  };
}