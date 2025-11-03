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

const FormSchema = z.object({
  firstPart: z.string().refine((value) => /^\d{4}$/.test(value), {
    message: "*Requerida.",
  }),
  secondPart: z.string().min(1, { message: "*Requerida" }),
  thirdPart: z.string().min(1, { message: "*Requerida" }),
  quarterPart: z.string().min(1, { message: "*Requerida" }),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.boolean().default(true),
});

export const  FrontLaborSubHeader = ({ frontLaborSubHeader }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstPart: "",
      secondPart: "",
      thirdPart: "",
      quarterPart: "",
      description: "",
      type: "",
      status: true,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    reset({
      firstPart: "",
      secondPart: "",
      thirdPart: "",
      quarterPart: "",
      description: "",
      type: "",
      status: true,
    });
  }, [reset]);

  async function onSubmit(data) {
    const name = `${data.firstPart}_OB${data.secondPart}_${data.thirdPart}${
      data.quarterPart ? `-${data.quarterPart}` : ""
    }`;

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
      onClose: () => {},
      reset,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxHeight: frontLaborSubHeader ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <div className="flex flex-row justify-between bg-gray-50 p-4 rounded-md mb-4">
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
                  placeholder="Ej. 10 o 10B"
                  className="w-[80px]"
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
          <div className="flex gap-2 mt-5">
            <Button
              type="submit"
              disabled={loadingGlobal}
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
      </form>
    </Form>
  );
};
