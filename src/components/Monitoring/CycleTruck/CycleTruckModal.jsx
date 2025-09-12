import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import { useToast } from "@/hooks/useToaster";
import { putDataRequest } from "@/api/api";

const FormSchema = z.object({
  origin: z.string().min(1, { message: "*Nombre requerido" }).transform((val) => val.replace(/\s+/g, "")),
});

export const CycleTruckModal = ({ isOpen, onClose, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      origin: dataCrud?.origin || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    reset({
      origin: dataCrud?.origin || "",
    });
  }, [dataCrud, reset]);

  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await putDataRequest(`cycle/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crud", "cycleTruck"] });
      addToast({
        title: "Editado correctamente",
        message: "Los cambios se han guardado con éxito.",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Error en la solicitud:", error);
      addToast({
        title: "Error al editar",
        message:
          error?.response?.data?.message ||
          "Revise la información e intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data) {
    const payload = {
      ...dataCrud,
      origin: data.origin,
      frontLabor: data.origin,
      ...(dataCrud.activities
        ? {
            activities: dataCrud.activities.map((act) => ({
              ...act,
              frontLabor: data.origin,
            })),
          }
        : {}),
    };

    setLoadingGlobal(true);
    try {
      await mutation.mutateAsync({
        id: dataCrud?._id,
        data: payload,
      });
      onClose();
      reset();
    } finally {
      setLoadingGlobal(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal
    >
      <DialogContent className="w-[350px] p-0">
      <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>Editar o Corregir Origen</DialogTitle>
              <DialogDescription>
                Actualice un nuevo origen o corrija el actual
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="origin"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Origen</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 1850_OB1_TJ_751"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
                    <IconLoader className="w-4 h-4" /> Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />{" "}
                    Actualizar origen
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
