import { RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/Gestion/DataTable";
import { columns } from "@/components/Gestion/Ubication/UbicationColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
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
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold leading-6">
              Gestión de Ubicaciones{" "}
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
            {countItemsByType(data, selectedTab)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre las ubicaciones de su equipo aquí.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"         
            disabled={isFetching}
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Refrescar
            </span>
          </Button>
        </div>
      </div>
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
