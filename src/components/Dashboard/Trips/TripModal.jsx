import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useHandleFormSubmit } from "@/hooks/useMutation";
import { dataCargo, dataRole } from "@/lib/data";
import { CircleFadingPlus } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import IconToggle from "@/icons/IconToggle";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import { Separator } from "@ariakit/react";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  location: z.string().min(1, { message: "*Nombre requerido" }),
  startUbication: z.string().min(1, { message: "*Ubicación de inicio requerida" }),
  endUbication: z.string().min(1, { message: "*Ubicación de destino requerida" }),
  tripType: z.string().min(1, { message: "*Tipo de viaje requerido" }),
});

export const TripModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: dataCrud?.location || "",
      startUbication: dataCrud?.startUbication || "",
      endUbication: dataCrud?.endUbication || "",
      tripType: dataCrud?.tripType || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        location: dataCrud.location || "",
        startUbication: dataCrud.startUbication || "",
        endUbication: dataCrud.endUbication || "",
        tripType: dataCrud.tripType || "",
      });
    } else {
      reset({
        location: "",
        startUbication: "",
        endUbication: "",
        tripType: "",
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "trip/single",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
      invalidateKey: ["crud", "trip-truck"],
    });
  }

  return (
    <Dialog
      open={isOpen}
      modal={true}
    >
      <DialogContent className="w-[400px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>
                {isEdit ? "Editar" : "Agregar"} viaje exitente
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Actualizar" : "Agregar"} viaje al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="startUbication"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Ubicación de inicio</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Pablo Pablo"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="endUbication"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Ubicación de destino</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. pablo1234"
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
                    <FormLabel>Ubicación</FormLabel>

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
                        <SelectItem value="Superficie">Superficie</SelectItem>
                        <SelectItem value="Subterraneo">Subterraneo</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="tripType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo de material</FormLabel>
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
                        <SelectItem value="Mineral">Mineral</SelectItem>
                        <SelectItem value="Desmonte">Desmonte</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />
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
                    <IconLoader className="w-4 h-4" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"} viaje
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
