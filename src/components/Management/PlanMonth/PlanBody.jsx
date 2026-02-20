/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { postDataRequest, putDataRequest } from "@/api/api";
import { useToast } from "@/hooks/useToaster";
import { generateNormalWeeks } from "@/components/Dashboard/WeekReport/MiningWeeksSelect";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus, SendHorizontal, Server } from "lucide-react";
import IconLoader from "@/icons/IconLoader";
import IconWarning from "@/icons/IconWarning";
import IconClose from "@/icons/IconClose";
import { PlanContent } from "@/components/Management/PlanMonth/PlanContent";
import { PlanHeader } from "@/components/Management/PlanMonth/PlanHeader";
import { DataImportExcel } from "../PlanDay/DataImportExcel";

const FormSchema = z.object({
  dob: z
    .object({
      start: z.date().refine((val) => !isNaN(val.getTime()), {
        message: "*Fecha de inicio inválida.",
      }),
      end: z.date().refine((val) => !isNaN(val.getTime()), {
        message: "*Fecha de fin inválida.",
      }),
      weekNumber: z.number().optional(),
    })
    .refine((data) => data.start <= data.end, {
      message: "*La fecha de inicio no puede ser posterior a la fecha de fin.",
      path: ["start"],
    }),
  selectedItems: z.array(z.string()).optional(),
});

export const PlanBody = ({
  mode,
  isEdit,
  initialData,
  api,
  title = "",
  refreshQueryKey,
  ruteReturn,
  downloadTemplate,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [invalidLabors, setInvalidLabors] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const { currentWeek } = generateNormalWeeks();

  const { data: dataLaborVerify } = useFetchData(
    "frontLabor-general",
    "frontLabor",
    {
      enabled: true,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    },
  );

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob:
        mode === "weekly" && currentWeek
          ? {
              start: currentWeek.start,
              end: currentWeek.end,
              weekNumber: currentWeek.weekNumber,
            }
          : {
              start: dayjs().startOf("month").toDate(),
              end: dayjs().endOf("month").toDate(),
            },

      selectedItems: [],
    },
  });

  const generarEstructura = (dob, selectedItems) => {
    if (!dob?.start || !dob?.end) {
      addToast({
        title: "Fecha no válida",
        message: "Debe seleccionar una fecha válida.",
        variant: "destructive",
      });
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
        zona: index % 2 === 0 ? "ALTA" : "INTERMEDIA",
        labor,
        fase: index % 2 === 0 ? "MINERAL" : "DESMONTE",
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

  const totalTonnage = useMemo(() => {
    if (!dataHotTable || dataHotTable.length === 0) return 0;

    return dataHotTable.reduce((total, row) => {
      const values = Object.entries(row)
        .filter(([key]) => key.includes(" - DIA") || key.includes(" - NOCHE"))
        .map(([, value]) => Number(value) || 0);

      return total + values.reduce((sum, v) => sum + v, 0);
    }, 0);
  }, [dataHotTable]);

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
    const { dob } = form.getValues();

    const tieneCamposVacios = dataHotTable.some(
      (row) => !row.zona || !row.labor || !row.fase,
    );

    const laborCounts = dataHotTable.reduce((acc, row) => {
      acc[row.labor] = (acc[row.labor] || 0) + 1;
      return acc;
    }, {});
    const tieneRepetidos = Object.values(laborCounts).some(
      (count) => count > 1,
    );

    const laborFormatoIncorrecto = dataHotTable.some((row) => {
      const partes = row.labor.split("_");
      if (partes.length < 3) return false;
      const terceraParte = partes[2];
      if (/^T-/.test(terceraParte)) {
        return true;
      }
      return false;
    });

    if (laborFormatoIncorrecto) {
      addToast({
        title: "Error de formato de labor",
        message:
          "Una labor contiene un formato inválido. Si después del segundo subguión inicia con 'T-', debe ser 'TJ-'.",
        variant: "destructive",
      });
      setLoadingGlobal(false);
      return;
    }

    if (tieneCamposVacios) {
      addToast({
        title: "Campos vacíos",
        message: "Hay filas con 'Zona', 'Labor' o 'Fase' vacías en la tabla.",
        variant: "destructive",
      });
      setLoadingGlobal(false);
      return;
    }

    if (tieneRepetidos) {
      addToast({
        title: "Labores repetidas",
        message: "Existen labores repetidas. Corrige antes de continuar.",
        variant: "destructive",
      });
      setLoadingGlobal(false);
      return;
    }

    const datosFinales = dataHotTable.flatMap((row) => {
      const year = form.getValues("dob").end.getFullYear();
      return Object.entries(row)
        .filter(([key]) => key.includes("- DIA") || key.includes("- NOCHE"))
        .map(([key, value]) => {
          const [dayMonth, turnoText] = key.split(" - ");
          const [day, monthStr] = dayMonth.split("-");
          const date = `${year}-${monthStr.padStart(2, "0")}-${day.padStart(
            2,
            "0",
          )}`;
          const turno = turnoText.toLowerCase();

          return {
            zone: row.zona,
            frontLabor: row.labor,
            phase: row.fase,
            date: date,
            tonnage: value,
            month: parseInt(monthStr, 10),
            turno: turno,
          };
        });
    });

    const totalTonnage = datosFinales.reduce(
      (sum, item) => sum + (Number(item.tonnage) || 0),
      0,
    );

    const invalidLaborsWithStatus = invalidLabors.map((labor) => ({
      name: labor,
      status: true,
    }));

    const fecha = dayjs(dob.end);
    const mes = fecha.month() + 1;
    const año = fecha.year();

    const dataFinal = {
      year: año,
      month: mes,
      week: mode === "weekly" ? dob.weekNumber : null,
      totalTonnage: totalTonnage,
      dataGenerate: datosFinales,
      dataEdit: dataHotTable,
      dataCalculate: [],
      startDate: form.getValues("dob").start,
      endDate: form.getValues("dob").end,
      items: form.getValues("selectedItems") ?? [],
      status: "creado",
    };

    try {
      const response = isEdit
        ? await putDataRequest(
            api.update.replace(":id", initialData._id),
            dataFinal,
          )
        : await postDataRequest(api.create, dataFinal);

      if (response.status >= 200 && response.status < 300) {
        if (refreshQueryKey) {
          queryClient.invalidateQueries({ queryKey: refreshQueryKey });
          queryClient.refetchQueries({ queryKey: refreshQueryKey });
        }
        addToast({
          title: "Datos enviados con éxito",
          message: "Los datos se han enviado con éxito.",
          variant: "success",
        });
        if (invalidLaborsWithStatus.length > 0) {
          const responseFront = await postDataRequest(
            "frontLabor/many",
            invalidLaborsWithStatus,
          );
          if (responseFront.status >= 200 && responseFront.status < 300) {
            addToast({
              title: "Datos enviados con éxito",
              message: "Los datos se han enviado con éxito.",
              variant: "success",
            });
          }
        }

        form.reset();
        navigate(ruteReturn);
      } else {
        addToast({
          title: "Error al enviar los datos",
          message:
            response.data.message || "Ocurrió un error al enviar los datos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      addToast({
        title: "Error al enviar los datos",
        message:
          error.response.data.message ||
          "Ocurrió un error al enviar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setDataHotTable([]);
    setLoadingGlobal(false);
    navigate(ruteReturn);
  };

  useEffect(() => {
    setLoadingGlobal(true);
    if (!isEdit || !initialData) {
      setLoadingGlobal(false);
      return;
    }

    if (Array.isArray(initialData.dataEdit)) {
      setDataHotTable(initialData.dataEdit);
    }

    if (initialData.startDate && initialData.endDate) {
      form.setValue("dob", {
        start: new Date(initialData.startDate),
        end: new Date(initialData.endDate),
      });
    } else if (initialData.month && initialData.year) {
      form.setValue("dob", {
        start: dayjs()
          .year(initialData.year)
          .month(initialData.month - 1)
          .startOf("month")
          .toDate(),
        end: dayjs()
          .year(initialData.year)
          .month(initialData.month - 1)
          .endOf("month")
          .toDate(),
      });
    }

    if (Array.isArray(initialData.items)) {
      form.setValue("selectedItems", initialData.items);
    }

    setLoadingGlobal(false);
  }, [isEdit, initialData, form]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 items-center">
        <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
        <div>
          <h1 className="text-[15px] font-semibold leading-none">
            {isEdit ? "Editar" : "Crear"} {title}
          </h1>
          <h4 className="text-[12px] text-muted-foreground">
            {isEdit ? "Editar" : "Crear"} el plan mensual y enviarlo para
            aprobación.
          </h4>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <PlanHeader
          form={form}
          onSubmit={onSubmit}
          hasData={dataHotTable.length > 0}
          loadingGlobal={loadingGlobal}
          mode={mode}
          isEdit={isEdit}
        />
        <div className="flex flex-col gap-3 z-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-extrabold leading-5">
                Planificador /{" "}
                <strong className="font-extrabold capitalize text-primary">
                  {(() => {
                    const dob = form.watch("dob");

                    if (!dob?.start) return "Seleccione fecha";

                    if (mode === "weekly") {
                      const start = dayjs(dob.start).format("DD MMMM");
                      const end = dob.end
                        ? dayjs(dob.end).format("DD MMMM")
                        : null;

                      return end ? `${start} - ${end}` : start;
                    }

                    return dayjs(dob.start).format("MMMM YYYY");
                  })()}
                </strong>
              </h1>
              <span className="text-2xl font-extrabold">
                {totalTonnage.toLocaleString("es-MX")} tn
              </span>
            </div>

            {form.getValues().dob?.start && form.getValues().dob?.end && (
              <DataImportExcel
                loadingGlobal={loadingGlobal}
                setShowLoader={setShowLoader}
                setLoadingGlobal={setLoadingGlobal}
                setDataHotTable={setDataHotTable}
                dob={form.getValues("dob")}
                downloadUrl={downloadTemplate}
                downloadFileName={
                  mode === "weekly"
                    ? "Modelo_Semanal_Importacion.xlsx"
                    : "Modelo_Mensual_Importacion.xlsx"
                }
                form={form}
                dataLaborList={dataLaborVerify}
                withShifts={true}
              />
            )}
          </div>
          {showLoader ? (
            <div className="text-center py-4 text-zinc-500 h-[60vh] flex items-center justify-center ">
              <span className="flex flex-col gap-2 items-center">
                <IconLoader className="w-5 h-5 " />
              </span>
            </div>
          ) : dataHotTable.length === 0 ? (
            <div className="text-center text-zinc-400 h-[60vh] flex items-center justify-center ">
              <div className="flex flex-col items-center gap-0.5 max-w-[200px] w-full text-center">
                <Server className="size-5 text-zinc-400" />
                <b className="text-[10px] text-zinc-400">
                  No hay registros aún
                </b>
                <span className="text-[10px] font-semibold leading-3 text-zinc-300 mt-1">
                  Aún no se han creado registros para este período. Puede
                  importar un archivo Excel o crear registros manualmente desde
                  el botón &quot;Crear&quot; o &quot;Importar Excel&quot;.
                </span>
              </div>
            </div>
          ) : (
            <PlanContent
              dataHotTable={dataHotTable}
              dataLaborList={dataLaborVerify}
              setDataHotTable={setDataHotTable}
              loadingGlobal={loadingGlobal}
              setInvalidLabors={setInvalidLabors}
              form={form}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-between items-end">
        <div className="bg-sky-100/50 w-full md:w-fit rounded-xl px-6 py-2.5 flex gap-1 text-zinc-600 text-[11px] leading-4 border-t border-blue-500">
          <IconWarning className="text-blue-500  w-5 h-5 mr-1.5" />
          <div className="flex items-center">
            <ul className="list-disc ml-3 gap-x-6 ">
              <li>
                Para <strong>añadir</strong> una labor, seleccione un ítem en el
                botón
                <span className="font-semibold">&quot;Labor&quot;</span> y haga
                clic en <strong>Actualizar</strong>.
              </li>
              <li>
                Para <strong>eliminar</strong> una labor, quite la selección y
                luego haga clic en <strong>Actualizar</strong>.
              </li>
              <li className="">
                <strong className="font-bold text-green-500">Verde: </strong>
                Labor ya existe en el sistema, por lo tanto no será creada
                nuevamente.
              </li>
              <li className="">
                <strong className="font-bold text-red-600">Rojo: </strong>
                Labor no existe en el sistema. Será creada automáticamente.
              </li>
              <li>
                <strong className="font-bold bg-yellow-300">Amarillo</strong>:
                Labor ya fue registrada previamente. No se puede continuar con
                el envío del plan hasta resolver esta duplicación.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center w-full md:w-auto">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loadingGlobal}
            className="w-full md:w-fit"
          >
            <IconClose className="fill-zinc-400/50 w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSendData}
            disabled={dataHotTable.length === 0 || loadingGlobal}
            className="w-full md:w-fit"
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                {isEdit ? "Guardar Cambios" : "Enviar Plan"}
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
