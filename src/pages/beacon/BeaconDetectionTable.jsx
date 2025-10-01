import { useState, useMemo } from "react";
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
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd")
  });

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useFetchData("beacon-detection", `beacon-track?startDate=${filters.startDate}&endDate=${filters.endDate}`);

  const uniqueUnits = [...new Set(data.map(item => item.unit).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filters.unit) {
      filtered = filtered.filter(item => 
        item.unit && item.unit.toLowerCase().includes(filters.unit.toLowerCase())
      );
    }

    return filtered;
  }, [data, filters]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters((val) => ({
      ...val,
      unit: '',
    }));
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
    {
      accessorKey: "wap",
      header: "WAP",
      cell: ({ getValue }) => (
        <div className="text-center font-mono">
          {getValue()}
        </div>
      ),
      size: 130,
    },
    // {
    //   accessorKey: "wap_mac",
    //   header: "WAP MAC",
    //   cell: ({ getValue }) => (
    //     <div className="text-center font-mono">
    //       {getValue()}
    //     </div>
    //   ),
    //   size: 130,
    // },
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
    //   header: "Hora de Update",
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

  const [showModal, setShowModal] = useState(false);

  const lastDetections = useMemo(() => {
    const map = new Map();
    data.forEach(item => {
      const mac = beaconsData.find(b => b.mac.toLowerCase() === item.mac.toLowerCase());
      if (!map.has(item.unit) || new Date(item.f_final) > new Date(map.get(item.unit).f_final)) {
        map.set(item.unit, { ...item, mac });
      }
    });
    return Array.from(map.values());
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="border-b border-gray-200">
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

            {/* Botón para mostrar el modal de últimas detecciones */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver última detección por unidad
              </button>
            </div>
          </div>

          {/* Modal de últimas detecciones */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl h-[90%] relative overflow-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold mb-4">Última detección por unidad</h2>
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
                    {lastDetections.sort((a,b) => a.unit.localeCompare(b.unit)).map((item, idx) => {
                      const isOld = (new Date() - new Date(item.f_final)) > 24 * 60 * 60 * 1000;
                      return (
                        <tr key={idx} className={`border-b ${isOld ? 'bg-red-100' : ''}`}>
                          <td className="px-2 py-1 font-bold">{idx + 1}</td>
                          <td className="px-2 py-1 font-bold">{item.unit}</td>
                          <td className="px-2 py-1">{item.mac?.location || (typeof item.mac === 'string' ? item.mac : '')}</td>
                          <td className="px-2 py-1">{format(new Date(item.f_final), "dd/MM/yyyy, HH:mm:ss")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <tr key={`${headerGroup.id}-${index}`}>
                    {headerGroup.headers.map((header,index) => (
                      <th
                        key={`${header.id}-${index}`}
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