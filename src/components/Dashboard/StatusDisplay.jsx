import { Server } from "lucide-react";
import React from "react";

export const StatusDisplay = ({
  isLoading,
  isError,
  noData,
  height = "380px",
}) => {
  if (isLoading) {
    return (
      <div
        className="bg-zinc-100 animate-pulse flex items-center justify-center rounded-2xl w-full"
        style={{ height }}
      ></div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center justify-center w-full"
        style={{ height }}
      >
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
  }

  if (noData) {
    return (
      <div
        className="flex items-center justify-center w-full"
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-0.5 max-w-[200px] w-full text-center">
          <Server className="size-5 text-zinc-400" />
          <b className="text-[10px] text-zinc-400">Sin datos para mostrar</b>
          <span className="text-[10px] font-semibold leading-3 text-zinc-300 mt-1">
            No se encontraron registros para el período y filtros seleccionados, Intente cambiar el rango de fechas, la ruta o verificar que existan
            datos en el sistema
          </span>
        </div>
      </div>
    );
  }

  return null;
};
