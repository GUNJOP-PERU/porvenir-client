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
  // const { data, isLoading } = useFetchDashboardData(
  //   "dashboardTruckProgressDay",
  //   "dashboard/truck/progress-day"
  // );
  // const { data: dataCycle, isLoading: loadingCycle } = useFetchDashboardData(
  //   "dashboardTruckJobCycle",
  //   "dashboard/truck/job-cycle"
  // );
  // const { data: dataHeatMap, isLoading: loadingHeatMap } =
  //   useFetchDashboardData("dashboardTruckHeatMap", "dashboard/truck/heatmap");

  // const { data: dataProductivity = [], isLoading: loadingProductivity } =
  //   useFetchDashboardData(
  //     "dashboardTruckChartProductivity",
  //     "dashboard/truck/chart-productivity"
  //   );
  // const { data: dataFleet = [], isLoading: loadingFleet } =
  //   useFetchDashboardData(
  //     "dashboardTruckChartFleet",
  //     "dashboard/truck/chart-fleet"
  //   );

  const fetchDataTruck = useProductionStore(
    (state) => state.fetchDataTruck
  );

  useEffect(() => {
    fetchDataTruck();
  }, []);

  useProductionWebSocket();
  const { progressDay, heatmap, chartProductivity, truckJobCycle, dataFleet } =
    useProductionStore();

  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={progressDay?.tonnage_acumulated}
          title="Total toneladas"
         
          valueColor="text-black-500"
          unid={"TN"}
        />
        <CardItem
          value={progressDay?.percentage_success}
          title="% cumplimiento"
          change={progressDay?.percentage_success}
          valueColor="text-red-500"
          unid={"%"}
        />
        <CardItem
          value={progressDay?.avg_time_cycle_min}
          title="Tiempo Prom. / Ciclo"
          
          valueColor="text-black-500"
          unid={"min"}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
            <CardHeatMap data={heatmap} title="Ruta vs tonelaje" />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4">
            <CardCycleWork data={truckJobCycle} title="Ciclo de trabajo" />
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
            <CardPie
              data={chartProductivity}
              title="Tiempos productivos vs improductivos"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
            <CardPie data={dataFleet} title="Estado de Flota" />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardTruck;
