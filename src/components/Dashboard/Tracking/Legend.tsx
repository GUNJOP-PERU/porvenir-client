import type { BeaconTruckStatus } from "@/types/Beacon";

interface LegendProps {
  data: BeaconTruckStatus[];
  showBocaminas?: boolean;
  showWifiZones?: boolean;
  showDestinations?: boolean;
  showSuperficie?: boolean;
  showTalleres?: boolean;
  onToggleBocaminas?: (show: boolean) => void;
  onToggleWifiZones?: (show: boolean) => void;
  onToggleDestinations?: (show: boolean) => void;
  onToggleSuperficie?: (show: boolean) => void;
  onToggleTalleres?: (show: boolean) => void;
}

export default function Legend({ 
  data = [],
  showBocaminas = true,
  showWifiZones = true,
  showDestinations = true,
  showSuperficie = true,
  showTalleres = true,
  onToggleBocaminas,
  onToggleWifiZones,
  onToggleDestinations,
  onToggleSuperficie,
  onToggleTalleres
}: LegendProps) {
  // Contar cada estado y su connectivity
  const counts = data.reduce(
    (acc, truck) => {
      const status = truck.status?.toLowerCase() ?? "";
      const connectivity = truck.connectivity?.toLowerCase() ?? "";

      const key =
        status.includes("operativo")
          ? "operativo"
          : status.includes("mantenimiento")
          ? "mantenimiento"
          : status.includes("inoperativo")
          ? "inoperativo"
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
    <>
      <div className="space-y-1.5 text-xs absolute bottom-2 left-2 bg-black/75 rounded-xl py-2.5 px-3 z-10 select-none">
        {/* <p className="font-normal text-zinc-300 text-left text-[10px] leading-none">
          Leyenda de camiones
        </p> */}
        <div className="flex justify-between text-white text-[11px] leading-none">
          <div className="flex flex-col items-center">
            <div className="w-full h-[5px] mb-1.5 bg-[#22C55E]"></div>
            <span className="text-[#22C55E] font-bold px-1 capitalize">
              OPERATIVO | {counts.operativo.total} |
            </span>
            <div className="flex gap-1 px-2 mt-1 text-zinc-500 text-[10px]">
              <span className="text-amber-400">En línea: {counts.operativo.online}</span> |{" "}
              <span className="text-zinc-400">Fuera de línea: {counts.operativo.offline}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-[5px] mb-1.5 bg-[#F59E0B]"></div>
            <span className="text-[#F59E0B] font-bold px-1">
              MANTENIMIENTO | {counts.mantenimiento.total} |
            </span>
            <div className="flex gap-1 px-2 mt-1 text-zinc-500 text-[10px]">
              <span className="text-amber-400">En línea: {counts.mantenimiento.online}</span> |{" "}
              <span className="text-zinc-400">Fuera de línea: {counts.mantenimiento.offline}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-[5px] mb-1.5 bg-[#EF4444]"></div>
            <span className="text-[#EF4444] font-bold px-1">
              INOPERATIVO | {counts.inoperativo.total} |
            </span>
            <div className="flex gap-1 px-2 mt-1 text-zinc-500 text-[10px]">
              <span className="text-amber-400">En línea: {counts.inoperativo.online}</span> |{" "}
              <span className="text-zinc-400">Fuera de línea: {counts.inoperativo.offline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs absolute bottom-3 right-12 bg-black/75 rounded-xl py-3 px-4 z-10 select-none">
        {/* Toggle Bocaminas */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#8a0ed2] w-2 h-2 rounded-full"/>
            <span className="text-white text-[11px] font-medium">Bocaminas</span>
          </div>
          <button
            onClick={() => onToggleBocaminas?.(!showBocaminas)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{ 
              backgroundColor: showBocaminas ? '#8a0ed2' : '#cfcfcf' 
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showBocaminas ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle Red WiFi */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#66d20e] w-2 h-2 rounded-full"/>
            <span className="text-white text-[11px] font-medium">Red WiFi</span>
          </div>
          <button
            onClick={() => onToggleWifiZones?.(!showWifiZones)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{ 
              backgroundColor: showWifiZones ? '#66d20e' : '#cfcfcf' 
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showWifiZones ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle Superficie */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#ccc8af] w-2 h-2 rounded-full"/>
            <span className="text-white text-[11px] font-medium">Superficie</span>
          </div>
          <button
            onClick={() => onToggleSuperficie?.(!showSuperficie)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showSuperficie ? '#ccc8af' : '#cfcfcf'
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showSuperficie ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle Destinos */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#0EB1D2] w-2 h-2 rounded-full"/>
            <span className="text-white text-[11px] font-medium">Destinos</span>
          </div>
          <button
            onClick={() => onToggleDestinations?.(!showDestinations)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{ 
              backgroundColor: showDestinations ? '#0EB1D2' : '#cfcfcf' 
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showDestinations ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle Talleres */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#f3d111] w-2 h-2 rounded-full"/>
            <span className="text-white text-[11px] font-medium">Talleres</span>
          </div>
          <button
            onClick={() => onToggleTalleres?.(!showTalleres)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showTalleres ? '#f3d111' : '#cfcfcf'
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showTalleres ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
