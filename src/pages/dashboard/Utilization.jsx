import CardColumUtilization from "@/components/Dashboard/CardColumUtilization";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardTitle from "@/components/Dashboard/CardTitle";
import CardVelocity from "@/components/Dashboard/CardVelocity";
import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";

function Utilization() {
  const { data = [] } = useGraphicData(
    "production-progress-velocity",
    "dashboard/production/progress-velocity"
  );

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(150px,1fr))]">
        <CardGauge />
        <CardItem
          value={data?.total_tonnages || 0}
          title="Total de toneladas"
          valueColor="text-[#6399C7]"
          unid={"tn"}
          decimals={0}
        />
        <CardItem
          value={data?.percentage_success || 0}
          title="%Cumplimiento"
          change={data?.percentage_success || 0}
          valueColor="text-red-500"
          unid={"%"}
        />
        <CardItem
          value={data?.velocities?.max_empty?.value || 0}
          title="Velocidad máxima vacío Supercie"
          valueColor="text-red-500"
          unid={"km/h"}
          decimals={0}
        />
        <CardItem
          value={data?.velocities?.min_empty?.value || 0}
          title="Velocidad máxima lleno en Superfie"
          valueColor="text-red-500"
          unid={"km/h"}
          decimals={0}
        />
        <CardItem
          value={data?.velocities?.max_loaded?.value || 0}
          title="Velocidad máxima vacío interior Mina"
          valueColor="text-red-500"
          unid={"km/h"}
          decimals={0}
        />
        <CardItem
          value={data?.velocities?.min_loaded?.value || 0}
          title="Velocidad máxima lleno interior Mina"
          valueColor="text-red-500"
          unid={"km/h"}
          decimals={0}
        />
      </div>
      <div className="flex-1 grid grid-rows-2 gap-2 grid-cols-1 xl:grid-cols-2">
        <div className="xl:col-span-2  border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
          <CardTitle
            title="Produccion (Ton) / Utilizacion (%)"
            subtitle="Relación entre tonelaje producido y porcentaje de uso."
            icon={IconDash1}
          />
          <CardColumUtilization />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardTitle
            title="Análisis de velocidad rutas a Parrillas"
            subtitle="Evaluación de la velocidad en rutas hacia Parrillas."
            icon={IconDash1}
          />
          <CardVelocity
            symbol="production-velocity-analysis-parrila"
            endpoint="dashboard/production/velocity-analysis/parrilla"
          />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
          <CardTitle
            title="Análisis de velocidad rutas a Canchas"
            subtitle="Evaluación de la velocidad en rutas hacia Canchas."
            icon={IconDash1}
          />
          <CardVelocity
            symbol="production-velocity-analysis-cancha"
            endpoint="dashboard/production/velocity-analysis/cancha"
          />
        </div>
      </div>
    </>
  );
}

export default Utilization;
