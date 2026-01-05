import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { useState } from "react";
import { LaborModal } from "../../components/Management/Labor/LaborModal";
import { Button } from "../../components/ui/button";
import {
  useFetchData,
  useFetchInfinityScroll,
} from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
import { columns } from "@/components/Management/Veta/VetaColumns";
import { VetaModal } from "@/components/Management/Veta/VetaModal";

function PageVeta() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("veta-general", "veta");

  return (
    <>
      <PageHeader
        title="Gestión de Veta"
        description="Administre las vetas aquí."
        count={countItems(data || 0)}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />

      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"veta"}
        isLoading={isLoading}
      />

      <VetaModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageVeta;
