import { useState, useMemo, useEffect, useCallback } from "react";
import { useFetchData } from "../../hooks/useGlobalQueryV2";
import TimeAgo from "timeago-react";
import IconTruck from "@/icons/IconTruck";
import clsx from "clsx";
// Beacon Data
import {
  ubicationBocamina,
  superficieLocation,
  maintenanceLocation,
  ubicationData
} from "./UbicationLocation"
import { format, set } from "date-fns";
import { getCurrentDay } from "@/utils/dateUtils";
import type { TruckStatus, UnitTripDetections } from "../../types/Beacon";

const ProductionStatus = () => {
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
  } = useFetchData<TruckStatus[]>("beacon-truck", "beacon-truck", { refetchInterval: 10000 });

  const {
    data : beaconDetectionData,
    refetch : beaconDetectionRefetch,
    isFetching : beaconDetectionIsFetching,
    isLoading: beaconDetectionLoading,
    isError: beaconDetectionError,
  } = useFetchData<UnitTripDetections[]>(
    "trip-group-by-days-rt",
    `beacon-track/group-by-unit?date=${format(dateFilter[0].startDate, 'yyyy-MM-dd')}${shiftFilter ? `&shift=${shiftFilter}` : ''}`,
    { refetchInterval: 2000 }
  );

  const mineDetection = useMemo(()=> {
    if (!beaconDetectionData || beaconDetectionData.length === 0) {
      return [];
    }

    return beaconDetectionData.map(unit => {
      const firstBocamina = unit.tracks?.find(
        (track) =>
          track.ubication === 'Int-BC-1820' ||
          track.ubication === 'Int-BC-1800' ||
          track.ubication === 'Int-BC-1875' ||
          track.ubication === 'Int-BC-1930' ||
          track.ubication === 'Int-BC-1910'
      );

      // Verificar si la bocamina es tardía según el turno
      let isLateBocamina = false;
      if (firstBocamina) {
        const bocaminaStartTime = new Date(firstBocamina.f_inicio);
        const hours = bocaminaStartTime.getHours();
        const minutes = bocaminaStartTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        
        const dayShiftLimit = 8 * 60 + 30;
        const nightShiftLimit = 20 * 60 + 30;

        if (shiftFilter === 'dia') {
          isLateBocamina = totalMinutes > dayShiftLimit;
        } else if (shiftFilter === 'noche') {
          isLateBocamina = totalMinutes > nightShiftLimit;
        }
      }

      return {
        unit: unit.unit,
        firstBocamina: firstBocamina ? {
          isLate: isLateBocamina,
          ubication: firstBocamina.ubication,
          ubicationType: firstBocamina.ubicationType,
          startTime: firstBocamina.f_inicio,
          endTime: firstBocamina.f_final,
          duration: firstBocamina.f_final && firstBocamina.f_inicio 
            ? ((new Date(firstBocamina.f_final).getTime() - new Date(firstBocamina.f_inicio).getTime()) / 1000 / 60).toFixed(1)
            : '0'
        } : null
      };
    }).filter(item => item.firstBocamina !== null);
  }, [beaconDetectionData])

  const lunchTimeMineDetection = useMemo(() => {
    if (!beaconDetectionData || beaconDetectionData.length === 0) {
      return [];
    }

    return beaconDetectionData.map(unit => {
      const firstAfternoonBocamina = unit.tracks?.find(track => {
        const isBocamina = track.ubication?.toLowerCase().includes('bocamina') ||
          track.ubicationType?.toLowerCase().includes('bocamina');
        
        if (!isBocamina) return false;

        const trackTime = new Date(track.f_inicio);
        const hours = trackTime.getHours();
        const minutes = trackTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        
        return totalMinutes >= 780;
      });

      let isLateBocamina = false;
      if (firstAfternoonBocamina) {
        const bocaminaStartTime = new Date(firstAfternoonBocamina.f_inicio);
        const hours = bocaminaStartTime.getHours();
        const minutes = bocaminaStartTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        
        const dayShiftLimit = 13 * 60 + 30;
        const nightShiftLimit = 1 * 60 + 30;

        if (shiftFilter === 'dia') {
          isLateBocamina = totalMinutes > dayShiftLimit;
        } else if (shiftFilter === 'noche') {
          isLateBocamina = totalMinutes > nightShiftLimit;
        }
      }

      return {
        unit: unit.unit,
        firstBocamina: firstAfternoonBocamina ? {
          isLate: isLateBocamina,
          ubication: firstAfternoonBocamina.ubication,
          ubicationType: firstAfternoonBocamina.ubicationType,
          startTime: firstAfternoonBocamina.f_inicio,
          endTime: firstAfternoonBocamina.f_final,
          duration: firstAfternoonBocamina.f_final && firstAfternoonBocamina.f_inicio 
            ? ((new Date(firstAfternoonBocamina.f_final).getTime() - new Date(firstAfternoonBocamina.f_inicio).getTime()) / 1000 / 60).toFixed(1)
            : '0'
        } : null
      };
    }).filter(item => item.firstBocamina !== null);
  }, [beaconDetectionData, shiftFilter])

  const truckFiltered = useMemo(() => {
    const parqueoUnits : TruckStatus[] = [];
    const superficieData : TruckStatus[] = [];
    const undergroundData : TruckStatus[]= [];
    const unMoveTrucks : TruckStatus[] = [];
    const lunchTrucks : TruckStatus[] = []
    const finalParqueoUnits : TruckStatus[] = [];

    data.forEach((truck) => {
      const isParqueo = truck.lastUbicationMac.toLowerCase() === "bc:57:29:01:c9:03";
      const isSuperficie = superficieLocation.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      const isMaintenance = maintenanceLocation.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      const isUnderground = ubicationBocamina.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      const isDestination = ubicationData.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      
      const isLunchTime = (() => {
        const lastTime = new Date(truck.lastDate).getTime();
        const lunchStart = set(new Date(), { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        const lunchEnd = set(new Date(), { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        const lunchNightStart = set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        const lunchNightEnd = set(new Date(), { hours: 1, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();

        return (lastTime >= lunchStart && lastTime <= lunchEnd) || (lastTime >= lunchNightStart && lastTime <= lunchNightEnd);
      })();

      const isEndOfTurn = (() => {
        const lastTime = new Date(truck.lastDate).getTime();
        const endDayShiftStart = set(new Date(), { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        const endDayShiftEnd = set(new Date(), { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        const endNightShiftStart = set(new Date(), { hours: 5, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        const endNightShiftEnd = set(new Date(), { hours: 6, minutes: 0, seconds: 0, milliseconds: 0 }).getTime();
        
        return (lastTime >= endDayShiftStart && lastTime <= endDayShiftEnd) || (lastTime >= endNightShiftStart && lastTime <= endNightShiftEnd);
      })()

      if(isLunchTime && isParqueo) {
        lunchTrucks.push(truck);
      } else if(isEndOfTurn && isParqueo) {
        finalParqueoUnits.push(truck);
      } else if(isParqueo) {
        parqueoUnits.push(truck);
      } else if(isSuperficie || isDestination) {
        superficieData.push(truck);
      } else if(isUnderground) {
        undergroundData.push(truck);
      } else if(isMaintenance) {
        unMoveTrucks.push(truck);
      } else {
        undergroundData.push(truck);
      }
    })

    return {
      parqueoUnits,
      totalTruck: data.length,
      superficieData,
      undergroundData,
      unMoveTrucks,
      lunchTrucks,
      finalParqueoUnits
    }
  }, [data]);

  const itemColors = {
    parqueo: {
      outer: "bg-green-700/50",
      inner: "bg-green-600",
      color: "#46fea5d4",
    },
    superficie: {
      outer: "bg-sky-700/80",
      inner: "bg-sky-600",
      color: "#0EB1D2",
    },
    unMove: {
      outer: "bg-gray-700/80",
      inner: "bg-gray-600",
      color: "#ccc8af",
    },
    mina: {
      outer: "bg-purple-700/50",
      inner: "bg-purple-600",
      color: "#8a0ed2",
    },
    mantenimiento: {
      outer: "bg-yellow-700/80",
      inner: "bg-yellow-600",
      color: "#ecba03",
    },
    inoperativo: {
      outer: "bg-red-700/50",
      inner: "bg-red-600",
      color: "#ff9592",
    },
  };

  return (
      <div className="flex-1 w-full bg-cover bg-no-repeat bg-center bg-[url('/map.png')] p-4 flex flex-col gap-1">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 flex-1 grid-rows-3 xl:grid-rows-1 ">
          <div className="flex flex-col bg-[#004b1f] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.parqueo.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {truckFiltered.parqueoUnits.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  Parqueo
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {truckFiltered.parqueoUnits.map((truck, index) => (
                <div key={index}>
                  <div
                    className={`p-0.5 rounded-lg shadow ${itemColors.parqueo.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                  >
                    <div className={`${itemColors.parqueo.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                      <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                        <IconTruck
                          className="h-7 w-16 -translate-x-1 translate-y-0.5"
                          color={itemColors.parqueo.color}
                        />
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-bold text-white leading-none ">
                          {truck.name}
                        </span>
                        <span className="text-[10px] font-normal text-black leading-none truncate">
                          {truck.lastUbication}
                        </span>
                      </div>
                    </div>
                    <span
                      className={clsx(
                        "text-[9.5px] select-none leading-[10px] pl-1.5 pb-0.5 text-center flex items-center gap-1 truncate",
                        truck.connectivity === "online"
                          ? "text-amber-400"
                          : "text-zinc-300"
                      )}
                    >
                      <div
                        className={`w-[4px] h-[4px] rounded-full ${
                          truck.connectivity === "online"
                            ? "bg-amber-400"
                            : "bg-zinc-300"
                        }`}
                      ></div>{" "}
                      {truck.connectivity === "online"
                        ? "En línea"
                        : "Fuera de línea"}
                      <TimeAgo
                        datetime={truck.updatedAt}
                        locale="es"
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-[#360353] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.mina.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {mineDetection.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  Primer Ingreso a Mina
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {mineDetection.map((truck, index) => (
                <div
                  key={index}
                  className="p-0.5 rounded-lg shadow cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1"
                  style={{
                    background: truck.firstBocamina?.isLate ? "#a81313" : "#7B1FA280"
                  }}
                >
                  <div
                    className="rounded-lg py-1 px-1 flex items-center gap-2"
                    style={{
                      background: truck.firstBocamina?.isLate ? "#ee3232" : "#9333EA"
                    }}
                  >
                    <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center font-extrabold text-white relative">
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">{truck.unit.split("-").pop()}</span>
                    </div>
                    
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <IconTruck
                        className="h-7 w-11"
                        color={itemColors.mina.color}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                      {truck.firstBocamina?.ubication}
                    </span>
                    <span
                      className="font-semibold text-[9.5px] select-none leading-[10px] pl-1.5 pb-0.5 text-center flex items-center gap-1 text-white"
                    >
                      Ingreso a Mina: {format(new Date(truck.firstBocamina?.startTime || 0), "HH:mm")}
                    </span>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-[#313131] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.unMove.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {truckFiltered.lunchTrucks.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  En Refrigerio
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {truckFiltered.lunchTrucks.map((truck, index) => (
                <div
                  key={index}
                  className={`p-0.5 rounded-lg shadow ${itemColors.unMove.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                >
                  <div className={`${itemColors.unMove.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                    <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center font-extrabold text-white relative">
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">{truck.name.split("-").pop()}</span>
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <IconTruck
                        className="h-7 w-11"
                        color={itemColors.unMove.color}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                      {truck.lastUbication}
                    </span>
                    <span
                      className="font-semibold text-[9.5px] select-none leading-[10px] pl-1.5 pb-0.5 text-center flex items-center gap-1 truncate text-white"
                    >
                      {truck.lastDate && `Hora de Inicio: ${format(new Date(truck.lastDate), "HH:mm")}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-[#360353] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.mina.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {lunchTimeMineDetection.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  Ingreso a mina después del refrigerio
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {lunchTimeMineDetection.map((truck, index) => (
                <div
                  key={index}
                  className="p-0.5 rounded-lg shadow cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1"
                  style={{
                    background: truck.firstBocamina?.isLate ? "#a81313" : "#7B1FA280"
                  }}
                >
                  <div
                    className="rounded-lg py-1 px-1 flex items-center gap-2"
                    style={{
                      background: truck.firstBocamina?.isLate ? "#ee3232" : "#9333EA"
                    }}
                  >
                    <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center font-extrabold text-white relative">
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">{truck.unit.split("-").pop()}</span>
                    </div>
                    
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <IconTruck
                        className="h-7 w-11"
                        color={itemColors.mina.color}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                      {truck.firstBocamina?.ubication}
                    </span>
                    <span
                      className="font-semibold text-[9.5px] select-none leading-[10px] pl-1.5 pb-0.5 text-center flex items-center gap-1 text-white"
                    >
                      Ingreso a Mina: {format(new Date(truck.firstBocamina?.startTime || 0), "HH:mm")}
                    </span>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-[#004b1f] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.parqueo.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {truckFiltered.finalParqueoUnits.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  Fin de guardia
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {truckFiltered.finalParqueoUnits.map((truck, index) => (
                <div key={index}>
                  <div
                    className={`p-0.5 rounded-lg shadow ${itemColors.parqueo.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                  >
                    <div className={`${itemColors.parqueo.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                      <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                        <IconTruck
                          className="h-7 w-16 -translate-x-1 translate-y-0.5"
                          color={itemColors.parqueo.color}
                        />
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-bold text-white leading-none ">
                          {truck.name}
                        </span>
                        <span className="text-[10px] font-normal text-black leading-none truncate">
                          {truck.lastUbication}
                        </span>
                      </div>
                    </div>
                    <span
                      className={clsx(
                        "text-[9.5px] select-none leading-[10px] pl-1.5 pb-0.5 text-center flex items-center gap-1 truncate",
                        truck.connectivity === "online"
                          ? "text-amber-400"
                          : "text-zinc-300"
                      )}
                    >
                      <div
                        className={`w-[4px] h-[4px] rounded-full ${
                          truck.connectivity === "online"
                            ? "bg-amber-400"
                            : "bg-zinc-300"
                        }`}
                      ></div>{" "}
                      {truck.connectivity === "online"
                        ? "En línea"
                        : "Fuera de línea"}
                      <TimeAgo
                        datetime={truck.updatedAt}
                        locale="es"
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProductionStatus;
