import { ModalPlanDay } from "@/components/Management/PlanDay/PlanDayModal";
import { columns } from "@/components/Management/PlanDay/PlanDayTableColumns";
import { DataTable } from "@/components/Table/DataTable";
import { countItems } from "@/lib/utilsGeneral";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useFetchInfinityScroll } from "../../hooks/useGlobalQuery";

function PlanDay() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("planDay", "planDay/items");

  return (
    <>
      <PageHeader
        title="Gestión de Plan Diario"
        description="Administre los planes y sus caractestisticas."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"planDays"}
      />
      <ModalPlanDay
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}      
      />
    </>
  );
}

export default PlanDay;
