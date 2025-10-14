import { useMemo, useState, useEffect } from "react";
import type { BocaminaByUnits } from "@/types/Beacon";
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
  data: BocaminaByUnits[]
}

const BocaminaDetectionTable = ({ data }: UnitTripsTableProps) => {
  const sortData = useMemo(() => {
    return [...data].sort((a, b) => a.unit.localeCompare(b.unit));
  }, [data]);
  const [sorting, setSorting] = useState<import('@tanstack/react-table').SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<import('@tanstack/react-table').ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo<ColumnDef<BocaminaByUnits>[]>(() => [
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
          <span className="text-zinc-400 text-[10px] font-normal">
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
      cell: ({ row }) => <div>
        CAM {row.original.unit.split("-").pop()}
      </div>,
      size: 150,
    },
    {
      accessorKey: "totalBC",
      header: "Total Lecturas",
      size: 150,
      cell: ({ row }) => {
        const detections = row.original.totalBC;
        return `${detections} lecturas`;
      },
    }
  ], []); // ✅ Sin dependencias innecesarias

  const table = useReactTable({
    data: sortData,
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
      <div className="flex-1 overflow-auto max-h-[250px]">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"
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
                  key={`main-row-${row.original.unit}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`cell-${row.original.unit}-${cell.column.id}`}
                      className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold"
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
                  <tr key={`expanded-row-${row.original.unit}`}>
                    <td colSpan={row.getAllCells().length}>
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-2">Unidad</th>
                            <th scope="col" className="px-4 py-2">Bocamina</th>
                            <th scope="col" className="px-4 py-2">Hora de Inicio</th>
                            <th scope="col" className="px-4 py-2">Hora de Fin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.original.bc.map((detection, index: number) => (
                            <tr key={detection.uuid || `${row.original.unit}-detection-${index}-${detection.f_inicio}`} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-4 py-2 text-[11px]">CAM {row.original.unit.split("-").pop()}</td>
                              <td className="px-4 py-2 text-[11px]">{detection.ubication}</td>
                              <td className="px-4 py-2 text-[11px]">{format(new Date(detection.f_inicio), 'dd-MM-yyyy, HH:mm')}</td>
                              <td className="px-4 py-2 text-[11px]">{format(new Date(detection.f_final), 'dd-MM-yyyy, HH:mm')}</td>
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

      <div className="px-6 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-700">
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
              className="px-3 py-1 text-[12px] border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>
            
            <span className="px-3 py-1 text-[12px] font-medium">
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
              className="px-3 py-1 text-[12px] border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BocaminaDetectionTable;