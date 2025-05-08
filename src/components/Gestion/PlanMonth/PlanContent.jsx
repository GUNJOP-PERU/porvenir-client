import { dataFase } from "@/lib/data";
import { HotTable } from "@handsontable/react";
import clsx from "clsx";
import { esMX, registerLanguageDictionary } from "handsontable/i18n";
import { registerAllModules } from "handsontable/registry";
import { useEffect, useState } from "react";

registerAllModules();
registerLanguageDictionary(esMX);

export const PlanContent = ({
  dataHotTable,
  setDataHotTable,
  dataLaborList,
  loadingGlobal,
  setInvalidLabors
}) => {
 

  // ✅ Verifica si el valor de la celda está en dataLaborList
  const isLaborInList = (laborName) => {
    return dataLaborList?.some((item) => item.name === laborName);
  };

  // ✅ Función para actualizar la tabla después de un cambio
  const handleAfterChange = (changes) => {
    if (!changes) return;

    setDataHotTable((prevData) => {
      const newData = [...prevData];

      changes.forEach(([row, col, oldValue, newValue]) => {
        if (newValue !== oldValue) {
          newData[row][col] = newValue;
        }
      });

      return newData;
    });
  };

  useEffect(() => {
    const invalids = dataHotTable
      .map((row) => row.labor)
      .filter((laborName) => !isLaborInList(laborName));
    setInvalidLabors(invalids);
  }, [dataHotTable, dataLaborList]);



  return (
    <div
      className={clsx("h-[60vh] z-0", {
        "pointer-events-none opacity-50 cursor-not-allowed": loadingGlobal,
      })}
    >
      <HotTable
        data={dataHotTable}
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        colHeaders={true}
        columnSorting={true}
        width="100%"
        height="100%"
        mergeCells={true}
        contextMenu={true}
        readOnly={false}
        fixedColumnsStart={1}
        autoWrapRow={true}
        autoWrapCol={true}
        columns={
          dataHotTable.length > 0
            ? Object.keys(dataHotTable[0]).map((key) => {
                if (key === "labor") {
                  return {
                    title: key,
                    type: "text", // Permitir entrada manual
                    data: key,
                  };
                } else if (key === "fase") {
                  return {
                    title: key,
                    type: "select",
                    selectOptions: dataFase.map((item) => item.name),
                    data: key,
                  };
                }
                return {
                  title: key,
                  type: "numeric",
                  data: key,
                  numericFormat: { pattern: "0,0", culture: "en-US" },
                };
              })
            : []
        }
        afterChange={handleAfterChange}
        // ✅ Aplicar color dinámicamente en la columna "labor"
        cells={(row, col) => {
          const colKey = Object.keys(dataHotTable[0])[col]; // Obtener el nombre de la columna
          if (colKey === "labor") {
            const laborName = dataHotTable[row]?.labor;

            // Comprobar si el valor de 'labor' se repite
            const isRepeated =
              dataHotTable.filter((item) => item.labor === laborName).length >
              1;

            // Asignar las clases: fondo amarillo si es repetido
            const backgroundColor = isRepeated ? "!bg-yellow-300" : "";

            // El texto será verde si está en la lista, rojo si no lo está
            const textColor = isLaborInList(laborName)
              ? "!text-green-600"
              : "!text-red-600";

            return {
              className: ` font-semibold ${backgroundColor} ${textColor}`,
            };
          }
        }}
      />
    </div>
  );
};
