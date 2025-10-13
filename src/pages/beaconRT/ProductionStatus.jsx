import { useState, useMemo, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useFetchData } from "@/hooks/useGlobalQuery";
import TimeAgo from "timeago-react";
import { ModalComment } from "@/components/Dashboard/FleetStatus/ModalComment";
import IconTruck from "@/icons/IconTruck";
import clsx from "clsx";
// Beacon Data
import {
  ubicationBocamina,
  superficieLocation,
  maintenanceLocation,
  ubicationData
} from "./UbicationLocation"

const extractNumber = (tag) => {
  const match = tag.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

const ProductionStatus = () => {
  const {
    data = [],
    refetch,
    isFetching,
    isLoading: tripsLoading,
    isError: tripsError,
  } = useFetchData("beacon-truck", "beacon-truck", { refetchInterval: 10000 });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);

  const truckFiltered = useMemo(() => {
    const operativeUnits = [];
    const superficieData = [];
    const undergroundData = [];
    const unMoveTrucks = [];

    data.forEach((truck) => {
      const isSuperficie = superficieLocation.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      const isMaintenance = maintenanceLocation.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      const isUnderground = ubicationBocamina.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());
      const isDestination = ubicationData.find((e) => e.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase());

      if(isSuperficie || isDestination) {
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
      totalTruck: data.length,
      superficieData,
      undergroundData,
      unMoveTrucks
    }
  }, [data]);


  console.log("truckFiltered", truckFiltered)

  const itemColors = {
    operativo: {
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 flex-1 grid-rows-3 xl:grid-rows-1 ">
          <div className="flex flex-col bg-[#004b1f] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.operativo.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  Operativos
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {data.map((truck, index) => (
                <div key={index}>
                  <div
                    className={`p-0.5 rounded-lg shadow ${itemColors.operativo.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                  >
                    <div className={`${itemColors.operativo.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                      <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                        <IconTruck
                          className="h-7 w-16 -translate-x-1 translate-y-0.5"
                          color={itemColors.operativo.color}
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

          <div className="flex flex-col bg-[#313131] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.unMove.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {truckFiltered.unMoveTrucks.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  Sin Movimiento
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {truckFiltered.unMoveTrucks.map((truck, index) => (
                <div key={index}>
                  <div
                    className={`p-0.5 rounded-lg shadow ${itemColors.unMove.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                  >
                    <div className={`${itemColors.unMove.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                      <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                        <IconTruck
                          className="h-7 w-16 -translate-x-1 translate-y-0.5"
                          color={itemColors.unMove.color}
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

          <div className="flex flex-col bg-[#141fb1] p-2 rounded-xl">
            <div className={`w-full flex flex-col items-center select-none p-2 rounded ${itemColors.superficie.color}`}>
              <div className="w-full pl-2 pt-1 pb-2 flex items-center gap-2 h-9">
                <div className="text-xs font-semibold text-zinc-200 select-none h-6 w-12 rounded-[7px] bg-black/80 flex items-center justify-center">
                  {truckFiltered.superficieData.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  En Superficie
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {truckFiltered.superficieData.map((truck, index) => (
                <div key={index}>
                  <div
                    className={`p-0.5 rounded-lg shadow ${itemColors.superficie.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                  >
                    <div className={`${itemColors.superficie.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                      <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                        <IconTruck
                          className="h-7 w-16 -translate-x-1 translate-y-0.5"
                          color={itemColors.superficie.color}
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
                  {truckFiltered.undergroundData.length} / {truckFiltered.totalTruck}
                </div>
                <h4 className="text-white text-sm font-bold select-none">
                  En Mina
                </h4>
              </div>
            </div>
            <div className="p-1 w-full flex-1 overflow-y-auto custom-scrollbar rounded-xl transition-colors ease-in-out duration-500 grid grid-cols-2 xl:grid-cols-3 items-start auto-rows-min gap-2">
              {truckFiltered.undergroundData.map((truck, index) => (
                <div key={index}>
                  <div
                    className={`p-0.5 rounded-lg shadow ${itemColors.mina.outer} cursor-move select-none outline outline-2 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300 flex flex-col gap-1`}
                  >
                    <div className={`${itemColors.mina.inner} rounded-lg py-1 px-1 flex items-center gap-2`}>
                      <div className="w-8 h-8 overflow-hidden bg-black/20 rounded-lg flex-shrink-0">
                        <IconTruck
                          className="h-7 w-16 -translate-x-1 translate-y-0.5"
                          color={itemColors.mina.color}
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
