import { useState, useEffect } from "react";
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

const BeaconTripDashboard = () => {
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [unitTrips, setUnitTrips] = useState<BeaconDetection[]>([]);
  const [bocaminaStats, setBocaminaStats] = useState<Record<string, number>>({});
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
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
    unitWithLessTrips: ""
  });

  const {
      data = [],
      refetch,
      isFetching,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-date",
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter, 'yyyy-MM-dd')}&endDate=${format(dateFilter, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`
  );

  useEffect(() => {
    if(data) {
      const totalUnits = data.length;
      const totalUnitsDay = data.length;
      const totalUnitsNight = data.length
      const totalTrips = data.reduce((acc, day) => acc + day.totalTrips, 0);
      const totalDuration = data.reduce((acc, tripsTruck) => acc + tripsTruck.trips.reduce((innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration), 0), 0);
      const totalDurationNight = data.reduce((acc, tripsTruck) => acc + tripsTruck.trips.filter((trip) => trip.shift === "noche").reduce((innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration), 0), 0);
      const totalDurationDay = data.reduce((acc, tripsTruck) => acc + tripsTruck.trips.filter((trip) => trip.shift === "dia").reduce((innerAcc, trip) => innerAcc + parseFloat(trip.totalDuration), 0), 0);
      const dayTrips = data.reduce((acc, day) => acc + day.trips.filter(trip => trip.shift === "dia").length, 0);
      const nightTrips = data.reduce((acc, day) => acc + day.trips.filter(trip => trip.shift === "noche").length, 0);
      const unitWithLessTrips = data.reduce((minUnit : any, currentUnit) => {
        const minTrips = minUnit.trips.length;
        const currentTrips = currentUnit.trips.length;
        return currentTrips < minTrips ? currentUnit : minUnit;
      }, data[0]);

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
        unitWithLessTrips: unitWithLessTrips ? unitWithLessTrips.unit : ""
      });
      setUnitTrips(data.map((unit) => unit.trips.flatMap((trip => trip.trip))).flat());
      setBocaminaStats(
        data.reduce((acc, curr) => {
          curr.bocaminaStats.forEach(({ name, count }) => {
            acc[name] = (acc[name] || 0) + count;
          });
          return acc;
        }, {} as Record<string, number>)
      );
    }
  }, [data])

  useEffect(() => {    
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white gap-2">
      <PageHeader
        title="Detalle de los Viajes por Camion"
        description={`Reporte de los viajes realizados por los camiones el dia ${format(
          dateFilter,
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
                {dateFilter && (
                  `${format(dateFilter, "dd/MM/yyyy")}`
                )}
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
          valueColor= "text-[#000000]"
          unid="camiones"
        />
        <CardItem
          value={baseStats.totalTrips}
          title="Viajes Totales"
          valueColor= "text-[#1E64FA]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.totalDuration/3600}
          title="Horas trabajadas"
          subtitle={baseStats.totalUnits * 24}
          valueColor= "text-[#3c3f43]"
          unid="horas"
          subtitleUnid="horas"
        />
        <CardItem
          value={baseStats.unitWithLessTrips}
          title="Unidad con menos viajes"
          subtitleUnid="TM"
          valueColor= "text-[#3c3f43]"
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

      <UnitTripTable data={data} />
    </div>
  );
};

export default BeaconTripDashboard;