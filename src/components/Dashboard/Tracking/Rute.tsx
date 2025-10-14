import type { BeaconTruckStatus } from "@/types/Beacon";
import clsx from "clsx";

export default function Rute({ data }: { data: BeaconTruckStatus[] }) {
  const filteredData = data.filter((truck) => {
    if (truck.lastUbication !== "Parqueo") return false;
    const lastUpdate = new Date(truck.updatedAt);
    const diffMinutes = (Date.now() - lastUpdate.getTime()) / 1000 / 60;
    return diffMinutes > 10;
  });

  console.log(filteredData);
  return (
    <div className="absolute bottom-40 right-12 bg-black/75 rounded-xl p-2 z-10 w-36 border border-zinc-800 space-y-1 flex flex-col">
      <span className="text-zinc-300 font-bold text-[10px]">Camiones en ruta </span>
      <div className="flex flex-wrap gap-0.5 max-h-40 overflow-y-auto">
        {filteredData.map((truck) => (
          <div
            key={truck.name}
            className={clsx(" flex items-center justify-center px-1 py-0.5  rounded-lg select-none", {
              "bg-red-500": truck.status === "inoperativo",
              "bg-[#16a34a]": truck.status === "operativo",
              "bg-[#f59e0b]": truck.status === "mantenimiento",
            })}
            style={{border: "2px solid #00000050",
                boxShadow: "0 2px 4px rgba(0,0,0,0.4)"}}   
          >
            <span className="text-white font-bold text-xs">{truck.name.split("-").pop()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
