import React from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { cargo, dataMaterial, dataTypeVehicle, statuses, turn } from "@/lib/data";

export function DataTableToolbar({ table, isLoading }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const renderFacetedFilter = (columnId, title, options) => {
    const column = table.getColumn(columnId);
    return column ? (
      <motion.div
        key={columnId}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <DataTableFacetedFilter column={column} title={title} options={options} />
      </motion.div>
    ) : null;
  };

  const getFilterValue = (columnId) => {
    const column = table.getColumn(columnId);
    return column ? column.getFilterValue() || "" : "";
  };

  const handleSearchChange = (value) => {
    const nameColumn = table.getColumn("name");
    const tagNameColumn = table.getColumn("tagName");
    const userNameColumn = table.getColumn("user");
    const userLabor = table.getColumn("frontLabor");

    if (nameColumn) nameColumn.setFilterValue(value);
    if (tagNameColumn) tagNameColumn.setFilterValue(value);
    if (userNameColumn) userNameColumn.setFilterValue(value);
    if (userLabor) userLabor.setFilterValue(value);
  };

  return (
    <div className="flex items-center justify-between">
      {/* Loader cuando isLoading es true */}
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full justify-between gap-4"
        >
          <div className="h-10 w-48 bg-zinc-200 animate-pulse rounded-lg"></div>
          <div className="h-10 w-32 bg-zinc-200 animate-pulse rounded-lg"></div>
          <div className="h-10 w-24 bg-zinc-200 animate-pulse rounded-lg"></div>
        </motion.div>
      ) : (
        <>
          {/* Buscador */}
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
              <Input
                placeholder="Buscar..."
                value={getFilterValue("name") || getFilterValue("tagName") || getFilterValue("user") || getFilterValue("frontLabor")}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="pl-8 md:w-[200px] lg:w-[250px]"
              />
            </div>
          </div>

          {/* Filtros con Motion */}
          <div className="flex items-center gap-1">
            <AnimatePresence mode="wait">
              {renderFacetedFilter("role", "Rol", statuses)}
              {renderFacetedFilter("cargo", "Cargo", cargo)}
              {renderFacetedFilter("shift", "Turno", turn)}
              {renderFacetedFilter("type", "Vehiculo", dataTypeVehicle)}
              {renderFacetedFilter("material", "Material", dataMaterial)}
              {renderFacetedFilter("vehicleType", "Vehiculo", dataTypeVehicle)}

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
