import { useMemo } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import CardTitle from "@/components/Dashboard/CardTitleV2";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart";
import PageHeader from "@/components/PageHeaderV2";
// Types
import type { Mineral } from "@/types/Mineral";
import type { PlanMonth } from "@/types/Plan";
import type { BeaconCycle } from "../../types/Beacon";
// Utils
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import Progress from "@/components/Dashboard/Charts/Progress";
// Icons
import DonutAndSplineChartByMonth from "@/components/Dashboard/Charts/DonutAndSplineChartByMonth";
import LineAndBarChartByMonth from "@/components/Dashboard/Charts/LineAndBarChartByMonth";
import IconTruck from "@/icons/IconTruck";
import dayjs from "dayjs";

interface MonthlyTrips {
  month: string;
  monthNumber: number;
  monthName: string;
  year: number;
  shift?: ShiftData;
  data: BeaconCycle[];
  cantidadLocation: {
    location: string;
    count: number;
    duration: number;
  }[];
}

interface ShiftData {
  dia: number;
  noche: number;
}

interface TripsByMonthItem {
  monthNumber: number;
  monthName: string;
  tonelajeDia: number;
  tonelajeNoche: number;
}


const RealTimeByMonthScoop = () => {
  const {
    data = [],
    refetch,
    isFetching,
  } = useFetchData<MonthlyTrips[]>(
    "trip-report-month",
    `trip/header-by-months?year=${dayjs().year()}&material=Mineral`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", {
    refetchInterval: 10000,
  });

  const { data: planMonthData = [] } = useFetchData<PlanMonth[]>(
    "plan-month",
    `planMonth?year=${dayjs().year()}&phase=mineral`,
    {
      refetchInterval: 10000,
    }
  );

  const baseData = useMemo(() => {
    const mineral =
      mineralData?.find((charge) => charge.name === "Mineral")?.value || 36;
    const desmonte =
      mineralData?.find((charge) => charge.name === "Desmonte")?.value || 40;
    return { mineral, desmonte };
  }, [mineralData]);

  const baseStats = useMemo(() => {
    if (!data || !baseData) {
      return {
        totalTM: 0,
        avgLoadTime: 0,
        avgUnloadTime: 0,
        avgDurationSuperficieTrips: 0,
        avgDurationSubterraneoTrips: 0,
      };
    }

    let totalTrips = 0;
    let totalLoadTime = 0;
    let totalUnloadTime = 0;

    let superficieDuration = 0;
    let superficieCount = 0;

    let subterraneoDuration = 0;
    let subterraneoCount = 0;

    let totalUnits = 0;

    for (const monthBlock of data) {
      const shift = monthBlock.shift || { dia: 0, noche: 0 };

      // ✔ total viajes del mes
      totalTrips += (shift.dia || 0) + (shift.noche || 0);

      // ✔ tiempos por unidad
      for (const unit of monthBlock.data) {
        totalUnits++;
        totalLoadTime += (unit.avgFrontLaborDuration || 0) / 60;
        totalUnloadTime += (unit.avgUnloadTime || 0) / 60;
      }

      // ✔ duración por location
      for (const loc of monthBlock.cantidadLocation || []) {
        if (loc.location === "Superficie") {
          superficieDuration += loc.duration || 0;
          superficieCount += loc.count || 0;
        }

        if (loc.location === "Subterraneo") {
          subterraneoDuration += loc.duration || 0;
          subterraneoCount += loc.count || 0;
        }
      }
    }

    // Promedios
    const avgLoadTime = totalLoadTime / (totalUnits || 1);
    const avgUnloadTime = totalUnloadTime / (totalUnits || 1);

    const avgDurationSuperficieTrips =
      superficieDuration / (superficieCount || 1);

    const avgDurationSubterraneoTrips =
      subterraneoDuration / (subterraneoCount || 1);

    // Tons
    const totalTM = totalTrips * baseData.mineral;

    return {
      totalTM,
      avgLoadTime,
      avgUnloadTime,
      avgDurationSuperficieTrips,
      avgDurationSubterraneoTrips,
    };
  }, [data, baseData]);



  const tripsByMonth = useMemo<TripsByMonthItem[]>(() => {
    if (!data || data.length === 0) return [];

    const year = data[0]!.year;

    const baseMonths = Array.from({ length: 12 }, (_, i) => {
      const d = dayjs().year(year).month(i);
      return {
        monthNumber: i + 1,
        monthName: d.format("MMMM"), 
      };
    });

    const monthMap: Record<number, MonthlyTrips> = {};
    for (const item of data) {
      monthMap[item.monthNumber] = item;
    }

    return baseMonths.map(({ monthNumber, monthName }) => {
      const monthItem = monthMap[monthNumber];

      if (!monthItem) {
        return {
          monthNumber,
          monthName,
          tonelajeDia: 0,
          tonelajeNoche: 0,
        };
      }

      const shift = monthItem.shift || { dia: 0, noche: 0 };

      return {
        monthNumber,
        monthName,
        tonelajeDia: shift.dia,
        tonelajeNoche: shift.noche,
      };
    });
  }, [data]);

  const fullPlanDay = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = planMonthData.find((p) => p.month === month);

    return (
      found || {
        month,
        monthName: new Date(2025, month - 1).toLocaleString("es-ES", {
          month: "long",
        }),
        totalTonnage: 0,
      }
    );
  });

  return (
      <div className="grid grid-cols-[1fr_5fr] flex-1 w-full gap-4">
        <PageHeader
          title="Reporte Mensual / Marzo a Diciembre"
          description={`Reporte en tiempo real de los viajes realizados por los camiones del año ${new Date().getFullYear()}.`}
          refetch={refetch}
          isFetching={isFetching}
          setDialogOpen={false}
          className="col-span-2"
          actionsRight={<div className="relative flex flex-row gap-2"></div>}
        />
        <div className="flex flex-col items-center justify-around gap-0">
          <IconTruck className="fill-yellow-500 h-30 w-40" color="" />
          <div className="flex flex-col gap-8">
            <DonutChart
              title="Extracción de Mineral (TM)"
              size="xlarge"
              donutData={{
                currentValue: baseStats.totalTM,
                total: planMonthData[0]?.totalTonnage || 0,
                currentValueColor: "#ff5000",
              }}
            />
            <Progress
              title=""
              value={baseStats.totalTM}
              total={planMonthData[0]?.totalTonnage || 0}
              color="#ff5000"
              showLegend={false}
              className="mt-2"
            />
          </div>
  
          <div className="flex flex-col justify-center gap-4">
            <div>
              <h3 className="font-bold text-center leading-none text-[13px] col-span-2">
                Disponibilidad
              </h3>
              <DonutChart
                title=""
                size="medium"
                donutData={{
                  currentValue: 0,
                  total: 24,
                  currentValueColor: "#14B8A6",
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-center leading-none text-[13px] col-span-2">
                Utilización
              </h3>
              <DonutChart
                title=""
                size="medium"
                donutData={{
                  currentValue: 0,
                  total: 24,
                  currentValueColor: "#14B8A6",
                }}
              />
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
          <CardTitle
            title="Ejecución de extracción de mineral acumulado (TM)"
            subtitle="Análisis de la cantidad de viajes realizados TRUCK"
            classIcon="fill-yellow-500 h-7 w-16"
            actions={
              <div className="flex flex-row gap-2">
                <div className="flex flex-row items-center gap-1">
                  <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
                  <p className="text-[11px] font-bold">Mineral Extraído</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="flex bg-[#A6A6A6] w-2 h-2 rounded-full" />
                  <p className="text-[11px] font-bold">Planificado</p>
                </div>
              </div>
            }
          >
            <DonutAndSplineChartByMonth
              mineralWeight={baseData.mineral}
              chartData={tripsByMonth}
              planDay={fullPlanDay}
            />
          </CardTitle>
  
          <CardTitle
            title="Ejecución de extracción de mineral por dia (TM)"
            subtitle="Análisis de la cantidad de viajes realizados TRUCK"
            classIcon="fill-yellow-500 h-7 w-14"
            actions={
              <div className="flex flex-row gap-2">
                <div className="flex flex-row items-center gap-1">
                  <span className="flex bg-[#68c970] w-2 h-2 rounded-full" />
                  <p className="text-[11px] font-bold">Diferencia positiva</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="flex bg-[#f9c83e] w-2 h-2 rounded-full" />
                  <p className="text-[11px] font-bold">Diferencia negativa</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
                  <p className="text-[11px] font-bold">Mineral Extraído</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="flex bg-[#b8b8b8] w-2 h-2 rounded-full" />
                  <p className="text-[11px] font-bold">Planificado</p>
                </div>
              </div>
            }
          >
            <LineAndBarChartByMonth
              mineralWeight={baseData.mineral}
              chartColor="#ff5000"
              chartData={tripsByMonth}
              planDay={fullPlanDay}
            />
          </CardTitle>
  
          <div className="flex flex-col border border-zinc-100 shadow-sm rounded-xl p-3">
            <DonutAndTableChart
              title="Causas de Desviación del Plan %"
              donutData={[
                {
                  title: "Disponibilidad",
                  total: 0,
                  currentValue: 0,
                  currentValueColor: "#14B8A6",
                },
                {
                  title: "Utilización",
                  total: 0,
                  currentValue: 0,
                  currentValueColor: "#14B8A6",
                },
              ]}
              tableData={[
                {
                  title: "Plan",
                  currentValue: 60,
                  total: 100,
                  subData: [
                    {
                      title: "Tiempo de Carga de Pala",
                      currentValue: baseStats.avgLoadTime
                        ? Number(baseStats.avgLoadTime.toFixed(2))
                        : 0,
                      total: 60,
                    },
                    {
                      title: "Tiempo de Descarga de Pala",
                      currentValue: baseStats.avgUnloadTime
                        ? Number(baseStats.avgUnloadTime.toFixed(2))
                        : 0,
                      total: 60,
                    },
                  ],
                },
                {
                  title: "Duración del Ciclo Subterraneo",
                  currentValue: Number(
                    baseStats.avgDurationSubterraneoTrips.toFixed(2)
                  ),
                  total: 100,
                  subData: [],
                },
                {
                  title: "Duración del Ciclo Superficie",
                  currentValue: Number(
                    baseStats.avgDurationSuperficieTrips.toFixed(2)
                  ),
                  total: 100,
                  subData: [],
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
};

export default RealTimeByMonthScoop;