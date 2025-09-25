import { useState, useEffect, useMemo } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
import { format } from "date-fns";
// Components
import PageHeader from "@/components/PageHeaderV2";
import CardItem from "@/components/Dashboard/CardItemV2";
import BocaminaDetectionChart from "@/components/Dashboard/BeaconTrips/BocaminaDetectionChart";
import UnitTripTable from "@/components/Dashboard/BeaconTrips/UnitTripsTable";
// Types
import type { BeaconCycle, BeaconDetection } from "../../types/Beacon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";

interface BaseStats {
  totalUnits: number;
  totalUnitsDay: number;
  totalUnitsNight: number;
  totalTrips: number;
  totalDuration: number;
  totalDurationNight: number;
  totalDurationDay: number;
  dayTrips: number;
  nightTrips: number;
  unitWithLessTrips: string;
  averageDuration: number;
  totalDistance: number;
}
const BocaminaDetection = () => {
  const [dateFilter, setDateFilter] = useState<
    [{ startDate: Date; endDate: Date; key: string }]
  >([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { data, refetch, isFetching } = useFetchData<BeaconCycle[]>(
    "trip-group-by-days",
    `beacon-track/trip?startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}`,
    { refetchInterval: 30000 }
  );

  const { baseStats, unitTrips, bocaminaStats } = useMemo(() => {
    if (!data || data.length === 0) {
      const defaultBaseStats: BaseStats = {
        totalUnits: 0,
        totalUnitsDay: 0,
        totalUnitsNight: 0,
        totalTrips: 0,
        totalDuration: 0,
        totalDurationNight: 0,
        totalDurationDay: 0,
        dayTrips: 0,
        nightTrips: 0,
        unitWithLessTrips: "",
        averageDuration: 0,
        totalDistance: 0,
      };
      return { baseStats: defaultBaseStats, unitTrips: [], bocaminaStats: {} };
    }

    const totalTrips = data.reduce((acc, day) => acc + day.totalTrips, 0);

    const totalDuration = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.trips.reduce(
          (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
          0
        ),
      0
    );
    const totalDistance = data.reduce(
      (acc, tripsTruck) =>
        acc +
        tripsTruck.trips.reduce(
          (innerAcc, trip) => innerAcc + parseFloat(trip.totalDistance),
          0
        ),
      0
    );

    const averageDuration = totalTrips > 0 ? totalDuration / totalTrips : 0;

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

    const unitWithLessTripsObject = data.reduce((minUnit, currentUnit) => {
      if (!minUnit) return currentUnit;

      const minTrips = minUnit.trips.length;
      const currentTrips = currentUnit.trips.length;
      return currentTrips < minTrips ? currentUnit : minUnit;
    }, data[0]);

    const calculatedBaseStats: BaseStats = {
      totalUnits: data.length,
      totalUnitsDay: data.length,
      totalUnitsNight: data.length,
      totalTrips,
      totalDuration,
      totalDurationNight,
      totalDurationDay,
      dayTrips,
      nightTrips,
      unitWithLessTrips: unitWithLessTripsObject
        ? unitWithLessTripsObject.unit
        : "",
      averageDuration,
      totalDistance,
    };

    const calculatedUnitTrips: BeaconDetection[] = data
      .map((unit) => unit.trips.flatMap((trip) => trip.trip))
      .flat()
      .filter((trip) => trip.ubicationType === "bocaminas");

    const calculatedBocaminaStats: Record<string, number> = data.reduce(
      (acc, curr) => {
        curr.bocaminaStats.forEach(({ name, count }) => {
          acc[name] = (acc[name] || 0) + count;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      baseStats: calculatedBaseStats,
      unitTrips: calculatedUnitTrips,
      bocaminaStats: calculatedBocaminaStats,
    };
  }, [data]);

  useEffect(() => {
    refetch();
  }, [dateFilter]);

  if (!data) return null;

  return (
    <>
      <PageHeader
        title="Detección de Bocaminas"
        description="Monitoreo y Ubicación de Entradas a Minas"
        refetch={refetch}
        isFetching={isFetching}
        count={data.length}
        setDialogOpen={false}
        actions={
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-40 justify-between font-normal capitalize"
                  disabled={isFetching}
                >
                  {dateFilter[0]?.startDate ? (
                    <>
                      {format(dateFilter[0].startDate, "dd MMM", {
                        locale: es,
                      })}{" "}
                      -{" "}
                      {format(dateFilter[0].endDate, "dd MMM", { locale: es })}
                    </>
                  ) : (
                    <span>Seleccionar Rango</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 z-[99999]" align="end">
                <Calendar
                  mode="range"
                  disabled={{ after: new Date() }}
                  defaultMonth={dateFilter[0].startDate}
                  selected={{
                    from: dateFilter[0].startDate,
                    to: dateFilter[0].endDate,
                  }}
                  captionLayout="dropdown"
                  locale={es}
                  onSelect={(date) => {
                    setDateFilter([
                      {
                        startDate: date?.from || new Date(),
                        endDate: date?.to || new Date(),
                        key: "selection",
                      },
                    ]);
                  }}
                />
              </PopoverContent>
            </Popover>
          </>
        }
      />
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-2">
        <CardItem
          value={baseStats.totalUnits}
          title="Cantidad de Unidades"
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
          subtitleUnid="TM"
          title="Turno Dia"
          valueColor="text-[#fac34c]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.nightTrips}
          subtitleUnid="TM"
          title="Turno Noche"
          valueColor="text-[#3c3f43]"
          unid="viajes"
        />
        <CardItem
          value={Math.round(baseStats.averageDuration / 60)}
          title="Duración Promedio"
          valueColor="text-[#007F5F]"
          unid="minutos"
        />
        <CardItem
          value={baseStats.totalDistance}
          title="Kilómetros Totales"
          valueColor="text-[#28A745]"
          unid="km"
        />
      </div>
      <BocaminaDetectionChart data={bocaminaStats} />
      <UnitTripTable data={data} />
    </>
  );
};

export default BocaminaDetection;
