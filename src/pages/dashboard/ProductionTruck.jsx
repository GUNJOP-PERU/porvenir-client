import { Suspense, useEffect, lazy, useCallback } from "react";
import CardClock from "@/components/Dashboard/CardClock";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardHeatMap from "@/components/Dashboard/CardHeatMap";
import CardItem from "@/components/Dashboard/CardItem";
import CardPie from "@/components/Dashboard/CardPie";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconLoader from "@/icons/IconLoader";
import { useTruckStore } from "@/store/TruckStore";
import CardCycleWork from "@/components/Dashboard/CardCycleWork";
import { motion, AnimatePresence } from "motion/react";
import CardTitle from "@/components/Dashboard/CardTitle";
import IconDash1 from "@/icons/Dashboard/IconDash1";

function ProductionTruck() {
  const fetchTruckProgressDay = useTruckStore(
    (state) => state.fetchTruckProgressDay
  );
  const fetchTruckHeatmap = useTruckStore((state) => state.fetchTruckHeatmap);
  const fetchTruckJobCycle = useTruckStore((state) => state.fetchTruckJobCycle);
  const fetchTruckChartProductivity = useTruckStore(
    (state) => state.fetchTruckChartProductivity
  );
  const fetchTruckFleetData = useTruckStore(
    (state) => state.fetchTruckFleetData
  );
  const {
    progressDay,
    heatmap,
    chartProductivity,
    truckJobCycle,
    dataFleet,
    truckLoading,
  } = useTruckStore();

  const fetchData = useCallback(() => {
    fetchTruckProgressDay();
    fetchTruckHeatmap();
    fetchTruckJobCycle();
    fetchTruckChartProductivity();
    fetchTruckFleetData();
  }, [
    fetchTruckProgressDay,
    fetchTruckHeatmap,
    fetchTruckJobCycle,
    fetchTruckChartProductivity,
    fetchTruckFleetData,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useProductionWebSocket();

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_150px_repeat(auto-fit,minmax(150px,1fr))]">
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
          {truckLoading && (
            <AnimatePresence>
              <motion.div
                key="loading"
                className="bg-zinc-200 absolute top-0 left-0 w-full h-full rounded-2xl z-50 animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          )}
          <CardTitle
            title="Ruta vs Tonelaje"
            subtitle="   Comparación del tonelaje transportado en distintas rutas."
            icon={IconDash1}
          />
          <CardHeatMap data={heatmap} />
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
            <CardPie data={chartProductivity} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
          <Suspense fallback={<p>Loading...</p>}>
            <CardTitle
              title="Estado de Flota"
              subtitle="Disponibilidad y rendimiento de los vehículos."
              icon={IconDash1}
            />
            <CardPie data={dataFleet} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default ProductionTruck;
