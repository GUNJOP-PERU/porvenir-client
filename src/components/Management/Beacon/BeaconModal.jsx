/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { Separator } from "@ariakit/react";
import { CircleFadingPlus } from "lucide-react";
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
  FormDescription,
  // FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIAS = [
  "Carga",
  "Descarga",
  "Parqueo",
  "Mantenimiento",
  "Paso",
  "Rampa",
  "Acceso",
  "Galería",
  "Bocamina",
];

const FormSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "*Nombre requerido" })
    .transform((val) => val.trim()),
  mac: z
    .string()
    .min(1, { message: "*MAC requerida" })
    .transform((val) => val.replace(/\s+/g, "")),
  operacion: z
    .string()
    .min(1, { message: "*Operación requerida" })
    .transform((val) => val.trim()),
  categoria: z
    .string()
    .min(1, { message: "*Categoría requerida" })
    .transform((val) => val.trim()),
  location: z
    .string()
    .min(1, { message: "*Localización requerida" })
    .transform((val) => val.replace(/\s+/g, "")),
  detectionToleranceSeconds: z.coerce.number().min(0).default(60),
  isActive: z.boolean().default(true),
});

export const BeaconModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nombre: dataCrud?.nombre || "",
      mac: dataCrud?.mac || "",
      operacion: dataCrud?.operacion || "",
      categoria: dataCrud?.categoria || "",
      location: dataCrud?.location || "",
      detectionToleranceSeconds: dataCrud?.detectionToleranceSeconds || 60,
      isActive: dataCrud?.isActive ?? true,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        nombre: dataCrud.nombre || "",
        mac: dataCrud.mac || "",
        operacion: dataCrud.operacion || "",
        categoria: dataCrud.categoria || "",
        location: dataCrud.location || "",
        detectionToleranceSeconds: dataCrud.detectionToleranceSeconds || 60,
        isActive: dataCrud.isActive ?? true,
      });
    } else {
      reset({
        nombre: "",
        mac: "",
        operacion: "",
        categoria: "",
        location: "",
        detectionToleranceSeconds: 60,
        isActive: true,
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "beacons",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
      useSecondary: true,
    });
  }


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[400px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear"} beacon</DialogTitle>
              <DialogDescription>
                Agregue un nuevo beacon al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Beacon Acceso Principal"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="mac"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>MAC</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 00:1A:7D:DA:71:13"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="operacion"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Operación</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Extracción"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">
                      Localización
                    </FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. zona_a"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="categoria"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loadingGlobal}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIAS.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
                name="detectionToleranceSeconds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tolerancia (seg)</FormLabel>
                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="60"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-6" />
            <div className="flex gap-3 justify-end pt-0 pb-4 p-6">
              <Button
                type="button"
                onClick={() => onClose()}
                variant="secondary"
                disabled={loadingGlobal}
              >
                <IconClose className="fill-zinc-400/50 w-4 h-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingGlobal}>
                {loadingGlobal ? (
                  <>
                    <IconLoader className="w-4 h-4  " />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"} Beacon
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
