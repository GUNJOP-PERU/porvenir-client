import { useMemo, useState, useEffect, useCallback } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import PageHeader from "@/components/PageHeaderV2";
import DonutAndSplineChartByHour from "@/components/Dashboard/Charts/DonutAndSplineChartByHour";
import LineAndBarChartByHour from "@/components/Dashboard/Charts/LineAndBarChartByHour";
import CardTitle from "@/components/Dashboard/CardTitleV2";
import DonutAndTableChart from "@/components/Dashboard/Charts/DonutAndTableChart";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
import type { PlanDay } from "@/types/Plan";
// Utils
import { format } from "date-fns";
import Progress from "@/components/Dashboard/Charts/Progress";
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import { getCurrentDay, planDayDateParser } from "@/utils/dateUtils";
import { calculateTripPrediction } from "@/utils/predictionUtils";
// Icons
import IconTruck from "@/icons/IconTruck";

const RealTimeByHourRT = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [dateFilter, setDateFilter] = useState<
    [{ startDate: Date; endDate: Date; key: string }]
  >([
    {
      startDate: new Date(getCurrentDay().startDate),
      endDate: new Date(getCurrentDay().endDate),
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
    "trip-group-by-current-day-truck-mineral-rt",
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", {
    refetchInterval: 10000,
  });

  const {
    data : beaconTruck = []
  } = useFetchData<{status: string}[]>("beacon-truck", "beacon-truck", { refetchInterval: 10000 });


  const { data: planData = [] } = useFetchData<PlanDay[]>(
    "planday-rt",
    `planDay/by-date-range?startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}`,
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

  const planDay = useMemo(() => {
    const currentDate = format(getCurrentDay().startDate, "yyyy-MM-dd");
    const filteredPlanData = planData.filter(
      (day) =>
        day.shift === shiftFilter &&
        planDayDateParser(day.date) === currentDate &&
        day.phase === "mineral"
    );
    const planDataBlending = filteredPlanData.filter(day => day.type === "blending");
    const planDataModificado = filteredPlanData.filter(day => day.type === "modificado");

    return {
      totalTonnage: filteredPlanData.reduce((acc, day) => acc + day.tonnage, 0),
      totalTonnageBlending: planDataBlending.reduce((acc, day) => acc + day.tonnage, 0),
      totalTonnageModificado: planDataModificado.reduce((acc, day) => acc + day.tonnage, 0),
      planDayShift: filteredPlanData,
      planDataBlending,
      planDataModificado,
      planDay: filteredPlanData,
    };
  }, [planData, shiftFilter]);

  const prediction = useMemo(() => {
    return calculateTripPrediction(data, beaconTruck, baseData.mineral, planDay.totalTonnageBlending);
  }, [data, beaconTruck, baseData.mineral, shiftFilter]);

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
        totalMaintenanceTimeMinDay: 0,
        totalMaintenanceTimeMinNight: 0,
        totalMaintenanceTimeMin: 0,
        dayTrips: 0,
        nightTrips: 0,
        totalTMDay: 0,
        totalTMNight: 0,
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
      totalUnitsDay: data.filter((unit) => unit.trips.length > 0).length,
      totalUnitsNight: data.filter((unit) => unit.trips.length > 0).length,
      totalTrips,
      totalTM,
      totalDuration,
      totalDurationNight,
      totalDurationDay,
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

  const tripsByShift = useMemo(() => {
    if (!data) return { dia: [], noche: [] };

    const trips = data.map((unitGroup) => unitGroup.trips).flat();
    const hours = Array.from(
      { length: 24 },
      (_, i) => `${i < 10 ? `0${i}` : i}:00`
    );

    const grouped: {
      dia: { hour: string; trips: BeaconUnitTrip[] }[];
      noche: { hour: string; trips: BeaconUnitTrip[] }[];
    } = {
      dia: hours.slice(7, 19).map((hour) => ({ hour, trips: [] })),
      noche: [
        ...hours.slice(19, 24).map((hour) => ({ hour, trips: [] })),
        ...hours.slice(0, 7).map((hour) => ({ hour, trips: [] })),
      ],
    };

    trips.forEach((trip) => {
      const tripDate = new Date(trip.endDate);
      const hour = `${
        tripDate.getHours() < 10
          ? `0${tripDate.getHours()}`
          : tripDate.getHours()
      }:00`;
      const shift = tripDate.getHours() >= 7 && tripDate.getHours() < 19 ? "dia" : "noche";

      const hourGroup = grouped[shift].find((group) => group.hour === hour);
      if (hourGroup) {
        hourGroup.trips.push(trip);
      }
    });

    return grouped;
  }, [data]);

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
        refetch();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [shiftFilter, refetch]);

  const calculatePlanPrediction = useCallback(() => {
    const valueByHour = planDay.totalTonnageBlending / 12;
    const currentDate = new Date();
    let hoursPassed = 0;
    if(shiftFilter === "dia") {
      hoursPassed = currentDate.getHours() + currentDate.getMinutes() / 60 - 7;
    } else if (currentDate.getHours() < 7 && shiftFilter === "noche") {
      hoursPassed = currentDate.getHours() + currentDate.getMinutes() / 60 + 5;
    } else {
      hoursPassed = currentDate.getHours() + currentDate.getMinutes() / 60 - 19;
    }
  }, [planDay.totalTonnageBlending, shiftFilter]);

  useEffect(() => {
    // Ejecutar inmediatamente al montar
    calculatePlanPrediction();
    
    const interval = setInterval(() => {
      calculatePlanPrediction();
    }, 10000);

    return () => clearInterval(interval);
  }, [calculatePlanPrediction]);

  return (
    <div className="grid grid-cols-[1fr_5fr] flex-1 w-full gap-4">
      <PageHeader
        title="Reporte por Turno / Mineral"
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2"
        status={[
          { value: `${beaconTruck.filter((unit) => unit.status === "operativo").length} Operativos`,
            color: "#10aa18",
          },
          { value: `${beaconTruck.filter((unit) => unit.status === "mantenimiento").length} Mantenimiento`,
            color: "#d1be16",
          },
          { value: `${beaconTruck.filter((unit) => unit.status === "inoperativo").length} Inoperativos`,
            color: "#ca1616",
          },
        ]}
      />
      <div className="flex flex-col items-center justify-around gap-0">
        <IconTruck
          className="fill-yellow-500 h-30 w-40"
          color=""
          style={{}}
        />
  
        <div className="flex flex-col gap-8">
          <DonutChart
            title="Extracción de Mineral (TM)"
            size="xlarge"
            donutData={{
              currentValue: baseStats.totalTM,
              total: planDay.totalTonnageBlending,
              currentValueColor: "#ff5000",
            }}
          />
          <Progress
            title=""
            value={baseStats.totalTM}
            total={planDay.totalTonnageBlending}
            color="#ff5000"
            showLegend={false}
            className="mt-2"
            prediction={prediction.predictedTotalTM}
            predictionText="Proyección"
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
                currentValue: beaconTruck.filter((unit) => unit.status === "operativo").length,
                total: beaconTruck.length,
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
                currentValue: beaconTruck.filter((unit) => unit.status === "operativo").length,
                total: beaconTruck.length,
                currentValueColor: "#ff5000",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">  
        {shiftFilter === "dia" ? (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Ejecución de extracción de mineral acumulado (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              // icon={IconTruck}
              classIcon="fill-yellow-500 h-7 w-14"
              className="custom-class"
              actions={
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#ff5000] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Mineral Extraído
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#A6A6A6] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Planificado
                    </p>
                  </div>
                </div>
              }
            >
              <DonutAndSplineChartByHour
                progressBarData={{
                  total: planDay.totalTonnage,
                  currentValue: baseStats.totalTMDay,
                  prediction: prediction.predictedTotalTM,
                  predictionText: "Proyección",
                  currentValueColor: "#ff5000",
                  showDifference: false,
                  forecastText: "Proyección",
                }}
                mineralWeight={baseData.mineral}
                chartData={tripsByShift.dia}
                planDay={planDay}
              />
            </CardTitle>
            <CardTitle
              title="Ejecución de extracción de mineral por hora (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              // icon={IconTruck}
              classIcon="fill-yellow-500 h-7 w-14"
              actions={
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#68c970] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Diferencia positiva
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#f9c83e] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Diferencia negativa
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#ff5000] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Mineral Extraído
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#b8b8b8] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Planificado
                    </p>
                  </div>
                </div>
              }
            >
              <LineAndBarChartByHour
                mineralWeight={baseData.mineral}
                chartColor="#ff5000"
                chartData={tripsByShift.dia}
                planDay={planDay}
              />
            </CardTitle>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
            <CardTitle
              title="Ejecución de extracción de mineral acumulado (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              // icon={IconTruck}
              classIcon="fill-yellow-500 h-7 w-14"
              actions={
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#ff5000] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Mineral Extraído
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#A6A6A6] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Planificado
                    </p>
                  </div>
                </div>
              }
            >
              <DonutAndSplineChartByHour
                progressBarData={{
                  total: planDay.totalTonnage,
                  currentValue: baseStats.totalTMNight,
                  currentValueColor: "#ff5000",
                  showDifference: false,
                  forecastText: "Predicción",
                }}
                planDay={planDay}
                mineralWeight={baseData.mineral}
                chartData={tripsByShift.noche}
              />
            </CardTitle>
            <CardTitle
              title="Ejecución de extracción de mineral por hora (TM)"
              subtitle="Análisis de la cantidad de viajes realizados"
              // icon={IconTruck}
              classIcon="fill-yellow-500 h-7 w-14"
              actions={
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#68c970] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Diferencia positiva
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#f9c83e] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Diferencia negativa
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#ff5000] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Mineral Extraído
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="flex bg-[#b8b8b8] w-2 h-2 rounded-full"/>
                    <p className="text-[11px] font-bold">
                      Planificado
                    </p>
                  </div>
                </div>
              }
            >
              <LineAndBarChartByHour
                mineralWeight={baseData.mineral}
                chartColor="#ff5000"
                planDay={planDay}
                chartData={tripsByShift.noche}
              />
            </CardTitle>
          </div>
        )}
        <div className="flex flex-col border border-zinc-100 shadow-sm rounded-xl p-3">
          <DonutAndTableChart
            title="Causas de Desviación del Plan %"
            donutData={[
              {
                title: "Disponibilidad",
                total: beaconTruck.length,
                currentValue: beaconTruck.filter((unit) => unit.status === "operativo").length,
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

export default RealTimeByHourRT;
