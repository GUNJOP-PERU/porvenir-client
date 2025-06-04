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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

const FormSchema = z.object({
  name: z.string().min(1, { message: "*Nombre requerido" }),
  isActive: z.boolean().optional(),
  value: z.number({ invalid_type_error: "*Debe ser un número" })
    .min(0, { message: "*Valor debe ser mayor o igual a 0" }),
});

export const MineralChargeModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: dataCrud?.name || "",
      isActive: dataCrud?.isActive || true,
      value: dataCrud?.value || 0,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        name: dataCrud.name || "",
        isActive: dataCrud.isActive || false,
        value: dataCrud.value || 0
      });
    } else {
      reset({
        name: "",
        isActive: true,
        value: 0
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "mineral",
      id: dataCrud?._id,
      data: {
        name: data.name,
        isActive: data.isActive,
        value: data.value,
      },
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
              <DialogTitle>{isEdit ? "Editar" : "Crear"} Mineral</DialogTitle>
              <DialogDescription>
                Agregue un nuevo mineral
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre del Mineral</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Destino 1"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="value"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Carga en toneladas</FormLabel>
                    <Input
                      type="number"
                      disabled={loadingGlobal}
                      placeholder="Ej. 10 t"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormLabel>Habilitar</FormLabel>
                    <button
                      type="button"
                      className={`relative w-10 h-6 rounded-full transition-colors duration-200 
                        ${field.value ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => {console.log(field.value), field.onChange(!field.value)}}
                      disabled={loadingGlobal}
                      tabIndex={0}
                      aria-checked={field.value}
                      role="switch"
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                          ${field.value ? 'translate-x-4' : ''}`}
                      />
                    </button>
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
                    <IconLoader className="w-4 h-4" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear"} mineral
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
