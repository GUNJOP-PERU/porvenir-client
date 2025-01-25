import { CircleFadingPlus, FileDown, FileUp, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../../components/Gestion/data-table";
import { Button } from "../../components/ui/button";

import { ModalActivity } from "../../components/Gestion/Activity/ModalActivity";
import { columns } from "../../components/Gestion/Activity/columns";
import useFetchData from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function PageActivity() {
  const { data = [], isLoading } = useFetchData("activity", "activity");
  const [dialogOpen, setDialogOpen] = useState(false);


  return (
    <>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Gestión de Actividades </h1>
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
          <Button variant="outline" size="icon">
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>
          <Button className="w-fit" variant="outline">
            <FileUp className="w-5 h-5 text-zinc-400" /> Importar
          </Button>
          <Button className="w-fit" variant="outline">
            <FileDown className="w-5 h-5 text-zinc-400" /> Exportar
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="w-fit">
            <CircleFadingPlus className="w-5 h-5 text-white" />
            Añadir nuevo
          </Button>
        </div>
      </div>
      <DataTable data={data} columns={columns} />
      <ModalActivity
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageActivity;
