import { useState, useMemo, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import { Calendar } from "react-date-range";
import PageHeader from "@/components/PageHeaderV2";
import CardItem from "@/components/Dashboard/CardItemV2";
import Loader from "@/components/Loader";
import XRangeDetection from "@/components/Dashboard/Charts/XRangeDetection";
// Types
import type { BeaconCycle, UnitTripDetections } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { format, subDays } from "date-fns";
import { getCurrentDay } from "@/utils/dateUtils";

type UnitChartProps = "trips" | "tonnage" | "totalHours" | "maintenanceHours"

const TimelineDetectionReport = () => {
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [dateFilter, setDateFilter] = useState<Date>(subDays(new Date(), 1));
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const {
    data,
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trips-detection-historico",
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter, 'yyyy-MM-dd')}&endDate=${format(dateFilter, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const {
    data: tripsDesmonte = [],
    refetch: tripsDesmonteRefetch,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-days-rt-desmonte",
    `beacon-track/trip?material=desmonte&startDate=${format(dateFilter, 'yyyy-MM-dd')}&endDate=${format(dateFilter, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const {
    data: beaconDetectionData,
    refetch: beaconDetectionRefetch,
  } = useFetchData<UnitTripDetections[]>(
    "trip-group-by-days-rt",
    `beacon-track/group-by-unit?date=${format(dateFilter, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", "", {
    refetchInterval: 10000,
  });

  const {
    data: beaconTruck = []
  } = useFetchData<{ status: string }[]>("beacon-truck", "beacon-truck", "", { refetchInterval: 10000 });

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
  }, [data]);

  const baseStatsDesmonte = useMemo(() => {
    if (!tripsDesmonte || !baseData.desmonte) {
      return {
        totalTripsDesmonte: 0,
        totalTMDesmonte: 0,
      };
    }
    const totalTripsDesmonte = tripsDesmonte.reduce((acc, day) => acc + day.totalTrips, 0);
    const totalTMDesmonte = totalTripsDesmonte * baseData.desmonte;

    return {
      totalTripsDesmonte,
      totalTMDesmonte,
    };
  }, [tripsDesmonte]);

  // Procesar datos para la tabla de bocaminas y parqueo
  const tableData = useMemo(() => {
    if (!beaconDetectionData) return [];

    return beaconDetectionData.map(unit => {
      const tracks = unit.tracks || [];

      const firstBocamina = tracks.find(track =>
        track.ubication?.toLowerCase().includes('bocamina') ||
        track.ubicationType?.toLowerCase().includes('bocamina')
      );

      // Calcular tiempo total en parqueo (agrupar parqueos consecutivos)
      let totalParkingTime = 0;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.ubication?.toLowerCase() === 'parqueo') {
          const startTime = new Date(track.f_inicio).getTime();
          const endTime = new Date(track.f_final).getTime();
          const duration = (endTime - startTime) / 1000 / 60; // en minutos
          totalParkingTime += duration;
        }
      }

      // Verificar si la bocamina es tardía según el turno
      let isLateBocamina = false;
      if (firstBocamina) {
        const bocaminaStartTime = new Date(firstBocamina.f_inicio);
        const hours = bocaminaStartTime.getHours();
        const minutes = bocaminaStartTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        // Convertir 8:30 AM y 8:30 PM a minutos
        const dayShiftLimit = 8 * 60 + 30; // 8:30 AM = 510 minutos
        const nightShiftLimit = 20 * 60 + 30; // 8:30 PM = 1230 minutos

        // Determinar el turno basado en la hora actual o del shift filter
        if (shiftFilter === 'dia') {
          // Turno día: tardío si es después de 8:30 AM
          isLateBocamina = totalMinutes > dayShiftLimit;
        } else if (shiftFilter === 'noche') {
          // Turno noche: tardío si es después de 8:30 PM
          isLateBocamina = totalMinutes > nightShiftLimit;
        }
      }

      return {
        unit: unit.unit.toUpperCase(),
        firstBocamina: firstBocamina ? {
          ubication: firstBocamina.ubication,
          startTime: format(new Date(firstBocamina.f_inicio), "HH:mm:ss"),
          endTime: format(new Date(firstBocamina.f_final), "HH:mm:ss"),
          duration: ((new Date(firstBocamina.f_final).getTime() - new Date(firstBocamina.f_inicio).getTime()) / 1000 / 60).toFixed(1)
        } : null,
        parkingTime: totalParkingTime.toFixed(1),
        isLateBocamina
      };
    });
  }, [beaconDetectionData]);

  if (tripsLoading || tripsError || data === undefined || beaconDetectionData === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <PageHeader
        title="Linea de tiempo de Detección"
        description=""
        refetch={() => { refetch(); beaconDetectionRefetch() }}
        isFetching={isFetching}
        setDialogOpen={false}
        actionsRight={
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
      <div className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        <CardItem
          value={baseStats.totalUnits}
          title="Total de Equipos"
          valueColor="text-[#000000]"
          unid="equipos"
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
          title="Viajes de Mineral"
          valueColor="text-[#00a6fb]"
          unid="viajes"
        />
        <CardItem
          value={baseStats.totalTM}
          title="Tonelaje de Mineral (TM)"
          valueColor="text-[#02c39a]"
          unid="TM"
        />
        <CardItem
          value={baseStatsDesmonte.totalTripsDesmonte}
          title="Viajes de Desmonte"
          valueColor="text-[#076594]"
          unid="viajes"
        />
        <CardItem
          value={baseStatsDesmonte.totalTMDesmonte}
          title="Desmonte (TM)"
          valueColor="text-[#058065]"
          unid="TM"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'chart'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            📊 Gráfico de Detecciones
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'table'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            📋 Tabla Bocaminas y Parqueo
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'chart' ? (
            <div className="flex-1">
              <XRangeDetection data={beaconDetectionData} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Unidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Primera Bocamina
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Hora Inicio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Hora Fin
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Duración Bocamina
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Tiempo Total Parqueo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, index) => (
                    <tr
                      key={row.unit}
                      className={`
                        ${row.isLateBocamina
                          ? 'bg-red-300 bg-opacity-60'
                          : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }
                      `}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.unit}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                        {row.firstBocamina ? row.firstBocamina.ubication : 'Sin bocamina'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                        {row.firstBocamina ? row.firstBocamina.startTime : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                        {row.firstBocamina ? row.firstBocamina.endTime : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                        {row.firstBocamina ? `${row.firstBocamina.duration} min` : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                        {row.parkingTime} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tableData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay datos disponibles
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineDetectionReport;