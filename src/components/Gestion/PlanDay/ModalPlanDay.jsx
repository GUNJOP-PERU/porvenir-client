import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/useGlobalQuery";
import IconClose from "@/icons/IconClose";
import IconLoader from "@/icons/IconLoader";
import { postDataRequest } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CircleFadingPlus, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlanContent } from "./PlanContent";
import { PlanHeader } from "./PlanHeader";
import IconWarning from "@/icons/IconWarning";

const FormSchema = z.object({
  dob: z.date({ required_error: "*Se requiere una fecha." }),
  shift: z.string().min(2, { message: "*Turno." }),
  selectedItems: z.array(z.string()).nonempty({ message: "*Labor." }),
});

export const ModalPlanDay = ({ isOpen, onClose, isEdit }) => {
  const [dataHotTable, setDataHotTable] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { data: dataLaborList } = useFetchData("frontLabor", "frontLabor");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: new Date(),
      selectedItems: [],
      shift: "",
    },
  });
  // Cambiar la fecha sin perder valores previos
  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD").toUpperCase();
    setDataHotTable((prevData) =>
      prevData.map((row) => {
        const oldDateKey = Object.keys(row).find((key) =>
          key.match(/^\d{4}-\d{2}-\d{2}$/)
        );

        if (!oldDateKey) return row;

        const { [oldDateKey]: oldValue, ...rest } = row;
        return { ...rest, [formattedDate]: oldValue };
      })
    );
  };

  // Añadir nuevas labores sin eliminar las existentes
  const handleAddLabor = (newItems) => {
    setDataHotTable((prevData) => {
      const existingLabors = prevData.map((row) => row.labor);
      const formattedDate = dayjs(form.getValues().dob)
        .format("YYYY-MM-DD")
        .toUpperCase();

      const newLabors = newItems
        .filter((item) => !existingLabors.includes(item))
        .map((labor) => ({
          labor,
          fase: "Extracción / Producción",
          [formattedDate]: Math.floor(Math.random() * 100) * 100,
        }));

      return [...prevData, ...newLabors];
    });
  };

  // Eliminar labores que ya no estén seleccionadas
  const handleRemoveLabor = (selectedItems) => {
    setDataHotTable((prevData) =>
      prevData.filter((row) => selectedItems.includes(row.labor))
    );
  };

  // ✅ Calcular el total de toneladas
  const calculateTotal = () => {
    if (!dataHotTable || dataHotTable.length === 0) return 0;

    return dataHotTable.reduce((total, row) => {
      const tonnageValues = Object.keys(row)
        .filter((key) => key.match(/^\d{4}-\d{2}-\d{2}$/))
        .map((fecha) => row[fecha] || 0);

      return total + tonnageValues.reduce((sum, tonnage) => sum + tonnage, 0);
    }, 0);
  };

  const totalTonnage = calculateTotal();

  const onSubmit = (data) => {
    setLoadingGlobal(true);
    console.log(data);
    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      handleDateChange(data.dob);
      handleAddLabor(data.selectedItems);
      handleRemoveLabor(data.selectedItems);
      setLoadingGlobal(false);
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
        shift: shift,
      }));
    });
    console.log("Datos Finales:", datosFinales);

    try {
      const response = await postDataRequest("planDay/many", datosFinales);

      if (response.status >= 200 && response.status < 300) {
        alert("Datos enviados con éxito!");
      } else {
        alert("Error al enviar los datos.");
      }

      if (onClose) onClose();
      form.reset();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al enviar los datos.");
    } finally {
      setLoadingGlobal(false); // Detener indicador de carga
    }
  };

  const handleCancel = () => {
    if (onClose) onClose(); // Cerrar el modal
    form.reset(); // Restablecer los valores del formulario
    setDataHotTable([]); // Limpiar la tabla de datos
    setLoadingGlobal(false); // Detener cualquier indicador de carga
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(onClose) => !loadingGlobal && onClose}
      modal={true}
    >
      <DialogContent className="w-[570px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <CircleFadingPlus className="w-6 h-6 text-zinc-300" />
            <div>
              <DialogTitle>Crear nuevo</DialogTitle>
              <DialogDescription>
                Ingresar los datos necesarios para la creación y enviar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-7">
          <PlanHeader
            form={form}
            onSubmit={onSubmit}
            dataLaborList={dataLaborList}
            hasData={dataHotTable.length > 0}
            loadingGlobal={loadingGlobal}
          />
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-base font-extrabold leading-5">
                Planificación /{" "}
                <strong className="font-extrabold capitalize">
                  {" "}
                  {dayjs(form.watch("dob")).format("DD MMMM")}
                </strong>
              </h1>
              <span className="text-2xl font-extrabold">
                {totalTonnage.toLocaleString("es-MX")} tn
              </span>
            </div>
            {showLoader ? (
              <div className="text-center py-4 text-zinc-500 h-[27.5vh] flex items-center justify-center ">
                <span className="flex flex-col gap-2 items-center">
                  <IconLoader className="w-5 h-5 text-zinc-300 fill-primary animate-spin" />
                </span>
              </div>
            ) : dataHotTable.length === 0 ? (
              <div className="text-center text-zinc-400 h-[27.5vh] flex items-center justify-center ">
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
            <div className="  bg-[#F0BB33]/20 w-full rounded-xl px-4 py-2.5 flex gap-1 text-[#BC9021]  text-[11px] leading-4">
              <IconWarning className="text-[#BC9021]  w-5 h-5 mr-1.5" />
              <div className="flex items-center">
                <ul className="list-disc ml-3 gap-x-6 ">
                  <li>
                    Para <strong>añadir</strong> una labor, seleccione un ítem
                    en el botón
                    <span className="font-semibold"> "Labor"</span> y haga clic
                    en <strong>Actualizar</strong>.
                  </li>
                  <li>
                    Para <strong>eliminar</strong> una labor, quite la selección
                    y luego haga clic en <strong>Actualizar</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
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
      </DialogContent>
    </Dialog>
  );
};
