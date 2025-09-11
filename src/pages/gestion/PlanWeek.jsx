import PageHeader from "@/components/Gestion/PageHeader";
import { PlanWeekModal } from "@/components/Gestion/PlanWeek/PlanWeekModal";
import { columns } from "@/components/Gestion/PlanWeek/columns";
import { DataTable } from "@/components/Gestion/Table/DataTable";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { useState } from "react";

function PlanWeek() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isError,
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
        setDialogOpen={setDialogOpen}
      />
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
