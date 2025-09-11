import { activityColumns } from "@/components/Gestion/CycleTruck/CycleTruckActivitiesColumns";
import { columns } from "@/components/Gestion/CycleTruck/CycleTruckTableColumns";
import { DataTable } from "@/components/Gestion/CycleTruck/DataTable";
import PageHeader from "@/components/Gestion/PageHeader";
import { DataExport } from "@/components/Gestion/Table/DataExport";
import { Filters } from "@/components/Gestion/Table/DataFilter";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getDefaultDate, getDefaultShift } from "@/lib/utilsGeneral";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import {
  CalendarIcon,
  ChevronDown,
  Search
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../../components/ui/button";
import { useFetchInfinityScrollTruck } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";

function PageCycleTruck() {
  const [form, setForm] = useState({
    date: getDefaultDate(),
    search: "",
    shift: getDefaultShift(),
    isValid: true,
    material: "Mineral",
  });

  const [debouncedSearch] = useDebounce(form.search, 500);
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScrollTruck({
    queryKey: "cycleTruck",
    endpoint: "cycle/truck/items",
    filters: `vehicle=${debouncedSearch}&shift=${form.shift}&date=${form.date}&isValid=${form.isValid}&material=${form.material}`,
  });

  const groups = [
    {
      title: "Material",
      formKey: "material",
      options: [
        { value: "Mineral", label: "Mineral" },
        { value: "Desmonte", label: "Desmonte" },
      ],
    },
    {
      title: "Estado",
      formKey: "isValid",
      options: [
        { value: true, label: "Completado" },
        { value: false, label: "Interrumpido" },
      ],
    },
    {
      title: "Turno",
      formKey: "shift",
      options: [
        { value: "dia", label: "Día" },
        { value: "noche", label: "Noche" },
      ],
    },
  ];
  return (
    <>
      <PageHeader 
        title="Ciclos Truck"
        count={countItems(data || 0)}
        description="Administre los ciclos de Truck aquí."
        refetch={refetch}
        isFetching={isFetching}
        />
      <div className="flex flex-wrap gap-1 justify-between items-center">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
          <input
            type="text"
            value={form.search}
            onChange={(e) => setForm({ ...form, search: e.target.value })}
            placeholder="Buscar por vehículo..."
            className="flex h-8 rounded-[10px] border border-zinc-300 bg-transparent px-3 py-1 text-[13px] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary transition ease-in-out duration-300 pl-8 w-full lg:w-[250px]"
            disabled={isFetching}
          />
        </div>
        <div className="flex flex-wrap gap-1 items-center">
          <Filters form={form} setForm={setForm} isFetching={isFetching} groups={groups}/>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={isFetching}
                className="w-[140px] capitalize active:scale-100 justify-between px-2"
              >
                <div className="flex  gap-2">
                  <CalendarIcon className="h-4 w-4 text-zinc-300" />
                  {form.date ? (
                    dayjs(form.date).format("DD MMM YYYY")
                  ) : (
                    <span>Fecha</span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <Calendar
                mode="single"
                selected={form.date ? dayjs(form.date).toDate() : undefined}
                onSelect={(d) => {
                  const formattedDate = dayjs(d).format("YYYY-MM-DD");
                  setForm({ ...form, date: formattedDate });
                }}
                initialFocus
                locale={es}
                disabled={(d) => {
                  const today = dayjs().startOf("day");
                  const tomorrow = today.add(1, "day");
                  return dayjs(d).isAfter(tomorrow, "day");
                }}
              />
            </PopoverContent>
          </Popover>
          <DataExport data={data} fileName="ciclos-truck" disabled={data.length === 0 || isFetching} />
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

