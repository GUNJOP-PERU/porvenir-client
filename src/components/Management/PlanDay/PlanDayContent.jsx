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


  return (
    <div
      className={clsx("h-[27.5vh] overflow-auto -z-0", {
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
        colWidths={[180, 180, 100]}
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
            ? Object.keys(dataHotTable[0]).map((key, rowIndex) => {
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
                    className: "ht-fase-dropdown" 
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
      />
    </div>
  );
};
