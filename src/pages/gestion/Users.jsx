import PageHeader from "@/components/Gestion/PageHeader";
import { DataTable } from "@/components/Gestion/Table/DataTable";
import { columns } from "@/components/Gestion/Users/columns";
import { useState } from "react";
import { ModalUser } from "../../components/Gestion/Users/ModalUser";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function HomeUsers() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("user", "user");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Gestión de Usuarios"
        description="Administre los usuarios aquí."
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
        tableType={"users"}
        isLoading={isLoading}
      />
      <ModalUser
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default HomeUsers;
