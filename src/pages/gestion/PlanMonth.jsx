import { countItems } from "@/lib/utilsGeneral";
import { CircleFadingPlus, FileDown, FileUp, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "../../components/Gestion/data-table";
import { Button } from "../../components/ui/button";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { columns } from "@/components/Gestion/PlanMonth/columns";

function PlanMonth() {
  const {
    data = [],
    isFetching,
    isError,
    refetch,
  } = useFetchData("planMonth", "planMonth");

  console.log(data, "plan");
  return (
    <>
     <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">Gestión de Plan Mensual</h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los planes y sus caractestisticas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>
          <Button className="w-fit" variant="outline">
            <FileUp className="w-5 h-5 text-zinc-400" /> Importar
          </Button>
          <Button className="w-fit" variant="outline">
            <FileDown className="w-5 h-5 text-zinc-400" /> Exportar
          </Button>
          <Link to={`/newPlanMonth`}>
            <Button className="w-fit">
              <CircleFadingPlus className="w-5 h-5 text-white" />
              Añadir nuevo
            </Button>
          </Link>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isFetching}
        isError={isError}
      />
    </>
  );
}

export default PlanMonth;
