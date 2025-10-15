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

  // Calcular fila de totales
  const getDataWithTotals = () => {
    if (dataHotTable.length === 0) return [];

    const totals = {};
    const keys = Object.keys(dataHotTable[0]);

    keys.forEach((key) => {
      if (key === "labor") totals[key] = "TOTAL";
      else if (key === "fase") totals[key] = "";
      else {
        // Sumar solo columnas numéricas
        totals[key] = dataHotTable.reduce(
          (sum, row) => sum + (Number(row[key]) || 0),
          0
        );
      }
    });

    return [...dataHotTable, totals]; // agrega la fila total al final
  };

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
        data={getDataWithTotals()}
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        colHeaders={true}
        // width="100%"
        height="auto"
        mergeCells={true}
        contextMenu={false}
        readOnly={false}
        fixedColumnsStart={1}
        autoWrapRow={true}
        autoWrapCol={true}
        autoColumnSize={true}
        columnSorting={false}
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
          const meta = {};
          const lastRowIndex = dataHotTable.length; // índice del total
          const colKey = Object.keys(dataHotTable[0])[col];

          if (row === lastRowIndex) {
            meta.readOnly = true;
            meta.className = "ht-total-row"; // Aplica el estilo de la fila total
            return meta;
          }

          if (colKey === "labor") {
            const laborName = dataHotTable[row]?.labor;
            const isRepeated =
              dataHotTable.filter((item) => item.labor === laborName).length >
              1;
            const backgroundColor = isRepeated ? "!bg-yellow-300" : "";
            const textColor = isLaborInList(laborName)
              ? "!text-green-600"
              : "!text-red-600";
            meta.className = `font-semibold ${backgroundColor} ${textColor}`;
          }

          return meta;
        }}
      />
    </div>
  );
};
