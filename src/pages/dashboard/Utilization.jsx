import CardClock from "@/components/Dashboard/CardClock";
import CardColumUtilization from "@/components/Dashboard/CardColumUtilization";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardVelocity from "@/components/Dashboard/CardVelocity";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useUtilizationStore } from "@/store/UtilizationStore";
import { useEffect } from "react";

function Utilization() {
  const fetchDataUtilization = useUtilizationStore(
    (state) => state.fetchDataUtilization
  );
  const { progressVelocity, chartUtility, velocityParrilla, velocityCancha } =
    useUtilizationStore();

  useEffect(() => {
    fetchDataUtilization();
  }, [fetchDataUtilization]);

  useProductionWebSocket();

  return (
    <>
      <div className="w-full flex flex-wrap justify-between gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={progressVelocity?.total_tonnages?.toLocaleString("es-MX") || 0}
          title="Total de toneladas"
          valueColor="text-[#6399C7]"
          unid={"tn"}
        />
        <CardItem
          value={progressVelocity?.percentage_success?.toFixed(1) || 0}
          title="%Cumplimiento"
          change={progressVelocity?.percentage_success || 0}
          valueColor="text-red-500"
          unid={"%"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2 bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardColumUtilization data={chartUtility} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardVelocity
            data={velocityParrilla}
            title="Análisis de velocidad rutas a Parrillas"
          />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardVelocity
            data={velocityCancha}
            title="Análisis de velocidad rutas a Canchas"
          />
        </div>
      </div>
    </>
  );
}

export default Utilization;
