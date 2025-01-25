import { CircleFadingPlus, FileDown, FileUp, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ModalUser } from "../../components/Gestion/Users/ModalUser";

import { DataTable } from "../../components/Gestion/data-table";
import { Button } from "../../components/ui/button";

import useFetchData from "../../hooks/useGlobalQuery";
import { columns } from "../../components/Gestion/PlanDay/columns";

function PlanDay() {
  const { data = [], isLoading } = useFetchData("planDay", "planDay");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Gestión de Usuarios</h1>
          <p className="text-zinc-400 text-xs">
            Administre los miembros de su equipo y los permisos de sus cuentas
            aquí.
          </p>
        </div>
        <div className="flex gap-2">
          <Button  variant="outline" size="icon">
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
      {/* <ModalUser
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      /> */}
    </>
  );
}

export default PlanDay;
