/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import TimeAgo from "timeago-react";
import { subHours, isAfter, parseISO } from "date-fns";
// Api
import { useFetchData } from "@/hooks/useGlobalQueryV2";
// Types
import type { BeaconTruckStatus } from "@/types/Beacon";
// Data
import SearchTruck from "@/components/Dashboard/Tracking/SearchTruck";
import { ubicationDataSub } from "./UbicationLocation";
import Legend from "@/components/Dashboard/Tracking/Legend";

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
    // Solo hacer zoom si la posición ha cambiado
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

      // Actualizar la última posición conocida
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
      centerLat: -13.0786, // Centro del mapa al cargar
      centerLng: -75.992999, // Centro del mapa al cargar
      imageCenterLat: -13.079444, // Centro de la imagen
      imageCenterLng: -75.991944, // Centro de la imagen
      imageUrl: "/sub.svg",
      imageScale: 0.005184,
      imageWidth: 0.009072, // Ancho de la imagen
      imageHeight: 0.005184, // Alto de la imagen
      opacity: 0.6,
      zoom: 17,
    }),
    []
  );

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useFetchData<BeaconTruckStatus[]>("beacon-truck-map", "beacon-truck", {
    refetchInterval: 10000,
  });

  const handleSelectTruck = useCallback((truck: BeaconTruckStatus) => {
    const foundUbication = ubicationDataSub.find(
      (u) => u.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase()
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
      connectivity: string,
      lastDate: string
    ) => {
      let color = "#6B7280"; // Gris por defecto

      const normalizedStatus = status.toLowerCase();

      const isOlderThan5Hours = (() => {
        try {
          if (!lastDate) return true;
          const lastDateTime = parseISO(lastDate);
          const fiveHoursAgo = subHours(new Date(), 5);
          return !isAfter(lastDateTime, fiveHoursAgo);
        } catch {
          return true;
        }
      })();

      if (isOlderThan5Hours) {
        color = "#a0a0a0"; // Gris - Datos antiguos (más de 5 horas)
      } else if (normalizedStatus === "operativo") {
        color = "#22C55E"; // Verde - En movimiento
      } else if (normalizedStatus === "mantenimiento") {
        color = "#F59E0B"; // Amarillo - Detenido
      } else if (normalizedStatus === "inoperativo") {
        color = "#EF4444"; // Rojo - Fuera de línea
      }

      return L.divIcon({
        html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <!-- Icono del camión -->
          <div class="${
            isSelected ? "truck-inner marker-highlight" : "truck-inner"
          }" style="
            background-color: ${color};
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 2px solid #00000050;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            position: relative;
          ">
            <svg style="position: absolute;
            z-index: 1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 20px;
            width: 20px;" stroke="#000000" fill="#00000030" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M102.5 70.4c-.8 0-1.7.1-2.5.22-30.99 5.31-62.08 74.08-72.4 98.98h226.8l11.9-23.9c-12.4-20-35.3-50.36-58.3-49.08-15.1.8-44 33.98-44 33.98s-35.4-60.51-61.5-60.2zm195.1 53.2l-32 64h-79.7l-40.7 95c22 3.3 41.4 14.7 55 31h87.6c4.8-5.8 10.3-10.9 16.4-15.3l28.6-128.7h48.9l16.3-46zM21 187.6v80l13.57 3.5 35.8-83.5zm68.91 0l-37.77 88.1 25.56 6.7 40.6-94.8zm47.99 0L95.28 287l3.7 1c8.42-3.4 17.52-5.6 27.02-6.2l40.3-94.2zm209.3 0l-22.1 99.5c9.6-3.5 20.1-5.5 30.9-5.5 40.3 0 74.6 27.1 85.4 64H491v-80.5l-46.5-15.5-15.5-62h-34.7zm17.8 14h46l12.5 50h-71l10.8-43.2zm-233 98c-39.32 0-71 31.7-71 71s31.68 71 71 71c39.3 0 71-31.7 71-71s-31.7-71-71-71zm224 0c-39.3 0-71 31.7-71 71s31.7 71 71 71 71-31.7 71-71-31.7-71-71-71zm-320.62 32l-12.4 62h23.05c-1.97-7.3-3.03-15.1-3.03-23 0-14 3.25-27.2 9.04-39zm176.62 0c5.7 11.8 9 25 9 39 0 7.9-1.1 15.7-3 23h52c-1.9-7.3-3-15.1-3-23 0-14 3.3-27.2 9-39zm-80 7a32 32 0 0 1 32 32 32 32 0 0 1-32 32 32 32 0 0 1-32-32 32 32 0 0 1 32-32zm224 0a32 32 0 0 1 32 32 32 32 0 0 1-32 32 32 32 0 0 1-32-32 32 32 0 0 1 32-32zm88.7 25c.2 2.3.3 4.6.3 7 0 10.7-1.9 20.9-5.4 30.5l51.4-20.6v-16.9z">
              </path>
            </svg>
            <span style="
             z-index: 2;
              color: white;
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 0.7rem;
              font-weight: bold;
              white-space: nowrap;
              text-align: center;
              width: 25px;           
              line-height: .7rem;
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
    data.forEach((truck) => {
      const findBeacon = ubicationDataSub.find(
        (beacon) =>
          beacon.mac.toLowerCase() === truck.lastUbicationMac.toLowerCase()
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
      const offsetX = 0.00022; // separación horizontal
      const offsetY = 0.00022; // separación vertical

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
              truck.connectivity,
              truck.lastDate
            )}
          >
            <Popup>
              <div className="text-sm max-w-xs space-y-1">
                <div className="flex items-center gap-2 justify-start">
                  <span className="font-black text-xl text-blue-600 px-2 py-1 bg-zinc-100 rounded-md">
                    {truck.displayName || truck.name}
                  </span>
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`px-2 py-[2px] rounded-full text-[9px] leading-3 font-semibold ${
                        truck.status.toLowerCase().includes("operativo")
                          ? "bg-green-100 text-green-800"
                          : truck.status
                              .toLowerCase()
                              .includes("mantenimiento") ||
                            truck.status
                              .toLowerCase()
                              .includes("inoperativo") ||
                            truck.status.toLowerCase().includes("demora")
                          ? "bg-orange-300 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {truck.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 divide-x divide-zinc-200">
                  <span className="text-center w-full">
                    <small>Longitud</small> <br />
                    <strong className="font-mono text-xs">
                      {truck.coordinates.longitud.toFixed(6)}
                    </strong>
                  </span>
                  <span className="text-center w-full">
                    <small>Latitud</small> <br />
                    <strong className="font-mono text-xs">
                      {truck.coordinates.latitud.toFixed(6)}
                    </strong>
                  </span>
                </div>
                <div className="border-t border-zinc-200 pt-2 flex flex-col">
                  <span className="text-[10px] leading-3 font-semibold">
                    Actualizado{" "}
                    {truck.lastDate &&
                    !isNaN(new Date(truck.lastDate).getTime()) ? (
                      <TimeAgo datetime={truck.lastDate} locale="es" />
                    ) : (
                      "----"
                    )}
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
      const position = [
        ubication.position.latitud,
        ubication.position.longitud,
      ] as [number, number];

      const ubicationColor = ubication.color || "#0EB1D2";
      // Primero el círculo
      components.push(
        <Circle
          key={`route-circle-${ubication.id}`}
          center={position}
          radius={50}
          pathOptions={{
            color: ubicationColor,
            fillColor: "black",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.3,
            dashArray: "16, 4",
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
                background-color:${ubicationColor};
                color: #ffffff0;
                padding: 2px 6px 2px 2px;
                border-radius: 5px;
                font-size: 0.7rem;
                font-weight: bold;
                line-height: 0.7rem;
              ">
              <span style="
                background: #ffffff80;
                color: #ffffff0;
               padding: 2px 4px;
                border-radius: 4px; 
               font-size: 0.7rem;
              font-weight: bold;
              line-height: 0.7rem;                            
              ">
                ${
                  data.filter(
                    (truck) =>
                      truck.lastUbicationMac &&
                      truck.lastUbicationMac.toLowerCase() ===
                        ubication.mac.toLowerCase()
                  ).length
                }
              </span>
              ${ubication.name}
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

    // Calcular los bounds de la imagen usando su propio centro
    // [esquina inferior izquierda, esquina superior derecha]
    const imageBounds: [[number, number], [number, number]] = [
      [imageCenterLat - imageHeight, imageCenterLng - imageWidth], // Esquina inferior izquierda
      [imageCenterLat + imageHeight, imageCenterLng + imageWidth], // Esquina superior derecha
    ];

    return (
      <div className="h-full w-full">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          minZoom={17}
          maxZoom={18}
          zoomControl={false}
          style={{ height: "100%", width: "100%", backgroundColor: "#000000" }}
          className="z-0"
          attributionControl={false}
        >
          <ImageOverlay
            url={imageUrl}
            bounds={imageBounds}
            opacity={opacity || 1}
            zIndex={1000}
          />

          <ZoomControl position="bottomright" />
          {routeComponents()}

          {markers}
          {/* {staticMarkersSub.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={createFlagIcon(marker.name, marker.color)}
            />
          ))} */}
          <MapControls selectedTruckPosition={selectedTruckPosition} />
        </MapContainer>
      </div>
    );
  }, [routeComponents, markers]);

  return (
    <div
      className="h-full w-full relative"
      style={{ backgroundColor: "#000000" }}
    >
      {MapaCamiones}
      <SearchTruck
        data={data}
        onTruckSelect={handleSelectTruck}
        selectedTruck={selectedTruck}
        isLoading={isLoading}
        ubicationData={ubicationDataSub}
      />
       <Legend data={data} />    
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
