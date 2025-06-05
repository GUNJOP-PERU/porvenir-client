import {
  flexRender,
  getCoreRowModel,
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
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { DataTableToolbar } from "@/components/Gestion/DataTableToolbar";

import IconWarning from "@/icons/IconWarning";
import IconLoader from "@/icons/IconLoader";
import { useVirtualizer } from "@tanstack/react-virtual";
import { tableConfigs } from "@/components/Gestion/DataTableConfig";
import { useIsMobile } from "@/hooks/use-mobile";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { useGlobalData } from "@/context/GlobalDataContext";

export function DataTable({
  columns,
  activityColumns,
  data,
  isLoading,
  isFetching,
  isError,
  fetchNextPage,
  hasNextPage,
  tableType,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]); // IDs de filas expandidas
  const { data: globalData } = useGlobalData();

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




  const rows = isLoading ? [] : table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length, // Se asegura de que no haya problemas cuando isLoading es true
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
    measureElement: (el) => el?.getBoundingClientRect().height || 50,
  });
  

  const { searchColumns, filters } = tableConfigs[tableType] || {
    searchColumns: [],
    filters: [],
  };

  const isMobile = useIsMobile(); // Detecta si es móvil

  // Definir columnas que se ocultarán en móviles
  const hiddenColumnsOnMobile = [
    "address",
    "updatedAt",
    "description",
    "role",
    "cargo",
    "guard",
    "plate",
    "horometer",
    "odometer",
    "year",
    "type",
    "nro_volquetes",
    "state",
    "id",
    "reasonNoPlanned",
    "statusOperator",
    "statusSupervisor",
    "workOrderOk",
    "checkListOk",
    "vehicleType",
    "vehicleTagName",
    "tagName",
    "start",
    "duration",
    "material",
    "activityName",
    "tonnage"
  ];

  useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (hiddenColumnsOnMobile.includes(column.id)) {
        column.toggleVisibility(!isMobile); // Oculta en móviles, muestra en desktop
      }
    });
  }, [isMobile, table]);

  const handleToggleRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  if (isLoading)
  return (
    <SkeletonWrapper isLoading={isLoading}/>
  );
  if (isError) {
    return (
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="max-w-[150px] leading-3 mx-auto flex-1 flex flex-col items-center justify-center gap-1">
          <IconWarning className="w-6 h-6 text-[#D32F2F]" />
          <p className="text-center text-[#B71C1C] text-[10px] font-medium">
            Hubo un error al cargar los datos. Por favor, intente nuevamente mas tarde.
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <DataTableToolbar
        table={table}
        isFetching={isFetching}
        searchColumns={searchColumns}
        filters={filters}
      />
      <div ref={parentRef} style={{ overflowY: "auto", height: "80vh", padding:"10px" }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <Table>
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {/* Columna extra para el botón de expandir */}
                  <TableHead style={{ width: 40 }}></TableHead>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
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
                  const isExpanded = expandedRows.includes(row.id);
                  return (
                    <>
                      <TableRow
                        key={row.id}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                        }}
                      >
                        <TableCell style={{ width: 40 }}>
                          <button
                            onClick={() => handleToggleRow(row.id)}
                            className="focus:outline-none"
                            aria-label={isExpanded ? "Colapsar" : "Expandir"}
                          >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                        </TableCell>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {isExpanded && Array.isArray(row.original.activities) && row.original.activities.length > 0 && (
                        row.original.activities.map((subRow, subIdx) => (
                          <TableRow key={row.id + "-sub-" + subIdx} className="bg-zinc-50">
                            <TableCell style={{ width: 40 }} />
                            {activityColumns(globalData).map((col, colIdx) => {
                              return (
                                <TableCell key={colIdx}>
                                  {col.cell
                                    ? flexRender(col.cell, {
                                        table,
                                        row: { ...row, original: subRow },
                                        column: { ...col },
                                        getValue: () => subRow[col.accessorKey],
                                      })
                                    : subRow[col.accessorKey] ?? ''}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))
                      )}
                    </>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
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
