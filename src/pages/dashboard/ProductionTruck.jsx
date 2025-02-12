import { Suspense, useEffect, lazy } from "react";
import CardClock from "@/components/Dashboard/CardClock";
import { CardCycleWork } from "@/components/Dashboard/CardCycleWork";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardPie from "@/components/Dashboard/CardPie";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconLoader from "@/icons/IconLoader";
import { useTruckStore } from "@/store/TruckStore";

const CardHeatMap = lazy(() => import("@/components/Dashboard/CardHeatmap"));

function ProductionTruck() {
  const fetchDataTruck = useTruckStore((state) => state.fetchDataTruck);
  const {
    progressDay,
    heatmap,
    chartProductivity,
    truckJobCycle,
    dataFleet,
    truckLoading,
  } = useTruckStore();

  useEffect(() => {
    fetchDataTruck();
  }, [fetchDataTruck]);

  useProductionWebSocket();

  return (
    <>
      <div className="w-full flex flex-wrap justify-between gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={progressDay?.total_mineral?.toLocaleString("es-MX") || 0}
          title="Mineral"
          valueColor="text-[#6399C7]"
          unid={"tn"}
          subtitle={`De ${progressDay?.travels?.mineral || 0} viajes`}
        />

        <CardItem
          value={progressDay?.total_waste || 0}
          title="Desmonte"
          valueColor="text-[#B16940]"
          unid={"tn"}
          subtitle={`De ${progressDay?.travels?.waste || 0} viajes`}
        />
        <CardItem
          value={progressDay?.percentage_success || 0}
          title="% Cumplimiento"
          change={progressDay?.percentage_success || 0}
          valueColor="text-green-600"
          unid={"%"}
        />
        <CardItem
          value={progressDay?.avg_time_cycle_min || 0}
          title="Tiempo Prom. / Ciclo"
          valueColor="text-amber-600"
          unid={"min"}
        />
        <CardItem
          value={progressDay?.disponibility?.value.toFixed(2) || 0}
          title="Disponiblidad"
          change={progressDay?.disponibility?.value || 0}
          valueColor="text-purple-600"
          unid={"%"}
        />
        <CardItem
          value={progressDay?.utilization?.value.toFixed(2) || 0}
          title="Utilización"
          valueColor="text-pink-600"
          unid={"%"}
        />
      </div>

      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardHeatMap data={heatmap} title="Ruta vs tonelaje" />
          </Suspense>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardCycleWork data={truckJobCycle} title="Ciclo de trabajo" />
          </Suspense>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardPie
              data={chartProductivity}
              title="Tiempos productivos vs improductivos"
            />
          </Suspense>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center bg-muted/50 p-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardPie data={dataFleet} title="Estado de Flota" />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default ProductionTruck;
