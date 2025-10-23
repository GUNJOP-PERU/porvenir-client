import type { BeaconTruckStatus } from "@/types/Beacon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TimeAgo from "timeago-react";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function Rute({ data }: { data: BeaconTruckStatus[] }) {
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const ubications = ["Taller Saturno"];

    const twentyMinutesAgo = dayjs().subtract(30, "minute");

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

  return (
    <div className="absolute bottom-28 right-2 bg-black/75 rounded-xl p-2 z-10 w-36 border border-zinc-800 space-y-1 flex flex-col">
      <span className="text-zinc-300 font-bold text-[10px]">
        Camiones en ruta |{filteredData.length}|
      </span>
      <div className="flex flex-wrap gap-0.5 max-h-40 overflow-y-auto custom-scrollbar">
        {filteredData.map((truck, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center px-1 py-0.5  rounded-lg select-none cursor-pointer bg-[#16a34a]"
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
              side="bottom"
              className="bg-black text-amber-400 text-[11px] px-2.5 py-2.5 rounded-xl max-w-[200px] shadow-none flex flex-col gap-1 leading-none font-semibold "
            >
              <span className="text-zinc-300">
                Ubicación: {truck.lastUbication}
              </span>
              <span className="text-zinc-300">
                Hora: {dayjs(truck.lastDate).format("HH:mm")}
              </span>
              <TimeAgo datetime={truck.lastDate} locale="es" />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
