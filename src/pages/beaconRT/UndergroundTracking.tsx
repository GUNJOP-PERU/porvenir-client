import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Circle,
  ImageOverlay,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import TimeAgo from "timeago-react";
// Api
import { useFetchData } from "@/hooks/useGlobalQueryV2";
// Types
import type { BeaconTruckStatus } from "@/types/Beacon";
// Data
import SearchTruck from "@/components/Dashboard/Tracking/SearchTruck";
import { ubicationDataSub } from "./UbicationLocation";
import Legend from "@/components/Dashboard/Tracking/Legend";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFecha } from "@/lib/utilsGeneral";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapControls = ({
  selectedTruckPosition,
}: {
  selectedTruckPosition: [number, number] | null;
}) => {
  const map = useMap();
  const lastPositionRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (
      selectedTruckPosition &&
      (!lastPositionRef.current ||
        lastPositionRef.current[0] !== selectedTruckPosition[0] ||
        lastPositionRef.current[1] !== selectedTruckPosition[1])
    ) {
      map.setView(selectedTruckPosition, 17.3, {
        animate: true,
        duration: 1.5,
      });

      lastPositionRef.current = [...selectedTruckPosition] as [number, number];
    }
  }, [selectedTruckPosition, map]);

  return null;
};

const UndergroundTracking = () => {
  const [selectedTruck, setSelectedTruck] = useState<{
    truck: BeaconTruckStatus;
    area: string;
    position: [number, number];
  } | null>(null);
  const [selectedTruckPosition, setSelectedTruckPosition] = useState<
    [number, number] | null
  >(null);

  const mapConfig = useMemo(
    () => ({
      centerLat: -13.07925, // Centro del mapa al cargar
      centerLng: -75.9921, // Centro del mapa al cargar
      imageCenterLat: -13.079444, // Centro de la imagen
      imageCenterLng: -75.991944, // Centro de la imagen
      imageUrl: "/sub.svg",
      imageScale: 0.002592, // Antes: 0.005184 * 0.5
      imageWidth: 0.004536, // Antes: 0.009072 * 0.5
      imageHeight: 0.002592, // Antes: 0.005184 * 0.5
      opacity: 0.6,
      zoom: 17.8,
    }),
    []
  );

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useFetchData<BeaconTruckStatus[]>("beacon-truck-map", "beacon-truck", {
    refetchInterval: 2000,
  });

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const timeAgo = dayjs().subtract(2, "minute");
    const ubications = [
      "Int-BC-1820",
      "Ext-BC-1820",
      "Ext-BC-1800",
      "Int-BC-1800",
      "Int-BC-1875",
      "Ext-BC-1875",
      "Int-BC-1910",
      "Ext-BC-1910",
      "Int-BC-1830",
      "Ext-BC-1830",
      "Parrilla 1",
      "Parrilla 2",
      "Pocket 3",
    ];

    return data.filter((truck) => {
      if (!truck.lastDate) return false;

      if (truck.direction?.toLowerCase() === "salida") return false;
      const lastUpdate = dayjs(truck.lastDate);
      if (!ubications.includes(truck.lastUbication)) return false;

      if (lastUpdate.isBefore(timeAgo)) return false;
      return true;
    });
  }, [data]);

  const handleSelectTruck = useCallback((truck: BeaconTruckStatus) => {
    const foundUbication = ubicationDataSub.find((u) =>
      u.mac.some(
        (mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase()
      )
    );

    setSelectedTruck({
      truck,
      area: foundUbication ? foundUbication.name : "",
      position: foundUbication
        ? [foundUbication.position.latitud, foundUbication.position.longitud]
        : [0, 0],
    });

    // El zoom sigue funcionando porque mantienes este estado aparte
    if (foundUbication) {
      setSelectedTruckPosition([
        foundUbication.position.latitud,
        foundUbication.position.longitud,
      ]);
    }
  }, []);

  const createCustomIcon = useCallback(
    (
      status: string,
      unitName: string,
      isSelected: boolean = false,
      lastDate: string
    ) => {
      const statusColors: Record<string, string> = {
        operativo: "#16a34a",
        mantenimiento: "#F59E0B",
        inoperativo: "#EF4444",
      };

      const color = statusColors[status.toLowerCase()];

      return L.divIcon({
        html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <!-- Icono  -->
          <div class="${
            isSelected ? "truck-inner marker-highlight" : "truck-inner"
          }" style="
            background-color: ${color};
            width: 1.8rem;
              height: 1.8rem;
            border-radius: 50%;
            border: 2px solid #00000050;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            position: relative;
          ">
            <span style="
             z-index: 2;
              color: white;
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 0.9rem;
              font-weight: bold;
              white-space: nowrap;
              text-align: center;
              line-height: .9rem;
            ">
              ${unitName}
            </span>
            
          </div>
        </div>
      `,
        className: "custom-truck-icon-with-label",
        iconSize: [25, 25],
        iconAnchor: [12.5, 20],
        popupAnchor: [0, -20],
      });
    },
    []
  );

  const markers = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const coordMap = new Map<string, any[]>();
    filteredData.forEach((truck) => {
      const findBeacon = ubicationDataSub.find((beacon) =>
        beacon.mac.some(
          (mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase()
        )
      );
      const coord = findBeacon?.position || { latitud: 0, longitud: 0 };
      const key = `${coord.latitud},${coord.longitud}`;
      if (!coordMap.has(key)) coordMap.set(key, []);
      // Extraer solo el número después del segundo guión
      const truckNameParts = truck.name.split("-");
      const displayName =
        truckNameParts.length > 2 ? truckNameParts[2] : truck.name;
      coordMap.get(key)!.push({ ...truck, coordinates: coord, displayName });
    });

    const result: JSX.Element[] = [];

    coordMap.forEach((trucks, key) => {
      const [latRaw, lngRaw] = key.split(",").map((v) => Number(v ?? "0"));
      const lat = !isNaN(latRaw || 0) ? latRaw : 0;
      const lng = !isNaN(lngRaw || 0) ? lngRaw : 0;
      const count = trucks.length;
      const perRow = 4;
       const offsetX = 0.00020;
      const offsetY = 0.00020;

      trucks.forEach((truck, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        // Centrar la fila y columna
        const adjustY = 0.00009;
        const startCol = -((Math.min(perRow, count) - 1) / 2);
        const startRow = -((Math.ceil(count / perRow) - 1) / 2);
        const newLat = (lat || 0) + (startRow + row) * offsetY - adjustY;
        const newLng = (lng || 0) + (startCol + col) * offsetX;
        result.push(
          <Marker
            key={`${truck.name}-${i}-${lat}-${lng}`}
            position={[newLat, newLng]}
            icon={createCustomIcon(
              truck.status,
              truck.displayName || truck.name,
              selectedTruck?.truck.name === truck.name,
              truck.connectivity
            )}
          >
            <Popup>
              <div className="text-sm max-w-xs space-y-3 select-none">
                <div className="flex items-center gap-2 justify-start">
                  <div className=" bg-zinc-100 rounded-lg w-12 h-12 flex flex-col items-center justify-center gap-[1px] ">
                    <span className="text-[9px] text-blue-700 font-bold leading-none">
                      CAM
                    </span>
                    <span className="font-black text-2xl text-blue-700 leading-none">
                      {truck.displayName || truck.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`px-2 py-1.5 rounded-lg text-xs leading-3 font-extrabold uppercase line-clamp-2  max-w-[120px] text-center ${
                        truck.status.toLowerCase().includes("operativo")
                          ? "bg-green-100 text-green-800"
                          : truck.status
                              .toLowerCase()
                              .includes("mantenimiento") ||
                            truck.status
                              .toLowerCase()
                              .includes("inoperativo") ||
                            truck.status.toLowerCase().includes("demora")
                          ? "bg-[#ff758f] text-white"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {truck.status === "operativo"
                        ? "Operativo"
                        : truck.status === "inoperativo"
                        ? "Mantenimiento Correctivo"
                        : truck.status === "mantenimiento"
                        ? "Mantenimiento Preventivo"
                        : truck.status}
                    </span>
                    <span
                      className={clsx(
                        "text-[9px] leading-3 font-semibold",
                        truck.connectivity === "online"
                          ? "text-amber-400"
                          : "text-zinc-500"
                      )}
                    >
                      {truck.connectivity}{" "}
                      {truck.lastDate &&
                      !isNaN(new Date(truck.lastDate).getTime()) ? (
                        <TimeAgo datetime={truck.lastDate} locale="es" />
                      ) : (
                        "----"
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-200 flex flex-col text-sm pt-3">
                  <span className="text-zinc-700 font-bold leading-none">
                    Inicio:{" "}
                    <b className="uppercase font-extrabold">
                      {formatFecha(truck.changeStatusDate)}
                    </b>
                  </span>
                  <span className="text-xs text-zinc-500 italic font-bold leading-none">
                    Desde {dayjs(truck.changeStatusDate).fromNow()}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      });
    });
    return result;
  }, [data, createCustomIcon, ubicationDataSub, selectedTruck]);

  const routeComponents = () => {
    const components: React.JSX.Element[] = [];

    ubicationDataSub.forEach((ubication) => {
      const color = ubication.color ? ubication.color : "#0EB1D2";
      const position = [
        ubication.position.latitud,
        ubication.position.longitud,
      ] as [number, number];

      components.push(
        <Circle
          key={`route-circle-${ubication.id}`}
          center={position}
          radius={60}
          pathOptions={{
            color: color,
            fillColor: "black",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.5,
            dashArray: "1, 1",
          }}
        />
      );

      components.push(
        <Marker
          key={`label-${ubication.id}`}
          position={[position[0] + 0.0005, position[1]]}
          icon={L.divIcon({
            html: `
              <div style="
                white-space: nowrap;
                display: flex;
                gap: 5px;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color:${color};
                color: #ffffff0;
                padding: 2px 6px 2px 2px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-weight: bold;
                line-height: 0.8rem;
              ">
              <span style="
                background: #ffffff80;
                color: #ffffff0;
               padding: 2px 4px;
                border-radius: 4px; 
               font-size: 0.8rem;
              font-weight: bold;
              line-height: 0.8rem;                            
              ">
                ${
                  filteredData.filter(
                    (truck) =>
                      truck.lastUbicationMac &&
                      ubication.mac.some(
                        (mac) =>
                          mac.toLowerCase() ===
                          truck.lastUbicationMac.toLowerCase()
                      )
                  ).length
                }
              </span>
              ${ubication.description}
              </div>
            `,
            className: "geofence-label",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
        ></Marker>
      );
    });
    return components;
  };

  // Memoizar el componente del mapa
  const MapaCamiones = useMemo(() => {
    const {
      centerLat,
      centerLng,
      zoom,
      imageUrl,
      imageWidth,
      imageHeight,
      opacity,
      imageCenterLat,
      imageCenterLng,
    } = mapConfig;

    const imageBounds: [[number, number], [number, number]] = [
      [imageCenterLat - imageHeight, imageCenterLng - imageWidth],
      [imageCenterLat + imageHeight, imageCenterLng + imageWidth],
    ];

    return (
      <div className="h-full w-full">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          minZoom={17}
          maxZoom={19}
          zoomControl={false}
          style={{ height: "100%", width: "100%", backgroundColor: "#000000" }}
          className="z-0"
          attributionControl={false}
          zoomSnap={0.1}
          zoomDelta={0.1}
        >
          <ImageOverlay
            url={imageUrl}
            bounds={imageBounds}
            opacity={opacity || 1}
            zIndex={1000}
          />

          <ZoomControl position="bottomleft" />
          {routeComponents()}

          {markers}
          <MapControls selectedTruckPosition={selectedTruckPosition} />
        </MapContainer>
      </div>
    );
  }, [routeComponents, markers]);

  const filteredDataRute = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const ubications = [
      "Int-BC-1820",
      "Ext-BC-1820",
      "Ext-BC-1800",
      "Int-BC-1800",
      "Int-BC-1875",
      "Ext-BC-1875",
      "Int-BC-1910",
      "Ext-BC-1910",
      "Int-BC-1830",
      "Ext-BC-1830",
      "Parrilla 1",
      "Parrilla 2",
      "Pocket 3",
    ];

    const twentyMinutesAgo = dayjs().subtract(2, "minute");

    return data
      .filter((truck) => {
        if (!truck.lastDate) return false;
        const lastUpdate = dayjs.utc(truck.lastDate);
        const tooOld = lastUpdate.isBefore(twentyMinutesAgo);

        return (
          truck.status?.toLowerCase() === "operativo" &&
          (truck.direction?.toLowerCase() === "entrada" ||
            truck.direction?.toLowerCase() === "-") &&
          ubications.includes(truck.lastUbication) &&
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
    <div
      className="h-full w-full relative"
      style={{ backgroundColor: "#000000" }}
    >
      {MapaCamiones}
      <SearchTruck
        data={filteredData}
        onTruckSelect={handleSelectTruck}
        selectedTruck={selectedTruck}
        isLoading={isLoading}
        ubicationData={ubicationDataSub}
      />
      <Legend data={data} />
      <div className="absolute bottom-2 right-2 bg-black/75 rounded-xl p-2 z-10 w-40 border border-zinc-800 space-y-1 flex flex-col select-none">
         <div className="text-green-500 font-extrabold text-[10px] flex items-center gap-1">
          <div className="bg-green-900 p-[2px] rounded-[5px] w-[18px] h-[18px] font-bold text-green-400 flex items-center justify-center">
            {filteredDataRute.length}
          </div>{" "}
          EN RUTA
        </div>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto custom-scrollbar p-0.5">
          {filteredDataRute.map((truck) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  key={truck.name}
                  className={clsx(
                    " flex items-center justify-center px-1 py-0.5  rounded-lg select-none cursor-pointer outline outline-1 outline-offset-1 outline-transparent hover:outline-white/80 ease-in-out duration-300",
                    {
                      "bg-red-500": truck.status === "inoperativo",
                      "bg-[#16a34a]": truck.status === "operativo",
                      "bg-[#f59e0b]": truck.status === "mantenimiento",
                    }
                  )}
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
                side="top"
                className="bg-black text-[11px] px-3 py-2.5 rounded-xl max-w-[200px] shadow-none flex flex-col gap-1 leading-none font-semibold border border-zinc-600"
              >
                <span className="text-zinc-300">
                | {truck.name.split("-").pop()} | Ubicación: {truck.lastUbication}
                </span>
                <div className=" flex flex-col text-sm pt-1">
                  <span className="text-green-300 font-bold leading-none">
                    Inicio:{" "}
                    <b className="uppercase font-extrabold">
                      {formatFecha(truck.changeStatusDate)}
                    </b>
                  </span>
                  <span className="text-xs text-green-400 italic font-bold leading-none">
                    Desde {dayjs(truck.changeStatusDate).fromNow()}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

// ⭐ Estilos CSS para los tooltips de rutas
const routeTooltipStyles = `
  .route-tooltip, .geofence-tooltip, .geofence-label {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    pointer-events: none !important;
  }
  .route-tooltip .leaflet-tooltip-content,
  .geofence-tooltip .leaflet-tooltip-content {
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .route-tooltip::before,
  .geofence-tooltip::before {
    display: none !important;
  }
`;

// ⭐ Inyectar estilos si no existen
if (!document.querySelector("#route-tooltip-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "route-tooltip-styles";
  styleSheet.textContent = routeTooltipStyles;
  document.head.appendChild(styleSheet);
}

export default UndergroundTracking;
