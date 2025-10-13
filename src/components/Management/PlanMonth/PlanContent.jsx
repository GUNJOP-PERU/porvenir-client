import { dataFase } from "@/lib/data";
import Handsontable from "handsontable/base";
import { HotTable } from "@handsontable/react-wrapper";
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
  setInvalidLabors,
  heightSize = "normal",
}) => {
  const isLaborInList = (laborName) => {
    return dataLaborList?.some((item) => item.name === laborName);
  };

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
      className={clsx("h-[60vh] overflow-auto z-0", {
        "pointer-events-none opacity-50 cursor-not-allowed": loadingGlobal,
      })}
      style={{
        height: heightSize === "normal" ? "60vh" : "200px",
      }}
    >
      <HotTable
        // themeName="ht-theme-horizon"
        data={dataHotTable}
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        colHeaders={true}
        columnSorting={true}
        // width="100%"
        height="auto"
        mergeCells={true}
        contextMenu={false}
        readOnly={false}
        fixedColumnsStart={1}
        autoWrapRow={true}
        autoWrapCol={true}
        autoColumnSize={true}
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
                    type: "dropdown",
                    source: dataFase.map((item) => item.name),
                    data: key,
                    allowInvalid: false,
                    className: "ht-fase-dropdown",                   
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
