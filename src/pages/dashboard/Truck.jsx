import CardItem from "@/components/Dashboard/CardItem";
import CardClock from "@/components/Dashboard/CardClock";
import { CardCycleWork } from "@/components/Dashboard/CardCycleWork";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardHeatMap from "@/components/Dashboard/CardHeatmap";
import CardPie from "@/components/Dashboard/CardPie";

import { useFetchDashboardData } from "@/hooks/useGlobalQuery";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function DashboardTruck() {
  const fetchDataTruck = useProductionStore((state) => state.fetchDataTruck);
  const { progressDay, heatmap, chartProductivity, truckJobCycle, dataFleet } =
    useProductionStore();

  useEffect(() => {
    if (progressDay.length === 0) {
      fetchDataTruck();
    }
  }, [fetchDataTruck, progressDay]);

  useProductionWebSocket();

  console.log(progressDay,"progressDay");
  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        {/* <CardItem
          value={progressDay?.tonnage_acumulated || 0 }
          title="Total toneladas"
          valueColor="text-black-500"
          unid={"TN"}
        /> */}
        <CardItem
          value={progressDay?.percentage_success || 0}
          title="% cumplimiento"
          change={progressDay?.percentage_success || 0}
          valueColor="text-red-500"
          unid={"%"}
        />
        <CardItem
          value={progressDay?.avg_time_cycle_min || 0}
          title="Tiempo Prom. / Ciclo"
          valueColor="text-black-500"
          unid={"min"}
        />
      </div>

      <div className="flex-1 grid grid-rows-2 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl  ">
          <CardHeatMap data={heatmap} title="Ruta vs tonelaje" />
        </div>
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl  ">
          <CardCycleWork data={truckJobCycle} title="Ciclo de trabajo" />
        </div>
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl  ">
          <CardPie
            data={chartProductivity}
            title="Tiempos productivos vs improductivos"
          />
        </div>
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl  ">
          <CardPie data={dataFleet} title="Estado de Flota" />
        </div>
      </div>
    </>
  );
}

export default DashboardTruck;
