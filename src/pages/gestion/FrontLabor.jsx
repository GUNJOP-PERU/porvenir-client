import { useState } from "react";
import { ModalFrontLabor } from "../../components/Gestion/FrontLabor/ModalFrontLabor";
import { columns } from "../../components/Gestion/FrontLabor/columns";
import { DataTable } from "../../components/Gestion/data-table";
import { Button } from "../../components/ui/button";
import { useFetchData } from "../../hooks/useGlobalQuery";
import IconMore from "../../icons/IconMore";
import { countItems } from "../../lib/utilsGeneral";
import { RefreshCcw } from "lucide-react";

function HomeFrontLabor() {
  const { data = [],  isFetching,
    isError,
    refetch } = useFetchData("frontLabor", "frontLabor");
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log(data, "front labor");
  return (
    <>
     <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">Gestión de Labor </h1>
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
        <Button disabled={isFetching } onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>
          <Button className="w-fit" variant="outline">
            <IconMore className="w-5 h-5 fill-zinc-400" /> Importar
          </Button>
          <Button className="w-fit" variant="outline">
            <IconMore className="w-5 h-5 fill-zinc-400" /> Exportar
          </Button>
          <Button disabled={isFetching || isError} onClick={() => setDialogOpen(true)} className="w-fit">
            <IconMore className="w-5 h-5 fill-white" />
            Añadir nuevo
          </Button>
        </div>
      </div>

      <DataTable data={data} columns={columns}  isLoading={isFetching}
        isError={isError}/>
      <ModalFrontLabor
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default HomeFrontLabor;
