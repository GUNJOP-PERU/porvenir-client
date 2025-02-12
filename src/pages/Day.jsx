import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Calendar as CalendarIcon, CircleFadingPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useGlobalStore } from "../store/GlobalStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { useFetchData } from "../hooks/useGlobalQuery";
import { dataTurn } from "../lib/data";

dayjs.locale("es");

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "*Se requiere un título.",
  }),
  description: z.string().min(2, {
    message: "*Campo obligatorio.",
  }),
  dob: z.date({
    required_error: "*Se requiere una fecha.",
  }),

  turno: z.string().min(2, {
    message: "*Se requiere un turno.",
  }),
  selectedItems: z.array(z.string()).nonempty({
    message: "*Debe seleccionar al menos un elemento.",
  }),
});

function DayPage() {
  const { data: dataLaborList, isLoading } = useFetchData(
    "frontLabor",
    "frontLabor"
  );

  const items = useGlobalStore((state) => state.dataGenerateDay);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      dob: null,
      selectedItems: [],
      turno: "",
    },
  });

  async function onSubmit(data) {
    console.log("Datos enviados:", data);

    // Generar estructura con las labores seleccionadas
    const generatedData = generarEstructura(data.dob, data.selectedItems);
    console.log("Datos generados:", generatedData);

    const updatedData = {
      ...data,
      dataHotTable: {
        columns: generatedData.columns,
        data: generatedData.data,
      },
      id: uuidv4(),
    };

    const setDataGenerateDay = useGlobalStore.getState().setDataGenerateDay;
    setDataGenerateDay(updatedData);

    setIsDialogOpen(false); // Cerrar el modal
  }

  const generarEstructura = (dob, selectedItems) => {
    if (!dob) {
      alert("Por favor, seleccione una fecha.");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      alert("Por favor, seleccione al menos una labor.");
      return;
    }

    const fecha = dayjs(dob).locale("es").format("YYYY-MM-DD").toUpperCase();

    const dynamicColumns = [
      { data: "labor", title: "Labor", type: "text" },
      { data: "fase", title: "Fase", type: "text" },
      { data: fecha, title: fecha, type: "numeric" },
    ];

    // Generar datos usando las labores seleccionadas
    const exampleData = selectedItems.map((labor, index) => ({
      labor: labor,
      fase: index % 2 === 0 ? "Extracción / Producción" : "Avance",
      [fecha]: Math.floor(Math.random() * 10000),
    }));

    return {
      columns: dynamicColumns,
      data: [...exampleData],
    };
  };

  console.log(dataLaborList);
  return (
    <>
      <div className="w-full flex justify-between flex-wrap">
        <div>
          <h1 className="text-xl font-bold">
            {" "}
            Gestión de Planificadores Diarios
          </h1>
          <p className="text-zinc-400 text-xs">
            Administre y gestione los planes por turno del día.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">
              <CircleFadingPlus className="w-5 h-5 text-white" />
              Añadir nuevo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear nuevo plan</DialogTitle>
              <DialogDescription>
                Crear un nuevo planificador del mes
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-3 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]">
                  <div>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej. Planificador Septiembre"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej. Descripción..."
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="selectedItems"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selecciona labores</FormLabel>
                          <FormControl>
                            <div className="grid gap-2 overflow-auto h-48">
                              {dataLaborList?.map((item) => (
                                <label
                                  key={item.name}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    value={item.name}
                                    onChange={(e) => {
                                      const selectedValues = field.value || [];
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        field.onChange([
                                          ...selectedValues,
                                          item.name,
                                        ]);
                                      } else {
                                        field.onChange(
                                          selectedValues.filter(
                                            (v) => v !== item.name
                                          )
                                        );
                                      }
                                    }}
                                    checked={field.value.includes(item.name)}
                                  />
                                  {item.name}
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="turno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selecciona en turno</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                              </FormControl>
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
                  </div>
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha para el plan</FormLabel>
                        <FormControl>
                          <div className=" w-fit justify-start text-xs flex gap-2 text-left font-normal rounded-lg bg-zinc-50 px-2 py-1.5">
                            <CalendarIcon className="h-4 w-4 text-zinc-400" />
                            {field.value ? (
                              format(field.value, "LLL dd, y", { locale: es })
                            ) : (
                              <span className="text-zinc-400">
                                Seleccione fecha
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(range) => field.onChange(range)}
                          initialFocus
                          locale={es}
                        />
                        <FormDescription>
                          La fecha se usa para calcular la cantidad de filas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="flex gap-2 justify-between ">
                  <Button className="w-1/2" type="submit">
                    Crear
                  </Button>
                  <DialogClose asChild>
                    <Button className="w-1/2" variant="secondary" type="button">
                      Cancelar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
   
    </>
  );
}

export default DayPage;
