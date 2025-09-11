import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
} from "@/components/ui/table";
import React, { useEffect, useRef, useState } from "react";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import IconLoader from "@/icons/IconLoader";
import IconWarning from "@/icons/IconWarning";
import { useVirtualizer } from "@tanstack/react-virtual";
import { activityColumns } from "./CycleTruckActivitiesColumns";

export function DataTable({
  columns,
  data,
  isLoading,
  isFetching,
  isError,
  fetchNextPage,
  hasNextPage,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const parentRef = useRef();

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
      expanded,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.activities || [],
  });

  const rows = isLoading ? [] : table.getRowModel().rows;

  const hasExpanded = rows.some((r) => r.getIsExpanded());

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    measureElement: (el) => el?.getBoundingClientRect().height,
    overscan: 5,
  });

  const isMobile = useIsMobile();

  const hiddenColumnsOnMobile = [
    "start",
    "duration",
    "material",
    "activityName",
    "tonnage",
    "isNewLabor",
    "tonnage",
    "shift",
    "isValid",
  ];

  useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (hiddenColumnsOnMobile.includes(column.id)) {
        column.toggleVisibility(!isMobile);
      }
    });
  }, [isMobile, table]);

  if (isLoading) return <SkeletonWrapper isLoading={isLoading} />;
  if (isError) {
    return (
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="max-w-[150px] leading-3 mx-auto flex-1 flex flex-col items-center justify-center gap-1">
          <IconWarning className="w-6 h-6 text-[#D32F2F]" />
          <p className="text-center text-[#B71C1C] text-[10px] font-medium">
            Hubo un error al cargar los datos. Por favor, intente nuevamente mas
            tarde.
          </p>
        </div>
      </div>
    );
  }

  const myColumns = activityColumns();

  return (
    <>
      <div
        ref={parentRef}
        style={{ overflowY: "auto", height: "80vh", padding: "10px" }}
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <Table>
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
                    <React.Fragment key={row.id}>
                      <TableRow
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
                        {/* Filas expandidas */}
                        {row.getIsExpanded() &&
                          (row.subRows || []).map((subRow) => (
                            <TableRow key={subRow.id} className="bg-gray-50">
                              {myColumns.map((col) => (
                                <TableCell key={col.accessorKey}>
                                  {col.cell ? col.cell({ row: subRow }) : null}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </React.Fragment>
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
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <div className="w-full flex items-start justify-center h-10 mb-2">
          {hasNextPage && (
            <>
              {isFetching ? (
                <div className="text-center flex items-center justify-center gap-2 py-1 px-3 h-8 text-xs text-zinc-400">
                  <IconLoader className="w-4 h-4 " />
                  Cargando más...
                </div>
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetching}
                  className="bg-zinc-100 mx-auto text-xs text-zinc-400 rounded-xl h-8 px-3 flex items-center justify-center gap-2 hover:bg-zinc-200/80 transition-colors ease-in-out duration-300"
                >
                  Cargar más items
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex-1 text-[11px] flex flex-col md:flex-row justify-center md:justify-between text-zinc-400">
          <span className="text-center">
            © 2025 Gunjop Terms Privacy Cookies
          </span>
          <span className="text-center">Scoop Truck Tags Places Resources</span>
        </div>
      </div>
    </>
  );
}
