import CardClock from "@/components/Dashboard/CardClock";
import CardColum from "@/components/Dashboard/CardColum";
import CardGauge from "@/components/Dashboard/CardGauge";
import CardItem from "@/components/Dashboard/CardItem";
import CardRange from "@/components/Dashboard/CardRange";
import CardTitle from "@/components/Dashboard/CardTitle";
import { useProductionWebSocket } from "@/hooks/useProductionWebSocket";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import { useMonthStore } from "@/store/MonthStore";
import { useEffect } from "react";

function ProductionMonth() {
  const fetchDataMonth = useMonthStore((state) => state.fetchDataMonth);
  const {
    dataAccumulatedProgress,
    dataChartToness,
    dataRangeTruck,
    dataRangeScoop,
  } = useMonthStore();

  useEffect(() => {
    fetchDataMonth();
  }, [fetchDataMonth]);

  useProductionWebSocket();
  console.log("dataRangeScoop",dataRangeScoop)
  return (
    <>
       <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[150px_150px_repeat(auto-fit,minmax(140px,1fr))]">
        <CardGauge />
        <CardClock />
        <CardItem
          value={
            dataAccumulatedProgress?.monthly_goal?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Meta del mes"
          valueColor="text-[#134E4A]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.total_monthly?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Total Toneladas Mes"
          valueColor="text-[#84CC16]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.percentage_succeded?.value?.toFixed(1) || 0
          }
          title="% Cumplimiento"
          change={
            dataAccumulatedProgress?.percentage_succeded?.value?.toFixed(1) || 0
          }
          valueColor="text-[#FBB723]"
          unid="%"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.total_shift_day?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Total Toneladas Dia"
          valueColor="text-[#EB8F26]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.total_shift_night?.value?.toLocaleString(
              "es-MX"
            ) || 0
          }
          title="Total Toneladas Noche"
          valueColor="text-[#65558F]"
          unid="tn"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.average_journal?.value?.toFixed(1) || 0
          }
          title="Tiempo Prom. Truck"
          valueColor="text-[#1E64FA]"
          unid="h"
        />
        <CardItem
          value={
            dataAccumulatedProgress?.average_time_scoop?.value.toFixed(2) || 0
          }
          title="Tiempo Prom. Scoop"
          valueColor="text-[#A855F7]"
          unid="h"
        />
      </div>
      <div className="flex-1 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="md:col-span-2  border border-[#F0F0F0] shadow-sm rounded-2xl flex flex-col justify-center gap-1 px-4 p-3">
        <CardTitle
            title=" Tonelaje / Planificado vs Ejecutado"
            subtitle="Tonelaje proyectado vs. transportado,  evaluando desviaciones y eficiencia operativa."
            icon={IconDash1}
          />
          <CardColum data={dataChartToness} />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title=" Rango de horario de trabajo Camiones"
            subtitle="Horario de operación del Camión."
            icon={IconDash1}
          />
          <CardRange
           data={dataRangeTruck}
            title="Rango de horario de trabajo Camiones"
          />
        </div>
        <div className="flex flex-col justify-center gap-2   border border-[#F0F0F0] shadow-sm p-4 rounded-2xl">
        <CardTitle
            title=" Rango de horario de trabajo Scooptram"
            subtitle="Horario de operación del Scooptram."
            icon={IconDash1}
          />
          <CardRange
            data={dataRangeScoop}
            title="Rango de horario de trabajo Scooptram"
          />
        </div>
      </div>
    </>
  );
}

export default ProductionMonth;
