/* eslint-disable react/prop-types */
import { postDataRequest } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { useToast } from "@/hooks/useToaster";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import IconWarning from "@/icons/IconWarning";
import { getDefaultDateObj, getDefaultShift } from "@/lib/utilsGeneral";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CircleFadingPlus, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PlanContent } from "./PlanDayContent";
import { PlanHeader } from "./PlanDayHeader";
import { DataImportExcel } from "./DataImportExcel";

const FormSchema = z.object({
  dob: z.date({ required_error: "*Se requiere una fecha." }),
  shift: z.string().min(2, { message: "*Turno." }),
  selectedItems: z.array(z.string()).optional(),
});

export const ModalPlanDay = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [invalidLabors, setInvalidLabors] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      form.reset({
        dob: getDefaultDateObj(),
        selectedItems: [],
        shift: getDefaultShift(),
      });
    }
  }, [isOpen]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: getDefaultDateObj(),
      selectedItems: [],
      shift: getDefaultShift(),
    },
  });
  // Cambiar la fecha sin perder valores previos
  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD").toUpperCase();
    setDataHotTable((prevData) =>
      prevData.map((row) => {
        const oldDateKey = Object.keys(row).find((key) =>
          key.match(/^\d{4}-\d{2}-\d{2}$/),
        );

        if (!oldDateKey) return row;

        const { [oldDateKey]: oldValue, ...rest } = row;
        return { ...rest, [formattedDate]: oldValue };
      }),
    );
  };

  // Añadir nuevas labores sin eliminar las existentes
  const handleAddLabor = (newItems) => {
    setDataHotTable((prevData) => {
      const existingLabors = prevData.map((row) => row.labor);
      const formattedDate = dayjs(form.getValues().dob)
        .format("YYYY-MM-DD")
        .toUpperCase();

      const newLabors = newItems
        .filter((item) => !existingLabors.includes(item))
        .map((labor) => ({
          zona: "ALTA",
          labor,
          fase: "MINERAL",
          [formattedDate]: Math.floor(Math.random() * 100) * 100,
        }));

      return [...prevData, ...newLabors];
    });
  };

  // Eliminar labores que ya no estén seleccionadas
  const handleRemoveLabor = (selectedItems) => {
    setDataHotTable((prevData) =>
      prevData.filter((row) => selectedItems.includes(row.labor)),
    );
  };

  // ✅ Calcular el total de toneladas
  const calculateTotal = () => {
    if (!dataHotTable || dataHotTable.length === 0) return 0;

    return dataHotTable.reduce((total, row) => {
      const tonnageValues = Object.keys(row)
        .filter((key) => key.match(/^\d{4}-\d{2}-\d{2}$/))
        .map((fecha) => row[fecha] || 0);

      return total + tonnageValues.reduce((sum, tonnage) => sum + tonnage, 0);
    }, 0);
  };

  const totalTonnage = calculateTotal();

  const onSubmit = (data) => {
    setLoadingGlobal(true);
    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      handleDateChange(data.dob);

      // 🔑 Si no hay items seleccionados, usar array con string vacío
      const items = data.selectedItems.length > 0 ? data.selectedItems : [""];

      handleAddLabor(items);
      handleRemoveLabor(items);
      setLoadingGlobal(false);
    }, 1500);
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);
    const { shift } = form.getValues();
    const tieneCamposVacios = dataHotTable.some(
      (row) => !row.labor || !row.fase,
    );
    const laborCounts = dataHotTable.reduce((acc, row) => {
      acc[row.labor] = (acc[row.labor] || 0) + 1;
      return acc;
    }, {});
    const tieneRepetidos = Object.values(laborCounts).some(
      (count) => count > 1,
    );

    // const laborFormatoIncorrecto = dataHotTable.some((row) => {
    //   if (!row || !row.labor) return false;

    //   const partes = row.labor.split("_");

    //   if (partes.length !== 3) return true; // Debe tener exactamente 3 partes

    //   // La primera parte DEBE ser un número (NIVEL)
    //   const primeraEsNumero = /^\d+$/.test(partes[0]);
    //   if (!primeraEsNumero) return true;

    //   // Verificar si tiene T- en lugar de TJ- en la tercera parte
    //   if (/^T-/.test(partes[2]) && !/^TJ-/.test(partes[2])) return true;

    //   return false;
    // });

    const tieneTonelajeCeroOVacio = dataHotTable.some((row) => {
      const fechas = Object.keys(row).filter((key) =>
        key.match(/^\d{4}-\d{2}-\d{2}$/),
      );

      return fechas.some((fecha) => {
        const tonnage = parseFloat(row[fecha]);
        return (
          isNaN(tonnage) ||
          tonnage === 0 ||
          row[fecha] === "" ||
          row[fecha] === null
        );
      });
    });

    // if (laborFormatoIncorrecto) {
    //   addToast({
    //     title: "Error de formato de labor",
    //     message:
    //       "Una o más labores tienen formato incorrecto. El formato debe ser: NIVEL_FASE_LABOR (ej: 1600_OB1_TJ-081P). Usa el botón 'Corregir formato' para arreglarlas automáticamente.",
    //     variant: "destructive",
    //   });
    //   setLoadingGlobal(false);
    //   return;
    // }

    if (tieneCamposVacios) {
      addToast({
        title: "Campos vacíos",
        message: "Hay filas con 'Labor' o 'Fase' vacías en la tabla.",
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

    if (tieneTonelajeCeroOVacio) {
      addToast({
        title: "Tonelaje inválido",
        message:
          "No se permite tonelaje en 0 o vacío. Por favor, verifica los datos ingresados.",
        variant: "destructive",
      });
      setLoadingGlobal(false);
      return;
    }

    const invalidLaborsWithStatus = invalidLabors.map((labor) => ({
      name: labor,
      status: true,
    }));

    const datosFinales = dataHotTable.flatMap((row) => {
      const fechas = Object.keys(row).filter((key) =>
        key.match(/^\d{4}-\d{2}-\d{2}$/),
      );

      return fechas.map((fecha) => ({
        zone: row.zona,
        frontLabor: row.labor,
        phase: row.fase,
        date: fecha,
        tonnage: row[fecha],
        shift: shift,
      }));
    });

    try {
      const response = await postDataRequest("planDay/many", [
        ...datosFinales.map((e) => ({
          ...e,
          type: "blending",
          startDate: new Date(),
        })),
        ...datosFinales.map((e) => ({
          ...e,
          type: "modificado",
          startDate: new Date(),
        })),
      ]);

      if (response.status < 200 || response.status >= 300) {
        addToast({
          title: "Error al enviar los datos",
          message:
            response.data.message || "Ocurrió un error al enviar los datos.",
          variant: "destructive",
        });
        return;
      }

      // Segunda petición: frontLabor (solo si hay labores inválidas)
      let frontLaborSuccess = true;
      if (invalidLaborsWithStatus.length > 0) {
        try {
          const responseFront = await postDataRequest(
            "frontLabor/many",
            invalidLaborsWithStatus,
          );
          // console.log("Response Front:", responseFront);

          if (responseFront.status < 200 || responseFront.status >= 300) {
            frontLaborSuccess = false;
            addToast({
              title: "Advertencia",
              message:
                "Los datos se guardaron, pero hubo un error al actualizar las labores inválidas.",
              variant: "warning", // o "destructive" según tu preferencia
            });
          }
        } catch (errorFront) {
          frontLaborSuccess = false;
          console.error("Error en frontLabor/many:", errorFront);
          addToast({
            title: "Advertencia",
            message:
              "Los datos se guardaron, pero hubo un error al actualizar las labores inválidas.",
            variant: "warning",
          });
        }
      }

      // Mostrar mensaje de éxito solo si todo salió bien
      if (frontLaborSuccess) {
        addToast({
          title: "Éxito",
          message: "Datos enviados correctamente!",
          variant: "success", // o el variant que uses para éxito
        });
      }

      // Invalidar queries y limpiar datos
      queryClient.invalidateQueries({ queryKey: ["crud", "planDay"] });
      setDataHotTable([]);

      if (onClose) onClose();
      form.reset();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      addToast({
        title: "Error al enviar los datos",
        message:
          error?.response?.data?.message ||
          "Ocurrió un error al enviar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose(); // Cerrar el modal
    form.reset(); // Restablecer los valores del formulario
    setDataHotTable([]); // Limpiar la tabla de datos
    setLoadingGlobal(false); // Detener cualquier indicador de carga
  };

  return (
    <Dialog open={isOpen} modal={false}>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" />}
      <DialogContent className="max-w-[1100px] w-[95vw]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>Crear nuevo Plan de Turno</DialogTitle>
              <DialogDescription>
                Ingresar los datos necesarios para la creación y enviar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-3 overflow-hidden">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <PlanHeader
              form={form}
              onSubmit={onSubmit}
              hasData={dataHotTable.length > 0}
              loadingGlobal={loadingGlobal}
            />
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-base font-extrabold leading-5">
                    Planificación /{" "}
                    <strong className="font-extrabold capitalize text-primary">
                      {" "}
                      {dayjs(form.watch("dob")).format("DD MMMM")}
                    </strong>
                  </h1>
                  <span className="text-2xl font-extrabold">
                    {totalTonnage.toLocaleString("es-MX")} tn
                  </span>
                </div>
                {form.getValues().dob && (
                  <DataImportExcel
                    loadingGlobal={loadingGlobal}
                    setShowLoader={setShowLoader}
                    setLoadingGlobal={setLoadingGlobal}
                    setDataHotTable={setDataHotTable}
                    dob={form.getValues("dob")}
                    downloadUrl="/ExcelModelo/Modelo_Diario.xlsx"
                    downloadFileName="Modelo_Diario_Importacion.xlsx"
                    form={form}
                    dataLaborList={dataLaborVerify}
                  />
                )}
              </div>
              {showLoader ? (
                <div className="text-center py-4 text-zinc-500 h-[30vh] flex items-center justify-center ">
                  <span className="flex flex-col gap-2 items-center">
                    <IconLoader className="w-8 h-8" />
                  </span>
                </div>
              ) : dataHotTable.length === 0 ? (
                <div className="text-center text-zinc-400 h-[30vh] flex items-center justify-center ">
                  <span className="text-xs">Datos no creados</span>
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
          <div className="w-full lg:w-[300px] flex-shrink-0 bg-sky-100/50 border-l-4 border-blue-500 rounded-r-xl px-4 py-3 flex flex-col gap-3 text-zinc-700 text-[11px]">
            <div className="flex gap-1.5 w-full">
              <IconWarning className="text-blue-500 w-4 h-4 flex-shrink-0" />
              <span className="font-bold text-blue-800 uppercase text-[11px]">
                Guía de Gestión de Labores
              </span>
            </div>
            <div className="bg-white/60 p-2.5 rounded-lg border border-yellow-200">
              <p className="font-bold text-yellow-700 mb-1 flex items-center gap-1">
                ⚠️ Formato de Labor:
              </p>
              <p className="text-zinc-600 leading-3">
                El formato correcto es:{" "}
                <code className="bg-zinc-100 px-1 rounded text-blue-600 font-bold">
                  NIVEL_VETA_LABOR
                </code>
                <br />
                <span className="italic text-[10px]">
                  (Ej: 1600_OB1_TJ-081P)
                </span>
                .
              </p>
              <p className="mt-1.5 text-[10px] text-zinc-500 leading-3">
                Use el botón{" "}
                <span className="font-bold text-yellow-600 underline">
                  &quot;Corregir formato&quot;
                </span>{" "}
                para arreglarlas automáticamente.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <div className="space-y-2">
                <p className="font-semibold text-zinc-800 border-b border-blue-100 pb-1">
                  Acciones en Tabla:
                </p>
                <ul className="space-y-1.5 leading-4">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500">•</span>
                    <span>
                      <strong>Crear Plan:</strong> Asigne{" "}
                      <strong>Fecha y Turno</strong> y pulse{" "}
                      <strong className="text-blue-700">
                        &quot;Crear Plan&quot;
                      </strong>{" "}
                      para habilitar la tabla (no es obligatorio seleccionar
                      labores previamente). Si lo prefiere, use el botón{" "}
                      <strong>&quot;Seleccionar Labor(es)&quot;</strong> para
                      carga masiva o simplemente{" "}
                      <strong>escriba de forma manual</strong> en las celdas.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5 text-blue-700 italic">
                    <span className="text-blue-500">•</span>
                    <span>
                      Si escribe una labor nueva en una celda vacía, el sistema
                      la{" "}
                      <strong>reconocerá y la guardará automáticamente</strong>{" "}
                      cuando envíe el plan.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500">•</span>
                    <span>
                      <strong>Interactividad:</strong> Como en Excel, puede
                      copiar, pegar, arrastrar valores o hacer{" "}
                      <strong>doble clic</strong> para editar cualquier celda.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500">•</span>
                    <span>
                      <strong>Crear/Eliminar filas:</strong> Haga{" "}
                      <kbd className="px-1 py-0.5 bg-white border rounded shadow-sm text-[9px]">
                        Clic derecho
                      </kbd>{" "}
                      sobre una fila para insertar o borrar una labor de la
                      lista.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-zinc-800 border-b border-blue-100 pb-1">
                  Validación (Columna Labor):
                </p>
                <ul className="space-y-1.5 leading-4">
                  <li className="flex items-center gap-2 text-green-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_3px_rgba(34,197,94,0.6)]"></span>
                    <span>Verde: Labor existente (no se duplicará).</span>
                  </li>
                  <li className="flex items-center gap-2 text-red-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_3px_rgba(220,38,38,0.6)]"></span>
                    <span>Rojo: Labor nueva (se creará al enviar).</span>
                  </li>
                  <li className="flex items-center gap-2 text-yellow-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_3px_rgba(250,204,21,0.6)]"></span>
                    <span>
                      <strong className="font-bold bg-yellow-300">
                        Amarillo:
                      </strong>{" "}
                      Labor duplicada (Resolver para enviar).
                    </span>
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
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
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
