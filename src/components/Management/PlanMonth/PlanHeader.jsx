/* eslint-disable react/prop-types */
import { generateNormalWeeks } from "@/components/Dashboard/WeekReport/MiningWeeksSelect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconEdit from "@/icons/IconEdit";
import { CircleFadingPlus } from "lucide-react";
import { FilterItems } from "../PlanDay/PlanDayFilterItems";
import { MonthYearPicker } from "@/components/ZShared/MonthYearPicker";

export const PlanHeader = ({
  form,
  onSubmit,
  hasData,
  loadingGlobal,
  mode,
  isEdit,
}) => {
  const { allWeeks } = generateNormalWeeks();

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
                        (w) => w.weekNumber.toString() === value,
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
                <FormControl>
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loadingGlobal}
                  />
                </FormControl>
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
                  title="Seleccionar Labor(es)"
                  field={field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loadingGlobal} variant="tertiary">
          {hasData ? (
            <>
              <IconEdit className="w-5 h-5 stroke-primary" />
              Actualizar Listado
            </>
          ) : (
            <>
              <CircleFadingPlus className="text-primary w-4 h-4" />
              Generar Tabla
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
