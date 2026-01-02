import { PlanBody } from "@/components/Management/PlanMonth/PlanBody";
import { useParams } from "react-router-dom";

export default function PlanNew() {
  const { mode } = useParams();

  const safeMode =
    mode === "weekly" || mode === "monthly" ? mode : "monthly";

  const config = {
    weekly: {
      api: { create: "planWeek", update: "planWeek/:id" },
      title: "Plan Semanal",
      dateSelector: "week",
      refreshQueryKey: ["crud", "planWeek"],
    },
    monthly: {
      api: { create: "planMonth", update: "planMonth/:id" },
      title: "Plan Mensual",
      dateSelector: "month",
      refreshQueryKey: ["crud", "planMonth"],
    },
  }[safeMode];

  return (
    <PlanBody
      mode={safeMode}
      api={config.api}
      dateSelector={config.dateSelector}
      title={config.title}
      refreshQueryKey={config.refreshQueryKey}
    />
  );
}
