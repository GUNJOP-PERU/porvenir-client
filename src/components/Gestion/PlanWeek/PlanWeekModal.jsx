import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/useGlobalQuery";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import { postDataRequest, putDataRequest } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CircleFadingPlus, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import IconWarning from "@/icons/IconWarning";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlanHeader } from "./PlanHeader";
import { PlanContent } from "./PlanContent";
import { useToast } from "@/hooks/useToaster";

const FormSchema = z.object({
  dob: z
    .object({
      start: z.date().refine((val) => !isNaN(val.getTime()), {
        message: "*Fecha de inicio inválida.",
      }),
      end: z.date().refine((val) => !isNaN(val.getTime()), {
        message: "*Fecha de fin inválida.",
      }),
    })
    .refine((data) => data.start <= data.end, {
      message: "*La fecha de inicio no puede ser posterior a la fecha de fin.",
      path: ["start"],
    }),
  week: z.number().max(99, { message: "*Maximo 99" }),
  selectedItems: z.array(z.string()).nonempty({ message: "*Labor." }),
});

export const PlanWeekModal = ({ isOpen, onClose, isEdit, dataCrud }) => {
  const { data: dataLaborList, refetch: refetchLaborList } = useFetchData(
    "frontLabor-General",
    "frontLabor",
    { enabled: false }
  );
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 6)),
      },
      week: 1,
      selectedItems: [],
    },
  });

  // Calcular el total de toneladas
  const calculateTotal = () => {
    if (!dataHotTable || dataHotTable.length === 0) return 0;

    return dataHotTable.reduce((total, row) => {
      const tonnageValues = Object.keys(row)
        .filter((key) => key.includes("- DIA") || key.includes("- NOCHE"))
        .map((key) => row[key] || 0);

      return total + tonnageValues.reduce((sum, val) => sum + val, 0);
    }, 0);
  };

  const totalTonnage = calculateTotal();

  const mutation = useMutation({
    mutationFn: async ({ isEdit, id, data }) => {
      return isEdit
        ? await putDataRequest(`planWeek/${id}`, data)
        : await postDataRequest(`planWeek`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crud", "planWeek"] });
      addToast({
        title: variables.isEdit
          ? "Editado correctamente"
          : "Creado correctamente",
        message: variables.isEdit
          ? "Los cambios se han guardado con éxito."
          : "Dato creado con éxito.",
        variant: "success",
      });
    },
    onError: (error, variables) => {
      console.error("Error en la solicitud:", error);
      addToast({
        title: variables.isEdit ? "Error al editar" : "Error al crear",
        message:
          error.response.data.message ||
          "Revise la información e intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendData = async () => {
    setLoadingGlobal(true);
    console.log("Datos dataHotTable:", dataHotTable);

    const dataGenerate = dataHotTable.flatMap((row) => {
      const year = form.getValues("dob").end.getFullYear();
      return Object.entries(row)
        .filter(([key]) => key.includes("-"))
        .map(([key, value]) => {
          const [dayMonth, turnoText] = key.split(" - ");
          const [day, monthStr] = dayMonth.split("-");
          const date = `${year}-${monthStr.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
          const turno = turnoText.toLowerCase() === "dia" ? "dia" : "noche";
          return {
            origen: row.labor,
            turno,
            tonnage: value,
            date,
            phase: row.fase,
          };
        });
    });

    const totalTonnage = dataGenerate.reduce(
      (sum, item) => sum + item.tonnage,
      0
    );
    const result = {
      year: form.getValues("dob").end.getFullYear(),
      month: form.getValues("dob").end.getMonth() + 1,
      week: form.getValues("week"),
      totalTonnage,
      dataGenerate,
      dataEdit: dataHotTable,
      startDate: form.getValues("dob").start,
      endDate: form.getValues("dob").end,
      items: form.getValues("selectedItems"),
    };

    try {
      await mutation.mutateAsync({
        isEdit,
        id: dataCrud?._id,
        data: result,
      });
      setDataHotTable([]);
      if (onClose) onClose();
      form.reset();
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    form.reset();
    setDataHotTable([]);
    setLoadingGlobal(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (isEdit) setShowLoader(true);
      refetchLaborList().then(() => {
        if (isEdit && dataCrud?.dataEdit) {
          setDataHotTable(dataCrud.dataEdit);
          if (dataCrud?.startDate && dataCrud?.endDate && dataCrud?.week && dataCrud?.items) {
            form.setValue("dob", {
              start: new Date(dataCrud.startDate),
              end: new Date(dataCrud.endDate),
            });
            form.setValue("week", dataCrud.week);
            form.setValue("selectedItems", dataCrud.items);
          }
        } else {
          setDataHotTable([]);
        }
        if (isEdit) setShowLoader(false);
      });
    }
  }, [isOpen, refetchLaborList, isEdit, dataCrud, form]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!loadingGlobal) onClose(open);
      }}
      modal={true}
    >
      <DialogContent className="max-w-[90%]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>
                {isEdit ? "Editar" : "Crear"} Plan Semanal
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Editar" : "Ingresar"} los datos necesarios para la
                creación y enviar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-7">
          <PlanHeader
            form={form}
            dataLaborList={dataLaborList}
            isEdit={isEdit}
            loadingGlobal={loadingGlobal}
            setLoadingGlobal={setLoadingGlobal}
            setShowLoader={setShowLoader}
            setDataHotTable={setDataHotTable}
          />
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-base font-extrabold leading-5">
                Planificación /{" "}
                <strong className="font-extrabold capitalize">
                  {form.getValues("dob")?.start ||
                  form.getValues("dob")?.end ? (
                    <>
                      {form.getValues("dob")?.start &&
                        dayjs(form.getValues("dob").start).format("DD MMMM")}
                      {form.getValues("dob")?.end &&
                        " - " +
                          dayjs(form.getValues("dob").end).format("DD MMMM")}
                    </>
                  ) : (
                    <span className="text-zinc-300 font-bold">
                      Sin fecha seleccionada
                    </span>
                  )}
                </strong>
              </h1>
              <span className="text-2xl font-extrabold">
                {totalTonnage.toLocaleString("es-MX")} tn
              </span>
            </div>
            {showLoader ? (
              <div className="text-center py-4 text-zinc-500 h-[55vh] flex items-center justify-center ">
                <span className="flex flex-col gap-2 items-center">
                  <IconLoader className="w-8 h-8" />
                </span>
              </div>
            ) : dataHotTable.length === 0 ? (
              <div className="text-center text-zinc-400 h-[55vh] flex items-center justify-center ">
                <span className="text-xs">Datos no creados</span>
              </div>
            ) : (
              <PlanContent
                dataHotTable={dataHotTable}
                setDataHotTable={setDataHotTable}
                loadingGlobal={loadingGlobal}
              />
            )}
            <div className="  bg-sky-100/50 border-t border-blue-500 w-full rounded-xl px-4 py-2.5 flex gap-1 text-zinc-600  text-[11px] leading-4">
              <IconWarning className="text-blue-500  w-5 h-5 mr-1.5" />
              <div className="flex items-center">
                <ul className="list-disc ml-3 gap-x-6 ">
                  <li>
                    Para <strong>añadir</strong> una labor, seleccione un ítem
                    en el botón
                    <span className="font-semibold"> "Labor"</span> y haga clic
                    en <strong>Actualizar</strong>.
                  </li>
                  <li>
                    Para <strong>eliminar</strong> una labor, quite la selección
                    y luego haga clic en <strong>Actualizar</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loadingGlobal}
          >
            <IconClose className="fill-zinc-400/50 w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSendData}
            disabled={dataHotTable.length === 0 || loadingGlobal}
          >
            {loadingGlobal ? (
              <>Cargando...</>
            ) : (
              <>
                {isEdit ? "Actualizar" : "Crear"} Plan
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
