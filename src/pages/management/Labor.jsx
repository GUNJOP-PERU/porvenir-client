import LaborImport from "@/components/Management/Labor/LaborImport";
import { columns } from "@/components/Management/Labor/LaborTableColumns";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { LaborModal } from "../../components/Management/Labor/LaborModal";
import { Button } from "../../components/ui/button";
import {
  useFetchInfinityScroll,
} from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function PageLabor() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("frontLabor", "frontLabor/items");
  
  return (
    <>      
      <PageHeader
        title="Gestión de Labor"
        description="Administre los labor aquí."
        count={countItems(data || 0)}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
        actions={
          <>
            <Button
              disabled={isFetching || isError}
              onClick={() => setImportOpen(true)}
              className="w-fit"
              variant="outline"
            >
              <FileUp className="w-5 h-5 text-zinc-400" />
              Importar
            </Button>            
          </>
        }
      />
    
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"frontLabors"}
      />
      
      <LaborModal
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
      <LaborImport
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </>
  );
}

export default PageLabor;