import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ModalWorkOrder } from "../../components/Gestion/WorkOrder/ModalWorkOrder";
import { columns } from "../../components/Gestion/WorkOrder/columns";

import { Button } from "../../components/ui/button";
import { useFetchInfinityScroll } from "../../hooks/useGlobalQuery";
import IconMore from "../../icons/IconMore";
import { countItems } from "../../lib/utilsGeneral";
import { DataTable } from "@/components/Gestion/DataTable";

function WorkerOrders() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("workOrder", "workOrder/items");
 
  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2 leading-6">
            <h1 className="text-xl font-bold leading-6">
              Gestión de Trabajos planificados{" "}
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los trabajos planificados de su equipo aquí.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            // size="icon"
            disabled={isFetching}
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
            Refrescar
          </Button>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"workerOrders"}
      />
      <ModalWorkOrder
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
        
      />
    </>
  );
}

export default WorkerOrders;
