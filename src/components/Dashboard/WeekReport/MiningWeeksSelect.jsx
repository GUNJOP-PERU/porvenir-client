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
  const now = dayjs();
  const weeks = [];

  for (let i = 0; i < 6; i++) {
    const startDayjs = now
      .clone()
      .add(i, "week")
      .startOf("isoWeek");

    const endDayjs = startDayjs
      .clone()
      .endOf("isoWeek"); 

    const startDate = startDayjs.toDate();
    const endDate = endDayjs.toDate();

    weeks.push({
      weekNumber: startDayjs.isoWeek(),
      start: startDate,
      end: endDate,
      label: `SEM ${startDayjs.isoWeek()} / ${startDayjs.format(
        "DD MMM"
      )} – ${endDayjs.format("DD MMM")}`,
    });
  }

  const currentWeek =
    weeks.find(
      (w) => now.toDate() >= w.start && now.toDate() <= w.end
    ) || null;

  return {
    allWeeks: weeks,
    currentWeek,
  };
}

export function getLast4WeeksIncludingCurrent() {
  const { allWeeks, currentWeek } = generateNormalWeeks();

  if (!currentWeek) return [];
  const idx = allWeeks.findIndex(
    (w) => w.weekNumber === currentWeek.weekNumber
  );
  return allWeeks.slice(Math.max(0, idx - 3), idx + 1);
}
