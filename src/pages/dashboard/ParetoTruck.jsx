import CardActivitiesChart from "@/components/Dashboard/TimeDistribution/CardActivitiesChart";
import CardColumImpact from "@/components/Dashboard/ParetoTruck/CardColumImpact";

import CardColumParetoTruck from "@/components/Dashboard/ParetoTruck/CardColumParetoTruck";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";

import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";

export default function ParetoTruck() {
  const { data } = useGraphicData(
    "pareto-truck-progress-monthly",
    "dashboard/pareto/progress-monthly?equipment=truck"
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
          title="Prom. Hora de Parada Planificada"
          valueColor="text-[#22C2C5]"
          unid={"h"}
        />
        <CardItem
          value={data?.data?.avg_unplanned_activities || 0}
          title="Prom. Horas Perdidas"
          valueColor="text-[#F43F5E]"
          unid={"h"}
        />
        <CardItem
          value={data?.data?.avg_maintenance_activities || 0}
          title="Prom. Mantenimiento"
          valueColor="text-[#FF9500]"
          unid={"h"}
        />
        <CardItem
          value={data?.data?.avg_service_activities || 0}
          title="Prom. Otros"
          valueColor="text-[#347AE2]"
          unid={"h"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 xl:grid-cols-2">
        <CardTitle
          title="Actividades Improductivas Mes"
          subtitle="Resumen de las actividades improductivas durante el mes."
          icon={IconDash1}
          className="xl:col-span-2"
        >
          <CardColumParetoTruck />
        </CardTitle>

        <CardTitle
          title=" Actividades Improductivas Promedio vs Acumulada"
          subtitle="Promedio mensual vs. acumulado de actividades improductivas."
          icon={IconDash1}
        >
          <CardActivitiesChart
            symbol="pareto-truck-improductive-activities"
            endpoint="dashboard/pareto/truck/no-productive-activities-chart?quantity=7"
          />
        </CardTitle>
        <CardTitle
          title=" Análisis de Pareto con Índice de Impacto Ponderado"
          subtitle="Pareto con Índice de Impacto Ponderado."
          icon={IconDash1}
        >
          <CardColumImpact
            symbol="pareto-truck-impact-diagram"
            endpoint="dashboard/pareto/truck/impact-diagram?quantity=7"
          />
        </CardTitle>
      </div>
    </>
  );
}


