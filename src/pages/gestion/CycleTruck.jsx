import { RefreshCcw, Search } from "lucide-react";
import { DataTable } from "@/components/Gestion/CycleTruck/DataTable";
import { Button } from "../../components/ui/button";

import { columns } from "@/components/Gestion/CycleTruck/CycleTruckTableColumns";
import { activityColumns } from "@/components/Gestion/CycleTruck/CycleTruckActivitiesColumns";
import { useFetchInfinityScrollTruck } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
import { useState } from "react";
import { format } from "date-fns";

function PageCycleTruck() {
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
  } = useFetchInfinityScrollTruck({ queryKey: "cycleTruck", endpoint: "cycle/truck/items", date, search, shift });

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold leading-6">
              Gestión de Ciclos / Truck{" "}
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
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por vehículo..."
            className="flex h-[34px] rounded-[10px] border border-zinc-300 bg-transparent px-3 py-1 text-[13px] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary transition ease-in-out duration-300 pl-8 w-full lg:w-[250px]"
          />
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center rounded-lg bg-zinc-100 px-1 h-8">
            <button
              className={`px-3 h-6 py-1 rounded-md text-xs font-bold transition ease-in-out duration-300 ${
                shift === "dia"
                  ? "bg-orange-300 text-orange-800"
                  : "  text-zinc-300"
              }`}
              onClick={() => setShift("dia")}
              type="button"
            >
              Día
            </button>

            <button
              className={`px-3 h-6 py-1 rounded-md text-xs font-bold transition ease-in-out duration-300 ${
                shift === "noche"
                  ? "bg-sky-200 text-sky-800"
                  : " border-zinc-300 text-zinc-300"
              }`}
              onClick={() => setShift("noche")}
              type="button"
            >
              Noche
            </button>
          </div>

          <label className="text-xs">
            Fecha de Ciclo:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="border rounded-lg px-2 py-1 ml-1"
            />
          </label>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        activityColumns={activityColumns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"cycles"}
        hideToolbar={true}
      />
    </>
  );
}

export default PageCycleTruck;
