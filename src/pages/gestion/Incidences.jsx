import { columns } from "@/components/Gestion/Incidence/IncidenceColumns";
import { IncidenceModal } from "@/components/Gestion/Incidence/IncidenceModal";
import PageHeader from "@/components/Gestion/PageHeader";
import { DataTable } from "@/components/Gestion/Table/DataTable";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { useState } from "react";

export default function Incidence() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data = [],
    isFetching,
    isError,
    refetch,
  } = useFetchData("vehicle-incidence", "vehicle-incidence");

  return (
    <>
      <PageHeader
        title="Incidencias del Truck | Scoop"
        count={countItems(data || 0)}
        description="Administre las incidencias de los vehículos."
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
      <IncidenceModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}
