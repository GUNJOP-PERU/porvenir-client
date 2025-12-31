import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState, useRef, useEffect } from "react";
import readXlsxFile from "read-excel-file";
import { HotTable } from "@handsontable/react-wrapper";
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
import clsx from "clsx";
import { normalizarTajo } from "@/lib/utilsGeneral";

registerAllModules();
registerLanguageDictionary(esMX);



const TableExample = () => (
  <table className="text-[10px] border border-zinc-300">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-2">Tajo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-2">NV.-220 V1204 TJ 228 V1 C5</td>
      </tr>
    </tbody>
  </table>
);

const LaborImport = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const hotTableComponent = useRef(null);

  const { data: dataLaborList, refetch } = useFetchData(
    "frontLabor-General",
    "frontLabor",
    { enabled: false }
  );

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  const [hotTableData, setHotTableData] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Solo se permiten archivos .xlsx y .xls");
      return;
    }

    try {
      const data = await readXlsxFile(file);

      const processed = data
        .slice(1) // IGNORA encabezado "Tajo"
        .filter((row) => row[0])
        .map((row) => {
          const raw = row[0].toString();
          return {
            NIVEL: null,
            ORE_BOD: null,
            TAJO: raw,
            UNION: normalizarTajo(raw),
          };
        });

      setHotTableData(processed);
    } catch (error) {
      console.error(error);
      alert("Error al leer el archivo.");
    }
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);

    const conteo = {};
    let repetidos = false;
    let existentes = false;

    hotTableData.forEach((r) => {
      conteo[r.UNION] = (conteo[r.UNION] || 0) + 1;
      if (conteo[r.UNION] > 1) repetidos = true;
      if (dataLaborList?.some((d) => d.name === r.UNION)) existentes = true;
    });

    if (repetidos || existentes) {
      alert("Error: existen labores repetidas o ya registradas en el sistema.");
      setLoadingGlobal(false);
      return;
    }

    const payload = hotTableData.map((r) => ({
      name: r.UNION,
      status: true,
    }));

    try {
      await postDataRequest("frontLabor/many", payload);
      alert("Datos enviados con éxito.");
      queryClient.invalidateQueries({
        queryKey: ["crud", "frontLabor"],
      });
      setHotTableData([]);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Error al enviar datos.");
    } finally {
      setLoadingGlobal(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="w-[550px]">
        <DialogHeader>
          <DialogTitle>Importar Tajo</DialogTitle>
          <DialogDescription>
            Una sola columna llamada <strong>Tajo</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-5 items-end">
          <TableExample />
          <label className="cursor-pointer flex gap-2 items-center bg-blue-500 px-4 h-8 rounded-lg">
            <Upload className="text-white w-4 h-4" />
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-white text-xs">Subir archivo</span>
          </label>
        </div>

        <div className="h-[40vh] overflow-auto z-0">
          <HotTable
            data={hotTableData}
            licenseKey="non-commercial-and-evaluation"
            language="es-MX"
            rowHeaders={true}
            colHeaders={["TAJO", "UNIÓN"]}
            contextMenu={{
              items: {
                row_above: {},
                row_below: {},
                hsep1: "---------",
                remove_row: {
                  name: "Eliminar fila(s) seleccionada(s)",
                },
              },
            }}
            stretchH="all"
            readOnly={false}
            height="auto"
            columns={[
              { data: "TAJO", readOnly: true },
              {
                data: "UNION",
                readOnly: true,
                renderer: (instance, td, row, col, prop, value) => {
                  td.innerText = value ?? "";
                  td.style.fontStyle = "italic";
                  td.style.fontWeight = "bold";

                  const laborName = hotTableData[row]?.UNION;

                  const isRepeated =
                    hotTableData.filter((r) => r.UNION === laborName).length >
                    1;

                  const exists = dataLaborList?.some(
                    (item) => item.name === laborName
                  );

                  if (isRepeated) td.style.background = "#fef08a";
                  td.style.color = exists ? "#16a34a" : "#dc2626";

                  return td;
                },
              },
            ]}
            beforeRemoveRow={(index, amount) => {
              setHotTableData((prev) => {
                const next = [...prev];
                next.splice(index, amount);
                return next;
              });

              // 🚨 MUY IMPORTANTE
              return false; // cancela la eliminación interna
            }}
          />
        </div>

        <div className="bg-sky-100/50 w-full md:w-fit rounded-xl px-3 py-2.5 flex gap-1 text-zinc-600 text-[11px] leading-4 border-t border-blue-500">
          <IconWarning className="text-blue-500  w-5 h-5 mr-1.5" />
          <div className="flex items-center">
            <ul className="list-disc ml-3 gap-x-6 ">
              <li className="">
                <strong className="font-bold text-green-500">Verde: </strong>
                Tajo ya existe en el sistema, por lo tanto no será creada
                nuevamente.
              </li>
              <li className="">
                <strong className="font-bold text-red-600">Rojo: </strong>
                Tajo no existe en el sistema. Será creada automáticamente.
              </li>
              <li>
                <strong className="font-bold bg-yellow-300">Amarillo</strong>:
                Tajo ya fue registrada previamente. No se puede continuar con el
                envío del plan hasta resolver esta duplicación.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            <IconClose className="w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSendData}
            disabled={loadingGlobal || hotTableData.length === 0}
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                Enviar
                <SendHorizontal className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaborImport;
