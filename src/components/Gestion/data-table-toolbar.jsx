import React from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

export function DataTableToolbar({
  table,
  isFetching,
  filters = [], // Filtros dinámicos pasados como props
  searchColumns = [], // Columnas en las que se aplicará el buscador
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Función para renderizar un filtro solo si la columna existe
  const renderFacetedFilter = ({ columnId, title, options }) => {
    const column = table.getColumn(columnId);
    return column ? (
      <motion.div
        key={columnId}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <DataTableFacetedFilter
          column={column}
          title={title}
          options={options}
        />
      </motion.div>
    ) : null;
  };

  // Obtener el valor de búsqueda de las columnas permitidas
  const getFilterValue = () => {
    for (const columnId of searchColumns) {
      const column = table.getColumn(columnId);
      if (column?.getFilterValue()) return column.getFilterValue();
    }
    return "";
  };

  // Aplicar el valor de búsqueda a las columnas permitidas
  const handleSearchChange = (value) => {
    searchColumns.forEach((columnId) => {
      const column = table.getColumn(columnId);
      if (column) column.setFilterValue(value);
    });
  };

  return (
    <div className="flex items-center justify-between">
      {isFetching ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full justify-between gap-4"
        >
          <div className="h-[34px] w-[250px] bg-zinc-200 animate-pulse rounded-lg"></div>
          <div className="h-[34px] w-24 bg-zinc-200 animate-pulse rounded-lg"></div>
        </motion.div>
      ) : (
        <>
          {/* Buscador */}
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
              <Input
                placeholder="Buscar..."
                value={getFilterValue()}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="pl-8 md:w-[200px] lg:w-[250px]"
              />
            </div>
          </div>

          {/* Filtros con Motion */}
          <div className="flex items-center gap-1">
            <AnimatePresence >
              {filters.map(renderFacetedFilter)}

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
        </>
      )}
    </div>
  );
}
