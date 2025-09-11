import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { dataLabor } from "@/lib/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Switch } from "@/components/ui/switch";
import LaborImport from "./LaborImport";

const FormSchema = z.object({
  firstPart: z.string().refine((value) => /^\d{4}$/.test(value), {
    message: "*Requerida.",
  }),
  secondPart: z.string().min(1, { message: "*Requerida" }),
  thirdPart: z.string().min(1, { message: "*Requerida" }),
  quarterPart: z.string().optional(),

  description: z.string().optional(),
  type: z.string().optional(),
  status: z.boolean().default(true),
});

export const LaborModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstPart: dataCrud?.name?.split("_")[0] || "",
      secondPart: dataCrud?.name?.split("_")[1] || "",
      thirdPart: dataCrud?.name?.split("_")[2]?.split("-")[0] || "",
      quarterPart: dataCrud?.name?.split("_")[2]?.split("-")[1] || "",
      description: dataCrud?.description || "",
      type: dataCrud?.type || "",
      status: dataCrud?.status ?? true,
    },
  });

  const { handleSubmit, control, watch, reset } = form;

  const firstPart = watch("firstPart");
  const secondPart = watch("secondPart");
  const thirdPart = watch("thirdPart");
  const quarterPart = watch("quarterPart");


  useEffect(() => {
    if (dataCrud) {
      reset({
        firstPart: dataCrud?.name?.split("_")[0] || "",
        secondPart: dataCrud?.name?.split("_")[1] || "",
        thirdPart: dataCrud?.name?.split("_")[2]?.split("-")[0] || "",
        quarterPart: dataCrud?.name?.split("_")[2]?.split("-")[1] || "",
        description: dataCrud?.description || "",
        type: dataCrud?.type || "",
        status: dataCrud?.status ?? true,
      });
    } else {
      reset({
        firstPart: "",
        secondPart: "",
        thirdPart: "",
        quarterPart: "",
        description: "",
        type: "",
        status: true,
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    const name = `${data.firstPart}_${data.secondPart}_${data.thirdPart}${
      data.quarterPart ? `-${data.quarterPart}` : ""
    }`;

    const responseData = {
      ...data,
      name,
    };

    await handleFormSubmit({
      isEdit,
      endpoint: "frontLabor",
      id: dataCrud?._id,
      data: responseData,
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
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>{isEdit ? "Editar" : "Crear"} labor</DialogTitle>
              <DialogDescription>
                Agregue un nuevo labor al sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="text-center text-sm font-bold text-zinc-600 py-2 px-4  bg-zinc-100 rounded-xl flex items-center justify-between">
                  <h4>Labor creado:</h4>
                  <span>
                    {`${firstPart || ""}_${secondPart || ""}_${
                      thirdPart || ""
                    }${quarterPart ? `-${quarterPart}` : ""}`}
                  </span>
                </div>
                <div className="flex gap-1 justify-center">
                  <FormField
                    control={control}
                    name="firstPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Nivel</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. 2926"
                          className="w-[80px]"
                          maxLength={4}
                          disabled={loadingGlobal}
                          {...field}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            field.onChange(numericValue);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="secondPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>OB</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. OB9, OBX1"
                          className="w-[80px]"
                          disabled={loadingGlobal}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.toUpperCase();
                            if (!value.startsWith("OB")) {
                              value = "OB" + value.replace(/OB/gi, ""); // Asegura que siempre inicie con "OB"
                            }
                            field.onChange(value);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="thirdPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Labor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loadingGlobal}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dataLabor.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.name}
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
                    name="quarterPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Número Labor</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. 370"
                          className="w-[100px]"
                          maxLength={6}
                          disabled={loadingGlobal}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Campos de descripción y tipo */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border border-custom-1400 px-4 py-3 gap-2">
                      <div className="flex flex-col  justify-center ">
                        <FormLabel>Activar/Desactivar</FormLabel>
                        <FormDescription className="pt-0">
                          Se deshabilitará el labor.
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
              <div className="pt-6 flex gap-2 ">
                <Button
                  type="button"
                  className="w-1/2"
                  onClick={() => onClose()}
                  variant="secondary"
                  disabled={loadingGlobal}
                >
                  <IconClose className="fill-zinc-400/50 w-4 h-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loadingGlobal}
                  className="w-1/2"
                >
                  {loadingGlobal ? (
                    <>
                      <IconLoader className="w-4 h-4" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <IconToggle className="text-background w-4 h-4" />
                      {isEdit ? "Actualizar" : "Crear"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div>
          <LaborImport />
        </div>
      </DialogContent>
    </Dialog>
  );
};
