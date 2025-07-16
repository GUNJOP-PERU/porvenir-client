import dayjs from "dayjs";
import "dayjs/locale/es";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";

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

export function formatThousands(value) {
  if (value === 0) return "";
  return value >= 1000 ? (value / 1000).toFixed(1) + "<small>k</small>" : value;
}

export function getHoursBetween(start, end) {
  const startMs = start instanceof Date ? start.getTime() : Number(start);
  const endMs = end instanceof Date ? end.getTime() : Number(end);
  const totalHours = Math.abs((endMs - startMs) / (1000 * 60 * 60));
  return totalHours.toFixed(2); // Retorna las horas con dos decimales, siempre positivo
}
