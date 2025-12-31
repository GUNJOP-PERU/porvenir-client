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

const FormSchema = z.object({
  name: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => val.length > 0, {
      message: "*Nombre requerido",
    }),
  isValidate: z.boolean().default(true),
});

export const VetaModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: dataCrud?.name || "",
      isValidate: dataCrud?.isValidate ?? true,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        name: dataCrud.name || "",
        isValidate: dataCrud.isValidate ?? true,
      });
    } else {
      reset({
        name: "",
        isValidate: true,
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "veta",
      id: dataCrud?._id,
      data,
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
      <DialogContent className="w-[350px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear"} Veta</DialogTitle>
              <DialogDescription>
                Agregue una nueva veta al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nombre de veta</FormLabel>
                  <Input
                    type="text"
                    disabled={loadingGlobal}
                    placeholder="Ej. V1204"
                    value={field.value}
                  onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-3">
              <FormField
                control={form.control}
                name="isValidate"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-custom-1400 px-4 py-3 gap-2">
                    <div className="flex flex-col  justify-center ">
                      <FormLabel>Activar/Desactivar</FormLabel>
                      <FormDescription className="pt-0">
                        Se deshabilitará el veta.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        disabled={loadingGlobal}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-6" />
            <div className="flex gap-3 justify-end">
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
                    {isEdit ? "Actualizar" : "Crear"} Veta
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
