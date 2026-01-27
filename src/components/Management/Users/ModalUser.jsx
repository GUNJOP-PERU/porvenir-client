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
  name: z.string().min(1, { message: "*Nombre requerido" }),
  cargo: z.string().min(1, { message: "*Cargo requerido" }),
  role: z.string().min(1, { message: "*Rol requerido" }),
  code: z.string().min(8, { message: "*El usuario debe tener mínimo 8 dígitos" }),
  type: z.enum(["admin", "edit", "view", "plan-editor", "none"], { message: "*Tipo de usuario requerido" }),
  password: z.string().min(8, { message: "*La contraseña debe tener mínimo 8 dígitos" }),
  isActive: z.boolean().default(true),
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
      password: dataCrud?.password || "",
      type: dataCrud?.type || "",
      isActive: dataCrud?.isActive ?? true,
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
        password: dataCrud.password || "",
        type: dataCrud.type || "view",
        isActive: dataCrud.isActive ?? true,
      });
    } else {
      reset({
        name: "",
        cargo: "",
        role: "",
        code: "",
        password: "",
        type: "view",
        isActive: true,
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!loadingGlobal) onClose(open);
      }}
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
                {isEdit ? "Editar" : "Crear nuevo"} usuario
              </DialogTitle>
              <DialogDescription>
                Agregue un nuevo usuario al sistema
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
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. Alberto Pérez Quispe"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Nombre de usuario (código - DNI)</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. OP-45871236"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
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
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Accesos Plataforma Web</FormLabel>

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
                        <SelectItem value="admin">
                          Administrador
                        </SelectItem>
                        <SelectItem value="edit">
                          Editor
                        </SelectItem>
                        <SelectItem value="plan-editor">
                          Planeador
                        </SelectItem>
                        <SelectItem value="view">
                          Solo Lectura
                        </SelectItem>
                        <SelectItem value="none">
                          Sin Acceso
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 px-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-custom-1400 px-4 py-3 gap-2">
                    <div className="flex flex-col  justify-center ">
                      <FormLabel>Activar/Desactivar</FormLabel>
                      <FormDescription className="pt-0">
                        Se deshabilitará el usuario.
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
