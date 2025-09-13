import { ButtonRefresh } from "@/components/ButtonRefresh";
import Body from "@/components/Dashboard/TimeDistribution/Body";
import PageHeader from "@/components/PageHeader";
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

  const { data: progressDay = [], refetch: refetchProgressDay } = useFetchGraphicData({
    queryKey: "progress-day-history",
    endpoint: "dashboard-dates/progress-day",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}`,
  });

  const {
    data: jobCycle = [],
    isLoading: isLoadingJobCycle,
    isError: isErrorJobCycle,
    refetch: refetchJobCycle,
    isFetching: isFetchingJobCycle,
  } = useFetchGraphicData({
    queryKey: "job-cycle-history",
    endpoint: "dashboard-dates/job-cycle",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}`,
  });

  const {
    data: improductiveActivities = [],
    isLoading: isLoadingImproductiveActivities,
    isError: isErrorImproductiveActivities,
    refetch: refetchImproductive,
    isFetching: isFetchingImproductive,
  } = useFetchGraphicData({
    queryKey: "improductive-activities-history",
    endpoint: "dashboard-dates/no-productive-activities-chart",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}&quantity=7`,
  });
  const {
    data: timelineTrucks = [],
    isLoading: isLoadingTimelineTrucks,
    isError: isErrorTimelineTrucks,
    refetch: refetchTimelineTrucks,
    isFetching: isFetchingTimelineTrucks,
  } = useFetchGraphicData({
    queryKey: "activities-per-hour-history",
    endpoint: "dashboard-dates/activities-per-hour",
    filters: `equipment=truck&startDate=${form.date}&endDate=${form.date}&shift=${form.shift}`,
  });

  const handleRefreshAll = () => {
    refetchProgressDay();
    refetchJobCycle();
    refetchImproductive();
    refetchTimelineTrucks();
  };

  return (
    <>
      <PageHeader
        title="Distribución de tiempos volquetes Historial"
        description="Historial"
        refetch={handleRefreshAll}
        isFetching={isFetchingJobCycle || isFetchingImproductive || isFetchingTimelineTrucks}
        actions={
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={isFetchingJobCycle || isFetchingImproductive || isFetchingTimelineTrucks}
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
                disabled={isFetchingJobCycle || isFetchingImproductive || isFetchingTimelineTrucks}
              >
                <option value="dia">Dia</option>
                <option value="noche">Noche</option>
              </select>
              <ChevronDown className="h-4 w-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 right-2" />
            </div>
          </>
        }
      />

      <Body
        progressDay={progressDay}
        jobCycle={jobCycle}
        isLoadingJobCycle={isLoadingJobCycle || isFetchingJobCycle}
        isErrorJobCycle={isErrorJobCycle}
        improductiveActivities={improductiveActivities}
        isLoadingImproductiveActivities={isLoadingImproductiveActivities || isFetchingImproductive}
        isErrorImproductiveActivities={isErrorImproductiveActivities}
        timelineTrucks={timelineTrucks}
        isLoading={isLoadingTimelineTrucks || isFetchingTimelineTrucks}
        isError={isErrorTimelineTrucks}
      />
    </>
  );
}
