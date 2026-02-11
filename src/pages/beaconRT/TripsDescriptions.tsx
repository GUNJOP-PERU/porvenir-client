import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import PageHeader from "@/components/PageHeaderV2";
import XRangeTripsChart from "@/components/Dashboard/Charts/XRangeTripsChart";
// Types
import type { BeaconCycle } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { format } from "date-fns";
import { getCurrentDay } from "@/utils/dateUtils";
// Icons

const TripsDescriptionRT = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [dateFilter, setDateFilter] = useState<[{ startDate: Date; endDate: Date; key: string }]>([
    {
      startDate: new Date(getCurrentDay().startDate),
      endDate: new Date(getCurrentDay().endDate),
      key: "selection",
    }
  ]);

  const {
    data = [],
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-current-day-truck-rt-realtime",
    `beacon-track/trip?startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", "", {
    refetchInterval: 10000,
  });

  const {
    data: beaconTruck = []
  } = useFetchData<{ status: string }[]>("beacon-truck", "beacon-truck", "", { refetchInterval: 10000 });

  const formatData = useMemo(() => {
    return data.sort((a, b) => a.unit.localeCompare(b.unit)).map((unit) => {
      return ({
        ...unit,
        allTrips: [
          ...unit.beforeInitialTrips.map((trip) => ({ ...trip, endUbication: "" })),
          ...unit.trips,
          ...unit.uncompletedTrips.map((trip) => ({ ...trip, endUbication: "" }))
        ].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      })
    })
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getCurrentDay().shift !== shiftFilter) {
        setShiftFilter(getCurrentDay().shift);
        setDateFilter([{
          startDate: new Date(getCurrentDay().startDate),
          endDate: new Date(getCurrentDay().endDate),
          key: "selection",
        }]);
        refetch();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [shiftFilter, refetch]);

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <PageHeader
        title="Linea de Tiempo por Turno en tiempo real"
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2 mb-2"
        directionTitle="column"
        status={[
          {
            value: `${beaconTruck.filter((unit) => unit.status === "operativo").length} Operativos`,
            color: "#10aa18",
          },
          {
            value: `${beaconTruck.filter((unit) => unit.status === "mantenimiento").length} Mantenimiento`,
            color: "#d1be16",
          },
          {
            value: `${beaconTruck.filter((unit) => unit.status === "inoperativo").length} Inoperativos`,
            color: "#ca1616",
          },
        ]}
        actions={
          <div className="flex flex-row gap-2">
            {/* <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#0aa7f0] w-2 h-2 rounded-full"/>
              <p className="text-[11px] font-bold">
                Viaje Superficie
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#096bdb] w-2 h-2 rounded-full"/>
              <p className="text-[11px] font-bold">
                Viaje Subterráneo
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#3c3c3c] w-2 h-2 rounded-full"/>
              <p className="text-[11px] font-bold">
                Viaje Desmonte
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#f9c83e] w-2 h-2 rounded-full"/>
              <p className="text-[11px] font-bold">
                Remanejo
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#8c00ff] w-2 h-2 rounded-full"/>
              <p className="text-[11px] font-bold">
                Parqueo
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#EF4444] w-2 h-2 rounded-full"/>
              <p className="text-[11px] font-bold">
                Mantenimiento
              </p>
            </div> */}
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#ff5000] w-2 h-2 rounded-full" />
              <p className="text-[11px] font-bold">
                Viajes
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#66d20e] w-2 h-2 rounded-full" />
              <p className="text-[11px] font-bold">
                Bocamina
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="flex bg-[#dbdbdb] w-2 h-2 rounded-full" />
              <p className="text-[11px] font-bold">
                Otros
              </p>
            </div>
          </div>
        }
      />

      <div className="col-span-2 bg-white rounded-lg shadow p-4">
        <XRangeTripsChart data={formatData} />
      </div>
    </div>
  );
};

export default TripsDescriptionRT;