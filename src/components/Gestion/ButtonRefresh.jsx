import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

export const ButtonRefresh = ({ refetch, isFetching }) => {
  const loadingState = isFetching;

  return (
    <Button
      onClick={() => refetch()}
      disabled={isFetching}
      className="flex items-center gap-2 bg-blue-500/[0.08] text-blue-500  hover:bg-blue-500 select-none hover:text-white ease-in-out transition-all duration-500 !min-w-9 md:!min-w-[100px] px-0 md:px-3 border-none"
    >
      <RefreshCcw
        className={`size-3.5 ${loadingState ? "animate-spin" : ""}`}
      />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {loadingState ? "Cargando" : "Recargar"}
      </span>
    </Button>
  );
};
