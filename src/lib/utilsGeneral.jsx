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
const EXCLUDED_ORIGINS = ["faja 4", "cancha 100"];
const EXCLUDED_DESTINY = ["labor a labor"];

export function filterData(data, material = null) {
  return data.filter((i) => {
    const origin = i.origin?.toLowerCase() || "";
    const destiny = i.destiny?.toLowerCase() || "";
    const mat = i.material?.toLowerCase();

    const isExcludedOrigin =
      EXCLUDED_ORIGINS.includes(origin) || origin.startsWith("bc-");
    const isExcludedDestiny = EXCLUDED_DESTINY.includes(destiny);

    const isMaterialMatch = material ? mat === material : true;

    return (
      i.isValid && !isExcludedOrigin && !isExcludedDestiny && isMaterialMatch
    );
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
  if (!(baseDate instanceof Date) || isNaN(baseDate)) {
    baseDate = new Date(); // valor por defecto si no es válido
  }

  let start = new Date(baseDate);
  let end = new Date(baseDate);

  if (shift === "D" || shift.toLowerCase() === "dia") {
    start.setHours(6, 0, 0, 0);
    end.setHours(18, 0, 0, 0);
  } else {
    start.setDate(start.getDate() - 1);
    start.setHours(18, 0, 0, 0);
    end.setHours(6, 0, 0, 0);
  }

  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
  };
}


export const toInputDate = (d) => dayjs(d).format("YYYY-MM-DD");