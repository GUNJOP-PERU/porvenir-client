import { useFetchData } from "@/hooks/useGlobalQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CircleFadingPlus, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import { postDataRequest } from "@/lib/api";

import { PlanContent } from "@/components/Gestion/PlanMonth/PlanContent";
import { PlanHeader } from "@/components/Gestion/PlanMonth/PlanHeader";
import IconWarning from "@/icons/IconWarning";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  dob: z
    .object({
      start: z.date().refine((val) => !isNaN(val.getTime()), {
        message: "*Fecha de inicio inválida.",
      }),
      end: z.date().refine((val) => !isNaN(val.getTime()), {
        message: "*Fecha de fin inválida.",
      }),
    })
    .refine((data) => data.start <= data.end, {
      message: "*La fecha de inicio no puede ser posterior a la fecha de fin.",
      path: ["start"], // Error en el campo start si la fecha de inicio es mayor que la de fin
    }),
  shift: z.string().min(2, { message: "*Turno." }),
  selectedItems: z.array(z.string()).optional(),
});

export const NewPlanMonth = ( ) => {
  const navigate = useNavigate();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const { data: dataLaborList } = useFetchData("frontLabor", "frontLabor");
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
      selectedItems: [],
      shift: "", // El valor para el turno (shift) es por defecto vacío
    },
  });

  const generarEstructura = (dob, selectedItems) => {
    // Validar que las fechas existan
    if (!dob?.start || !dob?.end) {
      alert("Debe seleccionar una fecha válida.");
      return { data: [] };
    }

    const startDate = dayjs(dob.start);
    const endDate = dayjs(dob.end);
    const daysInMonth = endDate.diff(startDate, "day") + 1;

    // Si `selectedItems` está vacío, generamos una fila vacía
    const items =
      Array.isArray(selectedItems) && selectedItems.length > 0
        ? selectedItems
        : [""];

    const exampleData = items.map((labor, index) => {
      let row = {
        labor, // Si `selectedItems` estaba vacío, esto será ""
        fase: index % 2 === 0 ? "Extracción / Producción" : "Avance",
      };

      // Generar columnas para cada día del rango de fechas
      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = startDate
          .add(i, "day")
          .format("DD-MM")
          .toUpperCase();
        row[currentDate] = Math.floor(Math.random() * 100) * 100; // Datos aleatorios
      }

      return row;
    });

    return { data: exampleData };
  };

  const onSubmit = (data) => {
    setLoadingGlobal(true);
    console.log(data);
    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      const generatedData = generarEstructura(data.dob, data.selectedItems);
      if (generatedData) {
        setDataHotTable(generatedData.data);
      }
      setLoadingGlobal(false);
    }, 1500);
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);
    const { shift } = form.getValues();

    const tieneCamposVacios = dataHotTable.some(
      (row) => !row.labor || !row.fase
    );

    const laborCounts = dataHotTable.reduce((acc, row) => {
      acc[row.labor] = (acc[row.labor] || 0) + 1;
      return acc;
    }, {});
    const tieneRepetidos = Object.values(laborCounts).some((count) => count > 1);


    if (tieneCamposVacios) {
      alert("Error: Hay filas con 'Labor' o 'Fase' vacías en la tabla.");
      setLoadingGlobal(false);
      return;
    }

    if (tieneRepetidos) {
      alert("Error: Existen labores repetidas. Corrige antes de continuar.");
      setLoadingGlobal(false);
      return;
    }

    const datosFinales = dataHotTable.flatMap((row) => {
      const fechas = Object.keys(row).filter((key) =>
        key.match(/^\d{4}-\d{2}-\d{2}$/)
      );

      return fechas.map((fecha) => ({
        frontLabor: row.labor,
        phase: row.fase,
        date: fecha,
        tonnage: row[fecha],
        shift: shift,
      }));
    });
    const totalTonnage = datosFinales.reduce((sum, item) => sum + item.tonnage, 0);

    const laborsUnicos = [
      ...new Set(datosFinales.map((item) => item.frontLabor)),
    ].map((labor) => ({
      name: labor, 
      status: true, 
    }));

    // console.log("Datos Finales:",datosFinales );
    // console.log("Labors:",  laborsUnicos);

    console.log("Total Tonnage:", dataHotTable);
    
    try {
      const response = await postDataRequest("planMonth", datosFinales);

      if (response.status >= 200 && response.status < 300) {
        alert("Datos enviados con éxito!");
      } else {
        alert("Error al enviar los datos.");
      }
      if (reset) reset();
      navigate("/planMonth");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar los datos.");
    } finally {
      setLoadingGlobal(false); // Detener indicador de carga
    }
  };

  const handleCancel = () => {
    form.reset(); // Restablecer los valores del formulario
    setDataHotTable([]); // Limpiar la tabla de datos
    setLoadingGlobal(false); // Detener cualquier indicador de carga
    navigate("/planMonth");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 items-center">
        <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
        <div>
          <h1 className="text-[15px] font-semibold leading-none">
            Crear plan del mes
          </h1>
          <h4 className="text-[12px] text-muted-foreground">
            Ingresar los datos necesarios para la creación y enviar"
          </h4>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <PlanHeader
          form={form}
          onSubmit={onSubmit}
          dataLaborList={dataLaborList}
          hasData={dataHotTable.length > 0}
          loadingGlobal={loadingGlobal}
        />
        <div className="flex flex-col gap-3 z-0">
          <div>
            <h1 className="text-base font-extrabold leading-5">
              Planificador Mensual / Enero 2025
            </h1>
          </div>
          {showLoader ? (
            <div className="text-center py-4 text-zinc-500 h-[60vh] flex items-center justify-center ">
              <span className="flex flex-col gap-2 items-center">
                <IconLoader className="w-5 h-5 text-zinc-300 fill-primary animate-spin" />
              </span>
            </div>
          ) : dataHotTable.length === 0 ? (
            <div className="text-center text-zinc-400 h-[60vh] flex items-center justify-center ">
              <span className="text-xs">Datos no creados</span>
            </div>
          ) : (
            <PlanContent
              dataHotTable={dataHotTable}
              dataLaborList={dataLaborList}
              setDataHotTable={setDataHotTable}
              loadingGlobal={loadingGlobal}
            />
          )}
        </div>
      </div>
      <div className="flex gap-3 justify-between">
        <div>
          <div className="bg-[#F0BB33]/20 w-fit rounded-xl px-6 py-2.5 flex gap-1 text-[#BC9021]  text-[11px] leading-4 mt-4 ">
            <IconWarning className="text-[#BC9021]  w-5 h-5 mr-1.5" />
            <div className="flex items-center">
              <ul className="list-disc ml-3 gap-x-6 ">
                <li className="text-green-700">
                  {" "}
                  <strong className="font-bold text-green-500">Verde</strong>:
                  Labor reconocida en la lista.
                </li>
                <li className="text-red-700">
                  <strong className="font-bold text-red-600">Rojo</strong>:
                  Labor no reconocida en la lista.
                </li>
                <li>
                  {" "}
                  <strong className="font-bold bg-yellow-300">Amarillo</strong>:
                  Labor repetida en el mes.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loadingGlobal}
          >
            <IconClose className="fill-zinc-400/50 w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSendData}
            disabled={dataHotTable.length === 0 || loadingGlobal} // 🔥 Deshabilitar el botón si no hay datos
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4 text-zinc-200 fill-primary animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                Enviar Plan
                <SendHorizontal className="text-background w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
