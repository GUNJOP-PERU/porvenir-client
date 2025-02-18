import CardClock from "@/components/Dashboard/CardClock";
import CardColumScoop from "@/components/Dashboard/CardColumScoop";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTable from "@/components/Dashboard/CardTable";
import CardTimeline from "@/components/Dashboard/CardTimeline";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconDash1 from "@/icons/Dashboard/IconDash1";
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

  
  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_150px_repeat(auto-fit,minmax(125px,1fr))]">
        <CardGauge />
        <CardClock />
        <CardItem
          value={
            scoopProgressDay?.mineral?.productive?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Mineral Producción"
          valueColor="text-[#14B8A6]"
          unid={"tn"}
        />
        <CardItem
          value={
            scoopProgressDay?.mineral?.avance?.value?.toLocaleString("es-MX") ||
            0
          }
          title="Mineral Avance"
          valueColor="text-[#F59E0B]"
          unid={"tn"}
        />
        <CardItem
          value={scoopProgressDay?.time?.productive?.value?.toFixed(2) || 0}
          title="Horas productivas"
          valueColor="text-green-800"
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
            scoopProgressDay?.mineral?.percentageDisponibility?.value?.toFixed(
              2
            ) || 0
          }
          title="Disponiblidad"
          change={
            scoopProgressDay?.mineral?.percentageDisponibility?.value || 0
          }
          valueColor="text-purple-600"
          unid={"%"}
        />
        <CardItem
          value={
            scoopProgressDay?.mineral?.percentageUtilization?.value?.toFixed(
              2
            ) || 0
          }
          title="Utilización"
          change={scoopProgressDay?.mineral?.percentageUtilization?.value || 0}
          valueColor="text-pink-600"
          unid={"%"}
        />
      </div>
      <div className="flex-1 grid grid-rows-3 gap-2 grid-cols-1">
        <div className=" border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col gap-1 px-4 p-3">
          <CardTitle
            title="Tonelaje Mineral / Avance"
            subtitle="Relación entre tonelaje mineral y avance."
            icon={IconDash1}
          />
          <CardColumScoop data={scoopTonnagHour} />
        </div>
        <div className=" border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col gap-1 px-4 p-3">
        <CardTitle
            title="Eventos por vehiculo y labor"
            subtitle="Eventos por vehículo y tipo de labor.."
            icon={IconDash1}
          />
          <CardTimeline data={scoopActivityHour} />
        </div>
        <div className=" border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3 ">
        <CardTitle
            title="Eventos "
            subtitle="Registro y análisis de eventos."
            icon={IconDash1}
          />
          <CardTable data={scoopEvents} />
        </div>
      </div>
    </>
  );
}

export default ProductionScoop;
