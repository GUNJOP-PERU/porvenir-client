import { useForm } from "react-hook-form";
import { z } from "zod";
import { RefreshCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFetchData } from "@/hooks/useGlobalQuery";
import { useHandleFormSubmit } from "@/hooks/useMutation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useAuthStore } from "@/store/AuthStore";

const FormSchema = z.object({
  value: z
    .string()
    .min(1, { message: "El prefijo es obligatorio" })
    .max(5, { message: "Máximo 5 caracteres" })
    .transform((val) => val.replace(/\s+/g, "")),
});

const PrefixTeam = () => {
  const prefix = useAuthStore((s) => s.settings.prefix);
  const setSetting = useAuthStore((s) => s.setSetting);

  const [loadingGlobal, setLoadingGlobal] = useState(false);

  const {
    data = [],
    isFetching,
    refetch,
  } = useFetchData(
    "config-group-week-prefix",
    "config-group-week?type=operative&isActive=true",
  );

  const handleFormSubmit = useHandleFormSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { value: "" },
  });

  const startRecord = data.find((item) => item.key === "prefix");
  useEffect(() => {
    if (startRecord?.value) {
      reset({ value: startRecord.value });
    }
  }, [startRecord, reset]);

  const onSubmit = async (formData) => {
    await handleFormSubmit({
      isEdit: true,
      endpoint: "config-group-week",
      id: startRecord.id,
      data: {
        value: formData.value,
      },
      setLoadingGlobal,
      refetch: undefined,
      onSuccess: () => {
        setSetting("prefix", formData.value);
      },
    });
  };

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-zinc-800">
            Configuración de Prefijo Equipo
          </h1>
          <p className="text-xs text-zinc-400">
            Define el prefijo para los códigos de equipo.
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
            disabled={isFetching || loadingGlobal}
          >
            <Save className="w-4 h-4 mr-1" /> Guardar
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-600">
          Prefijo del equipo
        </label>
        <Input
          type="text"
          {...register("value", {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          })}
          disabled={isFetching || loadingGlobal}
        />
        <div>
          {errors.value && (
            <p className="text-xs text-red-500">{errors.value.message}</p>
          )}
          <p className="text-xs text-blue-800 leading-4">
            El prefijo se usará para generar los códigos de equipo.
          </p>
        </div>
      </div>
      {/* <span>{prefix}-26</span> */}
    </div>
  );
};

export default PrefixTeam;
