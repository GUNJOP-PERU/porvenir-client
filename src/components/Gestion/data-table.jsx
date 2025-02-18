import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRef, useState } from "react";

import { DataTableToolbar } from "./data-table-toolbar";
import SkeletonWrapper from "../SkeletonWrapper";
import IconWarning from "@/icons/IconWarning";
import IconLoader from "@/icons/IconLoader";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  cargo,
  dataMaterial,
  dataTypeVehicle,
  statuses,
  turn,
} from "@/lib/data";
import { tableConfigs } from "./data-table-config";

export function DataTable({
  columns,
  data,
  isLoading,
  isFetching,
  isError,
  fetchNextPage,
  hasNextPage,
  tableType
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const emptyData = [];
  const emptyColumns = [];

  const table = useReactTable({
    data: data || emptyData,
    columns: columns || emptyColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isError) {
    return (
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="max-w-[150px] leading-3 mx-auto flex-1 flex flex-col items-center justify-center gap-1">
          <IconWarning className="w-6 h-6 text-red-300" />
          <p className="text-center text-zinc-300 text-[10px]">
            Hubo un error al cargar los datos. Por favor, intente nuevamente.
          </p>
        </div>
      </div>
    );
  }
  const parentRef = useRef();
  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const { searchColumns, filters } = tableConfigs[tableType] || {
    searchColumns: [],
    filters: [],
  };

  return (
    <>
      <DataTableToolbar
        table={table}
        isFetching={isFetching}
        searchColumns={searchColumns}
        filters={filters}
      />
      <div ref={parentRef} style={{ overflowY: "auto" }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        // style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows?.length > 0 &&
              virtualizer?.getVirtualItems()?.length > 0 ? (
                virtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = rows[virtualRow.index];
                  return (
                    <TableRow
                      key={row.id}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${
                          virtualRow.start - index * virtualRow.size
                        }px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="max-w-xs m-auto py-24">
                      <p className="text-center text-zinc-400 leading-4 mb-4 text-[11px]">
                        <strong className="text-zinc-500 font-semibold">
                          Sin datos disponibles
                        </strong>
                        <br />
                        Lo sentimos, no hay datos para mostrar en este momento.
                        Por favor, verifica tu selección e intente de nuevo más
                        tarde.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="w-full flex items-center justify-center absolute left-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent">
        {hasNextPage && (
          <>
            {isFetching ? (
              <div className="text-center flex items-center justify-center gap-2 py-1 px-3 text-xs text-zinc-400">
                <IconLoader className="w-3 h-3 text-zinc-300 fill-primary animate-spin" />
                Cargando más...
              </div>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetching}
                className="bg-zinc-100 mx-auto text-xs text-zinc-400 rounded-xl py-1 px-3 flex items-center justify-center gap-2"
              >
                Cargar más items
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
