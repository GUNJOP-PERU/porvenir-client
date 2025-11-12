import React from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataExport } from "./DataExport";

export function DataTableToolbar({
  table,
  isFetching,
  filters = [], // Filtros dinámicos pasados como props
  searchColumns = [], // Columnas en las que se aplicará el buscador
  toolbarContent,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const renderFacetedFilter = ({ columnId, title, options }) => {
    const column = table.getColumn(columnId);
    return column ? (
      <DataTableFacetedFilter column={column} title={title} options={options} />
    ) : null;
  };

  const getFilterValue = () => {
    return searchColumns
      .map((col) => table.getColumn(col)?.getFilterValue() || "")
      .find((value) => value !== "");
  };

  const handleSearchChange = (value) => {
    searchColumns.forEach((col) => {
      const column = table.getColumn(col);
      if (column) column.setFilterValue(value);
    });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {isFetching ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full justify-between gap-4"
        >
          <div className="h-8 w-[250px] bg-zinc-200 animate-pulse rounded-lg"></div>
          <div className="h-8 w-24 bg-zinc-200 animate-pulse rounded-lg"></div>
        </motion.div>
      ) : (
        <>
          {/* Buscador */}
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
              <Input
                placeholder="Buscar..."
                value={getFilterValue()}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="pl-8 w-full lg:w-[250px]"
              />
            </div>
          </div>

          {/* Filtros con Motion */}
          <div className="flex items-center gap-1">
            {toolbarContent}
            <AnimatePresence>
              {filters.map((filter) => (
                <motion.div key={filter.columnId}>
                  {renderFacetedFilter(filter)}
                </motion.div>
              ))}

              {isFiltered && (
                <motion.div
                  key="reset-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="px-2 lg:px-3 text-red-500 hover:bg-red-50"
                  >
                    Reset
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <DataExport
            data={table.getCoreRowModel().rows.map((row) => row.original)}
            fileName="data-table"
            disabled={table.getCoreRowModel().rows.length === 0 || isFetching}
          />
        </>
      )}
    </div>
  );
}
