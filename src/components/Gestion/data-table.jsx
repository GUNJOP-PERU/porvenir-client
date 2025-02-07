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
import { useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import SkeletonWrapper from "../SkeletonWrapper";

export function DataTable({ columns, data, isLoading, isError }) {
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isError) {
    return (
      <div className="space-y-4 flex-1 flex flex-col">
        <DataTableToolbar table={table} />
        <div className="max-w-[200px] mx-auto flex-1 flex items-center justify-center">
          <p className="text-center text-red-500 text-xs">
            Hubo un error al cargar los datos. Por favor, intente nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-1 flex flex-col">
      <DataTableToolbar table={table} />
      <div className="rounded-md flex-1 flex">
        <SkeletonWrapper isLoading={isLoading}>
          <Table>
            <TableHeader>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
                ))
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
        </SkeletonWrapper>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
