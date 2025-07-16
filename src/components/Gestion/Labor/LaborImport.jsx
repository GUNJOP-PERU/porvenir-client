import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState, useRef, useEffect } from "react";
import readXlsxFile from "read-excel-file";
import { HotTable } from "@handsontable/react";
import { esMX, registerLanguageDictionary } from "handsontable/i18n";
import { registerAllModules } from "handsontable/registry";
import { Button } from "@/components/ui/button";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import { CircleFadingPlus, SendHorizontal, Upload } from "lucide-react";
import { postDataRequest } from "@/api/api";
import IconWarning from "@/icons/IconWarning";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "@/hooks/useGlobalQuery";

registerAllModules();
registerLanguageDictionary(esMX);

const TableExample = () => {
  return (
    <table className="text-[10px] border border-zinc-300 ">
      <thead className="bg-gray-100">
        <tr>
          <th></th>
          <th className="border border-zinc-300 py-0.5 px-2 text-left font-semibold text-zinc-700">
            NIVEL
          </th>
          <th className="border border-zinc-300 py-0.5 px-2 text-left font-semibold text-zinc-700">
            ORE_BOD
          </th>
          <th className="border border-zinc-300 py-0.5 px-2 text-left font-semibold text-zinc-700">
            TAJO
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-zinc-300 w-[15px] py-0.5 px-1 text-zinc-600 bg-gray-100">
            1
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            1901
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            OB6
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            TJ-234
          </td>
        </tr>
        <tr>
          <td className="border border-zinc-300 w-[15px] py-0.5 px-1 text-zinc-600 bg-gray-100">
            2
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            1805
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            OB8
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            AVANCE
          </td>
        </tr>
        <tr>
          <td className="border border-zinc-300 w-[15px] py-0.5 px-1 text-zinc-600 bg-gray-100">
            ...
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            ...
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            ...
          </td>
          <td className="border border-zinc-300 py-0.5 px-2 text-zinc-700">
            ...
          </td>
        </tr>
      </tbody>
    </table>
  );
};
const LaborImport = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

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

  const [hotTableData, setHotTableData] = useState([
    { NIVEL: null, ORE_BOD: null, TAJO: null, UNION: null },
  ]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const hotTableComponent = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Solo se permiten archivos .xlsx y .xls por seguridad.");
      return;
    }

    try {
      const data = await readXlsxFile(file, { schema: false });

      const processed = data.map((row) => {
        const NIVEL = (row[0] ?? "")
          .toString()
          .replace(/\s+/g, "")
          .toUpperCase();
        const ORE_BOD = (row[1] ?? "")
          .toString()
          .replace(/\s+/g, "")
          .toUpperCase();
        const TAJO = (row[2] ?? "")
          .toString()
          .replace(/\s+/g, "")
          .toUpperCase();
        return {
          NIVEL,
          ORE_BOD,
          TAJO,
          UNION: `${NIVEL}_${ORE_BOD}_${TAJO}`,
        };
      });

      setHotTableData(processed);
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      alert("Ocurrió un error al leer el archivo.");
    }
  };

  const hotSettings = {
    data: hotTableData,
    licenseKey: "non-commercial-and-evaluation",
    language: "es-MX",
    colHeaders: ["NIVEL", "ORE_BOD", "TAJO", "UNIÓN"],
    rowHeaders: true,
    maxCols: 4,
    allowInsertColumn: false,
    allowRemoveColumn: false,
    manualColumnResize: true,
    manualColumnMove: false,
    stretchH: "all",
    minSpareRows: 1,
    allowInsertRow: true,
    allowRemoveRow: true,
    width: "100%",
    height: "100%",
    columns: [
      { data: "NIVEL" },
      { data: "ORE_BOD" },
      { data: "TAJO" },
      {
        data: "UNION",
        readOnly: true,
        renderer: (instance, td, row, col, prop, value) => {
          td.innerText = value ?? "";

          // Mantener tu estilo personalizado
          td.style.background = "#f5f5f5";
          td.style.fontStyle = "italic";
          td.style.fontWeight = "bold";

          const laborName = hotTableData[row]?.UNION;

          const isRepeated =
            hotTableData.filter((item) => item.UNION === laborName).length > 1;

          const isValid = dataLaborList?.some(
            (item) => item.name === laborName
          );

          // Aplicar colores condicionales
          if (isRepeated) {
            td.style.background = "#fef08a"; // amarillo
          }

          td.style.color = isValid ? "#16a34a" : "#dc2626"; // verde o rojo

          return td;
        },
      },
    ],
    afterChange: (changes, source) => {
      if (source === "loadData" || !changes) return;

      const updatedData = [...hotTableData];

      changes.forEach(([rowIndex, prop, , newValue]) => {
        if (["NIVEL", "ORE_BOD", "TAJO"].includes(prop)) {
          const cleanValue = (newValue || "")
            .toString()
            .replace(/\s+/g, "")
            .toUpperCase();
          updatedData[rowIndex][prop] = cleanValue;

          const nivel = (updatedData[rowIndex]?.NIVEL ?? "")
            .replace(/\s+/g, "")
            .toUpperCase();
          const ore = (updatedData[rowIndex]?.ORE_BOD ?? "")
            .replace(/\s+/g, "")
            .toUpperCase();
          const tajo = (updatedData[rowIndex]?.TAJO ?? "")
            .replace(/\s+/g, "")
            .toUpperCase();

          updatedData[rowIndex].UNION = `${nivel}_${ore}_${tajo}`;
        }
      });

      setHotTableData(updatedData);
    },
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);

    // Filtrar filas vacías
    const dataFiltrada = hotTableData.filter(
      (row) =>
        (row.NIVEL && row.NIVEL.toString().trim() !== "") ||
        (row.ORE_BOD && row.ORE_BOD.toString().trim() !== "") ||
        (row.TAJO && row.TAJO.toString().trim() !== "")
    );

    // Validar campos vacíos
    const tieneCamposVacios = dataFiltrada.some(
      (row) =>
        !row.NIVEL ||
        row.NIVEL.toString().trim() === "" ||
        !row.ORE_BOD ||
        row.ORE_BOD.toString().trim() === "" ||
        !row.TAJO ||
        row.TAJO.toString().trim() === ""
    );

    if (tieneCamposVacios) {
      alert("Error: Hay filas con 'NIVEL', 'ORE_BOD' o 'TAJO' vacíos.");
      setLoadingGlobal(false);
      return;
    }

    // Generar campo UNION para cada fila
    const datosConUnion = dataFiltrada.map((row) => {
      const union = `${row.NIVEL}_${row.ORE_BOD}_${row.TAJO}`;
      return { ...row, UNION: union };
    });

    // Validar que todas las labores sean nuevas (rojas) y no duplicadas
    const conteoUniones = {};
    let hayLaborExistente = false;
    let hayRepetidos = false;

    datosConUnion.forEach((row) => {
      const union = row.UNION;

      // Contar repeticiones
      conteoUniones[union] = (conteoUniones[union] || 0) + 1;
      if (conteoUniones[union] > 1) {
        hayRepetidos = true;
      }

      // Verificar si existe en sistema
      const existe = dataLaborList?.some((item) => item.name === union);
      if (existe) {
        hayLaborExistente = true;
      }
    });

    if (hayLaborExistente || hayRepetidos) {
      alert(
        "Error: Solo puedes enviar si todas las labores NO existen en el sistema y no hay ninguna repetida."
      );
      setLoadingGlobal(false);
      return;
    }

    // Armar arreglo final con name y status
    const laborFinal = datosConUnion.map((row) => ({
      name: row.UNION,
      status: true,
    }));

    try {
      console.log("Enviando:", laborFinal);

      const response = await postDataRequest("frontLabor/many", laborFinal);

      if (response.status >= 200 && response.status < 300) {
        alert("Datos enviados con éxito!");
        queryClient.invalidateQueries({ queryKey: ["crud", "frontLabor"] });
        if (onClose) onClose();
        setHotTableData([
          { NIVEL: null, ORE_BOD: null, TAJO: null, UNION: null },
        ]);
      } else {
        alert("Error al enviar los datos.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar los datos.");
    } finally {
      setLoadingGlobal(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    setHotTableData([]);
    setLoadingGlobal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="w-[550px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>Importar archivo o pegar datos</DialogTitle>
              <DialogDescription>
                Solo archivos .xlsx (Excel moderno)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex gap-5 items-end">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-500">Formato de ejemplo:</p>
            <TableExample />
          </div>
          <label
            htmlFor="file"
            className="flex gap-2 items-center justify-center cursor-pointer px-4 bg-blue-500 rounded-[10px] h-[34px] active:scale-95 transition-all"
          >
            <Upload className="text-zinc-50 h-4 w-4" />
            <input
              id="file"
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-zinc-50">Subir archivo</p>
          </label>
        </div>

        <div className="h-[40vh] z-0">
          <HotTable ref={hotTableComponent} settings={hotSettings} />
        </div>

        <div className="bg-sky-100/50 w-full rounded-xl px-6 py-2.5 flex gap-1 text-zinc-600 text-[11px] leading-4 border-t border-blue-500">
          <IconWarning className="text-blue-500 w-5 h-5 mr-1.5" />
          <ul className="list-disc ml-3">
            <li>
              <strong className="font-bold text-red-600">Rojo:</strong> Labor no
              existente en el sistema.
            </li>
            <li>
              <strong className="font-bold text-green-500">Verde:</strong> Labor
              existente en el sistema.
            </li>
            <li>
              <strong className="font-bold bg-yellow-300">Amarillo:</strong>{" "}
              Labor repetida en la columna UNIÓN (Solo debe existir uno).
            </li>
          </ul>
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
            disabled={hotTableData.length === 0 || loadingGlobal}
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                Enviar
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaborImport;
