import {
  ubicationData,
  maintenanceLocation,
  superficieLocation,
  ubicationBocamina
} from "@/pages/beaconRT/UbicationLocation";
import type { BeaconTruckStatus } from "@/types/Beacon";
import clsx from "clsx";
import { useState, useMemo } from "react";

export default function SearchTruck({
  data,
  onTruckSelect,
  selectedTruck,
  isLoading,
}: {
  data: BeaconTruckStatus[];
  onTruckSelect: (truck: BeaconTruckStatus) => void;
  selectedTruck: {
    truck: BeaconTruckStatus;
    area: string;
    position: [number, number];
  } | null;
  isLoading: boolean;
}) {
  const [query, setQuery] = useState("");

  const trucksPerArea = [...ubicationData, ...ubicationBocamina, ...maintenanceLocation, ...superficieLocation].map((ubication) => {
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

  return (
    <div className="absolute top-2 left-2 bg-black/75 rounded-xl p-4 z-10 flex flex-col gap-3 w-52">
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
          Última actualización
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-zinc-300 leading-none">
          Buscar por unidad
        </label>
        <input
          type="text"
          placeholder="Ej. 16"
          className="w-full h-7 rounded-lg border border-zinc-500 bg-transparent text-white placeholder:text-zinc-400 text-xs px-2 outline-none focus:border-primary transition-all ease-in-out duration-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {filtered.length > 0 && (
          <ul className="bg-black/70 rounded-lg max-h-36 overflow-y-auto text-xs custom-scrollbar">
            {filtered.map((truck) => (
              <li
                key={truck.name}
                className="px-2 py-1 hover:bg-primary/30 cursor-pointer text-zinc-300 hover:text-white rounded-lg"
                onClick={() => {
                  onTruckSelect(truck);
                  setQuery("");
                }}
              >
                {truck.name}
              </li>
            ))}
          </ul>
        )}
        {selectedTruck && (
          <div className=" bg-black/70 text-white p-3 rounded-lg z-10">
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
          <p className="text-[10px] text-sky-300 font-bold">
            | {trucksPerArea.length} | ÁREAS
          </p>
          <p className="text-[10px] text-amber-400 font-bold">
            CAMIONES | {data.length} |
          </p>
        </div>
        <div className="flex flex-col gap-1 bg-black/70 rounded-lg py-2.5 px-2">
          {trucksPerArea.map((area, i) => (
            <div className="flex items-center justify-between gap-1 hover:bg-white/20 cursor-pointer select-none" key={i}>
              <p className="text-[11px] text-[#0EB1D2] leading-none">
                {" "}
                {area.area}{" "}
              </p>
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
        </div>
      </div>
      <div></div>
    </div>
  );
}
