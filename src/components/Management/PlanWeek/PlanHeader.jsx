import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import IconEdit from "@/icons/IconEdit";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, CircleFadingPlus } from "lucide-react";
import { FilterItems } from "../PlanDay/PlanDayFilterItems";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export const PlanHeader = ({
  form,
  dataLaborList,
  isEdit,
  loadingGlobal,
  setLoadingGlobal,
  setShowLoader,
  setDataHotTable,
}) => {
  const onSubmit = (data) => {
    setLoadingGlobal(true);
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      const generatedData = generarEstructura(data.dob, data.selectedItems);
      if (generatedData) {
        setDataHotTable(generatedData.data);
      }
      setLoadingGlobal(false);
    }, 1500);
  };

  const generarEstructura = (dob, selectedItems) => {
    if (!dob?.start || !dob?.end) {
      alert("Debe seleccionar una fecha válida.");
      return { data: [] };
    }

    const startDate = dayjs(dob.start);
    const endDate = dayjs(dob.end);
    const daysInMonth = endDate.diff(startDate, "day") + 1;

    const items =
      Array.isArray(selectedItems) && selectedItems.length > 0
        ? selectedItems
        : [""];

    const exampleData = items.map((labor, index) => {
      let row = {
        labor,
        fase: index % 2 === 0 ? "mineral" : "desmonte",
      };

      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = startDate.add(i, "day").format("DD-MM");

        // 🔹 Dos columnas por día
        row[`${currentDate} - DIA`] = 0;
        row[`${currentDate} - NOCHE`] = 0;
      }

      return row;
    });

    return { data: exampleData };
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
                            {format(field.value.end, "dd MMM", { locale: es })}
                          </>
                        ) : (
                          format(field.value.start, "dd MMM", { locale: es })
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
                        before: new Date(),
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="week"
            render={({ field }) => (
              <FormItem className="">
                <div className="flex items-center gap-4 border pl-4 pr-1 py-0 rounded-lg h-8 max-w-[150px]">
                  <div className="text-xs flex flex-col">
                    <b className="text-[8px] leading-[10px]">N° de la</b>
                    <span className="text-xs leading-3">Semana</span>
                  </div>
                  <Input
                    type="number"
                    disabled={loadingGlobal}
                    placeholder="Ej. 12345678"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className="w-full py-0 h-7 rounded-md !my-0 border-none bg-zinc-100"
                  />
                </div>
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
          {isEdit ? (
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
