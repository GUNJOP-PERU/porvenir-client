/* eslint-disable react/prop-types */
import { dataFase, dataZona } from "@/lib/data";
import { normalizarFase, normalizarTajo, normalizarZona } from "@/lib/utilsGeneral";
import { HotTable } from "@handsontable/react-wrapper";
import { esMX, registerLanguageDictionary } from "handsontable/i18n";
import { registerAllModules } from "handsontable/registry";
import { useEffect, useMemo } from "react";

registerAllModules();
registerLanguageDictionary(esMX);

export const PlanContent = ({
  dataHotTable,
  setDataHotTable,
  dataLaborList,
  loadingGlobal,
  setInvalidLabors,
  // heightSize = "normal",
}) => {
  const isLaborInList = (laborName) => {
    return dataLaborList?.some((item) => item.name === laborName);
  };

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

        if (key === "labor" && typeof newValue === "string") {
          newData[row][key] = normalizarTajo(newValue);
          return;
        }

        if (key === "zona" && typeof newValue === "string") {
          newData[row][key] = normalizarZona(newValue);
          return;
        }

        if (key === "fase") {
          newData[row][key] = normalizarFase(newValue);
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
    return [
      "zona",
      "labor",
      ...keys.filter((k) => !["zona", "labor"].includes(k)),
    ];
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
    <div
      className={`${
        loadingGlobal ? "pointer-events-none opacity-50 select-none" : ""
      }`}
    >
      <HotTable
        data={dataHotTable}
        maxCols={Object.keys(dataHotTable[0] || {}).length}
        themeName="ht-theme-main"
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        nestedHeaders={generateNestedHeaders}
        height="60vh"
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
        columns={
          dataHotTable.length > 0
            ? Object.keys(dataHotTable[0]).map((key) => {
                if (key === "zona") {
                  return {
                    type: "dropdown",
                    source: dataZona.map((z) => z.name),
                    data: key,
                    allowInvalid: false,
                    width: 130,
                  };
                } else if (key === "labor") {
                  return {
                    type: "text",
                    data: key,
                    width: 250,
                  };
                } else if (key === "fase") {
                  return {
                    type: "dropdown",
                    source: dataFase.map((f) => f.name),
                    data: key,
                    allowInvalid: false,
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
              if (orderedKeys[c] === "zona") {
                data[r][c] = normalizarZona(value);
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
