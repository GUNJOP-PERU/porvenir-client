import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/Table/DataTable";
import { columns } from "../../components/Monitoring/WorkOrder/columns";
import { useFetchInfinityScroll } from "../../hooks/useGlobalQuery";
import { countItems } from "../../lib/utilsGeneral";
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


function WorkerOrders() {
  const [date, setDate] = useState(getDefaultDate());
  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useFetchInfinityScroll("workOrder", "workOrder/items",20,`date=${date}`);
  useSocketRefetch(["order-ready", "checklist-ready"], refetch);

  return (
    <>
      <PageHeader
        title="Trabajos planificados"
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
        toolbarContent={
                  <>
                   {/* <ExcelExportButton
                      data={data}
                      filename="viajes_realizados"
                      sheetName="Resumen Viajes Realizados"
                      disabled={data.length === 0}
                    /> */}
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

export default WorkerOrders;
