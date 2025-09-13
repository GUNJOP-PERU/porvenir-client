import dayjs from "dayjs";
import "dayjs/locale/es";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.locale("es");
dayjs.extend(calendar);
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatRelativeTime = (updatedAt) => {
  return dayjs(updatedAt).fromNow(); // Mostrará "hace 4 horas", "hace 10 minutos", etc.
};

export function getMonthName(monthNumber) {
  return dayjs().month(monthNumber - 1).format("MMMM");
}

export function formatFecha(dateString) {
  const date = dayjs(dateString);

  const day = date.format("DD");
  const monthShort = date.format("MMM");
  const formattedHours = date.format("HH");
  const formattedMinutes = date.format("mm");

  return ` ${formattedHours}:${formattedMinutes}, ${day} ${monthShort}`;
}
export function formatHour(dateString) {
  return dayjs(dateString).format("HH:mm:ss");
}
export function formatDay(dateString) {
  const date = dayjs(dateString);
  const day = date.format("DD");
  const monthShort = date.format("MMM");
  return `${day} ${monthShort}`;
}

export function countItems(data) {
  return Array.isArray(data) ? data.length : 0;
}

export function countItemsByType(data, selectedType) {
  if (!data || !selectedType) return 0;
  return data[selectedType]?.length || 0;
}

export function getYearFromFecha(dateString) {
  const date = dayjs(dateString);

  // Extraer solo el año
  const year = date.format("YYYY");
  return year;
}

export function formatDurationHour(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  if (durationInSeconds < 60) {
    return `${seconds}seg`; // Solo segundos
  } else if (durationInSeconds < 3600) {
    return `${minutes}min ${seconds}seg`; // Minutos y segundos
  } else {
    return `${hours}h ${minutes}min ${seconds}seg`; // Horas, minutos y segundos
  }
}

export function formatDurationMinutes(value) {
  if (value == null) return "-";

  // Convertir minutos a segundos
  let totalSeconds = Math.round(value * 60);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (totalSeconds < 60) return `${seconds}seg`;
  if (totalSeconds < 3600) return `${minutes}min ${seconds}seg`;
  return `${hours}h ${minutes}min ${seconds}seg`;
}


export function formatThousands(value) {
  if (value === 0) return "";
  return value >= 1000 ? (value / 1000).toFixed(1) + "<small>k</small>" : value;
}

export function getHoursBetween(start, end) {
  const startMs = start instanceof Date ? start.getTime() : Number(start);
  const endMs = end instanceof Date ? end.getTime() : Number(end);
  const totalHours = Math.abs((endMs - startMs) / (1000 * 60 * 60));
  return totalHours.toFixed(2); 
}

export const getDefaultDate = () => {
  const now = dayjs();
  return (now.hour() >= 7 && now.hour() < 18)
    ? now.format("YYYY-MM-DD")
    : now.add(1, "day").format("YYYY-MM-DD");
};

export const getDefaultShift = () => {
  const now = dayjs();
  return (now.hour() >= 7 && now.hour() < 18) ? "dia" : "noche";
};

export const getDefaultDateObj = () => {
  const now = dayjs();
  const date = (now.hour() >= 7 && now.hour() < 18) ? now : now.add(1, "day");
  return date.toDate();
};

export function roundAndFormat(valor) {
  if (valor == null || isNaN(valor)) return "-";

  let resultado;

  if (valor > 1000) {
    resultado = Math.round(valor);
  } else {
    resultado = Number(valor.toFixed(2));
  }

  return resultado.toLocaleString("es-MX");
}

// Filtrar datos
const EXCLUDED_ORIGINS = ["cancha 100", "faja 4"].map(o => o.toLowerCase());
const EXCLUDED_DESTINY = ["labor a labor"].map(d => d.toLowerCase());

export function filterData(data, material = null) {
  return data.filter((i) => {
    const origin = i.origin?.toLowerCase() || "";
    const destiny = i.destiny?.toLowerCase() || "";
    const mat = i.material?.toLowerCase();

    const isExcludedOrigin =
      EXCLUDED_ORIGINS.includes(origin) || origin.startsWith("bc-");
    const isExcludedDestiny = EXCLUDED_DESTINY.includes(destiny);

    const isMaterialMatch = material ? mat === material : true;

    return !(isExcludedOrigin || isExcludedDestiny) && isMaterialMatch;
  });
}

export function filterInvalidData(data, material = null) {
  return data.filter((i) => !filterData([i], material).length);
}

export function filterValidTrips(data, material = null) {
  return data.filter((i) => {
    const origin = i.origin?.toLowerCase().trim() || "";
    const destiny = i.destiny?.toLowerCase().trim() || "";
    const mat = i.material?.toLowerCase();

    const isAllowedOrigin = EXCLUDED_ORIGINS.includes(origin);   
    const isAllowedDestiny = EXCLUDED_DESTINY.includes(destiny);
    const isMaterialMatch = material ? mat === material : true;

    return (isAllowedOrigin || isAllowedDestiny) && isMaterialMatch;
  });
}

// Métricas
export function getMetrics(filtered, programmedTonnage, value, isTravels = false) {
  const executedTonnage = filtered.reduce((sum, i) => sum + (i.tonnage || 0), 0);
  const executedTravels = filtered.length;

  const programmedTravels = isTravels
    ? value 
    : (programmedTonnage / value).toFixed(0); 

  const goalCompletionPercentage = programmedTonnage
    ? (executedTonnage / programmedTonnage) * 100
    : 0;

  return {
    executedTonnage,
    executedTravels,
    programmedTravels,
    goalCompletionPercentage,
    variationTonnage: executedTonnage - programmedTonnage,
    variationTravels: executedTravels - programmedTravels,
  };
}

// Rango de horas
export function getShiftRangeMs(baseDate, shift) {
  const date = dayjs(baseDate); // garantiza que baseDate sea consistente

  let start, end;

  if (shift.toLowerCase() === "dia") {
    start = date.hour(7).minute(0).second(0).millisecond(0);
    end = date.hour(19).minute(0).second(0).millisecond(0);
  } else {
    // turno noche: 19:00 del día anterior → 07:00 del día actual
    start = date.subtract(1, "day").hour(19).minute(0).second(0).millisecond(0);
    end = date.hour(7).minute(0).second(0).millisecond(0);
  }

  return {
    startMs: start.valueOf(),
    endMs: end.valueOf(),
  };
}



export const toInputDate = (d) => dayjs(d).format("YYYY-MM-DD");