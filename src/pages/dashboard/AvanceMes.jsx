import CardClock from "@/components/Dashboard/CardClock";
import CardColum from "@/components/Dashboard/CardColum";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardRange from "@/components/Dashboard/CardRange";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function DashboardAvanceMes() {
  const fetchDataMonth = useProductionStore((state) => state.fetchDataMonth);

  useEffect(() => {
    fetchDataMonth();
  }, []);

  useProductionWebSocket();
  const {
    dataAccumulatedProgress,
    dataChartToness,
    dataRangeTruck,
    dataRangeScoop,
  } = useProductionStore();

  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={dataAccumulatedProgress?.monthly_goal?.value.toLocaleString(
            "es-MX"
          )}
          title="Meta del mes"
          valueColor="text-[#134E4A]"
          unid="tn"
        />
        <CardItem
          value={dataAccumulatedProgress?.total_monthly?.value.toLocaleString(
            "es-MX"
          )}
          title="Total Toneladas Mes"
          valueColor="text-[#84CC16]"
          unid="tn"
        />
        <CardItem
          value={dataAccumulatedProgress?.percentage_succeded.value.toFixed(1)}
          title="% Cumplimiento"
          change={dataAccumulatedProgress?.percentage_succeded.value.toFixed(1)}
          valueColor="text-[#FBB723]"
          unid="%"
        />
        <CardItem
          value={dataAccumulatedProgress?.total_shift_day.value.toLocaleString(
            "es-MX"
          )}
          title="Total Toneladas Dia"
         
          valueColor="text-[#EB8F26]"
          unid="tn"
        />
        <CardItem
          value={dataAccumulatedProgress?.total_shift_night.value.toLocaleString(
            "es-MX"
          )}
          title="Total Toneladas Noche"
         
          valueColor="text-[#65558F]"
          unid="tn"
        />
        <CardItem
          value={dataAccumulatedProgress?.average_journal.value.toFixed(1)}
          title="Tiempo Prom. Truck"
         
          valueColor="text-[#1E64FA]"
          unid="h"
        />
        <CardItem
          value={dataAccumulatedProgress?.average_time_scoop.value}
          title="Tiempo Prom. Scoop"
         
          valueColor="text-[#A855F7]"
          unid="h"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 ">
        <div className=" bg-muted/50 rounded-2xl flex flex-col gap-1 px-4 p-3">
          <h4 className="text-xs font-bold">
            Tonelaje - Planificado vs Ejecutado
          </h4>
          <CardColum data={dataChartToness} />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2  bg-muted/50 p-4 rounded-2xl">
            <h4 className="text-xs font-bold">
              Rango de horario de trabajo Camiones
            </h4>
            <CardRange data={dataRangeTruck} />
          </div>
          <div className="flex flex-col gap-2  bg-muted/50 p-4 rounded-2xl">
            <h4 className="text-xs font-bold">
              Rango de horario de trabajo Scooptram
            </h4>
            <CardRange data={dataRangeScoop} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardAvanceMes;
