import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import PageHeader from "@/components/PageHeaderV2";
import DonutAndSplineChartByDay from "@/components/Dashboard/Charts/DonutAndSplineChartByDay";
import LineAndBarChartByDay from "@/components/Dashboard/Charts/LineAndBarChartByDay";
import CardTitle from "@/components/Dashboard/CardTitleV2";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
import type { PlanDay, PlanWeek } from "@/types/Plan";
// Utils
import {
  startOfWeek,
  endOfWeek,
  format,
  getISODay,
  addHours
} from "date-fns";
import { es } from "date-fns/locale";
import Progress from "@/components/Dashboard/Charts/Progress";
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import {
  getCurrentDay,
  getCurrentWeekStartEndDates,
  getCurrentWeekDates,
  planDayDateParser
} from "@/utils/dateUtils";
// Icons
import IconTruck from "@/icons/IconTruck";

const RealTimeByWeek = () => {
  const isoDay = getISODay(new Date());
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [dateFilter, setDateFilter] = useState<
    [
      {
        startDate: Date;
        endDate: Date;
        key: string;
      }
    ]
  >([
    {
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
      key: "selection",
    },
  ]);

  const {
    data = [],
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-report-week",
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter[0].startDate, "yyyy-MM-dd")}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}`,
    "",
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", "", {
    refetchInterval: 10000,
  });

  const {
    data: beaconTruck = []
  } = useFetchData<{ status: string }[]>("beacon-truck", "beacon-truck", "", { refetchInterval: 10000 });

  const { data: planData = [] } = useFetchData<PlanWeek[]>(
    "plan-week",
    `planWeek?startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}`,
    "",
    {
      refetchInterval: 10000,
    }
  );

  const { data: planDayData = [] } = useFetchData<PlanDay[]>(
    "planday-w-",
    `planDay/by-date-range?startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}`,
    "",
    {
      refetchInterval: 10000,
    }
  );

  const planWeek = useMemo(() => {
    const plan = planData[0];
    const safePlanDay = plan?.dataCalculate || [];
    const filteredPlanDayData = planDayData.filter(day => day.phase === "mineral");
    const planDataBlending = filteredPlanDayData.filter(day => day.type === "blending");
    const planDataModificado = filteredPlanDayData.filter(day => day.type === "modificado");
    const allWeekDates: string[] = getCurrentWeekDates();

    const blendingGroupedByDate = planDataBlending.reduce((acc, day) => {
      const dateKey = planDayDateParser(day.date);
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, tonnage: 0 };
      }
      acc[dateKey].tonnage += day.tonnage;
      return acc;
    }, {} as Record<string, { date: string; tonnage: number }>);
    const modificadoGroupedByDate = planDataModificado.reduce((acc, day) => {
      const dateKey = planDayDateParser(day.date);
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, tonnage: 0 };
      }
      acc[dateKey].tonnage += day.tonnage;
      return acc;
    }, {} as Record<string, { date: string; tonnage: number }>);

    const blendingByDateSorted = allWeekDates.map(date => ({
      date,
      tonnage: blendingGroupedByDate[date]?.tonnage || 0
    }));
    const modificadoByDateSorted = allWeekDates.map(date => ({
      date,
      tonnage: modificadoGroupedByDate[date]?.tonnage || 0
    }));

    return {
      totalTonnage: plan?.totalTonnage || 0,
      totalTonnageBlending: planDataBlending.reduce((acc, day) => acc + day.tonnage, 0),
      totalTonnageModificado: planDataModificado.reduce((acc, day) => acc + day.tonnage, 0),
      planWeek: safePlanDay.map((date) => ({
        date: date.date,
        tonnage: date.tonnageByTurno.dia + date.tonnageByTurno.noche,
      })),
      planDataBlending: blendingByDateSorted,
      planDataModificado: modificadoByDateSorted,
    };
  }, [planData, planDayData]);



  const baseData = useMemo(() => {
    const mineral =
      mineralData?.find((charge) => charge.name === "Mineral")?.value || 36;
    const desmonte =
      mineralData?.find((charge) => charge.name === "Desmonte")?.value || 40;
    return { mineral, desmonte };
  }, [mineralData]);

  const baseStats = useMemo(() => {
    if (!data || !mineralData) {
      return {
        totalUnits: data.filter((unit) => unit.trips.length > 0).length,
        totalUnitsDay: data.filter((unit) => unit.trips.length > 0).length,
        totalUnitsNight: data.filter((unit) => unit.trips.length > 0).length,
        totalTrips: 0,
        totalTM: 0,
        totalDuration: 0,
        totalDurationNight: 0,
        totalDurationDay: 0,
        totalMantanceTimeMin: 0,
        totalMaintenanceTimeMinDay: 0,
        totalMaintenanceTimeMinNight: 0,
        totalMaintenanceTimeMin: 0,
        dayTrips: 0,
        nightTrips: 0,
        totalTMNight: 0,
        totalTMDay: 0,
        durationPerTrip: 0,
        durationPerTripDay: 0,
        durationPerTripNight: 0,
        avgUnloadTime: 0,
        avgLoadTime: 0,
        avgDurationSuperficieTripsDay: 0,
        avgDurationSubterraneoTripsDay: 0,
        avgDurationSuperficieTripsNight: 0,
        avgDurationSubterraneoTripsNight: 0,
      };
    }

    const totalTrips = data.reduce((acc, day) => acc + day.totalTrips, 0);
    const allTrips = data.map((unitGroup) => unitGroup.trips).flat();
    const avgDurationSuperficieTripsDay = allTrips.filter((trip) => trip.location === "Superficie" && trip.shift === "dia").reduce((avg, trip) => avg + trip.tripDurationMin, 0) / allTrips.filter((trip) => trip.location === "Superficie" && trip.shift === "dia").length;
    const avgDurationSubterraneoTripsDay = allTrips.filter((trip) => trip.location === "Subterraneo" && trip.shift === "dia").reduce((avg, trip) => avg + trip.tripDurationMin, 0) / allTrips.filter((trip) => trip.location === "Subterraneo" && trip.shift === "dia").length;
    const avgDurationSuperficieTripsNight = allTrips.filter((trip) => trip.location === "Superficie" && trip.shift === "noche").reduce((avg, trip) => avg + trip.tripDurationMin, 0) / allTrips.filter((trip) => trip.location === "Superficie" && trip.shift === "noche").length;
    const avgDurationSubterraneoTripsNight = allTrips.filter((trip) => trip.location === "Subterraneo" && trip.shift === "noche").reduce((avg, trip) => avg + trip.tripDurationMin, 0) / allTrips.filter((trip) => trip.location === "Subterraneo" && trip.shift === "noche").length;

    const dayTrips = data.reduce(
      (acc, day) =>
        acc + day.trips.filter((trip) => trip.shift === "dia").length,
      0
    );
    const nightTrips = data.reduce(
      (acc, day) =>
        acc + day.trips.filter((trip) => trip.shift === "noche").length,
      0
    );

    const totalDuration = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.trips.reduce(
          (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
          0
        ),
      0
    );

    const totalDurationDay = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.trips
          .filter((trip) => trip.shift === "dia")
          .reduce(
            (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
            0
          ),
      0
    );

    const totalDurationNight = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.trips
          .filter((trip) => trip.shift === "noche")
          .reduce(
            (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
            0
          ),
      0
    );

    const totalMantanceTimeMin = data.reduce(
      (acc, tripsTruck) => acc + tripsTruck.totalMaintanceTimeMin,
      0
    );

    const totalMaintenanceTimeMin = data.reduce(
      (acc, tripsTruck) => acc + tripsTruck.totalMaintanceTimeMin,
      0
    );

    const totalMaintenanceTimeMinDay = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.maintance
          .filter((mant) => mant.shift === "dia")
          .reduce((innerAcc, mant) => innerAcc + mant.duration, 0) /
        60,
      0
    );

    const totalMaintenanceTimeMinNight = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.maintance
          .filter((mant) => mant.shift === "noche")
          .reduce((innerAcc, mant) => innerAcc + mant.duration, 0) /
        60,
      0
    );

    const avgUnloadTime =
      data.reduce((acc, truck) => {
        return acc + truck.avgUnloadTime / 60;
      }, 0) / data.length;

    const avgLoadTime =
      data.reduce((acc, truck) => {
        return acc + truck.avgFrontLaborDuration / 60;
      }, 0) / data.length;

    const totalTM = totalTrips * baseData.mineral;
    const totalTMDay = dayTrips * baseData.mineral;
    const totalTMNight = nightTrips * baseData.mineral;

    return {
      totalUnits: data.length,
      totalUnitsDay: data.length,
      totalUnitsNight: data.length,
      totalTrips,
      totalTM,
      totalDuration,
      totalDurationNight,
      totalDurationDay,
      totalMantanceTimeMin,
      totalMaintenanceTimeMinDay,
      totalMaintenanceTimeMinNight,
      totalMaintenanceTimeMin,
      durationPerTrip: totalTrips ? totalDuration / 60 / totalTrips : 0,
      durationPerTripDay: dayTrips ? totalDurationDay / 60 / dayTrips : 0,
      durationPerTripNight: nightTrips
        ? totalDurationNight / 60 / nightTrips
        : 0,
      dayTrips,
      nightTrips,
      totalTMDay,
      totalTMNight,
      avgUnloadTime,
      avgLoadTime,
      avgDurationSuperficieTripsDay,
      avgDurationSubterraneoTripsDay,
      avgDurationSuperficieTripsNight,
      avgDurationSubterraneoTripsNight,
    };
  }, [data, baseData]);

  const tripsByDate = useMemo(() => {
    if (!data) return [];

    const allTrips = data.flatMap((unitGroup) => unitGroup.trips);

    const grouped = allTrips.reduce((acc: Record<string, BeaconUnitTrip[]>, trip) => {
      const tripDateTime = new Date(trip.endDate);
      let assignedDate: Date;
      if (tripDateTime.getHours() >= 19) {
        assignedDate = tripDateTime;
        assignedDate.setDate(assignedDate.getDate() + 1);
      } else {
        assignedDate = new Date(tripDateTime);
      }
      const tripDate = format(assignedDate, 'yyyy-MM-dd');
      if (!acc[tripDate]) {
        acc[tripDate] = [];
      }
      acc[tripDate].push(trip);
      return acc;
    }, {});

    const startDate = dateFilter[0].startDate;
    const endDate = dateFilter[0].endDate;
    const allDatesInRange: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      allDatesInRange.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const result = allDatesInRange.map((date) => {
      const dateObj = addHours(new Date(date), 5);
      const dayAbbrev = format(dateObj, 'EEE', { locale: es });
      const dayNumber = format(dateObj, 'd');
      const capitalizedDay = dayAbbrev.charAt(0).toUpperCase() + dayAbbrev.slice(1);
      const label = `${capitalizedDay} ${dayNumber}`;

      return {
        date,
        label,
        trips: grouped[date] || []
      };
    });

    return result;
  }, [data, dateFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getCurrentDay().shift !== shiftFilter) {
        setShiftFilter(getCurrentDay().shift);
        setDateFilter([
          {
            startDate: new Date(getCurrentWeekStartEndDates().startDate),
            endDate: new Date(getCurrentWeekStartEndDates().endDate),
            key: "selection",
          },
        ]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [shiftFilter]);

  return (
    <div className="grid grid-cols-[1fr_5fr] flex-1 w-full gap-4">
      <PageHeader
        title="Reporte Semanal / Mineral"
        description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(dateFilter[0].startDate, "dd-MM-yyyy")} al ${format(dateFilter[0].endDate, "dd-MM-yyyy")}.`}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2"
        status={[
          {
            value: `${beaconTruck.filter((unit) => unit.status === "operativo").length} Operativos`,
            color: "#10aa18",
          },
          {
            value: `${beaconTruck.filter((unit) => unit.status === "mantenimiento").length} Mantenimiento`,
            color: "#d1be16",
          },
          {
            value: `${beaconTruck.filter((unit) => unit.status === "inoperativo").length} Inoperativos`,
            color: "#ca1616",
          },
        ]}
      />
      <div className="flex flex-col items-center justify-around gap-0">
        <IconTruck
          className="fill-yellow-500 h-30 w-40"
          color=""
        />

        <div className="flex flex-col gap-8">
          <DonutChart
            title="Extracción de Mineral (TM)"
            size="xlarge"
            donutData={{
              currentValue: baseStats.totalTM,
              total: planWeek.totalTonnageBlending || 0,
              currentValueColor: "#ff5000",
            }}
          />
          <Progress
            title=""
            value={baseStats.totalTM}
            total={planWeek.totalTonnageBlending || 0}
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
                currentValue:
                  12 *
                  isoDay *
                  (baseStats.totalUnitsNight + baseStats.totalUnitsDay) -
                  baseStats.totalMantanceTimeMin / 60,
                total:
                  12 *
                  isoDay *
                  (baseStats.totalUnitsNight + baseStats.totalUnitsDay),
                currentValueColor: "#ff5000",
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
                currentValue:
                  12 *
                  isoDay *
                  (baseStats.totalUnitsNight + baseStats.totalUnitsDay) -
                  baseStats.totalDuration / 3600,
                total:
                  12 *
                  isoDay *
                  (baseStats.totalUnitsNight + baseStats.totalUnitsDay),
                currentValueColor: "#ff5000",
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
                <p className="text-[11px] font-bold">
                  Mineral Extraído
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="flex bg-[#A6A6A6] w-2 h-2 rounded-full" />
                <p className="text-[11px] font-bold">
                  Planificado
                </p>
              </div>
            </div>
          }
        >
          <DonutAndSplineChartByDay
            mineralWeight={baseData.mineral}
            chartData={tripsByDate}
            planDay={planWeek}
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
                <p className="text-[11px] font-bold">
                  Diferencia positiva
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="flex bg-[#f9c83e] w-2 h-2 rounded-full" />
                <p className="text-[11px] font-bold">
                  Diferencia negativa
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
                <p className="text-[11px] font-bold">
                  Mineral Extraído Dia
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="flex bg-[#3c3c3c] w-2 h-2 rounded-full" />
                <p className="text-[11px] font-bold">
                  Mineral Extraído Noche
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="flex bg-[#b8b8b8] w-2 h-2 rounded-full" />
                <p className="text-[11px] font-bold">
                  Planificado
                </p>
              </div>
            </div>
          }
        >
          <LineAndBarChartByDay
            mineralWeight={baseData.mineral}
            chartColor="#ff5000"
            chartData={tripsByDate}
            planDay={planWeek}
          />
        </CardTitle>

        <div className="flex flex-col border border-zinc-100 shadow-sm rounded-xl p-3">
          <DonutAndTableChart
            title="Causas de Desviación del Plan %"
            donutData={[
              {
                title: "Disponibilidad",
                total:
                  shiftFilter === "dia"
                    ? baseStats.totalUnitsDay * 12
                    : baseStats.totalUnitsNight * 12,
                currentValue:
                  shiftFilter === "dia"
                    ? baseStats.totalUnitsDay * 12 -
                    baseStats.totalMaintenanceTimeMinDay / 60
                    : baseStats.totalUnitsNight * 12 -
                    baseStats.totalMaintenanceTimeMinNight / 60,
                currentValueColor: "#ff5000",
              },
              {
                title: "Utilización",
                total:
                  shiftFilter === "dia"
                    ? baseStats.totalUnitsDay * 12
                    : baseStats.totalUnitsNight * 12,
                currentValue:
                  shiftFilter === "dia"
                    ? baseStats.totalDurationDay / 3600
                    : baseStats.totalDurationNight / 3600,
                currentValueColor: "#ff5000",
              },
            ]}
            tableData={[
              {
                title: "Plan",
                currentValue: 60,
                total: 100,
                subData: [
                  {
                    title: "Tiempo de Carga por Camión",
                    currentValue: baseStats.avgLoadTime
                      ? Number(baseStats.avgLoadTime.toFixed(2))
                      : 0,
                    total: 10,
                  },
                  {
                    title: "Tiempo de Descarga de Camión",
                    currentValue: baseStats.avgUnloadTime
                      ? Number(baseStats.avgUnloadTime.toFixed(2))
                      : 0,
                    total: 10,
                  }
                ],
              },
              {
                title: "Duración del Ciclo Subterraneo",
                currentValue:
                  shiftFilter === "dia"
                    ? Number(baseStats.avgDurationSubterraneoTripsDay.toFixed(2))
                    : Number(baseStats.avgDurationSubterraneoTripsNight.toFixed(2)),
                total: 100,
                subData: [],
              },
              {
                title: "Duración del Ciclo Superficie",
                currentValue:
                  shiftFilter === "dia"
                    ? Number(baseStats.avgDurationSuperficieTripsDay.toFixed(2))
                    : Number(baseStats.avgDurationSuperficieTripsNight.toFixed(2)),
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

export default RealTimeByWeek;
