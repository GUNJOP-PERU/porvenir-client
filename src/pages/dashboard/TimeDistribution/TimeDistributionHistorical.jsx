import { ButtonRefresh } from "@/components/ButtonRefresh";
import Body from "@/components/Dashboard/TimeDistribution/Body";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import { getDefaultDate, getDefaultShift } from "@/lib/utilsGeneral";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TimeDistributionHistorical() {
  const [form, setForm] = useState({
    date: getDefaultDate(),
    shift: getDefaultShift(),
  });

  const { data: progressDay = [] } = useFetchGraphicData({
    queryKey: "progress-day-history",
    endpoint: "dashboard-dates/progress-day",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}`,
  });

  const {
    data: jobCycle = [],
    isLoading: isLoadingJobCycle,
    isError: isErrorJobCycle,
  } = useFetchGraphicData({
    queryKey: "job-cycle-history",
    endpoint: "dashboard-dates/job-cycle",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}`,
  });

  
  const {
    data: improductiveActivities = [],
    isLoading: isLoadingImproductiveActivities,
    isError: isErrorImproductiveActivities,
  } = useFetchGraphicData({
    queryKey: "improductive-activities-history",
    endpoint: "dashboard-dates/no-productive-activities-chart",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}&quantity=7`,
  });
  const {
    data: timelineTrucks = [],
    isLoading: isLoadingTimelineTrucks,
    isError: isErrorTimelineTrucks,
    isFetching,
  } = useFetchGraphicData({
    queryKey: "activities-per-hour-history",
    endpoint: "dashboard-dates/activities-per-hour",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}`,
  });

  return (
    <>
      <div className="flex flex-wrap justify-between items-center py-2">
        <h1 className="text-lg font-bold leading-none">
          Distribución de tiempos volquetes Historial
          <small className="text-zinc-400">
            (Viajes de remanejo no considerados)
          </small>
        </h1>
        <div className="flex gap-2">
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
        </div>
      </div>

      <Body
        progressDay={progressDay}
        jobCycle={jobCycle}
        isLoadingJobCycle={isLoadingJobCycle}
        isErrorJobCycle={isErrorJobCycle}
        improductiveActivities={improductiveActivities}
        isLoadingImproductiveActivities={isLoadingImproductiveActivities}
        isErrorImproductiveActivities={isErrorImproductiveActivities}
        timelineTrucks={timelineTrucks}
        isLoading={isLoadingTimelineTrucks}
        isError={isErrorTimelineTrucks}
      />
    </>
  );
}
