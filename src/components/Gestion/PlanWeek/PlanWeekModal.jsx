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
import { postDataRequest } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CircleFadingPlus, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import IconWarning from "@/icons/IconWarning";
import { useQueryClient } from "@tanstack/react-query";
import { PlanHeader } from "./PlanHeader";
import { PlanContent } from "./PlanContent";

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
  selectedItems: z.array(z.string()).nonempty({ message: "*Labor." }),
});

export const PlanWeekModal = ({ isOpen, onClose, isEdit }) => {
  const queryClient = useQueryClient();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { data: dataLaborList, refetch: refetchLaborList } = useFetchData(
    "frontLabor-General",
    "frontLabor",
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (isOpen) {
      refetchLaborList();
    }
  }, [isOpen, refetchLaborList]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 6)),
      },
      selectedItems: [],
    },
  });

  // ✅ Calcular el total de toneladas
  const calculateTotal = () => {
    if (!dataHotTable || dataHotTable.length === 0) return 0;

    return dataHotTable.reduce((total, row) => {
      const tonnageValues = Object.keys(row)
        .filter((key) => key.match(/^\d{2}-\d{2}$/))
        .map((fecha) => row[fecha] || 0);

      return total + tonnageValues.reduce((sum, tonnage) => sum + tonnage, 0);
    }, 0);
  };

  const totalTonnage = calculateTotal();

  const generarEstructura = (dob, selectedItems) => {
    if (!dob?.start || !dob?.end) {
      alert("Debe seleccionar una fecha válida.");
      return { data: [] };
    }

    const startDate = dayjs(dob.start);
    const endDate = dayjs(dob.end);
    const daysInMonth = endDate.diff(startDate, "day") + 1;

    const items =
      Array.isArray(selectedItems) && selectedItems.length > 0
        ? selectedItems
        : [""];

    const exampleData = items.map((labor, index) => {
      let row = {
        labor,
        fase: index % 2 === 0 ? "Extracción / Producción" : "Avance",
      };

      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = startDate.add(i, "day").format("DD-MM");

        // 🔹 Dos columnas por día
        row[`${currentDate} - DIA`] = 0;
        row[`${currentDate} - NOCHE`] = 0;
      }

      return row;
    });

    return { data: exampleData };
  };

  const onSubmit = (data) => {
    setLoadingGlobal(true);
    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      const generatedData = generarEstructura(data.dob, data.selectedItems);
      if (generatedData) {
        setDataHotTable(generatedData.data);
      }
      setLoadingGlobal(false);
    }, 1500);
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);
    console.log("Datos dataHotTable:", dataHotTable);

    const getWeekOfMonth = (dateObj) => {
      const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
      const dayOfMonth = dateObj.getDate();
      const firstDayWeekday = firstDayOfMonth.getDay() || 7; // Lunes=1 ... Domingo=7
      return Math.ceil((dayOfMonth + firstDayWeekday - 1) / 7);
    };

    // Paso 1: Generar el array de registros individuales
    const dataGenerate = dataHotTable.flatMap((row) => {
      const year = form.getValues("dob").end.getFullYear();
      return Object.entries(row)
        .filter(([key]) => key.includes("-")) // filtrar solo las fechas
        .map(([key, value]) => {
          // key ejemplo: "25-08 - Día"
          const [dayMonth, turnoText] = key.split(" - ");
          const [day, monthStr] = dayMonth.split("-");
          const date = `${year}-${monthStr.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

    // Paso 2: Calcular el tonnage total
    const totalTonnage = dataGenerate.reduce(
      (sum, item) => sum + item.tonnage,
      0
    );
    const refDate = new Date(dataGenerate[0].date);
    // Paso 3: Generar el objeto final
    const result = {
      year: form.getValues("dob").end.getFullYear(),
      month: form.getValues("dob").end.getMonth() + 1,
      week: getWeekOfMonth(refDate),
      totalTonnage,
      dataGenerate,
      dataEdit: dataHotTable,
    };

    console.log("Resultado final:", result);

    try {
      const response = await postDataRequest("planWeek", result);

      if (response.status >= 200 && response.status < 300) {
        alert("Datos enviados con éxito!");
        queryClient.invalidateQueries({ queryKey: ["crud", "planWeek"] });
        setDataHotTable([]);
      } else {
        alert("Error al enviar los datos.");
      }

      if (onClose) onClose();
      form.reset();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar los datos.");
    } finally {
      setLoadingGlobal(false); // Detener indicador de carga
    }
  };

  const handleCancel = () => {
    if (onClose) onClose(); // Cerrar el modal
    form.reset(); // Restablecer los valores del formulario
    setDataHotTable([]); // Limpiar la tabla de datos
    setLoadingGlobal(false); // Detener cualquier indicador de carga
  };

  // console.log("Form Values:", form.getValues());

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
              <DialogTitle>{isEdit ? "Editar" : "Crear"} Plan Semanal</DialogTitle>
              <DialogDescription>
                {isEdit ? "Editar" : "Ingresar"} los datos necesarios para la creación y enviar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-7">
          <PlanHeader
            form={form}
            onSubmit={onSubmit}
            dataLaborList={dataLaborList}
            hasData={dataHotTable.length > 0}
            loadingGlobal={loadingGlobal}
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
                    <span className="text-zinc-300 font-bold">Sin fecha seleccionada</span>
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
                Enviar Plan
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
