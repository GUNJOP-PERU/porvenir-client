/* eslint-disable react/prop-types */

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { dataLabor } from "@/lib/data";
import { CircleFadingPlus, InfoIcon, RefreshCw } from "lucide-react";
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
import { useFetchData } from "@/hooks/useGlobalQuery";

const FormSchema = z.object({
  firstPart: z.string().refine((value) => /^\d{3,4}$/.test(value), {
    message: "*Requerida.",
  }),
  secondPart: z.string().min(1, { message: "*Requerida" }),
  thirdPart: z.string().min(1, { message: "*Requerida" }),
  quarterPart: z.string().min(1, { message: "*Requerida" }),
  fifthPart: z.string().optional(),
  sixthPart: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.boolean().default(true),
});

export const LaborModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const {
    data: dataVeta = [],
    refetch: refetchVeta,
    isLoading: loadingVeta,
  } = useFetchData("veta", "veta?isValid=true");
  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstPart: dataCrud?.name?.split("_")[0] || "",
      secondPart: dataCrud?.name?.split("_")[1] || "",
      thirdPart: dataCrud?.name?.split("_")[2]?.split("-")[0] || "",
      quarterPart: dataCrud?.name?.split("_")[2]?.split("-")[1] || "",
      fifthPart: dataCrud?.name?.split("_")[2]?.split("-")[2] || "",
      sixthPart: dataCrud?.name?.split("_")[2]?.split("-")[2] || "",
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
  const fifthPart = watch("fifthPart");
  const sixthPart = watch("sixthPart");

  useEffect(() => {
    if (dataCrud) {
      const parts = dataCrud.name.split("_");

      const levelRaw = parts[0] || "";
      const second = parts[1] || "";

      const laborAndQuarter = parts[2] || "";
      const dashParts = laborAndQuarter.split("-");

      const thirdPart = dashParts[0] || "";
      const quarterPart = dashParts[1] || "";

      const fifthPart = parts[3] || "";
      const sixthPart = parts[4] || "";

      reset({
        firstPart: levelRaw.replace(/^NV-/, ""),
        secondPart: second.toUpperCase().replace(/^OB/, ""),
        thirdPart,
        quarterPart,
        fifthPart,
        sixthPart,
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
        fifthPart: "",
        sixthPart: "",
        description: "",
        type: "",
        status: true,
      });
    }
  }, [dataCrud, reset]);

  async function onSubmit(data) {
    let name = `NV-${data.firstPart}_${data.secondPart}_${data.thirdPart}`;

    if (data.quarterPart) {
      name += `-${data.quarterPart}`;
    }

    if (data.fifthPart) {
      name += `_${data.fifthPart}`;
    }

    if (data.sixthPart) {
      name += `_${data.sixthPart}`;
    }

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

  useEffect(() => {
    isOpen && refetchVeta();
  }, [isOpen, refetchVeta]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!loadingGlobal) onClose(open);
      }}
      modal={true}
    >
      <DialogContent className="w-[750px]">
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
                <div className="flex flex-col items-center">
                  <div className="mb-1">
                    <span className="text-xs text-sky-500 flex items-center gap-1">
                      <InfoIcon className="w-3 h-3" />
                      Labor a crear (el nivel el “NV se agrega automáticamente)
                    </span>
                  </div>
                  <div className="w-full py-2 px-4 bg-sky-50 rounded-lg">
                    <h4 className="text-center text-md font-bold text-sky-600 leading-none">
                      NV-
                      {`${firstPart || ""}_${secondPart || ""}_${
                        thirdPart || ""
                      }${
                        quarterPart
                          ? `-${quarterPart}_${fifthPart}_${sixthPart}`
                          : ""
                      }`}
                    </h4>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  <FormField
                    control={control}
                    name="firstPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Nivel</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. 2926"
                          maxLength={4}
                          disabled={loadingGlobal}
                          {...field}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            field.onChange(numericValue);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-1 flex items-center">
                    <div className="h-8 mt-auto">
                      <button
                        className="h-8 w-8 border border-zinc-200 rounded-lg rounded-e-none flex items-center justify-center mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => refetchVeta()}
                        type="button"
                        disabled={loadingVeta}
                      >
                        <RefreshCw className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                    <FormField
                      control={control}
                      name="secondPart"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-20 ">
                          <FormLabel>VETA</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={loadingGlobal || loadingVeta}
                          >
                            <FormControl>
                              <SelectTrigger className="!rounded-s-none">
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataVeta.map((item) => (
                                <SelectItem key={item.name} value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                            <SelectTrigger>
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
                        <FormLabel>Número</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. 370"
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
                  <FormField
                    control={control}
                    name="fifthPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Número</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. A2"
                          maxLength={6}
                          disabled={loadingGlobal}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="sixthPart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Número</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ej. C1"
                          maxLength={6}
                          disabled={loadingGlobal}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
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
