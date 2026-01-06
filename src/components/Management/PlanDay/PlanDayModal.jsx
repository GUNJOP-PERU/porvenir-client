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
import {
  ArrowDownToLine,
  CircleFadingPlus,
  SendHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlanContent } from "./PlanDayContent";
import { PlanHeader } from "./PlanDayHeader";
import { FrontLaborSubHeader } from "./FrontLaborSubHeader";
import IconWarning from "@/icons/IconWarning";
import { useQueryClient } from "@tanstack/react-query";
import {
  getDefaultShift,
  getDefaultDateObj,
  normalizarTajo,
  normalizarFase
} from "@/lib/utilsGeneral";
import { useToast } from "@/hooks/useToaster";
import readXlsxFile from "read-excel-file";
import { RiFileExcel2Line } from "react-icons/ri";

const FormSchema = z.object({
  dob: z.date({ required_error: "*Se requiere una fecha." }),
  shift: z.string().min(2, { message: "*Turno." }),
  selectedItems: z.array(z.string()).nonempty({ message: "*Labor." }),
});

export const ModalPlanDay = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [invalidLabors, setInvalidLabors] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showFrontLaborSubHeader, setShowFrontLaborSubHeader] = useState(false);
  const fileInputRef = useRef(null);

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
          key.match(/^\d{4}-\d{2}-\d{2}$/)
        );

        if (!oldDateKey) return row;

        const { [oldDateKey]: oldValue, ...rest } = row;
        return { ...rest, [formattedDate]: oldValue };
      })
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
          labor,
          fase: "mineral",
          [formattedDate]: Math.floor(Math.random() * 100) * 100,
        }));

      return [...prevData, ...newLabors];
    });
  };

  // Eliminar labores que ya no estén seleccionadas
  const handleRemoveLabor = (selectedItems) => {
    setDataHotTable((prevData) =>
      prevData.filter((row) => selectedItems.includes(row.labor))
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
      handleAddLabor(data.selectedItems);
      handleRemoveLabor(data.selectedItems);
      setLoadingGlobal(false);
    }, 1500);
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);
    const { shift } = form.getValues();

    const datosFinales = dataHotTable.flatMap((row) => {
      const fechas = Object.keys(row).filter((key) =>
        key.match(/^\d{4}-\d{2}-\d{2}$/)
      );

      return fechas.map((fecha) => ({
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

      if (response.status >= 200 && response.status < 300) {
        addToast({
          title: "Datos enviados con éxito",
          message: "Los datos se han enviado con éxito.",
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["crud", "planDay"] });
        setDataHotTable([]);
      } else {
        addToast({
          title: "Error al enviar los datos",
          message:
            error.response.data.message ||
            "Ocurrió un error al enviar los datos.",
          variant: "destructive",
        });
      }

      if (onClose) onClose();
      form.reset();
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
      setLoadingGlobal(false); // Detener indicador de carga
    }
  };

  const handleCancel = () => {
    if (onClose) onClose(); // Cerrar el modal
    form.reset(); // Restablecer los valores del formulario
    setDataHotTable([]); // Limpiar la tabla de datos
    setLoadingGlobal(false); // Detener cualquier indicador de carga
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
      if (!dob) {
        addToast({
          title: "Fecha no seleccionada",
          message: "Debe seleccionar una fecha antes de importar.",
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const formattedDate = dayjs(dob).format("YYYY-MM-DD");
      const expectedHeaders = [formattedDate];

      const parseExcelHeader = (header) => {
        if (!header && header !== 0) return null;

        let parsedDate = null;
        const headerStr = String(header).trim().toUpperCase();

        // Excel numérico
        if (typeof header === "number") {
          parsedDate = dayjs("1899-12-30").add(header, "days");
        }
        // DD/MM/YYYY o DD-MM-YYYY
        else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(headerStr)) {
          const [day, month, year] = headerStr.split(/[\/\-]/);
          parsedDate = dayjs(`${year}-${month}-${day}`);
        }
        // DD/MM o DD-MM
        else if (/^\d{1,2}[\/\-]\d{1,2}$/.test(headerStr)) {
          const [day, month] = headerStr.split(/[\/\-]/);
          const year = dayjs(dob).year();
          parsedDate = dayjs(`${year}-${month}-${day}`);
        }
        // DD-MM
        else if (/^\d{2}-\d{2}$/.test(headerStr)) {
          const [day, month] = headerStr.split("-");
          const year = dayjs(dob).year();
          parsedDate = dayjs(`${year}-${month}-${day}`);
        }

        return parsedDate?.isValid() ? parsedDate.format("YYYY-MM-DD") : null;
      };

      const dateColumnMap = {};

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
          const formattedDate = parseExcelHeader(header);
          if (formattedDate && expectedHeaders.includes(formattedDate)) {
            dateColumnMap[formattedDate] = index;
          }

          if (expectedHeaders.includes(formattedDate)) {
            dateColumnMap[formattedDate] = index;
          } else {
            console.warn(
              `Advertencia: Fecha '${formattedDate}' no encontrada en la lista de headers esperados.`
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
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!loadingGlobal) onClose(open);
      }}
      modal={true}
    >
      <DialogContent className="w-[680px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>Crear nuevo</DialogTitle>
              <DialogDescription>
                Ingresar los datos necesarios para la creación y enviar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col">
          <PlanHeader
            form={form}
            onSubmit={onSubmit}
            hasData={dataHotTable.length > 0}
            loadingGlobal={loadingGlobal}
            frontLaborSubHeader={showFrontLaborSubHeader}
            setShowFrontLaborSubHeader={setShowFrontLaborSubHeader}
          />
          <FrontLaborSubHeader frontLaborSubHeader={showFrontLaborSubHeader} />
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
                    className="bg-green-600 hover:bg-green-500 px-3 rounded-e-none"
                    onClick={handleImportButtonClick}
                    type="button"
                    disabled={loadingGlobal}
                  >
                    <RiFileExcel2Line className="size-3 text-white" />
                    Importar excel
                  </Button>
                  <a
                    href={`${
                      import.meta.env.VITE_URL
                    }api/v1/planDay/download/modelo-turno`}
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
                  <li className="">
                    <strong className="font-bold text-green-500">
                      Verde:{" "}
                    </strong>
                    Labor ya existe en el sistema, por lo tanto no será creada
                    nuevamente.
                  </li>
                  <li className="">
                    <strong className="font-bold text-red-600">Rojo: </strong>
                    Labor no existe en el sistema. Será creada automáticamente.
                  </li>
                  <li>
                    <strong className="font-bold bg-yellow-300">
                      Amarillo
                    </strong>
                    : Labor ya fue registrada previamente. No se puede continuar
                    con el envío del plan hasta resolver esta duplicación.
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
