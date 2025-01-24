import { useState } from "react";
import { ModalVehicle } from "./components/Gestion/Vehicle/ModalVehicle";
import { columns } from "./components/Gestion/Vehicle/columns";
import { DataTable } from "./components/Gestion/data-table";
import { Button } from "./components/ui/button";
import useFetchData from "./hooks/useGlobalQuery";
import IconMore from "./icons/IconMore";
import { countItems } from "./lib/utilsGeneral";

function HomeVehicles() {
  const { data = [], isLoading } = useFetchData("vehicle", "vehicle");
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log(data, "vehicle")
  return (
    <>
      <div className="flex justify-between">
        <div>
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Gestión de Vehiculos </h1>
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
          <Button  className="w-fit" variant="outline">
            <IconMore className="w-5 h-5 fill-zinc-400" /> Importar
          </Button>
          <Button  className="w-fit" variant="outline">
            <IconMore className="w-5 h-5 fill-zinc-400" /> Exportar
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="w-fit">
            <IconMore className="w-5 h-5 fill-white" />
            Añadir nuevo
          </Button>
        </div>
      </div>
      <DataTable data={data} columns={columns} />
      <ModalVehicle
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

export default HomeVehicles;
