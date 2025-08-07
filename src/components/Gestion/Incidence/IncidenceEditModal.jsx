import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchData } from "@/hooks/useGlobalQuery";

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
import { TimeElapsedCounter } from "@/components/TimeCounter";

const FormSchema = z.object({
  vehicleId: z.string().min(1, { message: "*Vehículo requerido" }),
  code: z.number().min(1, { message: "*Código de incidencia requerido" }),
  description: z.string().optional(),
});

export const IncidenceEditModal = ({ isOpen, onClose, dataCrud, isEdit }) => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const handleFormSubmit = useHandleFormSubmit();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      vehicleId: "",
      code: "",
    },
  });

  const { reset } = form;

  async function onSubmit() {
    console.log(  "dataCrud", dataCrud._id);
    await handleFormSubmit({
      isEdit: false,
      postId: true,
      endpoint: "vehicle-incidence/close",
      id: dataCrud?._id || "",
      data: {
        closeDate: new Date().toISOString(),
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
              <DialogTitle>Editar Incidencia</DialogTitle>
              <DialogDescription>
                finalice el cronometro de la incidencia y complete los campos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="contador">
            <TimeElapsedCounter from={dataCrud?.start} to={dataCrud?.end} />:
          </div>

          <div className="flex flex-col gap-1">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-800 text-[0.7rem] font-medium">
              Selecciona un vehículo
            </label>
            <input
              value={dataCrud?.vehicleId.tagName || ""}
              disabled={true}
              className="flex h-[34px] rounded-[10px] border border-zinc-300 bg-transparent px-3 py-1 text-[13px] text-black font-medium"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-800 text-[0.7rem] font-medium">
              Código de Incidencia
            </label>
            <input
              value={dataCrud?.code}
              disabled={true}
              className="flex h-[34px] rounded-[10px] border border-zinc-300 bg-transparent px-3 py-1 text-[13px] text-black font-medium"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-800 text-[13px] font-medium">
              Descripción
            </label>
            <textarea
              className="flex h-[150px] rounded-[10px] border border-zinc p-2 text-[13px] resize-none"
              value={dataCrud?.description || ""}
              disabled={true}
              placeholder="Ej. Destino 1"
            />
          </div>
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
          <Button type="button" disabled={loadingGlobal} onClick={() => onSubmit()}>
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                <IconToggle className="text-background w-4 h-4" />
                Finalizar Incidencia
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};