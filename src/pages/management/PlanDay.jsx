import { PlanDayDetails } from "@/components/Management/PlanDay/PlanDayDetails";
import { ModalPlanDay } from "@/components/Management/PlanDay/PlanDayModal";
import { DataExport } from "@/components/Table/DataExport";
import { Filters } from "@/components/Table/DataFilter";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchData } from "@/hooks/useGlobalQueryV2";
import { countItems } from "@/lib/utilsGeneral";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";

function PlanDay() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    shift: "dia",
  });

  const groups = [
    {
      title: "Turno",
      formKey: "shift",
      options: [
        { value: "dia", label: "Día" },
        { value: "noche", label: "Noche" },
      ],
    },
  ];

  const {
    data = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useFetchData(
    "planDay",
    "planDay/groups?type=blending",
    `date=${form.date}&shift=${form.shift}&populate=true`
  );

  return (
    <>
      <PageHeader
        title="Gestión del Plan de Turno"
        description="Administre los planes y sus caractestisticas."
        count={countItems(data)}
        refetch={refetch}
        isFetching={isFetching}
        setDialogOpen={setDialogOpen}
      />

      <div className="flex items-center justify-end gap-2">
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
        </Popover>{" "}
        <div className="flex rounded-lg overflow-hidden border">
          <Button
            variant={form.shift === "dia" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => setForm({ ...form, shift: "dia" })}
          >
            Día
          </Button>

          <Button
            variant={form.shift === "noche" ? "default" : "ghost"}
            className="rounded-none"
            onClick={() => setForm({ ...form, shift: "noche" })}
          >
            Noche
          </Button>
        </div>
        <DataExport
          data={data}
          fileName="data-table"
          disabled={data.length === 0 || isFetching}
        />
      </div>
      <PlanDayDetails dataCrud={data} />
      <ModalPlanDay isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
export default PlanDay;
