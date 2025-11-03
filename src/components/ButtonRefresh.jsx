
import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

export const ButtonRefresh = ({ refetch, isFetching, showText = true }) => {
  const loadingState = isFetching;

  return (
    <Button
      onClick={() => refetch()}
      disabled={isFetching}
      className="flex items-center gap-2 bg-blue-500/[0.08] text-blue-500  hover:bg-blue-500 hover:text-white ease-in-out transition-all duration-500 !min-w-9 md:!min-w-[10px] px-2 md:px-3 border-none"
    >
      <RefreshCcw
        className={`size-3.5 ${loadingState ? "animate-spin" : ""}`}
      />
      {showText && 
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {loadingState ? "Cargando" : "Recargar"}
        </span>
      }
    </Button>
  );
};
