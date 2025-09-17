import CardTitle from "../CardTitle";
import KPITimeDistribution from "./KPITimeDistribution";
import CardCycleWork from "./CardCycleWork";
import CardActivitiesChart from "./CardActivitiesChart";

import CardFlotaTime from "./CardFlotaTime";
import CardTimeline from "./CardTimeline";
import AverageTajo from "./AverageTajo";
import { ChartNoAxesGantt, RefreshCcwDot, Clock, ChartNoAxesCombined } from "lucide-react";

export default function Body({
  progressDay,
  jobCycle,
  isLoadingJobCycle,
  isErrorJobCycle,
  improductiveActivities,
  isLoadingImproductiveActivities,
  isErrorImproductiveActivities,
  timelineTrucks,
  isLoading,
  isError,
}) {
  return (
    <>
      <KPITimeDistribution data={progressDay} />
      <div className="flex-1 grid gap-2 grid-cols-1 xl:grid-cols-2">
        <CardTitle
          title="Ciclo de Trabajo (Tiempo Promedio)"
          subtitle=" Duración y fases del proceso operativo."
          icon={RefreshCcwDot}
          classIcon="text-[#F43F5E]"
        >
          <CardCycleWork
            data={jobCycle}
            isLoading={isLoadingJobCycle}
            isError={isErrorJobCycle}
          />
        </CardTitle>
        <CardTitle
          title="Tiempo promedio / Por Labor"
          subtitle="Promedio de tajo por equipo."
          icon={Clock}
          classIcon="text-sky-500"
        >
          <AverageTajo data={progressDay?.frontLaborAvg || {}} isLoading={isLoading} isError={isError} />
        </CardTitle>
        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
          <CardFlotaTime
            symbol="list-fleet-truck"
            endpoint="dashboard/list-fleet?equipment=truck"
          />
        </div>
        <CardTitle
          title="Actividades Improductivas Promedio vs Acumulada por Turno"
          subtitle="Promedio del turno vs. acumulado de actividades improductivas."
          icon={ChartNoAxesCombined}
          classIcon="text-[#F43F5E]"
        >
          <CardActivitiesChart
            data={improductiveActivities}
            isLoading={isLoadingImproductiveActivities}
            isError={isErrorImproductiveActivities}
          />
        </CardTitle>
        <CardTitle
          title="Tiempos por hora de Trabajo de Camiones"
          subtitle="Horario de operacion del camión."
          icon={ChartNoAxesGantt}
          classIcon="text-[#F43F5E]"
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
