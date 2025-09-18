import { useState, useMemo, useEffect, useCallback } from "react";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { beaconsData } from "@/store/BeaconMac";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";

const BeaconDetectionTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Filtros personalizados
  const [filters, setFilters] = useState({
    unit: '',
    startDate: '',
    endDate: ''
  });

  const [filteredData, setFilteredData] = useState([]);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useFetchData("beacon-detection", "beacon-track");

  // Obtener lista única de unidades para el filtro
  const uniqueUnits = [...new Set(data.map(item => item.unit).filter(Boolean))];

  // Función para aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = [...data];

    // Filtro por unidad
    if (filters.unit) {
      filtered = filtered.filter(item => 
        item.unit && item.unit.toLowerCase().includes(filters.unit.toLowerCase())
      );
    }

    // Filtro por fecha de inicio
    if (filters.startDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.f_inicio);
        const startDate = new Date(filters.startDate);
        return itemDate >= startDate;
      });
    }

    // Filtro por fecha de fin
    if (filters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.f_final);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Incluir todo el día
        return itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [data, filters]);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      unit: '',
      startDate: '',
      endDate: ''
    });
  };

  // Definición de columnas
  const columns = useMemo(() => [
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
      cell: ({ getValue }) => (
        <div className="font-medium text-blue-600">
          {getValue()}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "mac",
      header: "Ubicación Beacon",
      cell: ({ getValue }) => {
        const mac = beaconsData.find(b => b.mac.toLowerCase() === getValue().toLowerCase());
        return (
          <div className="font-mono text-sm text-gray-700">
            {mac ? mac.location : getValue()}
          </div>
        )
      },
      size: 180,
    },
    {
      accessorKey: "mac",
      header: "Nombre del Beacon",
      cell: ({ getValue }) => {
        const mac = beaconsData.find(b => b.mac.toLowerCase() === getValue().toLowerCase());
        return (
          <div className="font-mono text-sm text-gray-700">
            {mac ? mac.description : getValue()}
          </div>
        )
      },
      size: 180,
    },
    {
      accessorKey: "connection",
      header: "Estado",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            status === 'online' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status === 'online' ? 'En línea' : 'Desconectado'}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "duration",
      header: "Duración (s)",
      cell: ({ getValue }) => (
        <div className="text-center font-mono">
          {getValue()}s
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "distance",
      header: "Distancia (m)",
      cell: ({ getValue }) => (
        <div className="text-center font-mono text-purple-600">
          {getValue()?.toFixed(2)}m
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: "rssi_mean",
      header: "RSSI Promedio",
      cell: ({ getValue }) => (
        <div className="text-center font-mono">
          {getValue().toFixed(2)} dBm
        </div>
      ),
      size: 130,
    },
    // {
    //   accessorKey: "rssi_min",
    //   header: "RSSI Min",
    //   cell: ({ getValue }) => (
    //     <div className="text-center font-mono text-red-600">
    //       {getValue()} dBm
    //     </div>
    //   ),
    //   size: 100,
    // },
    // {
    //   accessorKey: "rssi_max",
    //   header: "RSSI Max",
    //   cell: ({ getValue }) => (
    //     <div className="text-center font-mono text-green-600">
    //       {getValue()} dBm
    //     </div>
    //   ),
    //   size: 100,
    // },
    // {
    //   accessorKey: "rssi",
    //   header: "Lecturas RSSI",
    //   cell: ({ getValue }) => {
    //     const rssiData = getValue() || [];
    //     return (
    //       <div className="text-xs space-y-1 max-w-48">
    //         {rssiData.slice(0, 30).map((reading, index) => (
    //           <div key={index} className="flex justify-between bg-gray-50 px-2 py-1 rounded">
    //             <span className="font-mono">{format(new Date(reading.datetime), "HH:mm:ss")}</span>
    //           </div>
    //         ))}
    //         {/* {rssiData.length > 3 && (
    //           <div className="text-gray-400 text-center">
    //             +{rssiData.length - 3} más...
    //           </div>
    //         )} */}
    //       </div>
    //     );
    //   },
    //   size: 200,
    // },
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
    // {
    //   accessorKey: "createdAt",
    //   header: "Hora de creación",
    //   cell: ({ getValue }) => {
    //     const timestamp = getValue();
    //     return (
    //       <div className="text-sm">
    //         {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
    //       </div>
    //     );
    //   },
    //   size: 160,
    // },
    // {
    //   accessorKey: "updatedAt",
    //   header: "Hora de creación",
    //   cell: ({ getValue }) => {
    //     const timestamp = getValue();
    //     return (
    //       <div className="text-sm">
    //         {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
    //       </div>
    //     );
    //   },
    //   size: 160,
    // },
  ], []);

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

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detección de Beacons
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitoreo en tiempo real de dispositivos beacon detectados
              </p>
            </div>
            
            {/* Búsqueda global */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar en todas las columnas..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <svg
                  className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              {/* Badge con total de registros */}
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredData.length} de {data.length} registros
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro de Unidad */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Unidad</label>
                <select
                  value={filters.unit}
                  onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las unidades</option>
                  {uniqueUnits.map((unit, index) => (
                    <option key={index} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de Fecha Inicial */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Fecha Inicial</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtro de Fecha Final */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Fecha Final</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Botón para limpiar filtros */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
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
            <p className="text-red-600 text-lg font-medium">Error al cargar los datos</p>
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-2 ${
                              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {{
                                  asc: ' ↑',
                                  desc: ' ↓',
                                }[header.column.getIsSorted()] ?? ' ↕️'}
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 whitespace-nowrap text-sm"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{' '}
                  de {table.getFilteredRowModel().rows.length} registros
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Anterior
                </button>
                
                <span className="px-3 py-1 text-sm font-medium">
                  Página {table.getState().pagination.pageIndex + 1} de{' '}
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
                  {'>>'}
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