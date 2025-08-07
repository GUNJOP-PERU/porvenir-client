import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Select from 'react-select'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { incidenceCodeList } from "./IncidencesCode";

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

const FormSchema = z.object({
  vehicleId: z.string().min(1, { message: "*Vehículo requerido" }),
  code: z.number().min(1, { message: "*Código de incidencia requerido" }),
  description: z.string().optional(),
});

export const IncidenceModal = ({ isOpen, onClose }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const handleFormSubmit = useHandleFormSubmit();

  const {
    data = []
  } = useFetchData("vehicle", "vehicle");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      vehicleId: "",
      code: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  async function onSubmit(data) {
    await handleFormSubmit({
      isEdit: false,
      endpoint: "vehicle-incidence",
      id: "",
      data: {
        vehicleId: data.vehicleId,
        code: data.code,
        description: data.description
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
      <DialogContent className="w-[50vw]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div>
              <CircleFadingPlus className="w-6 h-6 text-zinc-300 " />
            </div>
            <div>
              <DialogTitle>Crear Incidencia</DialogTitle>
              <DialogDescription>
                Agregue incidencias para los truck | scoop.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="vehicleId"
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-800 text-[0.7rem] font-medium">
                      Selecciona un vehículo
                    </label>
                    <Select 
                      options={data.map((item) =>({value: item._id, label: `${item.tagName} - ${item.type}`}))}
                      placeholder="Escribe para filtrar..."
                      onChange={(values) => field.onChange(values.value)}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          fontSize: '13px',
                          fontWeight: '500',
                          borderRadius: '10px',
                          height: '34px',
                        })
                      }}
                    />
                  </div>
                )}
              />

              <FormField
                control={control}
                name="code"
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-800 text-[0.7rem] font-medium">
                      Código de Incidencia
                    </label>
                    <Select 
                      options={incidenceCodeList.map((item) =>({value: item.id, label: `${item.id} ${item.name}`}))}
                      placeholder="Escribe para filtrar..."
                      onChange={(values) => field.onChange(values.value)}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          fontSize: '13px',
                          fontWeight: '500',
                          borderRadius: '10px',
                          height: '34px',
                        })
                      }}
                    />
                  </div>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Descripción de la incidencia</FormLabel>
                    <textarea
                      className="flex h-[150px] rounded-[10px] border border-zinc p-2 text-[13px] resize-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 focus:shadow-primary transition ease-in-out duration-300"
                      disabled={loadingGlobal}
                      placeholder="Ej. Destino 1"
                      onChange={(e) => field.onChange(e.target.value)}
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
                    <IconLoader className="w-4 h-4" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <IconToggle className="text-background w-4 h-4" />
                    Crear Incidencia
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