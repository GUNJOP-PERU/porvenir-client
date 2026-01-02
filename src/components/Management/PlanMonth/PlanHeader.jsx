import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

export const PlanHeader = ({
  form,
  onSubmit,
  hasData,
  loadingGlobal,
  mode,
}) => {
  const { data: dataLaborList, refetch: refetchLaborList } = useFetchData(
    "frontLabor-current",
    "frontLabor/current",
    {
      enabled: true,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    }
  );

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
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month, getDaysInMonth(startOfMonth));

    setSelectedDate(startOfMonth);
    field.onChange({ start: startOfMonth, end: endOfMonth });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap gap-2 justify-between"
      >
        <div className="flex gap-2">
          {/* Selección de Mes y Año */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                {mode === "weekly" ? (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-40 justify-between font-normal capitalize"
                        >
                          {field.value?.start ? (
                            field.value?.end ? (
                              <>
                                {format(field.value.start, "dd MMM", {
                                  locale: es,
                                })}{" "}
                                -{" "}
                                {format(field.value.end, "dd MMM", {
                                  locale: es,
                                })}
                              </>
                            ) : (
                              format(field.value.start, "dd MMM", {
                                locale: es,
                              })
                            )
                          ) : (
                            <span>Seleccionar Rango</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-2 z-[99999]"
                        align="start"
                      >
                        <Calendar
                          mode="range"
                          disabled={{
                            before: inicioSemanaActual,
                          }}
                          defaultMonth={field.value?.start}
                          selected={{
                            from: field.value?.start,
                            to: field.value?.end,
                          }}
                          captionLayout="dropdown"
                          locale={es}
                          onSelect={(date) => {
                            field.onChange({
                              start: date?.from,
                              end: date?.to,
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </>
                ) : (
                  <>
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
                                <SelectItem
                                  key={index}
                                  value={index.toString()}
                                >
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
                  </>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selección de Labor */}
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
              Actualizar
            </>
          ) : (
            <>
              <CircleFadingPlus className="text-primary w-4 h-4" />
              Crear
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
