import CardActivitiesChart from "@/components/Dashboard/CardActivitiesChart";
import CardClock from "@/components/Dashboard/CardClock";
import CardColumImpact from "@/components/Dashboard/CardColumImpact";
import CardColumPareto from "@/components/Dashboard/CardColumPareto";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function ParetoTruck() {
  const fetchParetoTruck = useProductionStore(
    (state) => state.fetchParetoTruck
  );
  const {
    truckParetoProgress,
    truckParetoNoProductive,
    truckParetoActivitiesChart,
    truckImpactDiagram
  } = useProductionStore();

  useEffect(() => {
    fetchParetoTruck();
  }, []);

  useProductionWebSocket();


  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={truckParetoProgress?.total_events || 0}
          title="Total de eventos"
          valueColor="text-[#6399C7]"
          unid={"ev"}
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
          title="Prom. Actividad Programada"
          valueColor="text-[#B16940]"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_unplanned_activities?.toFixed(1) || 0
          }
          title="Prom. Actividad No Programada"
          valueColor="text-[#B16940]"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_maintenance_activities?.toFixed(1) ||
            0
          }
          title="Prom. Actividad Mantto y falla"
          valueColor="text-red-500"
          unid={"h"}
        />
        <CardItem
          value={
            truckParetoProgress?.data?.avg_service_activities?.toFixed(1) || 0
          }
          title="Prom. Actividad Servicios"
          valueColor="text-black-500"
          unid={"h"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-4 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2 bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardColumPareto data={truckParetoNoProductive} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardActivitiesChart
          data={truckParetoActivitiesChart}
        
        />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardColumImpact
          data={truckImpactDiagram}
        
        />
        </div>
      </div>
    </>
  );
}

export default ParetoTruck;
