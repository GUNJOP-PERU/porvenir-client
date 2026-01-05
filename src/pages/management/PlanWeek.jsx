import PageHeader from "@/components/PageHeader";
import { columns } from "@/components/Management/PlanWeek/columns";
import { DataTable } from "@/components/Table/DataTable";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { Link } from "react-router-dom";
import { CircleFadingPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

function PlanWeek() {
  const {
    data = [],
    isFetching,
    isError,
    isLoading,
    refetch,
  } = useFetchData("planWeek", "planWeek");

  return (
    <>
      <PageHeader
        title="Gestión de Plan Semanal"
        description="Administre los planes y sus caractestisticas."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <>
            <Link to={`/plan/weekly/new`}>
              <Button className="w-fit">
                <CircleFadingPlus className="w-5 h-5 text-white" />
                Añadir nuevo
              </Button>
            </Link>
          </>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
}

export default PlanWeek;
