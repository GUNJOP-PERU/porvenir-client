import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/Gestion/DataTable";
import { Button } from "@/components/ui/button";

import { ModalActivity } from "@/components/Gestion/Activity/ActivityModal";
import { columns } from "@/components/Gestion/Activity/ActivityTableColumns";
import {
  useFetchInfinityScroll
} from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";

function PageActivity() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("activityTruck", "activity/truck/items");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">
              Gestión de Actividades / Truck
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los miembros de su equipo y los permisos de sus cuentas
            aquí.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            disabled={isFetching}
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>

          {/* <Button onClick={() => setDialogOpen(true)} className="w-fit" disabled={isFetching || isError}>
            <CircleFadingPlus className="w-5 h-5 text-white" />
            Añadir nuevo
          </Button> */}
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
        tableType={"activities"}
      />
      <ModalActivity
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageActivity;
