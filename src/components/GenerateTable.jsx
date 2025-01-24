import React from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, esMX } from "handsontable/i18n";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importar idioma español
import "handsontable/dist/handsontable.full.css";
import { Button } from "./ui/button";
import DatePickerWithRange from "./DatePickerWithRange";

// Ejecutar para obtener todas las funciones de Handsontable
registerAllModules();
registerLanguageDictionary(esMX);

function GenerateTable() {
  const [data, setData] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [startDate, setStartDate] = React.useState(null); // Estado para fecha de inicio
  const [endDate, setEndDate] = React.useState(null); // Estado para fecha final
  const hotTableComponent = React.useRef(null);

  // Función para manejar la selección del rango de fechas
  const handleDateChange = (start, end) => {
    console.log("Fechas seleccionadas:", start, end); // Verificar las fechas seleccionadas
    setStartDate(start);
    setEndDate(end);
  };

  const generarEstructura = () => {
    if (!startDate || !endDate) {
      alert("Por favor, seleccione un rango de fechas.");
      return;
    }

    // Generar las fechas dinámicas como columnas
    const fechas = [];
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);
    while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
      // Formato 01-NOV
      fechas.push(currentDate.locale("es").format("DD-MMM").toUpperCase());
      currentDate = currentDate.add(1, "day");
    }

    // Generar columnas
    const dynamicColumns = [
      { data: "labor", title: "Labor", type: "text" },
      { data: "fase", title: "Fase", type: "text" },
      ...fechas.map((fecha) => ({
        data: fecha,
        title: fecha,
        type: "numeric",
      })),
    ];

    // Generar datos de ejemplo con tonelaje
    const exampleData = [
      {
        labor: "T-141F_OB1_1520",
        fase: "Extracción / Producción",
        ...fechas.reduce(
          (acc, fecha) => ({
            ...acc,
            [fecha]: Math.floor(Math.random() * 10000),
          }),
          {}
        ),
      },
      {
        labor: "T-001N_OB1_1640",
        fase: "Avance",
        ...fechas.reduce(
          (acc, fecha) => ({
            ...acc,
            [fecha]: Math.floor(Math.random() * 10000),
          }),
          {}
        ),
      },
    ];

    setColumns(dynamicColumns);
    setData([...exampleData, []]);
  };

  const descargarArchivo = () => {
    const pluginDescarga =
      hotTableComponent.current.hotInstance.getPlugin("exportFile");

    pluginDescarga.downloadFile("csv", {
      filename: "estructura_tonelaje",
      fileExtension: "csv",
      mimeType: "text/csv",
      columnHeaders: true,
    });
  };

  const getColumnSummaries = () => {
    return columns
      .filter((col) => col.data !== "labor" && col.data !== "fase")
      .map((col, index) => ({
        sourceColumn: index + 2, // +2 porque las dos primeras columnas son "labor" y "fase"
        type: "sum", // Puedes cambiar "sum" por otros como "average", "count", etc.
        destinationRow: data.length - 1, // Resumen al final de la tabla (última fila vacía)
        destinationColumn: index + 2,
        forceNumeric: true,
      }));
  };

  console.log("data",data)
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex justify-between ">
        <div className="flex">
          <DatePickerWithRange
            onDateChange={handleDateChange} // Pasar la función de manejo de fechas
            className="[&>button]:w-[260px]"
          />
          <Button variant="primary" onClick={generarEstructura}>
            Generar Estructura
          </Button>
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={descargarArchivo}
            className="ml-4"
          >
            Descargar Archivo
          </Button>
        </div>
      </div>
      <div className="overflow-auto flex-1">
        {data.length > 0 && columns.length > 0 && (
          <HotTable
            ref={hotTableComponent}
            language={esMX.languageCode}
            data={data}
            licenseKey="non-commercial-and-evaluation"
            colHeaders={columns.map((col) => col.title)}
            rowHeaders={true}
            columnSorting={true}
            mergeCells={true}
            contextMenu={true}
            readOnly={false}
            height="auto"
            width="auto"
            fixedColumnsStart={1}
            autoWrapRow={true}
            autoWrapCol={true}
            columns={[
              {
                title: "Labor",
                type: "text",
                data: "labor",
              },
              {
                title: "Fase",
                type: "text",
                data: "fase",
              },
              ...Object.keys(data[0])
                .filter((key) => key !== "labor" && key !== "fase")
                .map((fecha) => ({
                  title: fecha,
                  type: "numeric",
                  data: fecha,
                  numericFormat: {
                    pattern: "0,0.00", // Formato de número
                    culture: "en-US",
                  },
                })),
            ]}
            columnSummary={getColumnSummaries()} // Aplicar los resúmenes
          ></HotTable>
        )}
      </div>
    </div>
  );
}

export default GenerateTable;


{/* <div className="justify-start text-xs flex gap-2 text-left font-normal rounded-lg border px-2 py-1.5">
<CalendarIcon className="h-4 w-4 text-zinc-400" />
{date?.from ? (
  date.to ? (
    <>
      {format(date.from, "LLL dd, y")} -{" "}
      {format(date.to, "LLL dd, y")}
    </>
  ) : (
    format(date.from, "LLL dd, y")
  )
) : (
  <span className="text-zinc-400">Seleccione fecha</span>
)}
</div>
<div className="">
<Calendar
  initialFocus
  mode="range"
  defaultMonth={date?.from}
  selected={date}
  onSelect={handleDateChange}
  numberOfMonths={1}
/>
</div> */}

// <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-8"
//               >
//                 <div className="grid gap-3 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]">
//                   <div className="flex flex-col gap-4">
//                     <FormField
//                       control={form.control}
//                       name="title"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Título</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Ej. Planificador Setiembre"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormDescription>
//                             Este es el nombre del planificador
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="title"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Descripción</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Ej. Descripcion..."
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormDescription>
//                             Este es descripcion del planificador
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div className="grid gap-2 p-2 border border-zinc-100 ">
//                     <FormField
//                       control={form.control}
//                       name="dob"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col">
//                           <FormLabel>Date of birth</FormLabel>
//                           <FormControl>
//                             <div className="justify-start text-xs flex gap-2 text-left font-normal rounded-lg border px-2 py-1.5">
//                               <CalendarIcon className="h-4 w-4 text-zinc-400" />
//                               {date?.from ? (
//                                 date.to ? (
//                                   <>
//                                     {format(date.from, "LLL dd, y")} -{" "}
//                                     {format(date.to, "LLL dd, y")}
//                                   </>
//                                 ) : (
//                                   format(date.from, "LLL dd, y")
//                                 )
//                               ) : (
//                                 <span className="text-zinc-400">
//                                   Seleccione fecha
//                                 </span>
//                               )}
//                             </div>
//                           </FormControl>
//                           <Calendar
//                             mode="range"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             initialFocus
//                           />
//                           <FormDescription>
//                             La fecha se usa para calcular la cantidad de
//                             columnas
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit">Crear</Button>
//                 </DialogFooter>
//               </form>