import CardClock from "@/components/Dashboard/CardClock";
import CardColum from "@/components/Dashboard/CardColum";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardRange from "@/components/Dashboard/CardRange";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function ProductionMonth() {
  const fetchDataMonth = useProductionStore((state) => state.fetchDataMonth);

  // useProductionWebSocket();
  const dataAccumulatedProgress = useProductionStore(
    (state) => state.dataAccumulatedProgress
  );
  const dataChartToness = useProductionStore((state) => state.dataChartToness);
  const dataRangeTruck = useProductionStore((state) => state.dataRangeTruck);
  const dataRangeScoop = useProductionStore((state) => state.dataRangeScoop);

  useEffect(() => {
    if (dataAccumulatedProgress.length === 0) {
      fetchDataMonth();
    }
  }, []);

 
  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={
            dataAccumulatedProgress?.monthly_goal?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Meta del mes"
          valueColor="text-[#134E4A]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.total_monthly?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Total Toneladas Mes"
          valueColor="text-[#84CC16]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.percentage_succeded?.value?.toFixed(1) || 0
          }
          title="% Cumplimiento"
          change={
            dataAccumulatedProgress?.percentage_succeded?.value?.toFixed(1) || 0
          }
          valueColor="text-[#FBB723]"
          unid="%"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.total_shift_day?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Total Toneladas Dia"
          valueColor="text-[#EB8F26]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.total_shift_night?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Total Toneladas Noche"
          valueColor="text-[#65558F]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.average_journal?.value?.toFixed(1) || 0
          }
          title="Tiempo Prom. Truck"
          valueColor="text-[#1E64FA]"
          unid="h"
        />
        <CardItem
          value={dataAccumulatedProgress?.average_time_scoop?.value.toFixed(2) || 0}
          title="Tiempo Prom. Scoop"
          valueColor="text-[#A855F7]"
          unid="h"
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-4 md:grid-cols-2">
        <div className="col-span-2 bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardColum data={dataChartToness} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardRange
            data={dataRangeTruck}
            title="Rango de horario de trabajo Camiones"
          />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardRange
            data={dataRangeScoop}
            title="Rango de horario de trabajo Scooptram"
          />
        </div>
      </div>
    </>
  );
}

export default ProductionMonth;
