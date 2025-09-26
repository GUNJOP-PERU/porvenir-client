import { useMemo } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import DonutAndSplineChartByHour from "@/components/Dashboard/Charts/DonutAndSplineChartByHour";
import LineAndBarChartByHour from "@/components/Dashboard/Charts/LineAndBarChartByHour";
import CardItem from "@/components/Dashboard/CardItemV2";
import CardTitle from "@/components/Dashboard/CardTitle";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { ChartNoAxesColumn } from "lucide-react";
import { StatusDisplay } from "@/components/Dashboard/StatusDisplay";
import Progress from "@/components/Dashboard/Charts/Progress";
import { getCurrentDay } from "@/utils/dateUtils";

const RealTimeByHour = () => {
  const dateFilter  = {
    startDate: getCurrentDay().startDate,
    endDate: getCurrentDay().endDate,
  };

  const {
    data,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day",
    `beacon-track/trip?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`,
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

  if (tripsLoading || tripsError || !data || data.length === 0) {
    return (
      <StatusDisplay
        isLoading={tripsLoading}
        isError={tripsError}
        noData={!data || data.length === 0}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 flex-1 w-full gap-2">
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
          total={2400}
          color="#14B8A6"
        />
        <Progress
          title="Horas Trabajadas en el Dia"
          value={Number(baseStats.totalDuration / 3600)}
          total={24 * baseStats.totalUnits}
          color="#3889F2"
          unit="hrs"
        />
        <Progress
          title="Horas Trabajadas Turno Día"
          value={Number(baseStats.totalDurationDay / 3600)}
          total={12 * baseStats.totalUnitsDay}
          color="#fac34c"
          unit="hrs"
        />

        <Progress
          title="Horas Trabajadas Turno Noche"
          value={Number(baseStats.totalDurationNight / 3600)}
          total={12 * baseStats.totalUnitsNight}
          color="#fac34c"
          unit="hrs"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        <CardTitle
          title="Acumulado de Extracción de mineral Turno Día en TM"
          subtitle="Análisis de la cantidad de viajes realizados"
          icon={ChartNoAxesColumn}
          classIcon="text-[#fac34c]"
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
          title="Acumulado de Extracción de mineral Turno Noche en TM"
          subtitle="Análisis de la cantidad de viajes realizados"
          icon={ChartNoAxesColumn}
          classIcon="text-[#3c3f43]"
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
          title="Extracción de mineral turno Dia en TM"
          subtitle="Análisis de la cantidad de viajes realizados"
          icon={ChartNoAxesColumn}
          classIcon="text-[#fac34c]"
        >
          <LineAndBarChartByHour
            mineralWeight={baseData.mineral}
            chartColor="#fac34c"
            chartData={tripsByShift.dia}
          />
        </CardTitle>
        <CardTitle
          title="Extracción de mineral turno Noche en TM"
          subtitle="Análisis de la cantidad de viajes realizados"
          icon={ChartNoAxesColumn}
          classIcon="text-[#3c3f43]"
        >
          <LineAndBarChartByHour
            mineralWeight={baseData.mineral}
            chartColor="#3c3f43"
            chartData={tripsByShift.noche}
          />
        </CardTitle>
      </div>
    </div>
  );
};

export default RealTimeByHour;