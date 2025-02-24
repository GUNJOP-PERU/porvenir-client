import CardActivitiesChart from "@/components/Dashboard/CardActivitiesChart";
import CardClock from "@/components/Dashboard/CardClock";
import CardColumImpact from "@/components/Dashboard/CardColumImpact";
import CardColumParetoScoop from "@/components/Dashboard/CardColumParetoScoop";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import { useParetoScoopStore } from "@/store/ParetoScoopStore";
import { useEffect } from "react";

function ParetoScoop() {
  const fetchParetoScoop = useParetoScoopStore(
    (state) => state.fetchParetoScoop
  );
  const {
    scoopParetoProgress,
    scoopParetoNoProductive,
    scoopParetoActivitiesChart,
    scoopImpactDiagram,
  } = useParetoScoopStore();

  useEffect(() => {
    fetchParetoScoop();
  }, [fetchParetoScoop]);

  useProductionWebSocket();

  return (
    <>
       <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(150px,1fr))]">
        <CardGauge />
      
        <CardItem
          value={scoopParetoProgress?.total_events || 0}
          title="Total de eventos"
          valueColor="text-[#6399C7]"
          unid={"evt"}
        />
        <CardItem
          value={scoopParetoProgress?.data?.total_lost?.toFixed(1) || 0}
          title="Tiempo total perdido"
          valueColor="text-[#6399C7]"
          unid={"h"}
        />
        <CardItem
          value={
            scoopParetoProgress?.data?.avg_planned_activities?.toFixed(1) || 0
          }
          title="Prom. Parada por Mantenimiento"
          valueColor="text-[#FF9500]"
          unid={"h"}
        />
        <CardItem
          value={
            scoopParetoProgress?.data?.avg_unplanned_activities?.toFixed(1) || 0
          }
          title="Prom. Horas Improductivas No Gerenciales"
          valueColor="text-[#347AE2]"
          unid={"h"}
        />
        <CardItem
          value={
            scoopParetoProgress?.data?.avg_maintenance_activities?.toFixed(1) ||
            0
          }
          title="Prom. Horas Improductivas Gerenciales"
          valueColor="text-[#22C2C5]"
          unid={"h"}
        />
        
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2 border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
        <CardTitle
            title="Actividades Improductivas Mes"
            subtitle="Resumen de las actividades improductivas durante el mes."
            icon={IconDash1}
          />
          <CardColumParetoScoop data={scoopParetoNoProductive} />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title=" Actividades Improductivas Promedio vs Acumulada"
            subtitle="Promedio mensual vs. acumulado de actividades improductivas."
            icon={IconDash1}
          />
          <CardActivitiesChart data={scoopParetoActivitiesChart} />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title=" Análisis de Pareto con Índice de Impacto Ponderado"
            subtitle="Pareto con Índice de Impacto Ponderado."
            icon={IconDash1}
          />
          <CardColumImpact data={scoopImpactDiagram} />
        </div>
      </div>
    </>
  );
}

export default ParetoScoop;
