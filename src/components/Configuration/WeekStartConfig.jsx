import { useForm } from "react-hook-form";
import { RefreshCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchData } from "@/hooks/useGlobalQuery";
import { useHandleFormSubmit } from "@/hooks/useMutation";
import { useState } from "react";

const DAYS = [
  { v: 1, l: "Lunes" },
  { v: 2, l: "Martes" },
  { v: 3, l: "Miércoles" },
  { v: 4, l: "Jueves" },
  { v: 5, l: "Viernes" },
  { v: 6, l: "Sábado" },
  { v: 0, l: "Domingo" },
];

const WeeklyBoundaryConfig = () => {
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const {
    data = [],
    isFetching,
    refetch,
  } = useFetchData(
    "config-group-week-week",
    "config-group-week?type=week&isActive=true",
  );

  const handleFormSubmit = useHandleFormSubmit();

  const { setValue, watch, handleSubmit } = useForm({
    defaultValues: { start: "1" },
  });

  const startValue = watch("start");

  const list = data;
  const startRecord = list.find((item) => item.key === "start");
  const endRecord = list.find((item) => item.key === "end");
  const initialStart = startRecord?.value ?? "1";
  const currentStart = startValue || initialStart;
  const startNum = parseInt(currentStart || "1");
  const endNum = startNum === 1 ? 0 : startNum - 1;


  const onSubmit = async (values) => {
    const startDay = parseInt(values.start || initialStart);
    const endDay = startDay === 1 ? 0 : startDay - 1;

    const startUpdate = {
      ...startRecord,
      value: startDay.toString(),
      valueType: "number",
    };
    const endUpdate = {
      ...endRecord,
      value: endDay.toString(),
      valueType: "number",
    };

    await handleFormSubmit({
      isEdit: true,
      endpoint: "config-group-week",
      id: startRecord.id,
      data: startUpdate,
      setLoadingGlobal,
      refetch: undefined,
      onSuccess: undefined,
    });

    await handleFormSubmit({
      isEdit: true,
      endpoint: "config-group-week",
      id: endRecord.id,
      data: endUpdate,
      setLoadingGlobal,
      refetch,
      onSuccess: undefined,
    });
  };

  const getDayLabel = (val) => DAYS.find((d) => d.v === parseInt(val))?.l;

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-zinc-800">Configuración de Gráficos</h1>
          <p className="text-xs text-zinc-400">
            Define el ciclo de 7 días para tus reportes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw className={`w-4 h-4 ${isFetching && "animate-spin"}`} />
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isFetching}
          >
            <Save className="w-4 h-4 mr-2" /> Guardar
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-600">
          Día de inicio de semana
        </label>
        <Select
          value={currentStart}
          onValueChange={(val) => setValue("start", val)}
          disabled={loadingGlobal || isFetching}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((day) => (
              <SelectItem key={day.v} value={day.v.toString()}>
                {day.l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 leading-4">
            Los datos se agruparán semanalmente empezando los{" "}
            <strong>{getDayLabel(startNum)}</strong> y finalizando los{" "}
            <strong>{getDayLabel(endNum)}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBoundaryConfig;
