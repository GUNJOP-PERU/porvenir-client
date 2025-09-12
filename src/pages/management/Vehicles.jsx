import { DataTable } from "@/components/Table/DataTable";
import { columns } from "@/components/Management/Vehicle/columns";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { ModalVehicle } from "../../components/Management/Vehicle/ModalVehicle";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function Vehicles() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("vehicle", "vehicle");

  return (
    <>
      <PageHeader
        title="Gestión de Vehiculos"
        description="Administre los vehiculos aquí."
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
        tableType={"vehicles"}
        isLoading={isLoading}
      />
      <ModalVehicle isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}

export default Vehicles;
