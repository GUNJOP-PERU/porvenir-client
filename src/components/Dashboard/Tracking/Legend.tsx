import { ubicationDataSub } from "@/pages/beaconRT/UbicationLocation";
import type { BeaconTruckStatus } from "@/types/Beacon";
import { Wifi, WifiOff } from "lucide-react";

export default function Legend({ data = [] }: { data: BeaconTruckStatus[] }) {
  const subterraneoMacs = ubicationDataSub.map((u) => u.mac.toLowerCase());

  // 🔹 Reducir datos separando por estado y zona
  const counts = data.reduce(
    (acc, truck) => {
      const status = truck.status?.toLowerCase() ?? "";
      const connectivity = truck.connectivity?.toLowerCase() ?? "";
      const isSub = subterraneoMacs.includes(
        truck.lastUbicationMac?.toLowerCase() ?? ""
      );
      const zone = isSub ? "subterraneo" : "superficie";

      const key = status.includes("inoperativo")
        ? "inoperativo"
        : status.includes("mantenimiento")
        ? "mantenimiento"
        : status.includes("operativo")
        ? "operativo"
        : null;

      if (key) {
        acc[key][zone].total += 1;
        if (connectivity === "online") acc[key][zone].online += 1;
        else if (connectivity === "offline") acc[key][zone].offline += 1;
      }

      return acc;
    },
    {
      operativo: {
        subterraneo: { total: 0, online: 0, offline: 0 },
        superficie: { total: 0, online: 0, offline: 0 },
      },
      mantenimiento: {
        subterraneo: { total: 0, online: 0, offline: 0 },
        superficie: { total: 0, online: 0, offline: 0 },
      },
      inoperativo: {
        subterraneo: { total: 0, online: 0, offline: 0 },
        superficie: { total: 0, online: 0, offline: 0 },
      },
    }
  );

  const tipos = [
    { key: "operativo", color: "#22C55E", icon: "" },
    { key: "mantenimiento", color: "#F59E0B", icon: "" },
    { key: "inoperativo", color: "#EF4444", icon: "" },
  ];

  return (
    <div className="absolute bottom-2 left-2 bg-black/75 rounded-xl py-2.5 px-2.5 z-10 select-none flex gap-3">
      {tipos.map((t) => {
        const sub = counts[t.key].subterraneo;
        const sup = counts[t.key].superficie;
        const total = sub.total + sup.total;

        return (
          <div
            key={t.key}
            className="flex flex-col items-center "
          >
            <div className="w-full flex items-center justify-between gap-3 mb-1">
              <div
                className="font-bold text-[10px] uppercase"
                style={{ color: t.color }}
              >
                | {total} | {t.key} 
              </div>
              <div className="flex gap-1 text-[10px]">
                <div className="flex items-center gap-0.5 text-amber-400 leading-none">
                  <Wifi className="size-3" /> {sub.online + sup.online}
                </div>
                <div className="flex items-center gap-0.5 text-zinc-400 leading-none">
                  <WifiOff className="size-3" /> {sub.offline + sup.offline}
                </div>
              </div>
            </div>

            <div className="text-[8.5px] leading-none text-zinc-300 flex flex-col items-center gap-1">
              <div className="flex gap-4">
                <span>
                  MINA <span className="text-zinc-200">{sub.total}</span>
                </span>
                <span>
                  SUPERFICIE{" "}
                  <span className="text-zinc-200">{sup.total}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
