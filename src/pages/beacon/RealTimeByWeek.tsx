import { useState, useMemo, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import { DateRange } from 'react-date-range';
import PageHeader from "@/components/PageHeaderV2";
import DonutAndSplineChartByDay from "@/components/Dashboard/Charts/DonutAndSplineChartByDay";
import LineAndBarChartByDay from "@/components/Dashboard/Charts/LineAndBarChartByDay";
import CardItem from "@/components/Dashboard/CardItemV2";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { getCurrentWeekStartEndDates } from "@/utils/dateUtils";
import { format, getISODay } from "date-fns";
import CardTitle from "@/components/Dashboard/CardTitleV2";
import { ChartNoAxesColumn } from "lucide-react";
import { StatusDisplay } from "@/components/Dashboard/StatusDisplay";
import Progress from "@/components/Dashboard/Charts/Progress";

const RealTimeByDay = () => {
  const isoDayNumber = getISODay(new Date());
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [dateFilter, setDateFilter] = useState<[{ startDate: Date; endDate: Date; key: string }]>([
    {
      startDate: new Date(getCurrentWeekStartEndDates().startDate),
      endDate: new Date(getCurrentWeekStartEndDates().endDate),
      key: "selection",
    }
  ]);

  const {
    data = [],
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-day-week",
    `beacon-track/trip?startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", {
    refetchInterval: 10000,
  });

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
        totalUnits: 0,
        totalUnitsDay: 0,
        totalUnitsNight: 0,
        totalTrips: 0,
        totalTM: 0,
        totalDuration: 0,
        totalDurationNight: 0,
        totalDurationDay: 0,
        dayTrips: 0,
        nightTrips: 0,
        totalTMNight: 0,
        totalTMDay: 0,
      };
    }

    const totalTrips = data.reduce((acc, day) => acc + day.totalTrips, 0);
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
      dayTrips,
      nightTrips,
      totalTMDay,
      totalTMNight,
    };
  }, [data, baseData]);

  const tripsByDay = useMemo(() => {
    if (!data) return [];

    const trips = data.map((unitGroup) => unitGroup.trips).flat();
    const grouped: Record<string, BeaconUnitTrip[]> = trips.reduce((acc, trip) => {
      const day = format(new Date(trip.startDate), "yyyy-MM-dd");
      if (!acc[day]) acc[day] = [];
      acc[day].push(trip);
      return acc;
    }, {} as Record<string, BeaconUnitTrip[]>);
    return Object.entries(grouped).map(([date, trips]) => ({
      date,
      trips,
    }));
  }, [data]);

  useEffect(() => {
    refetch();
  }, [dateFilter, shiftFilter]);

  // if (tripsLoading || tripsError || !data || data.length === 0) {
  //   return (
  //     <StatusDisplay
  //       isLoading={tripsLoading}
  //       isError={tripsError}
  //       noData={!data || data.length === 0}
  //     />
  //   );
  // }

  return (
    <div className="grid grid-cols-1 flex-1 w-full gap-2">
      <PageHeader
        title="Reporte Semanal de Viajes"
        description={`Reporte en tiempo real de los viajes realizados por los camiones. ${format(dateFilter[0].startDate, 'dd-MM-yyyy')} al ${format(dateFilter[0].endDate, 'dd-MM-yyyy')}`}
        refetch={refetch}
        isFetching={isFetching}
        count={data.length}
        setDialogOpen={false}
        actions={
          <div className="relative flex flex-row gap-2">
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Turno:
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                {/* <option value="">Ambos</option> */}
                <option value="dia">Turno Día</option>
                <option value="noche">Turno Noche</option>
              </select>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Rango de Fechas:
              <button
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                {dateFilter[0] &&
                  `${format(dateFilter[0].startDate, "dd/MM/yyyy")} - ${format(
                    dateFilter[0].endDate,
                    "dd/MM/yyyy"
                  )}`}
              </button>
            </label>
            {isTooltipOpen && (
              <div className="absolute right-0 top-10 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                <DateRange
                  editableDateInputs={false}
                  onChange={(item) =>
                    setDateFilter([
                      {
                        startDate: item.selection?.startDate || new Date(),
                        endDate: item.selection?.endDate || new Date(),
                        key: "selection",
                      },
                    ])
                  }
                  moveRangeOnFirstSelection={false}
                  ranges={dateFilter}
                />
              </div>
            )}
          </div>
        }
      />
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        <CardItem
          value={baseStats.totalUnits}
          title="Total de Camiones"
          valueColor="text-[#000000]"
          unid="camiones"
        />
        <CardItem
          value={baseStats.totalTrips}
          title="Viajes Totales"
          valueColor="text-[#1E64FA]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.dayTrips}
          subtitle={baseStats.totalTMDay}
          subtitleUnid="TM"
          title="Viajes Diurnos"
          valueColor="text-[#fac34c]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.nightTrips}
          title="Viajes Nocturnos"
          subtitle={baseStats.totalTMNight}
          subtitleUnid="TM"
          valueColor="text-[#3c3f43]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.totalDuration / 3600}
          title="Duración Total (horas)"
          valueColor="text-[#1E64FA]"
          unid="horas"
        />
        <CardItem
          value={baseStats.totalTM}
          title="Tonelaje Total (TM)"
          valueColor="text-[#1E64FA]"
          unid="TM"
        />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        <Progress
          title="Extracción de mineral en TM"
          value={baseStats.totalTM}
          total={2400 * 7}
          color="#14B8A6"
        />
        <Progress
          title="Horas Trabajadas en la Semana"
          value={Number(baseStats.totalDuration / 3600)}
          total={24 * baseStats.totalUnits * isoDayNumber}
          color="#3889F2"
          unit="hrs"
        />
        <Progress
          title="Horas Trabajadas Turno Día"
          value={Number(baseStats.totalDurationDay / 3600)}
          total={12 * baseStats.totalUnitsDay * isoDayNumber}
          color="#fac34c"
          unit="hrs"
        />

        <Progress
          title="Horas Trabajadas Turno Noche"
          value={Number(baseStats.totalDurationNight / 3600)}
          total={12 * baseStats.totalUnitsNight * isoDayNumber}
          color="#fac34c"
          unit="hrs"
        />

      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        { shiftFilter === "dia" ? (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Acumulado de Extracción de mineral Turno Día en TM de los Scoop"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#fac34c]"
            >
              <DonutAndSplineChartByDay
                progressBarData={{
                  total: 1200 * 7,
                  currentValue: 0,
                  prediction: (baseStats.totalTMDay / baseStats.totalUnitsDay) * 7,
                  currentValueColor: "#fac34c",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={{
                  totalTrips: 0,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: 0
                  })),
                }}
              />
            </CardTitle>
            <CardTitle
              title="Extracción de mineral turno Dia en TM de los Scoop"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#fac34c]"
            >
              <LineAndBarChartByDay
                mineralWeight={baseData.mineral}
                chartColor="#fac34c"
                chartData={{
                  totalTrips: 0,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: 0,
                  })),
                }}
              />
            </CardTitle>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Acumulado de Extracción de mineral Turno Noche en TM de los Scoop"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#3c3f43]"
            >
              <DonutAndSplineChartByDay
                progressBarData={{
                  total: 1200 * 7,
                  currentValue: 0,
                  prediction:
                    (baseStats.totalTMNight / baseStats.totalUnitsNight) * 7,
                  currentValueColor: "#00000050",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={{
                  totalTrips: baseStats.nightTrips,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: 0,
                  })),
                }}
              />
            </CardTitle>

            <CardTitle
              title="Extracción de mineral turno Noche en TM de los Scoop"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#3c3f43]"
            >
              <LineAndBarChartByDay
                mineralWeight={baseData.mineral}
                chartColor="#3c3f43"
                chartData={{
                  totalTrips: 0,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: 0,
                  })),
                }}
              />
            </CardTitle>
          </div>
        )}
        { shiftFilter === "dia" ? (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Acumulado de Extracción de mineral Turno Día en TM de los Camiones"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#fac34c]"
            >
              <DonutAndSplineChartByDay
                progressBarData={{
                  total: 1200 * 7,
                  currentValue: baseStats.totalTMDay,
                  prediction: (baseStats.totalTMDay / baseStats.totalUnitsDay) * 7,
                  currentValueColor: "#fac34c",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={{
                  totalTrips: baseStats.dayTrips,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: dayGroup.trips.filter(
                      (trip) => trip.shift === "dia"
                    ).length,
                  })),
                }}
              />
            </CardTitle>
            <CardTitle
              title="Extracción de mineral turno Dia en TM de los Camiones"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#fac34c]"
            >
              <LineAndBarChartByDay
                mineralWeight={baseData.mineral}
                chartColor="#fac34c"
                chartData={{
                  totalTrips: baseStats.dayTrips,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: dayGroup.trips.filter(
                      (trip) => trip.shift === "dia"
                    ).length,
                  })),
                }}
              />
            </CardTitle>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Acumulado de Extracción de mineral Turno Noche en TM"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#3c3f43]"
            >
              <DonutAndSplineChartByDay
                progressBarData={{
                  total: 1200 * 7,
                  currentValue: baseStats.totalTMNight,
                  prediction:
                    (baseStats.totalTMNight / baseStats.totalUnitsNight) * 7,
                  currentValueColor: "#00000050",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={{
                  totalTrips: baseStats.nightTrips,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: dayGroup.trips.filter(
                      (trip) => trip.shift === "noche"
                    ).length,
                  })),
                }}
              />
            </CardTitle>

            <CardTitle
              title="Extracción de mineral turno Noche en TM"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#3c3f43]"
            >
              <LineAndBarChartByDay
                mineralWeight={baseData.mineral}
                chartColor="#3c3f43"
                chartData={{
                  totalTrips: baseStats.nightTrips,
                  statsByDay: tripsByDay.map((dayGroup) => ({
                    date: dayGroup.date,
                    totalTrips: dayGroup.trips.filter(
                      (trip) => trip.shift === "noche"
                    ).length,
                  })),
                }}
              />
            </CardTitle>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeByDay;