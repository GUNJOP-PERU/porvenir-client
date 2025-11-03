import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { dataTurn } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, CircleFadingPlus } from "lucide-react";
import { FilterItems } from "./PlanDayFilterItems";
import IconEdit from "@/icons/IconEdit";
import { ButtonRefresh } from "../../../components/ButtonRefresh";

export const PlanHeader = ({
  form,
  onSubmit,
  dataLaborList,
  refetchLaborList,
  loadingLaborList,
  hasData,
  loadingGlobal,
  frontLaborSubHeader,
  setShowFrontLaborSubHeader
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 justify-between mb-4"
      >
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="shift"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingGlobal}
                  >
                    <SelectTrigger className="w-[90px]">
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTurn?.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <Popover >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={loadingGlobal}
                        className={cn(
                          " w-[90px] capitalize",
                          !field.value && "text-muted-foreground "
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMM", { locale: es })
                        ) : (
                          <span>Fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={es}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
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
          <ButtonRefresh
            refetch={refetchLaborList}
            isFetching={loadingLaborList}
            showText={false}
          />
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setShowFrontLaborSubHeader(!frontLaborSubHeader)}
          >
            {frontLaborSubHeader ? (
              <>
                <IconEdit className="w-5 h-5 stroke-primary" />
                Cancelar
              </>
            ) : (
              <>
                <CircleFadingPlus className="text-primary w-4 h-4" />
                Front Labor
              </>
            )}
          </Button>
        </div>
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
