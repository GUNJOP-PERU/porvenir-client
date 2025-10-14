
interface LegendProps {

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

export default function Toggle({

  showBocaminas = true,
  showWifiZones = true,
  showDestinations = true,
  showSuperficie = true,
  showTalleres = true,
  onToggleBocaminas,
  onToggleWifiZones,
  onToggleDestinations,
  onToggleSuperficie,
  onToggleTalleres,
}: LegendProps) {

  return (
    <>

      <div className="space-y-2 text-xs absolute bottom-3 right-12 bg-black/75 rounded-xl py-3 px-4 z-10 select-none">
        {/* Toggle Bocaminas */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#c77dff] w-2 h-2 rounded-full" />
            <span className="text-white text-[11px] font-medium">
              Bocaminas
            </span>
          </div>
          <button
            onClick={() => onToggleBocaminas?.(!showBocaminas)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showBocaminas ? "#c77dff" : "#cfcfcf",
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showBocaminas ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Toggle Red WiFi */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#66d20e] w-2 h-2 rounded-full" />
            <span className="text-white text-[11px] font-medium">Red WiFi</span>
          </div>
          <button
            onClick={() => onToggleWifiZones?.(!showWifiZones)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showWifiZones ? "#66d20e" : "#cfcfcf",
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showWifiZones ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Toggle Superficie */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#ccc8af] w-2 h-2 rounded-full" />
            <span className="text-white text-[11px] font-medium">
              Superficie
            </span>
          </div>
          <button
            onClick={() => onToggleSuperficie?.(!showSuperficie)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showSuperficie ? "#ccc8af" : "#cfcfcf",
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showSuperficie ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Toggle Destinos */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#0EB1D2] w-2 h-2 rounded-full" />
            <span className="text-white text-[11px] font-medium">Destinos</span>
          </div>
          <button
            onClick={() => onToggleDestinations?.(!showDestinations)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showDestinations ? "#0EB1D2" : "#cfcfcf",
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showDestinations ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Toggle Talleres */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#f3d111] w-2 h-2 rounded-full" />
            <span className="text-white text-[11px] font-medium">Talleres</span>
          </div>
          <button
            onClick={() => onToggleTalleres?.(!showTalleres)}
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none"
            style={{
              backgroundColor: showTalleres ? "#f3d111" : "#cfcfcf",
            }}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                showTalleres ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
