import { useHandleFormSubmit } from "@/hooks/useMutation";
import { dataTypeVehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { CalendarIcon, CircleFadingPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import IconClose from "@/icons/IconClose";
import IconToggle from "@/icons/IconToggle";
import IconLoader from "@/icons/IconLoader";
import { useFetchData } from "@/hooks/useGlobalQuery";

dayjs.locale("es");

const FormSchema = z.object({
  empresaId: z.string().min(1, { message: "*Cargo requerido" }),
  tagName: z.string().min(1, { message: "*Nombre requerido" }),
  plate: z.string().min(1, { message: "*Cargo requerido" }),
  model: z.string().optional(),
  odometer: z.number().optional(),
  horometer: z.number().optional(),
  type: z.string().min(1, { message: "*Rol requerido" }),
  color: z.string().optional(),
  year: z
    .union([z.date(), z.string()])
    .transform((value) => (typeof value === "string" ? new Date(value) : value))
    .optional(),
  description: z.string().optional(),
});

export const ModalVehicle = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const { data } = useFetchData("enterprise", "enterprise");
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tagName: dataCrud?.tagName || "",
      empresaId: dataCrud?.empresaId || "",
      plate: dataCrud?.plate || "",
      model: dataCrud?.model || "",
      odometer: dataCrud?.odometer || 1500,
      horometer: dataCrud?.horometer || 1500,
      type: dataCrud?.type || "",
      color: dataCrud?.color || "",
      year: dataCrud?.year || new Date(),
      description: dataCrud?.description || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        empresaId: dataCrud?.empresaId || "",
        tagName: dataCrud?.tagName || "",
        plate: dataCrud?.plate || "",
        model: dataCrud?.model || "",
        odometer: dataCrud?.odometer || "",
        horometer: dataCrud?.horometer || "",
        type: dataCrud?.type || "",
        color: dataCrud?.color || "",
        year: dataCrud?.year ? new Date(dataCrud.year) : new Date(),
        description: dataCrud?.description || "",
      });
    } else {
      reset({
        empresaId:"",
        tagName: "",
        plate: "",
        model: "",
        odometer: 1500,
        horometer: 1500,
        type: "",
        color: "",
        year: new Date(),
        description: "",
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    const formData = new FormData();
    // Convertimos los datos a JSON y los agregamos al FormData
    formData.append("data", JSON.stringify(data));
  
    // Si hay imagen, la agregamos; si no, enviamos null
    if (data.image) {
      formData.append("image", data.image);
    } else {
      formData.append("image", "null"); // Lo enviamos como "null" 
    }
  
    await handleFormSubmit({
      isEdit,
      endpoint: "vehicle",
      id: dataCrud?._id,
      data: formData,  // Enviamos formData 
      setLoadingGlobal,
      onClose,
      reset,
    });
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={(onClose) => !loadingGlobal && onClose}  modal={true}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>
                {isEdit ? "Editar vehiculo" : "Crear vehiculo"}
              </DialogTitle>
              <DialogDescription>
                Agregue un nuevo vehiculo al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={control}
                name="empresaId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Seleccionar Empresa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Empresa" className="capitalize" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.map((i) => (
                          <SelectItem key={i._id} value={i._id} className="capitalize">
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="tagName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre/Tag</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="plate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Placa</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="model"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Modelo</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="horometer"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Horometro</FormLabel>

                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="odometer"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Odometro</FormLabel>

                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger >
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataTypeVehicle?.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Color</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="year"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha para el plan</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={loadingGlobal}
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP",{ locale: es })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          initialFocus
                          locale={es}
                          onSelect={(range) =>
                            field.onChange(range ? new Date(range) : undefined)
                          }
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Description</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-6 flex gap-2">
              <Button
                type="button"
                className="w-1/2"
                onClick={() => onClose()}
                variant="secondary"
                disabled={loadingGlobal}
              >
                <IconClose className="fill-zinc-400/50 w-4 h-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingGlobal} className="w-1/2">
                {loadingGlobal ? (
                  <>
                    <IconLoader className="w-4 h-4 text-zinc-200 fill-primary animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
