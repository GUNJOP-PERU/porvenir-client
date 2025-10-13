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
  loadingGlobal,
}) => {
  // 🔹 Recalcula los totales de cada columna
  const calculateTotalsRows = (data) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);
    const totalsTurno = {};
    const totalsDia = {};

    keys.forEach((key) => {
      if (key === "labor") {
        totalsTurno[key] = "TOTAL";
        totalsDia[key] = "GENERAL";
      } else if (key === "fase") {
        totalsTurno[key] = "";
        totalsDia[key] = "";
      } else {
        const [fecha, turno] = key.split(" - ");
        const diaKey = `${fecha} - DIA`;
        const nocheKey = `${fecha} - NOCHE`;

        // Totales por turno
        totalsTurno[key] = data.reduce(
          (sum, row) => sum + (Number(row[key]) || 0),
          0
        );

        // Totales generales (solo en columna "Día")
        if (turno === "DIA") {
          const sumaDia = data.reduce(
            (sum, row) => sum + (Number(row[diaKey]) || 0),
            0
          );
          const sumaNoche = data.reduce(
            (sum, row) => sum + (Number(row[nocheKey]) || 0),
            0
          );
          totalsDia[key] = sumaDia + sumaNoche;
        } else {
          totalsDia[key] = "";
        }
      }
    });

    return [totalsTurno, totalsDia];
  };

  // 🔹 Generar la tabla con fila de totales
  const tableWithTotals = () => {
    const totalsRows = calculateTotalsRows(dataHotTable);
    return [...dataHotTable, ...totalsRows];
  };

  // 🔹 Headers anidados (igual que antes)
  const generateNestedHeaders = () => {
    if (dataHotTable.length === 0) return [];

    const keys = Object.keys(dataHotTable[0]);

    const firstRow = [];
    const secondRow = [];

    let i = 0;
    while (i < keys.length) {
      if (keys[i] === "labor" || keys[i] === "fase") {
        firstRow.push({ label: keys[i], colspan: 1 });
        secondRow.push(keys[i]);
        i++;
      } else {
        const [fecha] = keys[i].split(" - ");
        let count = 0;
        let j = i;
        while (j < keys.length && keys[j].startsWith(fecha)) {
          count++;
          j++;
        }
        firstRow.push({ label: fecha, colspan: count });
        for (let k = 0; k < count; k++) {
          secondRow.push(keys[i + k].split(" - ")[1] || "");
        }
        i = j;
      }
    }

    return [firstRow, secondRow];
  };

  const handleAfterChange = (changes) => {
    if (!changes) return;

    setDataHotTable((prevData) => {
      // Evitar que editen la fila de totales
      const lastIndex = prevData.length - 1;
      const newData = [...prevData];
      const keys = Object.keys(newData[0]);
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (row !== lastIndex && newValue !== oldValue) {
          const key = keys[col];
          if (key) {
            newData[row][key] = newValue;
          }
        }
      });

      return newData;
    });
  };

  return (
    <div
      className={clsx("h-[55vh] overflow-auto z-0", {
        "pointer-events-none opacity-50 cursor-not-allowed": loadingGlobal,
      })}
    >
      <HotTable
        data={tableWithTotals()}
        licenseKey="non-commercial-and-evaluation"
        language={esMX.languageCode}
        rowHeaders={true}
        colHeaders={false}
        nestedHeaders={generateNestedHeaders()}
        columnSorting={true}
        // width="100%"
        height="auto"
        contextMenu={false}
        readOnly={false}
        fixedColumnsStart={1}
        autoWrapRow={true}
        autoWrapCol={true}
        beforePaste={(data, coords) => {
          for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data[r].length; c++) {
              if (typeof data[r][c] === "string") {
                // Quitar separador de miles (coma) si no es decimal
                data[r][c] = data[r][c].replace(/,/g, "");
              }
            }
          }
        }}
        columns={
          dataHotTable.length > 0
            ? Object.keys(dataHotTable[0]).map((key) => {
                if (key === "labor") {
                  return { type: "text", data: key, readOnly: true };
                } else if (key === "fase") {
                  return {
                    type: "dropdown",
                    source: dataFase.map((item) => item.name),
                    data: key,
                    allowInvalid: false,
                    className: "ht-fase-dropdown" 
                  };
                }
                return {
                  type: "numeric",
                  data: key,
                  numericFormat: { pattern: "0,0", culture: "en-MX" },
                };
              })
            : []
        }
        afterChange={handleAfterChange}
        cells={(row, col) => {
          const meta = {};
          const keys = Object.keys(dataHotTable[0]);

          // Fila de totales
          if (row === dataHotTable.length) {
            meta.readOnly = true;
            meta.className = "!bg-orange-200 !font-bold";
            return meta;
          }
          
          if (row === dataHotTable.length + 1) {
            meta.readOnly = true;
            meta.className = "!bg-orange-400 !font-bold";
            return meta;
          }

          // Evitar colorear 'labor' y 'fase'
          if (keys[col] === "labor" || keys[col] === "fase") {
            return meta;
          }

          // Extraer el día (la parte antes del " - ")
          const fecha = keys[col].split(" - ")[0];

          // Obtener el índice de grupo de fecha
          const fechasUnicas = Array.from(
            new Set(
              keys
                .filter((k) => k !== "labor" && k !== "fase")
                .map((k) => k.split(" - ")[0])
            )
          );
          const groupIndex = fechasUnicas.indexOf(fecha);

          // Alternar color por grupo de fecha
          if (groupIndex % 2 === 0) {
            meta.className = "!bg-zinc-100"; // gris claro para grupos pares
          }

          return meta;
        }}
      />
    </div>
  );
};
