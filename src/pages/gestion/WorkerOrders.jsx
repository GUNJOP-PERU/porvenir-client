import PageHeader from "@/components/Gestion/PageHeader";
import { DataTable } from "@/components/Gestion/Table/DataTable";
import { columns } from "../../components/Monitoring/WorkOrder/columns";
import { useFetchInfinityScroll } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function WorkerOrders() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("workOrder", "workOrder/items");
 
  return (
    <>
      <PageHeader
        title="Gestión de Trabajos planificados"
        description="Administre los trabajos planificados de su equipo aquí."
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
        tableType={"workerOrders"}
      />
    </>
  );
}

export default WorkerOrders;
