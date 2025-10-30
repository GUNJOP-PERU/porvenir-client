import ChartAvailability from "@/components/Dashboard/Availability/ChartAvailability";
import TimelineStatus from "@/components/Dashboard/Availability/TimelineStatus";
import CardTitle from "@/components/Dashboard/CardTitle";
import PageHeader from "@/components/PageHeader";
import { DataExport } from "@/components/Table/DataExport";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { BrickWall } from "lucide-react";
import { useMemo } from "react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import { getDefaultDate } from "@/lib/utilsGeneral";
import { getDefaultShift } from "@/lib/utilsGeneral";
import { useFetchGraphicData } from "@/hooks/useGraphicData";

export const Availability = () => {
  const [form, setForm] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    shift: getDefaultShift(),
  });

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useFetchGraphicData({
    queryKey: ["beacon-truck-historial", form.date, form.shift],
    endpoint: "beacon-truck/historial",
    filters: `miningDateString=${form.date}`,
  });

  const dataFiltered = useMemo(() => {
  if (!data || data.length === 0) {
    // aun así devolvemos todas las horas del turno con ceros para mantener la forma
    const hoursEmpty = (form.shift === "dia"
      ? Array.from({ length: 13 }, (_, i) => 7 + i) // 7..19
      : [...Array.from({ length: 5 }, (_, i) => 19 + i), ...Array.from({ length: 7 }, (_, i) => i)] // 19..23,0..6
    );

    return hoursEmpty.map((h) => ({
      dateString: form.date,
      hours: String(h).padStart(2, "0") + ":00",
      operativo: 0,
      inoperativo: 0,
      mantenimiento: 0,
      disponibilidad: 0,
    }));
  }

  // helper para normalizar el hour value de cada snapshot (soporta number, "18", "18:00")
  const normalizeHour = (raw) => {
    if (typeof raw === "number") return raw;
    if (!raw) return NaN;
    const s = String(raw).trim();
    const m = s.match(/^(\d{1,2})/);
    return m ? Number(m[1]) : NaN;
  };

  // construir lista de horas del turno
  const shiftHours =
    form.shift === "dia"
      ? Array.from({ length: 13 }, (_, i) => 7 + i) // 7..19
      : [...Array.from({ length: 5 }, (_, i) => 19 + i), ...Array.from({ length: 7 }, (_, i) => i)]; // 19..23,0..6

  // Para cada hora, sumar todos los snapshots que correspondan a esa hora
  const result = shiftHours.map((hour) => {
    const matchingSnapshots = data.filter((snap) => normalizeHour(snap.hours) === hour);

    // Si hay múltiples snapshots en la misma hora, los acumulamos
    const counts = matchingSnapshots.reduce(
      (acc, snap) => {
        (snap.data || []).forEach((item) => {
          const s = String(item.status || "").toLowerCase().trim();
          if (s === "operativo") acc.operativo++;
          else if (s === "inoperativo") acc.inoperativo++;
          else if (s === "mantenimiento") acc.mantenimiento++;
        });
        return acc;
      },
      { operativo: 0, inoperativo: 0, mantenimiento: 0 }
    );

    const total = counts.operativo + counts.inoperativo + counts.mantenimiento;
    const disponibilidad = total ? Number(((counts.operativo / total) * 100).toFixed(2)) : 0;

    return {
      dateString: form.date,
      hours: String(hour).padStart(2, "0") + ":00",
      operativo: counts.operativo,
      inoperativo: counts.inoperativo,
      mantenimiento: counts.mantenimiento,
      disponibilidad,
    };
  });

  return result;
}, [data, form.date, form.shift]);

  return (
    <div className="flex-1 w-full bg-cover bg-no-repeat bg-center flex flex-col gap-4">
      <PageHeader
        title="Disponibilidad hora a hora"
        description={`Resumen de Estatus Operativo (Operativos, Mantenimiento, Fuera de Servicio) ${new Date().toLocaleDateString()}`}
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <>
            <DataExport data={dataFiltered} disabled={isFetching} />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={isFetching}
                  className="w-[140px] capitalize active:scale-100 justify-between px-2"
                >
                  <div className="flex  gap-2">
                    <CalendarIcon className="h-4 w-4 text-zinc-300" />
                    {form.date ? (
                      dayjs(form.date).format("DD MMM YYYY")
                    ) : (
                      <span>Fecha</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <Calendar
                  mode="single"
                  selected={form.date ? dayjs(form.date).toDate() : undefined}
                  onSelect={(d) => {
                    const formattedDate = dayjs(d).format("YYYY-MM-DD");
                    setForm({ ...form, date: formattedDate });
                  }}
                  initialFocus
                  locale={es}
                  disabled={(d) => {
                    const today = dayjs().startOf("day");
                    const tomorrow = today.add(1, "day");
                    return dayjs(d).isAfter(tomorrow, "day");
                  }}
                />
              </PopoverContent>
            </Popover>
            <div className="flex gap-2 h-8 w-[100px] relative">
              <select
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                className="border text-xs h-8 w-full flex items-center px-2 rounded-lg disabled:opacity-50 select-none appearance-none cursor-pointer"
                disabled={isFetching}
              >
                <option value="dia">Dia</option>
                <option value="noche">Noche</option>
              </select>
              <ChevronDown className="h-4 w-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 right-2" />
            </div>
          </>
        }
      />

      <div className="flex-1 grid grid-row-2 gap-2">
        <CardTitle
          title="Disponibilidad hora a hora"
          subtitle="Porcentaje de disponibilidad"
          icon={BrickWall}
          classIcon="text-[#74add1]"
        >
          <ChartAvailability
            data={dataFiltered}
            isLoading={isFetching}
            isError={isError}
          />
        </CardTitle>
        <CardTitle
          title="Cantidad de vehiculos por estado"
          subtitle="Resumen de Estatus Operativo (Operativos, Mantenimiento, Fuera de Servicio)"
          icon={BrickWall}
          classIcon="text-[#74add1]"
        >
          <TimelineStatus
            data={dataFiltered}
            isLoading={isFetching}
            isError={isError}
          />
        </CardTitle>
      </div>
    </div>
  );
};
