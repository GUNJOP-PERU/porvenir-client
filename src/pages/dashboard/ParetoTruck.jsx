import CardActivitiesChart from "@/components/Dashboard/CardActivitiesChart";
import CardClock from "@/components/Dashboard/CardClock";
import CardColumImpact from "@/components/Dashboard/CardColumImpact";

import CardColumParetoTruck from "@/components/Dashboard/CardColumParetoTruck";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import { useParetoTruckStore } from "@/store/ParetoTruckStore";
import { useEffect } from "react";

function ParetoTruck() {
  const fetchParetoTruck = useParetoTruckStore(
    (state) => state.fetchParetoTruck
  );
  const {
    truckParetoProgress,
    truckParetoNoProductive,
    truckParetoActivitiesChart,
    truckImpactDiagram,
  } = useParetoTruckStore();

  useEffect(() => {
    fetchParetoTruck();
  }, [fetchParetoTruck]);

  useProductionWebSocket();

  // console.log(truckParetoNoProductive,"truckParetoNoProductive")

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_150px_repeat(auto-fit,minmax(150px,1fr))]">
        <CardGauge />
        <CardClock />
        <CardItem
          value={truckParetoProgress?.total_events || 0}
          title="Total de eventos"
          valueColor="text-[#6399C7]"
          unid={"evt"}
        />
        <CardItem
          value={truckParetoProgress?.data?.total_lost?.toFixed(1) || 0}
          title="Tiempo total perdido"
          valueColor="text-[#6399C7]"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_planned_activities?.toFixed(1) || 0
          }
          title="Prom. Hora de Parada Planificada"
          valueColor="text-[#22C2C5]"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_unplanned_activities?.toFixed(1) || 0
          }
          title="Prom. Horas Perdidas"
          valueColor="text-[#F43F5E]"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_maintenance_activities?.toFixed(1) ||
            0
          }
          title="Prom. Mantenimiento"
          valueColor="text-[#FF9500]"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_service_activities?.toFixed(1) || 0
          }
          title="Prom. Otros"
          valueColor="text-[#347AE2]"
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
          <CardColumParetoTruck data={truckParetoNoProductive} />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title=" Actividades Improductivas Promedio vs Acumulada"
            subtitle="Promedio mensual vs. acumulado de actividades improductivas."
            icon={IconDash1}
          />
          <CardActivitiesChart data={truckParetoActivitiesChart} />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title=" Análisis de Pareto con Índice de Impacto Ponderado"
            subtitle="Pareto con Índice de Impacto Ponderado."
            icon={IconDash1}
          />
          <CardColumImpact data={truckImpactDiagram} />
        </div>
      </div>
    </>
  );
}

export default ParetoTruck;
