import { useMemo, useState, useCallback, useEffect } from "react";
import type { BeaconCycle } from "@/types/Beacon";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format } from 'date-fns';

interface UnitTripsTableProps {
  data: BeaconCycle[]
}

const UnitTripTable = ({ data }: UnitTripsTableProps) => {
  const [unitList, setUnitList] = useState<string[]>([]);
  const [sorting, setSorting] = useState<import('@tanstack/react-table').SortingState>([]);
  const [filteredData, setFilteredData] = useState<BeaconCycle[]>([]);
  const [columnFilters, setColumnFilters] = useState<import('@tanstack/react-table').ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    unit: '',
    onlyBocaminas: false,
  });
  const [expanded, setExpanded] = useState({});

  const applyFilters = () => {
    let filtered = [...data];

    if (filters.unit) {
      filtered = filtered.filter(item => 
        item.unit === filters.unit
      );
    }

    if (filters.onlyBocaminas) {
      filtered = filtered.filter(item => item.bocaminaStats.length > 0);
    }

    setFilteredData(filtered);
  };

  const columns = useMemo<ColumnDef<BeaconCycle>[]>(() => [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.getCanExpand() && (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="mr-2 text-blue-600 hover:text-blue-800 text-xs"
            >
              {row.getIsExpanded() ? "▼" : "▶"}
            </button>
          )}
          <span className="text-zinc-400 text-[10px] font-mono">
            #{row.index + 1}
          </span>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 60,
    },
    {
      accessorKey: "unit",
      header: "Unidad",
      cell: ({ getValue }) => getValue()?.toString().toUpperCase(),
      size: 150,
    },
    {
      accessorKey: "totalTrips",
      header: "Total de Viajes",
      size: 150,
    },
    {
      accessorKey: "trips",
      header: "Tiempo Total (hrs)",
      size: 150,
      cell: ({ row }) => {
        const totalDuration = row.original.trips.reduce((acc, trip) => acc + parseFloat(trip.totalDuration), 0)/3600;
        return `${totalDuration.toFixed(2)} hrs`;
      },
    },
    {
      accessorKey: "bocaminaStats",
      header: "Bocaminas Detectadas",
      size: 150,
      cell: ({ row }) => {
        const bocaminas = row.original.bocaminaStats.map(b => b.name).join(", ");
        return bocaminas
      },
    },
    {
      accessorKey: "trips",
      header: "Total de puntos detectados",
      size: 150,
      cell: ({ row }) => {
        const puntos = row.original.trips.reduce((acc, trip) => acc + trip.trip.length, 0);
        return puntos
      },
    },
  ], []);

  useEffect(() => {
    setUnitList(data.map(item => item.unit).sort((a,b) => a.localeCompare(b)));
    applyFilters();
  }, [data]);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getRowCanExpand: (row) => true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      expanded, // Add expanded state
    },
    onExpandedChange: setExpanded, // Handle expanded state changes
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 p-4 rounded-lg">
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
              {unitList.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Solo Bocaminas */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
              <span className="mr-2">Solo Bocaminas</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out transform checked:translate-x-4"
                  checked={filters.onlyBocaminas}
                  onChange={(e) => setFilters(prev => ({ ...prev, onlyBocaminas: e.target.checked }))}
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out checked:bg-green-500"
                ></label>
              </div>
            </label>
          </div>
        </div>
      </div>

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
                            {header.column.getIsSorted() === 'asc'
                              ? ' ↑'
                              : header.column.getIsSorted() === 'desc'
                              ? ' ↓'
                              : ' ↕️'}
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
              <>
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
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getAllCells().length}>
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-2">Unidad</th>
                            <th scope="col" className="px-4 py-2">Inicio</th>
                            <th scope="col" className="px-4 py-2">Fin</th>
                            <th scope="col" className="px-4 py-2">Duración</th>
                            <th scope="col" className="px-4 py-2">Turno</th>
                            <th scope="col" className="px-4 py-2">Detecciones</th>
                            <th scope="col" className="px-4 py-2">Hora de Inicio</th>
                            <th scope="col" className="px-4 py-2">Hora de Fin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.original.trips.map((trip, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-4 py-2">{row.original.unit.toUpperCase()}</td>
                              <td className="px-4 py-2">{trip.startUbication}</td>
                              <td className="px-4 py-2">{trip.endUbication}</td>
                              <td className="px-4 py-2">{trip.totalDuration}</td>
                              <td className="px-4 py-2">{trip.shift}</td>
                              <td className="px-4 py-2">{trip.trip.length}</td>
                              <td className="px-4 py-2">{format(new Date(trip.startDate), 'dd-MM-yyyy, HH:mm')}</td>
                              <td className="px-4 py-2">{format(new Date(trip.endDate), 'dd-MM-yyyy, HH:mm')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}

export default UnitTripTable;