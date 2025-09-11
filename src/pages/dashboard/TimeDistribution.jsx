import CardCycleWork from "@/components/Dashboard/TimeDistribution/CardCycleWork";
import CardFlotaTime from "@/components/Dashboard/TimeDistribution/CardFlotaTime";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import CardTimeline from "@/components/Dashboard/CardTimeline";
import CardActivitiesChart from "@/components/Dashboard/TimeDistribution/CardActivitiesChart";
import { useSocketTopicValue } from "@/hooks/useSocketValue";

export default function TimeDistribution() {

  useSocketTopicValue("truck-progress-day", [
      "shift-variable",
      "truck-progress-day",
    ]);
    useSocketTopicValue("truck-activities-per-hour", [
      "shift-variable",
      "truck-activities-per-hour",
    ]);
    
  const { data } = useGraphicData(
    "truck-progress-day",
    "dashboard/truck/progress-day",
    "shift-variable"
  );

  const {
    data: timelineTrucks,
    isLoading,
    isError,
  } = useGraphicData(
    "truck-activities-per-hour",
    "dashboard/truck/activities-per-hour",
    "shift-variable"
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold leading-none">
          Distribución de tiempos volquetes
        </h1>
      </div>

      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        <CardItem
          value={data?.avg_time_cycle_min || 0}
          title="Tiempo Prom. / Ciclo"
          valueColor="text-amber-600"
          unid={"min"}
        />
        <CardItem
          value={data?.avg_time_cycle_min || 0}
          title="Tiempo Prom. / Ciclo (Por Tajo)"
          valueColor="text-amber-600"
          unid={"min"}
        />
        <CardItem
          value={data?.avg_time_cycle_min || 0}
          title="Tiempo Prom. / Ciclo (Por Material)"
          valueColor="text-amber-600"
          unid={"min"}
        />
        <CardItem
          value={data?.disponibility?.value || 0}
          title="Disponiblidad"
          change={data?.disponibility?.value || 0}
          valueColor="text-purple-600"
          unid={"%"}
        />
        <CardItem
          value={data?.utilization?.value || 0}
          title="Utilización"
          change={data?.utilization?.value || 0}
          valueColor="text-pink-600"
          unid={"%"}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
          <CardFlotaTime
            symbol="list-fleet-truck"
            endpoint="dashboard/list-fleet?equipment=truck"
          />
        </div>
        <CardTitle
          title="Ciclo de Trabajo (Tiempo Promedio)"
          subtitle=" Duración y fases del proceso operativo."
          icon={IconDash1}
        >
          <CardCycleWork />
        </CardTitle>
        <CardTitle
          title=" Actividades Improductivas Promedio vs Acumulada"
          subtitle="Promedio del turno vs. acumulado de actividades improductivas."
          icon={IconDash1}
          className="xl:col-span-2"
        >
          <CardActivitiesChart
            symbol="pareto-truck-improductive-activitie-chart-by-shift"
            endpoint="dashboard/pareto/truck/no-productive-activities-chart-by-shift?quantity=7"
          />
        </CardTitle>
        <CardTitle
          title="Tiempos por hora de Trabajo de Camiones"
          subtitle="Horario de operacion del camión."
          icon={IconDash1}
          className="xl:col-span-2"
        >
          <CardTimeline
            data={timelineTrucks}
            isLoading={isLoading}
            isError={isError}
          />
        </CardTitle>
      </div>
    </>
  );
}


