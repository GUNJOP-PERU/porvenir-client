import CardActivitiesChart from "@/components/Dashboard/TimeDistribution/CardActivitiesChart";
import CardColumImpact from "@/components/Dashboard/ParetoTruck/CardColumImpact";
import CardColumParetoScoop from "@/components/Dashboard/ParetoScoop/CardColumParetoScoop";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useGraphicData } from "@/hooks/useGraphicData";
import { ChartArea } from "lucide-react";

export default function ParetoScoop() {
  const { data } = useGraphicData(
    "pareto-scoop-progress-monthly",
    "dashboard/pareto/progress-monthly?equipment=scoop",
  );

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(150px,1fr))]">
        <CardItem
          value={data?.total_events || 0}
          title="Total de eventos"
          valueColor="text-[#6399C7]"
          unid={"evt"}
          decimals={0}
        />
        <CardItem
          value={data?.data?.total_lost || 0}
          title="Tiempo total perdido"
          valueColor="text-[#6399C7]"
          unid={"h"}
        />
        <CardItem
          value={data?.data?.avg_planned_activities || 0}
          title="Prom. Parada por Mantenimiento"
          valueColor="text-[#FF9500]"
          unid={"h"}
        />
        <CardItem
          value={data?.data?.avg_unplanned_activities || 0}
          title="Prom. Horas Improductivas No Gerenciales"
          valueColor="text-[#347AE2]"
          unid={"h"}
        />
        <CardItem
          value={data?.data?.avg_maintenance_activities || 0}
          title="Prom. Horas Improductivas Gerenciales"
          valueColor="text-[#22C2C5]"
          unid={"h"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 xl:grid-cols-2">
        <div className="xl:col-span-2 border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardTitle
            title="Actividades Improductivas Mes"
            subtitle="Resumen de las actividades improductivas durante el mes."
            icon={ChartArea}
          />
          <CardColumParetoScoop />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardTitle
            title=" Actividades Improductivas Promedio vs Acumulada"
            subtitle="Promedio mensual vs. acumulado de actividades improductivas."
            icon={ChartArea}
          />
          <CardActivitiesChart
            endpoint="dashboard/pareto/scoop/no-productive-activities-chart?quantity=7"
            symbol="pareto-scoop-improductive-activities"
          />
        </div>
        <div className="flex flex-col justify-center gap-2  border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardTitle
            title=" Análisis de Pareto con Índice de Impacto Ponderado"
            subtitle="Pareto con Índice de Impacto Ponderado."
            icon={ChartArea}
          />
          <CardColumImpact
            endpoint="dashboard/pareto/scoop/impact-diagram?quantity=7"
            symbol="pareto-scoop-impact-diagram"
          />
        </div>
      </div>
    </>
  );
}


