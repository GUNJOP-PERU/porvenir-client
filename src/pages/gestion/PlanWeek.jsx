import { CircleFadingPlus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../../components/Gestion/DataTable";
import { Button } from "../../components/ui/button";
import { countItems } from "@/lib/utilsGeneral";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { PlanWeekModal } from "@/components/Gestion/PlanWeek/PlanWeekModal";
import { columns } from "@/components/Gestion/PlanWeek/columns";

function PlanWeek() {
  const {
    data = [],
    isFetching,
    isError,
    refetch,
  } = useFetchData("planWeek", "planWeek");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">
              Gestión de Plan Semanal
            </h1>
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

          <Button onClick={() => setDialogOpen(true)} className="w-fit">
            <CircleFadingPlus className="w-5 h-5 text-white" />
            Añadir nuevo
          </Button>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
      />
      <PlanWeekModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PlanWeek;
