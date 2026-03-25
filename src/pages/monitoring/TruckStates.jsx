
import { columns } from "@/components/Monitoring/TruckStates/TruckStatesColumns";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { useMemo } from "react";

// Helper para normalizar MACs (convierte XX-XX-XX a XX:XX:XX y a mayúsculas)
const normalizeMac = (mac) => {
  return String(mac || "").trim().toUpperCase().replace(/-/g, ":");
};

export default function TruckStates() {
  // 1. Fetch de Catálogo de Beacons
  const { data: beacons = [] } = useFetchData("beacon", "beacons", { 
    useSecondary: true,
    staleTime: Infinity,
  });

  // 2. Crear Diccionario (Lookup Table)
  const beaconsMap = useMemo(() => {
    const map = new Map();
    beacons.forEach((beacon) => {
      if (beacon.mac) {
        map.set(normalizeMac(beacon.mac), beacon.nombre);
      }
    });
    return map;
  }, [beacons]);

  // 3. Función para resolver el nombre de la ubicación
  const resolveLocation = useMemo(() => (id) => {
    if (!id || id === "—") return "—";
    const normalizedId = normalizeMac(id);
    return beaconsMap.get(normalizedId) || id;
  }, [beaconsMap]);

  // 4. Fetch de Resumen (Refresco cada 10 segundos)
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("truck-states", "truck-states/summary", { 
    useSecondary: true,
    refetchInterval: 10000, 
  });

  // 5. Enriquecer datos con nombres de ubicación (Pre-procesado)
  const enhancedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      currentLocationName: resolveLocation(item.currentBeacon || item.odometer),
      previousLocationName: resolveLocation(item.previousBeacon || item.description),
    }));
  }, [data, resolveLocation]);

  return (
    <>
      <PageHeader
        title="Estados del camión"
        description="Resumen por camión: tag, estatus online/offline (datos recientes con tolerancia de 10 s), ubicación actual y anterior."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
      />

      <DataTable
        data={enhancedData}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"truck-states"}
        isLoading={isLoading}
      />
    </>
  );
}
