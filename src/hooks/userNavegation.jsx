import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconDashboard from "../icons/IconDashboard";

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
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/company",
          },
          {
            name: "Usuarios",
            href: "/users",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/users",
          },
          {
            name: "Vehiculos",
            href: "/vehicle",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/vehicle",
          },
          {
            name: "Frente de Labor",
            href: "/frontLabor",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/frontLabor",
          },
          {
            name: "Plan Diario",
            href: "/planDay",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/planDay",
          },

          {
            name: "Plan Mensual",
            href: "/planMonth",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/planMonth",
          },
          {
            name: "Orden de Trabajo",
            href: "/workOrder",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/workOrder",
          },
          {
            name: "Checklist",
            href: "/checklist",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/checklist",
          },
          {
            name: "Ciclo Truck",
            href: "/cycleTruck",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/cycleTruck",
          },
          {
            name: "Ciclo Scoop",
            href: "/cycleScoop",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/cycleScoop",
          },
          {
            name: "Actividades Truck",
            href: "/activityTruck",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/activityTruck",
          },
          {
            name: "Actividades Scoop",
            href: "/activityScoop",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/activityScoop",
          },
        ],
      },
      {
        title: "Dashboard",
        items: [
          {
            name: "Producción Truck",
            href: "/dashboard/productionTruck",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionTruck",
          },

          {
            name: "Producción Scoop",
            href: "/dashboard/productionScoop",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionScoop",
          },
          {
            name: "Pareto Truck",
            href: "/dashboard/paretoTruck",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/paretoTruck",
          },
          {
            name: "Pareto Scoop",
            href: "/dashboard/paretoScoop",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/paretoScoop",
          },
          {
            name: "Producción Mensual",
            href: "/dashboard/productionMonth",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionMonth",
          },
          {
            name: "Utilización y Velocidad",
            href: "/dashboard/productionUV",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/productionUV",
          },
        ],
      },
    ],
    [pathname]
  );

  return paths;
};
