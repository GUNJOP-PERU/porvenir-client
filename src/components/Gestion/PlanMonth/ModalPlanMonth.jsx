import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CircleFadingPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PlanHeader } from "./PlanHeader";
import IconLoader from "@/icons/IconLoader";
import { Button } from "@/components/ui/button";
import IconClose from "@/icons/IconClose";
import IconToggle from "@/icons/IconToggle";
import { postDataRequest } from "@/api/api";

import { dataLaborList } from "@/lib/data";
import { PlanContent } from "./PlanContent";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
  dob: z.object({
    start: z.date().refine((val) => !isNaN(val.getTime()), {
      message: "*Fecha de inicio inválida.",
    }),
    end: z.date().refine((val) => !isNaN(val.getTime()), {
      message: "*Fecha de fin inválida.",
    }),
  }).refine((data) => data.start <= data.end, {
    message: "*La fecha de inicio no puede ser posterior a la fecha de fin.",
    path: ["start"], // Error en el campo start si la fecha de inicio es mayor que la de fin
  }),
  shift: z.string().min(2, { message: "*Turno." }),
  selectedItems: z
    .array(z.string())
    .nonempty({ message: "*Labor." }),
});

export const ModalPlanMonth = ({ isOpen, onClose, isEdit }) => {
  const queryClient = useQueryClient();
  const [dataHotTable, setDataHotTable] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);


  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 
      },
      selectedItems: [],
      shift: "", 
    },
  });
  
  const generarEstructura = (dob, selectedItems) => {
    if (!dob || !selectedItems.length) {
      alert("Debe seleccionar fecha y labores.");
      return;
    }
  
    const startDate = dayjs(dob.start);
    const endDate = dayjs(dob.end);
    const daysInMonth = endDate.diff(startDate, "day") + 1;
  
    const exampleData = selectedItems.map((labor, index) => {
      let row = {
        labor,
        fase: index % 2 === 0 ? "Extracción / Producción" : "Avance",
      };
  
      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = startDate.add(i, "day").format("YYYY-MM-DD").toUpperCase();
        row[currentDate] = Math.floor(Math.random() * 100) * 100;
      }
  
      return row;
    });
  
    return { data: exampleData };
  };
  

  const onSubmit = (data) => {
   
    setShowLoader(true); 

    setTimeout(() => {
      setShowLoader(false);
      const generatedData = generarEstructura(data.dob, data.selectedItems);
      if (generatedData) {
        setDataHotTable(generatedData.data);
      }
    }, 1500);
  };

  const handleSendData = async () => {
    setLoadingGlobal(true);
    const { shift } = form.getValues();

    const datosFinales = dataHotTable.flatMap((row) => {
      const fechas = Object.keys(row).filter((key) =>
        key.match(/^\d{4}-\d{2}-\d{2}$/)
      );

      return fechas.map((fecha) => ({
        frontLabor: row.labor,
        phase: row.fase,
        date: fecha,
        tonnage: row[fecha],
        shift: shift, // Utilizar el valor del turno obtenido desde el formulario
      }));
    });
    console.log("Datos Finales:", datosFinales);

    try {
      const response = await postDataRequest("planDay/many", datosFinales);

      if (response.status >= 200 && response.status < 300) {
        alert("Datos enviados con éxito!");
        queryClient.invalidateQueries( {queryKey: ["crud","planDay"] });
      } else {
        alert("Error al enviar los datos.");
      }
      if (onClose) onClose();
      if (reset) reset();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar los datos.");
    } finally {
      setLoadingGlobal(false); // Detener indicador de carga
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[90%]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>Crear plan del mes</DialogTitle>
              <DialogDescription>"Ingrese los detalles"</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <PlanHeader
            form={form}
            onSubmit={onSubmit}
            dataLaborList={dataLaborList}
            hasData={dataHotTable.length > 0}
          />
          {showLoader ? (
            <div className="text-center py-4 text-zinc-500 h-[47vh] flex items-center justify-center ">
              <span className="flex flex-col gap-2 items-center">
                <IconLoader className="w-5 h-5 " />
              </span>
            </div>
          ) : dataHotTable.length === 0 ? (
            <div className="text-center text-zinc-400 h-[47vh] flex items-center justify-center ">
              <span className="text-xs">Sin datos disponibles</span>
            </div>
          ) : (
            <PlanContent
              dataHotTable={dataHotTable}
              dataLaborList={dataLaborList}
              setDataHotTable={setDataHotTable}
            />
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            <IconClose className="fill-zinc-400/50 w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSendData}
            disabled={dataHotTable.length === 0 || loadingGlobal} 
          >
            {loadingGlobal ? (
              <>
                <IconLoader className="w-4 h-4" />
                Cargando...
              </>
            ) : (
              <>
                <IconToggle className="text-background w-4 h-4" />
                Enviar Plan del Día
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
