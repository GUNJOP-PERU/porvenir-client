import { CircleFadingPlus, FileDown, FileUp, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../../components/Gestion/DataTable";
import { Button } from "../../components/ui/button";
import { countItems } from "@/lib/utilsGeneral";
import { columns } from "@/components/Gestion/Incidence/IncidenceColumns";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { IncidenceModal } from "@/components/Gestion/Incidence/IncidenceModal";


function Incidence() {
  const { data = [],  isFetching,
    isError,
    refetch } = useFetchData("vehicle-incidence", "vehicle-incidence");
  const [dialogOpen, setDialogOpen] = useState(false);


  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">Incidencias del Truck | Scoop</h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre las incidencias de los vehículos.
          </p>
        </div>
        <div className="flex gap-2">
        <Button onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>
        
          <Button onClick={() => setDialogOpen(true)} className="w-fit">
            <CircleFadingPlus className="w-5 h-5 text-white" />
            Añadir nuevo
          </Button>
        </div>
      </div>
      <DataTable data={data} columns={columns}  isFetching={isFetching}
        isError={isError}/>
      <IncidenceModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default Incidence;
