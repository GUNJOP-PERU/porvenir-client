import type { BeaconTruckStatus } from "@/types/Beacon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TimeAgo from "timeago-react";

export default function Rute({ data }: { data: BeaconTruckStatus[] }) {
  const filteredData = data.filter((truck) => {
    const excludeUbications = ["Parqueo","Int-BC-1820", "Int-BC-1800", "Int-BC-1875", "Int-BC-1930", "Int-BC-1910","Pahuaypite","Cancha 100","Faja 4"];

    if(truck.status?.toLowerCase() !== "operativo") return false;
    if (truck.direction?.toLowerCase() !== "salida" && truck.direction?.toLowerCase() !== "-") return false;
    if (excludeUbications.includes(truck.lastUbication)) return false;
    const lastUpdate = new Date(truck.updatedAt);
    const diffMinutes = (Date.now() - lastUpdate.getTime()) / 1000 / 60;
    return diffMinutes > 20;
  });

  return (
    <div className="absolute bottom-32 right-2 bg-black/75 rounded-xl p-2 z-10 w-36 border border-zinc-800 space-y-1 flex flex-col">
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
              <span className="text-zinc-300">Ubicación: {truck.lastUbication}</span>
              <span className="text-zinc-300">Dirección: {truck.direction}</span>
              <TimeAgo datetime={truck.updatedAt} locale="es" />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
