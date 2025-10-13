import { useState, useMemo, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
// Components
import PageHeader from "@/components/PageHeaderV2";
import CardItem from "@/components/Dashboard/CardItemV2";
import Loader from "@/components/Loader";
import XRangeDetection from "@/components/Dashboard/Charts/XRangeDetection";
// Types
import type { BeaconCycle, UnitTripDetections } from "../../types/Beacon";
import type { Mineral } from "@/types/Mineral";
// Utils
import { format } from "date-fns";
import { getCurrentDay } from "@/utils/dateUtils";

type UnitChartProps = "trips" | "tonnage" | "totalHours" | "maintenanceHours"

const DetectionReportRT = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [dateFilter, setDateFilter] = useState<[{ startDate: Date; endDate: Date; key: string }]>([
    {
      startDate: new Date(getCurrentDay().startDate),
      endDate: new Date(getCurrentDay().endDate),
      key: "selection",
    }
  ]);

  const {
    data,
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-days-rt",
    `beacon-track/trip?material=mineral&startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const {
    data : tripsDesmonte = [],
    refetch : tripsDesmonteRefetch,
    isFetching: tripsDesmonteIsFetching,
    isLoading: tripsDesmonteLoading,
    isError: tripsDesmonteError,
  } = useFetchData<BeaconCycle[]>(
    "trip-group-by-days-rt-desmonte",
    `beacon-track/trip?material=desmonte&startDate=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}&endDate=${format(dateFilter[0].endDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 10000 }
  );

  const {
    data : beaconDetectionData,
    refetch : beaconDetectionRefetch,
    isFetching : beaconDetectionIsFetching,
    isLoading: beaconDetectionLoading,
    isError: beaconDetectionError,
  } = useFetchData<UnitTripDetections[]>(
    "trip-group-by-days-rt",
    `beacon-track/group-by-unit?date=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
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
        beaconDetectionRefetch();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
        title="Reporte de Detección por turno"
        description=""
        refetch={ () => { refetch(); beaconDetectionRefetch() }}
        isFetching={isFetching}
        setDialogOpen={false}
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
      />
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

      <div className="flex-1">
        <XRangeDetection data={beaconDetectionData} />
      </div>
    </div>
  );
};

export default DetectionReportRT;