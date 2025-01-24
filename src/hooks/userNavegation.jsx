import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import IconDashboard from '../icons/IconDashboard';


export const useNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const paths = useMemo(
    () => [
      // {
      //   name: "Mensual",
      //   href: "/",
      //   icon: <IconDashboard />,
      //   active: pathname === "/",
      // },
      // {
      //   name: "Semanal",
      //   href: "/week",
      //   icon: <IconDashboard />,
      //   active: pathname === "/week",
      // },
      {
        name: "Diario",
        href: "/day",
        icon: <IconDashboard />,
        active: pathname === "/day",
      },
      {
        name: "Compañia",
        href: "/company",
        icon: <IconDashboard />,
        active: pathname === "/company",
      },
      {
        name: "Usuarios",
        href: "/users",
        icon: <IconDashboard />,
        active: pathname === "/users",
      },
     
      {
        name: "Vehiculos",
        href: "/vehicle",
        icon: <IconDashboard />,
        active: pathname === "/vehicle",
      },
      {
        name: "Frente de Labor",
        href: "/frontLabor",
        icon: <IconDashboard />,
        active: pathname === "/frontLabor",
      },
      {
        name: "Plan del dia",
        href: "/planDay",
        icon: <IconDashboard />,
        active: pathname === "/planDay",
      },
      {
        name: "Orden de Trabajo",
        href: "/workOrder",
        icon: <IconDashboard />,
        active: pathname === "/workOrder",
      },
      {
        name: "Checklist",
        href: "/checklist",
        icon: <IconDashboard />,
        active: pathname === "/checklist",
      },
      
     
     
      {
        name: "Ciclos",
        href: "/cycle",
        icon: <IconDashboard />,
        active: pathname === "/cycle",
      },
      {
        name: "Actividades",
        href: "/activity",
        icon: <IconDashboard />,
        active: pathname === "/activity",
      },
     
    ],
    [pathname]
  );

  return paths;
};
