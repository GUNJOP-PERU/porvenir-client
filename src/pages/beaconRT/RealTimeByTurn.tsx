import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import { DateRange } from 'react-date-range';
import PageHeader from "@/components/PageHeaderV2";
import DonutAndSplineChartByHour from "@/components/Dashboard/Charts/DonutAndSplineChartByHour";
import LineAndBarChartByHour from "@/components/Dashboard/Charts/LineAndBarChartByHour";
import CardItem from "@/components/Dashboard/CardItemV2";
import CardTitle from "@/components/Dashboard/CardTitleV2";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { format, set } from "date-fns";
import { ChartNoAxesColumn } from "lucide-react";
import { StatusDisplay } from "@/components/Dashboard/StatusDisplay";
import Progress from "@/components/Dashboard/Charts/Progress";
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import { getCurrentDay } from "@/utils/dateUtils";
// Icons
import { GiMineTruck } from "react-icons/gi";

const RealTimeByHourRT = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [dateFilter, setDateFilter] = useState<[{ startDate: Date; endDate: Date; key: string }]>([
    {
      startDate: new Date(getCurrentDay().startDate),
      endDate: new Date(getCurrentDay().endDate),
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
    "trip-group-by-current-day-truck",
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
        totalMantanceTimeMin: 0,
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

    const totalMantanceTimeMin = data.reduce(
      (acc, tripsTruck) => acc + tripsTruck.totalMaintanceTimeMin,
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
      totalMantanceTimeMin,
      dayTrips,
      nightTrips,
      totalTMDay,
      totalTMNight,
    };
  }, [data, baseData]);

  const tripsByShift = useMemo(() => {
    if (!data) return { dia: [], noche: [] };

    const trips = data.map((unitGroup) => unitGroup.trips).flat();
    const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? `0${i}` : i}:00`);

    const grouped: { dia: { hour: string; trips: BeaconUnitTrip[] }[]; noche: { hour: string; trips: BeaconUnitTrip[] }[] } = {
      dia: hours.slice(6, 18).map((hour) => ({ hour, trips: [] })),
      noche: [
        ...hours.slice(18, 24).map((hour) => ({ hour, trips: [] })),
        ...hours.slice(0, 6).map((hour) => ({ hour, trips: [] })),
      ],
    };

    trips.forEach((trip) => {
      const tripDate = new Date(trip.startDate);
      const hour = `${tripDate.getHours() < 10 ? `0${tripDate.getHours()}` : tripDate.getHours()}:00`;
      const shift = tripDate.getHours() >= 6 && tripDate.getHours() < 18 ? "dia" : "noche";

      const hourGroup = grouped[shift].find((group) => group.hour === hour);
      if (hourGroup) {
        hourGroup.trips.push(trip);
      }
    });

    return grouped;
  }, [data]);

  useEffect(() => {
    refetch();
  }, [dateFilter, shiftFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getCurrentDay().shift !== shiftFilter) {
        setShiftFilter(getCurrentDay().shift);
        setDateFilter([{
          startDate: new Date(getCurrentDay().startDate),
          endDate: new Date(getCurrentDay().endDate),
          key: "selection",
        }]);
        refetch();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [shiftFilter, refetch]);

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
    <div className="grid grid-cols-[1fr_5fr] flex-1 w-full gap-4">
      <PageHeader
        title="Reporte por Turno"
        description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(dateFilter[0].startDate, 'dd-MM-yyyy')}.`}
        refetch={refetch}
        isFetching={isFetching}
        count={data.length}
        setDialogOpen={false}
        className="col-span-2"
      />
      <div className="flex flex-col justify-between">
        <div>
          <DonutChart
            title="Plan General (TM)"
            size="medium"
            donutData={{
              currentValue: 0,
              total: 2400,
              currentValueColor: "#14B8A6",
            }}
          />
          <Progress
            title=""
            value={0}
            total={2400}
            color="#14B8A6"
            showLegend={false}
            className="mt-2"
          />
        </div>
        <div>
          <DonutChart
            title="Extracción de Mineral (TM)"
            size="medium"
            donutData={{
              currentValue: baseStats.totalTM,
              total: 2400,
              currentValueColor: "#14B8A6",
            }}
          />
          <Progress
            title=""
            value={baseStats.totalTM}
            total={2400}
            color="#14B8A6"
            showLegend={false}
            className="mt-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <h3 className="font-bold text-center leading-none text-[13px] col-span-2">
            Disponibilidad de LHD y Camiones
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
          <DonutChart
            title=""
            size="medium"
            donutData={{
              currentValue: 24 * baseStats.totalUnits - baseStats.totalMantanceTimeMin / 60,
              total: 24 * baseStats.totalUnits,
              currentValueColor: "#14B8A6",
            }}
          />
          <h3 className="font-bold text-center leading-none text-[13px] col-span-2">
            Usabilidad de LHD y Camiones
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
          <DonutChart
            title=""
            size="medium"
            donutData={{
              currentValue: (24 * baseStats.totalUnitsNight + 24 * baseStats.totalUnitsDay) - baseStats.totalDuration / 3600,
              total: (24 * baseStats.totalUnitsNight + 24 * baseStats.totalUnitsDay),
              currentValueColor: "#14B8A6",
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        { shiftFilter === "dia" ? (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Ejecución del plan general Turno Dia (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#fac34c]"
              className="custom-class"
            >
              <DonutAndSplineChartByHour
                progressBarData={{
                  total: 1200,
                  currentValue: 0,
                  prediction: (baseStats.totalTMDay / baseStats.totalUnitsDay) * 7,
                  currentValueColor: "#fac34c",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={tripsByShift.dia.map(item => ({ hour: item.hour, trips: [] }))}
              />
            </CardTitle>
            <CardTitle
              title="LHD en Turno Dia (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#fac34c]"
            >
              <LineAndBarChartByHour
                mineralWeight={baseData.mineral}
                chartColor="#fac34c"
                chartData={tripsByShift.dia.map(item => ({ hour: item.hour, trips: [] }))}
              />
            </CardTitle>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Ejecución del plan general Turno Noche (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#3c3f43]"
            >
              <DonutAndSplineChartByHour
                progressBarData={{
                  total: 1200,
                  currentValue: 0,
                  prediction:
                    (baseStats.totalTMNight / baseStats.totalUnitsNight) * 7,
                  currentValueColor: "#00000050",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={tripsByShift.noche.map(item => ({ hour: item.hour, trips: [] }))}
              />
            </CardTitle>

            <CardTitle
              title="LHD en Turno Noche (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={ChartNoAxesColumn}
              classIcon="text-[#3c3f43]"
            >
              <LineAndBarChartByHour
                mineralWeight={baseData.mineral}
                chartColor="#3c3f43"
                chartData={tripsByShift.noche.map(item => ({ hour: item.hour, trips: [] }))}
              />
            </CardTitle>
          </div>
        )}
        { shiftFilter === "dia" ? (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Ejecución de extracción de mineral Turno Dia (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={GiMineTruck}
              classIcon="text-[#000000]"
              className="custom-class"
            >
              <DonutAndSplineChartByHour
                progressBarData={{
                  total: 1200,
                  currentValue: baseStats.totalTMDay,
                  prediction: (baseStats.totalTMDay / baseStats.totalUnitsDay) * 7,
                  currentValueColor: "#fac34c",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={tripsByShift.dia}
              />
            </CardTitle>
            <CardTitle
              title="Camion en Turno Dia (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={GiMineTruck}
              classIcon="text-[#000000]"
            >
              <LineAndBarChartByHour
                mineralWeight={baseData.mineral}
                chartColor="#fac34c"
                chartData={tripsByShift.dia}
              />
            </CardTitle>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Ejecución de extracción de mineral Turno Noche (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={GiMineTruck}
              classIcon="text-[#000000]"
            >
              <DonutAndSplineChartByHour
                progressBarData={{
                  total: 1200,
                  currentValue: baseStats.totalTMNight,
                  prediction:
                    (baseStats.totalTMNight / baseStats.totalUnitsNight) * 7,
                  currentValueColor: "#00000050",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                mineralWeight={baseData.mineral}
                chartData={tripsByShift.noche}
              />
            </CardTitle>

            <CardTitle
              title="Camion en Turno Noche (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              icon={GiMineTruck}
              classIcon="text-[#000000]"
            >
              <LineAndBarChartByHour
                mineralWeight={baseData.mineral}
                chartColor="#3c3f43"
                chartData={tripsByShift.noche}
              />
            </CardTitle>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeByHourRT;