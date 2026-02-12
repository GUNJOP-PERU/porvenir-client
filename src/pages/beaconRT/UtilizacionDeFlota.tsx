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
// Utils
import { calculateAvgHour } from "@/utils/utilization";

const UtilizacionDeFlota = () => {
  const [shiftFilter, setShiftFilter] = useState<string>(getCurrentDay().shift);
  const [showOtherColumns, setShowOtherColumns] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<Date>(getCurrentDay().endDate);

  const { data = [] } = useFetchData<TruckStatus[]>(
    "beacon-truck",
    "beacon-truck",
    "",
    {
      refetchInterval: 5000,
    }
  );

  const { data: beaconDetectionData = [] } = useFetchData<UnitTripDetections[]>(
    "trip-group-by-days-rt",
    `beacon-track/group-by-unit?date=${format(
      dateFilter,
      "yyyy-MM-dd"
    )}${shiftFilter ? `&shift=${shiftFilter}` : ""}`,
    "",
    { refetchInterval: 5000 }
  );

  const mineDetection = useMemo(() => {
    const unitBCValidDetections: any[] = []
    const validBC = [
      "Int-BC-1820",
      "Int-BC-1800",
      "Int-BC-1875",
      "Ext-BC-1800",
      "Ext-BC-1875",
      "Int-BC-1930",
      "Int-BC-1910",
    ]
    const validExtBC = [
      "Ext-BC-1820",
      "Ext-BC-1800",
      "Ext-BC-1875",
      "Ext-BC-1930",
      "Ext-BC-1910",
    ]

    beaconDetectionData.forEach((unit) => {
      const unitBCValidation: any[] = []
      const bcDetection = unit.tracks.filter((track) => validBC.some((bc) => bc === track.ubication))
      let isLateBocamina = false;

      bcDetection.forEach((track) => {
        const indexFirstBocamina = unit.tracks.findIndex(t => t.uuid === track.uuid);
        const detectionAfter = unit.tracks[indexFirstBocamina + 1];
        const detectionBefore = unit.tracks[indexFirstBocamina - 1];

        const startTime = dayjs(track.f_inicio);
        const dayShiftLimit = startTime.hour(8).minute(30);
        const nightShiftLimit = startTime.hour(20).minute(30);
        const duration = track.f_final && track.f_inicio
          ? dayjs(track.f_final).diff(
            dayjs(track.f_inicio),
            "minute"
          )
          : 0;

        if (shiftFilter === "dia") {
          isLateBocamina = startTime.isAfter(dayShiftLimit);
        } else if (shiftFilter === "noche") {
          isLateBocamina = startTime.isAfter(nightShiftLimit);
        }

        if (track.ubication === "Int-BC-1820" || track.ubication === "Ext-BC-1820") {
          if (detectionAfter?.ubication === "Int-BC-1800" || detectionBefore?.ubication === "Int-BC-1800" || detectionAfter?.ubication === "Ext-BC-1800" || detectionBefore?.ubication === "Ext-BC-1800") {
            return
          }
        }

        if (track.ubication === "Ext-BC-1875" || track.ubication === "Ext-BC-1800") {
          if (detectionAfter?.ubication !== "Int-BC-1875" && detectionAfter?.ubication !== "Int-BC-1800" && detectionAfter?.ubicationSubType !== "superficie") {
            return unitBCValidation.push({
              unit: unit.unit,
              firstBocamina: {
                isLate: isLateBocamina,
                ubication: track.ubication,
                ubicationType: track.ubicationType,
                startTime: track.f_inicio,
                endTime: track.f_final,
                duration: duration.toFixed(1),
              }
            })
          }
        }

        if (detectionAfter?.ubicationSubType === "superficie") {
          return
        } else if (validExtBC.some((bc) => bc === detectionBefore?.ubication) || detectionAfter?.ubicationSubType === "superficie") {
          return unitBCValidation.push({
            unit: unit.unit,
            firstBocamina: {
              isLate: isLateBocamina,
              ubication: track.ubication,
              ubicationType: track.ubicationType,
              startTime: track.f_inicio,
              endTime: track.f_final,
              duration: duration.toFixed(1),
            }
          })
        }
      })

      if (unitBCValidation.length > 0) {
        unitBCValidDetections.push(unitBCValidation[0])
      }
    })

    return unitBCValidDetections
  }, [beaconDetectionData, shiftFilter]);

  const lunchTimeMineDetection = useMemo(() => {
    const unitBCValidDetections: any[] = []
    if (!(getISODay(new Date()) === 3 && getCurrentDay().shift === "dia")) {
      return []
    }
    const validBC = [
      "Int-BC-1820",
      "Int-BC-1800",
      "Int-BC-1875",
      "Ext-BC-1800",
      "Ext-BC-1875",
      "Int-BC-1930",
      "Int-BC-1910",
    ]
    const validExtBC = [
      "Ext-BC-1820",
      "Ext-BC-1800",
      "Ext-BC-1875",
      "Ext-BC-1930",
      "Ext-BC-1910",
    ]

    beaconDetectionData.forEach((unit) => {
      const unitBCValidation: any[] = []
      const bcDetection = unit.tracks.filter((track) => {
        const isBocamina = validBC.some((bc) => bc === track.ubication)
        if (!isBocamina) return false;
        const trackTime = new Date(track.f_inicio);
        const hours = trackTime.getHours();
        const minutes = trackTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        return totalMinutes >= 750;
      })
      let isLateBocamina = false;

      bcDetection.forEach((track) => {
        const indexFirstBocamina = unit.tracks.findIndex(t => t.uuid === track.uuid);
        const detectionAfter = unit.tracks[indexFirstBocamina + 1];
        const detectionBefore = unit.tracks[indexFirstBocamina - 1];

        const startTime = dayjs(track.f_inicio);
        const dayShiftLimit = startTime.hour(13).minute(30);
        const duration = track.f_final && track.f_inicio
          ? dayjs(track.f_final).diff(
            dayjs(track.f_inicio),
            "minute"
          )
          : 0;

        if (shiftFilter === "dia") {
          isLateBocamina = startTime.isAfter(dayShiftLimit);
        }

        if (track.ubication === "Int-BC-1820" || track.ubication === "Ext-BC-1820") {
          if (detectionAfter?.ubication === "Int-BC-1800" || detectionBefore?.ubication === "Int-BC-1800" || detectionAfter?.ubication === "Ext-BC-1800" || detectionBefore?.ubication === "Ext-BC-1800") {
            return
          }
        }

        if (track.ubication === "Ext-BC-1875" || track.ubication === "Ext-BC-1800") {
          if (detectionAfter?.ubication !== "Int-BC-1875" && detectionAfter?.ubication !== "Int-BC-1800" && detectionAfter?.ubicationSubType !== "superficie") {
            return unitBCValidation.push({
              unit: unit.unit,
              firstBocamina: {
                isLate: isLateBocamina,
                ubication: track.ubication,
                ubicationType: track.ubicationType,
                startTime: track.f_inicio,
                endTime: track.f_final,
                duration: duration.toFixed(1),
              }
            })
          }
        }

        if (detectionAfter?.ubicationSubType === "superficie") {
          return
        } else if (validExtBC.some((bc) => bc === detectionBefore?.ubication) || detectionAfter?.ubicationSubType === "superficie") {
          return unitBCValidation.push({
            unit: unit.unit,
            firstBocamina: {
              isLate: isLateBocamina,
              ubication: track.ubication,
              ubicationType: track.ubicationType,
              startTime: track.f_inicio,
              endTime: track.f_final,
              duration: duration.toFixed(1),
            }
          })
        }
      })

      if (unitBCValidation.length > 0) {
        unitBCValidDetections.push(unitBCValidation[0])
      }
    })
    return unitBCValidDetections
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

        return (
          (lastTime >= lunchStart && lastTime <= lunchEnd) &&
          (getISODay(new Date()) === 3 && getCurrentDay().shift === "dia")
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
          hours: 19,
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
          hours: 7,
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
        ((5 <= new Date().getHours() && new Date().getHours() < 7) ||
          (17 <= new Date().getHours() && new Date().getHours() < 19))
      ) {
        finalParqueoUnits.push(truck);
      } else if (
        isParqueo &&
        new Date().getTime() - new Date(truck.lastDate).getTime() <
        20 * 60 * 1000
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
      outer: "bg-[#bc8a5f]",
      inner: "bg-[#8b5e34]",
      color: "#e7bc91",
    },
    superficie: {
      outer: "bg-[#ff7b9c]",
      inner: "bg-[#ff7b9c]",
      color: "#ff7b9c",
    },
    unMove: {
      outer: "bg-[#64ADD0]",
      inner: "bg-[#418CB1]",
      color: "#8ecae6",
    },
    mina: {
      outer: "bg-[#85A789]",
      inner: "bg-[#5F8E65]",
      color: "#aec3b0",
    },
    mantenimiento: {
      outer: "bg-[#ecba03]",
      inner: "bg-[#ecba03]",
      color: "#ecba03",
    },
    guardia: {
      outer: "bg-[#a8dadc]",
      inner: "bg-[#76B8BB]",
      color: "#D7F1F3",
    },
  };

  useEffect(() => {
    setInterval(() => {
      setDateFilter(getCurrentDay().endDate);
      setShiftFilter(getCurrentDay().shift);
      if (getISODay(new Date()) === 3 && getCurrentDay().shift === "dia") {
        setShowOtherColumns(true);
      } else {
        setShowOtherColumns(false);
      }
    }, 5000);
  }, []);

  return (
    <div
      className={clsx(`flex-1 w-full bg-cover bg-no-repeat bg-center grid grid-cols-1 md:grid-cols-2 ${showOtherColumns ? "xl:grid-cols-5" : "xl:grid-cols-3"} gap-2 grid-rows-3 xl:grid-rows-1`)}
    >
      <div className="border border-zinc-200 shadow-sm flex flex-col bg-zinc-100 p-2 rounded-xl h-[calc(100vh-100px)]">
        <div
          className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded  ${itemColors.parqueo.color}`}
        >
          <div className="text-xs font-semibold text-zinc-600 select-none h-6 w-12 rounded-[7px] bg-zinc-200 flex items-center justify-center">
            {truckFiltered.parqueoUnits.length} / {truckFiltered.totalTruck}
          </div>
          <h4
            className="text-sm font-bold select-none text-zinc-500"
          // style={{ color: itemColors.parqueo.color }}
          >
            Parqueo (Inicio de turno)
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
                    Estado: {truck.connectivity === "online" ? "Conectado" : "Desconectado"}
                  </span>
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] pb-0.5 text-center flex items-center gap-1 truncate text-white">
                    {truck.arriveDate &&
                      `Hora de Inicio: ${format(
                        new Date(truck.arriveDate),
                        "HH:mm"
                      )}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-zinc-200 shadow-sm flex flex-col bg-zinc-100 p-2 rounded-xl h-[calc(100vh-100px)]">
        <div
          className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded ${itemColors.mina.color}`}
        >
          <div className="text-xs font-semibold text-zinc-600 select-none h-6 w-12 rounded-[7px] bg-zinc-200 flex items-center justify-center">
            {mineDetection.filter(
              (truck) => !truckFiltered.lunchTrucks.some((e) => e.name === truck.unit)
            ).filter(
              (truck) => !lunchTimeMineDetection.some((e) => e.unit === truck.unit)
            ).filter(
              (truck) => !truckFiltered.finalParqueoUnits.some((e) => e.name === truck.unit)
            ).length} / {truckFiltered.totalTruck}
          </div>
          <h4
            className="text-sm font-bold select-none text-zinc-500"
          >
            Primer Ingreso a Mina
          </h4>
          <div className="ml-auto px-2 text-xs font-bold text-white select-none h-6 w-fit rounded-[7px] bg-orange-600 flex items-center justify-center">
            Prom. Hora de Ingreso: {calculateAvgHour(mineDetection.filter(
              (truck) => !truckFiltered.lunchTrucks.some((e) => e.name === truck.unit)
            ).filter(
              (truck) => !lunchTimeMineDetection.some((e) => e.unit === truck.unit)
            ).filter(
              (truck) => !truckFiltered.finalParqueoUnits.some((e) => e.name === truck.unit)
            ).map(t => t.firstBocamina.startTime))}
          </div>
        </div>
        <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
          {mineDetection.filter(
            (truck) => !truckFiltered.lunchTrucks.some((e) => e.name === truck.unit)
          ).filter(
            (truck) => !lunchTimeMineDetection.some((e) => e.unit === truck.unit)
          ).filter(
            (truck) => !truckFiltered.finalParqueoUnits.some((e) => e.name === truck.unit)
          ).map((truck, index) => (
            <div
              key={index}
              className="p-0.5 rounded-lg shadow cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1"
              style={{
                background: truck.firstBocamina?.isLate
                  ? "#FE979C"
                  : "#00C23B",
              }}
            >
              <div
                className="rounded-lg py-1 px-1 flex items-center gap-2"
                style={{
                  background: truck.firstBocamina?.isLate
                    ? "#fe6d73"
                    : "#4BD575",
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
                    color={"#ffffff70"}
                  />
                </div>
              </div>

              <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 pl-3.5 pr-1 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-700">
                <span className="text-[10px] text-center font-semibold text-zinc-700 leading-none truncate">
                  {truck.firstBocamina?.ubication}
                </span>
                <br />
                <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center text-zinc-700">
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

      {showOtherColumns && (
        <div className="border border-zinc-400 shadow-sm flex flex-col bg-[#1320278c] p-2 rounded-xl h-[calc(100vh-100px)]">
          <div
            className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded ${itemColors.unMove.color}`}
          >
            <div className="text-xs font-semibold text-zinc-600 select-none h-6 w-12 rounded-[7px] bg-zinc-200 flex items-center justify-center">
              {truckFiltered.lunchTrucks.length} / {truckFiltered.totalTruck}
            </div>
            <h4
              className="text-sm font-bold select-none text-zinc-500"
            // style={{ color: itemColors.unMove.color }}
            >
              En Refrigerio
            </h4>
          </div>
          <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
            {truckFiltered.lunchTrucks.filter(
              (truck) => !lunchTimeMineDetection.some((e) => e.name === truck.name)
            ).map((truck, index) => (
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

                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 line-clamp-2 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-700">
                  <span className="text-[10px] text-center font-semibold text-zinc-700 leading-none truncate">
                    Estado: {truck.connectivity === "online" ? "Conectado" : "Desconectado"}
                  </span>
                  <br />
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center flex items-center gap-1 truncate text-zinc-700">
                    {truck.arriveDate &&
                      `Hora de Inicio: ${format(
                        new Date(truck.arriveDate),
                        "HH:mm"
                      )}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showOtherColumns && (
        <div className="border border-zinc-400 shadow-sm flex flex-col bg-[#1e3a1d8c] p-2 rounded-xl h-[calc(100vh-100px)]">
          <div
            className={`w-full flex gap-1.5 items-center select-none px-1 pb-1 rounded ${itemColors.mina.color}`}
          >
            <div className="text-[10px] font-semibold text-zinc-600 select-none h-5 w-9 rounded-[5px] bg-zinc-200 flex items-center justify-center">
              {lunchTimeMineDetection.filter(
                (truck) => !truckFiltered.finalParqueoUnits.some((e) => e.name === truck.unit)
              ).length} / {truckFiltered.totalTruck}
            </div>
            <h4
              className="text-sm font-bold select-none text-zinc-500"
            // style={{ color: "#e0aaff" }}
            >
              Ingreso a mina después del refrigerio
            </h4>
          </div>
          <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 items-start auto-rows-min gap-2">
            {lunchTimeMineDetection.filter(
              (truck) => !truckFiltered.finalParqueoUnits.some((e) => e.name === truck.unit)
            ).map((truck, index) => (
              <div
                key={index}
                className="p-0.5 rounded-lg shadow cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1"
                style={{
                  background: truck.firstBocamina?.isLate
                    ? "#a81313"
                    : "#1fa246",
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

                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-700">
                  <span className="text-[10px] text-center font-semibold text-zinc-700 leading-none truncate">
                    {truck.firstBocamina?.ubication}
                  </span>
                  <br />
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] text-center text-zinc-700">
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

      <div className="border border-zinc-200 shadow-sm flex flex-col bg-zinc-100 p-2 rounded-xl h-[calc(100vh-100px)]">
        <div
          className={`w-full flex gap-2 items-center select-none px-1 pb-1 rounded ${itemColors.guardia.color}`}
        >
          <div className="text-xs font-semibold text-zinc-600 select-none h-6 w-12 rounded-[7px] bg-zinc-200 flex items-center justify-center">
            {truckFiltered.finalParqueoUnits.length} /{" "}
            {truckFiltered.totalTruck}
          </div>
          <h4
            className="text-sm font-bold select-none text-zinc-500"
          // style={{ color: itemColors.guardia.color }}
          >
            Parqueo (Fin de turno)
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
                <div className="text-[9.5px] select-none leading-[10px] text-left gap-1 pl-3.5 pr-2 py-1 relative before:content-[''] before:w-[4px] before:h-[4px] before:absolute before:top-[7px]  before:left-[6px] before:rounded-full before:bg-zinc-700">
                  <span className="text-[10px] text-center font-semibold text-zinc-700 leading-none truncate">
                    Estado: {truck.connectivity === "online" ? "Conectado" : "Desconectado"}
                  </span>
                  <br />
                  <span className="font-semibold text-[9.5px] select-none leading-[10px] pb-0.5 text-center flex items-center gap-1 truncate text-zinc-700">
                    {truck.arriveDate &&
                      `Hora de Inicio: ${format(
                        new Date(truck.arriveDate),
                        "HH:mm"
                      )}`}
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
