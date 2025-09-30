  import { useMemo, useState, useEffect } from "react";
  import { useFetchData } from "../../hooks/useGlobalQueryV2";
  // Components
  import PageHeader from "@/components/PageHeaderV2";
  import DonutAndSplineChartByHour from "@/components/Dashboard/Charts/DonutAndSplineChartByHour";
  import LineAndBarChartByHour from "@/components/Dashboard/Charts/LineAndBarChartByHour";
  import CardTitle from "@/components/Dashboard/CardTitleV2";
  // Types
  import type { BeaconCycle, BeaconUnitTrip } from "../../types/Beacon";
  import type { Mineral } from "@/types/Mineral";
  // Utils
  import { startOfWeek, endOfWeek, format, eachDayOfInterval } from "date-fns";
  import { ChartNoAxesColumn } from "lucide-react";
  import Progress from "@/components/Dashboard/Charts/Progress";
  import DonutChart from "@/components/Dashboard/Charts/DonutChart";
  import { getCurrentDay } from "@/utils/dateUtils";
  // Icons
  import { GiMineTruck } from "react-icons/gi";
  import { es } from "date-fns/locale";

  const RealTimeByWeek = () => {
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
      `beacon-track/trip?startDate=${format(
        dateFilter[0].startDate,
        "yyyy-MM-dd"
      )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}`,
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
    
      const allDays = eachDayOfInterval({
        start: dateFilter[0].startDate,
        end: dateFilter[0].endDate,
      });
    
      const grouped: {
        dia: { day: string; label: string; trips: BeaconUnitTrip[] }[];
        noche: { day: string; label: string; trips: BeaconUnitTrip[] }[];
      } = { dia: [], noche: [] };
    
      allDays.forEach((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const labelRaw = format(day, "EEE dd", { locale: es });
        const finalLabel = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);
    
        grouped.dia.push({ day: dayKey, label: finalLabel, trips: [] });
        grouped.noche.push({ day: dayKey, label: finalLabel, trips: [] });
      });
    
      trips.forEach((trip) => {
        const tripDate = new Date(trip.startDate);
        const dayKey = format(tripDate, "yyyy-MM-dd");
        const shift = tripDate.getHours() >= 6 && tripDate.getHours() < 18 ? "dia" : "noche";
    
        const dayGroup = grouped[shift].find((g) => g.day === dayKey);
        if (dayGroup) {
          dayGroup.trips.push(trip);
        }
      });
    
      return grouped;
    }, [data, dateFilter]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (getCurrentDay().shift !== shiftFilter) {
          setShiftFilter(getCurrentDay().shift);
          setDateFilter([
            {
              startDate: new Date(getCurrentDay().startDate),
              endDate: new Date(getCurrentDay().endDate),
              key: "selection",
            },
          ]);
        }
      }, 10000);

      return () => clearInterval(interval);
    }, [shiftFilter]);

    const turnConfig = {
      dia: {
        title: "Turno Día",
        color: "#fac34c",
        iconColor: "text-[#fac34c]",
        tm: baseStats.totalTMDay,
        trips: tripsByShift.dia,
        units: baseStats.totalUnitsDay,
      },
      noche: {
        title: "Turno Noche",
        color: "#3c3f43",
        iconColor: "text-[#3c3f43]",
        tm: baseStats.totalTMNight,
        trips: tripsByShift.noche,
        units: baseStats.totalUnitsNight,
      },
    };

    const active = turnConfig[shiftFilter];

    return (
      <div className="grid grid-cols-[1fr_5fr] flex-1 w-full gap-4">
        <PageHeader
          title="Reporte Semanal"
          description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(
            dateFilter[0].startDate,
            "dd-MM-yyyy"
          )}.`}
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
                currentValue:
                  24 * baseStats.totalUnits - baseStats.totalMantanceTimeMin / 60,
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
                currentValue:
                  24 * baseStats.totalUnitsNight +
                  24 * baseStats.totalUnitsDay -
                  baseStats.totalDuration / 3600,
                total:
                  24 * baseStats.totalUnitsNight + 24 * baseStats.totalUnitsDay,
                currentValueColor: "#14B8A6",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <CardTitle
            title={`Ejecución del plan general ${active.title} (TM)`}
            subtitle="Análisis de la cantidad de viajes realizados"
            icon={ChartNoAxesColumn}
            classIcon={active.iconColor}
          >
            <DonutAndSplineChartByHour
              progressBarData={{
                total: 1200,
                currentValue: 0,
                prediction: (active.tm / active.units) * 7,
                currentValueColor: active.color,
                showDifference: false,
                forecastText: "Predicción",
              }}
              mineralWeight={baseData.mineral}
              chartData={active.trips.map((item) => ({
                label: item.label,
                trips: [],
              }))}
              mode="day"
            />
          </CardTitle>

          <CardTitle
            title={`Ejecución de extracción de mineral ${active.title} (TM)`}
            subtitle="Análisis de la cantidad de viajes realizados"
            icon={GiMineTruck}
            classIcon="text-[#000000]"
          >
            <DonutAndSplineChartByHour
              progressBarData={{
                total: 1200,
                currentValue: active.tm,
                prediction: (active.tm / active.units) * 7,
                currentValueColor: active.color,
                showDifference: false,
                forecastText: "Predicción",
              }}
              mineralWeight={baseData.mineral}
              chartData={active.trips}
              mode="day"
            />
          </CardTitle>

          <CardTitle
            title={`LHD en ${active.title} (TM)`}
            subtitle="Análisis de la cantidad de viajes realizados"
            icon={ChartNoAxesColumn}
            classIcon={active.iconColor}
          >
            <LineAndBarChartByHour
              mineralWeight={baseData.mineral}
              chartColor={active.color}
              chartData={active.trips.map((item) => ({
                label: item.label,
                trips: item.trips,
              }))}
              mode="day"  
            />
          </CardTitle>

          <CardTitle
            title={`Camión en ${active.title} (TM)`}
            subtitle="Análisis de la cantidad de viajes realizados"
            icon={GiMineTruck}
            classIcon="text-[#000000]"
          >
            <LineAndBarChartByHour
              mineralWeight={baseData.mineral}
              chartColor={active.color}
              chartData={active.trips}
              mode="day"
            />
          </CardTitle>
        </div>
      </div>
    );
  };

  export default RealTimeByWeek;
