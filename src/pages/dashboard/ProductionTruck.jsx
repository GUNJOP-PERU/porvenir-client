import CardClock from "@/components/Dashboard/CardClock";
import CardCycleWork from "@/components/Dashboard/CardCycleWork";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardHeatMap from "@/components/Dashboard/CardHeatmap";

import CardItem from "@/components/Dashboard/CardItem";
import CardPie from "@/components/Dashboard/CardPie";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import { useTruckStore } from "@/store/TruckStore";
import { Suspense, useCallback, useEffect } from "react";

function ProductionTruck() {
  const fetchTruckProgressDay = useTruckStore(
    (state) => state.fetchTruckProgressDay
  );
  const fetchTruckJobCycle = useTruckStore((state) => state.fetchTruckJobCycle);

  const {
    progressDay,
   
    truckJobCycle,
  } = useTruckStore();

  const fetchData = useCallback(() => {
    fetchTruckProgressDay();
   
    fetchTruckJobCycle();
  }, [
    fetchTruckProgressDay,
   
    fetchTruckJobCycle,

  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useProductionWebSocket();

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(150px,1fr))]">
        <CardGauge />
       
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
          value={progressDay?.disponibility?.value?.toFixed(2) || 0}
          title="Disponiblidad"
          change={progressDay?.disponibility?.value || 0}
          valueColor="text-purple-600"
          unid={"%"}
        />
        <CardItem
          value={progressDay?.utilization?.value?.toFixed(2) || 0}
          title="Utilización"
          change={progressDay?.utilization?.value || 0}
          valueColor="text-pink-600"
          unid={"%"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl first-line:relative">
          <CardTitle
            title="Ruta vs Tonelaje"
            subtitle="   Comparación del tonelaje transportado en distintas rutas."
            icon={IconDash1}
          />
          <CardHeatMap  />
        </div>
        <div className="flex flex-col gap-2 border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl relative">
          <Suspense fallback={<p>Loading...</p>}>
            <CardTitle
              title="Ciclo de Trabajo"
              subtitle=" Duración y fases del proceso operativo."
              icon={IconDash1}
            />
            <CardCycleWork data={truckJobCycle} title="Ciclo de trabajo" />
          </Suspense>
        </div>
        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardTitle
              title="Tiempos productivos vs Improductivos"
              subtitle="Comparación entre trabajo efectivo y tiempo perdido."
              icon={IconDash1}
            />
            <CardPie  symbol="dashboard/truck/chart-productivity" socketEvent="truck-chart-productivity" />
          </Suspense>
        </div>
        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardTitle
              title="Estado de Flota"
              subtitle="Disponibilidad y rendimiento de los vehículos."
              icon={IconDash1}
            />
        <CardPie  symbol="dashboard/truck/chart-fleet" socketEvent="truck-chart-fleet"/>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default ProductionTruck;


// <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
//           <CardTitle
//             title="Tiempos productivos vs Improductivos"
//             subtitle="Comparación entre trabajo efectivo y tiempo perdido."
//             icon={IconDash1}
//           />
//           <CardPie  symbol="dashboard/truck/chart-productivity" socketEvent="truck-chart-productivity" />
//         </div>
//         <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
//           <CardTitle
//             title="Estado de Flota"
//             subtitle="Disponibilidad y rendimiento de los vehículos."
//             icon={IconDash1}
//           />
//           <CardPie  symbol="dashboard/truck/chart-fleet" socketEvent="truck-chart-fleet"/>
//         </div>