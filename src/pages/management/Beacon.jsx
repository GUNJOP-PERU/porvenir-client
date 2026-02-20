import { columns } from "@/components/Management/Beacon/BeaconColumns";
import { BeaconModal } from "@/components/Management/Beacon/BeaconModal";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { useState } from "react";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
import { TabsItems } from "@/components/ZShared/TabsItems";
import { useTabsFilter } from "@/hooks/useTabsFilter";

export default function PageBeacon() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("beacon", "beacon");

  const [dialogOpen, setDialogOpen] = useState(false);

  const { items, filteredData, activeTab, setActiveTab, countByTab } =
    useTabsFilter(data, "location", { showCount: true });

  return (
    <>
      <PageHeader
        title="Gestión de Beacons"
        count={countItems(filteredData)}
        description="Administre los beacons de su equipo aquí."
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />
      <DataTable
        data={filteredData}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"beacon"}
        isLoading={isLoading}
        toolbarContent={
          <>
            {items.length > 1 && (
              <TabsItems
                items={items}
                activeTab={activeTab}
                onSelect={setActiveTab}
                countByTab={countByTab}
              />
            )}
          </>
        }
      />
      <BeaconModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}
