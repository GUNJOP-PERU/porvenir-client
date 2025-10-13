import type { BeaconTruckStatus } from "@/types/Beacon";

export default function Legend({ data = [] }: { data: BeaconTruckStatus[] }) {

  console.log(data)
  const counts = data.reduce(
    (acc, truck) => {
      const status = truck.status?.toLowerCase() ?? "";
      const connectivity = truck.connectivity?.toLowerCase() ?? "";

      const key = status.includes("inoperativo")
        ? "inoperativo"
        : status.includes("mantenimiento")
        ? "mantenimiento"
        : status.includes("operativo")
        ? "operativo"
        : null;

      if (key) {
        acc[key].total += 1;
        if (connectivity === "online") acc[key].online += 1;
        else if (connectivity === "offline") acc[key].offline += 1;
      }

      return acc;
    },
    {
      operativo: { total: 0, online: 0, offline: 0 },
      mantenimiento: { total: 0, online: 0, offline: 0 },
      inoperativo: { total: 0, online: 0, offline: 0 },
    }
  );

  return (
    <div className="space-y-1.5 text-xs absolute bottom-2 left-2 bg-black/75 rounded-xl py-2.5 px-3 z-10 select-none">
      <div className="flex justify-between text-white text-[11px] leading-none">
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-[#22C55E]"></div>
          <span className="text-[#22C55E] font-bold px-1 capitalize">
            OPERATIVO | {counts.operativo.total} |
          </span>
          <div className="flex gap-1 px-2 mt-1 text-zinc-500 text-[10px]">
            <span className="text-amber-400">
              En línea: {counts.operativo.online}
            </span>{" "}
            |{" "}
            <span className="text-zinc-400">
              Fuera de línea: {counts.operativo.offline}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-[#F59E0B]"></div>
          <span className="text-[#F59E0B] font-bold px-1">
            MANTENIMIENTO | {counts.mantenimiento.total} |
          </span>
          <div className="flex gap-1 px-2 mt-1 text-zinc-500 text-[10px]">
            <span className="text-amber-400">
              En línea: {counts.mantenimiento.online}
            </span>{" "}
            |{" "}
            <span className="text-zinc-400">
              Fuera de línea: {counts.mantenimiento.offline}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[5px] mb-1.5 bg-[#EF4444]"></div>
          <span className="text-[#EF4444] font-bold px-1">
            INOPERATIVO | {counts.inoperativo.total} |
          </span>
          <div className="flex gap-1 px-2 mt-1 text-zinc-500 text-[10px]">
            <span className="text-amber-400">
              En línea: {counts.inoperativo.online}
            </span>{" "}
            |{" "}
            <span className="text-zinc-400">
              Fuera de línea: {counts.inoperativo.offline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
