import { useState, useEffect, useMemo } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
import { format } from "date-fns";
// Components
import { Calendar } from "react-date-range";
import PageHeader from "@/components/PageHeaderV2";
import CardItem from "@/components/Dashboard/CardItemV2";
import BocaminaDetectionChart from "@/components/Dashboard/BeaconTrips/BocaminaDetectionChart";
import GeneralDetectionChart from "@/components/Dashboard/BeaconTrips/GeneralDetectionChart";
import UnitTripTable from "@/components/Dashboard/BeaconTrips/UnitTripsTable";
// Types
import type { BeaconCycle, BeaconDetection } from "../../types/Beacon";
import { MultiSelect } from "@/components/Configuration/MultiSelect";

const BeaconTripDashboard = () => {
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [unitTrips, setUnitTrips] = useState<BeaconDetection[]>([]);
  const [bocaminaStats, setBocaminaStats] = useState<Record<string, number>>(
    {},
  );
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [routeFilter, setRouterFilter] = useState<string[]>([]);

  const [baseStats, setBaseStats] = useState({
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
  });

  const {
    data = [],
    refetch,
    isFetching,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-date",
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter, "yyyy-MM-dd")}&endDate=${format(dateFilter, "yyyy-MM-dd")}${shiftFilter ? `&shift=${shiftFilter}` : ""}`,
    undefined,
    { refetchInterval: 30000 },
  );

  const routeOptions = useMemo(() => {
    const trips = (data || []).flatMap((u) => u.trips || []);
    const routes = trips.map((t) => `${t.startUbication} → ${t.endUbication}`);
    return Array.from(new Set(routes)).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (!routeFilter?.length) return data;

    return data
      .map((unit) => {
        const trips = unit.trips.filter((t) =>
          routeFilter.some((route) => {
            const [startR, endR] = route.split(" → ");
            return t.startUbication === startR && t.endUbication === endR;
          }),
        );

        return { ...unit, trips, totalTrips: trips.length };
      })
      .filter((unit) => unit.trips.length > 0);
  }, [data, routeFilter]);

  useEffect(() => {
    if (filteredData) {
      const totalUnits = filteredData.length;
      const totalUnitsDay = filteredData.length;
      const totalUnitsNight = filteredData.length;
      const totalTrips = filteredData.reduce(
        (acc, day) => acc + day.totalTrips,
        0,
      );
      const totalDuration = filteredData.reduce(
        (acc, tripsTruck) =>
          acc +
          tripsTruck.trips.reduce(
            (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
            0,
          ),
        0,
      );
      const totalDurationNight = filteredData.reduce(
        (acc, tripsTruck) =>
          acc +
          tripsTruck.trips
            .filter((trip) => trip.shift === "noche")
            .reduce(
              (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
              0,
            ),
        0,
      );
      const totalDurationDay = filteredData.reduce(
        (acc, tripsTruck) =>
          acc +
          tripsTruck.trips
            .filter((trip) => trip.shift === "dia")
            .reduce(
              (innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration),
              0,
            ),
        0,
      );
      const dayTrips = filteredData.reduce(
        (acc, day) =>
          acc + day.trips.filter((trip) => trip.shift === "dia").length,
        0,
      );
      const nightTrips = filteredData.reduce(
        (acc, day) =>
          acc + day.trips.filter((trip) => trip.shift === "noche").length,
        0,
      );
      const unitWithLessTrips = filteredData.reduce(
        (minUnit: any, currentUnit) => {
          const minTrips = minUnit.trips.length;
          const currentTrips = currentUnit.trips.length;
          return currentTrips < minTrips ? currentUnit : minUnit;
        },
        filteredData[0],
      );

      setBaseStats({
        totalUnits,
        totalUnitsDay,
        totalUnitsNight,
        totalTrips,
        totalDuration,
        totalDurationNight,
        totalDurationDay,
        dayTrips,
        nightTrips,
        unitWithLessTrips: unitWithLessTrips ? unitWithLessTrips.unit : "",
      });
      setUnitTrips(
        filteredData
          .map((unit) => unit.trips.flatMap((trip) => trip.trip))
          .flat(),
      );
      setBocaminaStats(
        filteredData.reduce(
          (acc, curr) => {
            curr.bocaminaStats.forEach(({ name, count }) => {
              acc[name] = (acc[name] || 0) + count;
            });
            return acc;
          },
          {} as Record<string, number>,
        ),
      );
    }
  }, [filteredData]);

  return (
    <div className="w-full h-full flex flex-col bg-white gap-2">
      <PageHeader
        title="Detalle de los Viajes por Equipo"
        description={`Detalle de los viajes realizados por los equipos el dia ${format(
          dateFilter,
          "dd-MM-yyyy",
        )}.`}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2"
        count={data.length}
        actionsRight={
          <div className="relative flex flex-row gap-2">
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Ruta :
              <div>
                <MultiSelect
                  placeholder={"Selecciona ruta..."}
                  options={routeOptions.map((r) => ({ value: r, label: r }))}
                  value={routeFilter}
                  onChange={setRouterFilter}
                />
              </div>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Turno:
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                <option value="dia">Turno Día</option>
                <option value="noche">Turno Noche</option>
              </select>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Fecha:
              <button
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                {dateFilter && `${format(dateFilter, "dd/MM/yyyy")}`}
              </button>
            </label>
            {isTooltipOpen && (
              <div className="absolute right-0 top-10 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                <Calendar
                  editableDateInputs={false}
                  onChange={(item) => {
                    setDateFilter(item);
                    setIsTooltipOpen(false);
                  }}
                  date={dateFilter}
                />
              </div>
            )}
          </div>
        }
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <CardItem
          value={baseStats.totalUnits}
          title="Cantidad de Unidades"
          valueColor="text-[#000000]"
          unid="equipos"
        />
        <CardItem
          value={baseStats.totalTrips}
          title="Viajes Totales"
          valueColor="text-[#1E64FA]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.totalDuration / 3600}
          title="Horas trabajadas"
          subtitle={baseStats.totalUnits * 24}
          valueColor="text-[#3c3f43]"
          unid="horas"
          subtitleUnid="horas"
        />
        <CardItem
          value={baseStats.unitWithLessTrips}
          title="Unidad con menos viajes"
          subtitleUnid="TM"
          valueColor="text-[#3c3f43]"
          unid=""
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BocaminaDetectionChart data={bocaminaStats} />
        <GeneralDetectionChart
          data={unitTrips}
          filterValue="destinations"
          chartTitle="Detección de Destinos"
          chartColor="#0fc47a"
        />
        <GeneralDetectionChart
          data={unitTrips}
          filterValue="frontLabors"
          chartTitle="Detección de Tajo"
          chartColor="#019cfe"
        />
      </div>

      <UnitTripTable data={filteredData} />
    </div>
  );
};

export default BeaconTripDashboard;
