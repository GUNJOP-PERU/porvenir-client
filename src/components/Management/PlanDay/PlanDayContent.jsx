import { dataFase } from "@/lib/data";
import { HotTable } from "@handsontable/react-wrapper";
import clsx from "clsx";
import { esMX, registerLanguageDictionary } from "handsontable/i18n";
import { registerAllModules } from "handsontable/registry";
registerAllModules();
registerLanguageDictionary(esMX);

export const PlanContent = ({
  dataHotTable,
  setDataHotTable,
  dataLaborList,
  loadingGlobal,
}) => {
  // ✅ Actualizar la tabla después de un cambio
  const handleAfterChange = (changes) => {
    if (!changes) return;

    setDataHotTable((prevData) => {
      const newData = [...prevData];

      changes.forEach(([row, col, oldValue, newValue]) => {
        newData[row][col] = newValue;
      });

      return newData;
    });
  };

  const calculateTotals = (data) => {
    if (!data || data.length === 0) return {};

    const totals = {};
    const keys = Object.keys(data[0]);

    keys.forEach((key) => {
      if (key === "labor") {
        totals[key] = "TOTAL";
      } else if (key === "fase") {
        totals[key] = "";
      } else {
        totals[key] = data.reduce(
          (sum, row) => sum + (Number(row[key]) || 0),
          0
        );
      }
    });

    return totals;
  };

  const tableWithTotals = () => {
    const totals = calculateTotals(dataHotTable);
    return [...dataHotTable, totals];
  };

  return (
    <div
      className={clsx("h-[27.5vh] overflow-auto -z-0", {
        "pointer-events-none opacity-50 cursor-not-allowed": loadingGlobal,
      })}
    >
      <HotTable
        data={tableWithTotals()}
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        colHeaders={true}
        columnSorting={false}
        colWidths={[180, 180, 100]}
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
                    type: "text",
                    data: key,
                    readOnly: true,
                  };
                } else if (key === "fase") {
                  return {
                    title: key,
                    type: "dropdown",
                    source: dataFase.map((item) => item.name),
                    data: key,
                    allowInvalid: false,
                    className: "ht-fase-dropdown",
                    width: 130,
                  };
                }
                return {
                  title: key,
                  type: "numeric",
                  data: key,
                  numericFormat: { pattern: "0,0", culture: "en-US" },
                  width: 150,
                  minWidth: 120,
                  maxWidth: 200,
                };
              })
            : []
        }
        afterChange={handleAfterChange}
        cells={(row, col) => {
          const meta = {};

          // Fila de totales (última)
          if (row === dataHotTable.length) {
            meta.readOnly = true;
            meta.className = "ht-total-row";
          }

          return meta;
        }}
      />
    </div>
  );
};
