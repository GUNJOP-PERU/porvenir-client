
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
  // Configura la localización en español
  dayjs.locale("es");

  // Obtiene el tiempo relativo desde la fecha proporcionada
  return dayjs(updatedAt)
    .fromNow(true)
    .replace("minuto", "min")
    .replace("minutos", "mins")
    .replace("segundos", "seg")
    .replace("horas", "hrs")
    .replace("unos segundos", "ahora")
    .replace("dias", "ds");
};

export function getMonthName(monthNumber) {
  return dayjs().month(monthNumber - 1).format("MMMM");
}

export function formatFecha(dateString) {
  const date = dayjs(dateString);

  const day = date.format("DD");
  const monthShort = date.format("MMM");
  const year = date.format("YYYY");
  const formattedHours = date.format("HH");
  const formattedMinutes = date.format("mm");

  return ` ${formattedHours}:${formattedMinutes}, ${day} ${monthShort} ${year}`;
}
export function formatHour(dateString) {
  const date = dayjs(dateString);
  const formattedHours = date.format("HH");
  const formattedMinutes = date.format("mm");

  return ` ${formattedHours}:${formattedMinutes}`;
}


export function countItems(data) {
  return Array.isArray(data) ? data.length : 0;
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

export function formatThousands (value) {
  return value >= 1000 ? (value / 1000).toFixed(1) + "k" : value;
}