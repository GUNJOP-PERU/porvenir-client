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
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Triangle,
} from "lucide-react";
import { formatFecha } from "@/lib/utilsGeneral";

interface UnitTripsTableProps {
  data: BocaminaByUnits[];
}

const BocaminaDetectionTable = ({ data }: UnitTripsTableProps) => {
  const sortData = useMemo(() => {
    return [...data].sort((a, b) => a.unit.localeCompare(b.unit));
  }, [data]);
  const [sorting, setSorting] = useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [columnFilters, setColumnFilters] = useState<
    import("@tanstack/react-table").ColumnFiltersState
  >([]);
  const [expanded, setExpanded] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<BocaminaByUnits>[]>(
    () => [
      {
        id: "unit",
        header: "Unidad",
        cell: ({ row }) => (
          <div className="flex items-center">
            {/* <span className="text-zinc-400 text-[10px]">{row.index + 1}</span> */}
            {row.getCanExpand() && (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="mr-1 text-xs cursor-pointer"
              >
                <Triangle
                  className={`size-2.5 text-blue-400 transition-transform ${
                    row.getIsExpanded()
                      ? "rotate-180 fill-blue-400"
                      : "rotate-90 fill-blue-200"
                  }`}
                />
              </button>
            )}
            <div className="text-blue-900 font-bold">
              CAM {row.original.unit.split("-").pop()}
            </div>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 60,
      },
      // {
      //   accessorKey: "unit",
      //   header: "Unidad",
      //   cell: ({ row }) => (
      //     <div className="text-blue-900">
      //       CAM {row.original.unit.split("-").pop()}
      //     </div>
      //   ),
      //   size: 150,
      // },
      {
        accessorKey: "totalBC",
        header: "Total Lecturas",
        size: 150,
        cell: ({ row }) => {
          const detections = row.original.totalBC;
          return `${detections} lecturas`;
        },
      },
    ],
    []
  );

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
          <thead className="bg-zinc-50 text-[10px] py-2 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-8 px-2 text-left align-middle text-zinc-400 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] first:rounded-l-lg last:rounded-r-lg uppercase pl-4"
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
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="ml-2 h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="ml-2 h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-zinc-100">
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={`main-row-${row.original.unit}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`cell-${row.original.unit}-${cell.column.id}`}
                      className="px-4 py-1.5 whitespace-nowrap text-[12px] font-semibold"
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
                    <td
                      colSpan={row.getAllCells().length}
                      className="py-0.5 m-0"
                    >
                      <table className="w-full text-sm text-left text-zinc-500">
                        <thead className="bg-sky-50 text-[10px] px-2 text-left align-middle font-medium text-blue-500 uppercase">
                          <tr>
                            <th scope="col" className="px-4 py-0.5 pl-8">
                              Unidad
                            </th>
                            <th scope="col" className="px-4 py-0.5">
                              Bocamina
                            </th>
                            <th scope="col" className="px-4 py-0.5">
                              Hora de Inicio
                            </th>
                            <th scope="col" className="px-4 py-0.5">
                              Hora de Fin
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-blue-50 text-gray-500">
                          {row.original.bc.map((detection, index: number) => (
                            <tr
                              key={
                                detection.uuid ||
                                `${row.original.unit}-detection-${index}-${detection.f_inicio}`
                              }
                              className="bg-blue-50/20  hover:bg-sky-50 cursor-default "
                            >
                              <td className="px-4 py-1 text-[11px] pl-8">
                              <span className="font-semibold text-blue-900 border-b border-dashed border-gray-400 ">
                                  CAM {row.original.unit.split("-").pop()}
                                </span>
                              </td>
                              <td className="px-4 py-1 text-[11px]">
                                {detection.ubication}
                              </td>
                              <td className="px-4 py-1 text-[11px] capitalize">
                                {formatFecha(detection.f_inicio)}
                              </td>
                              <td className="px-4 py-1 text-[11px] capitalize">
                                {formatFecha(detection.f_final)}
                              </td>
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

      <div className="py-1 px-4 border-zinc-200 bg-zinc-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-zinc-500">
            Mostrando{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            de {table.getFilteredRowModel().rows.length} registros
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className=" size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <span className="px-1 text-[11px] leading-none text-zinc-500 font-medium select-none">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BocaminaDetectionTable;
