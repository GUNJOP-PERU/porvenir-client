import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const TZ = "America/Lima";

function firstThursdayAt19(year) {
  let d = dayjs.tz(`${year}-01-01 19:00`, TZ);
  while (d.day() !== 4) d = d.add(1, "day");
  return d;
}

function generateMiningWeeks({ calibrateDate = null, calibrateWeekNumber = null } = {}) {
  const year = dayjs().year();
  const firstThu = firstThursdayAt19(year);
  const firstThuNext = firstThursdayAt19(year + 1);

  const weeks = [];
  for (let d = firstThu; d.isBefore(firstThuNext); d = d.add(7, "day")) {
    weeks.push({ start: d.valueOf(), end: d.add(6, "day").valueOf() }); // 📌 en ms
  }

  let offset = 0;
  if (calibrateDate && Number.isInteger(calibrateWeekNumber)) {
    const cal = dayjs.tz(calibrateDate, TZ).valueOf();
    const idx = weeks.findIndex(w => cal >= w.start && cal <= w.end);
    if (idx !== -1) offset = calibrateWeekNumber - (idx + 1);
  }

  const all = weeks.map((w, i) => {
    const n = i + 1 + offset;
    const startDay = dayjs(w.start);
    const endDay = dayjs(w.end);
    return {
      weekNumber: n,
      startTimestamp: w.start, // timestamp ms
      endTimestamp: w.end,     // timestamp ms
      startDate: startDay.format("YYYY-MM-DD"), // string
    endDate: endDay.format("YYYY-MM-DD"),
      label: `Semana ${n} (${startDay.format("DD MMM")} – ${endDay.format("DD MMM")})`,
    };
  });

  const now = Date.now();
  const idx = all.findIndex(w => now >= w.startTimestamp && now <= w.endTimestamp);
  const current = idx === -1 ? null : all[idx];
  const recent = idx === -1 ? [] : all.slice(Math.max(0, idx - 10), idx + 1);

  return { year, allWeeks: all, currentWeek: current, weeks: recent };
}

export function getLast4WeeksIncludingCurrent() {
  const { allWeeks, currentWeek } = generateMiningWeeks({
    calibrateDate: "2025-05-22T19:00",
    calibrateWeekNumber: 22,
  });

  if (!currentWeek) return [];

  // Buscar índice de la semana actual
  const idx = allWeeks.findIndex(w => w.weekNumber === currentWeek.weekNumber);

  // Tomar 4 semanas: 3 anteriores + actual
  return allWeeks.slice(Math.max(0, idx - 3), idx + 1);
}

export default function MiningWeeksSelect({ onChange }) {
  const { weeks, currentWeek } = generateMiningWeeks({
    calibrateDate: "2025-05-22T19:00",
    calibrateWeekNumber: 22,
  });

  const [selectedWeek, setSelectedWeek] = useState(
    currentWeek ? currentWeek.weekNumber.toString() : ""
  );

  useEffect(() => {
    if (currentWeek && onChange) {
      onChange({
        startTimestamp: currentWeek.startTimestamp,
        endTimestamp: currentWeek.endTimestamp,
        startDate: currentWeek.startDate,
        endDate: currentWeek.endDate,
      });
    }
    // 👇 sin dependencias, se ejecuta solo una vez
  }, []);
  

  const handleChange = (weekNumber) => {
    setSelectedWeek(weekNumber);
    const week = weeks.find(w => w.weekNumber.toString() === weekNumber);
    if (week && onChange) {
      onChange({
        startTimestamp: week.startTimestamp,
        endTimestamp: week.endTimestamp,
        startDate: week.startDate,
        endDate: week.endDate,
      });
    }
  };
  

  return (
    <div className="">     
      <select
        className="h-8 px-2 border rounded w-full text-xs"
        value={selectedWeek}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">-- Elige semana --</option>
        {weeks.map(w => (
          <option key={w.weekNumber} value={w.weekNumber}>
            {w.label}
          </option>
        ))}
      </select>
    </div>
  );
}
