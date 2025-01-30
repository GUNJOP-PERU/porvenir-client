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
            name: "Plan del dia",
            href: "/planDay",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/planDay",
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
            name: "Ciclos",
            href: "/cycle",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/cycle",
          },
          {
            name: "Actividades",
            href: "/activity",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/activity",
          },
        ],
      },
      {
        title: "Dashboard", 
        items: [
          {
            name: "Dashboard Turno",
            href: "/dashboard/turno",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/turno",
          },
          {
            name: "Dahboard Scoop",
            href: "/dashboard/scoop",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/scoop",
          },
          {
            name: "Dahboard Truck",
            href: "/dashboard/truck",
            icon: <IconDashboard className="w-4 h-4 fill-zinc-300" />,
            active: pathname === "/dashboard/truck",
          },
        ],
      },
    ],
    [pathname]
  );

  return paths;
};
