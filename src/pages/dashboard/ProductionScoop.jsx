import CardClock from "@/components/Dashboard/CardClock";
import CardColumScoop from "@/components/Dashboard/CardColumScoop";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTable from "@/components/Dashboard/CardTable";
import CardTimeline from "@/components/Dashboard/CardTimeline";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import { useScoopStore } from "@/store/ScoopStore";
import { useEffect } from "react";

function ProductionScoop() {
  const fetchDataScoop = useScoopStore((state) => state.fetchDataScoop);
  const { scoopProgressDay, scoopTonnagHour, scoopActivityHour, scoopEvents } =
    useScoopStore();

  useEffect(() => {
    fetchDataScoop();
  }, [fetchDataScoop]);

  useProductionWebSocket();

  console.log(scoopProgressDay, "day");
  return (
    <>
      <div className="w-full flex flex-wrap justify-between gap-2">
        <CardGauge />
        <CardClock />
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
          value={
            scoopProgressDay?.mineral?.avance?.value?.toLocaleString("es-MX") ||
            0
          }
          title="Mineral avance"
          valueColor="text-red-800"
          unid={"tn"}
        />
        <CardItem
          value={scoopProgressDay?.time?.productive?.value?.toFixed(2) || 0}
          title="Horas productivas"
          valueColor="text-[#06C445]"
          unid={"h"}
        />
        <CardItem
          value={scoopProgressDay?.time?.planned?.value?.toFixed(2) || 0}
          title="Horas de Parada por Mantenimiento"
          valueColor="text-yellow-600"
          unid={"h"}
        />
        <CardItem
          value={scoopProgressDay?.time?.unplanned?.value?.toFixed(2) || 0}
          title="Horas Improductivas No Gerenciales"
          valueColor="text-purple-600"
          unid={"h"}
        />
        <CardItem
          value={scoopProgressDay?.time?.improductive?.value?.toFixed(2) || 0}
          title="Horas Improductivas Gerenciales"
          valueColor="text-red-500"
          unid={"h"}
        />
        <CardItem
          value={
            scoopProgressDay?.mineral?.percentageDisponibility?.value.toFixed(
              2
            ) || 0
          }
          title="Disponiblidad"
          valueColor="text-purple-600"
          unid={"%"}
        />
        <CardItem
          value={
            scoopProgressDay?.mineral?.percentageUtilization?.value.toFixed(
              2
            ) || 0
          }
          title="Utilización"
          valueColor="text-pink-600"
          unid={"%"}
        />
      </div>
      <div className="flex-1 grid grid-rows-3 gap-2 grid-cols-1">
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
