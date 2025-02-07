import CardClock from "@/components/Dashboard/CardClock";
import CardColumPareto from "@/components/Dashboard/CardColumPareto";
import CardColumUtilization from "@/components/Dashboard/CardColumUtilization";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";

import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function ProductionUV() {
  const fetchDataUtilization = useProductionStore(
    (state) => state.fetchDataUtilization
  );
  const { progressVelocity, chartUtility } = useProductionStore();

  useEffect(() => {
    fetchDataUtilization();
  }, []);

  useProductionWebSocket();

  console.log(chartUtility, "chartUtility");
  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
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
      <div className="flex-1 grid grid-rows-2 gap-4 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2 bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardColumUtilization data={chartUtility} />
        </div>
        <div className="flex flex-col justify-center gap-2  bg-muted/50 p-4 rounded-2xl">
          {/* <CardRange
            data={dataRangeTruck}
            title="Rango de horario de trabajo Camiones"
          /> */}
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

export default ProductionUV;
