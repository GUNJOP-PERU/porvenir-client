import CardItem from "@/components/Dashboard/Card";
import CardClock from "@/components/Dashboard/CardClock";
import { CardCycleWork } from "@/components/Dashboard/CardCycleWork";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardHeatMap from "@/components/Dashboard/CardHeatmap";
import CardPie from "@/components/Dashboard/CardPie";

import { useFetchDashboardData } from "@/hooks/useGlobalQuery";

function DashboardTruck() {
  const { data, isLoading } = useFetchDashboardData(
    "dashboardTruckProgressDay",
    "dashboard/truck/progress-day"
  );
  const { data: dataCycle, isLoading: loadingCycle } = useFetchDashboardData(
    "dashboardTruckJobCycle",
    "dashboard/truck/job-cycle"
  );
  const { data: dataHeatMap, isLoading: loadingHeatMap } =
    useFetchDashboardData("dashboardTruckHeatMap", "dashboard/truck/heatmap");

  const { data: dataProductivity = [], isLoading: loadingProductivity } =
    useFetchDashboardData(
      "dashboardTruckChartProductivity",
      "dashboard/truck/chart-productivity"
    );
  const { data: dataFleet = [], isLoading: loadingFleet } =
    useFetchDashboardData(
      "dashboardTruckChartFleet",
      "dashboard/truck/chart-fleet"
    );

  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={data?.tonnage_acumulated}
          title="Total toneladas"
          change="2.56 - 0.91% esta semana"
          valueColor="text-black-500"
          unid={"TN"}
        />
        <CardItem
          value={data?.percentage_success}
          title="% cumplimiento"
          change="2.56 - 0.91% esta semana"
          valueColor="text-red-500"
          unid={"%"}
        />
        <CardItem
          value={data?.avg_time_cycle_min}
          title="Tiempo Prom. / Ciclo"
          change="2.56 - 0.91% esta semana"
          valueColor="text-black-500"
          unid={"min"}
        />
        <CardItem
          value={data?.avg_time_dump_min}
          title="Tiempo Prom. / Ciclo"
          change="2.56 - 0.91% esta semana"
          valueColor="text-red-500"
          unid={"min"}
        />
        <CardItem
          value={data?.avg_time_empty_min}
          title="Ratio cargado / vacio"
          change="2.56 - 0.91% esta semana"
          valueColor="text-red-500"
          unid={"min"}
        />
        <CardItem
          value={data?.avg_time_load_min}
          title="Tiempo Prom / Transporte"
          change="2.56 - 0.91% esta semana"
          valueColor="text-red-500"
          unid={"min"}
        />
        <CardItem
          value={data?.avg_time_transport_min}
          title="% cumplimiento"
          change="2.56 - 0.91% esta semana"
          valueColor="text-red-500"
          unid={"min"}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
            <CardHeatMap data={dataHeatMap} title="Ruta vs tonelaje" />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4">
            <CardCycleWork data={dataCycle} title="Ciclo de trabajo" />
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
            <CardPie
              data={dataProductivity}
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
