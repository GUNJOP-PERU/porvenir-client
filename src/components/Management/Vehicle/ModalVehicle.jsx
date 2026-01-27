import { useFetchData } from "@/hooks/useGlobalQuery";
import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { dataTypeVehicle } from "@/lib/data";
import { zodResolver } from "@hookform/resolvers/zod";
import "dayjs/locale/es";
import { CircleFadingPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const FormSchema = z.object({
  empresaId: z.string().min(1, { message: "*Empresa requerida" }),
  tagName: z.string().min(1, { message: "*Nombre requerido" }).max(30, { message: "*Maximo 30 caracteres" }).transform((val) => val.replace(/\s+/g, "")),
  plate: z.string().min(1, { message: "*Placa requerida" }).max(30, { message: "*Maximo 30 caracteres" }).transform((val) => val.replace(/\s+/g, "")),
  model: z.string().max(20, { message: "*Maximo 20 caracteres" }).optional(),
  odometer: z.number().max(1000000, { message: "*Maximo 1000000" }).optional(),
  horometer: z.number().max(1000000, { message: "*Maximo 1000000" }).optional(),
  type: z.string().min(1, { message: "*Tipo requerido" }).max(20, { message: "*Maximo 20 caracteres" }),
  description: z.string().optional(),
});

export const ModalVehicle = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const { data } = useFetchData("enterprise", "enterprise");
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      empresaId: dataCrud?.empresaId || "",
      tagName: dataCrud?.tagName || "",
      plate: dataCrud?.plate || "",
      model: dataCrud?.model || "",
      odometer: dataCrud?.odometer || 1500,
      horometer: dataCrud?.horometer || 1500,
      type: dataCrud?.type || "",     
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
        description: dataCrud?.description || "",
      });
    } else {
      reset({
        empresaId: "",
        tagName: "",
        plate: "",
        model: "",
        odometer: 1500,
        horometer: 1500,
        type: "",        
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
      data: formData, // Enviamos formData
      setLoadingGlobal,
      onClose,
      reset,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!loadingGlobal) onClose(open);
      }}
      modal={true}
    >
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
                name="tagName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre/Tag</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. CAM-04"
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
                      placeholder="Ej. EGE-421"
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
                      placeholder="Ej. Caterpillar 797F"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          <SelectValue
                            placeholder="Seleccione Empresa"
                            className="capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.map((i) => (
                          <SelectItem
                            key={i._id}
                            value={i._id}
                            className="capitalize"
                          >
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
                name="horometer"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kilometraje</FormLabel>

                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 1800"
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
                    <FormLabel>Horómetro</FormLabel>
                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 1500"
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
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Tipo</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Descripción</FormLabel>

                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Camión de acarreo de alta capacidad"
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
                    <IconLoader className="w-4 h-4 " />
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
