import { useState } from "react";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import ParetoTime from "@/components/Dashboard/UnproductiveReport/ParetoTime";
import UnproductiveTime from "@/components/Dashboard/UnproductiveReport/UnproductiveTime";
import WeeklyEvolution from "@/components/Dashboard/UnproductiveReport/WeeklyEvolution";
import CardTitle from "@/components/Dashboard/CardTitle";
import { generateNormalWeeks } from "@/components/Dashboard/WeekReport/MiningWeeksSelect";
import PageHeader from "@/components/PageHeader";
import UnproductiveType from "@/components/Dashboard/UnproductiveReport/UnproductiveType";
import { Activity, ChartPie, TrendingUp } from "lucide-react";

export default function UnproductiveReport() {
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
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useFetchGraphicData({
    queryKey: "report-unproductive",
    endpoint: "activity",
    filters: `startDate=${selectedRange.startDate}&endDate=${selectedRange.endDate}&activityType=no productive`,
  });

  return (
    <>
      <PageHeader
        title="Reporte de Inproductivos Semanal"
        description="Viajes de remanejo no considerados"
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

      <div className="flex-1 grid gap-2 grid-cols-1 xl:grid-cols-5">
        <div className="flex-1 flex flex-col col-span-1 xl:col-span-2">
          <CardTitle
            title="Evolución Semanal"
            subtitle="De las ultimas 4 semanas"
            icon={Activity}
            classIcon="text-[#42A3B1]"
            className="h-full bg-sky-50/50 border-sky-200 shadow-sky-200"
          >
            <WeeklyEvolution />
          </CardTitle>
        </div>
        <div className="col-span-1 xl:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-2">
          <CardTitle
            title="Pareto de Tiempo Improductivo (Hrs)"
            subtitle="Tiempo de espera en la cola"
            icon={TrendingUp}
            classIcon="text-[#41b3ff]"
            className="xl:col-span-2"
          >
            <ParetoTime
              data={data}
              limit={10}
              isLoading={isLoading}
              isError={isError}
            />
          </CardTitle>
          <CardTitle
            title="Tiempo Improductivo (Hrs)"
            subtitle="Total de inproductividad"
            icon={TrendingUp}
            classIcon="text-[#0FC47A]"
          >
            <UnproductiveTime
              data={data}
              selectedRange={selectedRange}
              isLoading={isLoading}
              isError={isError}
            />
          </CardTitle>
          <CardTitle
            title="Improductivo por Tipo (Hrs)"
            subtitle="Codigo de actividad"
            icon={ChartPie}
            classIcon="text-[#FF9500]"
          >
            <UnproductiveType
              data={data}
              selectedRange={selectedRange}
              isLoading={isLoading}
              isError={isError}
            />
          </CardTitle>
        </div>
      </div>
    </>
  );
}
