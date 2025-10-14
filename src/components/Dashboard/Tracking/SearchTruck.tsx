import { ubicationBocamina, maintenanceLocation, superficieLocation } from "@/pages/beaconRT/UbicationLocation";
import type { BeaconTruckStatus } from "@/types/Beacon";
import clsx from "clsx";
import { Search, X } from "lucide-react";
import { useState, useMemo } from "react";

export default function SearchTruck({
  data,
  onTruckSelect,
  selectedTruck,
  isLoading,
  ubicationData = [],
  includeExtraLocations = false,
}: {
  data: BeaconTruckStatus[];
  onTruckSelect: (truck: BeaconTruckStatus) => void;
  selectedTruck: {
    truck: BeaconTruckStatus;
    area: string;
    position: [number, number];
  } | null;
  isLoading: boolean;
  ubicationData: any[];
  includeExtraLocations?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 3;

  const activeLocations = [
    ...ubicationData,
    ...(includeExtraLocations ? [...ubicationBocamina, ...maintenanceLocation, ...superficieLocation] : []),
  ];

  const trucksPerArea = activeLocations.map((ubication) => {
    const trucksInArea = data.filter(
      (truck) =>
        truck.lastUbicationMac &&
        truck.lastUbicationMac.toLowerCase() === ubication.mac.toLowerCase()
    );

    const onlineCount = trucksInArea.filter(
      (truck) => truck.connectivity === "online"
    ).length;
    const offlineCount = trucksInArea.length - onlineCount;

    return {
      area: ubication.description,
      color: ubication.color || "#0EB1D2", 
      count: trucksInArea.length,
      online: onlineCount,
      offline: offlineCount,
    };
  });

  const filtered = useMemo(() => {
    if (!query) return [];
    return data.filter((truck) =>
      truck.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  const visibleAreas = showAll
    ? trucksPerArea
    : trucksPerArea.slice(0, VISIBLE_COUNT);

  const totalTrucksInAreas = trucksPerArea.reduce((acc, a) => acc + a.count, 0);

  return (
    <div className="absolute top-2 left-2 bg-black/75 rounded-xl p-4 z-10 flex flex-col gap-3 w-60 border border-zinc-800">
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading ? "bg-red-600" : "bg-green-600 animate-pulse"
            }`}
          ></div>
          <span
            className={`text-xs font-bold leading-none ${
              isLoading ? "text-red-500" : "text-green-500"
            }`}
          >
            {isLoading ? "DESCONECTADO" : "CONECTADO"}
          </span>
        </div>
        <p className="text-[10px] text-green-600 mt-1 leading-none ml-3">
          Tracking {includeExtraLocations ? "Superficie" : "Subterráneo"}
        </p>
      </div>

      <div className="flex flex-col gap-1 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por camion..."
            className="w-full h-7 rounded-lg border border-zinc-500 bg-transparent text-white placeholder:text-zinc-400 text-xs px-2 outline-none focus:border-primary transition-all ease-in-out duration-300 pl-6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-rose-500 transition-all ease-in-out duration-300 size-3" />
          {query && (
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-rose-900 group rounded-[5px] size-5 flex items-center justify-center transition-all ease-in-out duration-300 cursor-pointer"
              onClick={() => setQuery("")}
            >
              <X className="size-3 text-zinc-400 group-hover:text-rose-500 transition-all ease-in-out duration-300" />
            </button>
          )}
        </div>

        {query && (
          <div className="absolute top-[44px] left-0 w-full bg-black border border-zinc-700 rounded-lg max-h-36 overflow-y-auto text-xs custom-scrollbar shadow-lg z-20 p-1">
            {filtered.length > 0 ? (
              filtered.map((truck) => (
                <div
                  key={truck.name}
                  className="px-2 py-1 hover:bg-primary/30 cursor-pointer text-zinc-300 hover:text-white rounded-lg"
                  onClick={() => {
                    onTruckSelect(truck);
                    setQuery("");
                  }}
                >
                  {truck.name}
                </div>
              ))
            ) : (
              <div className="w-full px-2 py-2 text-center text-zinc-400 select-none text-[10px]">
                No hay datos
              </div>
            )}
          </div>
        )}

        {selectedTruck && (
          <div className="bg-black/70 text-white p-3 rounded-lg z-10 mt-2">
            <p className="text-sm font-bold">
              Unidad: {selectedTruck.truck.name}
            </p>
            <p
              className={clsx(
                "text-xs",
                selectedTruck.truck.status === "operativo"
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              Estado: {selectedTruck.truck.status}
            </p>
            <p className="text-xs text-zinc-400">Área: {selectedTruck.area}</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between gap-1 mb-1 px-1.5">
          <p className="text-[10px] text-zinc-400 font-bold">
            | {trucksPerArea.length} | ÁREAS
          </p>
          <p className="text-[10px] text-zinc-400 font-bold">
            CAMIONES | {totalTrucksInAreas} |
          </p>
        </div>

        <div className="flex flex-col gap-1 bg-black/70 rounded-lg pt-2.5 px-2">
          {visibleAreas.map((area, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-1 hover:bg-white/20 cursor-pointer select-none"
            >
              <div className="flex items-center gap-1">
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ backgroundColor: area.color }}
                ></span>

                <p
                  className="text-[11px] font-bold leading-none"
                  style={{ color: area.color }}
                >
                  {area.area}
                </p>
              </div>

              <div className="flex gap-1">
                <p
                  className={clsx(
                    "text-[11px] text-amber-400 leading-none",
                    area.online === 0 && "opacity-50"
                  )}
                >
                  {area.online}
                </p>
                <p
                  className={clsx(
                    "text-[11px] text-zinc-500 leading-none",
                    area.offline === 0 && "opacity-50"
                  )}
                >
                  {area.offline}
                </p>
              </div>
            </div>
          ))}

          {trucksPerArea.length > VISIBLE_COUNT && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] text-zinc-400 hover:text-white transition-colors py-1.5 self-center"
            >
              {showAll ? "- Ver menos" : "+ Ver más"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
