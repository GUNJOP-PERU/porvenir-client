import type { BeaconTruckStatus } from "@/types/Beacon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TimeAgo from "timeago-react";
import { useMemo } from "react";
import dayjs from "dayjs";
import { formatFecha } from "@/lib/utilsGeneral";

export default function Rute({ data }: { data: BeaconTruckStatus[] }) {
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const ubications = ["Taller Saturno", "Parrilla 2", "Parrilla 1","Pocket 3" ];

    const twentyMinutesAgo = dayjs().subtract(60, "minute");

    return data
      .filter((truck) => {
        if (!truck.lastDate) return false;

        const lastUpdate = dayjs(truck.lastDate);
        const tooOld = lastUpdate.isBefore(twentyMinutesAgo);

        return (
          truck.status?.toLowerCase() === "operativo" &&
          (truck.direction?.toLowerCase() === "salida" ||
            truck.direction?.toLowerCase() === "-") &&
          !ubications.includes(truck.lastUbication) &&
          tooOld
        );
      })
      .sort((a, b) => {
        const numA = parseInt(a.name.split("-")[2]);
        const numB = parseInt(b.name.split("-")[2]);
        return numA - numB;
      });
  }, [data]);

  const filteredDataInoperativo = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const twentyMinutesAgo = dayjs().subtract(30, "minute");

    return data
      .filter((truck) => {
        if (!truck.lastDate) return false;

        const lastUpdate = dayjs(truck.lastDate);
        const tooOld = lastUpdate.isBefore(twentyMinutesAgo);

        return (
          truck.status?.toLowerCase() === "inoperativo" &&
          (truck.direction?.toLowerCase() === "salida" ||
            truck.direction?.toLowerCase() === "-") &&
          tooOld
        );
      })
      .sort((a, b) => {
        const numA = parseInt(a.name.split("-")[2]);
        const numB = parseInt(b.name.split("-")[2]);
        return numA - numB;
      });
  }, [data]);

  return (
    <div className="absolute bottom-28 right-2 space-y-1">
      <div className=" bg-black/75 rounded-xl p-2 z-10 w-36 border border-zinc-800 space-y-1 flex flex-col">
        <div className="text-green-500 font-extrabold text-[10px] flex items-center gap-1">
          <div className="bg-green-900 p-[2px] rounded-[5px] w-[18px] h-[18px] font-bold text-green-400 flex items-center justify-center">
            {filteredData.length}
          </div>{" "}
          EN RUTA
        </div>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto custom-scrollbar p-0.5">
          {filteredData.map((truck, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center justify-center px-1 py-0.5  rounded-lg select-none cursor-pointer bg-[#16a34a] outline outline-1 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300"
                  style={{
                    border: "2px solid #00000050",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="text-white font-bold text-xs">
                    {truck.name.split("-").pop()}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black text-[11px] px-3 py-2.5 rounded-xl max-w-[200px] shadow-none flex flex-col gap-1 leading-none font-semibold border border-zinc-600"
              >
                <span className="text-zinc-300">
                  | {truck.name.split("-").pop()} | Ubicación:{" "}
                  {truck.lastUbication}
                </span>
                <div className=" flex flex-col text-sm pt-1">
                  <span className="text-green-300 font-bold leading-none">
                    Inicio:{" "}
                    <b className="uppercase font-extrabold">
                      {formatFecha(truck.changeStatusDate)}
                    </b>
                  </span>
                  <span className="text-xs text-green-400 italic font-bold leading-none">
                    Desde {dayjs(truck.changeStatusDate).fromNow()}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className=" bg-black/75 rounded-xl p-2 z-10 w-36 border border-zinc-800 space-y-1 flex flex-col">
        <div className="text-red-400 font-extrabold text-[10px] flex items-center gap-1">
          <div className="bg-red-900 p-[2px] rounded-[5px] w-[18px] h-[18px] font-bold text-red-300 flex items-center justify-center">
            {filteredDataInoperativo.length}
          </div>{" "}
          INOPERATIVOS
        </div>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto custom-scrollbar p-0.5">
          {filteredDataInoperativo.map((truck, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center justify-center px-1 py-0.5  rounded-lg select-none cursor-pointer bg-[#EF4444] outline outline-1 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300"
                  style={{
                    border: "2px solid #00000050",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="text-white font-bold text-xs">
                    {truck.name.split("-").pop()}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black text-[11px] px-3 py-2.5 rounded-xl max-w-[200px] shadow-none flex flex-col gap-1 leading-none font-semibold border border-zinc-600"
              >
                <span className="text-zinc-300">
                  | {truck.name.split("-").pop()} | Ubicación:{" "}
                  {truck.lastUbication}
                </span>
                <div className=" flex flex-col text-sm pt-1">
                  <span className="text-red-300 font-bold leading-none">
                    Inicio:{" "}
                    <b className="uppercase font-extrabold">
                      {formatFecha(truck.changeStatusDate)}
                    </b>
                  </span>
                  <span className="text-xs text-red-400 italic font-bold leading-none">
                    Desde {dayjs(truck.changeStatusDate).fromNow()}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
