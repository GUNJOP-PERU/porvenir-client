import CardColumScoop from "@/components/Dashboard/CardColumScoop";
import CardFlotaTime from "@/components/Dashboard/CardFloatTime/CardFlotaTime";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTable from "@/components/Dashboard/CardTable";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";

function ProductionScoop() {
  const { data } = useGraphicData(
    "scoop-progress-day",
    "dashboard/scoop/progress-day",
    "shift-variable"
  );
  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(125px,1fr))]">
        <CardGauge />
        <CardItem
          value={data?.mineral?.productive?.value || 0}
          title="Mineral Producción"
          valueColor="text-[#14B8A6]"
          unid={"tn"}
          decimals={0}
        />
        <CardItem
          value={data?.mineral?.avance?.value || 0}
          title="Mineral Avance"
          valueColor="text-[#F59E0B]"
          unid={"tn"}
          decimals={0}
        />
        <CardItem
          value={data?.time?.productive?.value || 0}
          title="Horas productivas"
          valueColor="text-green-800"
          unid={"h"}
        />
        <CardItem
          value={data?.time?.planned?.value || 0}
          title="Horas de Parada por Mantenimiento"
          valueColor="text-yellow-600"
          unid={"h"}
        />
        <CardItem
          value={data?.time?.unplanned?.value || 0}
          title="Horas Improductivas No Gerenciales"
          valueColor="text-purple-600"
          unid={"h"}
        />
        <CardItem
          value={data?.time?.improductive?.value || 0}
          title="Horas Improductivas Gerenciales"
          valueColor="text-red-500"
          unid={"h"}
        />
        <CardItem
          value={data?.mineral?.percentageDisponibility?.value || 0}
          title="Disponiblidad"
          change={data?.mineral?.percentageDisponibility?.value || 0}
          valueColor="text-purple-600"
          unid={"%"}
        />
        <CardItem
          value={data?.mineral?.percentageUtilization?.value || 0}
          title="Utilización"
          change={data?.mineral?.percentageUtilization?.value || 0}
          valueColor="text-pink-600"
          unid={"%"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 xl:grid-cols-2">
        <div className="xl:col-span-2 border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col gap-1 px-4 p-3">
          <CardTitle
            title="Tonelaje Mineral / Avance"
            subtitle="Relación entre tonelaje mineral y avance."
            icon={IconDash1}
          />
          <CardColumScoop />
        </div>

        <div className=" border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3 ">
          <CardTitle
            title="Eventos "
            subtitle="Registro y análisis de eventos."
            icon={IconDash1}
          />
          <CardTable symbol="scoop-events" endpoint="dashboard/scoop/events" />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardFlotaTime
            symbol="list-fleet-scoop"
            endpoint="dashboard/list-fleet?equipment=scoop"
          />
        </div>
      </div>
    </>
  );
}

export default ProductionScoop;
