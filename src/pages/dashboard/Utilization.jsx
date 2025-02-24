import CardClock from "@/components/Dashboard/CardClock";
import CardColumUtilization from "@/components/Dashboard/CardColumUtilization";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";
import CardVelocity from "@/components/Dashboard/CardVelocity";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconDash1 from "@/icons/Dashboard/IconDash1";
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
       <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(150px,1fr))]">
        <CardGauge />
     
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
        <CardItem
          value={progressVelocity?.velocities?.max_empty?.value?.toFixed(1) || 0}
          title="Velocidad máxima vacío"         
          valueColor="text-red-500"
          unid={"km/h"}
        />
        <CardItem
          value={progressVelocity?.velocities?.max_loaded?.value?.toFixed(1) || 0}
          title="Velocidad máxima cargado"         
          valueColor="text-red-500"
          unid={"km/h"}
        />
        <CardItem
          value={progressVelocity?.velocities?.min_empty?.value?.toFixed(1) || 0}
          title="Velocidad mínima vacío"         
          valueColor="text-red-500"
          unid={"km/h"}
        />
        <CardItem
          value={progressVelocity?.velocities?.min_loaded?.value?.toFixed(1) || 0}
          title="Velocidad mínima cargado"         
          valueColor="text-red-500"
          unid={"km/h"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2  border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
        <CardTitle
            title="Produccion (Ton) / Utilizacion (%)"
            subtitle="Relación entre tonelaje producido y porcentaje de uso."
            icon={IconDash1}
          />
          <CardColumUtilization data={chartUtility} />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title="Análisis de velocidad rutas a Parrillas"
            subtitle="Evaluación de la velocidad en rutas hacia Parrillas."
            icon={IconDash1}
          />
          <CardVelocity
            data={velocityParrilla}
           
          />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title="Análisis de velocidad rutas a Canchas"
            subtitle="Evaluación de la velocidad en rutas hacia Canchas."
            icon={IconDash1}
          />
          <CardVelocity
            data={velocityCancha}
            
          />
        </div>
      </div>
    </>
  );
}

export default Utilization;
