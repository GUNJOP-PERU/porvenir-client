import { DataTable } from "@/components/Table/DataTable";
import { columns } from "@/components/Management/Wap/WapColumns";
import { ModalWap } from "@/components/Management/Wap/WapModal";
import { useState } from "react";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
import PageHeader from "@/components/PageHeader";

export default function PageWap() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("wifis", "wifis", { useSecondary: true });

  return (
    <>
      <PageHeader
        title="Gestión de WAPs (Wifis)"
        count={countItems(data)}
        description="Administre los WAP de su equipo aquí."
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"wifis"}
        isLoading={isLoading}
        onRetry={refetch}
      />
      <ModalWap isOpen={dialogOpen} onClose={() => setDialogOpen(false)} useSecondary={true} />
    </>
  );
}


