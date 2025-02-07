import CardActivitiesChart from "@/components/Dashboard/CardActivitiesChart";
import CardClock from "@/components/Dashboard/CardClock";
import CardColumPareto from "@/components/Dashboard/CardColumPareto";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function ParetoScoop() {
  const fetchParetoScoop = useProductionStore(
    (state) => state.fetchParetoScoop
  );
  const {
    scoopParetoProgress,
    scoopParetoNoProductive,
    scoopParetoActivitiesChart,
  } = useProductionStore();

  useEffect(() => {
    fetchParetoScoop();
  }, []);

  useProductionWebSocket();

  console.log(scoopParetoActivitiesChart, "scoopParetoActivitiesChart");
  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardClock />
        <CardItem
          value={scoopParetoProgress?.total_events || 0}
          title="Total de eventos"
          valueColor="text-[#6399C7]"
          unid={""}
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
          title="Prom. Actividad Programada"
          valueColor="text-[#B16940]"
          unid={"h"}
        />
        <CardItem
          value={
            scoopParetoProgress?.data?.avg_unplanned_activities?.toFixed(1) || 0
          }
          title="Prom. Actividad No Programada"
          valueColor="text-[#B16940]"
          unid={"h"}
        />
        <CardItem
          value={
            scoopParetoProgress?.data?.avg_maintenance_activities?.toFixed(1) ||
            0
          }
          title="Prom. Actividad Mantto y falla"
          valueColor="text-red-500"
          unid={"h"}
        />
        <CardItem
          value={
            scoopParetoProgress?.data?.avg_service_activities?.toFixed(1) || 0
          }
          title="Prom. Actividad Servicios"
          valueColor="text-black-500"
          unid={"h"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-4 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2 bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardColumPareto data={scoopParetoNoProductive} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          <CardActivitiesChart
            data={scoopParetoActivitiesChart}
            title="Rango de horario de trabajo Camiones"
          />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          {/* <CardRange
            data={dataRangeScoop}
            title="Rango de horario de trabajo Scooptram"
          /> */}
        </div>
      </div>
    </>
  );
}

export default ParetoScoop;
