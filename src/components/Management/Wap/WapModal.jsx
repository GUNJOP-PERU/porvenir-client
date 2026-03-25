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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Switch } from "@/components/ui/switch";


function formatMac(value) {
  const clean = value.replace(/[^A-Fa-f0-9]/g, "").toUpperCase();
  return clean.match(/.{1,2}/g)?.join(":").slice(0, 17) ?? clean;
}


function sanitizeIp(value) {
  return value.replace(/[^0-9.]/g, "");
}


const MAC_REGEX = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
const IP_REGEX =
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

const FormSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre requerido" })
    .transform((val) => val.trim()),
  mac: z
    .string()
    .min(1, { message: "MAC requerida" })
    .regex(MAC_REGEX, { message: "Formato inválido. Ej: D4:A3:EB:9D:0F:C4" }),
  location: z.string().optional(),
  type: z.string().optional(),
  ip: z
    .string()
    .optional()
    .refine((val) => !val || IP_REGEX.test(val), {
      message: "IP inválida. Ej: 192.168.1.1",
    }),
  ssid: z.string().optional(),
  // ✅ Fix: active es boolean, no string
  active: z.boolean().default(true),
});

export const ModalWap = ({ isOpen, onClose, isEdit, dataCrud, useSecondary }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nombre: "",
      mac: "",
      location: "",
      type: "",
      ip: "",
      ssid: "",
      active: true,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    reset({
      nombre: dataCrud?.nombre ?? "",
      mac: dataCrud?.mac ?? "",
      location: dataCrud?.location ?? "",
      type: dataCrud?.type ?? "",
      ip: dataCrud?.ip ?? "",
      ssid: dataCrud?.ssid ?? "",
      active: dataCrud?.active ?? true, 
    });
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "wifis",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
      useSecondary,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !loadingGlobal && onClose()}
      modal={true}
    >
      <DialogContent className="w-[450px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>
                {isEdit ? "Editar" : "Crear"} WAP (wifi)
              </DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Modifica los datos del WAP seleccionado"
                  : "Agregue un nuevo WAP (wifi) al sistema"}
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre del WAP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="Ej. AP-Galeria-01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="mac"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>MAC AP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="D4:A3:EB:9D:0F:C4"
                        maxLength={17}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(formatMac(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ubicación <span className="text-zinc-400 text-[10px]">(opcional)</span></FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="Ej: Oficina principal"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo <span className="text-zinc-400 text-[10px]">(opcional)</span></FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="Ej: Access Point"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="ip"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>IP <span className="text-zinc-400 text-[10px]">(opcional)</span></FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="192.168.1.1"
                        maxLength={15}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(sanitizeIp(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="ssid"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>SSID <span className="text-zinc-400 text-[10px]">(opcional)</span></FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={loadingGlobal}
                        placeholder="Nombre de la red"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 px-6">
              <FormField
                control={control}
                name="active"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-custom-1400 px-4 py-3 gap-2">
                    <div className="flex flex-col justify-center">
                      <FormLabel>Activar / Desactivar</FormLabel>
                      <FormDescription>
                        Desactiva el WAP en el sistema.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loadingGlobal}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-6" />

            <div className="flex gap-3 justify-end pb-4 px-6">
              <Button
                type="button"
                onClick={onClose}
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
                    {isEdit ? "Actualizar" : "Crear"} WAP
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