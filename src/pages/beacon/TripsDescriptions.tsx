import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import { Calendar } from 'react-date-range';
import PageHeader from "@/components/PageHeaderV2";
import XRangeTripsChartHistorico from "@/components/Dashboard/Charts//XRangeTripsChartHistorico";
// Types
import type { BeaconCycle } from "../../types/Beacon";
// Utils
import { format } from "date-fns";
import { getCurrentDay } from "@/utils/dateUtils";

const TripsDescriptionRT = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());

  const {
    data = [],
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day-truck-rt-historic",
    `beacon-track/trip?startDate=${format(dateFilter, 'yyyy-MM-dd')}&endDate=${format(dateFilter, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    {  }
  );

  const {
    data : beaconTruck = []
  } = useFetchData<{status: string}[]>("beacon-truck", "beacon-truck", { refetchInterval: 10000 });

  const formatData = useMemo(() => {
    return data.sort((a,b) => a.unit.localeCompare(b.unit)).map((unit) => {
      return ({
        ...unit,
        allTrips: [
          ...unit.trips,
          ...unit.beforeInitialTrips.map((trip) => ({...trip,endUbication: ""})),
          ...unit.uncompletedTrips.map((trip) => ({...trip,endUbication: ""}))
        ].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      })
    })
  }, [data]);

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <PageHeader
        title="Reporte especifico de viajes / Historico"
        description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(dateFilter, 'dd-MM-yyyy')}.`}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2"
        status={[
          { value: beaconTruck.filter((unit) => unit.status === "operativo").length,
            color: "#2fd685",
          },
          { value: beaconTruck.filter((unit) => unit.status === "mantenimiento").length,
            color: "#e6bf27",
          },
          { value: beaconTruck.filter((unit) => unit.status === "inoperativo").length,
            color: "#ff4d4f",
          },
        ]}
        actions={
          <div className="relative flex flex-row gap-2">
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Turno:
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                <option value="">Ambos</option>
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
                  onChange={(item) => setDateFilter(item)}
                  date={dateFilter}
                />
              </div>
            )}
          </div>
        }
      />
      <div className="col-span-2 border border-zinc-100 shadow-sm rounded-xl p-3">
        <XRangeTripsChartHistorico data={formatData}  isLoading={isFetching || tripsLoading} isError={tripsError} />
      </div>
    </div>
  );
};

export default TripsDescriptionRT;