import { useMemo, useState } from "react";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import CardTitle from "@/components/Dashboard/CardTitle";
import KPIWeek from "@/components/Dashboard/WeekReport/KPIWeek";
import TravelsWeek from "@/components/Dashboard/WeekReport/TravelsWeek";
import DestinyWeek from "@/components/Dashboard/WeekReport/DestinyWeek";
import AreaWeek from "@/components/Dashboard/WeekReport/AreaWeek";
import RemanejoWeek from "@/components/Dashboard/WeekReport/RemanejoWeek";
import SharedWeek from "@/components/Dashboard/WeekReport/SharedWeek";
import { generateNormalWeeks } from "@/components/Dashboard/WeekReport/MiningWeeksSelect";
import PageHeader from "@/components/PageHeader";
import { ChartNoAxesColumn, ChartPie, TrendingUp } from "lucide-react";

export default function WeekReport() {
  const { allWeeks, currentWeek } = generateNormalWeeks();
  const [selectedWeek, setSelectedWeek] = useState(
    currentWeek?.weekNumber?.toString() ?? ""
  );
  const [selectedRange, setSelectedRange] = useState(currentWeek ?? null);

  const handleChange = (weekNumber) => {
    setSelectedWeek(weekNumber);
    const week = allWeeks.find((w) => w.weekNumber.toString() === weekNumber);
    if (week) setSelectedRange(week);
  };

  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchGraphicData({
    queryKey: ["report-week", selectedRange],
    endpoint: "cycle/by-date-range",
    filters: selectedRange
      ? `startDate=${selectedRange.startTimestamp}&endDate=${selectedRange.endTimestamp}`
      : "",
  });

  const { data: dataPlan = [] } = useFetchGraphicData({
    queryKey: ["plan-week", selectedRange],
    endpoint: "planDay/by-date-range",
    filters: selectedRange
      ? `startDate=${selectedRange.startDate}&endDate=${selectedRange.endDate}`
      : "",
  });

  const { programmedMineral, programmedDesmonte } = useMemo(
    () =>
      dataPlan.reduce(
        (acc, item) => {
          const tonnage = item.tonnage || 0;
          if (item.phase?.toLowerCase() === "mineral")
            acc.programmedMineral += tonnage;
          if (item.phase?.toLowerCase() === "desmonte")
            acc.programmedDesmonte += tonnage;
          return acc;
        },
        { programmedMineral: 0, programmedDesmonte: 0 }
      ),
    [dataPlan]
  );

  return (
    <>
      <PageHeader
        title="Extracción, Remanejo y Historico"
        description="Administre los planes y sus caractestisticas."
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <div className="">
            <select
              className="h-8 px-2 border rounded-lg w-full text-xs"
              value={selectedWeek}
              onChange={(e) => handleChange(e.target.value)}
            >
              <option value="">-- Elige semana --</option>
              {allWeeks.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber.toString()}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <KPIWeek
        data={data}
        isLoading={isLoading}
        programmedMineral={programmedMineral}
        programmedDesmonte={programmedDesmonte}
      />
      <div className="flex-1 grid gap-2 grid-cols-1 xl:grid-cols-4">
        <div className="flex-1 flex flex-col col-span-1">
          <CardTitle
            title="Comparativo de viaje semanal"
            subtitle="Últimas 4 semanas"
            icon={TrendingUp}
            classIcon="text-[#0FC47A]"
            className="h-full bg-[#F0FFF7]/50 border-[#B3F1D8] shadow-[#B3F1D8]"
          >
            <SharedWeek />
          </CardTitle>
        </div>
        <div className="col-span-3 grid grid-cols-1  xl:grid-cols-2 gap-2">
          <CardTitle
            title="Evolución de viajes de la semana"
            subtitle="Total de viajes por dia"
           icon={ChartNoAxesColumn}
            classIcon="text-[#0FC47A]"
          >
            <TravelsWeek data={data} selectedRange={selectedRange} isLoading={isLoading} isError={isError} />
          </CardTitle>
          <CardTitle
            title="Zona destino de viajes"
            subtitle="Viajes mina y Superficie"
            icon={ChartPie}
            classIcon="text-[#019cfe]"
          >
            <AreaWeek data={data} isLoading={isLoading} isError={isError} />
          </CardTitle>
          <CardTitle
            title="Extracción Semanal - Viajes por Destino"
            subtitle="Tiempo de espera en la cola"
            icon={ChartNoAxesColumn}
            classIcon="text-[#6B46C1]"
          >
            <DestinyWeek data={data} selectedRange={selectedRange} isLoading={isLoading} isError={isError} />
          </CardTitle>
          <CardTitle
            title="Remanejo Semanal - Viajes"
            subtitle="Remanejo Semanal - Viajes"
            icon={ChartNoAxesColumn}
            classIcon="text-[#b3685b]"
          >
            <RemanejoWeek data={data} selectedRange={selectedRange} isLoading={isLoading} isError={isError} />
          </CardTitle>
        </div>
      </div>
    </>
  );
}
