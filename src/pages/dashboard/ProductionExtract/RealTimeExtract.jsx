import { useFetchDataRealtime } from "@/hooks/useGraphicData";
import { filterData } from "@/lib/utilsGeneral";
import { useSocketTopicValue } from "@/hooks/useSocketValue";
import Body from "@/components/Dashboard/ProductionExtract/Body";
import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";

export default function RealTimeExtract() {
  useSocketTopicValue("cycle-current-shift-list", [
    "shift-variable",
    "production-extract-realtime",
  ]);
  useSocketTopicValue("cycle-current-shift-list", [
    "shift-variable",
    "production-extract-realtime",
  ]);
  useSocketTopicValue("planday/current", [
    "shift-variable",
    "plan-extract-realtime",
  ]);

  const {
    data: currentData = [],
    isLoading,
    isError,
  } = useFetchDataRealtime({
    queryKey: ["shift-variable", "production-extract-realtime"],
    endpoint: "cycle/by-current-shift",
  });

  const { data: dataPlanRealtime = [] } = useFetchDataRealtime({
    queryKey: ["shift-variable", "plan-extract-realtime"],
    endpoint: "planDay/byDay",
  });

  const { programmedTonnageMineral, programmedTonnageDesmonte } = useMemo(
    () =>
      dataPlanRealtime.reduce(
        (acc, item) => {
          const tonnage = item.tonnage || 0;
          if (item.phase?.toLowerCase() === "mineral" || item.phase?.toLowerCase() === "Transporte / producción")
            acc.programmedTonnageMineral += tonnage;
          if (item.phase?.toLowerCase() === "desmonte" || item.phase?.toLowerCase() === "avance")
            acc.programmedTonnageDesmonte += tonnage;
          return acc;
        },
        { programmedTonnageMineral: 0, programmedTonnageDesmonte: 0 }
      ),
    [dataPlanRealtime]
  );

  const filteredData = useMemo(() => filterData(currentData), [currentData]);
  const shift = useMemo(() => {
    if (!dataPlanRealtime?.length) return "dia";
    return dataPlanRealtime[0].shift || "dia";
  }, [dataPlanRealtime]);
  
  return (
    <>
      <PageHeader
        title="Carguío y Transporte / Tiempo Real"
        description="Viajes de remanejo no considerados"
      />

      <Body
        dataPlanTurno={dataPlanRealtime}
        programmedTonnageMineral={programmedTonnageMineral}
        programmedTonnageDesmonte={programmedTonnageDesmonte}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
        shift={shift}
      />
    </>
  );
}
