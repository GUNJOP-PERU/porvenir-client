/* eslint-disable react/prop-types */
import IconLoader from "@/icons/IconLoader";
import { DatabaseZap, OctagonAlert, RefreshCcw } from "lucide-react";

export default function LoadingBuild({
  isLoading,
  isError = false,
  isEmpty = false,
  errorMessage = "No se pudieron cargar los datos.",
  emptyMessage = "Lo sentimos, no hay datos para mostrar en este momento. Por favor, verifica tu selección e intente de nuevo más tarde.",
  onRetry,
}) {
  if (!isLoading && !isError && !isEmpty) return null;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-0 min-h-[80vh]">
        <OctagonAlert className="size-10 text-red-500" />
        <span className="text-sm font-bold text-red-600">
          Error al cargar datos
        </span>
        <span className="text-[11px] text-zinc-500 text-center max-w-40 leading-tight">
          {errorMessage}
        </span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 bg-blue-500/[0.08] text-blue-500 px-3 py-1 rounded-lg text-xs font-medium focus:border-blue-500 focus:outline-none cursor-pointer hover:bg-blue-500 hover:text-white transition-all ease-out duration-200 active:scale-90  h-8 mt-2 group"
          >
            <RefreshCcw className="size-4 text-blue-500 group-hover:text-white" />{" "}
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isEmpty && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 opacity-80 min-h-[80vh]">
        <DatabaseZap className="size-10 text-zinc-400" />
        <span className="text-sm font-bold text-zinc-700">
          Sin datos disponibles
        </span>
        <span className="text-[11px] text-zinc-400 text-center font-medium max-w-60 leading-tight">
          {emptyMessage}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 opacity-80 min-h-[80vh]">
      <IconLoader className="size-8" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-bold text-zinc-700">Cargando Datos</span>
        <span className="text-[11px] text-[#E2231A] text-center font-medium animate-pulse leading-none max-w-40">
          Obteniendo miles de datos del servidor...
        </span>
      </div>
    </div>
  );
}
