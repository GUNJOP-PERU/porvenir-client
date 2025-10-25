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
  ubicationData,
} from "./UbicationLocation";
import { format, set, getISODay, setDate } from "date-fns";
import { getCurrentDay } from "@/utils/dateUtils";
import type { TruckStatus, UnitTripDetections } from "../../types/Beacon";
import dayjs from "dayjs";

const UtilizacionDeFlota = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [currentIsoDay, setCurrentIsoDay] = useState<number>(getISODay(new Date()));
  const [dateFilter, setDateFilter] = useState<Date>(getCurrentDay().endDate);

  const { data = [] } = useFetchData<TruckStatus[]>(
    "beacon-truck",
    "beacon-truck",
    {
      refetchInterval: 10000,
    }
  );

  const { data: beaconDetectionData } = useFetchData<UnitTripDetections[]>(
    "trip-group-by-days-rt",
    `beacon-track/group-by-unit?date=${format(
      dateFilter,
      "yyyy-MM-dd"
    )}${shiftFilter ? `&shift=${shiftFilter}` : ""}`,
    { refetchInterval: 2000 }
  );

  const mineDetection = useMemo(() => {
    if (
      !Array.isArray(beaconDetectionData) ||
      beaconDetectionData.length === 0
    ) {
      return [];
    }

    return beaconDetectionData
      .map((unit) => {
        const firstBocamina = unit.tracks?.find((track) =>
          [
            "Int-BC-1820",
            "Int-BC-1800",
            "Int-BC-1875",
            "Int-BC-1930",
            "Int-BC-1910",
          ].includes(track.ubication)
        );

        // const lastItem = unit.tracks?.[unit.tracks.length - 1]?.uuid;
        let isLateBocamina = false;

        if (firstBocamina) {
          const startTime = dayjs(firstBocamina.f_inicio);
          const dayShiftLimit = startTime.hour(8).minute(30);
          const nightShiftLimit = startTime.hour(20).minute(30);

          if (shiftFilter === "dia") {
            isLateBocamina = startTime.isAfter(dayShiftLimit);
          } else if (shiftFilter === "noche") {
            isLateBocamina = startTime.isAfter(nightShiftLimit);
          }
        }

        const duration =
          firstBocamina?.f_final && firstBocamina?.f_inicio
            ? dayjs(firstBocamina.f_final).diff(
                dayjs(firstBocamina.f_inicio),
                "minute"
              )
            : 0;

        return {
          unit: unit.unit,
          firstBocamina: firstBocamina
            ? {
                isLate: isLateBocamina,
                ubication: firstBocamina.ubication,
                ubicationType: firstBocamina.ubicationType,
                startTime: firstBocamina.f_inicio,
                endTime: firstBocamina.f_final,
                duration: duration.toFixed(1),
              }
            : null,
        };
      })
      .filter((item) => item.firstBocamina !== null);
  }, [beaconDetectionData, shiftFilter]);

  const lunchTimeMineDetection = useMemo(() => {
    if (!beaconDetectionData || beaconDetectionData.length === 0) {
      return [];
    }

    return beaconDetectionData
      .map((unit) => {
        const firstAfternoonBocamina = unit.tracks?.find((track) => {
          const isBocamina =
            track.ubication?.toLowerCase().includes("bocamina") ||
            track.ubicationType?.toLowerCase().includes("bocamina");

          if (!isBocamina) return false;

          const trackTime = new Date(track.f_inicio);
          const hours = trackTime.getHours();
          const minutes = trackTime.getMinutes();
          const totalMinutes = hours * 60 + minutes;

          return totalMinutes >= 780;
        });

        // const lastItem = unit.tracks[unit.tracks.length - 1]?.uuid;
        let isLateBocamina = false;

        // if (lastItem !== firstAfternoonBocamina?.uuid) {
        //   return {
        //     unit: unit.unit,
        //     firstBocamina: null,
        //   };
        // }

        if (firstAfternoonBocamina) {
          const bocaminaStartTime = new Date(firstAfternoonBocamina.f_inicio);
          const hours = bocaminaStartTime.getHours();
          const minutes = bocaminaStartTime.getMinutes();
          const totalMinutes = hours * 60 + minutes;

          const dayShiftLimit = 13 * 60 + 30;
          const nightShiftLimit = 1 * 60 + 30;

          if (shiftFilter === "dia") {
            isLateBocamina = totalMinutes > dayShiftLimit;
          } else if (shiftFilter === "noche") {
            isLateBocamina = totalMinutes > nightShiftLimit;
          }
        }

        return {
          unit: unit.unit,
          firstBocamina: firstAfternoonBocamina
            ? {
                isLate: isLateBocamina,
                ubication: firstAfternoonBocamina.ubication,
                ubicationType: firstAfternoonBocamina.ubicationType,
                startTime: firstAfternoonBocamina.f_inicio,
                endTime: firstAfternoonBocamina.f_final,
                duration:
                  firstAfternoonBocamina.f_final &&
                  firstAfternoonBocamina.f_inicio
                    ? (
                        (new Date(firstAfternoonBocamina.f_final).getTime() -
                          new Date(firstAfternoonBocamina.f_inicio).getTime()) /
                        1000 /
                        60
                      ).toFixed(1)
                    : "0",
              }
            : null,
        };
      })
      .filter((item) => item.firstBocamina !== null)
      .sort((a, b) => {
        const numA = parseInt(a.unit.match(/\d+$/)?.[0] || "0", 10);
        const numB = parseInt(b.unit.match(/\d+$/)?.[0] || "0", 10);
        return numA - numB;
      });
  }, [beaconDetectionData, shiftFilter]);

  const truckFiltered = useMemo(() => {
    const parqueoUnits: TruckStatus[] = [];
    const superficieData: TruckStatus[] = [];
    const undergroundData: TruckStatus[] = [];
    const unMoveTrucks: TruckStatus[] = [];
    const lunchTrucks: TruckStatus[] = [];
    const finalParqueoUnits: TruckStatus[] = [];

    data.forEach((truck) => {
      const isParqueo = truck.lastUbicationMac.toLowerCase() === "bc:57:29:01:c9:03" || truck.lastUbicationMac.toLowerCase() === "bc:57:29:01:c9:18";
      const isSuperficie = superficieLocation.find(
        (e) => e.mac.some((mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase())
      );
      const isMaintenance = maintenanceLocation.find(
        (e) => e.mac.some((mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase())
      );
      const isUnderground = ubicationBocamina.find(
        (e) => e.mac.some((mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase())
      );
      const isDestination = ubicationData.find(
        (e) => e.mac.some((mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase())
      );

      const isLunchTime = (() => {
        const lastTime = new Date(truck.lastDate).getTime();
        const lunchStart = set(new Date(), {
          hours: 12,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();
        const lunchEnd = set(new Date(), {
          hours: 13,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();
        const lunchNightStart = set(new Date(), {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();
        const lunchNightEnd = set(new Date(), {
          hours: 1,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();

        return (
          (lastTime >= lunchStart && lastTime <= lunchEnd) ||
          (lastTime >= lunchNightStart && lastTime <= lunchNightEnd)
        );
      })();

      const isEndOfTurn = (() => {
        const lastTime = new Date(truck.lastDate).getTime();
        const endDayShiftStart = set(new Date(), {
          hours: 17,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();
        const endDayShiftEnd = set(new Date(), {
          hours: 18,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();
        const endNightShiftStart = set(new Date(), {
          hours: 5,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();
        const endNightShiftEnd = set(new Date(), {
          hours: 6,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }).getTime();

        return (
          (lastTime >= endDayShiftStart && lastTime <= endDayShiftEnd) ||
          (lastTime >= endNightShiftStart && lastTime <= endNightShiftEnd)
        );
      })();

      if (isLunchTime && isParqueo) {
        lunchTrucks.push(truck);
      } else if (
        isEndOfTurn &&
        isParqueo &&
        ((5 <= new Date().getHours() && new Date().getHours() < 6) ||
          (17 <= new Date().getHours() && new Date().getHours() < 18))
      ) {
        finalParqueoUnits.push(truck);
      } else if (
        isParqueo &&
        new Date().getTime() - new Date(truck.lastDate).getTime() <
          15 * 60 * 1000
      ) {
        parqueoUnits.push(truck);
      } else if (isSuperficie || isDestination) {
        superficieData.push(truck);
      } else if (isUnderground) {
        undergroundData.push(truck);
      } else if (isMaintenance) {
        unMoveTrucks.push(truck);
      } else {
        undergroundData.push(truck);
      }
    });
    const sortByUnitNumber = (arr: TruckStatus[]) =>
      [...arr]
        .filter((truck) => truck.tag)
        .sort((a, b) => {
          const numA = parseInt(a.tag!.match(/\d+$/)?.[0] || "0", 10);
          const numB = parseInt(b.tag!.match(/\d+$/)?.[0] || "0", 10);
          return numA - numB;
        });

    return {
      parqueoUnits: sortByUnitNumber(parqueoUnits),
      totalTruck: data.length,
      superficieData: sortByUnitNumber(superficieData),
      undergroundData: sortByUnitNumber(undergroundData),
      unMoveTrucks: sortByUnitNumber(unMoveTrucks),
      lunchTrucks: sortByUnitNumber(lunchTrucks),
      finalParqueoUnits: sortByUnitNumber(finalParqueoUnits),
    };
  }, [data]);

  const itemColors = {
    parqueo: {
      outer: "bg-[#8b5e34]",
      inner: "bg-[#bc8a5f]",
      color: "#e7bc91",
    },
    superficie: {
      outer: "bg-[#ff7b9c]",
      inner: "bg-[#ff7b9c]",
      color: "#ff7b9c",
    },
    unMove: {
      outer: "bg-[#418CB1]",
      inner: "bg-[#64ADD0]",
      color: "#8ecae6",
    },
    mina: {
      outer: "bg-[#5F8E65]",
      inner: "bg-[#85A789]",
      color: "#aec3b0",
    },
    mantenimiento: {
      outer: "bg-[#ecba03]",
      inner: "bg-[#ecba03]",
      color: "#ecba03",
    },
    guardia: {
      outer: "bg-[#5F8E65]",
      inner: "bg-[#85A789]",
      color: "#aec3b0",
    },
  };

  useEffect(() => {
    setInterval(() => {
      setDateFilter(getCurrentDay().endDate);
      setCurrentIsoDay(getISODay(new Date()));
    }, 5000);
  }, []);

  return (
    <div
      className={clsx(`flex-1 w-full bg-cover bg-no-repeat bg-center p-4 grid grid-cols-1 md:grid-cols-2 ${currentIsoDay === 3 ? "xl:grid-cols-5" : "xl:grid-cols-3"} gap-2 grid-rows-3 xl:grid-rows-1`)}
    >
      <div className="flex flex-col bg-[#4F3400] p-2 rounded-xl h-[calc(100vh-88px)]">
        <div
          className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded  ${itemColors.parqueo.color}`}
        >
          <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
            {truckFiltered.parqueoUnits.length} / {truckFiltered.totalTruck}
          </div>
          <h4
            className="text-sm font-bold select-none"
            style={{ color: itemColors.parqueo.color }}
          >
            Parqueo
          </h4>
        </div>
        <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
          {truckFiltered.parqueoUnits.map((truck, index) => (
            <div key={index}>
              <div
                className={`p-0.5 rounded-lg shadow ${itemColors.parqueo.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
              >
                <div
                  className={`${itemColors.parqueo.inner} rounded-lg py-1 px-1 flex items-center gap-2`}
                >
                  <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white leading-none gap-[1px]">
                    <span className="text-[7px] font-medium text-zinc-50/80">
                      CAM
                    </span>
                    <span className="">{truck.name.split("-").pop()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <IconTruck
                      className="h-7 w-11"
                      color={itemColors.parqueo.color}
                    />
                  </div>
                </div>
                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 line-clamp-2 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-100">
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] pb-0.5 text-center flex items-center gap-1 truncate text-white">
                    {truck.lastDate &&
                      `Hora de Inicio: ${format(
                        new Date(truck.lastDate),
                        "HH:mm"
                      )}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-[#1e3a1d] p-2 rounded-xl h-[calc(100vh-88px)]">
        <div
          className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded ${itemColors.mina.color}`}
        >
          <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
            {mineDetection.length} / {truckFiltered.totalTruck}
          </div>
          <h4
            className="text-sm font-bold select-none"
            style={{ color: "#e0aaff" }}
          >
            Primer Ingreso a Mina
          </h4>
        </div>
        <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
          {mineDetection.filter((truck) => !truckFiltered.finalParqueoUnits.some((e) => e.name === truck.unit)).map((truck, index) => (
            <div
              key={index}
              className="p-0.5 rounded-lg shadow cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1"
              style={{
                background: truck.firstBocamina?.isLate
                  ? "#a81313"
                  : "#1fa24680",
              }}
            >
              <div
                className="rounded-lg py-1 px-1 flex items-center gap-2"
                style={{
                  background: truck.firstBocamina?.isLate
                    ? "#ee3232"
                    : "#29ca59",
                }}
              >
                <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white leading-none gap-[1px]">
                  <span className="text-[7px] font-medium text-zinc-50/80">
                    CAM
                  </span>
                  <span className="">{truck.unit.split("-").pop()}</span>
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <IconTruck
                    className="h-7 w-11"
                    color={itemColors.mina.color}
                  />
                </div>
              </div>

              <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 pl-3.5 pr-1 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-300">
                <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                  {truck.firstBocamina?.ubication}
                </span>
                <br />
                <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center text-white">
                  Ingreso a Mina:{" "}
                  {format(
                    new Date(truck.firstBocamina?.startTime || 0),
                    "HH:mm"
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentIsoDay === 3 && (
        <div className="flex flex-col bg-[#132027] p-2 rounded-xl h-[calc(100vh-88px)]">
          <div
            className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded ${itemColors.unMove.color}`}
          >
            <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
              {truckFiltered.lunchTrucks.length} / {truckFiltered.totalTruck}
            </div>
            <h4
              className="text-sm font-bold select-none"
              style={{ color: itemColors.unMove.color }}
            >
              En Refrigerio
            </h4>
          </div>
          <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
            {truckFiltered.lunchTrucks.map((truck, index) => (
              <div
                key={index}
                className={`p-0.5 rounded-lg shadow ${itemColors.unMove.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
              >
                <div
                  className={`${itemColors.unMove.inner} rounded-lg py-1 px-1 flex items-center gap-2`}
                >
                  <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white leading-none gap-[1px]">
                    <span className="text-[7px] font-medium text-zinc-50/80">
                      CAM
                    </span>
                    <span className="">{truck.name.split("-").pop()}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <IconTruck
                      className="h-7 w-11"
                      color={itemColors.unMove.color}
                    />
                  </div>
                </div>

                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 line-clamp-2 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-300">
                  <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                    {truck.lastUbication}
                  </span>
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center flex items-center gap-1 truncate text-white">
                    {truck.lastDate &&
                      `Hora de Inicio: ${format(
                        new Date(truck.lastDate),
                        "HH:mm"
                      )}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      { currentIsoDay === 3 &&(
        <div className="flex flex-col bg-[#1e3a1d] p-2 rounded-xl h-[calc(100vh-88px)]">
          <div
            className={`w-full flex gap-1.5 items-center select-none px-1 pb-1 rounded ${itemColors.mina.color}`}
          >
            <div className="text-[10px] font-semibold text-zinc-200 select-none h-5 w-9 rounded-[5px] bg-black/80 flex items-center justify-center">
              {lunchTimeMineDetection.length} / {truckFiltered.totalTruck}
            </div>
            <h4
              className="text-[12px] font-bold select-none leading-4"
              style={{ color: "#e0aaff" }}
            >
              Ingreso a mina después del refrigerio
            </h4>
          </div>
          <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
            {lunchTimeMineDetection.map((truck, index) => (
              <div
                key={index}
                className="p-0.5 rounded-lg shadow cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1"
                style={{
                  background: truck.firstBocamina?.isLate
                    ? "#a81313"
                    : "#1fa24680",
                }}
              >
                <div
                  className="rounded-lg py-1 px-1 flex items-center gap-2"
                  style={{
                    background: truck.firstBocamina?.isLate
                      ? "#ee3232"
                      : "#29ca59",
                  }}
                >
                  <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white leading-none gap-[1px]">
                    <span className="text-[7px] font-medium text-zinc-50/80">
                      CAM
                    </span>
                    <span className="">{truck.unit.split("-").pop()}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <IconTruck
                      className="h-7 w-11"
                      color={itemColors.mina.color}
                    />
                  </div>
                </div>

                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-300">
                  <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                    {truck.firstBocamina?.ubication}
                  </span>
                  <br />
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center text-white">
                    Ingreso a Mina:{" "}
                    {format(
                      new Date(truck.firstBocamina?.startTime || 0),
                      "HH:mm"
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col bg-[#2B302B] p-2 rounded-xl h-[calc(100vh-88px)]">
        <div
          className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded ${itemColors.guardia.color}`}
        >
          <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
            {truckFiltered.finalParqueoUnits.length} /{" "}
            {truckFiltered.totalTruck}
          </div>
          <h4
            className="text-sm font-bold select-none"
            style={{ color: itemColors.guardia.color }}
          >
            Fin de guardia
          </h4>
        </div>
        <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
          {truckFiltered.finalParqueoUnits.map((truck, index) => (
            <div key={index}>
              <div
                className={`p-0.5 rounded-lg shadow ${itemColors.guardia.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
              >
                <div
                  className={`${itemColors.guardia.inner} rounded-lg py-1 px-1 flex items-center gap-2`}
                >
                  <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex flex-col items-center justify-center font-extrabold text-white leading-none gap-[1px]">
                    <span className="text-[7px] font-medium text-zinc-50/80">
                      CAM
                    </span>
                    <span className="">{truck.name.split("-").pop()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <IconTruck
                      className="h-7 w-11"
                      color={itemColors.guardia.color}
                    />
                  </div>
                </div>
                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-300">
                  <span className="text-[10px] text-center font-semibold text-white leading-none truncate">
                    {truck.lastUbication}
                  </span>
                  <br />
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center text-white">
                    Fin de guardia:{" "}
                    {format(new Date(truck.lastDate || 0), "HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UtilizacionDeFlota;
