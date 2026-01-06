import { useFetchData } from "@/hooks/useGlobalQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  ArrowDownToLine,
  CircleFadingPlus,
  SendHorizontal,
  Server,
  Upload,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import readXlsxFile from "read-excel-file";
import { normalizarTajo, normalizarFase } from "@/lib/utilsGeneral";

import { Button } from "@/components/ui/button";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";

import { PlanContent } from "@/components/Management/PlanMonth/PlanContent";
import { PlanHeader } from "@/components/Management/PlanMonth/PlanHeader";
import IconWarning from "@/icons/IconWarning";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { postDataRequest, putDataRequest } from "@/api/api";
import { useToast } from "@/hooks/useToaster";
import { RiFileExcel2Line } from "react-icons/ri";
import { generateNormalWeeks } from "@/components/Dashboard/WeekReport/MiningWeeksSelect";

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
  dateSelector,
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
  const fileInputRef = useRef(null);

  const { allWeeks, currentWeek } = generateNormalWeeks();

  const { data: dataLaborVerify, refetch: refetchLaborVerify } = useFetchData(
    "frontLabor-general",
    "frontLabor",
    {
      enabled: true,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    }
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
        labor,
        fase: index % 2 === 0 ? "mineral" : "desmonte",
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

  const calculateTotal = () => {
    if (!dataHotTable || dataHotTable.length === 0) return 0;

    return dataHotTable.reduce((total, row) => {
      const values = Object.entries(row)
        .filter(([key]) => key.endsWith(" - DIA") || key.endsWith(" - NOCHE"))
        .map(([, value]) => Number(value) || 0);

      return total + values.reduce((sum, v) => sum + v, 0);
    }, 0);
  };

  const totalTonnage = calculateTotal();

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
      const faseIndex = headers.findIndex((h) => h.toLowerCase() === "fase");

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
      const totalDays = endDate.diff(startDate, "day") + 1;

      const expectedHeaders = [];
      const turnos = ["DIA", "NOCHE"];

      for (let i = 0; i < totalDays; i++) {
        const currentDate = startDate
          .add(i, "day")
          .format("DD-MM")
          .toUpperCase();
        turnos.forEach((turno) => {
          expectedHeaders.push(`${currentDate} - ${turno}`);
        });
      }

      const parseExcelHeader = (header) => {
        if (!header && header !== 0) return null;

        let parsedDate = null;
        let parsedShift = null;
        const headerStr = String(header).trim().toUpperCase();

        const matchSimple = headerStr.match(/^(\d{1,2})\s(D|N)$/);
        if (matchSimple) {
          const day = matchSimple[1].padStart(2, "0");
          const year = dayjs(dob.start).year();
          const month = String(dayjs(dob.start).month() + 1).padStart(2, "0");
          parsedDate = dayjs(`${year}-${month}-${day}`);
          parsedShift = matchSimple[2] === "D" ? "DIA" : "NOCHE";
          if (parsedDate.isValid()) {
            return {
              formattedDate: parsedDate.format("DD-MM"),
              shift: parsedShift,
            };
          }
        }

        const matchFull = headerStr.match(/^(\d{2}-\d{2}) - (DIA|NOCHE)$/);
        if (matchFull) {
          const dayMonth = matchFull[1];
          const [day, month] = dayMonth.split("-");
          const year = dayjs(dob.start).year();
          parsedDate = dayjs(`${year}-${month}-${day}`);
          parsedShift = matchFull[2];
          if (parsedDate.isValid()) {
            return {
              formattedDate: parsedDate.format("DD-MM"),
              shift: parsedShift,
            };
          }
        }

        if (typeof header === "number") {
          parsedDate = dayjs("1899-12-30").add(header, "days");
          if (!parsedDate.isValid()) parsedDate = null;
        } else {
          const matchDateFull = headerStr.match(
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/
          );
          if (matchDateFull) {
            const [, day, month, year] = matchDateFull;
            parsedDate = dayjs(
              `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
            );
          } else if (headerStr.match(/^\d{1,2}[\/\-]\d{1,2}$/)) {
            const [day, month] = headerStr.split(/[\/\-]/);
            const year = dayjs(dob.start).year();
            parsedDate = dayjs(
              `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
            );
          } else if (headerStr.match(/^\d{2}-\d{2}$/)) {
            const [day, month] = headerStr.split("-");
            const year = dayjs(dob.start).year();
            parsedDate = dayjs(
              `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
            );
          }
        }

        return parsedDate && parsedDate.isValid()
          ? { formattedDate: parsedDate.format("DD-MM"), shift: null }
          : null;
      };

      const dateColumnMap = {};
      const dateShiftCount = {};

      const orderedDateColumnsInExcel = [];
      headers.forEach((header, index) => {
        if (index === laborIndex || index === faseIndex) {
          return;
        }
        orderedDateColumnsInExcel.push({ index, header });
      });

      orderedDateColumnsInExcel.forEach(({ index, header }) => {
        const parsed = parseExcelHeader(header);
        if (parsed) {
          const { formattedDate, shift } = parsed;
          let finalShift = shift;

          if (!finalShift) {
            dateShiftCount[formattedDate] =
              (dateShiftCount[formattedDate] || 0) + 1;
            finalShift = dateShiftCount[formattedDate] === 1 ? "DIA" : "NOCHE";
          }

          const expectedKey = `${formattedDate} - ${finalShift}`;

          if (expectedHeaders.includes(expectedKey)) {
            dateColumnMap[expectedKey] = index;
          } else {
            console.warn(
              `Advertencia: Clave esperada '${expectedKey}' no encontrada en la lista de headers esperados.`
            );
          }
        }
      });

      const unmappedExcelColumns = orderedDateColumnsInExcel
        .filter(({ index }) => !Object.values(dateColumnMap).includes(index))
        .sort((a, b) => a.index - b.index);

      let unmappedExcelColIndex = 0;
      expectedHeaders.forEach((expectedKey) => {
        if (dateColumnMap[expectedKey] === undefined) {
          if (unmappedExcelColIndex < unmappedExcelColumns.length) {
            dateColumnMap[expectedKey] =
              unmappedExcelColumns[unmappedExcelColIndex].index;
            unmappedExcelColIndex++;
          }
        }
      });

      const mappedDays = new Set(
        Object.keys(dateColumnMap).map((k) => k.split(" - ")[0])
      );

      if (mappedDays.size !== totalDays) {
        addToast({
          title: "Advertencia",
          message: `El Excel tiene ${mappedDays.size} días mapeados, pero el rango seleccionado tiene ${totalDays}. Revise que las fechas del archivo coincidan con el rango.`,
          variant: "warning",
        });
      }

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
          fase: fase ? normalizarFase(fase) : "",
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
        const importedItems = Array.from(
          new Set(processedData.map((row) => row.labor).filter(Boolean))
        );

        form.setValue("selectedItems", importedItems, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setShowLoader(false);
        setLoadingGlobal(false);
        addToast({
          title: "Importación exitosa",
          message: `Se importaron ${processedData.length} fila(s) correctamente.`,
          variant: "success",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      console.error("Error al leer el archivo Excel:", error);
      addToast({
        title: "Error de lectura de Excel",
        message: `Error al leer el archivo Excel: ${
          error.message || "Por favor, verifique el formato del archivo."
        }`,
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

  const handleSendData = async () => {
    setLoadingGlobal(true);
    const { dob } = form.getValues();

    const tieneCamposVacios = dataHotTable.some(
      (row) => !row.labor || !row.fase
    );

    const laborCounts = dataHotTable.reduce((acc, row) => {
      acc[row.labor] = (acc[row.labor] || 0) + 1;
      return acc;
    }, {});
    const tieneRepetidos = Object.values(laborCounts).some(
      (count) => count > 1
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

    const datosFinales = dataHotTable.flatMap((row) => {
      const year = form.getValues("dob").end.getFullYear();
      return Object.entries(row)
        .filter(([key]) => key.includes("- DIA") || key.includes("- NOCHE"))
        .map(([key, value]) => {
          const [dayMonth, turnoText] = key.split(" - ");
          const [day, monthStr] = dayMonth.split("-");
          const date = `${year}-${monthStr.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
          const turno = turnoText.toLowerCase();

          return {
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
      0
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
            dataFinal
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
        const responseFront = await postDataRequest(
          "frontLabor/many",
          invalidLaborsWithStatus
        );

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
    }

    if (Array.isArray(initialData.items)) {
      form.setValue("selectedItems", initialData.items);
    }

    setLoadingGlobal(false);
  }, [isEdit, initialData]);

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
              <div className="flex">
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
                  disabled={loadingGlobal}
                  onClick={handleImportButtonClick}
                  className="bg-green-600 hover:bg-green-500 px-3 rounded-e-none"
                >
                  <RiFileExcel2Line className="size-3 text-white" />
                  Importar Excel
                </Button>
                <a
                  href={`${import.meta.env.VITE_URL}api/v1/${downloadTemplate}`}
                  download
                  className="bg-green-700 hover:bg-green-800 px-3 flex items-center gap-1 text-xs text-white rounded-s-none rounded-lg h-8"
                >
                  <ArrowDownToLine className="size-3 text-white" />
                  Descargar Modelo
                </a>
              </div>
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
                  el botón "Crear" o "Importar Excel".
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
                <span className="font-semibold"> "Labor"</span> y haga clic en{" "}
                <strong>Actualizar</strong>.
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
                {isEdit ? "Actualizar Plan" : "Enviar Plan"}
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
