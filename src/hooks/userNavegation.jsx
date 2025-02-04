import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import IconDashboard from '../icons/IconDashboard';


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
            name: "Plan Semanal",
            href: "/planWeek",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/planWeek",
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
            name: " Truck",
            href: "/dashboard/truck",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/truck",
          },
          {
            name: " Scoop",
            href: "/dashboard/scoop",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/scoop",
          },
          {
            name: " Mensual",
            href: "/dashboard/month",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/month",
          },
          {
            name: " Turno",
            href: "/dashboard/turno",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/turno",
          },
        ],
      },
    ],
    [pathname]
  );

  return paths;
};
