import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/Gestion/DataTable";
import { Button } from "@/components/ui/button";

import { ModalActivity } from "@/components/Gestion/Activity/ActivityModal";
import { columns } from "@/components/Gestion/Activity/ActivityTableColumns";
import { useFetchInfinityScroll } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import { format } from "date-fns";
import { Search } from "lucide-react";

function PageActivity() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [search, setSearch] = useState("");
  const [shift, setShift] = useState("dia");
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll(
    "activityTruck",
    "activity/truck/items",
    12,
    `vehicle=${search}&shift=${shift}&date=${date}`
  );

  useEffect(() => {
    // Reset the page when the date changes
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, search, shift])

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">
              Gestión de Actividades / Truck
            </h1>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] w-5 h-5 flex items-center justify-center font-bold ">
              {countItems(data)}
            </span>{" "}
          </div>
          <p className="text-zinc-400 text-xs">
            Administre los miembros de su equipo y los permisos de sus cuentas
            aquí.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            disabled={isFetching}
          >
            <RefreshCcw className="w-5 h-5 text-zinc-400" />
          </Button>

          {/* <Button onClick={() => setDialogOpen(true)} className="w-fit" disabled={isFetching || isError}>
            <CircleFadingPlus className="w-5 h-5 text-white" />
            Añadir nuevo
          </Button> */}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center my-4">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por vehículo..."
            className="flex h-[34px] rounded-[10px] border border-zinc-300 bg-transparent px-3 py-1 text-[13px] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary transition ease-in-out duration-300 pl-8 w-full lg:w-[250px]"
          />
        </div>

        <div className="flex gap-3 items-center">
          <button
            className={`px-3 py-1 rounded text-xs font-bold border ${shift === "dia" ? "bg-yellow-200 border-yellow-400 text-yellow-800" : "bg-white border-zinc-300 text-zinc-400"}`}
            onClick={() => setShift("dia")}
            type="button"
          >
            Día
          </button>

          <button
            className={`px-3 py-1 rounded text-xs font-bold border ${shift === "noche" ? "bg-blue-200 border-blue-400 text-blue-800" : "bg-white border-zinc-300 text-zinc-400"}`}
            onClick={() => setShift("noche")}
            type="button"
          >
            Noche
          </button>

          <label className="text-xs">
            Fecha:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="border rounded px-2 py-1 ml-1"
            />
          </label>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"activities"}
        hideToolbar={true}
      />
      <ModalActivity
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={false}
      />
    </>
  );
}

export default PageActivity;
