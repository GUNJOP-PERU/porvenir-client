import { useEffect, useState } from "react";
import { columns } from "./Columns/MineralChargeColumns";
import { DataTable } from "./Table/MineralDataTable";
import { Button } from "@/components/ui/button";
import {
  useFetchData,
} from "@/hooks/useGlobalQuery";
import IconMore from "@/icons/IconMore";
import { countItems } from "@/lib/utilsGeneral";
import { RefreshCcw } from "lucide-react";
import { MineralChargeModal } from "./Modal/MineralChargeModal";
import { useGlobalData } from "@/context/GlobalDataContext";

const MineralConfiguration = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { refreshGlobalData } = useGlobalData()
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch
  } = useFetchData("mineral", "mineral");
  
  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      refreshGlobalData();
    }
  }, [data, isLoading, isFetching, refreshGlobalData]);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold leading-6">
              Gestión de carga por mineral
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-fit  h-5 flex items-center justify-center px-1 font-bold ">
              {countItems(data || 0)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre la carga de mineral en toneladas aquí.
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
          
          <Button
            disabled={isFetching || isError}
            onClick={() => setDialogOpen(true)}
            className="w-fit"
          >
            <IconMore className="w-5 h-5 fill-white" />
            Añadir nuevo
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
      
      <MineralChargeModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default MineralConfiguration;