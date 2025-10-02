import { useMemo, useState, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import PageHeader from "@/components/PageHeaderV2";
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
    <div className="grid grid-cols-[1fr_5fr] flex-1 w-full gap-4">
      <PageHeader
        title="Reporte por Turno"
        description={`Reporte en tiempo real de los viajes realizados por los camiones del ${format(dateFilter[0].startDate, 'dd-MM-yyyy')}.`}
        refetch={refetch}
        isFetching={isFetching}
        count={data.length}
        setDialogOpen={false}
        className="col-span-2"
      />


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">

      </div>
    </div>
  );
};

export default TripsDescription;