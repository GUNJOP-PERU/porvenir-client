import { CircleFadingPlus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ModalUser } from "../../components/Gestion/Users/ModalUser";
import { columns } from "@/components/Gestion/Users/columns";
import { DataTable } from "@/components/Gestion/DataTable";
import { Button } from "../../components/ui/button";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function HomeUsers() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("user", "user");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold leading-6">
              Gestión de Usuarios{" "}
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los miembros y los permisos de sus cuentas.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Refrescar
            </span>
          </Button>
          
          <Button
            onClick={() => setDialogOpen(true)}
            className="w-fit"
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
        tableType={"users"}
        isLoading={isLoading}
      />
      <ModalUser
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default HomeUsers;
