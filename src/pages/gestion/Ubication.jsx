import { DataTable } from "@/components/Gestion/Table/DataTable";
import { columns } from "@/components/Gestion/Ubication/UbicationColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItemsByType } from "../../lib/utilsGeneral";

function PageUbications() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("ubications", "beacon/ubications");
  const categories = Object.keys(data);

  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    const keys = Object.keys(data || {});
    if (keys.length > 0 && !selectedTab) {
      setSelectedTab(keys[0]);
    }
  }, [data, selectedTab]);
  

  return (
    <>
      <PageHeader
        title="Gestión de Ubicaciones"
        description="Administre las ubicaciones de su equipo aquí."
        count={countItemsByType(data, selectedTab)}
        refetch={refetch}
        isFetching={isFetching}        
      />
      {selectedTab && (
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full mt-4"
      >
        <TabsList>
          {categories.map((key) => (
            <TabsTrigger key={key} value={key} className="capitalize">
              {key}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((key) => (
          <TabsContent key={key} value={key}>
            <DataTable
              data={data[key]}
              columns={columns}
              isFetching={isFetching}
              isError={isError}
              tableType={key}
              isLoading={isLoading}
            />
          </TabsContent>
        ))}
      </Tabs>
      )}   
    </>
  );
}

export default PageUbications;
