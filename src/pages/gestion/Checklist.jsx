import { columns } from "@/components/Gestion/Checklist/ChecklistTableColumns";
import { DataTable } from "@/components/Gestion/Table/DataTable";
import { useFetchInfinityScroll } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import PageHeader from "../../components/PageHeader";

function Checklist() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("checklist", "checklist/items");

  return (
    <>
      <PageHeader
        title="Gestión de Checklist"
        description="Administre los checklists de su equipo aquí."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"checklists"}
      />
    </>
  );
}

export default Checklist;
