import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotate";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Circle,
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
import type { Beacon, BeaconTruckStatus, BeaconCrudData } from "@/types/Beacon";
// Data
import SearchTruck from "@/components/Dashboard/Tracking/SearchTruck";
import { rutasEstaticas } from "./UbicationLocation";
import clsx from "clsx";
import Rute from "@/components/Dashboard/Tracking/Rute";
import dayjs from "dayjs";
import { formatFecha } from "@/lib/utilsGeneral";
import { MapLocationPicker } from "@/components/Dashboard/Tracking/MapLocationPicker";
import { BeaconModal } from "@/components/Management/Beacon/BeaconModal";
import { deleteDataRequest } from "@/api/api";
import Legend from "@/components/Dashboard/Tracking/Legend";
import { ZoneModal } from "@/components/Dashboard/Tracking/ZoneModal";
import IconArrow from "@/icons/IconArrow";
import { ArrowLeft, Crosshair, Plus } from "lucide-react";

// Extender tipos para leaflet-rotate
declare module "react-leaflet" {
  interface MapContainerProps {
    rotate?: boolean;
    touchRotate?: boolean;
    rotateControl?: {
      closeOnZeroBearing?: boolean;
      position?: string;
    };
    bearing?: number;
  }
}

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

type MapMode = "idle" | "create" | "move";

const TruckTracking = () => {
  const [newBeaconPosition, setNewBeaconPosition] =
    useState<BeaconCrudData | null>(null);
  //createBeacon
  const [openCreateBeacon, setOpenCreateBeacon] = useState(false);
  //editBeacon
  const [editingBeacon, setEditingBeacon] = useState<Beacon | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("idle");
  const [beaconMenuOpen, setBeaconMenuOpen] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
      centerLat: -10.6078,
      centerLng: -76.2085,
    }),
    [],
  );

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useFetchData<BeaconTruckStatus[]>(
    "beacon-truck-map",
    "beacon-truck",
    undefined,
    {
      refetchInterval: 3000,
    },
  );

  const {
    data: dataZones = [],
    isLoading: isLoadingBeacons,
    error: errorBeacons,
    refetch: refetchBeacons,
  } = useFetchData<Beacon[]>(
    "zone-superficie",
    "zone?type=superficie",
    undefined,
    {},
  );

  const beaconByMac = useMemo(() => {
    const map = new Map<string, Beacon>();

    dataZones.forEach((beacon: Beacon) => {
      if (!beacon.mac || !Array.isArray(beacon.mac)) return;
      beacon.mac.forEach((mac) => {
        map.set(mac.toLowerCase(), beacon);
      });
    });

    return map;
  }, [dataZones]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const timeAgo = dayjs().subtract(2, "minute");
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

  const trucksByBeacon = useMemo(() => {
    const map = new Map<string, number>();

    filteredData.forEach((truck) => {
      if (!truck.lastUbicationMac) return;

      const beacon = beaconByMac.get(truck.lastUbicationMac.toLowerCase());
      if (!beacon) return;

      map.set(beacon._id, (map.get(beacon._id) || 0) + 1);
    });

    return map;
  }, [filteredData, beaconByMac]);

  const handleSelectTruck = useCallback(
    (truck: BeaconTruckStatus) => {
      if (!truck.lastUbicationMac) return;

      const beacon = beaconByMac.get(truck.lastUbicationMac.toLowerCase());

      if (!beacon) return;

      setSelectedTruck({
        truck,
        area: beacon.description,
        position: [beacon.position.latitud, beacon.position.longitud],
      });

      setSelectedTruckPosition([
        beacon.position.latitud,
        beacon.position.longitud,
      ]);
    },
    [beaconByMac],
  );

  const createCustomIcon = useCallback(
    (
      status: string,
      unitName: string,
      isSelected: boolean = false,
      lastDate: string,
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
            <div class="${isSelected ? "truck-inner marker-highlight" : "truck-inner"
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
    [],
  );

  const markers = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];

    const coordMap = new Map<string, any[]>();
    filteredData.forEach((truck) => {
      // 1️⃣ Resolver beacon
      if (!truck.lastUbicationMac) return;

      const beacon = beaconByMac.get(truck.lastUbicationMac.toLowerCase());

      if (!beacon) return;

      // 2️⃣ Coordenadas válidas
      const coord = beacon.position;
      const key = `${coord.latitud},${coord.longitud}`;

      // 3️⃣ Inicializar grupo
      if (!coordMap.has(key)) {
        coordMap.set(key, []);
      }

      // 4️⃣ Nombre corto
      const match = truck.name.match(/\d+/);
      const displayName = match ? match[0] : truck.name;

      // 5️⃣ Agregar al grupo
      coordMap.get(key)!.push({
        ...truck,
        coordinates: coord,
        displayName,
      });
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
              truck.connectivity,
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
                      className={`px-2 py-1.5 rounded-lg text-xs leading-3 font-extrabold uppercase line-clamp-2  max-w-[120px] text-center ${truck.status.toLowerCase().includes("operativo")
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
                          : "text-zinc-500",
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
                    {truck.status.toLowerCase().includes("mantenimiento")
                      ? "En taller "
                      : "Operativo "}
                    {dayjs(truck.changeStatusDate).fromNow()}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>,
        );
      });
    });
    return result;
  }, [filteredData, createCustomIcon, selectedTruck, beaconByMac]);

  const routeComponents = useMemo(() => {
    return rutasEstaticas.map((ruta) => (
      <Polyline
        key={ruta.id}
        positions={ruta.positions.map(
          (pos) => [pos[0], pos[1]] as [number, number],
        )}
        pathOptions={{
          color: ruta.color,
          weight: 5,
          opacity: 0.7,
        }}
      />
    ));
  }, []);

  const handleDeleteBeacon = useCallback(
    async (beacon: Beacon) => {
      if (!window.confirm(`¿Eliminar el beacon "${beacon.description}"?`)) {
        return;
      }

      try {
        const response = await deleteDataRequest(`zone/${beacon._id}`);

        if (response?.status === 200) {
          console.log("Zona eliminada correctamente");
          refetchBeacons();
        } else {
          throw new Error("Error al eliminar");
        }
      } catch (error) {
        console.error("Error al eliminar zona:", error);
      } finally {
        setBeaconMenuOpen(null);
      }
    },
    [refetchBeacons],
  );

  const renderBeacons = useCallback(() => {
    return dataZones.map((beacon: Beacon) => {
      const count = trucksByBeacon.get(beacon._id) || 0;
      const color = beacon.color || "#999";
      const radius = beacon.radius || 60;
      const radiusInDegrees = radius / 111320;

      const labelPosition: [number, number] = [
        beacon.position.latitud + radiusInDegrees,
        beacon.position.longitud,
      ];

      const isMenuOpen = beaconMenuOpen === beacon._id;

      return (
        <Fragment key={beacon._id}>
          <Circle
            interactive={true}
            eventHandlers={{
              click: () => {
                if (!isEditMode || mapMode !== "idle") return;
                setBeaconMenuOpen(beacon._id);
              },
            }}
            center={[beacon.position.latitud, beacon.position.longitud]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: "black",
              weight: 2,
              opacity: 0.9,
              fillOpacity: 0.5,
              dashArray: "16,4",
            }}
          />
          <Marker
            interactive={true}
            eventHandlers={{
              click: () => {
                if (!isEditMode || mapMode !== "idle") return;
                setBeaconMenuOpen(beacon._id);
              },
            }}
            position={labelPosition}
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
                  color: black;
                  padding: 2px 6px 2px 2px;
                  border-radius: 5px;
                  font-size: 0.75rem;
                  font-weight: bold;
                  line-height: 0.8rem;
                  text-transform: uppercase;
                  cursor: ${isEditMode && mapMode === "idle" ? "pointer" : "crosshair"};
                  pointer-events: ${isEditMode && mapMode === "idle" ? "auto" : "none"};
                  ${isMenuOpen ? "box-shadow: 2px 2px 2px 4px black;" : ""}
                ">
                  <span style="
                    background: rgba(255,255,255,0.55);
                    color: black;
                    padding: 2px 5px;
                    border-radius: 4px; 
                    font-size: 0.8rem;
                    font-weight: bold;
                    line-height: 0.8rem;                            
                  ">
                    ${count}
                  </span>
                  ${beacon.description}
                </div>
              `,
              className: "geofence-label",
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            })}
          />

          {isEditMode && isMenuOpen && mapMode === "idle" && (
            <Marker
              zIndexOffset={1000}
              position={[
                beacon.position.latitud + radiusInDegrees * 1.5,
                beacon.position.longitud,
              ]}
              icon={L.divIcon({
                html: `
                  <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                    background: #000000bf;
                    border-radius: 10px;
                    padding: 6px;
                    min-width: 100px;
                  " class="beacon-menu-${beacon._id}">
                    <button 
                      data-action="edit"
                      data-beacon-id="${beacon._id}"
                      style="
                        padding: 5px 12px;
                        background: #FFFFFF30;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.75rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.2s;
                      "
                      onmouseover="this.style.background='#FFFFFF30'"
                      onmouseout="this.style.background='#FFFFFF20'"
                    >
                      &#9998 Editar
                    </button>
                    <button 
                      data-action="move"
                      data-beacon-id="${beacon._id}"
                      style="
                          padding: 5px 12px;
                        background: #FFFFFF30;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.75rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.2s;
                      "
                      onmouseover="this.style.background='#FFFFFF30'"
                      onmouseout="this.style.background='#FFFFFF20'"
                    >
                       &#x2629; Mover
                    </button>
                    <button 
                      data-action="delete"
                      data-beacon-id="${beacon._id}"
                      style="
                         padding: 5px 12px;
                        background: #FF000030;
                        color: #ff2056;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.75rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.2s;
                      "
                      onmouseover="this.style.background='#FF000030'"
                      onmouseout="this.style.background='#FF000020'"
                    >
                     &#x2716; Eliminar
                    </button>
                    <button 
                      data-action="close"
                      style="
                        padding: 5px 12px;
                        background: #FFFFFF30;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.75rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.2s;
                      "
                      onmouseover="this.style.background='#FFFFFF30'"
                      onmouseout="this.style.background='#FFFFFF20'"
                    >
                      &#x21A9; Cerrar
                    </button>
                  </div>
                `,
                className: "beacon-context-menu",
                iconSize: [0, 0],
                iconAnchor: [0, 0],
              })}
            />
          )}
        </Fragment>
      );
    });
  }, [
    dataZones,
    trucksByBeacon,
    mapMode,
    beaconMenuOpen,
    isEditMode,
    handleDeleteBeacon,
  ]);

  useEffect(() => {
    const handleMenuClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const action = target.dataset.action;
      const beaconId = target.dataset.beaconId;

      if (!action) return;

      if (action === "close") {
        setBeaconMenuOpen(null);
        return;
      }

      if (!beaconId) return;

      const beacon = dataZones.find((b) => b._id === beaconId);
      if (!beacon) return;

      switch (action) {
        case "edit":
          setEditingBeacon(beacon);
          setOpenCreateBeacon(true);
          setBeaconMenuOpen(null);
          break;

        case "move":
          setEditingBeacon(beacon);
          setMapMode("move");
          setBeaconMenuOpen(null);
          break;

        case "delete":
          handleDeleteBeacon(beacon);
          break;
      }
    };

    document.addEventListener("click", handleMenuClick);
    return () => document.removeEventListener("click", handleMenuClick);
  }, [dataZones]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        beaconMenuOpen &&
        !target.closest(`.beacon-menu-${beaconMenuOpen}`) &&
        !target.closest(".geofence-label")
      ) {
        setBeaconMenuOpen(null);
      }
    };

    if (beaconMenuOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [beaconMenuOpen]);

  return (
    <div className="h-full w-full bg-black relative">
      <div className="h-full w-full">
        <MapContainer
          className="z-0"
          center={[mapConfig.centerLat, mapConfig.centerLng]}
          zoom={16.5}
          minZoom={15}
          maxZoom={18}
          zoomControl={false}
          doubleClickZoom={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          zoomSnap={0.1}
          zoomDelta={0.1}
          rotate={true}
          touchRotate={true}
          rotateControl={{
            closeOnZeroBearing: false,
            position: "bottomleft",
          }}
          bearing={45}
        >
          <TileLayer
            attribution='Offline Mode'
            url="/maps/tiles/{z}/{x}/{y}.png"
          />
          {/* <ZoomControl position="bottomleft" /> */}
          {markers}
          {routeComponents}
          {renderBeacons()}
          <MapControls selectedTruckPosition={selectedTruckPosition} />

          <MapLocationPicker
            enabled={mapMode === "create" || mapMode === "move"}
            position={
              mapMode === "create"
                ? (newBeaconPosition?.position ?? null)
                : (editingBeacon?.position ?? null)
            }
            onSelect={(lat, lng) => {
              if (mapMode === "create") {
                setNewBeaconPosition({
                  position: { latitud: lat, longitud: lng },
                });
                setMapMode("idle");
                setOpenCreateBeacon(true);
              }

              if (mapMode === "move" && editingBeacon) {
                setEditingBeacon({
                  ...editingBeacon,
                  position: { latitud: lat, longitud: lng },
                });
                setMapMode("idle");
                setOpenCreateBeacon(true);
              }
            }}
          />
        </MapContainer>
      </div>
      <ZoneModal
        isOpen={openCreateBeacon}
        onClose={() => {
          setOpenCreateBeacon(false);
          setNewBeaconPosition(null);
          setEditingBeacon(null);
          setMapMode("idle");
        }}
        dataCrud={editingBeacon ?? newBeaconPosition}
        isEdit={!!editingBeacon}
        invalidateKey={["crud", "zone-superficie"]}
        type="superficie"
      />
      <SearchTruck
        data={dataZones}
        onTruckSelect={handleSelectTruck}
        selectedTruck={selectedTruck}
        isLoading={isLoading}
        includeExtraLocations={true}
        reload={refetchBeacons}
      />
      <Legend data={data} />
      <Rute data={data} />

      <button
        onClick={() => {
          setIsEditMode(true); // solo muestra UI
          setMapMode("idle"); // NO crea nada
          setEditingBeacon(null);
        }}
        className="absolute bottom-12 left-2.5 z-50 size-[34px] rounded-lg shadow bg-primary text-white hover:bg-primary/80 flex items-center justify-center"
      >
        <Crosshair className="size-5" />
      </button>

      {
        isEditMode && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            <div className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center pointer-events-none">
              {mapMode === "idle" && "Click en una zona para ver opciones"}
              {mapMode === "create" && "Haz click en el mapa para crear un punto"}
              {mapMode === "move" && "Haz click en el mapa para mover este punto"}
            </div>
            <div className="flex gap-2">
              {mapMode === "idle" && (
                <button
                  onClick={() => {
                    setBeaconMenuOpen(null);
                    setMapMode("create");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ease-in duration-300"
                >
                  <Plus className="size-3" />
                  Crear Nuevo
                </button>
              )}
              {mapMode !== "idle" && (
                <button
                  onClick={() => {
                    setMapMode("idle");
                    setEditingBeacon(null);
                    setNewBeaconPosition(null);
                  }}
                  className="bg-zinc-600 hover:bg-zinc-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ease-in duration-300"
                >
                  <ArrowLeft className="size-3" />
                  Volver Anterior
                </button>
              )}
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setMapMode("idle");
                  setEditingBeacon(null);
                  setNewBeaconPosition(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-all ease-in duration-300"
              >
                Salir
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
};

// ⭐ Estilos CSS para los tooltips de rutas
const routeTooltipStyles = `
  .route-tooltip, .geofence-tooltip {
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
