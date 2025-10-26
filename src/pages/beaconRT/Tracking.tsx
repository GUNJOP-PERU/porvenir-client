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
// Api
import { useFetchData } from "@/hooks/useGlobalQueryV2";
// Types
import type { BeaconTruckStatus } from "@/types/Beacon";
// Data
import SearchTruck from "@/components/Dashboard/Tracking/SearchTruck";
import {
  ubicationData,
  rutasEstaticas,
  maintenanceLocation,
  superficieLocation,
  ubicationBocamina,
} from "./UbicationLocation";
import Legend from "@/components/Dashboard/Tracking/Legend";
import Toggle from "@/components/Dashboard/Tracking/Toggle";
import clsx from "clsx";
import Rute from "@/components/Dashboard/Tracking/Rute";
import dayjs from "dayjs";
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

const TruckTracking = () => {
  const [selectedTruck, setSelectedTruck] = useState<{
    truck: BeaconTruckStatus;
    area: string;
    position: [number, number];
  } | null>(null);
  const [selectedTruckPosition, setSelectedTruckPosition] = useState<
    [number, number] | null
  >(null);
  const [toggleStatus, setToggleStatus] = useState({
    showBocaminas: true,
    showWifiZones: true,
    showTalleres: true,
    showDestinations: true,
    showSuperficie: true,
  });

  const mapConfig = useMemo(
    () => ({
      centerLat: -13.0799,
      centerLng: -75.9929,
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
    refetchInterval: 2000,
  });

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const timeAgo = dayjs().subtract(60, "minute");
    const ubications = ["Taller Saturno"];

    return data.filter((truck) => {
      if (!truck.lastDate) return false;

      if (truck.direction?.toLowerCase() === "entrada") return false;
      const lastUpdate = dayjs(truck.lastDate);
      if (
        !ubications.includes(truck.lastUbication) &&
        lastUpdate.isBefore(timeAgo)
      ) {
        return false;
      }
      return true;
    });
  }, [data]);

  const handleSelectTruck = useCallback((truck: BeaconTruckStatus) => {
    const foundUbication = [
      ...ubicationData,
      ...superficieLocation,
      ...maintenanceLocation,
      ...ubicationBocamina,
    ].find((u) => {
      if (!u.mac || !truck.lastUbicationMac) return false;

      return u.mac.some(
        (mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase()
      );
    });

    setSelectedTruck({
      truck,
      area: foundUbication ? foundUbication.name : "",
      position: foundUbication
        ? [foundUbication.position.latitud, foundUbication.position.longitud]
        : [0, 0],
    });

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
        mantenimiento: "#ff758f",
        inoperativo: "#EF4444",
      };

      const color = statusColors[status.toLowerCase()];

      return L.divIcon({
        html: `
          <div style="display:flex; flex-direction:column; align-items:center;">
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
                line-height: .8rem;
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
    if (!Array.isArray(filteredData)) return [];

    const coordMap = new Map<string, any[]>();
    filteredData.forEach((truck) => {
      const findBeacon = [
        ...ubicationData,
        ...superficieLocation,
        ...maintenanceLocation,
        ...ubicationBocamina,
      ].find((beacon) => {
        if (!beacon.mac || !truck.lastUbicationMac) return false;

        return beacon.mac.some(
          (mac) => mac.toLowerCase() === truck.lastUbicationMac.toLowerCase()
        );
      });

      const coord = findBeacon?.position || { latitud: 0, longitud: 0 };
      const key = `${coord.latitud},${coord.longitud}`;
      if (!coordMap.has(key)) coordMap.set(key, []);
      const truckNameParts = truck.name.split("-");
      const displayName =
        truckNameParts.length > 2 ? truckNameParts[2] : truck.name;

      if (findBeacon) {
        coordMap.get(key)!.push({ ...truck, coordinates: coord, displayName });
      }
    });

    const result: JSX.Element[] = [];

    coordMap.forEach((trucks, key) => {
      const [latRawStr, lngRawStr] = key.split(",");

      // Aseguramos que siempre sean strings válidos
      const latRaw = Number(latRawStr ?? "0");
      const lngRaw = Number(lngRawStr ?? "0");

      // Validamos NaN
      const lat = isNaN(latRaw) ? 0 : latRaw;
      const lng = isNaN(lngRaw) ? 0 : lngRaw;
      const count = trucks.length;
      const perRow = 4;
      const offsetX = 0.0003;
      const offsetY = 0.0003;

      trucks.forEach((truck, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        // Centrar la fila y columna
        const adjustY = 0.00009;
        const startCol = -((Math.min(perRow, count) - 1) / 2);
        const startRow = -((Math.ceil(count / perRow) - 1) / 2);
        const newLat = lat + (startRow + row) * offsetY - adjustY;
        const newLng = lng + (startCol + col) * offsetX;
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
  }, [filteredData, createCustomIcon, ubicationData, selectedTruck]);

  const routeComponents = () => {
    const components: React.JSX.Element[] = [];

    rutasEstaticas.forEach((ruta) => {
      components.push(
        <Polyline
          key={ruta.id}
          positions={ruta.positions.map(
            (pos: number[]) => [pos[0], pos[1]] as [number, number]
          )}
          pathOptions={{
            color: ruta.color,
            weight: 5,
            opacity: 0.7,
          }}
        />
      );
    });

    ubicationData.forEach((ubication) => {
      const color = ubication.color ? ubication.color : "#0EB1D2";
      const position = [
        ubication.position.latitud,
        ubication.position.longitud,
      ] as [number, number];

      components.push(
        <Circle
          key={`route-circle-${ubication.id}`}
          center={position}
          radius={80}
          pathOptions={{
            color: color,
            fillColor: "black",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.5,
            dashArray: "16, 4",
          }}
        />
      );

      components.push(
        <Marker
          key={`label-${ubication.id}`}
          position={[position[0] + 0.0008, position[1]]}
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
                background-color: ${color};
                color: #ffffff0;
                padding: 2px 6px 2px 2px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-weight: bold;
                line-height: 0.7rem;
              ">
              <span style="
                background: #FFFFFF85;
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
                      Array.isArray(ubication.mac) &&
                      ubication.mac
                        .map((m) => m.toLowerCase())
                        .includes(truck.lastUbicationMac.toLowerCase())
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

  const superficieLocations = () => {
    const components: React.JSX.Element[] = [];

    superficieLocation.forEach((beacon) => {
      components.push(
        <Circle
          key={`superficie-circle-${beacon.id}`}
          center={[beacon.position.latitud, beacon.position.longitud]}
          radius={40}
          pathOptions={{
            color: "#ccc8af",
            fillColor: "black",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.5,
            dashArray: "16, 4",
          }}
        />
      );
      components.push(
        <Marker
          key={`superficie-label-${beacon.id}`}
          position={[
            beacon.position.latitud - 0.00045,
            beacon.position.longitud,
          ]}
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
                background-color:#ccc8af;
                color: #ffffff0;
                padding: 2px 6px 2px 2px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-weight: bold;
                line-height: 0.8rem;
              ">
              ${beacon.description}
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

  const bocaminaLocations = () => {
    const components: React.JSX.Element[] = [];

    ubicationBocamina.forEach((bocamina) => {
      components.push(
        <Circle
          key={`bocamina-circle-${bocamina.id}`}
          center={[bocamina.position.latitud, bocamina.position.longitud]}
          radius={60}
          pathOptions={{
            color: "#66d20e",
            fillColor: "black",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.5,
            dashArray: "16, 4",
          }}
        />
      );
      components.push(
        <Marker
          key={`bocamina-label-${bocamina.id}`}
          position={[
            bocamina.position.latitud + 0.0005,
            bocamina.position.longitud,
          ]}
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
                background-color:#66d20e;
                color: #ffffff0;
                padding: 2px 6px 2px 2px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-weight: bold;
                line-height: 0.7rem;
              ">
                <span style="
                  background: #FFFFFF85;
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
                        bocamina.mac &&
                        bocamina.mac.some(
                          (mac) =>
                            mac.toLowerCase() ===
                            truck.lastUbicationMac.toLowerCase()
                        )
                    ).length
                  }
                </span>
              ${bocamina.description}
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

  const tallerLocations = () => {
    const components: React.JSX.Element[] = [];

    maintenanceLocation.forEach((taller) => {
      const color = taller.color || "#f3d111";

      const count = filteredData.filter(
        (truck) =>
          truck.lastUbicationMac &&
          Array.isArray(taller.mac) &&
          taller.mac.some(
            (m) => m.toLowerCase() === truck.lastUbicationMac.toLowerCase()
          )
      ).length;

      components.push(
        <Circle
          key={`taller-circle-${taller.id}`}
          center={[taller.position.latitud, taller.position.longitud]}
          radius={120}
          pathOptions={{
            color,
            fillColor: "black",
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.5,
            dashArray: "16, 4",
          }}
        />
      );

      components.push(
        <Marker
          key={`taller-label-${taller.id}`}
          position={[
            taller.position.latitud - 0.0011,
            taller.position.longitud,
          ]}
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
                background-color: ${color};
                color: #ffffff0;
                padding: 2px 6px 2px 2px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-weight: bold;
                line-height: 0.8rem;
          ">
            <span style="
              background: #ffffff85;
              color: #fffff;
              padding: 2px 5px;
              border-radius: 4px; 
              font-size: 0.8rem;
              font-weight: bold;
              line-height: 0.8rem;                            
            ">
              ${count}
            </span>
            ${taller.description}
          </div>
        `,
            className: "geofence-label",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
        />
      );
    });

    return components;
  };

  const MapaCamiones = useMemo(() => {
    const { centerLat, centerLng, zoom } = mapConfig;

    return (
      <div className="h-full w-full">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          minZoom={16.5}
          maxZoom={17.4}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          attributionControl={false}
          zoomSnap={0.1}
          zoomDelta={0.1}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <ZoomControl position="bottomleft" />
          {toggleStatus.showDestinations && routeComponents()}
          {toggleStatus.showTalleres && tallerLocations()}
          {toggleStatus.showSuperficie && superficieLocations()}
          {toggleStatus.showBocaminas && bocaminaLocations()}
          {markers}

          <MapControls selectedTruckPosition={selectedTruckPosition} />
        </MapContainer>
      </div>
    );
  }, [routeComponents, tallerLocations, bocaminaLocations, markers]);

  return (
    <div className="h-full w-full bg-black relative">
      {MapaCamiones}
      <Legend data={data} />
      <Toggle
        showBocaminas={toggleStatus.showBocaminas}
        showDestinations={toggleStatus.showDestinations}
        showSuperficie={toggleStatus.showSuperficie}
        showTalleres={toggleStatus.showTalleres}
        onToggleBocaminas={(show) =>
          setToggleStatus((prev) => ({ ...prev, showBocaminas: show }))
        }
        onToggleDestinations={(show) =>
          setToggleStatus((prev) => ({ ...prev, showDestinations: show }))
        }
        onToggleTalleres={(show) =>
          setToggleStatus((prev) => ({ ...prev, showTalleres: show }))
        }
      />
      <SearchTruck
        data={filteredData}
        onTruckSelect={handleSelectTruck}
        selectedTruck={selectedTruck}
        isLoading={isLoading}
        ubicationData={ubicationData}
        includeExtraLocations={true}
      />
      <Rute data={data} />
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

export default TruckTracking;
