import { PlanBody } from "@/components/Management/PlanMonth/PlanBody";
import { useParams } from "react-router-dom";
import { useFetchData } from "@/hooks/useGlobalQuery";
import IconLoader from "@/icons/IconLoader";

export default function PlanNewEdit() {
  const { mode, id } = useParams();
  const isEdit = Boolean(id && id !== "new");

  const configByMode = {
    weekly: {
      apiBase: "planWeek",
      apiCreate: "planWeek",
      title: "Plan Semanal",
      refreshQueryKey: ["crud", "planWeek"],
      ruteReturn: "/planWeek",
      downloadTemplate: "/ExcelModelo/Modelo_Semanal.xlsx",
    },
    monthly: {
      apiBase: "planMonth",
      apiCreate: "planMonth/many",
      title: "Plan Mensual",
      refreshQueryKey: ["crud", "planMonth"],
      ruteReturn: "/planMonth",
      downloadTemplate: "/ExcelModelo/Modelo_Mensual.xlsx",
    },
  };

  const config = configByMode[mode] ?? configByMode.monthly;

  const { data, isLoading } = useFetchData(
    isEdit ? `${config.apiBase}-${id}` : null,
    isEdit ? `${config.apiBase}/${id}` : null,
    { enabled: isEdit },
  );

  if (isEdit && isLoading)
    return (
      <div className="flex flex-col items-center gap-1 justify-center h-full p-4">
        <IconLoader className="size-8" />
        <span className="text-[8px] text-zinc-300"> Cargando...</span>
      </div>
    );

  return (
    <PlanBody
      mode={mode}
      isEdit={isEdit}
      initialData={data}
      api={{
        create: config.apiCreate,
        update: `${config.apiBase}/:id`,
      }}
      title={config.title}
      refreshQueryKey={config.refreshQueryKey}
      ruteReturn={config.ruteReturn}
      downloadTemplate={config.downloadTemplate}
    />
  );
}
