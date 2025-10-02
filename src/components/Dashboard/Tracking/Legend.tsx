import type { BeaconTruckStatus } from "@/types/Beacon";

export default function Legend({ data = [] }: { data: BeaconTruckStatus[] }) {

  const counts = data.reduce(
    (acc, truck) => {
      const status = truck.status?.toLowerCase() ?? "";

      if (status.includes("operativo")) acc.operativo += 1;
      else if (status.includes("mantenimiento")) acc.mantenimiento += 1;
      else if (status.includes("inoperativo")) acc.inoperativo += 1;
      else acc.offline += 1;

      return acc;
    },
    { operativo: 0, mantenimiento: 0, inoperativo: 0, offline: 0 }
  );

  return (
    <div className="space-y-1.5 text-xs absolute bottom-2 left-2 bg-black/75 rounded-xl py-2.5 px-3 z-10 select-none">
      <p className="font-normal text-zinc-300 text-left text-[10px] leading-none">
        Leyenda de camiones
      </p>
      <div className="flex justify-between text-white text-[10px] leading-none">
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-[#22C55E]"></div>
          <span className="text-[#22C55E] font-bold px-1 capitalize">
            OPERATIVO | {counts.operativo} |
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-[#F59E0B]"></div>
          <span className="text-[#F59E0B] font-bold px-1">
            MANTENIMIENTO | {counts.mantenimiento} |
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-[#EF4444]"></div>
          <span className="text-[#EF4444] font-bold px-1">
            INOPERATIVO | {counts.inoperativo} |
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-zinc-500"></div>
          <span className="text-zinc-400 font-bold px-1">
            OFFLINE | {counts.offline} |
          </span>
        </div>
      </div>
    </div>
  );
}
