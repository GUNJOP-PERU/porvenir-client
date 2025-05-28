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
    DialogTitle
} from "../../ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ui/form";
import { Input } from "../../ui/input";

const FormSchema = z.object({
  name: z.string().min(1, { message: "*Nombre requerido" }),
  ruc: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "*Debe tener 11 dígitos.",
  }),
  address: z.string().optional(),
  description: z.string().optional(),
});

export const ModalCompany = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: dataCrud?.name || "",
      ruc: dataCrud?.ruc || "",
      address: dataCrud?.addresss || "",
      description: dataCrud?.description || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        name: dataCrud.name || "",
        ruc: dataCrud.ruc || "",
        address: dataCrud.address || "",
        description: dataCrud.description || "",
      });
    } else {
      reset({
        name: "",
        ruc: "",
        address: "",
        description: "",
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "enterprise",
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
              <DialogTitle>{isEdit ? "Editar" : "Crear"} empresa</DialogTitle>
              <DialogDescription>
                Agregue un nuevo usuario al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre de empresa</FormLabel>
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
                name="ruc"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>RUC</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12122222222"
                      maxLength="11"
                      {...field}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        field.onChange(numericValue);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="address"
               
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Dirección</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Empresa minera"
                      {...field}
                    />
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
                      placeholder="Ej. Empresa minera"
                      {...field}
                    />
                    <FormMessage />
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
                    <IconLoader className="w-4 h-4 text-zinc-200 fill-primary animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"} Usuario
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
