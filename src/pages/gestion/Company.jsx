import { DataTable } from "@/components/Gestion/Table/DataTable";
import { useState } from "react";
import { ModalCompany } from "@/components/Gestion/Company/CompanyModal";
import { columns } from "@/components/Gestion/Company/CompanyTableColumns";
import PageHeader from "@/components/Gestion/PageHeader";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";

function PageCompany() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching, 
    isLoading,
    isError,
    refetch,
  } = useFetchData("enterprise", "enterprise");

  return (
    <>
     <PageHeader
        title="Gestión de Empresas"
        description="Administre los empresas aquí."
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
        tableType={"enterprises"}
        isLoading={isLoading}
      />
      <ModalCompany
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageCompany;
