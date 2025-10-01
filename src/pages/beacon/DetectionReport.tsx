import { useState, useMemo, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import { DateRange } from "react-date-range";
import PageHeader from "@/components/PageHeaderV2";
import CardItem from "@/components/Dashboard/CardItemV2";
import BocaminaDetectionTable from "@/components/Dashboard/BeaconTrips/BocaminaDetectionTableV2";
import UnitTripChart from "@/components/Dashboard/BeaconTrips/UnitTripChart";
import BocaminaDetectionChart from "@/components/Dashboard/BeaconTrips/BocaminaDetectionChartV2";
import GeneralDetectionChart from "@/components/Dashboard/BeaconTrips/GeneralDetectionChart";
// Types
import type {
  BeaconCycle,
  BeaconDetection,
  BocaminaByUnits
} from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { format } from "date-fns";
import CardTitle from "@/components/Dashboard/CardTitleV2";
import { ChartNoAxesColumn, TableProperties } from "lucide-react";
import { StatusDisplay } from "@/components/Dashboard/StatusDisplay";

type UnitChartProps = "trips" | "tonnage" | "totalHours" | "maintenanceHours";

const DetectionReport = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [currentUnitChart, setCurrentUnitChart] =
    useState<UnitChartProps>("trips");
  const [currentDetectionPlace, setCurrentDetectionPlace] =
    useState<string>("bocaminas");
  const [bocaminaStats, setBocaminaStats] = useState<Record<string, number>>(
    {}
  );
  const [unitTrips, setUnitTrips] = useState<BeaconDetection[]>([]);
  const [shiftFilter, setShiftFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<
    [{ startDate: Date; endDate: Date; key: string }]
  >([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const {
    data,
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-days",
    `beacon-track/trip?startDate=${format(
      dateFilter[0].startDate,
      "yyyy-MM-dd"
    )}&endDate=${format(dateFilter[0].endDate, "yyyy-MM-dd")}${
      shiftFilter ? `&shift=${shiftFilter}` : ""
    }`,
    { refetchInterval: 10000 }
  );

  const {
    data: bocaminaData = [],
    refetch : bocaminaRefetch,
    isFetching : bocaminaIsFetching,
    isLoading: bocaminaLoading,
    isError: bocaminaError,
  } = useFetchData<BocaminaByUnits[]>(
    "trip-group-by-days-bc",
    `beacon-track/trip/bc?startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
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
    setUnitTrips(
      data.map((unit) => unit.trips.flatMap((trip) => trip.trip)).flat()
    );
    setBocaminaStats(
      data.reduce((acc, curr) => {
        curr.bocaminaStats.forEach(({ name, count }) => {
          acc[name] = (acc[name] || 0) + count;
        });
        return acc;
      }, {} as Record<string, number>)
    );

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

  useEffect(() => {
    refetch();
  }, [dateFilter, shiftFilter]);

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
    <>
      <PageHeader
        title="Reporte de Detección de Bocaminas y Destinos "
        description="Visualización en tiempo real de puntos de acceso y seguimiento de rutas logísticas."
        refetch={refetch}
        isFetching={isFetching}
        count={data.length}
        setDialogOpen={false}
        actions={
          <div className="relative flex flex-row gap-2">
            <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                <option value="">Ambos</option>
                <option value="dia">Turno Día</option>
                <option value="noche">Turno Noche</option>
              </select>
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
            {isTooltipOpen && (
              <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
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
      <div className="grid grid-cols-1 flex-1 w-full gap-2">
        <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
          <CardItem
            value={baseStats.totalUnits}
            title="Total de Camiones"
            valueColor="text-[#000000]"
            unid="camiones"
          />
          <CardItem
            value={baseStats.totalMantanceTimeMin / 60}
            title="Horas en Mantenimiento"
            valueColor="text-[#f79d65]"
            unid="hrs"
          />
          <CardItem
            value={baseStats.totalDuration / 3600}
            title="Horas Trabajadas"
            valueColor="text-[#d4a373]"
            unid="hrs"
          />
          <CardItem
            value={baseStats.totalTrips}
            title="Viajes Totales"
            valueColor="text-[#00a6fb]"
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
            value={baseStats.totalTM}
            title="Tonelaje Total (TM)"
            valueColor="text-[#02c39a]"
            unid="TM"
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <CardTitle
            title="Análisis de datos de unidades"
            subtitle="Análisis basado en la detección de beacons"
            className="row-span-2"
            icon={ChartNoAxesColumn}
            classIcon="text-[#fac34c]"
            actions={
              <div>
                <select
                  value={currentUnitChart}
                  onChange={(e) =>
                    setCurrentUnitChart(e.target.value as UnitChartProps)
                  }
                  className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
                >
                  <option value="trips">Viajes</option>
                  <option value="tonnage">Tonelaje</option>
                  <option value="totalHours">Duración Total (hrs)</option>
                  <option value="maintenanceHours">
                    Horas en Mantenimiento
                  </option>
                </select>
              </div>
            }
          >
            <UnitTripChart
              mineralWeight={baseData.mineral}
              chartData={data}
              currentChart={currentUnitChart}
            />
          </CardTitle>

          <CardTitle
            title="Detección de Bocaminas"
            subtitle="Registro de bocaminas detectadas en los viajes"
            icon={ChartNoAxesColumn}
            classIcon="text-[#fac34c]"
            actions={
              <div>
                <select
                  value={currentDetectionPlace}
                  onChange={(e) => setCurrentDetectionPlace(e.target.value)}
                  className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
                >
                  <option value="bocaminas">Bocaminas</option>
                  <option value="destinations">Destinos</option>
                </select>
              </div>
            }
          >
            {currentDetectionPlace === "bocaminas" ? (
              <BocaminaDetectionChart data={bocaminaStats} />
            ) : currentDetectionPlace === "destinations" ? (
              <GeneralDetectionChart
                data={unitTrips}
                filterValue="destinations"
                chartTitle="Detección de Destinos"
                chartColor="#0fc47a"
              />
            ) : (
              <BocaminaDetectionChart data={bocaminaStats} />
            )}
          </CardTitle>
          <CardTitle
            title="Tabla de Detección de Bocaminas"
            subtitle="Registro detallado de bocaminas detectadas en los viajes"
            icon={TableProperties}
            classIcon="text-sky-500"
          >
            <BocaminaDetectionTable
              data={bocaminaData}
            />
          </CardTitle>
        </div>
      </div>
    </>
  );
};

export default DetectionReport;
