import { useEffect, useState } from "react";
import { activityColumns } from "./Columns/ActivityColumns";
import { DataTable } from "./Table/TurnDataTable";
import { Button } from "@/components/ui/button";
import {
  useFetchData,
} from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { RefreshCcw } from "lucide-react";
import { MineralChargeModal } from "./Modal/MineralChargeModal";
import { useGlobalData } from "@/context/GlobalDataContext";

const ActivityAverageTimeConfiguration = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { refreshGlobalData } = useGlobalData()
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch
  } = useFetchData("activity-config", "activity-config");

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      refreshGlobalData();
    }
  }, [data, isLoading, isFetching]);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">
              Tiempo promedio de actividades
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-fit  h-5 flex items-center justify-center px-1 font-bold ">
              {countItems(data || 0)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre la hora promedio de cada actividad.
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
        columns={activityColumns}
        isFetching={isFetching}
        isError={isError}
        tableType={"activity-config"}
        isLoading={isLoading}
      />
      
      <MineralChargeModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default ActivityAverageTimeConfiguration;