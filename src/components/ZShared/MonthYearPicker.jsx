/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function MonthYearPicker({ value, onChange, yearsRange = 2, disabled }) {
  const safeDate = dayjs(value?.start || value || new Date());

  const currentYear = dayjs().year();
  const years = Array.from({ length: yearsRange + 2 }, (_, i) => currentYear - yearsRange + i);

  const handleUpdate = (newMonth, newYear) => {
    const newDate = dayjs().year(newYear).month(newMonth).startOf("month");
    
    if (value?.start !== undefined) {
      onChange({
        start: newDate.toDate(),
        end: newDate.endOf("month").toDate(),
      });
    } else {
      onChange(newDate); 
    }
  };

  return (
   <div className="border border-zinc-200 rounded-lg flex bg-white">
      <Select
        disabled={disabled}
        value={safeDate.month().toString()}
        onValueChange={(m) => handleUpdate(parseInt(m), safeDate.year())}
      >
        <SelectTrigger className="w-28 border-none shadow-none bg-transparent rounded-e-none focus:ring-0">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="w-[1px] h-4 bg-zinc-200 self-center" />
      <Select
        disabled={disabled}
        value={safeDate.year().toString()}
        onValueChange={(y) => handleUpdate(safeDate.month(), parseInt(y))}
      >
        <SelectTrigger className="w-24 border-none shadow-none bg-transparent rounded-s-none focus:ring-0">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}