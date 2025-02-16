import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function DataTablePagination({ table, isLoading }) {
  return (
    <div className="flex items-center justify-between gap-2">
      {isLoading ? (
        // Skeleton Loader cuando está cargando
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full justify-between gap-4"
        >
          <div className="h-8 w-24 bg-zinc-200 animate-pulse rounded-lg"></div>
          <div className="h-8 w-32 bg-zinc-200 animate-pulse rounded-lg"></div>
          <div className="h-8 w-16 bg-zinc-200 animate-pulse rounded-lg"></div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Información de filas seleccionadas */}
          <motion.div
            key="row-info"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex text-xs text-zinc-400"
          >
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s).
          </motion.div>

          {/* Controles de paginación */}
          <motion.div
            key="pagination-controls"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center justify-center text-xs font-medium">
              Pag. {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                className="hidden h-7 w-7 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la primera página</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la siguiente página</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden h-7 w-7 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la última página</span>
                <ChevronsRight />
              </Button>
            </div>
          </motion.div>

          {/* Selección de número de ítems por página */}
          <motion.div
            key="page-size-selector"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <p className="text-xs font-medium">Ítems</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[55px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
