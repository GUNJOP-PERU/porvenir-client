import { useState, useMemo, useEffect } from "react";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { beaconsData } from "@/store/BeaconMac";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
// Components
import { Calendar } from "react-date-range";
import PageHeader from "@/components/PageHeaderV2";
import ExcelExportButton from "@/components/ExcelExportButton";
import { MultiSelect } from "@/components/Configuration/MultiSelect";

const BeaconDetectionTable = () => {
  const [shiftFilter, setShiftFilter] = useState<string>("dia");
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [routeFilter, setRouteFilter] = useState<string[]>([]);

  const {
    data = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useFetchData(
    "beacon-detection",
    `beacon-track?startDate=${format(dateFilter, "yyyy-MM-dd")}&endDate=${format(dateFilter, "yyyy-MM-dd")}${shiftFilter ? `&shift=${shiftFilter}` : ""}`,
  );

  const routeOptions = useMemo(() => {
    const routes = (data || []).map((t) => t.ubication);
    return Array.from(new Set(routes)).sort();
  }, [data]);

  const uniqueUnits = [
    ...new Set(data.map((item) => item.unit).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (unitFilter) {
      filtered = filtered.filter(
        (item) =>
          item.unit &&
          item.unit.toLowerCase().includes(unitFilter.toLowerCase()),
      );
    }

    if (routeFilter.length > 0) {
      filtered = filtered.filter((trip) =>
        routeFilter.includes(trip.ubication),
      );
    }

    return filtered;
  }, [data, unitFilter,routeFilter]);

  // Definición de columnas
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => (
          <div className="text-zinc-400 text-[10px] font-mono">
            #{row.index + 1}
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 60,
      },
      {
        accessorKey: "unit",
        header: "Unidad",
        cell: ({ row }) => (
          <div className="font-medium text-blue-600">
            CAM {row.original.unit.split("-").pop()}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "ubicationType",
        header: "Ubicación Beacon",
        cell: ({ getValue }) => {
          return (
            <div className="font-mono text-sm text-gray-700">{getValue()}</div>
          );
        },
        size: 180,
      },
      {
        accessorKey: "ubication",
        header: "Nombre del Beacon",
        cell: ({ getValue }) => {
          return (
            <div className="font-mono text-sm text-gray-700">{getValue()}</div>
          );
        },
        size: 180,
      },
      {
        accessorKey: "duration",
        header: "Duración (s)",
        cell: ({ getValue }) => {
          const timeInHours = Math.floor(getValue() / 3600);
          const timeInMin = Math.floor(getValue() / 60);
          const timeInSec = getValue() % 60;

          return (
            <div className="text-center font-mono">
              {timeInHours > 0
                ? `${timeInHours}hr ${timeInMin < 60 ? timeInMin : 0}m ${timeInSec}s`
                : timeInMin > 0
                  ? `${timeInMin}min, ${timeInSec}s`
                  : `${timeInSec}s`}
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "wap",
        header: "WAP",
        cell: ({ getValue }) => (
          <div className="text-center font-mono">{getValue()}</div>
        ),
        size: 130,
      },
      {
        accessorKey: "f_inicio",
        header: "Fecha Inicio",
        cell: ({ getValue }) => {
          const timestamp = getValue();
          return (
            <div className="text-sm">
              {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
            </div>
          );
        },
        size: 160,
      },
      {
        accessorKey: "f_final",
        header: "Fecha Final",
        cell: ({ getValue }) => {
          const timestamp = getValue();
          return (
            <div className="text-sm">
              {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
            </div>
          );
        },
        size: 160,
      },
      {
        accessorKey: "createdAt",
        header: "Hora de creación",
        cell: ({ getValue }) => {
          const timestamp = getValue();
          return (
            <div className="text-sm">
              {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
            </div>
          );
        },
        size: 160,
      },
      {
        accessorKey: "updatedAt",
        header: "Hora de Update",
        cell: ({ getValue }) => {
          const timestamp = getValue();
          return (
            <div className="text-sm">
              {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
            </div>
          );
        },
        size: 160,
      },
    ],
    [],
  );

  // Configuración de la tabla
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const [showModal, setShowModal] = useState(false);

  const lastDetections = useMemo(() => {
    const map = new Map();
    data.forEach((item) => {
      const mac = beaconsData.find(
        (b) => b.mac.toLowerCase() === item.mac.toLowerCase(),
      );
      if (
        !map.has(item.unit) ||
        new Date(item.f_final) > new Date(map.get(item.unit).f_final)
      ) {
        map.set(item.unit, { ...item, mac });
      }
    });
    return Array.from(map.values());
  }, [data]);

  useEffect(() => {
    refetch();
  }, [dateFilter, shiftFilter]);

  return (
    <div className="w-full h-full flex flex-col bg-white gap-2">
      <PageHeader
        title="Tabla de detección de beacons"
        description={`Registro de detección de beacons el dia ${format(
          dateFilter,
          "dd-MM-yyyy",
        )}.`}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={false}
        className="col-span-2"
        count={data.length}
        actionsRight={
          <div className="relative flex flex-row gap-2">
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Ruta :
              <div>
                <MultiSelect
                  placeholder={"Selecciona ruta..."}
                  options={routeOptions.map((r) => ({ value: r, label: r }))}
                  value={routeFilter}
                  onChange={setRouteFilter}
                />
              </div>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Unidad
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                <option value="">Todas las unidades</option>
                {uniqueUnits.map((unit, index) => (
                  <option key={index} value={unit}>
                    CAM {unit.split("-").pop()}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Turno:
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                <option value="dia">Turno Día</option>
                <option value="noche">Turno Noche</option>
              </select>
            </label>
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Fecha:
              <button
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                {dateFilter && `${format(dateFilter, "dd/MM/yyyy")}`}
              </button>
            </label>
            {isTooltipOpen && (
              <div className="absolute right-0 top-10 z-[99] mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                <Calendar
                  editableDateInputs={false}
                  onChange={(item) => {
                    setDateFilter(item);
                    setIsTooltipOpen(false);
                  }}
                  date={dateFilter}
                />
              </div>
            )}
            <label className="flex flex-col gap-0.5 text-[12px] font-bold">
              Ultima detección:
              <button
                onClick={() => setShowModal(true)}
                className="text-[12px] font-bold px-2 py-1 bg-white text-black rounded-md hover:bg-gray-100 border border-gray-600"
              >
                Ultima por unidad
              </button>
            </label>
            <ExcelExportButton
              data={data}
              filename="deteccion_beacons"
              sheetName="Resumen Deteccion Beacons"
              disabled={data.length === 0}
            />
          </div>
        }
      />
      <div className="border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl h-[90%] relative overflow-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold mb-4">
                  Última detección por unidad
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-1">#</th>
                      <th className="text-left px-2 py-1">Unidad</th>
                      <th className="text-left px-2 py-1">Ubicación Beacon</th>
                      <th className="text-left px-2 py-1">Fecha Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastDetections
                      .sort((a, b) => a.unit.localeCompare(b.unit))
                      .map((item, idx) => {
                        const isOld =
                          new Date() - new Date(item.f_final) >
                          24 * 60 * 60 * 1000;
                        return (
                          <tr
                            key={idx}
                            className={`border-b ${isOld ? "bg-red-100" : ""}`}
                          >
                            <td className="px-2 py-1 font-bold">{idx + 1}</td>
                            <td className="px-2 py-1 font-bold">
                              CAM {item.unit.split("-").pop()}
                            </td>
                            <td className="px-2 py-1">
                              {item.mac?.location ||
                                (typeof item.mac === "string" ? item.mac : "")}
                            </td>
                            <td className="px-2 py-1">
                              {format(
                                new Date(item.f_final),
                                "dd/MM/yyyy, HH:mm:ss",
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estados de carga */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg font-medium">
              Error al cargar los datos
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      {!isLoading && !isError && (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <tr key={`${headerGroup.id}-${index}`}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={`${header.id}-${index}`}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-2 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {{
                                  asc: " ↑",
                                  desc: " ↓",
                                }[header.column.getIsSorted()] ?? " ↕️"}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={`${row.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={`${cell.id}-${index}`}
                        className="px-4 py-3 whitespace-nowrap text-sm"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  a{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}{" "}
                  de {table.getFilteredRowModel().rows.length} registros
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Anterior
                </button>

                <span className="px-3 py-1 text-sm font-medium">
                  Página {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </span>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  {">>"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BeaconDetectionTable;
