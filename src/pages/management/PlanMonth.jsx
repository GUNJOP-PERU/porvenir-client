import { columns } from "@/components/Management/PlanMonth/columns";
import { countItems } from "@/lib/utilsGeneral";
import { CircleFadingPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/Table/DataTable";
import { Button } from "../../components/ui/button";
import { useFetchData } from "../../hooks/useGlobalQuery";
import PageHeader from "../../components/PageHeader";

function PlanMonth() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("planMonth", "planMonth");

  return (
    <>
      <PageHeader
        title="Gestión de Plan Mensual"
        description="Administre los planes y sus caractestisticas."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
        actions={
          <>
          <Link to={`/newPlanMonth`}>
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

export default PlanMonth;
