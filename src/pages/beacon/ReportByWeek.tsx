import { useMemo, useState, useEffect, useRef } from "react";
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
// Utils
import {
  startOfWeek,
  endOfWeek,
  format,
  eachDayOfInterval,
} from "date-fns";
import { DateRange } from "react-date-range";
import Progress from "@/components/Dashboard/Charts/Progress";
import DonutChart from "@/components/Dashboard/Charts/DonutChart";
// Icons
import { es } from "date-fns/locale";
import { useFetchGraphicData } from "@/hooks/useGraphicData";
import IconTruck from "@/icons/IconTruck";

const ReportByWeek = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter[0].startDate,"yyyy-MM-dd")}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}${shiftFilter ? `&shift=${shiftFilter}` : ""}`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", {
    refetchInterval: 10000,
  });

  const {
    data : beaconTruck = []
  } = useFetchData<{status: string}[]>("beacon-truck", "beacon-truck", { refetchInterval: 10000 });


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
      const shift =
        tripDate.getHours() >= 6 && tripDate.getHours() < 18 ? "dia" : "noche";

      const dayGroup = grouped[shift].find((g) => g.day === dayKey);
      if (dayGroup) {
        dayGroup.trips.push(trip);
      }
    });

    return grouped;
  }, [data, dateFilter]);

  useEffect(() => {
    refetch();
  }, [shiftFilter]);

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // No cerrar si el clic es en el botón o dentro del calendario
      if (
        (calendarRef.current && calendarRef.current.contains(target)) ||
        (buttonRef.current && buttonRef.current.contains(target))
      ) {
        return;
      }
      
      setIsTooltipOpen(false);
    };

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipOpen]);

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
      color: "#00000050",
      iconColor: "text-[#00000050]",
      tm: baseStats.totalTMNight,
      trips: tripsByShift.noche,
      units: baseStats.totalUnitsNight,
    },
  };

  const active = turnConfig[shiftFilter];

  const { data: dataPlan = [] } = useFetchGraphicData({
    queryKey: "plan-week-history",
    endpoint: "planWeek",
    filters: `startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}${
      shiftFilter ? `&shift=${shiftFilter}` : ""
    }`,
  });

  const planDay = useMemo(() => {
    if (!dataPlan || dataPlan.length === 0) return null;
    const plan = dataPlan[0];
    const safePlanDay = plan.dataCalculate || [];

    return {
      totalTonnage: plan.totalTonnage || 0,
      planDayShift: [],
      planDay: shiftFilter
        ? safePlanDay.map((item: any) => ({
            date: item.date,
            tonnage: item.tonnageByTurno?.[shiftFilter] || 0,
          }))
        : safePlanDay,
    };
  }, [dataPlan, shiftFilter]);

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
        setDialogOpen={false}
        className="col-span-2"
        count={data.length}
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
                ref={buttonRef}
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
              <div 
                ref={calendarRef}
                className="absolute right-0 top-10 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                <DateRange
                  editableDateInputs={false}
                  onChange={(item) => {
                    const selectedDate = item.selection?.startDate || new Date();
                    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
                    
                    setDateFilter([
                      {
                        startDate: weekStart,
                        endDate: weekEnd,
                        key: "selection",
                      },
                    ]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={dateFilter}
                  weekStartsOn={1}
                  showMonthAndYearPickers={false}
                  fixedHeight={true}
                />
              </div>
            )}
          </div>
        }
      />
      <div className="flex flex-col justify-around">
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
              total: planDay?.totalTonnage,
              currentValueColor: "#14B8A6",
            }}
          />
          <Progress
            title=""
            value={baseStats.totalTM}
            total={planDay?.totalTonnage}
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
              currentValue: 12 * 7 * (baseStats.totalUnitsNight + baseStats.totalUnitsDay) - baseStats.totalMantanceTimeMin / 60,
              total: 12 * 7 * (baseStats.totalUnitsNight + baseStats.totalUnitsDay),
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
                12 *
                  7 *
                  (baseStats.totalUnitsNight + baseStats.totalUnitsDay) -
                baseStats.totalDuration / 3600,
              total:
                12 *
                7 *
                (baseStats.totalUnitsNight + baseStats.totalUnitsDay),
              currentValueColor: "#14B8A6",
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-2">
        <CardTitle
          title={`Ejecución de extracción de mineral ${active.title} (TM)`}
          subtitle="Análisis de la cantidad de viajes realizados TRUCK"
          icon={IconTruck}
          classIcon="fill-yellow-500 h-7 w-16"
        >
          <DonutAndSplineChartByHour
            progressBarData={{
              total: planDay?.totalTonnage,
              currentValue: active.tm,
              prediction: (active.tm / active.units) * 7,
              currentValueColor: active.color,
              showDifference: false,
              forecastText: "Predicción",
            }}
            mineralWeight={baseData.mineral}
            chartData={active.trips}
            mode="day"
            planDay={planDay}
          />
        </CardTitle>

        <CardTitle
          title={`Camión en ${active.title} (TM)`}
          subtitle="Análisis de la cantidad de viajes realizados TRUCK"
          icon={IconTruck}
          classIcon="fill-yellow-500 h-7 w-14"
        >
          <LineAndBarChartByHour
            mineralWeight={baseData.mineral}
            chartColor={active.color}
            chartData={active.trips}
            mode="day"
            planDay={planDay}
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
                    ? baseStats.totalUnitsDay * 7 * 12
                    : baseStats.totalUnitsNight * 7 * 12,
                currentValue:
                  shiftFilter === "dia"
                    ? baseStats.totalUnitsDay * 7 * 12 -
                      baseStats.totalMaintenanceTimeMinDay / 60
                    : baseStats.totalUnitsNight * 7 * 12 -
                      baseStats.totalMaintenanceTimeMinNight / 60,
                currentValueColor: "#14B8A6",
              },
              {
                title: "Utilización",
                total:
                  shiftFilter === "dia"
                    ? baseStats.totalUnitsDay * 7 * 12
                    : baseStats.totalUnitsNight * 7 * 12,
                currentValue:
                  shiftFilter === "dia"
                    ? baseStats.totalDurationDay / 3600
                    : baseStats.totalDurationNight / 3600,
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
                    title: "Carga de Balde",
                    currentValue: 0,
                    total: 10,
                  },
                  {
                    title: "Tiempo de Carga de Camión",
                    currentValue: 0,
                    total: 10,
                  },
                  {
                    title: "Tiempo de Descarga de Camión",
                    currentValue: baseStats.avgUnloadTime
                      ? Number(baseStats.avgUnloadTime.toFixed(2))
                      : 0,
                    total: 10,
                  },
                  {
                    title: "Falta de Camiones para cargar",
                    currentValue: 0,
                    total: 10,
                  },
                  {
                    title: "Demoras por material",
                    currentValue: 0,
                    total: 10,
                  },
                  {
                    title: "Paradas de producción",
                    currentValue: 0,
                    total: 10,
                  },
                ],
              },
              {
                title: "Real",
                currentValue:
                  shiftFilter === "dia"
                    ? Number(baseStats.durationPerTripDay.toFixed(2))
                    : Number(baseStats.durationPerTripNight.toFixed(2)),
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

export default ReportByWeek;