import { useMemo, useState,  useEffect } from "react";
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
import {
  ArrowDown,
  ArrowUp,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from "lucide-react";
import { formatFecha, roundAndFormat } from "@/lib/utilsGeneral";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";

interface UnitTripsTableProps {
  data: BeaconCycle[];
}

const UnitTripTable = ({ data }: UnitTripsTableProps) => {
  const [unitList, setUnitList] = useState<string[]>([]);
  const [sorting, setSorting] = useState<
    import("@tanstack/react-table").SortingState
  >([]);
  const [filteredData, setFilteredData] = useState<BeaconCycle[]>([]);
  const [columnFilters, setColumnFilters] = useState<
    import("@tanstack/react-table").ColumnFiltersState
  >([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    unit: "",
    onlyBocaminas: false,
  });
  const [expanded, setExpanded] = useState({});

  const applyFilters = () => {
    let filtered = [...data];

    if (filters.unit) {
      filtered = filtered.filter((item) => item.unit === filters.unit);
    }

    if (filters.onlyBocaminas) {
      filtered = filtered.filter((item) => item.bocaminaStats.length > 0);
    }

    setFilteredData(filtered);
  };

  const columns = useMemo<ColumnDef<BeaconCycle>[]>(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => (
          <div className="flex items-center">
            <span className="text-zinc-400 text-[10px]">
              #{row.index + 1}
            </span>
            {row.getCanExpand() && (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="mr-2 text-blue-500 hover:text-blue-800 text-xs"
              >
                {/* {row.getIsExpanded() ? "▼" : "▶"} */}
                <ChevronRight
                  className={`ml-2 h-4 w-4 transition-transform ease-in-out duration-300 ${
                    row.getIsExpanded() ? "rotate-90" : ""
                  }`}
                />
              </button>
            )}
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
       
      },
      {
        accessorKey: "totalTrips",
        header: "Total de Viajes",
       
      },
      {
        accessorKey: "trips",
        header: "Tiempo Total (hrs)",
       
        cell: ({ row }) => {
          const totalDuration =
            row.original.trips.reduce(
              (acc, trip) => acc + parseFloat(trip.totalDuration),
              0
            ) / 3600;
          return `${totalDuration.toFixed(2)} hrs`;
        },
      },
      {
        accessorKey: "bocaminaStats",
        header: "Bocaminas Detectadas",
       
        cell: ({ row }) => {
          const bocaminas = row.original.bocaminaStats
            .map((b) => b.name)
            .join(", ");
          return bocaminas;
        },
      },
      {
        accessorKey: "trips",
        header: "Total de puntos detectados",
       
        cell: ({ row }) => {
          const puntos = row.original.trips.reduce(
            (acc, trip) => acc + trip.trip.length,
            0
          );
          return puntos;
        },
      },
    ],
    []
  );

  useEffect(() => {
    setUnitList(
      data.map((item) => item.unit).sort((a, b) => a.localeCompare(b))
    );
    applyFilters();
  }, [data]);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  console.log("filteredData", filteredData);

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
    <div className="flex flex-col h-full pb- gap-1">
      <div className="flex flex-col w-[250px]">
        <select
          value={filters.unit}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, unit: e.target.value }))
          }
          className="bg-white h-8 px-2 py-0 text-xs border-[2px] border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
        >
          <option value="">Todas las unidades</option>
          {unitList.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 text-[10px] py-2 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-10 px-2 text-left align-middle font-medium text-zinc-400 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] first:rounded-l-lg last:rounded-r-lg uppercase"
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
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap text-xs"
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
                  <tr className="">
                    <td colSpan={row.getAllCells().length}>
                      <table className="w-full  text-left text-zinc-400">
                        <thead className="bg-sky-50 text-[10px] h-8 px-2 text-left align-middle font-medium text-blue-500 uppercase">
                          <tr>
                            <th scope="col" className="px-4 py-2 ">
                              Unidad
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Inicio
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Origen
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Destino
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Duración
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Material
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Turno
                            </th>
                            <th scope="col" className="px-4 py-2 ">
                              Detecciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-blue-50 text-gray-500">
                          {row.original.trips.map((trip, index) => (
                            <tr
                              key={index}
                              className="bg-blue-50/20  hover:bg-sky-50  cursor-default "
                            >
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {row.original.unit.toUpperCase()}
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {trip.startUbication} / {formatFecha(trip.startDate)}
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                --- ---
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {trip.endUbication} / {formatFecha(trip.endDate)}
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {roundAndFormat(trip.totalDurationMin)}
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {trip.tripType}
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {trip.shift === "dia" ? (
                                  <IconDay className="h-5 w-5 fill-orange-400" />
                                ) : (
                                  <IconNight className="h-5 w-5 fill-sky-400" />
                                )}
                              </td>
                              <td className="first:rounded-l-lg last:rounded-r-lg px-4 py-1.5">
                                {trip.trip.length}
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

      <div className="px-4 py-2 border-zinc-200 bg-zinc-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">
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
              className=" size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <span className="px-1 py-1 text-xs text-zinc-500 font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="size-7 flex items-center justify-center border border-zinc-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitTripTable;
