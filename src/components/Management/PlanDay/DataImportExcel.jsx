/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToaster";
import { ArrowDownToLine } from "lucide-react";
import { useRef } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import readXlsxFile from "read-excel-file";
import dayjs from "dayjs";
import {
  normalizarFase,
  normalizarTajo,
  normalizarZona,
} from "@/lib/utilsGeneral";

export const DataImportExcel = ({
  setDataHotTable,
  loadingGlobal = false,
  setShowLoader,
  setLoadingGlobal,
  dob,
  downloadUrl,
  downloadFileName,
  form,
  dataLaborList,
  withShifts = false,
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const handleImportExcel = async (event) => {
    const file = event.target.files?.[0];
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

      const zonaIndex = headers.findIndex((h) => h.toLowerCase() === "zona");
      const laborIndex = headers.findIndex(
        (h) => h.toLowerCase() === "labor" || h.toLowerCase() === "tajo",
      );
      const faseIndex = headers.findIndex((h) => h.toLowerCase() === "fase");

      if (zonaIndex === -1) {
        addToast({
          title: "Columna Zona no encontrada",
          message:
            "No se encontró la columna 'Zona' en el archivo Excel.\n\nEncabezados encontrados: " +
            headers.filter((h) => h).join(", "),
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

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

      // Determinar rango de fechas
      let startDate;
      let endDate;

      if (dob instanceof Date) {
        startDate = dayjs(dob);
        endDate = dayjs(dob);
      } else {
        startDate = dayjs(dob.start);
        endDate = dayjs(dob.end);
      }

      if (!startDate.isValid() || !endDate.isValid()) {
        addToast({
          title: "Fecha inválida",
          message: "Debe seleccionar una fecha o un rango válido.",
          variant: "destructive",
        });
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const totalDays = endDate.diff(startDate, "day") + 1;

      const expectedHeaders = [];
      const turnos = ["DIA", "NOCHE"];

      for (let i = 0; i < totalDays; i++) {
        const currentDate = startDate.add(i, "day");
        if (withShifts) {
          const formattedDate = currentDate.format("DD-MM");
          turnos.forEach((turno) => {
            expectedHeaders.push(`${formattedDate} - ${turno}`);
          });
        } else {
          expectedHeaders.push(currentDate.format("YYYY-MM-DD"));
        }
      }

      const parseExcelHeader = (header) => {
        if (!header && header !== 0) return null;

        let parsedDate = null;
        let parsedShift = null;
        const headerStr = String(header).trim().toUpperCase();

        if (withShifts) {
          // Formatos específicos para Plan Mensual (con turnos)
          const matchShiftSimple = headerStr.match(/^(\d{1,2})\s(D|N)$/);
          if (matchShiftSimple) {
            const day = matchShiftSimple[1].padStart(2, "0");
            const year = startDate.year();
            const month = String(startDate.month() + 1).padStart(2, "0");
            parsedDate = dayjs(`${year}-${month}-${day}`);
            parsedShift = matchShiftSimple[2] === "D" ? "DIA" : "NOCHE";
            if (parsedDate.isValid()) {
              return {
                formattedDate: parsedDate.format("DD-MM"),
                shift: parsedShift,
              };
            }
          }

          const matchShiftFull = headerStr.match(
            /^(\d{2}-\d{2}) - (DIA|NOCHE)$/,
          );
          if (matchShiftFull) {
            const dayMonth = matchShiftFull[1];
            const [day, month] = dayMonth.split("-");
            const year = startDate.year();
            parsedDate = dayjs(`${year}-${month}-${day}`);
            parsedShift = matchShiftFull[2];
            if (parsedDate.isValid()) {
              return {
                formattedDate: parsedDate.format("DD-MM"),
                shift: parsedShift,
              };
            }
          }
        }

        // Formatos generales de fecha
        const matchOnlyDay = headerStr.match(/^(\d{1,2})$/);
        if (matchOnlyDay) {
          const day = matchOnlyDay[1].padStart(2, "0");
          const year = startDate.year();
          const month = String(startDate.month() + 1).padStart(2, "0");
          parsedDate = dayjs(`${year}-${month}-${day}`);
        } else if (headerStr.match(/^(\d{2}-\d{2})$/)) {
          const [day, month] = headerStr.split("-");
          parsedDate = dayjs(`${startDate.year()}-${month}-${day}`);
        } else if (typeof header === "number") {
          parsedDate = dayjs("1899-12-30").add(header, "days");
        } else {
          const matchDateFull = headerStr.match(
            /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
          );
          if (matchDateFull) {
            const [, day, month, year] = matchDateFull;
            parsedDate = dayjs(
              `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
            );
          } else if (headerStr.match(/^\d{1,2}[/-]\d{1,2}$/)) {
            const [day, month] = headerStr.split(/[/-]/);
            parsedDate = dayjs(
              `${startDate.year()}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0",
              )}`,
            );
          }
        }

        if (parsedDate && parsedDate.isValid()) {
          return {
            formattedDate: parsedDate.format(
              withShifts ? "DD-MM" : "YYYY-MM-DD",
            ),
            shift: parsedShift,
          };
        }
        return null;
      };

      // Mapear columnas de fecha (excluir zona, labor, fase)
      const dateColumnMap = {};
      const dateShiftCount = {};
      const orderedDateColumnsInExcel = [];

      headers.forEach((header, index) => {
        if (index === zonaIndex || index === laborIndex || index === faseIndex)
          return;
        orderedDateColumnsInExcel.push({ index, header });
      });

      orderedDateColumnsInExcel.forEach(({ index, header }) => {
        const parsed = parseExcelHeader(header);
        if (parsed) {
          const { formattedDate, shift } = parsed;
          let finalKey;

          if (withShifts) {
            let finalShift = shift;
            if (!finalShift) {
              dateShiftCount[formattedDate] =
                (dateShiftCount[formattedDate] || 0) + 1;
              finalShift =
                dateShiftCount[formattedDate] === 1 ? "DIA" : "NOCHE";
            }
            finalKey = `${formattedDate} - ${finalShift}`;
          } else {
            finalKey = formattedDate;
          }

          if (expectedHeaders.includes(finalKey)) {
            if (dateColumnMap[finalKey] === undefined) {
              dateColumnMap[finalKey] = index;
            }
          }
        }
      });

      // Mapear fechas sin columna asignada a columnas sin mapear
      expectedHeaders.forEach((expectedKey) => {
        if (dateColumnMap[expectedKey] === undefined) {
          const unmappedCol = orderedDateColumnsInExcel.find(
            ({ index }) => !Object.values(dateColumnMap).includes(index),
          );
          if (unmappedCol) {
            dateColumnMap[expectedKey] = unmappedCol.index;
          }
        }
      });

      const mappedDays = withShifts
        ? new Set(Object.keys(dateColumnMap).map((k) => k.split(" - ")[0]))
        : new Set(Object.keys(dateColumnMap));
      if (mappedDays.size !== totalDays) {
        addToast({
          title: "Advertencia",
          message: `El Excel tiene ${mappedDays.size} días mapeados, pero el rango seleccionado tiene ${totalDays}. Revise que las fechas del archivo coincidan con el rango.`,
          variant: "warning",
        });
      }

      const parseNumericValue = (value) => {
        if (value === null || value === undefined) return 0;
        if (typeof value === "number") return isNaN(value) ? 0 : value;
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
            cleanValue =
              parts[1] && parts[1].length <= 2
                ? cleanValue.replace(",", ".")
                : cleanValue.replace(/,/g, "");
          }
          const parsed = Number(cleanValue);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      };

      // Construir datos procesados
      const processedData = [];
      for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        const row = data[rowIndex];
        const zona = row[zonaIndex] ? String(row[zonaIndex]).trim() : "";
        const labor = row[laborIndex] ? String(row[laborIndex]).trim() : "";
        const fase = row[faseIndex] ? String(row[faseIndex]).trim() : "";

        if (!zona && !labor && !fase) continue;

        const rowData = {
          zona: zona ? normalizarZona(zona) : "",
          labor: labor ? normalizarTajo(labor) : "",
          fase: fase ? normalizarFase(fase) : "",
        };

        expectedHeaders.forEach((headerKey) => {
          const colIndex = dateColumnMap[headerKey];
          rowData[headerKey] =
            colIndex !== undefined && colIndex < row.length
              ? parseNumericValue(row[colIndex])
              : 0;
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
        const isLaborInList = (laborName) =>
          dataLaborList?.some((item) => item.name === laborName);

        const currentValidLabors = processedData
          .map((row) => row.labor)
          .filter((labor) => labor && isLaborInList(labor));

        const uniqueLabors = [...new Set(currentValidLabors)];

        if (form) {
          form.setValue("selectedItems", uniqueLabors, {
            shouldValidate: true,
          });
        }

        setDataHotTable(processedData);
        setShowLoader(false);
        setLoadingGlobal(false);
        addToast({
          title: "Importación exitosa",
          message: `Se importaron ${processedData.length} fila(s) correctamente.`,
          variant: "success",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 500);
    } catch (error) {
      console.error("Error al leer el archivo Excel:", error);
      addToast({
        title: "Error de lectura de Excel",
        message: `Error al leer el archivo Excel: ${
          error instanceof Error
            ? error.message
            : "Por favor, verifique el formato del archivo."
        }`,
        variant: "destructive",
      });
      setShowLoader(false);
      setLoadingGlobal(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el archivo", error);
    }
  };

  return (
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
      <button
        type="button"
        disabled={loadingGlobal}
        onClick={handleDownload}
        className="bg-green-700 hover:bg-green-800 px-3 flex items-center gap-1 text-xs text-white rounded-s-none rounded-lg h-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowDownToLine className="size-3 text-white" />
        Descargar Modelo
      </button>
    </div>
  );
};
