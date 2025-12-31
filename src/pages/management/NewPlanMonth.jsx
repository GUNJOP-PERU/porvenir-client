import { useFetchData } from "@/hooks/useGlobalQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CircleFadingPlus, SendHorizontal, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import readXlsxFile from "read-excel-file";
import { normalizarTajo } from "@/lib/utilsGeneral";

import { Button } from "@/components/ui/button";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";

import { PlanContent } from "@/components/Management/PlanMonth/PlanContent";
import { PlanHeader } from "@/components/Management/PlanMonth/PlanHeader";
import IconWarning from "@/icons/IconWarning";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { postDataRequest } from "@/api/api";
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
  selectedItems: z.array(z.string()).optional(),
});

export const NewPlanMonth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [invalidLabors, setInvalidLabors] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef(null);

  const { data: dataLaborList, refetch: refetchLaborList } = useFetchData(
    "frontLabor-General",
    "frontLabor",
    {
      enabled: false,
    }
  );
  useEffect(() => {
    refetchLaborList();
  }, [refetchLaborList]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
      selectedItems: [],
    },
  });

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
        fase: index % 2 === 0 ? "mineral" : "desmonte",
      };

      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = startDate
          .add(i, "day")
          .format("DD-MM")
          .toUpperCase();
        row[currentDate] = Math.floor(Math.random() * 100) * 100; 
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
      alert(
        "Error: Una labor contiene un formato inválido.\n" +
          "Si después del segundo subguión inicia con 'T-', debe ser 'TJ-'."
      );
      setLoadingGlobal(false);
      return;
    }

    if (tieneCamposVacios) {
      alert("Error: Hay filas con 'Labor' o 'Fase' vacías en la tabla.");
      setLoadingGlobal(false);
      return;
    }

    if (tieneRepetidos) {
      alert("Error: Existen labores repetidas. Corrige antes de continuar.");
      setLoadingGlobal(false);
      return;
    }

    const datosFinales = dataHotTable.flatMap((row) => {
      const fechas = Object.keys(row).filter(
        (key) => key.match(/^\d{2}-\d{2}$/) 
      );

      return fechas.map((fecha) => {
        const [day, month] = fecha.split("-"); 
        const year = new Date().getFullYear(); 

        return {
          frontLabor: row.labor,
          phase: row.fase,
          date: `${year}-${month}-${day}`, 
          tonnage: row[fecha],
          month: parseInt(month, 10), 
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
    console.log("Labors en rojo:", invalidLaborsWithStatus);
    console.log("Datos Finales:", datosFinales);

    const fecha = dayjs(dob.end);
    const mes = fecha.month() + 1; 
    const año = fecha.year();

    const dataFinal = {
      dataGenerate: datosFinales,
      dataEdit: dataHotTable,
      status: "creado",
      totalTonnage: totalTonnage,
      month: mes, 
      year: año, 
    };
    console.log("Datos Finales:", dataFinal);
    try {
      const response = await postDataRequest("planMonth/many", dataFinal);
      if (response.status >= 200 && response.status < 300) {
        queryClient.invalidateQueries({ queryKey: ["crud", "planMonth"] });
        queryClient.refetchQueries({ queryKey: ["crud", "planMonth"] });
        addToast({
          title: "Datos enviados con éxito",
          message: "Los datos se han enviado con éxito.",
          variant: "success", // Si usas variantes de color en el addToaster
        });
        const responseFront = await postDataRequest(
          "frontLabor/many",
          invalidLaborsWithStatus
        );
  
        form.reset();
        navigate("/planMonth");
      } else {
        addToast({
          title: "Error al enviar los datos",
          message: error.response.data.message || "Ocurrió un error al enviar los datos.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error al enviar los datos:", error);
      addToast({
        title: "Error al enviar los datos",
        message: error.response.data.message || "Ocurrió un error al enviar los datos.",
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
    navigate("/planMonth");
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Solo se permiten archivos .xlsx y .xls");
      return;
    }

    setLoadingGlobal(true);
    setShowLoader(true);
    try {
      const data = await readXlsxFile(file);
      
      if (data.length === 0) {
        alert("El archivo Excel está vacío.");
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
        alert("Error: No se encontró la columna 'Labor' o 'Tajo' en el archivo Excel.\n\nEncabezados encontrados: " + headers.filter(h => h).join(", "));
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      if (faseIndex === -1) {
        alert("Error: No se encontró la columna 'Fase' en el archivo Excel.\n\nEncabezados encontrados: " + headers.filter(h => h).join(", "));
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const { dob } = form.getValues();
      if (!dob?.start || !dob?.end) {
        alert("Error: Debe seleccionar un rango de fechas antes de importar.");
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      const startDate = dayjs(dob.start);
      const endDate = dayjs(dob.end);
      const daysInMonth = endDate.diff(startDate, "day") + 1;

      const expectedDates = [];
      for (let i = 0; i < daysInMonth; i++) {
        expectedDates.push(startDate.add(i, "day").format("DD-MM").toUpperCase());
      }

      const parseDate = (header) => {
        if (!header && header !== 0) return null;
        
        let parsedDate = null;
        const headerStr = String(header).trim();
        
        if (typeof header === "number") {
          parsedDate = dayjs("1899-12-30").add(header, "days");
          if (!parsedDate.isValid()) return null;
        }
        else {
          const match = headerStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
          if (match) {
            const [, day, month, year] = match;
            parsedDate = dayjs(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
          }
          else if (headerStr.match(/^\d{1,2}[\/\-]\d{1,2}$/)) {
            const [day, month] = headerStr.split(/[\/\-]/);
            const year = dayjs(dob.start).year();
            parsedDate = dayjs(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
          }
          else if (headerStr.match(/^\d{2}-\d{2}$/)) {
            const [day, month] = headerStr.split("-");
            const year = dayjs(dob.start).year();
            parsedDate = dayjs(`${year}-${month}-${day}`);
          }
        }
        
        return parsedDate && parsedDate.isValid() ? parsedDate : null;
      };

      const dateColumns = [];
      headers.forEach((header, index) => {
        if (index !== laborIndex && index !== faseIndex) {
          dateColumns.push({ index, header });
        }
      });

      const dateColumnMap = {};
      dateColumns.forEach(({ index, header }) => {
        const parsedDate = parseDate(header);
        if (parsedDate) {
          const formattedDate = parsedDate.format("DD-MM").toUpperCase();
          if (expectedDates.includes(formattedDate)) {
            dateColumnMap[formattedDate] = index;
          }
        }
      });

      const unmappedColumns = dateColumns
        .filter(({ index }) => !Object.values(dateColumnMap).includes(index))
        .sort((a, b) => a.index - b.index);
      
      const unmappedDates = expectedDates.filter(date => !dateColumnMap[date]);
      
      unmappedColumns.forEach(({ index }, i) => {
        if (i < unmappedDates.length) {
          dateColumnMap[unmappedDates[i]] = index;
        }
      });

      const parseNumericValue = (value) => {
        if (value === null || value === undefined) return 0;
        
        // Si ya es un número, retornarlo
        if (typeof value === "number") {
          return isNaN(value) ? 0 : value;
        }

        // Si es string, procesarlo
        if (typeof value === "string") {
          let cleanValue = value.trim();
          if (!cleanValue) return 0;

          // Formato miles US: 1,234.56 → 1234.56
          if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleanValue)) {
            cleanValue = cleanValue.replace(/,/g, "");
          }
          // Formato miles EU: 1.234,56 → 1234.56
          else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleanValue)) {
            cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
          }
          // Formato decimal EU simple: 12,5 → 12.5
          else if (/^\d+,\d+$/.test(cleanValue)) {
            cleanValue = cleanValue.replace(",", ".");
          }
          // Si tiene solo comas, pueden ser separadores de miles o decimales
          else if (cleanValue.includes(",") && !cleanValue.includes(".")) {
            // Si tiene más de 3 dígitos después de la coma, probablemente es decimal
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

        expectedDates.forEach((dateKey) => {
          const colIndex = dateColumnMap[dateKey];
          if (colIndex !== undefined && colIndex < row.length) {
            rowData[dateKey] = parseNumericValue(row[colIndex]);
          } else {
            rowData[dateKey] = 0;
          }
        });

        processedData.push(rowData);
      }

      if (processedData.length === 0) {
        alert("No se encontraron datos válidos en el archivo Excel.");
        setLoadingGlobal(false);
        setShowLoader(false);
        return;
      }

      // Mantener el loader visible mientras se procesan y renderizan los datos
      setTimeout(() => {
        setDataHotTable(processedData);
        setShowLoader(false);
        setLoadingGlobal(false);
        alert(`Se importaron ${processedData.length} fila(s) correctamente.`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      console.error("Error al leer el archivo Excel:", error);
      alert(`Error al leer el archivo Excel: ${error.message || "Por favor, verifique el formato del archivo."}`);
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
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 items-center">
        <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
        <div>
          <h1 className="text-[15px] font-semibold leading-none">
            Crear plan del mes
          </h1>
          <h4 className="text-[12px] text-muted-foreground">
            Ingresar los datos necesarios para la creación y enviar
          </h4>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <PlanHeader
          form={form}
          onSubmit={onSubmit}
          dataLaborList={dataLaborList}
          hasData={dataHotTable.length > 0}
          loadingGlobal={loadingGlobal}
        />
        <div className="flex flex-col gap-3 z-0">
          <div className="flex justify-between items-center">
            <h1 className="text-base font-extrabold leading-5">
              Planificador Mensual /{" "}
              <b className="text-primary capitalize font-extrabold">
                {form.getValues().dob?.start
                  ? dayjs(form.getValues().dob.start).format("MMMM YYYY")
                  : "Seleccione fecha"}
              </b>
            </h1>
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
                  disabled={loadingGlobal}
                  onClick={handleImportButtonClick}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Importar Excel
                </Button>
              </>
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
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-between items-end">
        <div className="bg-sky-100/50 w-full md:w-fit rounded-xl px-6 py-2.5 flex gap-1 text-zinc-600 text-[11px] leading-4 mt-4 border-t border-blue-500">
          <IconWarning className="text-blue-500  w-5 h-5 mr-1.5" />
          <div className="flex items-center">
            <ul className="list-disc ml-3 gap-x-6 ">
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
                Enviar Plan
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
