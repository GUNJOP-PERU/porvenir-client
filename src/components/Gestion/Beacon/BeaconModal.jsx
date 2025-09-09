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
  // FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../ui/select";
import { useFetchData } from "@/hooks/useGlobalQuery";

const FormSchema = z.object({
  mac: z.string().min(1, { message: "*Nombre requerido" }).transform((val) => val.replace(/\s+/g, "")),
  type: z.string().min(1, { message: "*Nombre requerido" }).transform((val) => val.trim()),
  ubicationType: z.string().min(1, { message: "*Tipo requerido" }).transform((val) => val.trim()),
  ubication: z.string().min(1, { message: "*Ubicación requerida" }).transform((val) => val.trim()),
});

export const BeaconModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const { data: dataUbicationType } = useFetchData(
    "ubications",
    "beacon/ubications"
  );
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mac: dataCrud?.mac || "",
      type: dataCrud?.type || "",
      ubicationType: dataCrud?.ubicationType || "",
      ubication: dataCrud?.ubication || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (dataCrud) {
      reset({
        mac: dataCrud.mac || "",
        type: dataCrud.type || "",
        ubicationType: dataCrud.ubicationType || "",
        ubication: dataCrud.ubication || "",
      });
    } else {
      reset({
        mac: "",
        type: "",
        ubicationType: "",
        ubication: "",
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit,
      endpoint: "beacon",
      id: dataCrud?._id,
      data,
      setLoadingGlobal,
      onClose,
      reset,
    });
  }

  const categories = Object.keys(dataUbicationType || {});

  useEffect(() => {
    if (!isEdit) {
      form.setValue("ubication", "");
    }
  }, [form.watch("ubicationType")]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[400px] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear"} beacon</DialogTitle>
              <DialogDescription>
                Agregue un nuevo beacon al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-6">
              <FormField
                control={control}
                name="mac"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>MAC</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. 00:1A:7D:DA:71:13"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. beacon"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="ubicationType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo de ubicación</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. beacon"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="ubication"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ubicación</FormLabel>
                    <Input
                      type="text"
                      disabled={loadingGlobal}
                      placeholder="Ej. beacon"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={control}
                name="ubicationType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo de ubicación</FormLabel>
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
                        {categories?.map((i) => (
                          <SelectItem key={i} value={i}>
                            {i}
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
                name="ubication"
                render={({ field }) => {
                  const ubicationTypeSelected = form.watch("ubicationType");
                  const ubications =
                    dataUbicationType?.[ubicationTypeSelected]?.map(
                      (item) => item.name
                    ) || [];

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ubicación</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingGlobal || ubications.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ubications.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              /> */}
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
