import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
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
  data,
  isLoading,
  isFetching,
  isError,
  fetchNextPage,
  hasNextPage,
  tableType,
  hideToolbar = false,
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

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    measureElement: (el) => el?.getBoundingClientRect().height,
    overscan: 5,
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
    "tonnage",
  ];

  useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (hiddenColumnsOnMobile.includes(column.id)) {
        column.toggleVisibility(!isMobile); // Oculta en móviles, muestra en desktop
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
  return (
    <>
      {!hideToolbar && (
        <DataTableToolbar
          table={table}
          isFetching={isFetching}
          searchColumns={searchColumns}
          filters={filters}
        />
      )}
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
                    <React.Fragment key={row.id}>
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

                      {/* Subfilas */}
                      {row.getIsExpanded() && (
  <TableRow className="bg-zinc-50">
    <TableCell colSpan={columns.length}>
      {row.original.activities && row.original.activities.length > 0 ? (
        <Table className="text-xs border rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Actividad</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Toneladas</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Operador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {row.original.activities.map((act) => (
              <TableRow key={act._id}>
                <TableCell>{act.activityName}</TableCell>
                <TableCell>{act.material}</TableCell>
                <TableCell>{act.tonnage}</TableCell>
                <TableCell>{act.destiny}</TableCell>
                <TableCell>
                  {new Date(act.start).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  {new Date(act.end).toLocaleTimeString()}
                </TableCell>
                <TableCell>{act.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-400 text-xs">Sin actividades</p>
      )}
    </TableCell>
  </TableRow>
)}

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
