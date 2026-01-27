import { columns } from "@/components/Monitoring/Checklist/ChecklistTableColumns";
import { DataTable } from "@/components/Table/DataTable";
import { useFetchInfinityScroll } from "@/hooks/useGlobalQuery";
import { countItems } from "@/lib/utilsGeneral";
import PageHeader from "../../components/PageHeader";
import { useSocketRefetch } from "@/hooks/useSocketValue";
import { useState } from "react";
import { getDefaultDate } from "@/lib/utilsGeneral";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import { es } from "date-fns/locale";

function Checklist() {
  const [date, setDate] = useState(getDefaultDate());
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("checklist", "checklist/items",20,`date=${date}`);
  useSocketRefetch("checklist-ready", refetch);

  return (
    <>
      <PageHeader
        title="Checklist"
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
          </>
        }
      />
    </>
  );
}

export default Checklist;
