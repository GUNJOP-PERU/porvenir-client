import { useMemo, useState } from "react";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import CardTitle from "@/components/Dashboard/CardTitle";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import KPIWeek from "@/components/Dashboard/WeekReport/KPIWeek";
import TravelsWeek from "@/components/Dashboard/WeekReport/TravelsWeek";
import DestinyWeek from "@/components/Dashboard/WeekReport/DestinyWeek";
import AreaWeek from "@/components/Dashboard/WeekReport/AreaWeek";
import RemanejoWeek from "@/components/Dashboard/WeekReport/RemanejoWeek";
import SharedWeek from "@/components/Dashboard/WeekReport/SharedWeek";
import MiningWeeksSelect from "@/components/Dashboard/WeekReport/MiningWeeksSelect";
import PageHeader from "@/components/PageHeader";

export default function WeekReport() {
  const [selectedRange, setSelectedRange] = useState(null);

  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchGraphicData({
    queryKey: ["week-report", selectedRange],
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
        actions={<MiningWeeksSelect onChange={setSelectedRange} />}
      />

      <KPIWeek
        data={data}
        programmedMineral={programmedMineral}
        programmedDesmonte={programmedDesmonte}
      />
      <div className="flex-1 grid gap-2 grid-cols-1 xl:grid-cols-4">
        <div className="flex-1 flex flex-col col-span-1">
          <CardTitle
            title="Comparativo de viaje semanal"
            subtitle="Remanejo Semanal - Viajes"
            icon={IconDash1}
            className="h-full"
          >
            <SharedWeek />
          </CardTitle>
        </div>
        <div className="col-span-3 grid grid-cols-1  xl:grid-cols-2 gap-2">
          <CardTitle
            title="Evolución de viajes de la semana"
            subtitle="Total de viajes por dia"
            icon={IconDash1}
          >
            <TravelsWeek data={data} isLoading={isLoading} isError={isError} />
          </CardTitle>
          <CardTitle
            title="Zona destino de viajes"
            subtitle="Viajes mina y Superficie"
            icon={IconDash1}
          >
            <AreaWeek data={data} isLoading={isLoading} isError={isError} />
          </CardTitle>
          <CardTitle
            title="Extracción Semanal - Viajes por Destino"
            subtitle="Tiempo de espera en la cola"
            icon={IconDash1}
          >
            <DestinyWeek data={data} isLoading={isLoading} isError={isError} />
          </CardTitle>
          <CardTitle
            title="Remanejo Semanal - Viajes"
            subtitle="Remanejo Semanal - Viajes"
            icon={IconDash1}
          >
            <RemanejoWeek data={data} isLoading={isLoading} isError={isError} />
          </CardTitle>
        </div>
      </div>
    </>
  );
}
