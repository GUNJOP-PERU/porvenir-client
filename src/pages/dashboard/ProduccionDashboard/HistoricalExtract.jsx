import { useMemo, useState } from "react";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import {
  filterData,
  getDefaultDate,
  getDefaultShift,
  getShiftRangeMs,
  toInputDate,
} from "@/lib/utilsGeneral";
import Body from "@/components/Dashboard/ProductionExtract/Body";
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
import { DataExport } from "@/components/Table/DataExport";
import PageHeader from "@/components/PageHeader";

export default function HistoricalExtract() {
  const [form, setForm] = useState({
    date: getDefaultDate(),
    shift: getDefaultShift(),
  });

  const range = getShiftRangeMs(form.date, form.shift);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useFetchGraphicData({
    queryKey: ["production-extract-history", form.date, form.shift],
    endpoint: "cycle/by-date-range",
    filters: `startDate=${range.startMs}&endDate=${range.endMs}`,
  });

  const { data: dataPlan = [] } = useFetchGraphicData({
    queryKey: "plan-extract-history",
    endpoint: "planDay/by-date-range",
    filters: `startDate=${toInputDate(form.date)}&endDate=${toInputDate(
      form.date
    )}`,
  });

  const filteredPlanByShift = useMemo(
    () =>
      dataPlan.filter(
        (item) => item.shift?.toLowerCase() === form.shift.toLowerCase()
      ),
    [dataPlan, form.shift]
  );

  const { programmedTonnageMineral, programmedTonnageDesmonte } = useMemo(
    () =>
      filteredPlanByShift.reduce(
        (acc, item) => {
          const tonnage = item.tonnage || 0;
          if (item.phase?.toLowerCase() === "mineral")
            acc.programmedTonnageMineral += tonnage;
          if (item.phase?.toLowerCase() === "desmonte")
            acc.programmedTonnageDesmonte += tonnage;
          return acc;
        },
        { programmedTonnageMineral: 0, programmedTonnageDesmonte: 0 }
      ),
    [filteredPlanByShift]
  );

  const filteredData = useMemo(() => filterData(data), [data]);

  return (
    <>
      <PageHeader
        title="Reporte de Extracción / Histórico"
        description="Viajes de remanejo no considerados"
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <>
            <>
              <DataExport data={filteredData} disabled={isFetching} />
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
          </>
        }
      />
      <Body
        dataPlanTurno={filteredPlanByShift}
        programmedTonnageMineral={programmedTonnageMineral}
        programmedTonnageDesmonte={programmedTonnageDesmonte}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
        shift={form.shift}
      />
    </>
  );
}
