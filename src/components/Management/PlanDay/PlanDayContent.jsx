import { dataFase } from "@/lib/data";
import Handsontable from "handsontable/base";
import { HotTable } from "@handsontable/react-wrapper";
import clsx from "clsx";
import { esMX, registerLanguageDictionary } from "handsontable/i18n";
import { registerAllModules } from "handsontable/registry";
import { useEffect, useMemo, useState } from "react";
import { normalizarTajo } from "@/lib/utilsGeneral";

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

  // 2️⃣ normaliza SOLO la columna labor cuando pegan o editan
  const handleAfterChange = (changes, _source) => {
    if (!changes) return;

    setDataHotTable((prevData) => {
      const newData = [...prevData];

      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (row < 0 || row >= newData.length) return;
        if (newValue === oldValue) return;

        let key;
        if (typeof prop === "number") key = orderedKeys[prop];
        else key = prop;

        if (!key) return;

        // 🔴 NORMALIZAR TAJO PEGADO
        if (key === "labor" && typeof newValue === "string") {
          newData[row][key] = normalizarTajo(newValue);
          return;
        }

        if (key === "fase") {
          newData[row][key] = newValue;
          return;
        }

        const clean =
          typeof newValue === "string"
            ? Number(newValue.replace(/,/g, ""))
            : Number(newValue);

        newData[row][key] = isNaN(clean) ? 0 : clean;
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

  const orderedKeys = useMemo(() => {
    if (!dataHotTable || dataHotTable.length === 0) return [];
    const keys = Object.keys(dataHotTable[0]).filter((k) => k !== "type");
    return keys.includes("labor")
      ? ["labor", ...keys.filter((k) => k !== "labor")]
      : keys;
  }, [dataHotTable]);

  const totalsRow = useMemo(() => {
    if (!dataHotTable || dataHotTable.length === 0) return {};
    const totals = {};
    orderedKeys.forEach((key) => {
      if (key === "labor") totals[key] = "Labor";
      else
        totals[key] = dataHotTable.reduce(
          (sum, row) => sum + (Number(row[key]) || 0),
          0
        );
    });
    return totals;
  }, [dataHotTable, orderedKeys]);

  const generateNestedHeaders = useMemo(() => {
    if (!dataHotTable || dataHotTable.length === 0) return [];
    const row1 = [];
    const row2 = [];

    orderedKeys.forEach((key) => {
      row1.push({ label: key, colspan: 1 });
      row2.push({
        label:
          key === "labor"
            ? "Total"
            : Number(totalsRow[key] || 0).toLocaleString("en-US"),
        className: "total-header-cell",
      });
    });

    return [row1, row2];
  }, [dataHotTable, totalsRow, orderedKeys]);

  return (
    <div className="-z-0">
      <HotTable
        data={dataHotTable}
        maxCols={Object.keys(dataHotTable[0] || {}).length}
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        nestedHeaders={generateNestedHeaders}
        height="30vh"
        mergeCells={true}
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
        readOnly={false}
        fixedColumnsStart={0}
        autoWrapRow={true}
        autoWrapCol={true}
        autoColumnSize={true}
        columnSorting={false}
        maxCols={Object.keys(dataHotTable[0] || {}).length}
        columns={
          dataHotTable.length > 0
            ? Object.keys(dataHotTable[0]).map((key) => {
                if (key === "labor") {
                  return {
                    type: "text",
                    data: key,
                    width: 250,
                  };
                } else if (key === "fase") {
                  return {
                    type: "dropdown",
                    source: dataFase.map((item) => item.name),
                    data: key,
                    allowInvalid: false,
                    className: "ht-fase-dropdown",
                    width: 130,
                  };
                }
                return {
                  type: "numeric",
                  data: key,
                  numericFormat: { pattern: "0,000", culture: "en-US" },
                  width: 130,
                };
              })
            : []
        }
        beforePaste={(data) => {
          for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data[r].length; c++) {
              let value = data[r][c];

              if (typeof value !== "string") continue;

              value = value.trim();

              if (orderedKeys[c] === "labor") {
                data[r][c] = normalizarTajo(value);
                continue;
              }

              // Formato miles US: 1,234.56 → 1234.56
              if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(value)) {
                value = value.replace(/,/g, "");
              }

              // Formato miles EU: 1.234,56 → 1234.56
              else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(value)) {
                value = value.replace(/\./g, "").replace(",", ".");
              }

              // Formato decimal EU simple: 12,5 → 12.5
              else if (/^\d+,\d+$/.test(value)) {
                value = value.replace(",", ".");
              }

              const parsed = Number(value);
              data[r][c] = isNaN(parsed) ? value : parsed;
            }
          }
        }}
        afterChange={handleAfterChange}
        cells={(row, col) => {
          const meta = {};
          const colKey = Object.keys(dataHotTable[0])[col];

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
