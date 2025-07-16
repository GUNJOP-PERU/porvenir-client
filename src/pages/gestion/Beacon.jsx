import { CircleFadingPlus, RefreshCcw } from "lucide-react";

import { DataTable } from "@/components/Gestion/DataTable";
import { Button } from "../../components/ui/button";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
import { columns } from "@/components/Gestion/Beacon/BeaconColumns";
import { useState } from "react";
import { BeaconModal } from "@/components/Gestion/Beacon/BeaconModal";

function PageBeacon() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("beacon", "beacon");

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold leading-6">
              Gestión de Beacons{" "}
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
          
          <Button
            onClick={() => setDialogOpen(true)}
            className="w-fit"
            // disabled={isFetching || isError}
          >
            <CircleFadingPlus className="w-5 h-5 text-white" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Añadir nuevo
            </span>
          </Button>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"beacon"}
        isLoading={isLoading}
      />
      <BeaconModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageBeacon;
