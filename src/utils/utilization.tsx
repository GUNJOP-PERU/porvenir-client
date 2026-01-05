import { format } from "date-fns";

export const calculateAvgHour = (data : string[]) => {

  if(data.length === 0) return "--:--";
  const total = data.reduce((acc, curr) => acc + new Date(curr).getTime(), 0);
  const avg = Math.floor(total / data.length);
  return format(new Date(avg), "HH:mm");
} 