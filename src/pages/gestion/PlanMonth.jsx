import { CircleFadingPlus, FileDown, FileUp, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../../components/Gestion/data-table";
import { Button } from "../../components/ui/button";
import { countItems } from "@/lib/utilsGeneral";
import { columns } from "../../components/Gestion/PlanDay/columns";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { ModalPlanMonth } from "@/components/Gestion/PlanMonth/ModalPlanMonth";
import { Link } from "react-router-dom";

function PlanMonth() {
  const { data = [], isLoading } = useFetchData("planMonth", "planMonth");

  return (
    <>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Gestión de Plan Mensual</h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los planes y sus caractestisticas.
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
          <Link to={`/newPlanMonth`}>
            <Button className="w-fit" >
              <CircleFadingPlus className="w-5 h-5 text-white" />
              Añadir nuevo
            </Button>
          </Link>
       
        </div>
      </div>
      <DataTable data={data} columns={columns} isLoading={isLoading} />
    
    </>
  );
}

export default PlanMonth;
