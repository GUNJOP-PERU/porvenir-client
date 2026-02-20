import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { columns } from "@/components/Management/Users/columns";
import { useState } from "react";
import { ModalUser } from "../../components/Management/Users/ModalUser";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
import { TabsItems } from "@/components/ZShared/TabsItems";
import { useTabsFilter } from "@/hooks/useTabsFilter";

function HomeUsers() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("user", "user");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    items: cargos,
    filteredData,
    activeTab,
    setActiveTab,
    countByTab,
  } = useTabsFilter(data, "cargo", { showCount: true });

  return (
    <>
      <PageHeader
        title="Gestión de Usuarios"
        description="Administre los usuarios aquí."
        count={countItems(filteredData)}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />
      <DataTable
        data={filteredData}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"users"}
        isLoading={isLoading}
        toolbarContent={
          <>
            {cargos.length > 1 && (
              <TabsItems
                items={cargos}
                activeTab={activeTab}
                onSelect={setActiveTab}
                countByTab={countByTab}
              />
            )}
          </>
        }
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
