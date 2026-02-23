/* eslint-disable react/prop-types */

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useHandleFormSubmit } from "@/hooks/useMutation";
import IconLoader from "@/icons/IconLoader";
import IconToggle from "@/icons/IconToggle";
import { dataLabor } from "@/lib/data";
import { Button } from "../../ui/button";
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
import { useFetchData } from "@/hooks/useGlobalQuery";
import { InfoIcon, RefreshCw } from "lucide-react";

const FormSchema = z.object({
  firstPart: z.string().refine((value) => /^\d{3,4}$/.test(value), {
    message: "*Requerida.",
  }),
  secondPart: z.string().min(1, { message: "*Requerida" }),
  thirdPart: z.string().min(1, { message: "*Requerida" }),
  quarterPart: z.string().min(1, { message: "*Requerida" }),
  fifthPart: z.string().min(1, { message: "*Requerida" }),
  sixthPart: z.string().min(1, { message: "*Requerida" }),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.boolean().default(true),
});

export const FrontLaborSubHeader = ({ onSuccess, onCancel }) => {
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
      firstPart: "",
      secondPart: "",
      thirdPart: "",
      quarterPart: "",
      fifthPart: "",
      sixthPart: "",
      description: "",
      type: "",
      status: true,
    },
  });

  const { handleSubmit, control, reset, watch } = form;

  const firstPart = watch("firstPart");
  const secondPart = watch("secondPart");
  const thirdPart = watch("thirdPart");
  const quarterPart = watch("quarterPart");
  const fifthPart = watch("fifthPart");
  const sixthPart = watch("sixthPart");

  useEffect(() => {
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
  }, [reset]);

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
      isEdit: false,
      endpoint: "frontLabor",
      id: "",
      data: responseData,
      setLoadingGlobal,
      onClose: () => {
        if (onSuccess) onSuccess(name);
      },
      reset,
    });
  }

  return (
    <Form {...form}>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
        }}
      >
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
                {`${firstPart || ""}_${secondPart || ""}_${thirdPart || ""}${
                  quarterPart ? `-${quarterPart}_${fifthPart}_${sixthPart}` : ""
                }`}
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={control}
              name="firstPart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>NIVEL</FormLabel>
                  <Input
                    type="text"
                    placeholder="Ej. 2926"
                    maxLength={4}
                    disabled={loadingGlobal}
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
                  <FormItem className="flex flex-col w-full ">
                    <FormLabel>VETA</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingGlobal || loadingVeta}
                      type="button"
                    >
                      <FormControl>
                        <SelectTrigger className="!rounded-s-none w-full">
                          <SelectValue placeholder="Sel." />
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
                  <FormLabel>TIPO DE LABOR</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingGlobal}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sel." />
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
                  <FormLabel>NÚMERO / ID</FormLabel>
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
                  <FormLabel>ALA / EJE</FormLabel>
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
                  <FormLabel>CORTE</FormLabel>
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
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onCancel}
            disabled={loadingGlobal}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={loadingGlobal}
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                <IconToggle className="text-background w-4 h-4" />
                Crear
              </>
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};
