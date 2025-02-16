import CardActivitiesChart from "@/components/Dashboard/CardActivitiesChart";
import CardClock from "@/components/Dashboard/CardClock";
import CardColumImpact from "@/components/Dashboard/CardColumImpact";
import CardColumParetoScoop from "@/components/Dashboard/CardColumParetoScoop";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
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
      <div className="w-full flex flex-wrap justify-between  gap-2">
        <CardGauge />
        <CardClock />
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
        <div className="md:col-span-2 bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardColumParetoScoop data={scoopParetoNoProductive} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardActivitiesChart data={scoopParetoActivitiesChart} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardColumImpact data={scoopImpactDiagram} />
        </div>
      </div>
    </>
  );
}

export default ParetoScoop;
