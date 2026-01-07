import { useState } from "react";
import { columns } from "./Columns/TurnColumns";
import { DataTable } from "./Table/TurnDataTable";
import { Button } from "@/components/ui/button";
import {
  useFetchData,
} from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { RefreshCcw } from "lucide-react";
import { useGlobalData } from "@/context/GlobalDataContext";

const TurnConfiguration = () => {
  const { refreshGlobalData } = useGlobalData()
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch
  } = useFetchData("shift", "shift");
  console.log("Turn data:", data);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">
              Gestión de turnos de trabajo
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-fit  h-5 flex items-center justify-center px-1 font-bold ">
              {countItems(data || 0)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre la hora de inicio y fin de cada turno (*lo turnos son complementarios).
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={isFetching}
            onClick={() => refetch()}
            variant="outline"
            size="icon"
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>
      </div>
    
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"mineral-charge"}
        isLoading={isLoading}
      />
    </>
  );
}

export default TurnConfiguration;