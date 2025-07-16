import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconCompany from "@/icons/Dashboard/IconCompany";
import IconUsers from "@/icons/Dashboard/IconUsers";
import IconVehicle from "@/icons/Dashboard/IconVehicle";
import IconLabor from "@/icons/Dashboard/IconLabor";
import IconPlan from "@/icons/Dashboard/IconPlan";
import IconWork from "@/icons/Dashboard/IconWork";
import IconChecklist from "@/icons/Dashboard/IconChecklist";
import IconCycle from "@/icons/Dashboard/IconCycle";
import IconActivity from "@/icons/Dashboard/IconActivity";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import IconDash2 from "@/icons/Dashboard/IconDash2";
import IconDash3 from "@/icons/Dashboard/IconDash3";
import IconDash4 from "@/icons/Dashboard/IconDash4";
import IconDash5 from "@/icons/Dashboard/IconDash5";
import IconDash6 from "@/icons/Dashboard/IconDash6";
import IconTimeline from "@/icons/Dashboard/IconTimeline";
import IconWeight from "@/icons/Dashboard/IconWeight";

export const useNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const paths = useMemo(
    () => [
      {
        title: "Gestión",
        items: [
          {
            name: "Compañia",
            href: "/company",
            icon: <IconCompany className="w-4 h-4 " />,
            active: pathname === "/company",
          },
          {
            name: "Usuarios",
            href: "/users",
            icon: <IconUsers className="w-4 h-4 " />,
            active: pathname === "/users",
          },
          {
            name: "Vehiculos",
            href: "/vehicle",
            icon: <IconVehicle className="w-4 h-4 " />,
            active: pathname === "/vehicle",
          },
          {
            name: "Destino",
            href: "/destiny",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/destiny",
          },
          {
            name: "Frente de Labor",
            href: "/labor",
            icon: <IconLabor className="w-4 h-4 " />,
            active: pathname === "/labor",
          },
          {
            name: "Plan Diario",
            href: "/planDay",
            icon: <IconPlan className="w-4 h-4 " />,
            active: pathname === "/planDay",
          },

          {
            name: "Plan Mensual",
            href: "/planMonth",
            icon: <IconPlan className="w-4 h-4 " />,
            active: pathname === "/planMonth",
          },
          {
            name: "Trabajos planificados",
            href: "/workOrder",
            icon: <IconWork className="w-4 h-4 " />,
            active: pathname === "/workOrder",
          },
          {
            name: "Checklist",
            href: "/checklist",
            icon: <IconChecklist className="w-4 h-4 " />,
            active: pathname === "/checklist",
          },
          {
            name: "Ciclo Truck",
            href: "/cycleTruck",
            icon: <IconCycle className="w-4 h-4 " />,
            active: pathname === "/cycleTruck",
          },
          {
            name: "Ciclo Scoop",
            href: "/cycleScoop",
            icon: <IconCycle className="w-4 h-4 " />,
            active: pathname === "/cycleScoop",
          },
          {
            name: "Actividades Truck",
            href: "/activityTruck",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/activityTruck",
          },
          {
            name: "Actividades Scoop",
            href: "/activityScoop",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/activityScoop",
          },
          {
            name: "Incidencias Truck | Scoop",
            href: "/incidence",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/incidence",
          },
          {
            name: "Ubicaciones",
            href: "/ubications",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/ubications",
          },
          {
            name: "Beacon",
            href: "/beacon",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/beacon",
          },
          {
            name: "WAP",
            href: "/wap",
            icon: <IconActivity className="w-4 h-4 " />,
            active: pathname === "/wap",
          },
        ],
      },
      {
        title: "Análisis",
        items: [
          {
            name: "Producción Truck",
            href: "/",
            icon: <IconDash1 className="w-4 h-4 " />,
            active: pathname === "/",
          },

          {
            name: "Producción Scoop",
            href: "/dashboard/productionScoop",
            icon: <IconDash2 className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionScoop",
          },
          {
            name: "Timeline Scoop",
            href: "/dashboard/timelineScoop",
            icon: <IconTimeline className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/timelineScoop",
          },
          {
            name: "Timeline Truck",
            href: "/dashboard/timelineTruck",
            icon: <IconTimeline className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/timelineTruck",
          },
          {
            name: "Pareto Truck",
            href: "/dashboard/paretoTruck",
            icon: <IconDash3 className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/paretoTruck",
          },
          {
            name: "Pareto Scoop",
            href: "/dashboard/paretoScoop",
            icon: <IconDash4 className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/paretoScoop",
          },
          {
            name: "Producción Mensual",
            href: "/dashboard/productionMonth",
            icon: <IconDash5 className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionMonth",
          },
          {
            name: "Utilización y Velocidad",
            href: "/dashboard/productionUV",
            icon: <IconDash6 className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionUV",
          },
        ],
      },
    ],
    [pathname]
  );

  return paths;
};
