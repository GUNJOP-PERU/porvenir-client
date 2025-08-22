import CardColum from "@/components/Dashboard/CardColum";
import CardItem from "@/components/Dashboard/CardItem";
import CardRange from "@/components/Dashboard/CardRange";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";

function ProductionMonth() {
  const { data = [] } = useGraphicData(
    "monthly-progress",
    "dashboard/monthly/accumulated-progress"
  );
  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(140px,1fr))]">
       
        <CardItem
          value={data?.monthly_goal?.value || 0}
          title="Meta del mes"
          valueColor="text-[#134E4A]"
          unid="tn"
          decimals={0}
        />
        <CardItem
          value={data?.total_monthly?.value || 0}
          title="Total Toneladas Mes"
          valueColor="text-[#84CC16]"
          unid="tn"
          decimals={0}
        />
        <CardItem
          value={data?.percentage_succeded?.value || 0}
          title="% Cumplimiento"
          change={data?.percentage_succeded?.value || 0}
          valueColor="text-[#FBB723]"
          unid="%"
        />
        <CardItem
          value={data?.total_shift_day?.value || 0}
          title="Total Toneladas Dia"
          valueColor="text-[#EB8F26]"
          unid="tn"
          decimals={0}
        />
        <CardItem
          value={data?.total_shift_night?.value || 0}
          title="Total Toneladas Noche"
          valueColor="text-[#65558F]"
          unid="tn"
          decimals={0}
        />
        <CardItem
          value={data?.average_journal?.value || 0}
          title="Tiempo Prom. Truck"
          valueColor="text-[#1E64FA]"
          unid="h"
        />
        <CardItem
          value={data?.average_time_scoop?.value || 0}
          title="Tiempo Prom. Scoop"
          valueColor="text-[#A855F7]"
          unid="h"
        />
      </div>
      <div className="flex-1 grid grid-cols-1 gap-2 xl:grid-cols-2">
        <div className="xl:col-span-2  border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardTitle
            title=" Tonelaje / Planificado vs Ejecutado"
            subtitle="Tonelaje proyectado vs. transportado,  evaluando desviaciones y eficiencia operativa."
            icon={IconDash1}
          />
          <CardColum />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardTitle
            title=" Rango de horario de trabajo Camiones"
            subtitle="Horario de operación del Camión."
            icon={IconDash1}
          />
          <CardRange
            symbol="monthly-average-journals-truck"
            endpoint="dashboard/monthly/average-journals?equipment=truck"
          />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardTitle
            title=" Rango de horario de trabajo Scooptram"
            subtitle="Horario de operación del Scooptram."
            icon={IconDash1}
          />
          <CardRange
            symbol="monthly-average-journals-scoop"
            endpoint="dashboard/monthly/average-journals?equipment=scoop"
          />
        </div>
      </div>
    </>
  );
}

export default ProductionMonth;
