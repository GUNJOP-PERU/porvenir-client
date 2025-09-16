import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);        
dayjs.extend(isLeapYear);     
dayjs.extend(isoWeeksInYear); 

const TZ = "America/Lima";

export function generateNormalWeeks() {
  const now = dayjs().tz(TZ);
  const year = now.isoWeekYear();          
  const totalWeeks = now.isoWeeksInYear(); 

  let start = dayjs.tz(`${year}-01-01`, TZ);
  while (start.isoWeekday() !== 1) start = start.add(1, "day"); 

  const weeks = [];
  for (let i = 0; i < totalWeeks; i++) {
    const end = start.add(6, "day"); 

    const startTimestamp = dayjs.tz(`${start.subtract(1, "day").format("YYYY-MM-DD")} 19:00`, TZ).valueOf(); 
    const endTimestamp = dayjs.tz(`${end.format("YYYY-MM-DD")} 19:00`, TZ).valueOf(); 

    weeks.push({
      weekNumber: start.isoWeek(),
      startDate: start.format("YYYY-MM-DD"), 
      endDate: end.format("YYYY-MM-DD"),     
      startTimestamp,
      endTimestamp,
      label: `Semana ${start.isoWeek()} (${start.format(
        "DD MMM"
      )} – ${end.format("DD MMM")})`,
    });

    start = start.add(7, "day"); 
  }

  const idx = weeks.findIndex(
    (w) => now.valueOf() >= w.startTimestamp && now.valueOf() <= w.endTimestamp
  );

  const startIdx = Math.max(0, idx - 5);
  const limitedWeeks = weeks.slice(startIdx, idx + 1);

  return { allWeeks: limitedWeeks, currentWeek: idx >= 0 ? weeks[idx] : null };
}

export function getLast4WeeksIncludingCurrent() {
  const { allWeeks, currentWeek } = generateNormalWeeks();

  if (!currentWeek) return [];
  const idx = allWeeks.findIndex(w => w.weekNumber === currentWeek.weekNumber);
  return allWeeks.slice(Math.max(0, idx - 3), idx + 1);
}