import { columns } from "@/components/Dashboard/Trips/TripsColumns";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFetchTrucks } from "@/hooks/useGlobalQuery";
import { countItems, getDefaultDate } from "@/lib/utilsGeneral";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

export default function PageTrips() {
  const [date, setDate] = useState(getDefaultDate());
  const [selectedUnit, setSelectedUnit] = useState("all");

  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchTrucks({
    queryKey: "trip-truck",
    endpoint: "trip/all",
    filters: `startDate=${date}&endDate=${date}`,
  });

  const uniqueUnits = useMemo(() => {
    const units = data.map((trip) => trip.unit).filter(Boolean);
    return [...new Set(units)].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedUnit === "all") return data;
    return data.filter((trip) => trip.unit === selectedUnit);
  }, [data, selectedUnit]);

  return (
    <>
      <PageHeader
        title="Lista de viajes realizados"
        count={countItems(filteredData || 0)}
        description="Administre los viajes realizados aqui."
        refetch={refetch}
        isFetching={isFetching}
      />

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        tableType={"trips"}
        toolbarContent={
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={isFetching}
                  className="w-[140px] capitalize active:scale-100 justify-between px-2"
                >
                  <div className="flex  gap-2">
                    <CalendarIcon className="h-4 w-4 text-zinc-300" />
                    {date ? (
                      dayjs(date).format("DD MMM YYYY")
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
                  selected={date ? dayjs(date).toDate() : undefined}
                  onSelect={(d) => {
                    const formattedDate = dayjs(d).format("YYYY-MM-DD");
                    setDate(formattedDate);
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

            <Select
              value={selectedUnit}
              onValueChange={(value) => setSelectedUnit(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filtrar por unidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las unidades</SelectItem>
                {uniqueUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    CAM {unit.split("-").pop()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />
    </>
  );
}
