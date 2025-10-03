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
import { getCurrentDay, planDayDateParser } from "@/utils/dateUtils";
// Icons

const TripsDescription = () => {
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
    "trip-group-by-current-day-truck-rt",
    `beacon-track/trip?startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const { data: mineralData } = useFetchData<Mineral[]>("mineral", "mineral", {
    refetchInterval: 10000,
  });

  const formatData = useMemo(() => {
    return data.sort((a,b) => a.unit.localeCompare(b.unit)).map((unit) => {
      return ({
        ...unit,
        allTrips: [...unit.trips, ...unit.uncompletedTrips.map((trip) => ({...trip,endUbication: ""}))].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      })
    })
  }, [data]);

  const baseData = useMemo(() => {
    const mineral =
      mineralData?.find((charge) => charge.name === "Mineral")?.value || 36;
    const desmonte =
      mineralData?.find((charge) => charge.name === "Desmonte")?.value || 40;
    return { mineral, desmonte };
  }, [mineralData]);

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
        title="Reporte especifico de viajes"
        description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(dateFilter[0].startDate, 'dd-MM-yyyy')}.`}
        refetch={refetch}
        isFetching={isFetching}
        count={data.length}
        setDialogOpen={false}
        className="col-span-2"
      />

      <div className="col-span-2 bg-white rounded-lg shadow p-4">
        <XRangeTripsChart data={formatData} />
      </div>
    </div>
  );
};

export default TripsDescription;