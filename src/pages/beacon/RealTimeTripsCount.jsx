import { useEffect, useState } from "react";
// import DonutChart from "@/components/Dashboard/Charts/DonutChart";
import BarChart from "@/components/Dashboard/Charts/BarChart";
import { useFetchData } from "../../hooks/useGlobalQuery";
import TripsByBocaminaTable from "@/components/Dashboard/Table/BocaminaTable";
import TripsByDestinationTable from "@/components/Dashboard/Table/TripsByDestinationTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const RealTimeTripsCount = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  // Función para determinar el turno actual
  const getCurrentShift = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 6 && currentHour < 18) {
      return {
        name: "Día",
        emoji: "☀️",
        hours: "06:00 - 18:00",
        type: "day"
      };
    } else {
      return {
        name: "Noche", 
        emoji: "🌙",
        hours: "18:00 - 06:00",
        type: "night"
      };
    }
  };

  const setDateFilterBasedOnTime = () => {
    const now = new Date();
    const currentHour = now.getHours();

    let startDate, endDate;

    if (currentHour >= 6 && currentHour < 18) {
      startDate = new Date(now.setHours(6, 0, 0, 0)).getTime();
      endDate = new Date(now.setHours(18, 0, 0, 0)).getTime();
    } else {
      if (currentHour >= 18) {
        startDate = new Date(now.setHours(18, 0, 0, 0)).getTime() - 12*60*60*1000;
        endDate = new Date(now.setDate(now.getDate() + 1)).setHours(6, 0, 0, 0)  - 12*60*60*1000;
      } else {
        startDate = new Date(now.setDate(now.getDate() - 1)).setHours(18, 0, 0, 0);
        endDate = new Date(now.setHours(6, 0, 0, 0)).getTime();
      }
    }
    setDateFilter({ startDate, endDate });
  };

  const {
    data = [],
    isFetching,
    isLoading,
    // isError,
    refetch,
  } = useFetchData(
    "trip-stats",
    `trip/stats?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
  );

  const {
    data: tripData = [],
    // isFetching,
    // isLoading,
    // isError,
    refetch : refetchTripData,
  } = useFetchData(
    "truck-trips",
    `trip/all?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
  );

  const {
    data: wapData = [],
    // isFetching,
    // isLoading,
    // isError,
    refetch : refetchWapData,
  } = useFetchData(
    "wap-trips",
    `wap/trips?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
  );

  useEffect(() => {
    setDateFilterBasedOnTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateFilterBasedOnTime();
      refetchTripData();
      refetchWapData();
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch, refetchTripData]);

  if(!data || !tripData) return <p>cargando</p>
  
  const currentShift = getCurrentShift();
  
  return (
    <div className="grid grid-cols-[1fr] h-full gap-10">

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">Conteo de Viajes</h3>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border">
            <span className="text-md">{currentShift.emoji}</span>
            <span className="font-medium text-black">Turno {currentShift.name}</span>
            <span className="text-xs text-black">({currentShift.hours})</span>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
          <BarChart
            data={data.stats ? data.stats.tripsByFrontLabors : []}
            title="Cantidad de viajes por Origen (Tajo)"
          />
          <BarChart
            data={wapData ? wapData : []}
            title="Cantidad de viajes por Destino (Cancha)"
          />
        </div>

        <div className="grid grid-cols-[1fr] h-[500px]">
          <Tabs defaultValue="bocamina" >
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="bocamina">Ingreso a Bocamina (Truck | Scoop)</TabsTrigger>
              <TabsTrigger value="unidad">Viajes por Unidad ( Agrupados por Destino )</TabsTrigger>
            </TabsList>
            <TabsContent value="bocamina" className="">
              <TripsByBocaminaTable
                data={wapData ? wapData : []}
                title="Viajes por Unidad (Truck | Scoop)"
                isLoading={isLoading || isFetching}
              />
            </TabsContent>
            <TabsContent value="unidad" className="">
              {/* <TripsByUnitTable
                data={tripData ? tripData : []}
                title="Viajes por Unidad (Truck)"
              /> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default RealTimeTripsCount