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

const FormSchema = z.object({
  name: z.string().min(1, { message: "*Nombre requerido" }),
  cargo: z.string().min(1, { message: "*Cargo requerido" }),
  role: z.string().min(1, { message: "*Rol requerido" }),
  code: z.string().refine((value) => /^\d{8}$/.test(value), {
    message: "*Debe tener 8 dígitos.",
  }),
});

export const ModalUser = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: dataCrud?.name || "",
      cargo: dataCrud?.cargo || "",
      role: dataCrud?.role || "",
      code: dataCrud?.code || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        name: dataCrud.name || "",
        cargo: dataCrud.cargo || "",
        role: dataCrud.role || "",
        code: dataCrud.code || "",
      });
    } else {
      reset({
        name: "",
        cargo: "",
        role: "",
        code: "",
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "user",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
    });
  }

  return (
    <Dialog open={isOpen}   onOpenChange={(onClose) => !loadingGlobal && onClose}  modal={true}>
      <DialogContent className="w-[380px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear nuevo"} usuario</DialogTitle>
              <DialogDescription>
                Agregue un nuevo usuario al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} >
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre de usuario</FormLabel>
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
                name="cargo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Cargo</FormLabel>

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
                        {dataCargo?.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
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
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Rol</FormLabel>

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
                        {dataRole?.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
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
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Contraseña</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 12345678"
                      maxLength="8"
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
            </div>
            <Separator className="my-4"/>
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
