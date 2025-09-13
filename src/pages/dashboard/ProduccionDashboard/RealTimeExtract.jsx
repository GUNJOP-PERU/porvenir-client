import { useFetchDataRealtime } from "@/hooks/useGraphicData";
import { filterData } from "@/lib/utilsGeneral";
import { useSocketTopicValue } from "@/hooks/useSocketValue";
import Body from "@/components/Dashboard/ProductionExtract/Body";
import { useMemo } from "react";

export default function RealTimeExtract() {

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
          if (item.phase?.toLowerCase() === "mineral")
            acc.programmedTonnageMineral += tonnage;
          if (item.phase?.toLowerCase() === "desmonte")
            acc.programmedTonnageDesmonte += tonnage;
          return acc;
        },
        { programmedTonnageMineral: 0, programmedTonnageDesmonte: 0 }
      ),
    [dataPlanRealtime]
  );

  const filteredData = useMemo(() => filterData(currentData), [currentData]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold leading-none">
          Reporte de Extracción / Tiempo Real{" "}
          <small className="text-zinc-400">
            (Viajes de remanejo no considerados)
          </small>
        </h1>
      </div>
      <Body
        dataPlanTurno={dataPlanRealtime}
        programmedTonnageMineral={programmedTonnageMineral}
        programmedTonnageDesmonte={programmedTonnageDesmonte}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
        shift="dia"
      />
    </>
  );
}