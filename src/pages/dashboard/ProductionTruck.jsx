import CardCycleWork from "@/components/Dashboard/TimeDistribution/CardCycleWork";
import CardFlotaTime from "@/components/Dashboard/TimeDistribution/CardFlotaTime";
import CardGauge from "@/components/Dashboard/ProductionTruck/CardGauge";
import CardHeatMap from "@/components/Dashboard/ProductionTruck/CardHeatmap";
import CardItem from "@/components/Dashboard/CardItem";
import CardPie from "@/components/Dashboard/ProductionTruck/CardPie";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import { useSocketTopicValue } from "@/hooks/useSocketValue";

export default function ProductionTruck() {
  useSocketTopicValue("truck-progress-day", [
    "shift-variable",
    "truck-progress-day",
  ]);

  const { data } = useGraphicData(
    "truck-progress-day",
    "dashboard/truck/progress-day",
    "shift-variable"
  );

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_repeat(auto-fit,minmax(150px,1fr))]">
        {/* <CardGauge /> */}
        <CardItem
          value={data?.total_mineral || 0}
          title="Mineral"
          valueColor="text-[#6399C7]"
          unid={"tn"}
          subtitle={data?.travels?.mineral || 0}
          decimals={0}
        />
        <CardItem
          value={data?.total_waste || 0}
          title="Desmonte"
          valueColor="text-[#B16940]"
          unid={"tn"}
          subtitle={data?.travels?.waste || 0}
          decimals={0}
        />
        <CardItem
          value={data?.percentage_success || 0}
          title="% Cumplimiento"
          change={data?.percentage_success || 0}
          valueColor="text-green-600"
          unid={"%"}
        />
        <CardItem
          value={data?.avg_time_cycle_min || 0}
          title="Tiempo Prom. / Ciclo"
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
        <CardTitle
          title="Ruta vs Tonelaje"
          subtitle="   Comparación del tonelaje transportado en distintas rutas."
          icon={IconDash1}
        >
          <CardHeatMap />
        </CardTitle>

        <CardTitle
          title="Ciclo de Trabajo"
          subtitle=" Duración y fases del proceso operativo."
          icon={IconDash1}
        >
          <CardCycleWork />
        </CardTitle>

        <CardTitle
          title="Tiempos productivos vs Improductivos"
          subtitle="Comparación entre trabajo efectivo y tiempo perdido."
          icon={IconDash1}
        >
          <CardPie
            symbol="truck-chart-productivity"
            endpoint="dashboard/truck/chart-productivity"
          />
        </CardTitle>

        <div className="flex flex-col gap-2  items-center border border-[#F0F0F0] shadow-sm px-6 py-4 rounded-2xl">
          <CardFlotaTime
            symbol="list-fleet-truck"
            endpoint="dashboard/list-fleet?equipment=truck"
          />
        </div>
      </div>
    </>
  );
}
