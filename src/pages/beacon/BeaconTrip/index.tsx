import { useState, useEffect, useMemo } from "react";
import { useFetchData } from "../../../hooks/useGlobalQueryV2";
import { useReactTable, getCoreRowModel, flexRender, getExpandedRowModel } from "@tanstack/react-table";
import type { UnitBeaconDetection } from "@/types/Beacon";
import { validStartRoutes, validEndRoutes } from "./data";

interface BeaconTrip {
  startUbication: string,
  startUbicationName: string,
  endUbication: string,
  endUbicationName: string,
  startTime: number,
  endTime: number,
  detections: UnitBeaconDetection[],
}

const BeaconTripTable = () => {
  const [trips, setTrips] = useState<{
    unit: string,
    trips: {
      startUbication: string,
      startUbicationName: string,
      endUbication: string,
      endUbicationName: string,
      startTime: number,
      endTime: number,
      detections: UnitBeaconDetection[],
    }[]
  }[]>([]);

  const [groupedUnits, setGroupedUnits] = useState<{
    unit: string,
    detection: UnitBeaconDetection[]
  }[]>([]);

  const [filters, setFilters] = useState({
    unit: '',
    startDate: '',
    endDate: ''
  });

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useFetchData<UnitBeaconDetection[]>("beacon-detection", "beacon-track?startDate=2025-09-24&endDate=2025-09-24");

  const tripsByUnit = () => {
    const grouped: Record<string, any[]> = {};
    data.forEach((trip) => {
      if (!grouped[trip.unit]) grouped[trip.unit] = [];
      grouped[trip.unit]?.push(trip);
    });
    setGroupedUnits(Object.entries(grouped).map(([unit, detection]) => ({
      unit,
      detection,
    })))
  };

  const onGroupTripsByUnit = () => {
    const formatedTrips = groupedUnits.map(({ unit, detection }) => {
      const trips : BeaconTrip[] = []

      detection.sort((a, b) => a.f_inicio - b.f_inicio).forEach((beacon,i) => {
        const lastTrip = trips[trips.length - 1];
        const startTrip = validStartRoutes.find(route => route.mac.toLowerCase() === beacon.mac.toLowerCase());
        const endTrip = validEndRoutes.find(route => route.mac.toLowerCase() === beacon.mac.toLowerCase());
        const hour = new Date(beacon.f_inicio).getHours();

        console.log("trips inicio", startTrip, endTrip)

        if(startTrip && beacon.mac.toLowerCase() === "bc:57:29:08:08:26" && ((hour === 7) || (hour === 19)) ) {
          console.log("trips volquetes")
          trips.push({
            startUbication: beacon.mac,
            startUbicationName: startTrip.name,
            endUbication: '',
            endUbicationName: '',
            startTime: beacon.f_inicio,
            endTime: 0,
            detections: [beacon]
          })
          return
        }

        if (endTrip && lastTrip && !Boolean(lastTrip.endUbication)) {
          const validTime = (beacon.f_inicio - lastTrip.startTime)/60000;

          if(validTime > 20 && validTime < 180) {
            if(beacon.mac.toLowerCase() === "bc:57:29:06:02:2f") {
              // Validar si la siguiente detección es la faja
              const validIfFaja = () => {
                if(detection[i + 1]?.mac.toLowerCase() === "bc:57:29:06:02:2c") return detection[i + 1];
                if(detection[i + 2]?.mac.toLowerCase() === "bc:57:29:06:02:2c") return detection[i + 2];
                if(detection[i + 3]?.mac.toLowerCase() === "bc:57:29:06:02:2c") return detection[i + 3];
                return null;
              }
              const faja4 = validIfFaja();

              if(faja4) {
                lastTrip.endUbication = faja4.mac;
                lastTrip.endUbicationName = "Faja 4";
                lastTrip.detections.push(faja4);
                lastTrip.endTime = faja4.f_inicio;

                trips.push({
                  startUbication: faja4.mac,
                  startUbicationName: "Faja 4",
                  endUbication: '',
                  endUbicationName: '',
                  startTime: faja4.f_inicio,
                  endTime: 0,
                  detections: [faja4]
                })
                return;
              }
            }

            lastTrip.endUbication = beacon.mac;
            lastTrip.endUbicationName = endTrip.name;
            lastTrip.detections.push(beacon);
            lastTrip.endTime = beacon.f_inicio;

            trips.push({
              startUbication: beacon.mac,
              startUbicationName: endTrip.name,
              endUbication: '',
              endUbicationName: '',
              startTime: beacon.f_inicio,
              endTime: 0,
              detections: [beacon]
            })
          }
        } else if(startTrip?.mac) {
          console.log("trips else", startTrip)
          trips.push({
            startUbication: beacon.mac,
            startUbicationName: startTrip.name,
            endUbication: '',
            endUbicationName: '',
            startTime: beacon.f_inicio,
            endTime: 0,
            detections: [beacon]
          })
        } else if(lastTrip) {
          lastTrip.detections.push(beacon);
        }
      })

      return {
        unit: unit,
        trips: trips.filter((trip) => Boolean(trip.endUbication)),
        detections: detection
      }
    });

    setTrips(formatedTrips);
  }

  useEffect(() => {
    if(data.length > 0) {
      tripsByUnit();
    }
  }, [data]);

  useEffect(() => {
    if(groupedUnits.length > 0) {
      onGroupTripsByUnit();
    }
  }, [groupedUnits]);

  // Tabla jerárquica expandible (unidad → trips → detections)
  const columns = [
    {
      header: "Unidad / Origen / Detección",
      accessorKey: "unit",
      cell: ({ row, getValue }: any) => {
        const padding = row.depth * 20;
        if (row.depth === 0) {
          // Unidad
          return (
            <div style={{ paddingLeft: `${padding}px` }}>
              {row.getCanExpand() && (
                <button onClick={row.getToggleExpandedHandler()} style={{ marginRight: 4 }}>
                  {row.getIsExpanded() ? '▼' : '▶'}
                </button>
              )}
              <b>{getValue()}</b>
            </div>
          );
        }
        if (row.depth === 1) {
          // Trip
          return (
            <div style={{ paddingLeft: `${padding}px` }}>
              {row.getCanExpand() && (
                <button onClick={row.getToggleExpandedHandler()} style={{ marginRight: 4 }}>
                  {row.getIsExpanded() ? '▼' : '▶'}
                </button>
              )}
              Origen: {row.original.startUbicationName}
            </div>
          );
        }
        if (row.depth === 2) {
          // Detection
          return (
            <div style={{ paddingLeft: `${padding}px` }}>
              MAC: {row.original.mac}
            </div>
          );
        }
        return null;
      },
    },
    {
      header: "Destino",
      accessorKey: "endUbicationName",
      cell: ({ row, getValue }: any) => row.depth === 1 ? getValue() : null,
    },
    {
      header: "Inicio",
      accessorKey: "startTime",
      cell: ({ row, getValue }: any) => row.depth === 1 && getValue() ? new Date(getValue()).toLocaleString() : null,
    },
    {
      header: "Fin",
      accessorKey: "endTime",
      cell: ({ row, getValue }: any) => row.depth === 1 && getValue() ? new Date(getValue()).toLocaleString() : null,
    },
    {
      header: "Detecciones",
      accessorKey: "detections",
      cell: ({ row, getValue }: any) => {
        if (row.depth === 1) return getValue()?.length ?? 0;
        if (row.depth === 2) {
          const det = row.original;
          return (
            <span>
              Fecha: {det.f_inicio ? new Date(det.f_inicio).toLocaleString() : ""} | RSSI: {typeof det.rssi === "object" ? JSON.stringify(det.rssi) : det.rssi}
            </span>
          );
        }
        return null;
      },
    },
  ];

  // Estado para la expansión de filas
  const [expanded, setExpanded] = useState({});

  // Memoizar los datos para evitar renders múltiples
  const tableData = useMemo(() =>
    trips.map(unit => ({
      ...unit,
      subRows: unit.trips.map(trip => ({
        ...trip,
        subRows: trip.detections || [],
      })),
    })),
    [trips]
  );

  // Prepara la tabla con datos memoizados
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.subRows,
    state: { expanded },
    onExpandedChange: setExpanded,
  });

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ border: '1px solid #ccc', padding: '4px' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ border: '1px solid #ccc', padding: '4px' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeaconTripTable;