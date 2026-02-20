/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SketchPicker } from "react-color";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListItems } from "./ListItems";

const FormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "*Nombre requerido" })
    .transform((val) => val.trim()),
  location: z
    .string()
    .min(1, { message: "*Localización requerida" })
    .transform((val) => val.replace(/\s+/g, "")),
  description: z
    .string()
    .min(1, { message: "*Descripción requerida" })
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
  radius: z.number().max(500, { message: "*Máximo 500" }).optional(),
  // Array de macs seleccionadas
  mac: z.array(z.string()).optional(),
});

// Extrae macs del array de beacons asignados
const extractMacs = (dataCrud) => {
  if (!dataCrud) return [];
  // Preferir dataCrud.beacons (objetos completos) sobre dataCrud.mac (solo strings)
  if (Array.isArray(dataCrud.beacons) && dataCrud.beacons.length > 0) {
    return dataCrud.beacons.map((b) => b.mac).filter(Boolean);
  }
  if (Array.isArray(dataCrud.mac)) return dataCrud.mac;
  return [];
};

const buildDefaults = (dataCrud) => ({
  name: dataCrud?.name || "",
  location: dataCrud?.location || "",
  description: dataCrud?.description || "",
  color: dataCrud?.color || "",
  position: {
    latitud: dataCrud?.position?.latitud || -10.60229,
    longitud: dataCrud?.position?.longitud || -76.2088,
  },
  radius: dataCrud?.radius || 60,
  mac: extractMacs(dataCrud),
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
    defaultValues: buildDefaults(dataCrud),
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    reset(buildDefaults(dataCrud));
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
       extraInvalidateKeys: [
        ["crud", "beacon"]
      ],
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[450px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
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
            <div className="grid grid-cols-2 gap-3 px-6 pt-4">

              {/* Nombre */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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

              {/* Color */}
              <FormField
                control={control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Color</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 font-mono px-1 uppercase "
                        >
                          <div
                            className="size-6 rounded-lg border shadow-sm"
                            style={{ backgroundColor: field.value || "#000000" }}
                          />
                          {field.value || "#000000"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none" align="start">
                        <SketchPicker
                          color={field.value || "#000000"}
                          onChange={(color) => field.onChange(color.hex)}
                          elevation={0}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Localización */}
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
                      placeholder="Ej. taller"
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

              {/* Descripción */}
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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

              {/* Radio */}
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

              {/* Latitud */}
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

              {/* Longitud */}
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

              {/* MACs Asociadas — usa field "mac" directamente */}
              <FormField
                control={control}
                name="mac"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    {/* <FormLabel> MACs asignadas ({dataCrud?.beacons?.length || 0}):</FormLabel> */}
                    <ListItems
                      field={field}
                      assignedBeacons={dataCrud?.beacons ?? []}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />
            <div className="flex gap-3 justify-end pt-0 pb-4 px-6">
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
                    <IconLoader className="w-4 h-4" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"} Zona
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