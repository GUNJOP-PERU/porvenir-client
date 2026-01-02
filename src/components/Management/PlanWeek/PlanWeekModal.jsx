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
import { CircleFadingPlus, SendHorizontal, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import IconWarning from "@/icons/IconWarning";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlanHeader } from "./PlanHeader";
import { PlanContent } from "./PlanContent";
import { useToast } from "@/hooks/useToaster";
import readXlsxFile from "read-excel-file";
import { normalizarTajo } from "@/lib/utilsGeneral";

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
    "frontLabor/current",
    { enabled: false }
  );
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [invalidLabors, setInvalidLabors] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef(null);

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
        .map((key) => Number(row[key]) || 0);

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
      (sum, item) => sum + Number(item.tonnage) || 0,
      0
    );

    const planDayProcessed = (() => {
      const grouped = {};

      dataGenerate.forEach((item) => {
        const dateKey = dayjs(item.date).locale("es").format("ddd DD");
        const turno = item.turno;
        if (!grouped[dateKey]) grouped[dateKey] = {};
        if (!grouped[dateKey][turno]) grouped[dateKey][turno] = 0;
        grouped[dateKey][turno] += Number(item.tonnage) || 0;
      });

      return Object.entries(grouped).map(([date, turnos]) => ({
        date,
        tonnageByTurno: turnos,
      }));
    })();
    const result = {
      year: form.getValues("dob").end.getFullYear(),
      month: form.getValues("dob").end.getMonth() + 1,
      week: form.getValues("week"),
      totalTonnage,
      dataGenerate,
      dataEdit: dataHotTable,
      dataCalculate: planDayProcessed,
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

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      addToast({
        title: "Error de archivo",
        message: "Solo se permiten archivos .xlsx y .xls",
        variant: "destructive",
      });
      return;
    }

    setLoadingGlobal(true);
    setShowLoader(true);
    try {
      const data = await readXlsxFile(file);

      if (data.length === 0) {
        addToast({
          title: "Archivo vacío",
          message: "El archivo Excel está vacío.",
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const headers = data[0].map((h) => (h ? String(h).trim() : ""));

      const laborIndex = headers.findIndex(
        (h) => h.toLowerCase() === "labor" || h.toLowerCase() === "tajo"
      );
      const faseIndex = headers.findIndex(
        (h) => h.toLowerCase() === "fase"
      );

      if (laborIndex === -1) {
        addToast({
          title: "Columna Labor/Tajo no encontrada",
          message:
            "No se encontró la columna 'Labor' o 'Tajo' en el archivo Excel.\n\nEncabezados encontrados: " +
            headers.filter((h) => h).join(", "),
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      if (faseIndex === -1) {
        addToast({
          title: "Columna Fase no encontrada",
          message:
            "No se encontró la columna 'Fase' en el archivo Excel.\n\nEncabezados encontrados: " +
            headers.filter((h) => h).join(", "),
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const { dob } = form.getValues();
      if (!dob?.start || !dob?.end) {
        addToast({
          title: "Rango de fechas no seleccionado",
          message: "Debe seleccionar un rango de fechas antes de importar.",
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const startDate = dayjs(dob.start);
      const endDate = dayjs(dob.end);
      const daysInWeek = endDate.diff(startDate, "day") + 1; // Para plan semanal

      const expectedHeaders = []; // Formato: "DD-MM - DIA" o "DD-MM - NOCHE"
      const turnos = ["DIA", "NOCHE"];

      for (let i = 0; i < daysInWeek; i++) {
        const currentDate = startDate.add(i, "day").format("DD-MM").toUpperCase();
        turnos.forEach((turno) => {
          expectedHeaders.push(`${currentDate} - ${turno}`);
        });
      }

      // Función para parsear un encabezado de Excel y devolver { formattedDate: 'DD-MM', shift: 'DIA' | 'NOCHE' | null }
      const parseExcelHeader = (header) => {
        if (!header && header !== 0) return null;

        let parsedDate = null;
        let parsedShift = null;
        const headerStr = String(header).trim().toUpperCase();

        // Intentar con formato simplificado "D D" o "D N" (ej. "29 D", "1 N")
        const matchSimple = headerStr.match(/^(\d{1,2})\s(D|N)$/);
        if (matchSimple) {
          const day = matchSimple[1].padStart(2, "0");
          // Asumir el mes y año del rango seleccionado
          const year = dayjs(dob.start).year();
          const month = String(dayjs(dob.start).month() + 1).padStart(2, "0");
          parsedDate = dayjs(`${year}-${month}-${day}`);
          parsedShift = matchSimple[2] === "D" ? "DIA" : "NOCHE";
          if (parsedDate.isValid()) {
            return { formattedDate: parsedDate.format("DD-MM"), shift: parsedShift };
          }
        }

        // Intentar con formato "DD-MM - TURNO" (ej. "29-12 - DIA")
        const matchFull = headerStr.match(/^(\d{2}-\d{2}) - (DIA|NOCHE)$/);
        if (matchFull) {
          const dayMonth = matchFull[1];
          const [day, month] = dayMonth.split("-");
          const year = dayjs(dob.start).year();
          parsedDate = dayjs(`${year}-${month}-${day}`);
          parsedShift = matchFull[2];
          if (parsedDate.isValid()) {
            return { formattedDate: parsedDate.format("DD-MM"), shift: parsedShift };
          }
        }
        
        // Si es número (fecha serial de Excel), intentar convertirlo
        if (typeof header === "number") {
          parsedDate = dayjs("1899-12-30").add(header, "days");
          if (!parsedDate.isValid()) parsedDate = null; // Reset if invalid
        } 
        // Si es string (sin turno explícito), intentar parsear solo la fecha
        else {
          // DD/MM/YYYY o DD-MM-YYYY
          const matchDateFull = headerStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
          if (matchDateFull) {
            const [, day, month, year] = matchDateFull;
            parsedDate = dayjs(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
          }
          // DD/MM o DD-MM (solo día y mes)
          else if (headerStr.match(/^\d{1,2}[\/\-]\d{1,2}$/)) {
            const [day, month] = headerStr.split(/[\/\-]/);
            const year = dayjs(dob.start).year();
            parsedDate = dayjs(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
          }
          // DD-MM (formato exacto)
          else if (headerStr.match(/^\d{2}-\d{2}$/)) {
            const [day, month] = headerStr.split("-");
            const year = dayjs(dob.start).year();
            parsedDate = dayjs(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
          }
        }

        return parsedDate && parsedDate.isValid() ? { formattedDate: parsedDate.format("DD-MM"), shift: null } : null;
      };

      const dateColumnMap = {}; // Mapea "DD-MM - TURNO" a index de columna
      const dateShiftCount = {}; // Para inferir turno (DIA/NOCHE) por orden: { 'DD-MM': 0 | 1 }
      
      const orderedDateColumnsInExcel = []; // Guardar el orden de las columnas de fecha en Excel
      headers.forEach((header, index) => {
        if (index === laborIndex || index === faseIndex) {
          return; // Saltar las columnas de Labor y Fase
        }
        orderedDateColumnsInExcel.push({ index, header });
      });

      orderedDateColumnsInExcel.forEach(({ index, header }) => {
        const parsed = parseExcelHeader(header);
        if (parsed) {
          const { formattedDate, shift } = parsed;
          let finalShift = shift;

          if (!finalShift) {
            // Inferir el turno si no está explícito en el header
            dateShiftCount[formattedDate] = (dateShiftCount[formattedDate] || 0) + 1;
            finalShift = dateShiftCount[formattedDate] === 1 ? "DIA" : "NOCHE";
          }

          const expectedKey = `${formattedDate} - ${finalShift}`;

          if (expectedHeaders.includes(expectedKey)) {
            dateColumnMap[expectedKey] = index;
          } else {
            console.warn(`Advertencia: Clave esperada '${expectedKey}' no encontrada en la lista de headers esperados.`);
          }
        }
      });

      // Asegurarse de que todas las expectedHeaders tengan un mapeo
      // Si faltan, asignarles las columnas de Excel restantes en orden (mapeo secuencial como último recurso)
      const unmappedExcelColumns = orderedDateColumnsInExcel
        .filter(({ index }) => !Object.values(dateColumnMap).includes(index))
        .sort((a, b) => a.index - b.index);

      let unmappedExcelColIndex = 0;
      expectedHeaders.forEach((expectedKey) => {
        if (dateColumnMap[expectedKey] === undefined) {
          if (unmappedExcelColIndex < unmappedExcelColumns.length) {
            dateColumnMap[expectedKey] = unmappedExcelColumns[unmappedExcelColIndex].index;
            unmappedExcelColIndex++;
          }
        }
      });

      const parseNumericValue = (value) => {
        if (value === null || value === undefined) return 0;

        if (typeof value === "number") {
          return isNaN(value) ? 0 : value;
        }

        if (typeof value === "string") {
          let cleanValue = value.trim();
          if (!cleanValue) return 0;

          if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleanValue)) {
            cleanValue = cleanValue.replace(/,/g, "");
          } else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleanValue)) {
            cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
          } else if (/^\d+,\d+$/.test(cleanValue)) {
            cleanValue = cleanValue.replace(",", ".");
          } else if (cleanValue.includes(",") && !cleanValue.includes(".")) {
            const parts = cleanValue.split(",");
            if (parts[1] && parts[1].length <= 2) {
              cleanValue = cleanValue.replace(",", ".");
            } else {
              cleanValue = cleanValue.replace(/,/g, "");
            }
          }

          const parsed = Number(cleanValue);
          return isNaN(parsed) ? 0 : parsed;
        }

        return 0;
      };

      const processedData = [];
      for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        const row = data[rowIndex];
        const labor = row[laborIndex] ? String(row[laborIndex]).trim() : "";
        const fase = row[faseIndex] ? String(row[faseIndex]).trim() : "";

        if (!labor && !fase) continue;

        const rowData = {
          labor: labor ? normalizarTajo(labor) : "",
          fase: fase || "",
        };

        expectedHeaders.forEach((headerKey) => {
          const colIndex = dateColumnMap[headerKey];
          if (colIndex !== undefined && colIndex < row.length) {
            rowData[headerKey] = parseNumericValue(row[colIndex]);
          } else {
            rowData[headerKey] = 0;
          }
        });

        processedData.push(rowData);
      }

      if (processedData.length === 0) {
        addToast({
          title: "Sin datos válidos",
          message: "No se encontraron datos válidos en el archivo Excel.",
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      setTimeout(() => {
        setDataHotTable(processedData);
        setShowLoader(false);
        setLoadingGlobal(false);
        addToast({
          title: "Importación exitosa",
          message: `Se importaron ${processedData.length} fila(s) correctamente.`, 
          variant: "success"
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      console.error("Error al leer el archivo Excel:", error);
      addToast({
        title: "Error de lectura de Excel",
        message: `Error al leer el archivo Excel: ${error.message || "Por favor, verifique el formato del archivo."}`,
        variant: "destructive",
      });
      setShowLoader(false);
      setLoadingGlobal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (isEdit) setShowLoader(true);
      refetchLaborList().then(() => {
        if (isEdit && dataCrud?.dataEdit) {
          setDataHotTable(dataCrud.dataEdit);
          if (
            dataCrud?.startDate &&
            dataCrud?.endDate &&
            dataCrud?.week &&
            dataCrud?.items
          ) {
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-base font-extrabold leading-5">
                  Planificación /{" "}
                  <strong className="font-extrabold capitalize text-primary">
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
                  {totalTonnage.toLocaleString("es-MX")} <small>TM</small>
                </span>
              </div>
              {form.getValues().dob?.start && form.getValues().dob?.end && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImportExcel}
                    className="hidden"
                    disabled={loadingGlobal}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loadingGlobal || showLoader} // Deshabilita el botón si el loader está activo
                    onClick={handleImportButtonClick}
                    className="flex items-center gap-2"
                  >
                    {showLoader ? (
                      <>
                        <IconLoader className="w-4 h-4" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Importar Excel
                      </>
                    )}
                  </Button>
                </>)}
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
                dataLaborList={dataLaborList}
                setDataHotTable={setDataHotTable}
                loadingGlobal={loadingGlobal}
                setInvalidLabors={setInvalidLabors}
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
