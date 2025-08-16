import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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

export const PlanHeader = ({
  form,
  onSubmit,
  dataLaborList,
  hasData,
  loadingGlobal,
}) => {
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
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {field.value?.start ? (
                        field.value?.end ? (
                          <>
                            {format(field.value.start, "dd MMM", { locale: es })}{" "}
                            - {format(field.value.end, "dd MMM", { locale: es })}
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
                        to: field.value?.end
                      }}
                      captionLayout="dropdown"
                      locale={es}
                      onSelect={(date) => {
                        field.onChange({
                          start: date?.from,
                          end: date?.to
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
