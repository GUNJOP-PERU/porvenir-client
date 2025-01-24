import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "./ui/calendar"; // Asegúrate de que usa react-day-picker
import { es } from "date-fns/locale"; // Idioma español

export default function DatePickerMonth({ onDateChange }) {
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  const handleDateChange = (selectedDates) => {
    setDate(selectedDates);
    if (onDateChange) {
      onDateChange(selectedDates.from, selectedDates.to);
    }
  };

  return (
    <div className="grid gap-2 p-2 border border-zinc-100 ">
      <div className="justify-start text-xs flex gap-2 text-left font-normal rounded-lg border px-2 py-1.5">
        <CalendarIcon className="h-4 w-4 text-zinc-400" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "dd 'de' MMMM 'de' yyyy", { locale: es })} -{" "}
              {format(date.to, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </>
          ) : (
            format(date.from, "dd 'de' MMMM 'de' yyyy", { locale: es })
          )
        ) : (
          <span className="text-zinc-400">Seleccione fecha</span>
        )}
      </div>
      <div className="">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={1}
          locale={es} // Pasar el idioma aquí
        />
        <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            
            locale={es} 
            disabled={(date) => {
              const today = new Date();
              const tenDaysBeforeToday = new Date(today);
              tenDaysBeforeToday.setDate(today.getDate() - 30);
              return date > today || date < tenDaysBeforeToday;
              
            }}
           
          />asdsd
      </div>
    </div>
  );
}
