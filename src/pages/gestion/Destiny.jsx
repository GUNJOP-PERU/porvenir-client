import { columns } from "@/components/Gestion/Destiny/DestinyColumns";
import { DestinyModal } from "@/components/Gestion/Destiny/DestinyModal";
import { DataTable } from "@/components/Gestion/Table/DataTable";
import { useState } from "react";
import PageHeader from "../../components/Gestion/PageHeader";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function PageDestiny() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("destination", "destination");
  
  return (
    <>
      <PageHeader
        title="Gestión de Destino"
        description="Administre los destinos de sus vehículos aquí."
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
        tableType={"destiny"}
        isLoading={isLoading}
      />

      <DestinyModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageDestiny;
