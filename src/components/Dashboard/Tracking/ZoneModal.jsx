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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

const FormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "*Ubicación requerida" })
    .transform((val) => val.trim()),
  location: z
    .string()
    .min(1, { message: "*Ubicación requerida" })
    .transform((val) => val.replace(/\s+/g, "")),
  description: z
    .string()
    .min(1, { message: "*Descripcion requerida" })
    .transform((val) => val.trim()),
  color: z
    .string()
    .min(1, { message: "*Color requerido" })
    .transform((val) => val.trim()),
  position: z.object({
    latitud: z
      .number({ invalid_type_error: "Latitud inválida" })
      .gte(-90, "Latitud mínima -90")
      .lte(90, "Latitud máxima 90"),
    longitud: z
      .number({ invalid_type_error: "Longitud inválida" })
      .gte(-180, "Longitud mínima -180")
      .lte(180, "Longitud máxima 180"),
  }),
  radius: z.number().max(500, { message: "*Maximo 500" }).optional(),
});

export const ZoneModal = ({
  isOpen,
  onClose,
  isEdit,
  dataCrud,
  invalidateKey,
  type,
}) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: dataCrud?.name || "",
      location: dataCrud?.location || "",
      description: dataCrud?.description || "",
      color: dataCrud?.color || "",
      position: {
        latitud: dataCrud?.position?.latitud || -10.60229,
        longitud: dataCrud?.position?.longitud || -76.2088,
      },
      radius: dataCrud?.radius || 60,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        name: dataCrud?.name || "",
        location: dataCrud?.location || "",
        description: dataCrud?.description || "",
        color: dataCrud?.color || "",
        position: {
          latitud: dataCrud?.position?.latitud || -10.60229,
          longitud: dataCrud?.position?.longitud || -76.2088,
        },
        radius: dataCrud?.radius || 60,
      });
    } else {
      reset({
        name: "",
        location: "",
        description: "",
        color: "",
        position: {
          latitud: -10.60229,
          longitud: -76.2088,
        },
        radius: 60,
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    const dataFinal = {
      ...data,
      type,
      geofense: [],
    };

    await handleFormSubmit({
      isEdit,
      endpoint: "zone",
      id: dataCrud?._id,
      data: dataFinal,
      setLoadingGlobal,
      onClose,
      reset,
      invalidateKey,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[420px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear"} Zona</DialogTitle>
              <DialogDescription>
                Agregue una nueva zona al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Parqueo"
                      {...field}
                    />
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
                      type="color"
                      disabled={loadingGlobal}
                      placeholder="Ej. #000000"
                      className="p-0 rounded-none border-none m-0"
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
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel className="font-bold text-blue-600">
                      *Localización
                    </FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Parqueo"
                       value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                    />
                    {isEdit ? (
                      <FormDescription className="text-[10px] leading-3 text-amber-600 font-semibold pl-2">
                        ⚠️ Cambiar esto reasignará los beacons automáticamente
                      </FormDescription>
                    ) : (
                      <FormDescription className="text-[11px] leading-3 text-blue-600 font-medium pl-2">
                        ✓ Los beacons con esta misma localización se asignarán
                        automáticamente a esta zona
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormLabel>Descripción</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Equipo de trabajo"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="radius"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Radio</FormLabel>
                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 500"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="position.latitud"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Latitud</FormLabel>
                    <Input
                      type="number"
                      placeholder="Ej. -12.0464"
                      disabled
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="position.longitud"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Longitud</FormLabel>
                    <Input
                      type="number"
                      disabled
                      placeholder="Ej. -12.0464"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                {dataCrud?.mac &&
                  Array.isArray(dataCrud.mac) &&
                  dataCrud.mac.length > 0 && (
                    <div>
                      <p className="font-bold text-sm mb-2">
                        MACs asignadas ({dataCrud.mac.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {dataCrud.mac.map((mac, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                          >
                            {mac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
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
