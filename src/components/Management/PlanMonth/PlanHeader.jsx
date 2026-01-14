import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconEdit from "@/icons/IconEdit";
import { dataTurn } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format, getDaysInMonth, getMonth, getYear } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, CircleFadingPlus } from "lucide-react";
import { useState } from "react";
import { FilterItems } from "../PlanDay/PlanDayFilterItems";
import { Calendar } from "@/components/ui/calendar";
import { startOfWeek } from "date-fns";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { generateNormalWeeks } from "@/components/Dashboard/WeekReport/MiningWeeksSelect";
import dayjs from "dayjs";

export const PlanHeader = ({
  form,
  onSubmit,
  hasData,
  loadingGlobal,
  mode,
  isEdit,
}) => {
  const { data: dataLaborList, refetch: refetchLaborList, isFetching: isLaborListFetching } = useFetchData(
    "frontLabor-current",
    "frontLabor/current",
    {
      enabled: true,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    }
  );

  const { allWeeks, currentWeek } = generateNormalWeeks();

  const inicioSemanaActual = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const years = Array.from(
    { length: 4 },
    (_, i) => getYear(new Date()) - 3 + i
  );

  const updateDate = (month, year, field) => {
    const startOfMonth = dayjs()
      .year(year)
      .month(month)
      .startOf("month")
      .toDate();

    const endOfMonth = dayjs().year(year).month(month).endOf("month").toDate();

    setSelectedDate(startOfMonth);
    field.onChange({
      start: startOfMonth,
      end: endOfMonth,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-2 justify-between"
      >
        <div className="flex gap-2">
          {!isEdit && mode === "weekly" && (
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Select
                    value={field.value?.weekNumber?.toString() || ""}
                    onValueChange={(value) => {
                      const selectedWeek = allWeeks.find(
                        (w) => w.weekNumber.toString() === value
                      );

                      if (selectedWeek) {
                        field.onChange({
                          start: selectedWeek.start,
                          end: selectedWeek.end,
                          weekNumber: selectedWeek.weekNumber,
                        });
                      }
                    }}
                    disabled={loadingGlobal}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Seleccione Semana"
                          className="capitalize"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allWeeks?.map((i) => (
                        <SelectItem
                          key={i.weekNumber}
                          value={i.weekNumber.toString()}
                          className="capitalize"
                        >
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isEdit && mode === "monthly" && (
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={loadingGlobal}
                          className={cn(
                            "w-[180px] capitalize",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          {selectedDate ? (
                            format(selectedDate, "MMMM yyyy", { locale: es })
                          ) : (
                            <span>Seleccionar Mes y Año</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-2 z-[99999]"
                      align="start"
                    >
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) =>
                            updateDate(
                              parseInt(value),
                              getYear(selectedDate),
                              field
                            )
                          }
                          value={getMonth(selectedDate).toString()}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Mes" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value) =>
                            updateDate(
                              getMonth(selectedDate),
                              parseInt(value),
                              field
                            )
                          }
                          value={getYear(selectedDate).toString()}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="selectedItems"
            render={({ field }) => (
              <FormItem>
                <FilterItems
                  column={""}
                  title="Labor"
                  options={dataLaborList}
                  field={field}
                  loadingGlobal={loadingGlobal}
                  refetch={refetchLaborList}
                  isFetching={isLaborListFetching}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botón de Enviar */}
        <Button type="submit" disabled={loadingGlobal} variant="tertiary">
          {hasData ? (
            <>
              <IconEdit className="w-5 h-5 stroke-primary" />
              Actualizar Plan
            </>
          ) : (
            <>
              <CircleFadingPlus className="text-primary w-4 h-4" />
              Crear Nuevo Plan
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
