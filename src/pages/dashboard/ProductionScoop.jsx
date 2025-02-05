import CardColumScoop from "@/components/Dashboard/CardColumScoop";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTable from "@/components/Dashboard/CardTable";
import CardTimeline from "@/components/Dashboard/CardTimeline";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useProductionStore } from "@/store/ProductionStore";
import { useEffect } from "react";

function ProductionScoop() {
  const fetchDataScoop = useProductionStore((state) => state.fetchDataScoop);
  const { scoopProgressDay,scoopTonnagHour,scoopActivityHour,scoopEvents} = useProductionStore();

  useEffect(() => {
    if (scoopProgressDay.length === 0) {
      fetchDataScoop();
    }
  }, [fetchDataScoop, scoopProgressDay]);

  useProductionWebSocket();

  console.log(scoopProgressDay, "scoopProgressDay");
  return (
    <>
      <div className="w-full flex flex-wrap justify-between px-4 py-2 bg-zinc-100/50 border border-zinc-100 rounded-xl gap-2">
        <CardGauge />
        <CardItem
          value={
            scoopProgressDay?.mineral?.productive?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Mineral Producción"
          valueColor="text-blue-600"
          unid={"tn"}
        />
        <CardItem
          value={scoopProgressDay?.mineral?.avance?.value?.toLocaleString(
            "es-MX"
          )  || 0}
          title="Mineral avance"
          valueColor="text-red-800"
          unid={"tn"}
        />
        <CardItem
          value={scoopProgressDay?.time?.productive?.value?.toFixed(1)  || 0}
          title="Horas productivas"
          valueColor="text-[#06C445]"
          unid={"h"}
        />
        <CardItem
          value={scoopProgressDay?.time?.improductive?.value?.toFixed(1)  || 0}
          title="Parada improductiva"
          valueColor="text-red-500"
          unid={"h"}
        />
        <CardItem
         value={scoopProgressDay?.time?.planned?.value?.toFixed(1)  || 0}
          title="Parada planificada"
          valueColor="text-yellow-600"
          unid={"h"}
        />
        <CardItem
           value={scoopProgressDay?.time?.unplanned?.value?.toFixed(1)  || 0}
          title="Parada no planificada"
          valueColor="text-purple-600"
          unid={"h"}
        />
        
      </div>
      <div className="flex-1 grid grid-rows-3 gap-4 md:grid-cols-1">
        <div className=" bg-muted/50 rounded-2xl flex flex-col gap-1 px-4 p-3">
          <CardColumScoop data={scoopTonnagHour} />
        </div>
        <div className=" bg-muted/50 rounded-2xl flex flex-col gap-1 px-4 p-3">
          <CardTimeline data={scoopActivityHour} />
        </div>
        <div className=" bg-muted/50 rounded-2xl flex flex-col justify-center gap-1 px-4 p-3 ">
          <CardTable data={scoopEvents} />
        </div>
      </div>
    </>
  );
}

export default ProductionScoop;
