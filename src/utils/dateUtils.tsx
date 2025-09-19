import { startOfWeek, endOfWeek, format, eachDayOfInterval } from "date-fns";

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