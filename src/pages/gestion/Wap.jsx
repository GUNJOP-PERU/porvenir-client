import { DataTable } from "@/components/Gestion/DataTable";
import { columns } from "@/components/Gestion/Wap/WapColumns";
import { ModalWap } from "@/components/Gestion/Wap/WapModal";
import IconMore from "@/icons/IconMore";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { useFetchData } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function PageWap() {
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData("wap", "wap");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-bold leading-6">
              Gestión de WAP{" "}
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los WAP de su equipo aquí.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            disabled={isFetching || isError}
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>

          <Button
            onClick={() => setDialogOpen(true)}
            className="w-fit"
            // disabled={isFetching || isError}
          >
            <IconMore className="w-5 h-5 fill-white" />
            Añadir nuevo
          </Button>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isError={isError}
        tableType={"wap"}
        isLoading={isLoading}
      />
      <ModalWap isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}

export default PageWap;
