import { columns } from "@/components/Management/Beacon/BeaconColumns";
import { BeaconModal } from "@/components/Management/Beacon/BeaconModal";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { useState } from "react";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

export default function PageBeacon() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("beacon", "beacon");

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Gestión de Beacons"
        count={countItems(data)}
        description="Administre los beacons de su equipo aquí."
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />
      
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"beacon"}
        isLoading={isLoading}
      />
      <BeaconModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

