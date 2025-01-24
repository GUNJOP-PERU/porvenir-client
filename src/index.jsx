import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Idioma español
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import CardItems from "./components/CardItems";
import { Button } from "./components/ui/button";
import { Calendar } from "./components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { useGlobalStore } from "./store/GlobalStore";
import { useState } from "react";

dayjs.locale("es");

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "*Se requiere un título.",
  }),
  description: z.string().min(2, {
    message: "*Campo obligatorio.",
  }),
  dob: z
    .object({
      from: z.date({
        required_error: "*Se requiere una fecha de inicio.",
      }),
      to: z.date({
        required_error: "*Se requiere una fecha de fin.",
      }),
    })
    .refine((dob) => dob.from && dob.to && dob.from <= dob.to, {
      message:
        "La fecha de inicio debe ser anterior o igual a la fecha de fin.",
    }),
  numberRows: z.number().min({ message: "*Debe ser un número" }),
});

function HomePage() {
  const items = useGlobalStore((state) => state.dataGenerate);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para el modal
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      dob: {
        from: null,
        to: null,
      },
      numberRows: 20,
    },
  });

  async function onSubmit(data) {
    console.log("Datos enviados:", data);
    const generatedData = generarEstructura(data.dob, data.numberRows);
    console.log("Datos generados:", generatedData);
  
    const updatedData = {
      ...data,
      dataHotTable: {
        columns: generatedData.columns,
        data: generatedData.data,
      },
      // Generar un ID único usando uuid
      id: uuidv4(),  
    };
  
    const setDataGenerate = useGlobalStore.getState().setDataGenerate;
    setDataGenerate(updatedData);
    setIsDialogOpen(false); // Cerrar el modal
  }

  const generarEstructura = (dob, numberRows) => {
    if (!dob.from || !dob.to) {
      alert("Por favor, seleccione un rango de fechas.");
      return;
    }
  
    const fechas = [];
    let currentDate = dayjs(dob.from);
    const end = dayjs(dob.to);
    while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
      // Formato 01-NOV
      fechas.push(currentDate.locale("es").format("YYYY-MM-DD").toUpperCase());
      currentDate = currentDate.add(1, "day");
    }
  
    const dynamicColumns = [
      { data: "labor", title: "Labor", type: "text" },
      { data: "fase", title: "Fase", type: "text" },
      ...fechas.map((fecha) => ({
        data: fecha,
        title: fecha,
        type: "numeric",
      })),
    ];
  
    const exampleData = Array.from({ length: numberRows }).map((_, index) => ({
      labor: `T-${index + 1}_OB1_${Math.floor(Math.random() * 1000)}`,
      fase: index % 2 === 0 ? "Extracción / Producción" : "Avance",
      ...fechas.reduce(
        (acc, fecha) => ({
          ...acc,
          [fecha]: Math.floor(Math.random() * 10000),
        }),
        {}
      ),
    }));
  
    const summaryRow = {
      labor: "Total",
      fase: null, 
      ...fechas.reduce(
        (acc, fecha) => ({
          ...acc,
          [fecha]: 0, 
        }),
        {}
      ),
    };
  
    return {
      columns: dynamicColumns,
      data: [...exampleData, summaryRow], 
    };
  };


  return (
    <>
      <div className="w-full flex justify-between flex-wrap">
        <div>
          <h1 className="text-xl font-bold">  Gestión de Planificadores Mensuales</h1>
          <p className="text-zinc-400 text-xs">
            Administre y gestione los planes por turno del mes.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Crear nuevo</Button>
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
                          <FormDescription>
                            Este es el nombre del planificador
                          </FormDescription>
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
                          <FormDescription>
                            Este es la descripción del planificador
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberRows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Filas</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Ej. 123456"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Este es la cantidad de filas iniciales
                          </FormDescription>
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
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span className="text-zinc-400">
                                Seleccione fecha
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <Calendar
                          mode="range"
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
               
                  <Button  className="w-1/2"  type="submit">Crear</Button>
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
     <CardItems items={items}/>
    </>
  );
}

export default HomePage;
